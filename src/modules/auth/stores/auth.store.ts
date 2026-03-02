import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { tokenStorage } from '@/infrastructure/auth/tokenStorage'

export const useAuthStore = defineStore('auth', () => {
  /* ======================
     STATE
  ====================== */

  const token = ref<string | null>(tokenStorage.get())

  // Mantiene el store sincronizado si otra parte de la app limpia/setea el token
  // (por ejemplo, interceptores HTTP ante 401)
  tokenStorage.subscribe((value) => {
    token.value = value
  })

  /* ======================
     GETTERS
  ====================== */

  const isAuthenticated = computed(() => Boolean(token.value))

  const getToken = () => token.value

  /* ======================
     ACTIONS
  ====================== */

  const setToken = (value: string) => {
    token.value = value
    tokenStorage.set(value)
  }

  const logout = () => {
    token.value = null
    tokenStorage.clear()
  }

  return {
    token,
    isAuthenticated,
    getToken,
    setToken,
    logout,
  }
})