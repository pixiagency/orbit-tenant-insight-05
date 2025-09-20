#!/bin/bash

DOMAIN="pixicrm.barmagiat.com"
EMAIL="tools@mijra.io"
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"

echo "🔒 SSL Setup with DNS Challenge for $DOMAIN:8443"
echo "================================================"

# Get certificates using DNS challenge (no port 80 needed)
get_certificates_dns() {
    echo "🔐 Getting SSL certificates using DNS challenge..."
    echo "📋 This method doesn't require port 80"
    echo "📋 Current setup: http://$DOMAIN:8080"
    echo "🎯 Target setup: https://$DOMAIN:8443"

    # Create directories
    mkdir -p ./letsencrypt/live
    mkdir -p ./letsencrypt/archive

    # Get certificates using manual DNS challenge
    echo "📞 Requesting certificates from Let's Encrypt (DNS Challenge)..."
    echo "⚠️  You will need to add a TXT record to your DNS"

    docker run --rm -it \
        -v $(pwd)/letsencrypt:/etc/letsencrypt \
        certbot/certbot \
        certonly \
        --manual \
        --preferred-challenges dns \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --expand \
        -d $DOMAIN

    if [ $? -eq 0 ]; then
        echo "🎉 Certificates obtained successfully!"
        setup_https_8443
    else
        echo "❌ Failed to get certificates"
    fi
}

# Alternative: Use existing reverse proxy method
get_certificates_via_proxy() {
    echo "🔐 Getting SSL certificates via existing reverse proxy..."
    echo "📋 This uses your existing port 80 service for ACME challenges"

    # Create ACME challenge directory
    mkdir -p ./letsencrypt/www/.well-known/acme-challenge
    mkdir -p ./letsencrypt/live
    mkdir -p ./letsencrypt/archive

    # Start nginx to serve ACME challenges
    docker-compose $COMPOSE_FILES up -d nginx
    sleep 5

    echo "📞 Please configure your main reverse proxy to route ACME challenges:"
    echo "Add this to your main nginx config (the one using port 80):"
    echo ""
    echo "server {"
    echo "    listen 80;"
    echo "    server_name $DOMAIN;"
    echo ""
    echo "    location /.well-known/acme-challenge/ {"
    echo "        proxy_pass http://127.0.0.1:8080;"
    echo "        proxy_set_header Host \$host;"
    echo "    }"
    echo ""
    echo "    location / {"
    echo "        return 301 https://\$host:8443\$request_uri;"
    echo "    }"
    echo "}"
    echo ""
    read -p "Press Enter after configuring your main reverse proxy..."

    # Test ACME challenge
    echo "🧪 Testing ACME challenge..."
    TEST_FILE="test-$(date +%s)"
    echo "$TEST_FILE" > "./letsencrypt/www/.well-known/acme-challenge/$TEST_FILE"

    sleep 3
    if curl -f "http://$DOMAIN/.well-known/acme-challenge/$TEST_FILE" 2>/dev/null | grep -q "$TEST_FILE"; then
        echo "✅ ACME challenge test passed"
        rm "./letsencrypt/www/.well-known/acme-challenge/$TEST_FILE"

        # Get certificates using webroot
        docker run --rm \
            -v $(pwd)/letsencrypt:/etc/letsencrypt \
            -v $(pwd)/letsencrypt/www:/var/www/certbot \
            certbot/certbot \
            certonly \
            --webroot \
            --webroot-path=/var/www/certbot \
            --email $EMAIL \
            --agree-tos \
            --no-eff-email \
            --expand \
            -d $DOMAIN

        if [ $? -eq 0 ]; then
            echo "🎉 Certificates obtained successfully!"
            setup_https_8443
        else
            echo "❌ Failed to get certificates"
        fi
    else
        echo "❌ ACME challenge test failed"
        echo "Please check your reverse proxy configuration"
        rm -f "./letsencrypt/www/.well-known/acme-challenge/$TEST_FILE"
    fi
}

