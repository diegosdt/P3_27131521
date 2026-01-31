# P3 - Bookstore (Monorepo)

Resumen de cambios realizados para evolucionar a Full Stack unificado:

- Se añadió un frontend sencillo con React + Vite en `/client` que consume la API existente.
- El servidor Express ahora sirve el `build` del frontend (`/client/dist`) cuando existe.
- Se hizo público `GET /books` con paginación y filtros (query params: page, limit, search, categoryId, minPrice, maxPrice, publisher, language, format).
- CI (GitHub Actions) fue actualizado para ejecutar `npm test` y construir el frontend (`cd client && npm ci && npm run build`).
- Se añadió `postinstall` y `build:client` al `package.json` para que el entorno de producción construya la app del cliente automáticamente.

Cómo ejecutar en desarrollo:

1. Backend
   - npm install
   - npm run dev

2. Frontend (desarrollo)
   - cd client
   - npm install
   - npm run dev

Cómo construir para producción (local):

- Desde la raíz: `npm run build:client` (construye `/client/dist`)
- Luego iniciar el servidor: `npm start`

Despliegue en Render (resumen):

- Comando de build: `npm install && npm run build:client`
- Comando start: `npm start`
- La app servirá frontend y backend desde la misma URL; la UI consumirá los endpoints (/auth, /books, /orders, ...).

Notas técnicas:

- La sesión se mantiene en `localStorage` (token JWT), y el carrito también persiste en `localStorage`.
- El flujo de checkout consume `POST /orders` y maneja errores de stock o de pago devolviendo mensajes claros.
- Se conservaron las rutas actuales del API para no romper pruebas existentes.

Siguientes pasos recomendados:

- Añadir pruebas E2E para el flujo de checkout y autenticación.
- Ajustar y ampliar el diseño del frontend según la estética requerida (colores, imágenes de portada, etc.).
