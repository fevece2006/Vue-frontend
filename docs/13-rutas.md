# Rutas, RouterView y navegación (Vue Router)

Este documento explica de forma explícita cómo se cargan y se resuelven las rutas en este proyecto, qué hace `<RouterView />`, cómo funciona la navegación y dónde se define cada cosa.

> Docker (inspección de contenedor y archivos desplegados): ver [12-contenedor.md](12-contenedor.md).

---

## 1) ¿Dónde se define el mapa de rutas?

El mapa de rutas vive en:

- `src/router/index.ts`

Ahí se define:

- `ROUTE_NAMES`: nombres de rutas (mejor práctica para navegar sin hardcodear paths).
- `routes`: array de `RouteRecordRaw`.
- `router.beforeEach(...)`: guard global para autenticación y rutas de invitado.

### Nombres de ruta vs paths

En este proyecto se navega por **nombre**:

```ts
router.push({ name: ROUTE_NAMES.products })
```

Ventaja: si mañana cambia el path (por ejemplo de `/productos` a `/products`), el menú y la UI no tienen que cambiar; solo cambia el router.

---

## 2) ¿Cuándo se “carga” `src/router/index.ts`?

Se evalúa cuando la aplicación arranca, porque el router se **importa y registra** como plugin de Vue en `src/main.ts`:

- `createApp(App)` crea la app.
- `app.use(router)` registra el router.
- `app.mount('#app')` monta la app.

En el momento en que `main.ts` importa el router, se ejecuta `src/router/index.ts` (se crean las rutas y se registra el guard).

---

## 3) ¿Qué es `<RouterView />` y qué hace en `App.vue`?

`<RouterView />` es el “contenedor” donde Vue Router renderiza el componente asociado a la ruta actual.

En este proyecto, `src/App.vue` quedó intencionalmente simple:

- Renderiza un `<RouterView />` (para el layout o la página que corresponda).
- Renderiza un `<Toast />` global (notificaciones) para toda la app.

Importante: `App.vue` **no decide** qué página mostrar. Solo ofrece el “hueco” (`RouterView`) donde el router inserta el componente.

---

## 4) RouterView anidado (layout autenticado)

El router está organizado con un layout para la zona autenticada:

- Layout: `src/layouts/AuthenticatedLayout.vue`
- Dentro del layout hay **otro** `<RouterView />`.

Eso permite:

- `App.vue` → renderiza el layout autenticado (si la ruta es privada).
- `AuthenticatedLayout.vue` → renderiza la página hija (principal/categorías/productos/temas).

Visualmente:

- `App.vue`
  - `<RouterView />` → `AuthenticatedLayout.vue`
    - `<RouterView />` → `PrincipalPage.vue` o `CategoryPage.vue` o `ProductPage.vue`…

---

## 5) ¿Cómo quedan las rutas con layout + children?

En `src/router/index.ts` hay dos grandes bloques:

1) Ruta pública:

- `/login` → `LoginPage.vue` (con `meta.guestOnly: true`)

2) Zona autenticada:

- Un padre con `component: AuthenticatedLayout` y `meta.requiresAuth: true`
- `children`:
  - `/principal`
  - `/categorias`
  - `/productos`
  - `/directivas`
  - `/eventos`
  - `/variables-reactivas`

Así no se repite `requiresAuth` en cada una: lo heredan del padre.

---

## 6) Guards: autenticación y rutas de invitado

El guard global está en `src/router/index.ts`:

- Si una ruta requiere autenticación (`meta.requiresAuth`) y el usuario no está autenticado:
  - redirige a `login`
  - y guarda la URL original en `?redirect=...`

- Si una ruta es solo para invitados (`meta.guestOnly`) y el usuario ya está autenticado:
  - redirige a `principal`

Esto hace que:

- Entrar manualmente a `/categorias` sin token → te manda a `/login?redirect=/categorias`.
- Loguearte → vuelve a la ruta original (si existe `redirect`).

---

## 7) ¿Cómo se navega en la UI?

Hay dos formas comunes:

### A) Navegación declarativa (recomendada en templates)

Con `<RouterLink />`:

```vue
<RouterLink :to="{ name: ROUTE_NAMES.categories }">Categorías</RouterLink>
```

### B) Navegación programática (eventos / handlers)

Con el objeto `router`:

```ts
import { useRouter } from 'vue-router'

const router = useRouter()
router.push({ name: ROUTE_NAMES.categories })
```

En este proyecto, el menú navega programáticamente (PrimeVue Menubar usa `command`).

---

## 8) ¿Dónde vive el menú y por qué?

El menú visible en rutas privadas vive en el layout:

- `src/layouts/AuthenticatedLayout.vue`

Y la lista de items está desacoplada en:

- `src/modules/shared/navigation/menuItems.ts`

Esto evita que:

- `App.vue` se convierta en un componente “gigante”.
- el layout tenga hardcodeado un array grande de navegación.

---

## 9) Logout y navegación al salir

La acción de logout está encapsulada en un composable:

- `src/modules/auth/composables/useLogout.ts`

Hace:

- `authStore.logout()` (limpia token/estado)
- `router.push({ name: ROUTE_NAMES.login })`

---

## 10) Checklist rápido para agregar una nueva pantalla

1) Crear página en el módulo (por ejemplo `src/modules/xxx/pages/XxxPage.vue`).
2) Agregar ruta lazy en `src/router/index.ts` (ideal: como `child` del layout autenticado si es privada).
3) Agregar `ROUTE_NAMES.xxx` si vas a navegar por nombre.
4) Agregar item en `src/modules/shared/navigation/menuItems.ts` si debe estar en el menú.
