# Backend del Sistema de Gestión de Hoteles - README

Esta es la parte del "cerebro" de mi proyecto, hecha con Laravel. Aquí guardo la información de los hoteles y controlo todo lo que pasa detrás de escena. Te explico cómo hacerlo funcionar en tu computadora o en la nube con Render, paso a pasito.

## ¿Qué hace el backend?

-   Guarda hoteles y tipos de habitaciones en una base de datos PostgreSQL.
-   Responde a las peticiones del frontend (como "dame la lista de hoteles").
-   Tiene reglas para no pasarse del número de habitaciones permitido.

## Requisitos

-   **Git:** Para descargar el código.
-   **Docker:** Para que todo sea fácil de correr.
-   **Composer:** Para instalar las herramientas de PHP.
-   **PostgreSQL:** La base de datos (puedes instalarla o usar Docker).
-   **PHP 8.2:** Necesario para Laravel 12.

## Paso a paso para ejecutar localmente

### 1. Entrar a la carpeta del backend

1. Abre la "Terminal" (en Windows busca "cmd", en Mac o Linux usa la terminal).
2. Ve a la carpeta del backend:
```
   cd backend
```
### 2. Instalar las dependencias

3. Escribe esto para que Composer traiga todo lo necesario:
```
   composer install
```
### 3. Configurar la base de datos

4. **Instala PostgreSQL (si no usas Docker):**

-   Descarga desde [postgresql.org](https://www.postgresql.org/download/).
-   Durante la instalación, usa el puerto `5432` y una contraseña como `mipassword123`.

5. **Crea una base de datos:**

-   Abre la terminal y escribe:
  ```
    "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres
  ```
-   Usa tu contraseña (`mipassword123`), luego escribe:
  ```
    CREATE DATABASE hotel_db;
    \q
  ```

6. **Configura el archivo `.env`:**

-   Copia `.env.example` a `.env`:
  ```
    copy .env.example .env
  ```

-   Abre `.env` con un editor (como Notepad) y cambia estas líneas:
  ```
    DB_CONNECTION=pgsql
    DB_HOST=127.0.0.1
    DB_PORT=5432
    DB_DATABASE=hotel_db
    DB_USERNAME=postgres
    DB_PASSWORD=mipassword123
  ```

### 4. Crear las tablas

7. Corre este comando para hacer las tablas:
   ```
   php artisan migrate
   ```

-   Si ves mensajes como "Migrated", ¡funcionó!

### 5. Iniciar el backend

8. Inicia el servidor:
   ```
   php artisan serve
   ```

-   Verás algo como "Server running on http://127.0.0.1:8000". Déjalo abierto.
