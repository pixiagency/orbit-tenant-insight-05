#!/bin/bash

DOMAIN="pixicrm.barmagiat.com"
EMAIL="tools@mijra.io"
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"

echo "🔒 HTTPS-First SSL Management for $DOMAIN (Production)"
echo "======================================================"

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

# Update nginx SSL certificate paths
update_nginx_ssl_paths() {
    local CERT_DIR="$1"
    local NGINX_CONF="./docker/nginx/default.prod.conf"

    echo "🔧 Updating nginx configuration with certificate path: $CERT_DIR"

    if [ ! -f "$NGINX_CONF" ]; then
        echo "❌ Nginx configuration file not found: $NGINX_CONF"
        return 1
    fi

    # Create backup of current config
    cp "$NGINX_CONF" "$NGINX_CONF.backup.$(date +%Y%m%d_%H%M%S)"

    # Update SSL certificate paths
    sed -i "s|ssl_certificate /etc/letsencrypt/live/[^/]*/fullchain.pem;|ssl_certificate /etc/letsencrypt/live/$CERT_DIR/fullchain.pem;|g" "$NGINX_CONF"
    sed -i "s|ssl_certificate_key /etc/letsencrypt/live/[^/]*/privkey.pem;|ssl_certificate_key /etc/letsencrypt/live/$CERT_DIR/privkey.pem;|g" "$NGINX_CONF"

    echo "✅ Nginx configuration updated"
    echo "📝 Certificate paths updated to:"
    echo "   - /etc/letsencrypt/live/$CERT_DIR/fullchain.pem"
    echo "   - /etc/letsencrypt/live/$CERT_DIR/privkey.pem"

    # Show the changes
    echo "🔍 Updated SSL lines in nginx config:"
    grep -n "ssl_certificate" "$NGINX_CONF"
}

# Enable SSL stapling after real certificates
enable_ssl_stapling() {
    local NGINX_CONF="./docker/nginx/default.prod.conf"

    echo "🔧 Enabling SSL stapling for production certificates..."
    sed -i 's|# ssl_stapling on;|ssl_stapling on;|g' "$NGINX_CONF"
    sed -i 's|# ssl_stapling_verify on;|ssl_stapling_verify on;|g' "$NGINX_CONF"
    echo "✅ SSL stapling enabled"
}

# Initialize SSL certificates with self-signed certs
init_ssl() {
    echo "🔧 Initializing SSL setup with temporary certificates..."
    create_directories

    CERT_DIR="./letsencrypt/live/$DOMAIN"

    # Create certificate directory
    mkdir -p "$CERT_DIR"

    echo "📝 Creating temporary self-signed certificates for HTTPS..."

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

    # Generate self-signed certificate valid for 30 days
    openssl req -new -x509 -key "$CERT_DIR/privkey.pem" \
        -out "$CERT_DIR/fullchain.pem" -days 30 \
        -subj "/C=US/ST=State/L=City/O=TempSSL/CN=$DOMAIN" \
        -addext "subjectAltName=DNS:$DOMAIN"

    if [ $? -ne 0 ]; then
        echo "❌ Failed to generate certificate"
        return 1
    fi

    # Set proper permissions
    chmod 644 "$CERT_DIR/fullchain.pem"
    chmod 600 "$CERT_DIR/privkey.pem"

    echo "✅ Temporary SSL certificates created successfully"
    echo "📍 Certificate location: $CERT_DIR"
    echo "⚠️  These are SELF-SIGNED certificates (browsers will show warning)"
    echo "🔄 Real Let's Encrypt certificates will replace these automatically"

    return 0
}

# Start services with HTTPS enabled
start_services() {
    echo "🚀 Starting services with HTTPS enabled..."

    # Clean up any orphaned networks first
    docker network prune -f >/dev/null 2>&1

    # Start all services
    docker-compose $COMPOSE_FILES up -d

    if [ $? -eq 0 ]; then
        echo "✅ Services started successfully"

        # Wait for services to be ready
        echo "⏳ Waiting for services to start..."
        sleep 15

        # Get server IP
        SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "your-server-ip")

        echo "🌐 Application accessible at:"
        echo "   HTTP:  http://$SERVER_IP:8080 (redirects to HTTPS)"
        echo "   HTTPS: https://$SERVER_IP:8443 (⚠️  self-signed certificate)"
        echo "   Local: https://localhost:8443 (⚠️  self-signed certificate)"

        # Check if services are actually running
        if docker-compose $COMPOSE_FILES ps | grep -q "Up"; then
            echo "✅ All services are running"

            # Test HTTPS connectivity
            echo "🧪 Testing HTTPS connectivity..."
            if curl -k -f -s "https://localhost:8443/health" >/dev/null 2>&1; then
                echo "✅ HTTPS is working (with self-signed certificate)"
            else
                echo "⚠️  HTTPS test failed, checking logs..."
                docker-compose $COMPOSE_FILES logs --tail=5 nginx
            fi
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

    # Test locally first via HTTP
    echo -n "🔍 Local HTTP test (port 8080): "
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
        echo -n "🔍 External HTTP test ($SERVER_IP:8080): "
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

    # Test via domain name
    echo -n "🔍 Domain test ($DOMAIN:8080): "
    if curl -f "http://$DOMAIN:8080/.well-known/acme-challenge/test-challenge" 2>/dev/null | grep -q "$TEST_TOKEN"; then
        echo "✅ PASSED"
        DOMAIN_TEST=true
    else
        echo "❌ FAILED"
        DOMAIN_TEST=false
    fi

    # Clean up test file
    rm -f "./letsencrypt/www/.well-known/acme-challenge/test-challenge"

    if [ "$LOCAL_TEST" = true ]; then
        echo "✅ ACME challenge is accessible locally"
        if [ "$DOMAIN_TEST" = true ]; then
            echo "✅ Domain ACME challenge test passed - ready for Let's Encrypt"
            return 0
        else
            echo "⚠️  Domain test failed - Let's Encrypt might not work"
            echo "💡 Make sure $DOMAIN points to this server"
            return 1
        fi
    else
        echo "❌ ACME challenge test failed"
        echo "🔍 Checking nginx status..."
        docker-compose $COMPOSE_FILES logs --tail=10 nginx
        return 1
    fi
}

