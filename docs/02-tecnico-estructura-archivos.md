# Estructura técnica del proyecto (explicada para clase)

## 1) Archivos de la raíz

### `package.json`

- ¿Qué hace?: declara scripts (`dev`, `build`, `lint`, etc.) y dependencias.
- ¿Para qué sirve?: es el punto de control del proyecto Node/Vue (instalación y ejecución).

### `vite.config.ts`

- ¿Qué hace?: configura Vite, alias `@` y separación de chunks (`manualChunks`).
- ¿Para qué sirve?: mejora imports, lazy loading y rendimiento de la build final.

### `.env.devlocal`

- ¿Qué hace?: define las variables de entorno para el modo local.
- ¿Para qué sirve?: permite ejecutar el proyecto con un backend local en `http://localhost:3000`.

### `tsconfig.app.json`

- ¿Qué hace?: define reglas de TypeScript para la aplicación.
- ¿Para qué sirve?: garantiza tipado fuerte y detección temprana de errores.

### `eslint.config.js`

- ¿Qué hace?: define reglas de lint para Vue + TypeScript.
- ¿Para qué sirve?: mantener calidad, consistencia y buenas prácticas del código.

### `.prettierrc`

- ¿Qué hace?: define formato de código (comillas, comas, ancho de línea).
- ¿Para qué sirve?: que todo el equipo escriba con el mismo estilo visual.

### `Dockerfile`

- ¿Qué hace?: construye la app y la publica con NGINX en una imagen Docker.
- ¿Para qué sirve?: desplegar el frontend en cualquier entorno de forma estandarizada.

### `compose.yml`

- ¿Qué hace?: define cómo levantar el contenedor del frontend.
- ¿Para qué sirve?: simplifica la ejecución local y de pruebas con Docker Compose.

### `nginx.conf`

- ¿Qué hace?: configura NGINX y redirige rutas SPA a `index.html`.
- ¿Para qué sirve?: evitar errores 404 al refrescar rutas de Vue Router.

## 2) Carpeta `src`

### `src/main.ts`

- ¿Qué hace?: inicia la app Vue y registra plugins globales (Router, Pinia, Query, PrimeVue).
- ¿Para qué sirve?: centraliza el arranque técnico de toda la aplicación.

### `src/App.vue`

- ¿Qué hace?: define el layout base (menú, zona de contenido y logout).
- ¿Para qué sirve?: ofrecer estructura visual común para todos los módulos.

### `src/router/index.ts`

- ¿Qué hace?: define rutas con lazy loading y guards por autenticación.
- ¿Para qué sirve?: controlar navegación y proteger páginas privadas con JWT.

## 3) Clean Architecture en `src/core`

### `src/core/domain`

- ¿Qué hace?: contiene entidades y contratos (interfaces) del negocio.
- ¿Para qué sirve?: aislar reglas del dominio sin depender de UI o librerías externas.

Archivos clave:

- `entities/Category.ts`: estructura de datos de categoría.
- `entities/Product.ts`: estructura de datos de producto.
- `repositories/*.ts`: contratos que la infraestructura debe implementar.

### `src/core/application`

- ¿Qué hace?: implementa casos de uso (acciones de negocio: listar, crear, editar, eliminar).
- ¿Para qué sirve?: orquestar reglas del dominio sin acoplarlas al framework.

Archivos clave:

- `use-cases/category/CategoryUseCases.ts`
- `use-cases/product/ProductUseCases.ts`

## 4) Infraestructura en `src/infrastructure`

### `http/axiosClient.ts`

- ¿Qué hace?: configura Axios con `baseURL` e interceptores JWT/401.
- ¿Para qué sirve?: centralizar comunicación con backend y seguridad de requests.

### `repositories/*ApiRepository.ts`

- ¿Qué hace?: implementa contratos del dominio usando API REST.
- ¿Para qué sirve?: separar detalles HTTP del resto del sistema.

### `container.ts`

- ¿Qué hace?: crea y exporta instancias de repositorios y casos de uso.
- ¿Para qué sirve?: resolver dependencias de forma simple y ordenada.

## 5) Presentación por módulos en `src/modules`

### `src/modules/auth`

- ¿Qué hace?: login y manejo de estado de sesión.
- ¿Para qué sirve?: autenticar usuario y guardar/eliminar JWT.

Archivos clave:

- `pages/LoginPage.vue`
- `stores/auth.store.ts`

### `src/modules/categories`

- ¿Qué hace?: pantalla, formulario y lógica de consulta/mutación de categorías.
- ¿Para qué sirve?: resolver el mantenimiento CRUD de categorías.

Archivos clave:

- `pages/CategoryPage.vue`
- `components/CategoryForm.vue`
- `composables/useCategories.ts`

### `src/modules/products`

- ¿Qué hace?: pantalla, formulario y lógica de consulta/mutación de productos.
- ¿Para qué sirve?: resolver el mantenimiento CRUD de productos.

Archivos clave:

- `pages/ProductPage.vue`
- `components/ProductForm.vue`
- `composables/useProducts.ts`

### `src/modules/shared/queryKeys.ts`

- ¿Qué hace?: centraliza llaves de caché de TanStack Query.
- ¿Para qué sirve?: evitar duplicidad y errores en invalidación/refetch.

## 6) Estilos globales

### `src/style.css`

- ¿Qué hace?: define layout global (shell, cards, headers, formularios).
- ¿Para qué sirve?: mantener consistencia visual sin romper el tema de PrimeVue.