import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/modules/auth/pages/LoginPage.vue'
import CategoryPage from '@/modules/categories/pages/CategoryPage.vue'
import ProductPage from '@/modules/products/pages/ProductPage.vue'

// AJUSTA ESTA RUTA si tu archivo está en otra ubicación
import PrincipalPage from '@/modules/principal/pages/PrincipalPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/principal',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      guestOnly: true,
    },
  },

  // RUTA PRINCIPAL (HOME DESPUÉS DE LOGIN)
  {
    path: '/principal',
    name: 'principal',
    component: PrincipalPage,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: '/categorias',
    name: 'categories',
    component: CategoryPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/productos',
    name: 'products',
    component: ProductPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/principal',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const token = localStorage.getItem('jwt_token')

  console.log('Token actual:', token) // Depuración del token

  if (to.meta.requiresAuth && !token) {
    // guardamos a dónde iba para volver después del login
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.guestOnly && token) {
    return '/principal'
  }

  return true
})

export default router