# Use webroot challenge with your existing nginx container
get_certificates_webroot() {
    echo "🔐 Getting SSL certificates using webroot challenge..."
    echo "📋 This uses your existing nginx container on port 8080"

    # Create ACME challenge directory
    mkdir -p ./letsencrypt/www/.well-known/acme-challenge
    mkdir -p ./letsencrypt/live
    mkdir -p ./letsencrypt/archive

    # Start nginx to serve ACME challenges
    docker-compose $COMPOSE_FILES up -d nginx
    sleep 10

    echo "🧪 Testing ACME challenge endpoint..."
    TEST_FILE="test-$(date +%s)"
    echo "$TEST_FILE" > "./letsencrypt/www/.well-known/acme-challenge/$TEST_FILE"

    sleep 3
    if curl -f "http://$DOMAIN:8080/.well-known/acme-challenge/$TEST_FILE" 2>/dev/null | grep -q "$TEST_FILE"; then
        echo "✅ ACME challenge test passed"
        rm "./letsencrypt/www/.well-known/acme-challenge/$TEST_FILE"

        # Get certificates using webroot
        docker run --rm \
            -v $(pwd)/letsencrypt:/etc/letsencrypt \
            -v $(pwd)/letsencrypt/www:/var/www/certbot \
            --network crm-network \
            certbot/certbot \
            certonly \
            --webroot \
            --webroot-path=/var/www/certbot \
            --email $EMAIL \
            --agree-tos \
            --no-eff-email \
            --expand \
            -d $DOMAIN

        if [ $? -eq 0 ]; then
            echo "🎉 Certificates obtained successfully!"
            setup_https_8443
        else
            echo "❌ Failed to get certificates"
        fi
    else
        echo "❌ ACME challenge test failed"
        echo "Make sure your nginx container is running and accessible on port 8080"
        echo "Test manually: curl http://$DOMAIN:8080/.well-known/acme-challenge/$TEST_FILE"
        rm -f "./letsencrypt/www/.well-known/acme-challenge/$TEST_FILE"
    fi
}

# Setup HTTPS on port 8443 after getting certificates
setup_https_8443() {
    # Find certificate directory
    CERT_DIR=$(ls -1 "./letsencrypt/live/" | grep "^$DOMAIN" | head -1)
    if [ -n "$CERT_DIR" ]; then
        echo "📁 Certificate directory: $CERT_DIR"

        # Enable SSL stapling now that we have real certificates
        enable_ssl_stapling

        # Restart services
        echo "🚀 Restarting services with HTTPS on port 8443..."
        docker-compose $COMPOSE_FILES down
        docker-compose $COMPOSE_FILES up -d

        sleep 10

        echo "✅ SSL setup complete!"
        echo "🌐 Your application is now available at:"
        echo "   HTTP:  http://$DOMAIN:8080 (redirects to HTTPS)"
        echo "   HTTPS: https://$DOMAIN:8443 ✅"

        # Test the setup
        test_https_8443
    else
        echo "❌ Certificate directory not found"
    fi
}

# Enable SSL stapling in nginx config
enable_ssl_stapling() {
    local NGINX_CONF="./docker/nginx/default.prod.conf"

    echo "🔧 Enabling SSL stapling in nginx configuration..."

    if [ -f "$NGINX_CONF" ]; then
        # Backup existing config
        cp "$NGINX_CONF" "$NGINX_CONF.backup.$(date +%Y%m%d_%H%M%S)"

        # Uncomment SSL stapling lines
        sed -i 's/# ssl_stapling on;/ssl_stapling on;/' "$NGINX_CONF"
        sed -i 's/# ssl_stapling_verify on;/ssl_stapling_verify on;/' "$NGINX_CONF"

        echo "✅ SSL stapling enabled"
    fi
}

