#!/bin/bash

DOMAIN="pixicrm.barmagiat.com"
EMAIL="tools@mijra.io"
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"

echo "🔒 SSL Management for $DOMAIN (Production)"
echo "============================================="

# Create required directories
create_directories() {
    echo "📁 Creating required directories..."
    mkdir -p ./letsencrypt/www/.well-known/acme-challenge
    mkdir -p ./letsencrypt/live
    mkdir -p ./letsencrypt/archive
    mkdir -p ./logs/nginx
    mkdir -p ./logs/certbot
    mkdir -p ./scripts
    echo "✅ Directories created"
}

# Initialize SSL certificates
init_ssl() {
    echo "🔧 Initializing SSL setup..."
    create_directories

    # Copy init script
    cat > ./scripts/init-ssl.sh << 'EOF'
#!/bin/sh
DOMAIN="pixicrm.barmagiat.com"
CERT_DIR="/etc/letsencrypt/live/$DOMAIN"
mkdir -p "$CERT_DIR"
openssl genrsa -out "$CERT_DIR/privkey.pem" 4096
openssl req -new -x509 -key "$CERT_DIR/privkey.pem" \
    -out "$CERT_DIR/fullchain.pem" -days 30 \
    -subj "/C=US/ST=State/L=City/O=Temp/CN=$DOMAIN"
chmod 644 "$CERT_DIR/fullchain.pem"
chmod 600 "$CERT_DIR/privkey.pem"
echo "Temporary certificates created for $DOMAIN"
EOF

    chmod +x ./scripts/init-ssl.sh

    # Run SSL initialization
    docker-compose $COMPOSE_FILES --profile init up ssl-init

    if [ $? -eq 0 ]; then
        echo "✅ SSL initialization complete"
    else
        echo "❌ SSL initialization failed"
        return 1
    fi
}

# Start services
start_services() {
    echo "🚀 Starting services..."
    docker-compose $COMPOSE_FILES up -d nginx app_php

    if [ $? -eq 0 ]; then
        echo "✅ Services started successfully"
        echo "🌐 Application accessible at:"
        echo "   HTTP:  http://$(curl -s ifconfig.me):8080"
        echo "   HTTPS: https://$(curl -s ifconfig.me):8443 (self-signed)"
    else
        echo "❌ Failed to start services"
        return 1
    fi
}

# Test ACME challenge
test_acme() {
    echo "🧪 Testing ACME challenge accessibility..."

    # Create test file
    TEST_TOKEN="test-$(date +%s)"
    echo "$TEST_TOKEN" > "./letsencrypt/www/.well-known/acme-challenge/test-challenge"

    sleep 3

    # Test locally first
    if curl -f "http://localhost:8080/.well-known/acme-challenge/test-challenge" 2>/dev/null | grep -q "$TEST_TOKEN"; then
        echo "✅ Local ACME challenge test passed"
    else
        echo "❌ Local ACME challenge test failed"
        echo "🔍 Checking nginx logs..."
        docker-compose $COMPOSE_FILES logs --tail=10 nginx
        rm -f "./letsencrypt/www/.well-known/acme-challenge/test-challenge"
        return 1
    fi

    # Test via domain (if accessible)
    SERVER_IP=$(curl -s ifconfig.me)
    if curl -f "http://$SERVER_IP:8080/.well-known/acme-challenge/test-challenge" 2>/dev/null | grep -q "$TEST_TOKEN"; then
        echo "✅ External ACME challenge test passed"
    else
        echo "⚠️  External ACME challenge test failed (may need port forwarding)"
        echo "ℹ️  For Let's Encrypt to work, port 80 must be accessible from internet"
    fi

    # Clean up test file
    rm -f "./letsencrypt/www/.well-known/acme-challenge/test-challenge"
}

