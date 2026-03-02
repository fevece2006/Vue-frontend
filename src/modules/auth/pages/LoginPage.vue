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
import { ROUTE_NAMES } from '@/router'

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
    const redirect = route.query.redirect as string | undefined
    if (redirect) {
      router.push(redirect)
      return
    }

    router.push({ name: ROUTE_NAMES.principal })
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
    <Card >


      <template #content>
        <form @submit.prevent="onSubmit" class="login-form">
          <div class="field">
            <label for="username">Usuario</label>

            <InputText id="username" v-model="username" v-bind="usernameAttrs" class="full-width"/>

            <small v-if="errors.username" class="p-error">
              {{ errors.username }}
            </small>
          </div>

          <div class="field">
            <label for="password">Contraseña</label>

            <Password
              id="password"
              v-model="password"
              v-bind="passwordAttrs"
              toggleMask
              :feedback="false"
							class="full-width"
              :inputStyle="{ width: '100%' }"
              inputClass="full-width"
            />

            <small v-if="errors.password" class="p-error">
              {{ errors.password }}
            </small>
          </div>

<div class="button-container">
          <Button
            label="Iniciar Sesión"
            icon="pi pi-sign-in"
            class="p-button-primary full-width"
            :loading="isLoading"
            type="submit"
          />
					</div>
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.login-container {

  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f2f3f5;
  padding: 1rem;
	min-height: 80vh;
}

.login-card {
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}



.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.field label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.95rem;
  text-align: left;
}

.full-width {
  width: 100% !important;
}

:deep(.p-inputtext) {
  width: 100%;
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  width: 100%;
}

.button-container {
  margin-top: 0.5rem;
  width: 100%;
}

.p-button-primary {
  background: #667eea;
  border-color: #667eea;
  height: 48px;
  font-size: 1.1rem;
}

.p-button-primary:hover {
  background: #5a67d8;
  border-color: #5a67d8;
}

.p-error {
  font-size: 0.85rem;
  margin-top: 0.25rem;
  text-align: left;
}
</style>