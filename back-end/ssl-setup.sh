#!/bin/bash

DOMAIN="pixicrm.barmagiat.com"
EMAIL="tools@mijra.io"
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"

echo "🔒 SSL Setup for $DOMAIN (Port 8005 Configuration)"
echo "=================================================="

# Get certificates using HTTP-01 challenge on port 80
get_certificates_port_80() {
    echo "🔐 Getting SSL certificates for $DOMAIN..."
    echo "📋 Current setup: http://$DOMAIN:8005"
    echo "🎯 Target setup: https://$DOMAIN:8005"

    # Stop nginx temporarily to free port 80
    echo "🛑 Temporarily stopping nginx to use port 80 for challenge..."
    docker-compose $COMPOSE_FILES stop nginx

    # Wait a moment
    sleep 3

    # Create directories
    mkdir -p ./letsencrypt/live
    mkdir -p ./letsencrypt/archive

    # Get certificates using standalone mode on port 80
    echo "📞 Requesting certificates from Let's Encrypt..."
    docker run --rm \
        -p 80:80 \
        -p 443:443 \
        -v $(pwd)/letsencrypt:/etc/letsencrypt \
        certbot/certbot \
        certonly \
        --standalone \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --expand \
        -d $DOMAIN

    if [ $? -eq 0 ]; then
        echo "🎉 Certificates obtained successfully!"

        # Find certificate directory
        CERT_DIR=$(ls -1 "./letsencrypt/live/" | grep "^$DOMAIN" | head -1)
        if [ -n "$CERT_DIR" ]; then
            echo "📁 Certificate directory: $CERT_DIR"

            # Update nginx config for port 8005
            create_nginx_config_8005 "$CERT_DIR"

            # Update docker compose for port 8005
            update_docker_compose_8005

            # Start services
            echo "🚀 Starting services with HTTPS on port 8005..."
            docker-compose $COMPOSE_FILES up -d

            sleep 10

            echo "✅ SSL setup complete!"
            echo "🌐 Your application is now available at:"
            echo "   HTTP:  http://$DOMAIN:8005 (redirects to HTTPS)"
            echo "   HTTPS: https://$DOMAIN:8005 ✅"

            # Test the setup
            test_https_8005
        else
            echo "❌ Certificate directory not found"
            docker-compose $COMPOSE_FILES start nginx
        fi
    else
        echo "❌ Failed to get certificates"
        echo "🚀 Restarting nginx..."
        docker-compose $COMPOSE_FILES start nginx
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
# HTTP server on port 8005 - redirects to HTTPS
server {
    listen 8005;
    server_name $DOMAIN;
    root /var/www/html/public;

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }

    # Redirect to HTTPS on same port
    location / {
        return 301 https://\$host:8005\$request_uri;
    }
}

# HTTPS server on port 8005
server {
    listen 8005 ssl http2;
    server_name $DOMAIN;
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

# Additional server block for ACME challenges on port 80 (when needed)
server {
    listen 80;
    server_name $DOMAIN;

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

    echo "✅ Nginx configuration created for port 8005"
}

# Update docker compose for port 8005
update_docker_compose_8005() {
    echo "🔧 Updating docker-compose for port 8005..."

    # Update docker-compose.prod.yml to use port 8005 for both HTTP and HTTPS
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
      - "80:80"      # For ACME challenges
      - "8005:8005"  # Main application port (HTTP + HTTPS)
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

    echo "✅ Docker compose updated for port 8005"
}

# Test HTTPS on port 8005
test_https_8005() {
    echo "🧪 Testing HTTPS setup..."

    sleep 5

    # Test HTTP redirect
    echo -n "🔍 Testing HTTP to HTTPS redirect: "
    if curl -s -I "http://$DOMAIN:8005" | grep -q "301"; then
        echo "✅ PASSED"
    else
        echo "❌ FAILED"
    fi

    # Test HTTPS connectivity
    echo -n "🔍 Testing HTTPS connectivity: "
    if curl -k -s -I "https://$DOMAIN:8005" | grep -q "200\\|301\\|302"; then
        echo "✅ PASSED"
    else
        echo "❌ FAILED"
    fi

    # Test certificate
    echo "🔍 Testing SSL certificate:"
    echo | openssl s_client -connect $DOMAIN:8005 -servername $DOMAIN 2>/dev/null | openssl x509 -noout -subject -dates
}

# Renew certificates
renew_certificates() {
    echo "🔄 Renewing certificates..."

    # Stop nginx temporarily
    docker-compose $COMPOSE_FILES stop nginx

    # Renew using standalone
    docker run --rm \
        -p 80:80 \
        -p 443:443 \
        -v $(pwd)/letsencrypt:/etc/letsencrypt \
        certbot/certbot \
        renew

    # Start nginx
    docker-compose $COMPOSE_FILES start nginx

    echo "✅ Certificate renewal complete"
}

# Show status
show_status() {
    echo "📊 SSL Status for $DOMAIN:8005"
    echo "=============================="

    # Find certificate directory
    CERT_DIR=$(ls -1 "./letsencrypt/live/" 2>/dev/null | grep "^$DOMAIN" | head -1)

    if [ -n "$CERT_DIR" ] && [ -f "./letsencrypt/live/$CERT_DIR/fullchain.pem" ]; then
        echo "📜 Certificate exists: $CERT_DIR"

        # Check expiration
        echo "📅 Certificate expiration:"
        openssl x509 -in "./letsencrypt/live/$CERT_DIR/fullchain.pem" -noout -dates

        # Check if it's from Let's Encrypt
        if openssl x509 -in "./letsencrypt/live/$CERT_DIR/fullchain.pem" -text -noout | grep -q "Let's Encrypt"; then
            echo "✅ Certificate is from Let's Encrypt"
        else
            echo "⚠️  Certificate type unknown"
        fi
    else
        echo "❌ No certificate found"
    fi

    echo ""
    echo "🐳 Container status:"
    docker-compose $COMPOSE_FILES ps

    echo ""
    echo "🌐 Application URLs:"
    echo "   HTTP:  http://$DOMAIN:8005 (redirects to HTTPS)"
    echo "   HTTPS: https://$DOMAIN:8005"

    # Test current status
    test_https_8005
}

case "$1" in
    "setup")
        echo "🏁 Setting up HTTPS for $DOMAIN:8005..."
        get_certificates_port_80
        ;;
    "renew")
        renew_certificates
        ;;
    "status")
        show_status
        ;;
    "test")
        test_https_8005
        ;;
    *)
        echo "Usage: $0 {setup|renew|status|test}"
        echo ""
        echo "🔐 HTTPS Setup for Port 8005:"
        echo "  setup   - Get SSL certificates and configure HTTPS"
        echo "  renew   - Renew existing certificates"
        echo "  status  - Show certificate and service status"
        echo "  test    - Test HTTPS functionality"
        echo ""
        echo "📋 Configuration:"
        echo "   Domain: $DOMAIN"
        echo "   Current: http://$DOMAIN:8005"
        echo "   Target:  https://$DOMAIN:8005"
        ;;
esac
