import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const TOKEN_KEY = 'jwt_token'

export const useAuthStore = defineStore('auth', () => {
  /* ======================
     STATE
  ====================== */

  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))

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
    localStorage.setItem(TOKEN_KEY, value)
  }

  const logout = () => {
    token.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  return {
    token,
    isAuthenticated,
    getToken,
    setToken,
    logout,
  }
})