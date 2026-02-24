import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'
import obfuscator from 'rollup-plugin-obfuscator'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  const isDevLocal = mode === 'devlocal'

  return {
    plugins: [
      vue(),
      process.env.ANALYZE === 'true'
        ? visualizer({
            filename: 'dist/stats.html',
            gzipSize: true,
            brotliSize: true,
            open: false,
          })
        : undefined,
      // Add obfuscator plugin only for production builds
      isProduction
        ? obfuscator({
            global: true,
          })
        : undefined,
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/src/modules/categories/')) {
              return 'app-categories'
            }

            if (id.includes('/src/modules/products/')) {
              return 'app-products'
            }

            if (
              id.includes('node_modules/vue') ||
              id.includes('node_modules/vue-router') ||
              id.includes('node_modules/pinia')
            ) {
              return 'vendor-vue'
            }

            if (
              id.includes('node_modules/axios') ||
              id.includes('node_modules/@tanstack/vue-query') ||
              id.includes('node_modules/vee-validate') ||
              id.includes('node_modules/zod') ||
              id.includes('node_modules/@vee-validate/zod')
            ) {
              return 'vendor-data'
            }

            if (id.includes('node_modules/@primeuix/themes')) {
              return 'vendor-ui-theme'
            }

            if (
              id.includes('node_modules/primevue/config') ||
              id.includes('node_modules/primevue/base') ||
              id.includes('node_modules/primevue/usestyle') ||
              id.includes('node_modules/primevue/button') ||
              id.includes('node_modules/primevue/card') ||
              id.includes('node_modules/primevue/menubar') ||
              id.includes('node_modules/primevue/toast') ||
              id.includes('node_modules/primevue/toastservice')
            ) {
              return 'vendor-ui-core'
            }

            return undefined
          },
        },
      },
    },
    server: {
      port: isProduction ? 80 : isDevLocal ? 5175 : 5173, // Use port 80 in production, 5173 in development, 5175 in devlocal
    },
  }
})