# Get real SSL certificates
get_real_certificates() {
    echo "🔐 Getting real SSL certificates..."

    # First test if ACME challenge works
    if ! test_acme; then
        echo "❌ ACME challenge test failed. Cannot proceed with certificate generation."
        return 1
    fi

    # Remove temporary certificates
    echo "🗑️  Removing temporary certificates..."
    rm -rf "./letsencrypt/live/$DOMAIN"
    rm -rf "./letsencrypt/archive/$DOMAIN"

    # Get real certificates
    echo "📞 Requesting certificates from Let's Encrypt..."
    docker-compose $COMPOSE_FILES run --rm certbot \
        certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --keep-until-expiring \
        --expand \
        -d $DOMAIN \
        --dry-run

    if [ $? -eq 0 ]; then
        echo "✅ Dry run successful! Getting real certificates..."

        docker-compose $COMPOSE_FILES run --rm certbot \
            certonly \
            --webroot \
            --webroot-path=/var/www/certbot \
            --email $EMAIL \
            --agree-tos \
            --no-eff-email \
            --keep-until-expiring \
            --expand \
            -d $DOMAIN

        if [ $? -eq 0 ]; then
            echo "🎉 Real certificates obtained!"
            echo "🔄 Reloading nginx..."
            docker-compose $COMPOSE_FILES exec nginx nginx -s reload

            echo "✅ SSL setup complete!"
            echo "🌐 Your site is now available at: https://$DOMAIN:8443"
        else
            echo "❌ Failed to get real certificates"
            echo "🔄 Restoring temporary certificates..."
            init_ssl
        fi
    else
        echo "❌ Dry run failed"
    fi
}

# Renew certificates
renew_certificates() {
    echo "🔄 Renewing certificates..."
    docker-compose $COMPOSE_FILES run --rm certbot renew

    if [ $? -eq 0 ]; then
        echo "✅ Certificates renewed"
        docker-compose $COMPOSE_FILES exec nginx nginx -s reload
    else
        echo "❌ Certificate renewal failed"
    fi
}

# Show status
show_status() {
    echo "📊 SSL Status for $DOMAIN"
    echo "========================"

    if [ -f "./letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
        echo "📜 Certificate exists"

        # Check certificate details
        echo "🔍 Certificate details:"
        openssl x509 -in "./letsencrypt/live/$DOMAIN/fullchain.pem" -text -noout | grep -E "(Subject:|Issuer:|Not Before:|Not After:)"

        # Check if it's self-signed
        if openssl x509 -in "./letsencrypt/live/$DOMAIN/fullchain.pem" -text -noout | grep -q "Issuer: C = US, ST = State"; then
            echo "⚠️  Certificate is SELF-SIGNED (temporary)"
        else
            echo "✅ Certificate is from Let's Encrypt"
        fi
    else
        echo "❌ No certificate found"
    fi

    echo ""
    echo "🐳 Container status:"
    docker-compose $COMPOSE_FILES ps
}

# Main menu
case "$1" in
    "init")
        init_ssl
        ;;
    "start")
        start_services
        ;;
    "setup")
        echo "🏁 Full SSL setup..."
        init_ssl && start_services && sleep 10 && get_real_certificates
        ;;
    "test")
        test_acme
        ;;
    "renew")
        renew_certificates
        ;;
    "status")
        show_status
        ;;
    "get-certs")
        get_real_certificates
        ;;
    "logs")
        echo "📋 Recent logs:"
        echo "--- Nginx logs ---"
        docker-compose $COMPOSE_FILES logs --tail=20 nginx
        echo "--- Certbot logs ---"
        docker-compose $COMPOSE_FILES logs --tail=20 certbot
        ;;
    *)
        echo "Usage: $0 {init|start|setup|test|get-certs|renew|status|logs}"
        echo ""
        echo "Commands:"
        echo "  init      - Initialize temporary SSL certificates"
        echo "  start     - Start services"
        echo "  setup     - Full setup (init + start + get real certificates)"
        echo "  test      - Test ACME challenge accessibility"
        echo "  get-certs - Get real Let's Encrypt certificates"
        echo "  renew     - Renew existing certificates"
        echo "  status    - Show certificate and service status"
        echo "  logs      - Show recent logs"
        echo ""
        echo "Quick start: $0 setup"
        ;;
esac
