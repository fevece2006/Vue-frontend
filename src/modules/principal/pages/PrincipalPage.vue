<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'


const router = useRouter()


const goToCategories = () => router.push('/categorias')
const goToProducts = () => router.push('/productos')


</script>

<template>
  <div class="principal-container">
    <Card class="principal-card">
      <template #title>
        <h2>Principal</h2>
      </template>

      <template #content>
        <p class="subtitle">Bienvenido. Selecciona una opción:</p>

        <div class="actions">
          <Button
            label="Ir a Categorías"
            icon="pi pi-tags"
            class="p-button-secondary"
            @click="goToCategories"
          />

          <Button
            label="Ir a Productos"
            icon="pi pi-box"
            class="p-button-secondary"
            @click="goToProducts"
          />


        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.principal-container {
  max-width: 720px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.subtitle {
  margin: 0 0 1rem 0;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
</style>