# Checklist de prueba manual (Frontend + Backend API)

> Docker: para entrar al contenedor y ver los archivos desplegados (NGINX en `/usr/share/nginx/html`), ver [12-contenedor.md](12-contenedor.md).

> Rutas y navegación (RouterView, guards, layout autenticado): ver [13-rutas.md](13-rutas.md).

Este checklist valida el frontend contra los endpoints documentados en `BACKEND_API_TESTING_GUIDE.md`.

## 0) Preparación

- Backend levantado.
- Instalar dependencias:

```powershell
npm install
```

- Ejecutar frontend según ambiente:

### Desarrollo (`.env.development` → `http://localhost:9090`)

```powershell
npm run dev
```

### Local (`.env.local` → `http://localhost:7070`)

```powershell
npm run dev:local
```

### Producción (`.env.production` → `http://localhost:8080`)

```powershell
npm run build
npm run preview
```

## 1) Login

- Ir a `/login`.
- Ingresar un usuario válido (registrado en backend).
- Resultado esperado:
  - Redirección a `/categorias`.
  - Se guarda `jwt_token` en `localStorage`.

### Casos de error

- Password inválida:
  - Resultado esperado: mensaje de backend (ej. `Credenciales inválidas`).
- Sin token / token vencido:
  - Resultado esperado: al navegar a `/categorias` o `/productos`, redirige a `/login`.

## 2) CRUD Categorías

- Crear categoría con nombre válido.
  - Esperado: aparece en tabla.
- Editar categoría.
  - Esperado: se actualiza en tabla.
- Eliminar categoría.
  - Esperado: desaparece de tabla.

### Validaciones esperadas

- Nombre vacío:
  - Esperado: mensaje de error (frontend o backend).
- Nombre > 120 caracteres:
  - Esperado: rechazo con mensaje correspondiente.

## 3) CRUD Productos

- Crear producto con:
  - `name` válido
  - `description` opcional
  - `price > 0`
  - `categoryId` seleccionado
- Esperado: aparece en tabla.

- Editar producto.
  - Esperado: se actualiza en tabla.

- Eliminar producto.
  - Esperado: desaparece de tabla.

### Validaciones esperadas

- `price <= 0`:
  - Esperado: error de validación.
- `name` vacío o muy largo (>150):
  - Esperado: error de validación.
- `description` > 500:
  - Esperado: error de validación.

## 4) Verificación rápida de sesión

- Cerrar sesión con botón `Cerrar sesión`.
  - Esperado: borra `jwt_token` y vuelve a `/login`.

## 5) Smoke test final

- Login exitoso.
- Crear/editar/eliminar 1 categoría.
- Crear/editar/eliminar 1 producto.
- Logout exitoso.

Si todo pasa, el frontend está correctamente acondicionado para la API del backend.
