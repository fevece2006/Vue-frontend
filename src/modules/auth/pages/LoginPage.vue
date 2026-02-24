<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { axiosClient, getApiErrorMessage } from '@/infrastructure/http/axiosClient'

type LoginRequest = {
  username: string
  password: string
}

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loginSchema = toTypedSchema(
  z.object({
    username: z.string().min(3, 'Ingrese al menos 3 caracteres'),
    password: z.string().min(6, 'Ingrese al menos 6 caracteres'),
  }),
)

const { defineField, errors, handleSubmit } = useForm<LoginRequest>({
  validationSchema: loginSchema,
  initialValues: {
    username: '',
    password: '',
  },
})

const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')

const loginMutation = useMutation({
  mutationFn: async (payload: LoginRequest) => {
    try {
      const { data } = await axiosClient.post<{ token: string }>('/login', payload)

      if (!data?.token) {
        throw new Error('El backend no retornó token JWT')
      }

      return data.token
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Credenciales inválidas'))
    }
  },
  onSuccess: (token) => {
    authStore.setToken(token)
    const redirect = (route.query.redirect as string | undefined) ?? '/categorias'
    router.push(redirect)
  },
})

const onSubmit = handleSubmit(async (values) => {
  await loginMutation.mutateAsync(values)
})
</script>

<template>
  <div class="login-container">
    <Card class="login-card">
      <template #title>
        <h2>Iniciar Sesión</h2>
      </template>
      <template #content>
        <form @submit.prevent="handleSubmit(loginMutation.mutate)">
          <div class="p-field">
            <label for="username">Usuario</label>
            <InputText id="username" v-bind="usernameAttrs" />
            <small v-if="errors.username" class="p-error">{{ errors.username }}</small>
          </div>

          <div class="p-field">
            <label for="password">Contraseña</label>
            <Password id="password" v-bind="passwordAttrs" toggleMask feedback="false" />
            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
          </div>

          <Button
            label="Iniciar Sesión"
            icon="pi pi-sign-in"
            class="p-button-primary"
            :loading="loginMutation.isLoading"
            type="submit"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 420px;
  margin: 2rem auto;
}
</style>