FROM php:8.3-fpm

WORKDIR /var/www/html

# Install system dependencies first (these change rarely)
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions (depends on libs above)
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

# Install Redis via PECL (separate so cache works better)
RUN pecl install redis \
    && docker-php-ext-enable redis

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy only composer files first
COPY composer.json composer.lock ./
# Copy application code
COPY . .

# Install dependencies
RUN composer install --no-interaction --optimize-autoloader

# Copy application code with correct ownership
COPY --chown=www-data:www-data . .

# Set permissions for storage/cache
RUN chmod -R 775 storage bootstrap/cache

# Expose port
EXPOSE 9000
