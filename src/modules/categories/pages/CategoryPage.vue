<script setup lang="ts">
import { ref } from 'vue';
import { useCategories } from '@/modules/categories/composables/useCategories';
import type { Category } from '@/core/domain/entities/Category';
import { useToast } from 'primevue/usetoast';

const { categoriesQuery, removeCategoryMutation } = useCategories();
const showDialog = ref(false);
const currentCategory = ref<Category | null>(null);
const toast = useToast();

const createNewCategory = () => {
  currentCategory.value = null;
  showDialog.value = true;
};

const editCategory = (category: Category) => {
  currentCategory.value = { ...category };
  showDialog.value = true;
};

const deleteCategory = async (id: string) => {
  if (!id) return;

  try {
    await removeCategoryMutation.mutateAsync(id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Category deleted successfully' });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete category' });
  }
};
</script>

<template>
  <Card class="page-card">
    <template #content>
      <div class="page-header">
        <h1 class="page-title">Mantenimiento de Categorías</h1>
        <Button label="Nueva categoría" icon="pi pi-plus" class="p-button-success" @click="createNewCategory" />
      </div>

      <DataTable
        :value="categoriesQuery.data.value ?? []"
        dataKey="id"
        :loading="categoriesQuery.isLoading.value"
        emptyMessage=""
        stripedRows
        responsiveLayout="scroll"
      >
        <Column field="id" header="ID" />
        <Column field="name" header="Nombre" />
        <Column header="Acciones" style="width: 180px">
          <template #body="{ data }">
            <div class="dialog-actions">
              <Button label="Editar" icon="pi pi-pencil" class="p-button-text" @click="editCategory(data)" />
              <Button
                label="Eliminar"
                icon="pi pi-trash"
                class="p-button-danger p-button-text"
                :loading="removeCategoryMutation.isPending.value"
                @click="deleteCategory(data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <p v-if="!categoriesQuery.data.value || categoriesQuery.data.value.length === 0" class="no-data-message">
        No hay categorías disponibles.
      </p>
    </template>
  </Card>

  <ConfirmDialog />
</template>