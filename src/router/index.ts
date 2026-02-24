import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/modules/auth/pages/LoginPage.vue'
import CategoryPage from '@/modules/categories/pages/CategoryPage.vue'
import ProductPage from '@/modules/products/pages/ProductPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/categorias',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      guestOnly: true,
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
    redirect: '/categorias',
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
    return '/login'
  }

  if (to.meta.guestOnly && token) {
    return '/categorias' // Redirigir al componente principal después de iniciar sesión
  }

  return true
})

export default router