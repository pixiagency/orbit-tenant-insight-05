FROM php:8.3-fpm

WORKDIR /var/www/html

# Install system dependencies first (rarely change)
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

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

# Install Redis
RUN pecl install redis \
    && docker-php-ext-enable redis

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# --- Dependency caching trick ---
# Copy only composer files first
COPY composer.json composer.lock ./

# Install dependencies without running scripts
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Now copy the full app
COPY --chown=www-data:www-data . .

# Run scripts and dump-autoload now that helpers.php exists
RUN composer dump-autoload --optimize

# Set permissions
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 9000
