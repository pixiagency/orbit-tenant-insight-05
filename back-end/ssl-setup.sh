#!/bin/bash

DOMAIN="pixicrm.barmagiat.com"
EMAIL="tools@mijra.io"

echo "🔒 SSL Setup for $DOMAIN"

# Create directories
mkdir -p ./letsencrypt/www
mkdir -p ./letsencrypt/live/$DOMAIN

# Function to create dummy SSL certificates (needed for nginx to start)
create_dummy_certs() {
    echo "🔧 Creating temporary SSL certificates..."
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout "./letsencrypt/live/$DOMAIN/privkey.pem" \
        -out "./letsencrypt/live/$DOMAIN/fullchain.pem" \
        -subj "/CN=$DOMAIN"
    echo "✅ Temporary certificates created"
}

# Function to test ACME challenge accessibility
test_acme_challenge() {
    echo "🧪 Testing ACME challenge accessibility..."

    # Create a test file
    echo "test" > "./letsencrypt/www/test-challenge"

    # Wait a moment for nginx to pick up the file
    sleep 5

    # Test if the file is accessible
    if curl -f "http://$DOMAIN/.well-known/acme-challenge/test-challenge" >/dev/null 2>&1; then
        echo "✅ ACME challenge path is accessible"
        rm "./letsencrypt/www/test-challenge"
        return 0
    else
        echo "❌ ACME challenge path is NOT accessible"
        echo "🔍 Checking nginx status..."
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs nginx | tail -10
        rm "./letsencrypt/www/test-challenge"
        return 1
    fi
}

# Function to get real SSL certificates
get_real_certs() {
    echo "🚀 Getting real SSL certificates..."

    # Test ACME challenge first
    if ! test_acme_challenge; then
        echo "❌ ACME challenge test failed. Please check nginx configuration and DNS settings."
        return 1
    fi

    # Remove temporary certificates
    rm -rf "./letsencrypt/live/$DOMAIN"

    # Get real certificates
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm certbot \
        certonly --webroot \
        --webroot-path=/var/www/certbot \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --force-renewal \
        -d $DOMAIN \
        --dry-run

    if [ $? -eq 0 ]; then
        echo "✅ Dry run successful! Getting real certificates..."

        # Now get the real certificates
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm certbot \
            certonly --webroot \
            --webroot-path=/var/www/certbot \
            --email $EMAIL \
            --agree-tos \
            --no-eff-email \
            --force-renewal \
            -d $DOMAIN

        if [ $? -eq 0 ]; then
            echo "✅ Real certificates obtained!"
            echo "🔍 Checking certificate files..."

            # Find the actual certificate directory
            CERT_DIR=$(ls -1 "./letsencrypt/live/" | grep "$DOMAIN" | head -1)
            if [ -n "$CERT_DIR" ]; then
                echo "📁 Certificate directory: $CERT_DIR"
                ls -la "./letsencrypt/live/$CERT_DIR/"

                # Test nginx configuration
                echo "🧪 Testing nginx configuration..."
                docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec nginx nginx -t

                if [ $? -eq 0 ]; then
                    echo "🔄 Reloading nginx..."
                    docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec nginx nginx -s reload
                    echo "✅ SSL setup complete!"
                else
                    echo "❌ Nginx configuration test failed"
                fi
            fi
        else
            echo "❌ Failed to get real certificates"
        fi
    else
        echo "❌ Dry run failed - please check configuration"
    fi
}

# Function to renew certificates
renew_certs() {
    echo "🔄 Renewing certificates..."
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm certbot certbot renew
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec nginx nginx -s reload
}

# Function to check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."

    # Check if domain resolves to current server
    DOMAIN_IP=$(dig +short $DOMAIN)
    echo "Domain $DOMAIN resolves to: $DOMAIN_IP"

    # Check if port 80 is accessible
    if nc -z -w5 $DOMAIN 80; then
        echo "✅ Port 80 is accessible"
    else
        echo "❌ Port 80 is NOT accessible - check firewall settings"
    fi

    # Check if docker compose files exist
    if [ -f "docker-compose.yml" ] && [ -f "docker-compose.prod.yml" ]; then
        echo "✅ Docker compose files found"
    else
        echo "❌ Docker compose files missing"
    fi
}

# Main command handling
case "$1" in
    "setup")
        echo "🏁 Initial SSL setup starting..."
        check_prerequisites
        create_dummy_certs
        echo "🚀 Starting services..."
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
        sleep 15
        get_real_certs
        ;;
    "renew")
        renew_certs
        ;;
    "test")
        test_acme_challenge
        ;;
    "debug")
        echo "🔍 Debugging certificate setup..."
        echo "Host certificates:"
        ls -la "./letsencrypt/live/$DOMAIN/" 2>/dev/null || echo "No certificates on host"
        echo ""
        echo "Nginx container certificates:"
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec nginx ls -la "/etc/letsencrypt/live/$DOMAIN/" 2>/dev/null || echo "No certificates in nginx container"
        echo ""
        echo "Certbot container certificates:"
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml run --rm certbot ls -la "/etc/letsencrypt/live/$DOMAIN/" 2>/dev/null || echo "No certificates in certbot container"
        echo ""
        echo "Nginx status:"
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec nginx nginx -t
        ;;
    *)
        echo "Usage: $0 {setup|renew|test|debug}"
        echo ""
        echo "  setup  - First time SSL setup"
        echo "  renew  - Renew existing certificates"
        echo "  test   - Test ACME challenge accessibility"
        echo "  debug  - Check certificate status"
        ;;
esac
