#!/bin/bash

# Verificar si las migraciones ya se han ejecutado
if [ ! -f "/var/www/html/database/.migrations_loaded" ]; then
    echo "Ejecutando migraciones de Laravel..."
    php artisan migrate --force
    if [ $? -eq 0 ]; then
        echo "Migraciones ejecutadas exitosamente."
        # Opcional: Ejecutar seeders para datos iniciales
        php artisan db:seed --force
        echo "Seeders ejecutados exitosamente."
        touch /var/www/html/database/.migrations_loaded
    else
        echo "Error al ejecutar las migraciones."
        exit 1
    fi
else
    echo "Las migraciones ya están cargadas."
fi

# Iniciar Apache
apache2-foreground -DPORT=${PORT:-80}