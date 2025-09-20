#!/bin/bash

DOMAIN="pixicrm.barmagiat.com"
EMAIL="tools@mijra.io"
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"

# Enhanced webroot challenge with debugging
get_certificates_webroot_debug() {
    echo "🔐 Getting SSL certificates using webroot challenge (with debugging)..."
    echo "📋 This uses your existing nginx container on port 8080"

    # Create ACME challenge directory
    echo "📁 Creating directories..."
    mkdir -p ./letsencrypt/www/.well-known/acme-challenge
    mkdir -p ./letsencrypt/live
    mkdir -p ./letsencrypt/archive

    # Set proper permissions
    chmod -R 755 ./letsencrypt/www

    # Start nginx to serve ACME challenges
    echo "🚀 Starting nginx container..."
    docker-compose $COMPOSE_FILES up -d nginx
    sleep 15

    # Check if nginx is running
    if ! docker ps | grep -q "crm-nginx"; then
        echo "❌ Nginx container failed to start"
        docker-compose $COMPOSE_FILES logs nginx
        return 1
    fi

    echo "✅ Nginx container is running"

    # Test nginx config
    echo "🔧 Testing nginx configuration..."
    docker-compose $COMPOSE_FILES exec nginx nginx -t
    if [ $? -ne 0 ]; then
        echo "❌ Nginx configuration is invalid"
        return 1
    fi

    # Create multiple test files for thorough testing
    echo "🧪 Creating test files..."
    TEST_FILE1="test-$(date +%s)"
    TEST_FILE2="test-manual-$(date +%s)"
    TEST_CONTENT="SSL-TEST-CONTENT-$(date)"

    echo "$TEST_CONTENT" > "./letsencrypt/www/.well-known/acme-challenge/$TEST_FILE1"
    echo "$TEST_CONTENT" > "./letsencrypt/www/.well-known/acme-challenge/$TEST_FILE2"

    # Wait for nginx to be ready
    echo "⏳ Waiting for nginx to be ready..."
    sleep 5

    # Test 1: Check if file exists in container
    echo "🔍 Test 1: Checking file in container..."
    docker-compose $COMPOSE_FILES exec nginx ls -la /var/www/certbot/.well-known/acme-challenge/
    docker-compose $COMPOSE_FILES exec nginx cat "/var/www/certbot/.well-known/acme-challenge/$TEST_FILE1" 2>/dev/null

    # Test 2: Local access
    echo "🔍 Test 2: Testing local access..."
    LOCAL_RESULT=$(curl -s "http://localhost:8080/.well-known/acme-challenge/$TEST_FILE1" 2>/dev/null)
    if [ "$LOCAL_RESULT" = "$TEST_CONTENT" ]; then
        echo "✅ Local access works"
    else
        echo "❌ Local access failed"
        echo "Expected: $TEST_CONTENT"
        echo "Got: $LOCAL_RESULT"
    fi

    # Test 3: External access
    echo "🔍 Test 3: Testing external access..."
    EXTERNAL_RESULT=$(curl -s --connect-timeout 10 "http://$DOMAIN:8080/.well-known/acme-challenge/$TEST_FILE1" 2>/dev/null)
    if [ "$EXTERNAL_RESULT" = "$TEST_CONTENT" ]; then
        echo "✅ External access works"
        ACME_TEST_PASSED=true
    else
        echo "❌ External access failed"
        echo "Expected: $TEST_CONTENT"
        echo "Got: $EXTERNAL_RESULT"
        ACME_TEST_PASSED=false
    fi

    # Test 4: Check DNS resolution
    echo "🔍 Test 4: DNS resolution..."
    if nslookup $DOMAIN >/dev/null 2>&1; then
        echo "✅ DNS resolution works"
    else
        echo "❌ DNS resolution failed"
    fi

    # Test 5: Check connectivity
    echo "🔍 Test 5: Domain connectivity..."
    if ping -c 2 $DOMAIN >/dev/null 2>&1; then
        echo "✅ Domain is reachable"
    else
        echo "❌ Domain is not reachable"
    fi

    # Clean up test files
    rm -f "./letsencrypt/www/.well-known/acme-challenge/$TEST_FILE1"
    rm -f "./letsencrypt/www/.well-known/acme-challenge/$TEST_FILE2"

    if [ "$ACME_TEST_PASSED" = true ]; then
        echo "🎉 ACME challenge test passed! Proceeding with certificate request..."

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
            --non-interactive \
            -v \
            -d $DOMAIN

        if [ $? -eq 0 ]; then
            echo "🎉 Certificates obtained successfully!"
            setup_https_8443
        else
            echo "❌ Failed to get certificates from Let's Encrypt"
            echo "Try the DNS challenge instead: ./ssl-setup.sh dns"
        fi
    else
        echo "❌ ACME challenge failed"
        echo ""
        echo "🔧 Troubleshooting suggestions:"
        echo "1. Check if port 8080 is open in your firewall"
        echo "2. Verify your domain's DNS records point to this server"
        echo "3. Check if there's another service using port 8080"
        echo "4. Try: sudo netstat -tlnp | grep :8080"
        echo ""
        echo "💡 Alternative: Use DNS challenge instead:"
        echo "   ./ssl-setup.sh dns"
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
        ls -la "./letsencrypt/live/"
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

    sleep 10

    # Test HTTP redirect
    echo -n "🔍 Testing HTTP to HTTPS redirect: "
    REDIRECT_TEST=$(curl -s -I "http://$DOMAIN:8080" | head -1)
    if echo "$REDIRECT_TEST" | grep -q "301"; then
        echo "✅ PASSED"
    else
        echo "❌ FAILED ($REDIRECT_TEST)"
    fi

    # Test HTTPS connectivity
    echo -n "🔍 Testing HTTPS connectivity: "
    HTTPS_TEST=$(curl -k -s -I "https://$DOMAIN:8443" | head -1)
    if echo "$HTTPS_TEST" | grep -q "200\|301\|302"; then
        echo "✅ PASSED"
    else
        echo "❌ FAILED ($HTTPS_TEST)"
        echo "🔧 Troubleshooting:"
        echo "- Check nginx logs: docker-compose logs nginx"
        echo "- Verify certificates: ls -la ./letsencrypt/live/$DOMAIN/"
        echo "- Test nginx config: docker-compose exec nginx nginx -t"
    fi

    # Test certificate details
    echo "🔍 SSL Certificate info:"
    openssl s_client -connect $DOMAIN:8443 -servername $DOMAIN </dev/null 2>/dev/null | openssl x509 -noout -subject -dates 2>/dev/null || echo "Could not retrieve certificate info"
}

case "$1" in
    "webroot-debug")
        echo "🏁 Setting up HTTPS using webroot challenge with debugging..."
        get_certificates_webroot_debug
        ;;
    "test")
        test_https_8443
        ;;
    *)
        echo "Usage: $0 {webroot-debug|test}"
        echo ""
        echo "🔐 Debug SSL Setup:"
        echo "  webroot-debug - Enhanced webroot challenge with detailed debugging"
        echo "  test         - Test existing HTTPS setup"
        echo ""
        echo "💡 Try this enhanced version with debugging:"
        echo "   ./ssl-setup-debug.sh webroot-debug"
        ;;
esac
