# Frontend Productos - Vue 3.5 Clean Architecture

Proyecto de mantenimiento de categorías y productos con:

- Vue 3.5 + Vite + TypeScript
- Composition API + `<script setup>`
- Vue Router + Pinia
- Axios + TanStack Query + JWT
- PrimeVue
- VeeValidate + Zod
- ESLint + Prettier
- Docker + NGINX + Docker Compose

Archivo de orquestación Docker Compose: `compose.yml`.

Guía para inspeccionar el contenedor y ver los archivos desplegados:

- `docs/12-contenedor.md`

Guía de rutas, `<RouterView />` y navegación:

- `docs/13-rutas.md`

## Configuración de entorno

- Desarrollo (`npm run dev`): `.env.development` → `VITE_API_URL=http://localhost:9090`
- Producción (`npm run build` / `npm run preview`): `.env.production` → `VITE_API_URL=http://localhost:8080`
- Local (`npm run dev:local`): `.env.devlocal` → `VITE_API_URL=http://localhost:3000`
- Referencia base: `.env.example`

## Ejecución por ambiente

### Desarrollo

```powershell
npm install
npm run dev
```

### Local

```powershell
npm install
npm run dev:local
```

### Producción

```powershell
npm install
npm run build
npm run preview
```

> `npm run build` genera la versión optimizada y `npm run preview` la sirve localmente.

## Scripts

- `npm run dev`
- `npm run dev:local`
- `npm run lint`
- `npm run build`
- `npm run build:analyze`
- `npm run preview`

## Docker

### Opción A: docker build / docker run

```bash
docker build -t frontend-productos .

docker run -d -p 80:80 --name frontend-productos frontend-productos
```

App disponible en `http://localhost/`.

Para entrar al contenedor y ver los archivos desplegados (NGINX): ver `docs/12-contenedor.md`.

### Opción B: Docker Compose

```bash
docker compose up --build -d
```

Para apagar:

```bash
docker compose down
```

## Documentación para clase

- `docs/01-tecnico-paso-a-paso.md`
- `docs/02-tecnico-estructura-archivos.md`
- `docs/03-funcional-paso-a-paso.md`
- `docs/12-contenedor.md`
- `docs/13-rutas.md`
- `docs/06-checklist-prueba-manual-api.md`
