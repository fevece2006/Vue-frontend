import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

import { visualizer } from 'rollup-plugin-visualizer'
import obfuscator from 'rollup-plugin-obfuscator'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  const isDevLocal = mode === 'devlocal'
  const isAnalyze = process.env.ANALYZE === 'true'

  const basePath = '/'

  return {
    base: basePath,

    plugins: [
      vue(),

      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/auto-imports.d.ts',
        eslintrc: { enabled: true },
      }),

      Components({
        dirs: ['src/components'],
        dts: 'src/components.d.ts',
      }),

      isAnalyze &&
        visualizer({
          filename: 'dist/stats.html',
          gzipSize: true,
          brotliSize: true,
          open: false,
        }),

      isProduction &&
        obfuscator({
          global: false,
          // Evitamos obfuscar librerías externas para prevenir errores de herencia (Class extends undefined)
          include: ['dist/assets/app-*.js', 'dist/assets/index-*.js'],
        }),
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
    },

    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 2000, // Elevado para manejar los nuevos grupos

      rollupOptions: {
        output: {
          manualChunks(id: string) {
            // 1. MODULOS DE LA APLICACIÓN
            if (id.includes('/src/modules/auth/')) return 'app-auth'
            if (id.includes('/src/modules/products/')) return 'app-products'
            if (id.includes('/src/modules/categories/')) return 'app-categories'

            // 2. VENDOR CORE & DATA (Unificados)
            // Agruparlos evita que un error de carga de Axios rompa a Vue o viceversa
            if (
              id.includes('node_modules/vue') ||
              id.includes('node_modules/vue-router') ||
              id.includes('node_modules/pinia') ||
              id.includes('node_modules/axios') ||
              id.includes('node_modules/@tanstack') ||
              id.includes('node_modules/zod') ||
              id.includes('node_modules/vee-validate')
            ) {
              return 'vendor-core'
            }

            // 3. UI LIBRARIES
            if (
              id.includes('node_modules/primevue') ||
              id.includes('node_modules/primeicons')
            ) {
              return 'vendor-ui'
            }

            // 4. IMPORTANTE:
            // No forzamos un chunk "vendor-libs" para todo node_modules porque puede generar
            // ciclos (Circular chunk) entre vendor-core <-> vendor-libs en producción.
            // Dejamos que Rollup/Vite decida el resto automáticamente.
          },
        },
      },
    },

    server: {
      port: isDevLocal ? 5175 : 5173,
    },
  }
})