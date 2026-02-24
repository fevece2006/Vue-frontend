import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const TOKEN_KEY = 'jwt_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))

  const isAuthenticated = computed(() => Boolean(token.value))

  const setToken = (value: string) => {
    token.value = value
    localStorage.setItem(TOKEN_KEY, value)
  }

  const clearToken = () => {
    token.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  return {
    token,
    isAuthenticated,
    setToken,
    clearToken,
  }
})