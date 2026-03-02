<script setup lang="ts">
import { ref } from 'vue'
import { useCategories } from '@/modules/categories/composables/useCategories'
import type { Category, CategoryCreateInput, CategoryUpdateInput } from '@/core/domain/entities/Category'
import { useToast } from 'primevue/usetoast'
import { useConfirmDelete } from '@/modules/shared/composables/useConfirmDelete'

import Dialog from 'primevue/dialog'
import CategoryForm from '@/modules/categories/components/CategoryForm.vue'

const { categoriesQuery, createCategoryMutation, updateCategoryMutation, removeCategoryMutation } =
  useCategories()

const showDialog = ref(false)
const currentCategory = ref<Category | null>(null)
const toast = useToast()
const { confirmDelete } = useConfirmDelete()

const createNewCategory = () => {
  currentCategory.value = null
  showDialog.value = true
}

const editCategory = (category: Category) => {
  currentCategory.value = { ...category }
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
}

const submitForm = async (payload: CategoryCreateInput) => {
  try {
    if (currentCategory.value?.id) {
      const updatePayload: CategoryUpdateInput = {
        id: currentCategory.value.id,
        ...payload,
      }

      await updateCategoryMutation.mutateAsync(updatePayload)

      toast.add({ severity: 'success', summary: 'OK', detail: 'Categoría actualizada' })
    } else {
      await createCategoryMutation.mutateAsync(payload)
      toast.add({ severity: 'success', summary: 'OK', detail: 'Categoría creada' })
    }

    closeDialog()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' })
  }
}

const deleteCategory = (category: Category) => {
  if (!category?.id) return

  confirmDelete({
    header: 'Eliminar categoría',
    message: `¿Seguro que deseas eliminar la categoría "${category.name}" (ID: ${category.id})?`,
    onAccept: async () => {
      try {
        await removeCategoryMutation.mutateAsync(category.id)
        toast.add({ severity: 'success', summary: 'OK', detail: 'Categoría eliminada' })
      } catch {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' })
      }
    },
  })
}
</script>

<template>
  <Card class="page-card">
    <template #content>
      <div class="page-header">
        <h1 class="page-title">Mantenimiento de Categorías</h1>
        <Button
          label="Nueva categoría"
          icon="pi pi-plus"
          class="p-button-success"
          @click="createNewCategory"
        />
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
              <Button
                label="Editar"
                icon="pi pi-pencil"
                class="p-button-text"
                @click="editCategory(data)"
              />
              <Button
                label="Eliminar"
                icon="pi pi-trash"
                class="p-button-danger p-button-text"
                :loading="removeCategoryMutation.isPending.value"
                @click="deleteCategory(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <p
        v-if="!categoriesQuery.data.value || categoriesQuery.data.value.length === 0"
        class="no-data-message"
      >
        No hay categorías disponibles.
      </p>
    </template>
  </Card>

  <Dialog
    v-model:visible="showDialog"
    :header="currentCategory ? 'Editar categoría' : 'Nueva categoría'"
    modal
    style="width: 520px; max-width: 95vw"
    @hide="closeDialog"
  >
    <CategoryForm
      :model-value="currentCategory"
      :loading="createCategoryMutation.isPending.value || updateCategoryMutation.isPending.value"
      @submit="submitForm"
      @cancel="closeDialog"
    />
  </Dialog>
</template>