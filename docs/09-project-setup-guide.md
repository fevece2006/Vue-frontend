# Guía para Crear el Proyecto desde Cero

> Docker: para entrar al contenedor y ver los archivos desplegados (NGINX en `/usr/share/nginx/html`), ver [12-contenedor.md](12-contenedor.md).

> Rutas y navegación (RouterView, guards, layout autenticado): ver [13-rutas.md](13-rutas.md).

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

## **5. Configuraciones Específicas**

### Configuración de Vite
- **Archivo**: `vite.config.ts`.
- **Propósito**: Optimizar el proyecto para producción y desarrollo.
- **Detalles**:
  - Alias `@` para rutas más limpias.
  - Configuración de `manualChunks` para dividir el código en chunks lógicos.
  - Plugins:
    - `rollup-plugin-visualizer`: Genera reportes del tamaño del bundle.
    - `rollup-plugin-obfuscator`: Ofusca el código en producción.

### Configuración de Entornos
- **Archivos**: `.env.development`, `.env.production`, `.env.devlocal`.
- **Propósito**: Definir variables de entorno para cada ambiente.
- **Ejemplo**:

```dotenv
VITE_API_URL=http://localhost:3000
```

### Configuración de Axios
- **Archivo**: `src/infrastructure/http/axiosClient.ts`.
- **Propósito**: Configurar cliente HTTP con `baseURL` y manejo de tokens JWT.
- **Detalles**:
  - `baseURL`: Se obtiene de `VITE_API_URL`.
  - Interceptores: Añaden encabezados `Authorization` y manejan errores `401`.

### Configuración de PrimeVue
- **Archivo**: `src/main.ts`.
- **Propósito**: Registrar PrimeVue y configurar el tema visual.
- **Detalles**:
  - Importar y registrar componentes específicos.
  - Configurar el tema `Aura`.

### Configuración de Rutas
- **Archivo**: `src/router/index.ts`.
- **Propósito**: Definir navegación y lazy loading de páginas.
- **Detalles**:
  - Uso de `component: () => import('...')` para cargar rutas bajo demanda.

---

## **6. Requisitos Previos**

Antes de comenzar con la configuración del proyecto, asegúrate de cumplir con los siguientes requisitos:

### Requisitos
- **Node.js**: Versión 16 o superior.
- **npm**: Versión 8 o superior (se instala junto con Node.js).
- **Git**: Para clonar repositorios y manejar el control de versiones.
- **Editor de Código**: Visual Studio Code (recomendado).

### Instalación de Requisitos

#### 1. Instalar Node.js y npm
- Descarga e instala Node.js desde su [sitio oficial](https://nodejs.org/).
- Verifica la instalación ejecutando:

```bash
node -v
npm -v
```

#### 2. Instalar Git
- Descarga e instala Git desde su [sitio oficial](https://git-scm.com/).
- Verifica la instalación ejecutando:

```bash
git --version
```

#### 3. Instalar Visual Studio Code
- Descarga e instala Visual Studio Code desde su [sitio oficial](https://code.visualstudio.com/).

---

Con estos requisitos instalados, estarás listo para seguir los pasos de configuración descritos en esta guía.

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