# Ofuscación de Código en el Proyecto

Este documento detalla la implementación de la ofuscación de código en el proyecto Vue 3 + Vite, explicando su configuración, propósito y el impacto en el entorno de producción.

## 1. ¿Qué es la Ofuscación de Código?
La ofuscación de código es una técnica utilizada para dificultar la lectura y comprensión del código fuente por parte de terceros. Esto se logra transformando el código en una forma que sigue siendo funcional pero es más difícil de interpretar.

## 2. Implementación en el Proyecto

### Herramienta Utilizada
- **Plugin**: `rollup-plugin-obfuscator`
- **Motivo**: Aumentar la seguridad del código en el entorno de producción, dificultando la ingeniería inversa.

### Configuración
- **Archivo**: `vite.config.ts`
- **Ubicación**: Dentro de la sección `plugins`.
- **Condición**: Solo se aplica cuando el entorno es de producción (`mode === 'production'`).

```javascript
import obfuscator from 'rollup-plugin-obfuscator';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      // ...otros plugins...
      isProduction
        ? obfuscator({
            global: true,
          })
        : undefined,
    ],
  };
});
```

### Detalles de Configuración
- **`global: true`**: Aplica la ofuscación a todo el código generado.
- **Condicional**: El plugin solo se incluye en el proceso de build cuando el entorno es de producción.

## 3. Impacto en el Proyecto

### Ventajas
- **Seguridad**: Dificulta la lectura y modificación del código por parte de usuarios malintencionados.
- **Protección de Propiedad Intelectual**: Reduce el riesgo de que el código sea copiado o reutilizado sin autorización.

### Desventajas
- **Depuración**: El código ofuscado es más difícil de depurar en caso de errores en producción.
- **Tiempos de Build**: Incrementa ligeramente el tiempo de construcción del proyecto debido al proceso de ofuscación.

## 4. Validación
- **Pruebas Realizadas**: Se ejecutaron builds en modo producción y se verificó que el código generado estuviera ofuscado correctamente.
- **Comando Utilizado**: `npm run build`
- **Archivo Generado**: Se revisaron los archivos en la carpeta `dist` para confirmar la ofuscación.

## 5. Recomendaciones
- **Uso Exclusivo en Producción**: Evitar aplicar la ofuscación en entornos de desarrollo para facilitar la depuración.
- **Validación Continua**: Revisar periódicamente el impacto de la ofuscación en el rendimiento y la funcionalidad del proyecto.

---

La ofuscación de código es una medida adicional de seguridad que, aunque no garantiza una protección absoluta, contribuye a dificultar el acceso no autorizado al código fuente del proyecto.