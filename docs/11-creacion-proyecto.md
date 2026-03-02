# Guía Paso a Paso para Crear el Proyecto

> Docker: para entrar al contenedor y ver los archivos desplegados (NGINX en `/usr/share/nginx/html`), ver [12-contenedor.md](12-contenedor.md).

> Rutas y navegación (RouterView, guards, layout autenticado): ver [13-rutas.md](13-rutas.md).

Este documento detalla el paso a paso para crear el proyecto desde cero, siguiendo las mejores prácticas y la arquitectura Clean.

---

## **1. Crear el Proyecto Base**

1. **Inicializar el proyecto con Vite**:
   ```bash
   npm create vite@latest frontend-productos -- --template vue-ts
   cd frontend-productos
   ```
2. **Instalar dependencias principales**:
   ```bash
   npm install vue-router@4 pinia axios @tanstack/vue-query primevue primeicons vee-validate zod
   npm install -D @vitejs/plugin-vue rollup-plugin-visualizer rollup-plugin-obfuscator
   ```

---

## **2. Configurar el Proyecto**

1. **Configurar Vite**:
   - Edita `vite.config.ts` para incluir:
     - Alias `@` para rutas más limpias.
     - Configuración de `manualChunks` para dividir el código.
     - Plugins como `rollup-plugin-visualizer` y `rollup-plugin-obfuscator`.

2. **Crear archivos de entorno**:
   - Crea `.env.development`, `.env.production` y `.env.devlocal` para definir variables como `VITE_API_URL`.

---

## **3. Crear la Estructura del Proyecto**

1. **Crear carpetas base**:
   - Crea las siguientes carpetas dentro de `src`:
     ```
     /src
       /assets
       /components
       /core
         /application
           /use-cases
         /domain
           /entities
           /repositories
         /infrastructure
           /http
           /repositories
       /modules
         /auth
         /categories
         /products
         /shared
       /router
     ```

2. **Crear archivos iniciales**:
   - `src/main.ts`: Configura Vue, Vue Router, Pinia y PrimeVue.
   - `src/App.vue`: Define el contenedor principal de la aplicación.
   - `src/router/index.ts`: Configura las rutas principales.

---

## **4. Implementar la Lógica del Dominio**

1. **Crear entidades y contratos**:
   - En `src/core/domain/entities`, crea las entidades principales:
     - `Category.ts`
     - `Product.ts`
   - En `src/core/domain/repositories`, define los contratos:
     - `CategoryRepository.ts`
     - `ProductRepository.ts`

2. **Crear casos de uso**:
   - En `src/core/application/use-cases`, implementa los casos de uso:
     - `CategoryUseCases.ts`
     - `ProductUseCases.ts`

---

## **5. Implementar la Infraestructura**

1. **Configurar Axios**:
   - En `src/infrastructure/http/axiosClient.ts`, configura el cliente HTTP con `baseURL` y manejo de tokens JWT.

2. **Crear repositorios concretos**:
   - En `src/infrastructure/repositories`, implementa los repositorios:
     - `CategoryApiRepository.ts`
     - `ProductApiRepository.ts`

3. **Configurar el contenedor de dependencias**:
   - En `src/infrastructure/container.ts`, registra las dependencias.

---

## **6. Crear la Interfaz de Usuario**

1. **Crear módulos por funcionalidad**:
   - En `src/modules`, organiza los módulos:
     - `auth`: Manejo de autenticación.
     - `categories`: Gestión de categorías.
     - `products`: Gestión de productos.

2. **Crear componentes y páginas**:
   - En cada módulo, crea las carpetas `components`, `composables` y `pages`.
   - Ejemplo para categorías:
     - `components/CategoryForm.vue`
     - `pages/CategoryPage.vue`
     - `composables/useCategories.ts`

3. **Configurar rutas**:
   - En `src/router/index.ts`, define las rutas para cada módulo con lazy loading:
     ```javascript
     {
       path: '/categories',
       component: () => import('@/modules/categories/pages/CategoryPage.vue'),
     }
     ```

---

## **7. Configurar PrimeVue**

1. **Registrar PrimeVue**:
   - En `src/main.ts`, importa y configura PrimeVue:
     ```javascript
     import PrimeVue from 'primevue/config';
     import 'primevue/resources/themes/saga-blue/theme.css';
     import 'primevue/resources/primevue.min.css';
     import 'primeicons/primeicons.css';

     app.use(PrimeVue);
     ```

2. **Registrar componentes específicos**:
   - Registra solo los componentes necesarios para optimizar el rendimiento.

---

## **8. Validar y Optimizar**

1. **Ejecutar el proyecto en desarrollo**:
   ```bash
   npm run dev
   ```

2. **Construir para producción**:
   ```bash
   npm run build
   ```

3. **Analizar el bundle**:
   ```bash
   npm run build:analyze
   ```

---

## **Orden de Creación de Componentes**

1. **Estructura base**:
   - Configura `main.ts`, `App.vue` y `router/index.ts`.
2. **Dominio**:
   - Crea entidades y contratos en `core/domain`.
3. **Casos de uso**:
   - Implementa lógica de negocio en `core/application/use-cases`.
4. **Infraestructura**:
   - Configura Axios y repositorios en `infrastructure`.
5. **Módulos**:
   - Crea módulos funcionales (`auth`, `categories`, `products`) con sus componentes, páginas y composables.
6. **UI**:
   - Integra PrimeVue y crea componentes reutilizables.

---

Siguiendo este paso a paso, podrás construir el proyecto de manera organizada, asegurando que cada capa y componente cumpla su propósito dentro de la arquitectura Clean.