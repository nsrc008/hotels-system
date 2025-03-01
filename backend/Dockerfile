# Usar la imagen oficial de PHP 8.2 con Apache como base
# Esta imagen incluye PHP 8.2 y Apache preconfigurado, ideal para aplicaciones Laravel
FROM php:8.2-apache

# Instalar dependencias del sistema necesarias para extensiones de PHP y herramientas adicionales
# - apt-get update: Actualiza la lista de paquetes disponibles en el sistema Debian de la imagen
# - apt-get install: Instala paquetes específicos
# - libpng-dev, libjpeg-dev, libfreetype6-dev: Librerías para la extensión GD (procesamiento de imágenes)
# - libzip-dev: Para la extensión ZIP (compresión/descompresión)
# - unzip: Herramienta para descomprimir archivos
# - git: Para clonar repositorios si es necesario
# - libpq-dev: Librería para soporte de PostgreSQL en PHP
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev libzip-dev unzip git libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip pdo pdo_pgsql

# Habilitar el módulo de reescritura de Apache (rewrite)
# Esto permite usar URLs amigables en Laravel mediante el archivo .htaccess
RUN a2enmod rewrite

# Establecer ServerName para evitar advertencias de Apache al iniciarse
# "localhost" es un valor genérico que suprime mensajes innecesarios en los logs
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Configurar Apache para escuchar en todas las interfaces (0.0.0.0) y usar el puerto dinámico de Render ($PORT)
# Esto asegura que Apache esté accesible externamente y use el puerto asignado por Render (por defecto 10000)
RUN echo "Listen 0.0.0.0:${PORT:-80}" > /etc/apache2/ports.conf

# Aumentar el tiempo de espera de Apache a 120 segundos para evitar errores 502 por timeouts
# Esto da más tiempo a las solicitudes para completarse, especialmente bajo carga
RUN echo "Timeout 120" >> /etc/apache2/apache2.conf

# Configurar el archivo de host virtual por defecto (000-default.conf) para usar $PORT
# - VirtualHost *:${PORT:-80}: Escucha en todas las interfaces en el puerto definido por $PORT (80 como fallback)
# - ServerAdmin: Define un correo ficticio para el administrador del servidor
# - DocumentRoot: Apunta a /var/www/html/public, donde Laravel sirve los archivos públicos
# - Directory: Configura permisos y opciones para el directorio público de Laravel
# - ErrorLog y CustomLog: Define dónde se guardan los logs de errores y accesos
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

# Configurar el directorio raíz de Laravel (/var/www/html) en apache2.conf
# - Options Indexes FollowSymLinks: Permite listar directorios y seguir enlaces simbólicos
# - AllowOverride All: Habilita el uso de .htaccess para reglas de reescritura
# - Require all granted: Permite acceso sin restricciones (necesario para Render)
RUN echo "<Directory /var/www/html>" >> /etc/apache2/apache2.conf && \
    echo "    Options Indexes FollowSymLinks" >> /etc/apache2/apache2.conf && \
    echo "    AllowOverride All" >> /etc/apache2/apache2.conf && \
    echo "    Require all granted" >> /etc/apache2/apache2.conf && \
    echo "</Directory>" >> /etc/apache2/apache2.conf

# Establecer el directorio de trabajo en /var/www/html
# Esto es donde se copiarán los archivos de tu aplicación Laravel
WORKDIR /var/www/html

# Copiar todos los archivos del proyecto Laravel desde tu máquina al contenedor
# Incluye código fuente, composer.json, etc.
COPY . .

# Descargar e instalar Composer, la herramienta de gestión de dependencias de PHP
# - curl: Descarga el instalador de Composer desde su sitio oficial
# - php: Ejecuta el instalador y lo coloca en /usr/local/bin como "composer"
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Instalar las dependencias de Composer definidas en composer.json
# - --no-interaction: Evita preguntas interactivas durante la instalación
# - --prefer-dist: Usa archivos comprimidos para acelerar la instalación
# - --optimize-autoloader: Optimiza el autoloader para mejor rendimiento
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Copiar el script de entrada (entrypoint.sh) al contenedor
# Este script se ejecutará al iniciar el contenedor y puede incluir comandos adicionales
COPY entrypoint.sh /entrypoint.sh

# Dar permisos de ejecución al script de entrada
# Esto asegura que el script pueda ejecutarse cuando el contenedor arranque
RUN chmod +x /entrypoint.sh

# Establecer permisos para las carpetas de almacenamiento y caché de Laravel
# - chown: Cambia el propietario a www-data (usuario de Apache) para que pueda escribir
# - -R: Aplica recursivamente a subdirectorios
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Asegurarse de que la carpeta database tenga permisos adecuados
# - chmod 777: Da permisos completos (lectura, escritura, ejecución) a todos
# - chown: Asegura que www-data sea el propietario
RUN chmod -R 777 /var/www/html/database && chown -R www-data:www-data /var/www/html/database

# Crear y configurar el archivo .env con variables de entorno para Laravel
# - Usa variables de Render para la conexión a PostgreSQL
# - APP_DEBUG=true: Habilita mensajes de error detallados para depuración
# - php artisan key:generate: Genera una clave única para la aplicación
RUN echo "APP_NAME=Laravel" > .env && \
    echo "APP_ENV=production" >> .env && \
    echo "APP_DEBUG=false" >> .env && \
    echo "APP_URL=http://localhost" >> .env && \
    echo "DB_CONNECTION=pgsql" >> .env && \
    echo "DB_HOST=${DB_HOST}" >> .env && \
    echo "DB_PORT=${DB_PORT}" >> .env && \
    echo "DB_DATABASE=${DB_DATABASE}" >> .env && \
    echo "DB_USERNAME=${DB_USERNAME}" >> .env && \
    echo "DB_PASSWORD=${DB_PASSWORD}" >> .env && \
    php artisan key:generate

# Exponer el puerto dinámico definido por Render ($PORT)
# Esto le dice a Docker que el contenedor escucha en el puerto asignado por la variable $PORT
EXPOSE $PORT

# Definir el comando por defecto que se ejecuta al iniciar el contenedor
# /entrypoint.sh puede personalizar el arranque (ej. iniciar Apache con $PORT)
CMD ["/entrypoint.sh"]