# Get real SSL certificates from Let's Encrypt
get_real_certificates() {
    echo "🔐 Getting real SSL certificates from Let's Encrypt..."

    # First test if ACME challenge works
    if ! test_acme; then
        echo "❌ ACME challenge test failed. Cannot proceed with certificate generation."
        echo "💡 Make sure:"
        echo "   - Your domain $DOMAIN points to this server"
        echo "   - Port 80/8080 is accessible from the internet"
        echo "   - DNS has propagated properly"
        return 1
    fi

    # Remove temporary certificates
    echo "🗑️  Removing temporary self-signed certificates..."
    rm -rf "./letsencrypt/live/$DOMAIN"*
    rm -rf "./letsencrypt/archive/$DOMAIN"*

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
            echo "🎉 Real Let's Encrypt certificates obtained!"

            # Find the actual certificate directory (handles -0001 suffixes)
            CERT_DIR=$(ls -1 "./letsencrypt/live/" | grep "^$DOMAIN" | head -1)
            if [ -n "$CERT_DIR" ]; then
                echo "📁 Certificate directory found: $CERT_DIR"

                # Update nginx configuration with correct certificate path
                update_nginx_ssl_paths "$CERT_DIR"

                # Enable SSL stapling for production certificates
                enable_ssl_stapling

                # Test nginx configuration
                echo "🧪 Testing nginx configuration..."
                if docker-compose $COMPOSE_FILES exec nginx nginx -t >/dev/null 2>&1; then
                    echo "🔄 Reloading nginx with real certificates..."
                    docker-compose $COMPOSE_FILES exec nginx nginx -s reload

                    # Wait for reload
                    sleep 5

                    echo "✅ SSL setup complete with real certificates!"
                    echo "🌐 Your site is now available at:"
                    echo "   HTTP:  http://$SERVER_IP:8080 (redirects to HTTPS)"
                    echo "   HTTPS: https://$SERVER_IP:8443 ✅"
                    echo "   HTTPS: https://$DOMAIN:8443 ✅"
                    echo ""
                    echo "🔒 Certificate is now trusted by browsers!"

                    # Test the final HTTPS connection
                    if curl -f -s "https://localhost:8443/health" >/dev/null 2>&1; then
                        echo "✅ Final HTTPS test passed"
                    else
                        echo "⚠️  Final HTTPS test failed - check logs"
                    fi
                else
                    echo "❌ Nginx configuration test failed"
                    docker-compose $COMPOSE_FILES exec nginx nginx -t
                fi
            else
                echo "❌ Could not find certificate directory"
                ls -la "./letsencrypt/live/"
            fi
        else
            echo "❌ Failed to get real certificates"
            echo "🔄 Restoring temporary self-signed certificates..."
            init_ssl
            docker-compose $COMPOSE_FILES restart nginx
        fi
    else
        echo "❌ Dry run failed - certificate request would not succeed"
        echo "🔄 Keeping temporary self-signed certificates for now"
    fi
}

