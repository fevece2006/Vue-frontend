# Clean Architecture (Resumen 1 página)

> Docker: para entrar al contenedor y ver los archivos desplegados (NGINX en `/usr/share/nginx/html`), ver [12-contenedor.md](12-contenedor.md).

> Rutas y navegación (RouterView, guards, layout autenticado): ver [13-rutas.md](13-rutas.md).

## Objetivo

Separar responsabilidades para construir un frontend mantenible, escalable y fácil de probar.

## Regla principal

Las dependencias siempre van hacia adentro:

**Presentation → Application → Domain**

Infrastructure implementa detalles y se conecta al dominio por interfaces.

## Capas del proyecto

## 1) Domain (`src/core/domain`)

- Entidades: `Category`, `Product`.
- Contratos: `CategoryRepository`, `ProductRepository`.
- No conoce Vue, Axios, Pinia ni PrimeVue.

## 2) Application (`src/core/application`)

- Casos de uso:
  - `CategoryUseCases`
  - `ProductUseCases`
- Orquesta reglas de negocio usando interfaces del dominio.

## 3) Infrastructure (`src/infrastructure`)

- `axiosClient.ts`: HTTP + JWT + interceptores.
- `*ApiRepository.ts`: implementación REST real de los contratos.
- `container.ts`: composición de dependencias.

## 4) Presentation (`src/modules`, `src/router`, `src/App.vue`, `src/main.ts`)

- Páginas, formularios, tablas y navegación.
- Validación con VeeValidate + Zod.
- Estado UI con Pinia y datos con TanStack Query.

## Flujo rápido (Crear categoría)

1. Usuario envía formulario en UI.
2. Composable dispara mutación.
3. Caso de uso ejecuta lógica.
4. Repositorio API llama backend.
5. Query invalida cache y refresca tabla.

## Beneficios

- Mantenimiento más simple.
- Menos acoplamiento técnico.
- Cambios de backend/UI con menor impacto.
- Mejor testabilidad.
- Escalado ordenado por módulos.

## Qué tocar según necesidad

- Regla de negocio: `core/domain` o `core/application`.
- Endpoint/API/JWT: `infrastructure`.
- Pantalla/formulario/UX: `modules`.
- Navegación y protección de rutas: `router/index.ts`.
