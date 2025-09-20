#!/bin/sh

# SSL Initialization Script for Production
# This script creates dummy certificates so nginx can start

DOMAIN="pixicrm.barmagiat.com"
CERT_DIR="/etc/letsencrypt/live/$DOMAIN"

echo "🔧 Initializing SSL certificates for $DOMAIN"

# Create directories
mkdir -p "$CERT_DIR"
mkdir -p "/etc/letsencrypt/archive/$DOMAIN"

# Create dummy certificates
echo "📝 Creating temporary self-signed certificates..."

# Generate private key
openssl genrsa -out "$CERT_DIR/privkey.pem" 4096

# Generate certificate
openssl req -new -x509 -key "$CERT_DIR/privkey.pem" \
    -out "$CERT_DIR/fullchain.pem" \
    -days 3650 \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=$DOMAIN"

# Create symbolic links (like certbot does)
ln -sf "$CERT_DIR/fullchain.pem" "$CERT_DIR/cert.pem"
ln -sf "$CERT_DIR/privkey.pem" "$CERT_DIR/chain.pem"

# Set proper permissions
chmod 644 "$CERT_DIR/fullchain.pem"
chmod 644 "$CERT_DIR/cert.pem" 
chmod 600 "$CERT_DIR/privkey.pem"
chmod 644 "$CERT_DIR/chain.pem"

# Create renewal configuration directory
mkdir -p /etc/letsencrypt/renewal

echo "✅ Temporary certificates created successfully"
echo "📍 Certificate location: $CERT_DIR"
echo "🔍 Files created:"
ls -la "$CERT_DIR/"

echo ""
echo "⚠️  These are temporary self-signed certificates!"
echo "🚀 Run the SSL setup script to get real Let's Encrypt certificates."