# Test HTTPS on port 8443
test_https_8443() {
    echo "🧪 Testing HTTPS setup on port 8443..."

    sleep 5

    # Test HTTP redirect
    echo -n "🔍 Testing HTTP to HTTPS redirect: "
    if curl -s -I "http://$DOMAIN:8080" | grep -q "301"; then
        echo "✅ PASSED"
    else
        echo "❌ FAILED"
    fi

    # Test HTTPS connectivity
    echo -n "🔍 Testing HTTPS connectivity: "
    if curl -k -s -I "https://$DOMAIN:8443" | grep -q "200\|301\|302"; then
        echo "✅ PASSED"
    else
        echo "❌ FAILED"
        echo "Troubleshooting tips:"
        echo "- Check if nginx container is running: docker-compose ps"
        echo "- Check nginx logs: docker-compose logs nginx"
        echo "- Verify certificate files exist: ls -la ./letsencrypt/live/$DOMAIN/"
    fi

    # Test certificate
    echo "🔍 SSL Certificate info:"
    echo | openssl s_client -connect $DOMAIN:8443 -servername $DOMAIN 2>/dev/null | openssl x509 -noout -subject -dates

    # Test security headers
    echo "🔍 Security headers test:"
    curl -s -I "https://$DOMAIN:8443" | grep -i "strict-transport-security\|x-frame-options\|x-content-type-options"
}

# Show current port usage
show_port_usage() {
    echo "🔍 Checking port usage..."
    echo "=========================="

    echo "Port 80:"
    if sudo netstat -tlnp 2>/dev/null | grep ':80 ' >/dev/null; then
        sudo netstat -tlnp 2>/dev/null | grep ':80 '
    else
        echo "Port 80 is not in use"
    fi

    echo ""
    echo "Port 8080:"
    if sudo netstat -tlnp 2>/dev/null | grep ':8080 ' >/dev/null; then
        sudo netstat -tlnp 2>/dev/null | grep ':8080 '
    else
        echo "Port 8080 is not in use"
    fi

    echo ""
    echo "Port 8443:"
    if sudo netstat -tlnp 2>/dev/null | grep ':8443 ' >/dev/null; then
        sudo netstat -tlnp 2>/dev/null | grep ':8443 '
    else
        echo "Port 8443 is not in use"
    fi

    echo ""
    echo "Docker containers:"
    docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}" | grep -E "(crm|nginx|certbot)"
}

# Certificate renewal function
renew_certificates() {
    echo "🔄 Renewing SSL certificates..."

    docker run --rm \
        -v $(pwd)/letsencrypt:/etc/letsencrypt \
        -v $(pwd)/letsencrypt/www:/var/www/certbot \
        --network crm-network \
        certbot/certbot \
        renew \
        --webroot \
        --webroot-path=/var/www/certbot \
        --quiet

    if [ $? -eq 0 ]; then
        echo "🎉 Certificates renewed successfully!"
        echo "🚀 Reloading nginx..."
        docker-compose $COMPOSE_FILES exec nginx nginx -s reload
    else
        echo "❌ Certificate renewal failed"
    fi
}

case "$1" in
    "dns")
        echo "🏁 Setting up HTTPS using DNS challenge..."
        get_certificates_dns
        ;;
    "proxy")
        echo "🏁 Setting up HTTPS via reverse proxy..."
        get_certificates_via_proxy
        ;;
    "webroot")
        echo "🏁 Setting up HTTPS using webroot challenge..."
        get_certificates_webroot
        ;;
    "check-ports")
        show_port_usage
        ;;
    "test")
        test_https_8443
        ;;
    "renew")
        renew_certificates
        ;;
    *)
        echo "Usage: $0 {dns|proxy|webroot|check-ports|test|renew}"
        echo ""
        echo "🔐 HTTPS Setup Methods for Port 8443:"
        echo "  dns        - Use DNS challenge (recommended - no port conflicts)"
        echo "  proxy      - Use existing reverse proxy for ACME challenges"
        echo "  webroot    - Use webroot challenge with your nginx container"
        echo "  check-ports- Check port usage"
        echo "  test       - Test HTTPS functionality"
        echo "  renew      - Renew existing certificates"
        echo ""
        echo "📋 Current Configuration:"
        echo "   Domain: $DOMAIN"
        echo "   HTTP:   http://$DOMAIN:8080 (redirects)"
        echo "   HTTPS:  https://$DOMAIN:8443"
        echo ""
        echo "💡 Recommended for your setup: ./ssl-setup.sh webroot"
        echo "💡 If that fails, try: ./ssl-setup.sh dns"
        ;;
esac
