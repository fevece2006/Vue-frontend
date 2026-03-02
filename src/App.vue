<script setup lang="ts">
import Toast from 'primevue/toast'
</script>

<template>
  <div class="app-shell">
    <RouterView />

    <ConfirmDialog />
    <Toast />
  </div>
</template>
