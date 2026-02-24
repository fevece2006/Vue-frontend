<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { defineAsyncComponent, watch } from 'vue'
import { z } from 'zod'
import type { Category, CategoryCreateInput } from '@/core/domain/entities/Category'

const Button = defineAsyncComponent(() => import('primevue/button'))
const InputText = defineAsyncComponent(() => import('primevue/inputtext'))

const props = defineProps<{
  modelValue?: Category | null
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: CategoryCreateInput]
  cancel: []
}>()

const categorySchema = toTypedSchema(
  z.object({
    name: z.string().trim().min(1, 'El nombre es obligatorio').max(120, 'Máximo 120 caracteres'),
  }),
)

const { defineField, errors, handleSubmit, resetForm } = useForm<CategoryCreateInput>({
  validationSchema: categorySchema,
  initialValues: {
    name: '',
  },
})

const [name, nameAttrs] = defineField('name')

watch(
  () => props.modelValue,
  (value) => {
    resetForm({
      values: {
        name: value?.name ?? '',
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
    <div class="dialog-actions">
      <Button type="button" label="Cancelar" severity="secondary" @click="emit('cancel')" />
      <Button type="submit" label="Guardar" :loading="loading" />
    </div>
  </form>
</template>