<script setup lang="ts">
import { computed } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { loginApi } from '@/modules/auth/api/auth.api'
import { loginSchema, type LoginRequest } from '@/modules/auth/schemas/login.schema'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

/* ================================
   FORM
================================ */

const { defineField, errors, handleSubmit } = useForm<LoginRequest>({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: {
    username: '',
    password: '',
  },
})

const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')

/* ================================
   MUTATION
================================ */

const loginMutation = useMutation({
  mutationFn: loginApi,

  onSuccess: (token) => {
    authStore.setToken(token)

    // Si venía de una ruta protegida, vuelve allí; si no, va a /principal
    const redirect = (route.query.redirect as string | undefined) ?? '/principal'
    router.push(redirect)
  },
})

/* ================================
   LOADING (TanStack Query v5)
================================ */

const isLoading = computed(() => loginMutation.isPending.value)

/* ================================
   SUBMIT
================================ */

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
        <form @submit.prevent="onSubmit">
          <div class="p-field">
            <label for="username">Usuario</label>

            <InputText id="username" v-model="username" v-bind="usernameAttrs" />

            <small v-if="errors.username" class="p-error">
              {{ errors.username }}
            </small>
          </div>

          <div class="p-field">
            <label for="password">Contraseña</label>

            <Password
              id="password"
              v-model="password"
              v-bind="passwordAttrs"
              toggleMask
              :feedback="false"
            />

            <small v-if="errors.password" class="p-error">
              {{ errors.password }}
            </small>
          </div>

          <Button
            label="Iniciar Sesión"
            icon="pi pi-sign-in"
            class="p-button-primary"
            :loading="isLoading"
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