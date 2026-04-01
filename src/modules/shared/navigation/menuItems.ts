import type { Router } from 'vue-router'
import type { MenuItem } from 'primevue/menuitem'

import { ROUTE_NAMES } from '@/router'

export function buildAuthenticatedMenuItems(router: Router): MenuItem[] {
  const goHome = () => router.push({ name: ROUTE_NAMES.principal })

  return [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: goHome,
      class: 'menu-home',
    },
    {
      label: 'Mantenimiento',
      items: [
        { label: 'Categorías', command: () => router.push({ name: ROUTE_NAMES.categories }) },
        { label: 'Productos', command: () => router.push({ name: ROUTE_NAMES.products }) },
      ],
    },
    {
      label: 'Temas',
      items: [
        { label: 'Directivas', command: () => router.push({ name: ROUTE_NAMES.directivas }) },
        { label: 'Eventos', command: () => router.push({ name: ROUTE_NAMES.eventos }) },
        {
          label: 'Variables reactivas',
          command: () => router.push({ name: ROUTE_NAMES.variablesReactivas }),
        },
        {
          label: 'Formularios en Vue 3',
          items: [
            {
              label: '1. Formularios Básicos con v-model',
              command: () => router.push({ name: ROUTE_NAMES.formulariosBasicos }),
            },
            {
              label: '2. v-model con Modificadores',
              command: () => router.push({ name: ROUTE_NAMES.modificadores }),
            },
            {
              label: '3. Validación con Composables 🔥',
              command: () => router.push({ name: ROUTE_NAMES.validacionComposables }),
            },
            {
              label: '4. Formularios Dinámicos (Arrays)',
              command: () => router.push({ name: ROUTE_NAMES.formulariosDinamicos }),
            },
            {
              label: '5. useForm Reutilizable 🔥 Senior',
              command: () => router.push({ name: ROUTE_NAMES.useForm }),
            },
            {
              label: '6. VeeValidate + Yup',
              command: () => router.push({ name: ROUTE_NAMES.veeValidate }),
            },
            {
              label: '7. Caso Práctico Integrador 🧪',
              command: () => router.push({ name: ROUTE_NAMES.casoPractico }),
            },
          ],
        },
      ],
    },
  ]
}
