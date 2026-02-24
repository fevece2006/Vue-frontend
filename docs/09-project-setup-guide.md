# Guía para Crear el Proyecto desde Cero

Este documento detalla los pasos, comandos y convenciones para crear el proyecto desde cero, incluyendo la estructura, creación de componentes, y cómo testear el proyecto con las DevTools de Vue.

---

## **1. Crear el Proyecto Base**

1. **Instalar Vite y crear el proyecto**:
   ```bash
   npm create vite@latest frontend-productos -- --template vue-ts
   cd frontend-productos
   ```

2. **Instalar dependencias necesarias**:
   ```bash
   npm install
   npm install vue-router@4 pinia axios @tanstack/vue-query primevue primeicons vee-validate zod
   npm install -D @vitejs/plugin-vue rollup-plugin-visualizer rollup-plugin-obfuscator
   ```

3. **Configurar Vite**:
   - Editar el archivo `vite.config.ts` para incluir:
     - Alias para `@`.
     - Configuración de `manualChunks` para dividir el código.
     - Plugins como `rollup-plugin-visualizer` y `rollup-plugin-obfuscator` para análisis y ofuscación.

---

## **2. Configurar Entornos**

1. **Crear archivos de entorno**:
   - `.env.development` → Desarrollo.
   - `.env.production` → Producción.
   - `.env.devlocal` → Local.

2. **Ejemplo de `.env.devlocal`**:
   ```dotenv
   VITE_API_URL=http://localhost:3000
   ```

---

## **3. Estructura del Proyecto**

Organiza el proyecto de la siguiente manera:

```
/src
  /assets
  /components
  /core
    /application
      /use-cases
        /category
        /product
    /domain
      /entities
      /repositories
    /infrastructure
      /http
      /repositories
  /modules
    /auth
      /pages
      /stores
    /categories
      /components
      /composables
      /pages
    /products
      /components
      /composables
      /pages
    /shared
  /router
  App.vue
  main.ts
  style.css
```

---

## **4. Testeo del Proyecto con Vue DevTools**

1. **Instalar Vue DevTools**:
   - Descarga e instala la extensión de Vue DevTools para tu navegador (Chrome o Firefox).

2. **Habilitar Vue DevTools en modo desarrollo**:
   - Asegúrate de que el proyecto esté corriendo en modo desarrollo:
     ```bash
     npm run dev
     ```

3. **Abrir Vue DevTools**:
   - Abre las herramientas de desarrollo de tu navegador (F12 o clic derecho → "Inspeccionar").
   - Ve a la pestaña "Vue".

4. **Inspeccionar el estado y los componentes**:
   - Navega por los componentes en la pestaña "Component" para ver sus propiedades, estados y eventos.
   - Revisa el estado de **Pinia** en la pestaña "Vuex" (si estás usando Pinia como store).

5. **Depurar errores**:
   - Usa la consola para verificar errores o advertencias.
   - Asegúrate de que las rutas estén configuradas correctamente en `router/index.ts` y que los componentes se carguen según lo esperado.

---

### **Resumen de Comandos Clave**

- **Crear el proyecto**:
  ```bash
  npm create vite@latest frontend-productos -- --template vue-ts
  ```
- **Instalar dependencias**:
  ```bash
  npm install vue-router@4 pinia axios @tanstack/vue-query primevue primeicons vee-validate zod
  ```
- **Correr el proyecto en desarrollo**:
  ```bash
  npm run dev
  ```
- **Construir para producción**:
  ```bash
  npm run build
  ```
- **Analizar el bundle**:
  ```bash
  npm run build:analyze
  ```

---

Con esta guía, puedes crear y configurar el proyecto desde cero, siguiendo las mejores prácticas y utilizando herramientas modernas para el desarrollo y testeo. Si necesitas más detalles o ayuda con algún paso, no dudes en pedírmelo.