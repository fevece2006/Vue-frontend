# Guía funcional paso a paso

> Docker: para entrar al contenedor y ver los archivos desplegados (NGINX en `/usr/share/nginx/html`), ver [12-contenedor.md](12-contenedor.md).

> Rutas y navegación (RouterView, guards, layout autenticado): ver [13-rutas.md](13-rutas.md).

## Objetivo funcional

Construir una aplicación empresarial para:

1. autenticar usuarios con JWT,
2. mantener categorías,
3. mantener productos,
4. relacionar cada producto con una categoría.

## Flujo 1: Inicio de sesión

1. El usuario entra a `/login`.
2. Ingresa usuario y contraseña.
3. El sistema valida campos con VeeValidate + Zod.
4. Se invoca `POST /auth/login`.
5. Si es exitoso, se guarda el JWT y se redirige a `categorias`.
6. Si falla, se muestra error.

## Flujo 2: Mantenimiento de categorías

1. Abrir módulo `Categorías`.
2. Ver tabla de categorías (consulta con TanStack Query).
3. Crear categoría:
   - abrir diálogo,
   - completar formulario,
   - guardar,
   - refrescar lista automáticamente.
4. Editar categoría:
   - abrir diálogo con datos actuales,
   - modificar,
   - guardar y refrescar.
5. Eliminar categoría:
   - ejecutar acción eliminar,
   - refrescar lista.

## Flujo 3: Mantenimiento de productos

1. Abrir módulo `Productos`.
2. Ver tabla de productos.
3. Crear producto:
   - nombre,
   - precio,
   - stock,
   - categoría.
4. Editar producto con el mismo formulario.
5. Eliminar producto desde la tabla.

## Comportamiento técnico visible para el alumno

- Rutas cargan por demanda (lazy route loading).
- Formularios se cargan como componentes asíncronos.
- Vite separa chunks por tipo de librería.
- Toda petición al backend usa JWT cuando el usuario está autenticado.
- Al recibir `401`, se invalida la sesión local.

## Endpoints esperados del backend

- `POST /auth/login` → `{ token }`
- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`
- `GET /products`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

## Prueba funcional sugerida para clase

1. Iniciar sesión.
2. Crear 2 categorías.
3. Crear 3 productos en distintas categorías.
4. Editar una categoría y un producto.
5. Eliminar un producto.
6. Cerrar sesión y validar acceso protegido.