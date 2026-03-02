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
      ],
    },
  ]
}
