# Optimización de Performance - Documento Detallado

> Docker: para entrar al contenedor y ver los archivos desplegados (NGINX en `/usr/share/nginx/html`), ver [12-contenedor.md](12-contenedor.md).

> Rutas y navegación (RouterView, guards, layout autenticado): ver [13-rutas.md](13-rutas.md).

Este documento explica las optimizaciones realizadas en el proyecto Vue 3 + Vite, detallando el propósito de cada cambio, sus ventajas y ejemplos de implementación en el código.

## 1. Análisis del Bundle

### **Cambio**: Uso de `rollup-plugin-visualizer`.
- **Propósito**: Identificar dependencias grandes y chunks innecesarios.
- **Ventaja**: Permite visualizar el tamaño de cada módulo y optimizar el bundle.
- **Ejemplo**:
  - Configuración en `vite.config.ts`:

```javascript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

---

## 2. Carga Asíncrona de Componentes

### **Cambio**: Implementación de `defineAsyncComponent`.
- **Propósito**: Cargar componentes solo cuando sean necesarios.
- **Ventaja**: Reduce el tiempo de carga inicial al dividir el código en partes más pequeñas.
- **Ejemplo**:
  - En `src/modules/categories/pages/CategoryPage.vue`:

```javascript
import { defineAsyncComponent } from 'vue';

export default {
  components: {
    CategoryForm: defineAsyncComponent(() => import('../components/CategoryForm.vue')),
  },
};
```

---

## 3. Optimización de Chunking

### **Cambio**: Configuración de `manualChunks` en `vite.config.ts`.
- **Propósito**: Dividir el código en chunks lógicos.
- **Ventaja**: Permite que solo se descargue el código necesario para cada funcionalidad.
- **Ejemplo**:
  - Configuración en `vite.config.ts`:

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('/src/modules/categories/')) {
            return 'categories';
          }
          if (id.includes('/src/modules/products/')) {
            return 'products';
          }
        },
      },
    },
  },
});
```

---

## 4. Configuración de Entornos

### **Cambio**: Uso de archivos `.env`.
- **Propósito**: Separar configuraciones según el entorno.
- **Ventaja**: Facilita la gestión de variables sensibles y endpoints.
- **Ejemplo**:
  - Archivo `.env.production`:

```dotenv
VITE_API_URL=https://api.production.com
```

---

## 5. Uso de Plugins Adicionales

### **Cambio**: Implementación de `rollup-plugin-obfuscator`.
- **Propósito**: Aumentar la seguridad del código en producción.
- **Ventaja**: Dificulta la lectura y modificación del código por parte de usuarios malintencionados.
- **Ejemplo**:
  - Configuración en `vite.config.ts`:

```javascript
import obfuscator from 'rollup-plugin-obfuscator';

export default defineConfig({
  plugins: [
    obfuscator({
      global: true,
    }),
  ],
});
```

---

Con estas optimizaciones, el proyecto logra un mejor rendimiento, tiempos de carga más rápidos y una mayor seguridad en producción.