<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'
import Toast from 'primevue/toast'
import { useAuthStore } from '@/modules/auth/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const goHome = () => router.push('/principal')

const menuItems = computed(() => {
  if (!authStore.isAuthenticated) {
    return [{ label: 'Iniciar sesión', command: () => router.push('/login') }]
  }

  return [
    {
      label: 'Home', // requerido para que el item se pinte bien
      icon: 'pi pi-home',
      command: goHome,
      class: 'menu-home', // para ocultar el texto y dejar solo el icono
    },
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
  authStore.logout()
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

<style scoped>
/* Oculta el texto "Home" pero deja el ícono visible */
:deep(.menu-home .p-menuitem-text) {
  display: none;
}

/* Opcional: aumenta el área clickeable y centra el icono */
:deep(.menu-home .p-menuitem-link) {
  padding: 0.75rem;
}
</style>