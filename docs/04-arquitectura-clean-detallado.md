# Arquitectura Clean en este proyecto

## 1. ¿Qué es Clean Architecture?

Clean Architecture organiza el sistema en capas para separar responsabilidades y reducir acoplamiento.

Principio clave:

- Las dependencias siempre apuntan hacia adentro (hacia el dominio).
- El dominio no conoce detalles de framework, UI, Axios, PrimeVue o Vue.

## 2. Capas usadas en este proyecto

### Capa 1: Domain (`src/core/domain`)

**Responsabilidad**:

- Definir el modelo del negocio y contratos puros.

**Contenido actual**:

- Entidades:
  - `entities/Category.ts`
  - `entities/Product.ts`
- Contratos de repositorio:
  - `repositories/CategoryRepository.ts`
  - `repositories/ProductRepository.ts`

**Regla**:

- No importa Vue, Axios, Pinia ni librerías de infraestructura.

### Capa 2: Application (`src/core/application`)

**Responsabilidad**:

- Implementar casos de uso del negocio.

**Contenido actual**:

- `use-cases/category/CategoryUseCases.ts`
- `use-cases/product/ProductUseCases.ts`

**Qué hace**:

- Orquesta acciones del sistema (`list`, `create`, `update`, `remove`) usando interfaces del dominio.
- No sabe si los datos vienen de HTTP, cache, localStorage o base de datos.

### Capa 3: Infrastructure (`src/infrastructure`)

**Responsabilidad**:

- Implementar detalles técnicos concretos.

**Contenido actual**:

- Cliente HTTP:
  - `http/axiosClient.ts`
- Repositorios concretos:
  - `repositories/CategoryApiRepository.ts`
  - `repositories/ProductApiRepository.ts`
- Composición de dependencias:
  - `container.ts`

**Qué hace**:

- Traduce las interfaces del dominio a llamadas reales REST.
- Configura JWT y manejo de `401` en interceptores.

### Capa 4: Presentation (`src/modules`, `src/router`, `src/App.vue`, `src/main.ts`)

**Responsabilidad**:

- Mostrar UI y manejar interacción del usuario.

**Contenido actual**:

- Módulos por feature:
  - `modules/auth`
  - `modules/categories`
  - `modules/products`
- Navegación:
  - `router/index.ts`
- Shell y bootstrap:
  - `App.vue`
  - `main.ts`

**Qué hace**:

- Formularios, tablas, diálogo, validación y navegación.
- Invoca composables que consumen casos de uso.

## 3. Regla de dependencias (la más importante)

**Dirección permitida**:

- Presentation → Application → Domain
- Infrastructure → Domain
- Infrastructure → Application (solo para construir dependencias en `container.ts`)

**Dirección NO permitida**:

- Domain → Infrastructure
- Domain → Presentation
- Application → Presentation

## 4. Flujo real de un caso de uso (crear categoría)

1. Usuario llena formulario en `CategoryForm.vue`.
2. `CategoryPage.vue` dispara el submit.
3. `useCategories.ts` ejecuta la mutación.
4. La mutación llama a `categoryUseCases.create(...)`.
5. `CategoryUseCases` delega en `CategoryRepository` (interfaz).
6. La implementación real `CategoryApiRepository` hace `POST /categories` con Axios.
7. TanStack Query invalida cache y refresca la tabla.

## 5. ¿Por qué esta arquitectura ayuda en clase y en trabajo real?

- Facilita mantenimiento: cada cambio tiene lugar claro.
- Mejora testabilidad: los casos de uso se prueban aislados de Vue.
- Reduce impacto de cambios de tecnología.
- Permite escalar por módulos (categorías, productos, etc.).
- Favorece colaboración por equipos (frontend, dominio, integración).

## 6. Guía rápida de ubicación por responsabilidad

- Si cambia una regla de negocio: `src/core/application` o `src/core/domain`.
- Si cambia endpoint o seguridad HTTP: `src/infrastructure`.
- Si cambia pantalla/formulario/UX: `src/modules`.
- Si cambia navegación/autorización de rutas: `src/router/index.ts`.

## 7. Convención recomendada para próximos módulos

Cuando agregues un nuevo módulo (por ejemplo, proveedores):

1. Crear entidad y contrato en `src/core/domain`.
2. Crear casos de uso en `src/core/application/use-cases`.
3. Implementar repositorio API en `src/infrastructure/repositories`.
4. Registrar instancias en `src/infrastructure/container.ts`.
5. Crear `pages`, `components` y `composables` en `src/modules/proveedores`.
6. Agregar ruta lazy en `src/router/index.ts`.

Con esta secuencia mantienes la arquitectura limpia y consistente.

## 8. Detalles Específicos de Configuración

### Configuración de Axios
- **Archivo**: `src/infrastructure/http/axiosClient.ts`.
- **Propósito**: Configurar cliente HTTP con `baseURL` y manejo de tokens JWT.
- **Detalles**:
  - `baseURL`: Se obtiene de `VITE_API_URL` definido en los archivos `.env`.
  - Interceptores: Añaden encabezados `Authorization` y manejan errores `401`.

### Configuración de Rutas
- **Archivo**: `src/router/index.ts`.
- **Propósito**: Definir navegación y lazy loading de páginas.
- **Detalles**:
  - Uso de `component: () => import('...')` para cargar rutas bajo demanda.

### Configuración de PrimeVue
- **Archivo**: `src/main.ts`.
- **Propósito**: Registrar PrimeVue y configurar el tema visual.
- **Detalles**:
  - Importar y registrar componentes específicos.
  - Configurar el tema `Aura`.

### Configuración de Chunking
- **Archivo**: `vite.config.ts`.
- **Propósito**: Dividir el código en chunks lógicos para optimizar la carga.
- **Detalles**:
  - Configuración de `manualChunks` para separar dependencias como `vendor-vue` y `vendor-data`.

### Configuración de Entornos
- **Archivos**: `.env.development`, `.env.production`, `.env.devlocal`.
- **Propósito**: Definir variables de entorno para cada ambiente.
- **Detalles**:
  - Ejemplo: `VITE_API_URL=http://localhost:3000`.

---

Con estas configuraciones, la arquitectura Clean se adapta a las necesidades del proyecto, manteniendo un diseño modular, escalable y fácil de mantener.