# Show comprehensive status
show_status() {
    echo "📊 HTTPS SSL Status for $DOMAIN"
    echo "==============================="

    # Find certificate directory (handles -0001 suffixes)
    CERT_DIR=$(ls -1 "./letsencrypt/live/" 2>/dev/null | grep "^$DOMAIN" | head -1)

    if [ -n "$CERT_DIR" ] && [ -f "./letsencrypt/live/$CERT_DIR/fullchain.pem" ]; then
        echo "📜 Certificate exists in directory: $CERT_DIR"

        # Check certificate details
        echo "🔍 Certificate details:"
        openssl x509 -in "./letsencrypt/live/$CERT_DIR/fullchain.pem" -text -noout | grep -E "(Subject:|Issuer:|Not Before:|Not After:)"

        # Check expiration
        echo ""
        echo "📅 Certificate expiration:"
        openssl x509 -in "./letsencrypt/live/$CERT_DIR/fullchain.pem" -noout -dates

        # Check if it's self-signed or from Let's Encrypt
        if openssl x509 -in "./letsencrypt/live/$CERT_DIR/fullchain.pem" -text -noout | grep -q "TempSSL"; then
            echo "⚠️  Certificate is SELF-SIGNED (temporary)"
            echo "🔄 Run './ssl-setup.sh get-certs' to get real Let's Encrypt certificate"
        elif openssl x509 -in "./letsencrypt/live/$CERT_DIR/fullchain.pem" -text -noout | grep -q "Let's Encrypt"; then
            echo "✅ Certificate is from Let's Encrypt (trusted)"
        else
            echo "❓ Certificate type unknown"
        fi

        # Check if nginx config matches
        echo ""
        echo "🔍 Nginx configuration check:"
        if [ -f "./docker/nginx/default.prod.conf" ]; then
            if grep -q "/etc/letsencrypt/live/$CERT_DIR/" "./docker/nginx/default.prod.conf"; then
                echo "✅ Nginx config matches certificate directory"
            else
                echo "⚠️  Nginx config may not match certificate directory"
                echo "Current nginx SSL paths:"
                grep "ssl_certificate" "./docker/nginx/default.prod.conf"
                echo "Expected path: /etc/letsencrypt/live/$CERT_DIR/"
            fi
        else
            echo "❌ Nginx config file not found"
        fi
    else
        echo "❌ No certificate found"
        echo "Available certificate directories:"
        ls -la "./letsencrypt/live/" 2>/dev/null || echo "No letsencrypt directory found"
    fi

    echo ""
    echo "🐳 Container status:"
    docker-compose $COMPOSE_FILES ps

    echo ""
    echo "🌐 Service URLs:"
    SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "your-server-ip")
    echo "   HTTP:  http://$SERVER_IP:8080 (redirects to HTTPS)"
    echo "   HTTPS: https://$SERVER_IP:8443"
    echo "   HTTPS: https://$DOMAIN:8443"

    # Test HTTPS connectivity
    echo ""
    echo "🧪 HTTPS Connectivity Test:"
    if curl -k -f -s "https://localhost:8443/health" >/dev/null 2>&1; then
        echo "✅ HTTPS is responding"
    else
        echo "❌ HTTPS is not responding"
    fi
}

# Other functions (renew, logs, cleanup) remain the same...
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

show_logs() {
    echo "📋 Recent logs:"
    echo ""
    echo "=== Nginx logs ==="
    docker-compose $COMPOSE_FILES logs --tail=20 nginx
    echo ""
    echo "=== App PHP logs ==="
    docker-compose $COMPOSE_FILES logs --tail=10 app_php
}

cleanup() {
    echo "🧹 Cleaning up..."
    docker-compose $COMPOSE_FILES down
    docker network prune -f
    docker volume prune -f
    echo "✅ Cleanup complete"
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
        echo "🏁 Full HTTPS SSL setup..."
        echo "This will set up HTTPS from the start with self-signed certificates,"
        echo "then replace them with real Let's Encrypt certificates."
        echo ""
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
    "get-certs")
        get_real_certificates
        ;;
    "renew")
        renew_certificates
        ;;
    "status")
        show_status
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
    "fix-paths")
        echo "🔧 Fixing nginx SSL certificate paths..."
        CERT_DIR=$(ls -1 "./letsencrypt/live/" 2>/dev/null | grep "^$DOMAIN" | head -1)
        if [ -n "$CERT_DIR" ]; then
            update_nginx_ssl_paths "$CERT_DIR"
            echo "🔄 Restarting nginx..."
            docker-compose $COMPOSE_FILES restart nginx
            echo "✅ Nginx SSL paths fixed and restarted"
        else
            echo "❌ No certificate directory found for $DOMAIN"
        fi
        ;;
    *)
        echo "Usage: $0 {init|start|setup|test|get-certs|renew|status|logs|cleanup|restart|fix-paths}"
        echo ""
        echo "🔐 HTTPS-First SSL Commands:"
        echo "  setup      - Complete HTTPS setup (self-signed → Let's Encrypt)"
        echo "  init       - Create temporary self-signed certificates"
        echo "  start      - Start services with HTTPS enabled"
        echo "  get-certs  - Replace self-signed with real Let's Encrypt certificates"
        echo "  test       - Test ACME challenge for Let's Encrypt"
        echo "  renew      - Renew existing Let's Encrypt certificates"
        echo "  status     - Show certificate and HTTPS status"
        echo "  logs       - Show recent logs"
        echo "  restart    - Restart all services"
        echo "  fix-paths  - Fix nginx SSL certificate paths (for -0001 suffixes)"
        echo "  cleanup    - Stop services and clean up"
        echo ""
        echo "🚀 Quick start: $0 setup"
        echo ""
        echo "📋 Configuration:"
        echo "   Domain: $DOMAIN"
        echo "   Email:  $EMAIL"
        echo "   HTTP:   Port 8080 (redirects to HTTPS)"
        echo "   HTTPS:  Port 8443"
        ;;
esac
