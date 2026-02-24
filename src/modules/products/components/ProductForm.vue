<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, defineAsyncComponent, watch } from 'vue'
import { z } from 'zod'
import type { Category } from '@/core/domain/entities/Category'
import type { Product, ProductCreateInput } from '@/core/domain/entities/Product'

const Button = defineAsyncComponent(() => import('primevue/button'))
const Dropdown = defineAsyncComponent(() => import('primevue/dropdown'))
const InputNumber = defineAsyncComponent(() => import('primevue/inputnumber'))
const InputText = defineAsyncComponent(() => import('primevue/inputtext'))
const Textarea = defineAsyncComponent(() => import('primevue/textarea'))

const props = defineProps<{
  modelValue?: Product | null
  categories: Category[]
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: ProductCreateInput]
  cancel: []
}>()

const productSchema = toTypedSchema(
  z.object({
    name: z.string().trim().min(1, 'El nombre es obligatorio').max(150, 'Máximo 150 caracteres'),
    description: z.string().max(500, 'Máximo 500 caracteres').optional(),
    price: z.number().gt(0, 'El precio debe ser mayor que cero'),
    categoryId: z.string().min(1, 'Seleccione una categoría'),
  }),
)

const { defineField, errors, handleSubmit, resetForm } = useForm<ProductCreateInput>({
  validationSchema: productSchema,
  initialValues: {
    name: '',
    description: '',
    price: 0,
    categoryId: '',
  },
})

const [name, nameAttrs] = defineField('name')
const [description, descriptionAttrs] = defineField('description')
const [price, priceAttrs] = defineField('price')
const [categoryId, categoryIdAttrs] = defineField('categoryId')

const categoryOptions = computed(() =>
  props.categories.map((category) => ({
    label: category.name,
    value: category.id,
  })),
)

watch(
  () => props.modelValue,
  (value) => {
    resetForm({
      values: {
        name: value?.name ?? '',
        description: value?.description ?? '',
        price: value?.price ?? 0,
        categoryId: value?.categoryId ?? '',
      },
    })
  },
  { immediate: true },
)

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <form class="form-grid" @submit.prevent="onSubmit">
    <div class="field-group">
      <label for="name">Nombre</label>
      <InputText id="name" v-model="name" v-bind="nameAttrs" fluid />
      <small class="p-error">{{ errors.name }}</small>
    </div>

    <div class="field-group">
      <label for="price">Precio</label>
      <InputNumber id="price" v-model="price" v-bind="priceAttrs" mode="currency" currency="USD" fluid />
      <small class="p-error">{{ errors.price }}</small>
    </div>

    <div class="field-group">
      <label for="description">Descripción</label>
      <Textarea id="description" v-model="description" v-bind="descriptionAttrs" rows="3" fluid />
      <small class="p-error">{{ errors.description }}</small>
    </div>

    <div class="field-group">
      <label for="categoryId">Categoría</label>
      <Dropdown
        id="categoryId"
        v-model="categoryId"
        v-bind="categoryIdAttrs"
        :options="categoryOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Seleccione una categoría"
        fluid
      />
      <small class="p-error">{{ errors.categoryId }}</small>
    </div>

    <div class="dialog-actions">
      <Button type="button" label="Cancelar" severity="secondary" @click="emit('cancel')" />
      <Button type="submit" label="Guardar" :loading="loading" />
    </div>
  </form>
</template>