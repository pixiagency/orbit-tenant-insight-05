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
    echo "✅ Directories created"
}

# Initialize SSL certificates (direct method - no container)
init_ssl() {
    echo "🔧 Initializing SSL setup..."
    create_directories

    CERT_DIR="./letsencrypt/live/$DOMAIN"

    # Create certificate directory
    mkdir -p "$CERT_DIR"

    echo "📝 Creating temporary self-signed certificates..."

    # Check if openssl is available
    if ! command -v openssl >/dev/null 2>&1; then
        echo "❌ OpenSSL not found. Installing..."
        if command -v apt-get >/dev/null 2>&1; then
            sudo apt-get update && sudo apt-get install -y openssl
        elif command -v yum >/dev/null 2>&1; then
            sudo yum install -y openssl
        else
            echo "❌ Cannot install OpenSSL automatically. Please install it manually."
            return 1
        fi
    fi

    # Generate private key
    openssl genrsa -out "$CERT_DIR/privkey.pem" 4096

    if [ $? -ne 0 ]; then
        echo "❌ Failed to generate private key"
        return 1
    fi

    # Generate self-signed certificate
    openssl req -new -x509 -key "$CERT_DIR/privkey.pem" \
        -out "$CERT_DIR/fullchain.pem" -days 30 \
        -subj "/C=US/ST=State/L=City/O=Temp/CN=$DOMAIN"

    if [ $? -ne 0 ]; then
        echo "❌ Failed to generate certificate"
        return 1
    fi

    # Set proper permissions
    chmod 644 "$CERT_DIR/fullchain.pem"
    chmod 600 "$CERT_DIR/privkey.pem"

    echo "✅ Temporary certificates created successfully"
    echo "📍 Certificate location: $CERT_DIR"
    ls -la "$CERT_DIR/"

    return 0
}

# Start services
start_services() {
    echo "🚀 Starting services..."

    # Clean up any orphaned networks first
    docker network prune -f >/dev/null 2>&1

    # Start the main services (nginx and app_php)
    docker-compose $COMPOSE_FILES up -d nginx app_php

    if [ $? -eq 0 ]; then
        echo "✅ Services started successfully"

        # Wait for services to be ready
        echo "⏳ Waiting for services to start..."
        sleep 10

        # Get server IP
        SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "your-server-ip")

        echo "🌐 Application accessible at:"
        echo "   HTTP:  http://$SERVER_IP:8080"
        echo "   HTTPS: https://$SERVER_IP:8443 (self-signed)"
        echo "   Local: http://localhost:8080"

        # Check if services are actually running
        if docker-compose $COMPOSE_FILES ps | grep -q "Up"; then
            echo "✅ All services are running"
        else
            echo "⚠️  Some services may not be running properly"
            docker-compose $COMPOSE_FILES ps
        fi
    else
        echo "❌ Failed to start services"
        echo "🔍 Checking logs..."
        docker-compose $COMPOSE_FILES logs --tail=10
        return 1
    fi
}

# Test ACME challenge
test_acme() {
    echo "🧪 Testing ACME challenge accessibility..."

    # Create test file
    TEST_TOKEN="test-$(date +%s)"
    echo "$TEST_TOKEN" > "./letsencrypt/www/.well-known/acme-challenge/test-challenge"

    sleep 5

    # Test locally first
    echo -n "🔍 Local test (port 8080): "
    if curl -f "http://localhost:8080/.well-known/acme-challenge/test-challenge" 2>/dev/null | grep -q "$TEST_TOKEN"; then
        echo "✅ PASSED"
        LOCAL_TEST=true
    else
        echo "❌ FAILED"
        LOCAL_TEST=false
    fi

    # Test via external IP
    SERVER_IP=$(curl -s ifconfig.me 2>/dev/null)
    if [ -n "$SERVER_IP" ]; then
        echo -n "🔍 External test ($SERVER_IP:8080): "
        if curl -f "http://$SERVER_IP:8080/.well-known/acme-challenge/test-challenge" 2>/dev/null | grep -q "$TEST_TOKEN"; then
            echo "✅ PASSED"
            EXTERNAL_TEST=true
        else
            echo "❌ FAILED"
            EXTERNAL_TEST=false
        fi
    else
        echo "⚠️  Could not determine server IP, skipping external test"
        EXTERNAL_TEST=false
    fi

    # Clean up test file
    rm -f "./letsencrypt/www/.well-known/acme-challenge/test-challenge"

    if [ "$LOCAL_TEST" = true ]; then
        echo "✅ ACME challenge is accessible locally"
        if [ "$EXTERNAL_TEST" = false ]; then
            echo "⚠️  External access failed - you may need to configure port forwarding"
            echo "ℹ️  For Let's Encrypt to work, port 80 must be accessible from the internet"
        fi
        return 0
    else
        echo "❌ ACME challenge test failed"
        echo "🔍 Checking nginx status..."
        docker-compose $COMPOSE_FILES logs --tail=10 nginx
        return 1
    fi
}

