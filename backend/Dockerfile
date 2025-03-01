# Usar la imagen oficial de PHP con Apache como base
FROM php:8.2-apache

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    unzip \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip pdo pdo_mysql

# Habilitar el módulo de reescritura de Apache
RUN a2enmod rewrite

# Establecer ServerName para suprimir la advertencia
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Configurar el archivo 000-default.conf
RUN echo "<VirtualHost *:80>" > /etc/apache2/sites-available/000-default.conf && \
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

# Configurar el DirectoryIndex en apache2.conf
RUN echo "<Directory /var/www/html>" >> /etc/apache2/apache2.conf && \
    echo "    Options Indexes FollowSymLinks" >> /etc/apache2/apache2.conf && \
    echo "    AllowOverride All" >> /etc/apache2/apache2.conf && \
    echo "    Require all granted" >> /etc/apache2/apache2.conf && \
    echo "</Directory>" >> /etc/apache2/apache2.conf

# Establecer el directorio de trabajo
WORKDIR /var/www/html

# Copiar los archivos de la aplicación Laravel al contenedor
COPY . .

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Publicar la configuración de CORS
RUN php artisan vendor:publish --provider="Fruitcake\Cors\ServiceProvider"

# Instalar dependencias de Composer
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Establecer permisos para Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Asegurarse de que la base de datos tenga los permisos correctos
RUN chmod -R 777 /var/www/html/database && \
    chown -R www-data:www-data /var/www/html/database

# Configurar el entorno de Laravel
COPY .env.example .env
RUN php artisan key:generate

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto al ejecutar el contenedor
CMD ["apache2-foreground"]
