FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev libzip-dev unzip git libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip pdo pdo_pgsql

RUN a2enmod rewrite
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN echo "Listen 0.0.0.0:${PORT:-80}" > /etc/apache2/ports.conf
RUN echo "Timeout 120" >> /etc/apache2/apache2.conf

RUN echo "<VirtualHost *:${PORT:-80}>" > /etc/apache2/sites-available/000-default.conf && \
    echo "    ServerAdmin webmaster@localhost" >> /etc/apache2/sites-available/000-default.conf && \
    echo "    DocumentRoot /var/www/html/public" >> /etc/apache2/sites-available/000-default.conf && \
    echo "    <Directory /var/www/html/public>" >> /etc/apache2/sites-available/000-default.conf && \
    echo "        Options Indexes FollowSymLinks" >> /etc/apache2/sites-available/000-default.conf && \
    echo "        AllowOverride All" >> /etc/apache2/sites-available/000-default.conf && \
    echo "        Require all granted" >> /etc/apache2/sites-available/000-default.conf && \
    echo "    </Directory>" >> /etc/apache2/sites-available/000-default.conf && \
    echo "    ErrorLog \${APACHE_LOG_DIR}/error.log" >> /etc/apache2/sites-available/000-default.conf && \
    echo "    CustomLog \${APACHE_LOG_DIR}/access.log combined" >> /etc/apache2/sites-available/000-default.conf && \
    echo "</VirtualHost>" >> /etc/apache2/sites-available/000-default.conf

RUN echo "<Directory /var/www/html>" >> /etc/apache2/apache2.conf && \
    echo "    Options Indexes FollowSymLinks" >> /etc/apache2/apache2.conf && \
    echo "    AllowOverride All" >> /etc/apache2/apache2.conf && \
    echo "    Require all granted" >> /etc/apache2/apache2.conf && \
    echo "</Directory>" >> /etc/apache2/apache2.conf

WORKDIR /var/www/html
COPY . .
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 777 /var/www/html/database && chown -R www-data:www-data /var/www/html/database

RUN echo "APP_NAME=Laravel" > .env && \
    echo "APP_ENV=production" >> .env && \
    echo "APP_DEBUG=true" >> .env && \
    echo "APP_URL=http://localhost" >> .env && \
    echo "DB_CONNECTION=pgsql" >> .env && \
    echo "DB_HOST=${DB_HOST}" >> .env && \
    echo "DB_PORT=${DB_PORT}" >> .env && \
    echo "DB_DATABASE=${DB_DATABASE}" >> .env && \
    echo "DB_USERNAME=${DB_USERNAME}" >> .env && \
    echo "DB_PASSWORD=${DB_PASSWORD}" >> .env && \
    php artisan key:generate

EXPOSE $PORT
CMD ["/entrypoint.sh"]