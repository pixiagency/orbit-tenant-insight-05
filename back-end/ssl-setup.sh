#!/bin/bash

DOMAIN="pixicrm.barmagiat.com"
EMAIL="tools@mijra.io"
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"

echo "🔒 SSL Setup with DNS Challenge for $DOMAIN:8005"
echo "================================================"

# Get certificates using DNS challenge (no port 80 needed)
get_certificates_dns() {
    echo "🔐 Getting SSL certificates using DNS challenge..."
    echo "📋 This method doesn't require port 80"
    echo "📋 Current setup: http://$DOMAIN:8005"
    echo "🎯 Target setup: https://$DOMAIN:8005"

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
        setup_https_8005
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
    echo "        return 301 https://\$host:8005\$request_uri;"
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
            setup_https_8005
        else
            echo "❌ Failed to get certificates"
        fi
    else
        echo "❌ ACME challenge test failed"
        echo "Please check your reverse proxy configuration"
        rm -f "./letsencrypt/www/.well-known/acme-challenge/$TEST_FILE"
    fi
}

# Setup HTTPS on port 8005 after getting certificates
setup_https_8005() {
    # Find certificate directory
    CERT_DIR=$(ls -1 "./letsencrypt/live/" | grep "^$DOMAIN" | head -1)
    if [ -n "$CERT_DIR" ]; then
        echo "📁 Certificate directory: $CERT_DIR"

        # Create nginx config for port 8005
        create_nginx_config_8005 "$CERT_DIR"

        # Update docker compose
        update_docker_compose_8005

        # Restart services
        echo "🚀 Restarting services with HTTPS on port 8005..."
        docker-compose $COMPOSE_FILES down
        docker-compose $COMPOSE_FILES up -d

        sleep 10

        echo "✅ SSL setup complete!"
        echo "🌐 Your application is now available at:"
        echo "   HTTPS: https://$DOMAIN:8005 ✅"

        # Test the setup
        test_https_8005
    else
        echo "❌ Certificate directory not found"
    fi
}

# Create nginx configuration for port 8005
create_nginx_config_8005() {
    local CERT_DIR="$1"
    local NGINX_CONF="./docker/nginx/default.prod.conf"

    echo "🔧 Creating nginx configuration for port 8005..."

    # Backup existing config
    if [ -f "$NGINX_CONF" ]; then
        cp "$NGINX_CONF" "$NGINX_CONF.backup.$(date +%Y%m%d_%H%M%S)"
    fi

    # Create new nginx config for port 8005
    cat > "$NGINX_CONF" << EOF
# HTTPS server on port 8005
server {
    listen 8005 ssl http2;
    server_name $DOMAIN _;
    root /var/www/html/public;
    index index.php index.html;

    # SSL certificate paths
    ssl_certificate /etc/letsencrypt/live/$CERT_DIR/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$CERT_DIR/privkey.pem;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }

    # Main application
    location / {
        try_files \$uri \$uri/ @php;
    }

    # PHP handling via proxy
    location @php {
        proxy_pass http://app_php:8005;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Port 8005;

        # Proxy timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Direct PHP file handling (if needed)
    location ~ \\.php\$ {
        fastcgi_pass app_php:9000;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        fastcgi_param HTTPS on;
        fastcgi_param SERVER_PORT 8005;
    }

    # Security - deny access to hidden files
    location ~ /\\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Deny access to sensitive files
    location ~* \\.(env|log|ini)\$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}

# Server block for ACME challenges on port 8080 (for renewals)
server {
    listen 8080;
    server_name $DOMAIN _;

    # ACME challenge location
    location /.well-known/acme-challenge/ {
        alias /var/www/certbot/;
        try_files \$uri =404;
    }

    # Redirect everything else to HTTPS on port 8005
    location / {
        return 301 https://\$host:8005\$request_uri;
    }
}
EOF

    echo "✅ Nginx configuration created for HTTPS on port 8005"
}

# Update docker compose for port 8005
update_docker_compose_8005() {
    echo "🔧 Updating docker-compose for port 8005..."

    # Update docker-compose.prod.yml
    cat > docker-compose.prod.yml << EOF
services:
  nginx:
    image: nginx:alpine
    container_name: crm-nginx
    restart: unless-stopped
    depends_on:
      app_php:
        condition: service_started
        required: true
    ports:
      - "8080:8080"  # For ACME challenges and HTTP redirect
      - "8005:8005"  # Main HTTPS application port
    volumes:
      - ./docker/nginx/default.prod.conf:/etc/nginx/conf.d/default.conf:ro
      - ./letsencrypt:/etc/letsencrypt:ro
      - ./letsencrypt/www:/var/www/certbot:ro
      - ./public:/var/www/html/public:ro
      - ./logs/nginx:/var/log/nginx
    environment:
      - TZ=UTC
    networks:
      - app-network

  certbot:
    image: certbot/certbot:latest
    container_name: crm-certbot
    restart: "no"
    volumes:
      - ./letsencrypt:/etc/letsencrypt
      - ./letsencrypt/www:/var/www/certbot
    profiles:
      - tools
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
    name: crm-network

volumes:
  letsencrypt:
    driver: local
EOF

    echo "✅ Docker compose updated"
}

# Test HTTPS on port 8005
test_https_8005() {
    echo "🧪 Testing HTTPS setup on port 8005..."

    sleep 5

    # Test HTTPS connectivity
    echo -n "🔍 Testing HTTPS connectivity: "
    if curl -k -s -I "https://$DOMAIN:8005" | grep -q "200\\|301\\|302"; then
        echo "✅ PASSED"
    else
        echo "❌ FAILED"
    fi

    # Test certificate
    echo "🔍 SSL Certificate info:"
    echo | openssl s_client -connect $DOMAIN:8005 -servername $DOMAIN 2>/dev/null | openssl x509 -noout -subject -dates
}

# Show current port 80 usage
show_port_80_usage() {
    echo "🔍 Checking what's using port 80..."
    echo "================================="

    if sudo netstat -tlnp | grep ':80 ' >/dev/null; then
        echo "Port 80 is in use by:"
        sudo netstat -tlnp | grep ':80 '
        echo ""
        echo "Docker containers with port 80:"
        docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Image}}" | grep ":80"
    else
        echo "Port 80 is not in use"
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
    "check-port")
        show_port_80_usage
        ;;
    "test")
        test_https_8005
        ;;
    *)
        echo "Usage: $0 {dns|proxy|check-port|test}"
        echo ""
        echo "🔐 HTTPS Setup Methods for Port 8005:"
        echo "  dns        - Use DNS challenge (recommended - no port 80 needed)"
        echo "  proxy      - Use existing reverse proxy for ACME challenges"
        echo "  check-port - Check what's using port 80"
        echo "  test       - Test HTTPS functionality"
        echo ""
        echo "📋 Target Configuration:"
        echo "   Domain: $DOMAIN"
        echo "   Current: http://$DOMAIN:8005"
        echo "   Target:  https://$DOMAIN:8005"
        echo ""
        echo "💡 Recommended: ./ssl-setup.sh dns"
        ;;
esac
