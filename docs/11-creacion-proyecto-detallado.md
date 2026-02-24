# Guía Detallada para Crear el Proyecto

Este documento proporciona una guía ampliada y detallada para crear el proyecto desde cero, explicando cada paso y cómo implementarlo.

---

## **1. Crear el Proyecto Base**

1. **Inicializar el proyecto con Vite**:
   - Ejecuta el siguiente comando en la terminal para crear un nuevo proyecto con Vite y TypeScript:
     ```bash
     npm create vite@latest frontend-productos -- --template vue-ts
     ```
   - Cambia al directorio del proyecto:
     ```bash
     cd frontend-productos
     ```

2. **Instalar dependencias principales**:
   - Instala las bibliotecas necesarias para el proyecto:
     ```bash
     npm install vue-router@4 pinia axios @tanstack/vue-query primevue primeicons vee-validate zod
     ```
   - Instala dependencias de desarrollo:
     ```bash
     npm install -D @vitejs/plugin-vue rollup-plugin-visualizer rollup-plugin-obfuscator
     ```

---

## **2. Configurar el Proyecto**

1. **Configurar Vite**:
   - Abre el archivo `vite.config.ts` y realiza las siguientes modificaciones:
     - Agrega un alias para rutas más limpias:
       ```typescript
       import { defineConfig } from 'vite';
       import vue from '@vitejs/plugin-vue';
       import path from 'path';

       export default defineConfig({
         plugins: [vue()],
         resolve: {
           alias: {
             '@': path.resolve(__dirname, './src'),
           },
         },
       });
       ```
     - Configura `manualChunks` para dividir el código:
       ```typescript
       build: {
         rollupOptions: {
           output: {
             manualChunks: {
               vendor: ['vue', 'vue-router', 'pinia'],
             },
           },
         },
       },
       ```

2. **Crear archivos de entorno**:
   - Crea los archivos `.env.development`, `.env.production` y `.env.devlocal` en la raíz del proyecto.
   - Define variables como `VITE_API_URL` en cada archivo:
     ```env
     VITE_API_URL=http://localhost:3000/api
     ```

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
   - **`src/main.ts`**:
     - Configura Vue, Vue Router, Pinia y PrimeVue:
       ```typescript
       import { createApp } from 'vue';
       import App from './App.vue';
       import router from './router';
       import { createPinia } from 'pinia';
       import PrimeVue from 'primevue/config';

       import 'primevue/resources/themes/saga-blue/theme.css';
       import 'primevue/resources/primevue.min.css';
       import 'primeicons/primeicons.css';

       const app = createApp(App);

       app.use(router);
       app.use(createPinia());
       app.use(PrimeVue);

       app.mount('#app');
       ```

   - **`src/App.vue`**:
     - Define el contenedor principal de la aplicación:
       ```vue
       <template>
         <router-view />
       </template>

       <script setup>
       </script>

       <style>
       /* Estilos globales */
       </style>
       ```

   - **`src/router/index.ts`**:
     - Configura las rutas principales:
       ```typescript
       import { createRouter, createWebHistory } from 'vue-router';

       const routes = [
         {
           path: '/',
           component: () => import('@/modules/shared/pages/HomePage.vue'),
         },
       ];

       const router = createRouter({
         history: createWebHistory(),
         routes,
       });

       export default router;
       ```

---

## **4. Implementar la Lógica del Dominio**

1. **Crear entidades y contratos**:
   - En `src/core/domain/entities`, crea las entidades principales:
     - **`Category.ts`**:
       ```typescript
       export class Category {
         constructor(public id: string, public name: string) {}
       }
       ```
     - **`Product.ts`**:
       ```typescript
       export class Product {
         constructor(public id: string, public name: string, public price: number) {}
       }
       ```

   - En `src/core/domain/repositories`, define los contratos:
     - **`CategoryRepository.ts`**:
       ```typescript
       import { Category } from '../entities/Category';

       export interface CategoryRepository {
         getAll(): Promise<Category[]>;
         create(category: Category): Promise<void>;
       }
       ```
     - **`ProductRepository.ts`**:
       ```typescript
       import { Product } from '../entities/Product';

       export interface ProductRepository {
         getAll(): Promise<Product[]>;
         create(product: Product): Promise<void>;
       }
       ```

2. **Crear casos de uso**:
   - En `src/core/application/use-cases`, implementa los casos de uso:
     - **`CategoryUseCases.ts`**:
       ```typescript
       import { CategoryRepository } from '@/core/domain/repositories/CategoryRepository';
       import { Category } from '@/core/domain/entities/Category';

       export class CategoryUseCases {
         constructor(private categoryRepo: CategoryRepository) {}

         async getAllCategories(): Promise<Category[]> {
           return this.categoryRepo.getAll();
         }
       }
       ```

---

## **5. Implementar la Infraestructura**

1. **Configurar Axios**:
   - En `src/infrastructure/http/axiosClient.ts`, configura el cliente HTTP:
     ```typescript
     import axios from 'axios';

     const axiosClient = axios.create({
       baseURL: import.meta.env.VITE_API_URL,
       headers: {
         'Content-Type': 'application/json',
       },
     });

     export default axiosClient;
     ```

2. **Crear repositorios concretos**:
   - En `src/infrastructure/repositories`, implementa los repositorios:
     - **`CategoryApiRepository.ts`**:
       ```typescript
       import { CategoryRepository } from '@/core/domain/repositories/CategoryRepository';
       import { Category } from '@/core/domain/entities/Category';
       import axiosClient from '../http/axiosClient';

       export class CategoryApiRepository implements CategoryRepository {
         async getAll(): Promise<Category[]> {
           const response = await axiosClient.get('/categories');
           return response.data;
         }

         async create(category: Category): Promise<void> {
           await axiosClient.post('/categories', category);
         }
       }
       ```

---

Siguiendo esta guía detallada, podrás implementar cada paso del proyecto con claridad y precisión, asegurando que cada capa y componente cumpla su propósito dentro de la arquitectura Clean.