<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCategories } from '@/modules/categories/composables/useCategories'
import { useProducts } from '@/modules/products/composables/useProducts'
import type { Product, ProductCreateInput } from '@/core/domain/entities/Product'
import { useToast } from 'primevue/usetoast'

import ProductForm from '@/modules/products/components/ProductForm.vue'

const { categoriesQuery } = useCategories()
const { productsQuery, createProductMutation, updateProductMutation, removeProductMutation } = useProducts()

const showForm = ref(false)
const currentProduct = ref<Product | null>(null)
const toast = useToast()

const categories = computed(() => categoriesQuery.data.value ?? [])

const categoryNameById = (categoryId: string) => {
  const category = categoriesQuery.data.value?.find((item) => item.id === categoryId)
  return category?.name ?? '-'
}

const createNewProduct = () => {
  currentProduct.value = null
  showForm.value = true
}

const editProduct = (product: Product) => {
  currentProduct.value = { ...product }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

const submitForm = async (payload: ProductCreateInput) => {
  try {
    if (currentProduct.value?.id) {
      await updateProductMutation.mutateAsync({
        id: currentProduct.value.id,
        ...payload,
      } as any)
      toast.add({ severity: 'success', summary: 'OK', detail: 'Producto actualizado' })
    } else {
      await createProductMutation.mutateAsync(payload)
      toast.add({ severity: 'success', summary: 'OK', detail: 'Producto creado' })
    }

    closeForm()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el producto' })
  }
}

const deleteProduct = async (productId: string) => {
  try {
    await removeProductMutation.mutateAsync(productId)
    toast.add({ severity: 'success', summary: 'OK', detail: 'Producto eliminado' })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el producto' })
  }
}
</script>

<template>
  <Card class="page-card">
    <template #content>
      <div class="page-header">
        <h1 class="page-title">Mantenimiento de Productos</h1>
        <Button
          label="Nuevo producto"
          icon="pi pi-plus"
          class="p-button-success"
          @click="createNewProduct"
        />
      </div>

      <!-- FORM INLINE (OPCIÓN B) -->
      <div v-if="showForm" class="mb-4">
        <Card>
          <template #content>
            <ProductForm
              :model-value="currentProduct"
              :categories="categories"
              :loading="createProductMutation.isPending.value || updateProductMutation.isPending.value"
              @submit="submitForm"
              @cancel="closeForm"
            />
          </template>
        </Card>
      </div>

      <div class="grid">
        <div class="col-12">
          <DataTable
            :value="productsQuery.data.value ?? []"
            dataKey="id"
            :loading="productsQuery.isLoading.value"
            stripedRows
            responsiveLayout="scroll"
          >
            <Column field="id" header="ID" />
            <Column field="name" header="Nombre" />
            <Column field="description" header="Descripción" />
            <Column field="price" header="Precio" />
            <Column header="Categoría">
              <template #body="{ data }">
                {{ categoryNameById(data.categoryId) }}
              </template>
            </Column>
            <Column header="Acciones" style="width: 180px">
              <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                  <Button label="Editar" icon="pi pi-pencil" class="p-button-text" @click="editProduct(data)" />
                  <Button
                    label="Eliminar"
                    icon="pi pi-trash"
                    class="p-button-danger p-button-text"
                    :loading="removeProductMutation.isPending.value"
                    @click="deleteProduct(data.id)"
                  />
                </div>
              </template>
            </Column>
          </DataTable>

          <p v-if="!productsQuery.data.value || productsQuery.data.value.length === 0" class="no-data-message">
            No hay productos disponibles.
          </p>
        </div>
      </div>
    </template>
  </Card>

  <ConfirmDialog />
</template>