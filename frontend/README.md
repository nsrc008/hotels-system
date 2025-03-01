# Frontend del Sistema de Gestión de Hoteles - README

Esta es la parte bonita de mi proyecto, hecha con React. Aquí puedes ver y manejar los hoteles desde una pantalla fácil de usar. Te explico cómo hacerlo funcionar en tu computadora.

## ¿Qué hace el frontend?
- Muestra una lista de hoteles y sus detalles.
- Te deja agregar, editar y eliminar hoteles y tipos de habitaciones.
- Habla con el backend para traer y guardar información.

## Requisitos
- **Git:** Para descargar el código.
- **Node.js y npm:** Para construir la pantalla (descarga desde [nodejs.org](https://nodejs.org)).
- **El backend funcionando:** Necesitas el backend listo (mira el README-backend.md).

## Paso a paso para ejecutar localmente

### 1. Entrar a la carpeta del frontend
1. Abre la "Terminal" (en Windows busca "cmd", en Mac o Linux usa la terminal).
2. Ve a la carpeta del frontend:
```
cd frontend
```

### 2. Instalar las dependencias
3. Escribe esto para que npm traiga todo lo necesario:
```
npm install
```

### 3. Configurar la conexión al backend
4. Crea un archivo `.env.development`:
- Abre Notepad y escribe:
```
VITE_API_URL=http://localhost:8000/api
```
- Guárdalo como `.env.development` en la carpeta `frontend/`.

### 4. Iniciar el frontend
5. Corre este comando:
```
npm run dev
```
- Verás algo como "Vite server running at http://localhost:5173". Abre esa dirección en tu navegador.
