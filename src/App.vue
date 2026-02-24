<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'
import Toast from 'primevue/toast'
import { useAuthStore } from '@/modules/auth/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const menuItems = computed(() => {
  if (!authStore.isAuthenticated) {
    return [{ label: 'Iniciar sesión', command: () => router.push('/login') }]
  }

  return [
    {
      label: 'Mantenimiento',
      items: [
        { label: 'Categorías', command: () => router.push('/categorias') },
        { label: 'Productos', command: () => router.push('/productos') },
      ],
    },
  ]
})

const closeSession = () => {
  authStore.clearToken()
  router.push('/login')
}
</script>

<template>
  <div class="app-shell">
    <Menubar :model="menuItems" class="app-menu">
      <template #start>
        <!-- Eliminado el texto innecesario -->
      </template>
      <template #end>
        <Button
          v-if="authStore.isAuthenticated"
          label="Cerrar sesión"
          size="small"
          severity="secondary"
          @click="closeSession"
        />
      </template>
    </Menubar>

    <main class="app-content">
      <RouterView />
    </main>
    <Toast />
  </div>
</template>
