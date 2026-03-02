import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { pinia } from '@/plugins/pinia'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'

export const ROUTE_NAMES = {
  login: 'login',
  principal: 'principal',
  categories: 'categories',
  products: 'products',
  directivas: 'directivas',
  eventos: 'eventos',
  variablesReactivas: 'variables-reactivas',
} as const

type RouteMetaAuth = {
  requiresAuth?: boolean
  guestOnly?: boolean
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: ROUTE_NAMES.principal },
  },
  {
    path: '/login',
    name: ROUTE_NAMES.login,
    component: () => import('@/modules/auth/pages/LoginPage.vue'),
    meta: {
      guestOnly: true,
    } satisfies RouteMetaAuth,
  },

  // ZONA AUTENTICADA (layout + rutas hijas)
  {
    path: '/',
    component: AuthenticatedLayout,
    meta: {
      requiresAuth: true,
    } satisfies RouteMetaAuth,
    children: [
      // RUTA PRINCIPAL (HOME DESPUÉS DE LOGIN)
      {
        path: 'principal',
        name: ROUTE_NAMES.principal,
        component: () => import('@/modules/principal/pages/PrincipalPage.vue'),
      },
      {
        path: 'categorias',
        name: ROUTE_NAMES.categories,
        component: () => import('@/modules/categories/pages/CategoryPage.vue'),
      },
      {
        path: 'productos',
        name: ROUTE_NAMES.products,
        component: () => import('@/modules/products/pages/ProductPage.vue'),
      },
      {
        path: 'directivas',
        name: ROUTE_NAMES.directivas,
        component: () => import('@/modules/temas/pages/DirectivasPage.vue'),
      },
      {
        path: 'eventos',
        name: ROUTE_NAMES.eventos,
        component: () => import('@/modules/temas/pages/EventosPage.vue'),
      },
      {
        path: 'variables-reactivas',
        name: ROUTE_NAMES.variablesReactivas,
        component: () => import('@/modules/temas/pages/VariablesReactivasPage.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: ROUTE_NAMES.principal },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore(pinia)
  const isAuthenticated = authStore.isAuthenticated
  const meta = (to.meta ?? {}) as RouteMetaAuth

  if (meta.requiresAuth && !isAuthenticated) {
    // guardamos a dónde iba para volver después del login
    return {
      name: ROUTE_NAMES.login,
      query: { redirect: to.fullPath },
    }
  }

  if (meta.guestOnly && isAuthenticated) {
    return { name: ROUTE_NAMES.principal }
  }

  return true
})

export default router