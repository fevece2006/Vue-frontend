# Proyecto Vue 3.5 paso a paso (Técnico)

## 1) Crear el proyecto

```bash
npm create vite@latest frontend-productos -- --template vue-ts
cd frontend-productos
```

¿Para qué sirven estos comandos?

- `npm create vite@latest frontend-productos -- --template vue-ts`: crea el proyecto base con Vite, Vue 3 y TypeScript.
- `cd frontend-productos`: entra a la carpeta del proyecto para ejecutar instalaciones y scripts.

## 2) Instalar librerías principales

```bash
npm install vue-router@^4.5.1 pinia axios @tanstack/vue-query primevue @primeuix/themes primeicons vee-validate zod@^3.25.76 @vee-validate/zod
```

¿Para qué sirve este comando?

- Instala todas las dependencias funcionales del proyecto (navegación, estado, API, UI empresarial, validación de formularios).

¿Para qué sirve cada librería?

- `vue-router`: navegación entre páginas (rutas) con guards y lazy loading.
- `pinia`: manejo del estado global (por ejemplo, sesión/JWT).
- `axios`: cliente HTTP para consumir el backend REST.
- `@tanstack/vue-query`: caché, sincronización y manejo de estados de peticiones (loading/error/success).
- `primevue`: biblioteca de componentes UI empresariales.
- `@primeuix/themes`: temas visuales para PrimeVue (en este proyecto, Aura).
- `primeicons`: set de iconos para botones, menús y acciones.
- `vee-validate`: manejo de formularios reactivos y validación.
- `zod`: definición de esquemas y reglas de validación tipadas.
- `@vee-validate/zod`: puente entre VeeValidate y Zod para usar los esquemas directamente.

## 3) Configurar entornos

- **Desarrollo**: `.env.development` → `VITE_API_URL=http://localhost:9090`
- **Producción**: `.env.production` → `VITE_API_URL=http://localhost:8080`
- **Local**: `.env.devlocal` → `VITE_API_URL=http://localhost:3000`

Para el modo local, crea el archivo `.env.devlocal` con el siguiente contenido:

```dotenv
VITE_API_URL=http://localhost:3000
```

## 4) Instalar herramientas de calidad de código

```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-vue @typescript-eslint/parser @typescript-eslint/eslint-plugin vue-eslint-parser
```

¿Para qué sirve este comando?

- Instala herramientas de desarrollo para validar calidad de código y formateo automático.

¿Para qué sirve cada librería?

- `eslint`: detecta errores y malas prácticas en el código.
- `prettier`: formatea el código de manera uniforme.
- `eslint-config-prettier`: evita conflictos entre reglas de ESLint y Prettier.
- `eslint-plugin-vue`: reglas específicas para archivos `.vue`.
- `@typescript-eslint/parser`: permite que ESLint entienda sintaxis TypeScript.
- `@typescript-eslint/eslint-plugin`: reglas de calidad específicas para TypeScript.
- `vue-eslint-parser`: parser necesario para analizar correctamente SFCs de Vue (`.vue`).

## 5) Estructura Clean Architecture

Organiza `src` en capas:

- `core/domain`: entidades y contratos.
- `core/application`: casos de uso.
- `infrastructure`: axios, repositorios API, contenedor de dependencias.
- `modules`: UI por módulos (auth, categorías, productos).
- `router`: rutas y guards.

## 6) Configurar API + JWT

Configura en `src/infrastructure/http/axiosClient.ts`:

- `baseURL` con `VITE_API_URL`.
- interceptor para enviar `Authorization: Bearer <token>`.
- limpieza de token en `401`.

Crear archivo `.env`:

```bash
VITE_API_URL=http://localhost:3000/api
```

¿Para qué sirve?

- Define la URL base del backend para no dejarla fija en el código.
- Permite cambiar fácilmente el entorno (local, test, producción).

## 7) Configurar PrimeVue

En `src/main.ts`:

- `PrimeVue` con tema `Aura`.
- registrar componentes usados.
- importar `primeicons`.

## 8) Lazy loading

### Lazy Loading de Rutas

En `src/router/index.ts`:

- `component: () => import('...')` para cada página.

### Lazy Loading de Componentes

En páginas:

- `defineAsyncComponent(() => import('...Form.vue'))`.

### Integración con Vite (Chunking)

En `vite.config.ts`:

- `manualChunks` para separar `vendor-vue`, `vendor-data`, `vendor-ui`.

## 9) Formularios con VeeValidate + Zod

En cada formulario:

- definir esquema Zod.
- convertir con `toTypedSchema`.
- usar `useForm` y `defineField`.

## 10) Comandos de ejecución

### Desarrollo

```bash
npm run dev
```

¿Para qué sirve?

- Levanta el servidor de desarrollo con recarga en caliente (HMR).

### Lint

```bash
npm run lint
```

¿Para qué sirve?

- Ejecuta ESLint para validar estilo, errores y buenas prácticas.

### Build de producción

```bash
npm run build
```

¿Para qué sirve?

- Compila TypeScript y genera la versión optimizada en `dist/` para despliegue.

### Preview local de build

```bash
npm run preview
```

¿Para qué sirve?

- Ejecuta localmente la build de producción para validación previa al despliegue.

## 11) Docker + NGINX + Docker Compose

Archivo estándar usado en este proyecto:

- `compose.yml`

Levantar contenedor:

```bash
docker compose up --build -d
```

¿Para qué sirve?

- Construye la imagen Docker y levanta el contenedor en segundo plano.
- Publica la app en NGINX usando la configuración de `compose.yml`.

Apagar contenedor:

```bash
docker compose down
```

¿Para qué sirve?

- Detiene y elimina los contenedores creados por Docker Compose.

La aplicación queda disponible en:

- `http://localhost:8080`

## 12) Detalles de Configuración

### Configuración de Entornos
- **Archivos**: `.env.development`, `.env.production`, `.env.devlocal`.
- **Ubicación**: Raíz del proyecto.
- **Propósito**: Definir la variable `VITE_API_URL` para cada entorno.
- **Ejemplo**:

```dotenv
VITE_API_URL=http://localhost:3000
```

### Configuración de Axios
- **Archivo**: `src/infrastructure/http/axiosClient.ts`.
- **Propósito**: Configurar `baseURL` con `VITE_API_URL` y manejar tokens JWT.
- **Detalles**:
  - Interceptor para añadir `Authorization: Bearer <token>`.
  - Limpieza de token en caso de error `401`.

### Configuración de PrimeVue
- **Archivo**: `src/main.ts`.
- **Propósito**: Registrar PrimeVue con el tema `Aura` y componentes necesarios.
- **Detalles**:
  - Importar `primeicons`.
  - Registrar componentes específicos.

### Lazy Loading
- **Archivos**: `src/router/index.ts`, componentes en `src/modules`.
- **Propósito**: Implementar carga asíncrona de rutas y componentes.
- **Detalles**:
  - Rutas: `component: () => import('...')`.
  - Componentes: `defineAsyncComponent(() => import('...'))`.

### Chunking con Vite
- **Archivo**: `vite.config.ts`.
- **Propósito**: Dividir el código en chunks lógicos.
- **Detalles**:
  - Configuración de `manualChunks` para separar `vendor-vue`, `vendor-data`, `vendor-ui`.

### Docker y NGINX
- **Archivo**: `compose.yml`.
- **Propósito**: Configurar y desplegar la aplicación en un contenedor Docker con NGINX.
- **Detalles**:
  - Construcción de imagen con `docker compose up --build -d`.
  - Publicación en `http://localhost:8080`.