<script setup lang="ts">
import { ref } from 'vue';
import { useCategories } from '@/modules/categories/composables/useCategories';
import { useProducts } from '@/modules/products/composables/useProducts';
import type { Product } from '@/core/domain/entities/Product';
import { useToast } from 'primevue/usetoast';

const { categoriesQuery } = useCategories();
const { productsQuery, removeProductMutation } = useProducts();
const showDialog = ref(false);
const currentProduct = ref<Product | null>(null);
const toast = useToast();

const categoryNameById = (categoryId: string) => {
  const category = categoriesQuery.data.value?.find((item) => item.id === categoryId);
  return category?.name ?? '-';
};

const createNewProduct = () => {
  currentProduct.value = null;
  showDialog.value = true;
};

const editProduct = (product: Product) => {
  currentProduct.value = { ...product };
  showDialog.value = true;
};

const deleteProduct = async (productId: string) => {
  try {
    await removeProductMutation.mutateAsync(productId);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully' });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product' });
  }
};

// Debugging log to verify data flow
console.log('Products data:', productsQuery.data.value);
</script>

<template>
  <Card class="page-card">
    <template #content>
      <div class="page-header">
        <h1 class="page-title">Mantenimiento de Productos</h1>
        <Button label="Nuevo producto" icon="pi pi-plus" class="p-button-success" @click="createNewProduct" />
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