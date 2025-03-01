# Sistema de Gestión de Hoteles - README General

Este es un proyecto que hice para ayudar a gestionar hoteles. Tiene dos partes: el "backend" (que guarda y organiza la información como una base de datos) y el "frontend" (la parte que ves en la pantalla, como listas y formularios). Usé Laravel para el backend y React para el frontend, y todo está guardado en la nube con Render. Aquí te explico cómo funciona y cómo hacerlo funcionar tú misma.

## ¿Qué hace este proyecto?

- **Hoteles:** Puedes agregar, ver, editar y eliminar hoteles con detalles como nombre, dirección, ciudad, NIT y número de habitaciones.
- **Tipos de habitación:** Cada hotel tiene tipos de habitaciones (como "Estándar", "Junior" o "Suite") con acomodaciones (sencilla, doble, etc.) y cantidades.
- **Reglas:** Hay una regla especial que no deja agregar más habitaciones de las que el hotel tiene en total.

## Estructura del proyecto

- **backend/**: Aquí está el cerebro del proyecto, hecho con Laravel. Maneja la base de datos y responde a las peticiones del frontend.
- **frontend/**: Aquí está la cara bonita, hecha con React. Muestra la información y te deja interactuar con ella.
- **Base de datos/**: Usamos PostgreSQL para guardar todo.

## Requisitos para ejecutarlo

Necesitarás estas herramientas en tu computadora:

1. **Git:** Para descargar el código (es como una caja fuerte para programadores).
2. **Docker:** Para hacer que todo funcione como en una cajita mágica.
3. **Composer:** Para el backend (es como un ayudante para instalar cosas en PHP).
4. **Node.js y npm:** Para el frontend (como Lego para construir la pantalla).

## Cómo ejecutarlo

### Paso 1: Descargar el proyecto

1. Abre la "Terminal" (en Windows busca "cmd" o "PowerShell", en Mac o Linux usa la terminal).
2. Escribe esto para descargar el proyecto:
```
git clone https://github.com/nsrc008/hotels-system.git
```
4. Entra a la carpeta:


### Paso 2: Preparar el backend
- Mira el archivo **README-backend.md** en la carpeta `backend/`. Ahí te explico cómo hacer que el cerebro funcione.

### Paso 3: Preparar el frontend
- Mira el archivo **README-frontend.md** en la carpeta `frontend/`. Ahí te explico cómo hacer la parte bonita.