# Get real SSL certificates
get_real_certificates() {
    echo "🔐 Getting real SSL certificates..."

    # First test if ACME challenge works
    if ! test_acme; then
        echo "❌ ACME challenge test failed. Cannot proceed with certificate generation."
        echo "💡 Make sure:"
        echo "   - Your domain $DOMAIN points to this server"
        echo "   - Port 80 is accessible from the internet"
        echo "   - Nginx is properly configured and running"
        return 1
    fi

    # Remove temporary certificates
    echo "🗑️  Removing temporary certificates..."
    rm -rf "./letsencrypt/live/$DOMAIN"
    rm -rf "./letsencrypt/archive/$DOMAIN"

    # Try dry run first
    echo "🧪 Running certificate dry run..."
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

        # Get real certificates
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

            # Test nginx configuration
            echo "🧪 Testing nginx configuration..."
            if docker-compose $COMPOSE_FILES exec nginx nginx -t >/dev/null 2>&1; then
                echo "🔄 Reloading nginx..."
                docker-compose $COMPOSE_FILES exec nginx nginx -s reload

                echo "✅ SSL setup complete!"
                echo "🌐 Your site is now available at:"
                echo "   https://$DOMAIN:8443"
                echo "   https://$(curl -s ifconfig.me):8443"
            else
                echo "❌ Nginx configuration test failed"
                docker-compose $COMPOSE_FILES exec nginx nginx -t
            fi
        else
            echo "❌ Failed to get real certificates"
            echo "🔄 Restoring temporary certificates..."
            init_ssl
            docker-compose $COMPOSE_FILES restart nginx
        fi
    else
        echo "❌ Dry run failed - certificate request would not succeed"
        echo "🔄 Restoring temporary certificates..."
        init_ssl
        docker-compose $COMPOSE_FILES restart nginx
    fi
}

# Renew certificates
renew_certificates() {
    echo "🔄 Renewing certificates..."
    docker-compose $COMPOSE_FILES run --rm certbot renew --webroot-path=/var/www/certbot

    if [ $? -eq 0 ]; then
        echo "✅ Certificates renewed"
        docker-compose $COMPOSE_FILES exec nginx nginx -s reload
        echo "🔄 Nginx reloaded with renewed certificates"
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

        # Check expiration
        echo ""
        echo "📅 Certificate expiration:"
        openssl x509 -in "./letsencrypt/live/$DOMAIN/fullchain.pem" -noout -dates

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

    echo ""
    echo "🌐 Service URLs:"
    SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "your-server-ip")
    echo "   HTTP:  http://$SERVER_IP:8080"
    echo "   HTTPS: https://$SERVER_IP:8443"
}

# Cleanup function
cleanup() {
    echo "🧹 Cleaning up..."
    docker-compose $COMPOSE_FILES down
    docker network prune -f
    docker volume prune -f
    echo "✅ Cleanup complete"
}

# Show logs
show_logs() {
    echo "📋 Recent logs:"
    echo ""
    echo "=== Nginx logs ==="
    docker-compose $COMPOSE_FILES logs --tail=20 nginx
    echo ""
    echo "=== Certbot logs ==="
    if docker-compose $COMPOSE_FILES ps certbot | grep -q certbot; then
        docker-compose $COMPOSE_FILES logs --tail=20 certbot
    else
        echo "Certbot container not running"
    fi
    echo ""
    echo "=== App PHP logs ==="
    docker-compose $COMPOSE_FILES logs --tail=10 app_php
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
        if init_ssl; then
            echo ""
            if start_services; then
                echo ""
                sleep 10
                get_real_certificates
            fi
        else
            echo "❌ Setup failed during SSL initialization"
        fi
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
        show_logs
        ;;
    "cleanup")
        cleanup
        ;;
    "restart")
        echo "🔄 Restarting services..."
        docker-compose $COMPOSE_FILES restart
        echo "✅ Services restarted"
        ;;
    *)
        echo "Usage: $0 {init|start|setup|test|get-certs|renew|status|logs|cleanup|restart}"
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
        echo "  cleanup   - Stop services and clean up"
        echo "  restart   - Restart all services"
        echo ""
        echo "Quick start: $0 setup"
        echo ""
        echo "Domain: $DOMAIN"
        echo "Email:  $EMAIL"
        ;;
esac
