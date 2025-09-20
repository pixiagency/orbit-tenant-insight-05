#!/bin/bash
set -e

DOMAIN="pixicrm.barmagiat.com"
EMAIL="admin@$DOMAIN"
NGINX_CONF="./docker/nginx/default.prod.conf"
COMPOSE_FILE="docker-compose.prod.yml"

# Ensure folders exist
mkdir -p ./letsencrypt/www ./letsencrypt/live ./docker/nginx

# Step 1: Write docker-compose.prod.yml with custom ports
cat > $COMPOSE_FILE <<EOF
services:
  nginx:
    image: nginx:stable
    container_name: crm-nginx
    depends_on:
      app_php:
        condition: service_started
        required: true
    ports:
      - "8080:80"
      - "8443:443"
    volumes:
      - ./docker/nginx/default.prod.conf:/etc/nginx/conf.d/default.conf
      - ./letsencrypt:/etc/letsencrypt
      - ./letsencrypt/www:/var/www/certbot

  certbot:
    image: certbot/certbot:latest
    container_name: laravel-certbot
    volumes:
      - ./letsencrypt:/etc/letsencrypt
      - ./letsencrypt/www:/var/www/certbot
    entrypoint: >
      /bin/sh -c 'trap exit TERM;
      while :;
      do certbot renew --webroot -w /var/www/certbot && docker exec crm-nginx nginx -s reload;
      sleep 12h;
      done'
EOF

# Step 2: Write initial HTTP-only nginx config
cat > $NGINX_CONF <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://app_php:80;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location ~ /.well-known/acme-challenge {
        root /var/www/certbot;
    }
}
EOF

# Step 3: Start nginx for validation
docker compose -f $COMPOSE_FILE up -d nginx

# Step 4: Request initial SSL cert
docker run --rm \
  -v $(pwd)/letsencrypt:/etc/letsencrypt \
  -v $(pwd)/letsencrypt/www:/var/www/certbot \
  certbot/certbot certonly --webroot -w /var/www/certbot \
  -d $DOMAIN --email $EMAIL --agree-tos --no-eff-email

# Step 5: Write HTTPS-enabled nginx config
cat > $NGINX_CONF <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$host:8443\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://app_php:80;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Step 6: Restart stack with HTTPS
docker compose -f $COMPOSE_FILE down
docker compose -f $COMPOSE_FILE up -d

echo "✅ SSL setup complete!"
echo "Access your project at: https://$DOMAIN:8443"
