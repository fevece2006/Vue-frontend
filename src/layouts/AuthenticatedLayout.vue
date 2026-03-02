<script setup lang="ts">
import { useRouter } from 'vue-router'

import Button from 'primevue/button'
import Menubar from 'primevue/menubar'

import { buildAuthenticatedMenuItems } from '@/modules/shared/navigation/menuItems'
import { useLogout } from '@/modules/auth/composables/useLogout'

const router = useRouter()

const menuItems = buildAuthenticatedMenuItems(router)

const { logout } = useLogout()
</script>

<template>
  <div class="app-shell">
    <Menubar :model="menuItems" class="app-menu">
      <template #start>
        <!-- Eliminado el texto innecesario -->
      </template>

      <template #end>
        <Button label="Cerrar sesión" size="small" severity="secondary" @click="logout" />
      </template>
    </Menubar>

    <main class="app-content">
      <RouterView />
    </main>
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
