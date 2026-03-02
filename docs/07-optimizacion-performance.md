# Optimización de Performance en el Frontend

> Docker: para entrar al contenedor y ver los archivos desplegados (NGINX en `/usr/share/nginx/html`), ver [12-contenedor.md](12-contenedor.md).

> Rutas y navegación (RouterView, guards, layout autenticado): ver [13-rutas.md](13-rutas.md).

Este documento describe, paso a paso, las técnicas y cambios aplicados para mejorar la performance del proyecto Vue 3 + Vite, detallando las decisiones y su impacto en el bundle final.

## 1. Análisis Inicial del Bundle
- Se utilizó `rollup-plugin-visualizer` para analizar el tamaño y la composición del bundle (`npm run build:analyze`).
- Se identificaron problemas de tamaño excesivo en el chunk principal y dependencias innecesarias cargadas globalmente.

## 2. Eliminación de Importaciones Globales Innecesarias
- **PrimeVue**: Se eliminó el registro global de componentes y directivas de PrimeVue en `main.ts`.
- **primeicons**: Se removió la importación global de `primeicons`, evitando que todos los íconos se incluyeran en el bundle inicial.

## 3. Carga Asíncrona de Componentes
- Se implementó `defineAsyncComponent` para cargar componentes de PrimeVue y formularios de manera asíncrona.
- Esto permite que los componentes se descarguen solo cuando son requeridos por la ruta o el usuario, reduciendo el tiempo de carga inicial.

## 4. Separación de Entornos y Variables
- Se crearon archivos `.env.production`, `.env.development` y `.env.local` para separar configuraciones de API y endpoints según el entorno.
- Esto permite builds optimizados y seguros para cada ambiente.

## 5. Optimización de Chunking (División de Código)
- Se configuró `vite.config.ts` para usar `manualChunks` y dividir el código en:
  - **vendor**: Dependencias de terceros (vue, pinia, axios, etc.).
  - **app-categories**: Código relacionado a la gestión de categorías.
  - **app-products**: Código relacionado a la gestión de productos.
  - **widgets**: Los componentes de PrimeVue se cargan en chunks separados automáticamente.
- Esta división permite que solo se descargue el código necesario para cada funcionalidad, mejorando el rendimiento y la mantenibilidad.

### Relación con los Archivos Generados en `dist`
- **`dist/vendor-vue.*.js`**: Contiene las dependencias principales como Vue, Vue Router y Pinia.
- **`dist/app-categories.*.js`**: Incluye el código específico para la gestión de categorías.
- **`dist/app-products.*.js`**: Incluye el código específico para la gestión de productos.
- **`dist/vendor-data.*.js`**: Contiene bibliotecas relacionadas con la gestión de datos como Axios y Vue Query.
- **`dist/vendor-ui-core.*.js`**: Incluye componentes esenciales de PrimeVue como botones, menús y notificaciones.
- **`dist/vendor-ui-theme.*.js`**: Contiene los temas de PrimeVue.

Esta estructura asegura que cada archivo generado esté optimizado para su propósito, minimizando el tamaño de las descargas iniciales y permitiendo una carga progresiva eficiente.

## 6. Eliminación de Warnings y Problemas de Circularidad
- Se ajustó la configuración de chunking para evitar advertencias de dependencias circulares y chunks excesivamente grandes o pequeños.

## 7. Validación y Documentación
- Se validó cada cambio ejecutando `npm run build:analyze` y revisando el archivo `stats.html` generado.
- Se documentaron los scripts y el flujo de trabajo en el README y en la checklist de pruebas manuales.

## 8. Nuevas Optimizaciones

### Uso de Plugins Adicionales
- **Plugin**: `rollup-plugin-obfuscator`.
- **Ubicación**: Configuración en `vite.config.ts`.
- **Motivo**: Aumentar la seguridad del código en producción.
- **Impacto**: Código más difícil de leer y modificar para usuarios malintencionados.

### Validación de Tamaño de Bundle
- **Cambio**: Configuración de `visualizer` para generar reportes detallados.
- **Ubicación**: Archivo `vite.config.ts`.
- **Motivo**: Identificar y reducir dependencias grandes.
- **Impacto**: Mejor comprensión del tamaño del bundle y optimización continua.

---

### Resumen de Técnicas Aplicadas
- **Bundle Analysis**: Visualización y diagnóstico del bundle.
- **Lazy Loading**: Carga asíncrona de componentes y rutas.
- **Manual Chunking**: División lógica del código por feature y vendor.
- **Eliminación de imports globales**: Solo cargar lo necesario.
- **Separación de entornos**: Variables y endpoints por ambiente.
- **Validación continua**: Uso de scripts y herramientas para evitar regresiones.

Estas acciones permiten una aplicación más rápida, modular y fácil de mantener, con tiempos de carga iniciales mínimos y descargas progresivas según el uso real.