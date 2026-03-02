import { useRouter } from 'vue-router'

import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { ROUTE_NAMES } from '@/router'

export function useLogout() {
  const router = useRouter()
  const authStore = useAuthStore()

  const logout = () => {
    authStore.logout()
    router.push({ name: ROUTE_NAMES.login })
  }

  return {
    logout,
  }
}
