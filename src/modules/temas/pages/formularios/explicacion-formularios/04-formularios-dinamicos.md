# 4 · Formularios Dinámicos con Campos Array

**Archivo:** `FormulariosDinamicosPage.vue`  
**Tema:** Agregar y eliminar campos dinámicamente usando arrays reactivos con `v-for`.

---

## ¿Qué es un formulario dinámico?

Un formulario dinámico permite al usuario **agregar o quitar filas de inputs** en tiempo de ejecución. Casos de uso reales:
- Múltiples teléfonos de contacto.
- Múltiples correos electrónicos.
- Lista de ítems en un pedido/factura.
- Redes sociales / URLs de un perfil.

---

## Bloque `<script setup>`

### Imports

```ts
import { ref, reactive, computed } from 'vue'
```
- `reactive` → para los arrays que Vue debe observar en profundidad (detectar push/splice).
- `computed` → para calcular si todos los elementos del array son válidos.
- `ref` → para el estado de submit.

---

### Interfaz TypeScript para un ítem

```ts
interface TelefonoItem {
  id: number
  valor: string
  error: string
}
```
- `interface` → define la forma/estructura de cada elemento del array.
- `id: number` → identificador único del ítem. Necesario para:
  1. La prop `:key` del `v-for` (explica a Vue qué elemento es cuál).
  2. La función de eliminar (buscar por id).
- `valor: string` → el texto que escribe el usuario (el número de teléfono).
- `error: string` → el mensaje de error de validación de ese ítem específico. Vacío `''` = sin error.

### ¿Por qué `id` y no usar el índice del array?

Usar el **índice** del array como key es problemático: cuando eliminas un elemento del medio, todos los índices posteriores cambian y Vue redibujaría elementos incorrectamente. Con un `id` único y estable, Vue sabe exactamente qué elemento es cuál.

---

### Contador de IDs

```ts
let telefonoId = 0
```
- `let` (no `const`, no `ref`) → variable JavaScript normal, **no** reactiva.
- No necesita ser reactiva porque no se muestra en el template.
- Solo sirve para generar IDs únicos incrementales.

---

### El array reactivo

```ts
const telefonos = reactive<TelefonoItem[]>([{ id: ++telefonoId, valor: '', error: '' }])
```
- `reactive<TelefonoItem[]>` → array reactivo de elementos tipo `TelefonoItem`.
- `[{ id: ++telefonoId, ... }]` → inicia con **un** elemento para no mostrar el formulario vacío.
- `++telefonoId` → **pre-incremento**: incrementa `telefonoId` de 0 a 1 **antes** de usarlo. El primer id es `1`.
- `valor: ''` → campo vacío inicial.
- `error: ''` → sin error inicial.

---

### `agregarTelefono`

```ts
function agregarTelefono() {
  telefonos.push({ id: ++telefonoId, valor: '', error: '' })
}
```
- `telefonos.push(...)` → agrega un nuevo objeto al final del array.
- `++telefonoId` → cada nuevo elemento recibe un id único e incremental.
- Vue detecta el `push` porque `telefonos` es un `reactive` → automáticamente renderiza el nuevo input.

---

### `eliminarTelefono`

```ts
function eliminarTelefono(id: number) {
  if (telefonos.length === 1) return
  const idx = telefonos.findIndex((t) => t.id === id)
  if (idx !== -1) telefonos.splice(idx, 1)
}
```
- `if (telefonos.length === 1) return` → **guarda**: nunca eliminar el último campo. El formulario siempre necesita al menos uno.
- `telefonos.findIndex((t) => t.id === id)` → busca la posición en el array del elemento cuyo `id` coincide.
  - `(t) => t.id === id` → función flecha/callback de comparación.
  - Devuelve el índice (0, 1, 2…) o `-1` si no lo encuentra.
- `if (idx !== -1)` → solo elimina si efectivamente lo encontró.
- `telefonos.splice(idx, 1)` → elimina **1** elemento en la posición `idx`.
  - Vue detecta el `splice` y elimina el input correspondiente del DOM automáticamente.

---

### `validarTelefono`

```ts
function validarTelefono(item: TelefonoItem) {
  const re = /^\+?[\d\s\-()]{7,15}$/
  item.error = item.valor.trim() === ''
    ? 'El teléfono no puede estar vacío.'
    : !re.test(item.valor.trim())
      ? 'Formato de teléfono inválido.'
      : ''
}
```
- `item: TelefonoItem` → recibe el objeto ítem completo pour modificar su `error` directamente.
- `const re = /^\+?[\d\s\-()]{7,15}$/` → regex del formato de teléfono:
  - `^` → inicio.
  - `\+?` → el `+` es opcional (para prefijos internacionales como `+54`).
  - `[\d\s\-()]{7,15}` → entre 7 y 15 caracteres que pueden ser: dígitos `\d`, espacios `\s`, guiones `\-`, paréntesis `()`.
  - `$` → fin del string.
- Expresión ternaria encadenada:
  - Si `valor` vacío → error de "requerido".
  - Si no pasa regex → error de "formato inválido".
  - Si todo bien → error = `''` (limpia el error).
- `item.error = ...` → **muta directamente** la propiedad del objeto dentro del array reactivo. Vue detecta este cambio porque el objeto es parte de un `reactive`.

---

### `telefonosValidos` (computed)

```ts
const telefonosValidos = computed(() =>
  telefonos.every((t) => t.valor.trim() !== '' && t.error === ''),
)
```
- `computed` → se recalcula cuando cualquier propiedad de `telefonos` cambia.
- `telefonos.every(...)` → devuelve `true` si **todos** los elementos cumplen la condición.
- `t.valor.trim() !== ''` → el campo está relleno (no vacío).
- `t.error === ''` → sin error de validación.
- `&&` → ambas condiciones deben ser verdaderas para ese ítem.
- Resultado: `true` solo cuando **todos** los teléfonos están rellenos y son válidos.

---

### Array de correos (mismo patrón)

```ts
interface CorreoItem {
  id: number
  valor: string
  error: string
}

let correoId = 0
const correos = reactive<CorreoItem[]>([{ id: ++correoId, valor: '', error: '' }])
```
- Misma estructura que los teléfonos pero para correos electrónicos.
- Demuestra que el **patrón es reutilizable** para cualquier tipo de campo dinámico.

```ts
function validarCorreo(item: CorreoItem) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  item.error = item.valor.trim() === ''
    ? 'El correo no puede estar vacío.'
    : !re.test(item.valor.trim())
      ? 'Correo con formato inválido.'
      : ''
}
```
- Misma lógica pero con regex de email en lugar de teléfono.

### Estado y submit

```ts
const submitted = ref(false)
const formValido = computed(() => telefonosValidos.value && correosValidos.value)

function handleSubmit() {
  telefonos.forEach(validarTelefono)
  correos.forEach(validarCorreo)
  submitted.value = true
}
```
- `formValido` → computed que combina ambos arrays: válido solo si teléfonos **y** correos son válidos.
- `telefonos.forEach(validarTelefono)` → al hacer submit, valida **todos** los ítems de una vez y muestra todos los errores juntos.

---

## Bloque `<template>` — Patrones clave

### Renderizar campos dinámicos con `v-for`

```html
<div
  v-for="tel in telefonos"
  :key="tel.id"
  class="dyn-row"
  :class="{ 'dyn-row--error': tel.error }"
>
```
- `v-for="tel in telefonos"` → itera el array. Para cada elemento, `tel` es la referencia al objeto `TelefonoItem`.
- `:key="tel.id"` → identificador único y **estable** para el algoritmo del Virtual DOM. Usa el `id` del objeto, nunca el índice del array.
- `:class="{ 'dyn-row--error': tel.error }"` → aplica clase de error si `tel.error` es un string no vacío (truthy).

### Input con binding al objeto del array

```html
<input
  v-model="tel.valor"
  type="tel"
  class="field__input"
  @blur="validarTelefono(tel)"
/>
```
- `v-model="tel.valor"` → binding directo a la propiedad `valor` del objeto dentro del array reactivo. Vue detecta cambios en profundidad.
- `@blur="validarTelefono(tel)"` → pasa el objeto ítem completo al validador al salir del campo.

### Error por ítem

```html
<span v-if="tel.error" class="field__error">{{ tel.error }}</span>
```
- Cada ítem tiene su **propio** mensaje de error independiente.
- `v-if="tel.error"` → solo muestra si hay error (string no vacío).

### Botón eliminar con `disabled`

```html
<button
  type="button"
  class="btn-icon btn-icon--remove"
  :disabled="telefonos.length === 1"
  @click="eliminarTelefono(tel.id)"
>✕</button>
```
- `:disabled="telefonos.length === 1"` → deshabilita el botón si solo queda un teléfono.
- `@click="eliminarTelefono(tel.id)"` → pasa el `id` del ítem para identificar cuál eliminar.
- Botón `✕` como ícono de eliminar (texto simple, sin necesidad de librería de íconos).

### Botón agregar

```html
<button type="button" class="btn btn--add" @click="agregarTelefono">
  + Agregar teléfono
</button>
```
- Sin parámetros: agrega un nuevo ítem al final del array.
- `type="button"` → evita submit accidental del formulario.

---

## Flujo completo del ciclo de vida de un ítem dinámico

```
1. El usuario hace clic en "+ Agregar teléfono"
   → agregarTelefono() → telefonos.push(nuevo) → Vue renderiza nuevo input

2. El usuario escribe en el input
   → v-model actualiza tel.valor → Vue actualiza el DOM

3. El usuario sale del input (blur)
   → validarTelefono(tel) → muta tel.error → Vue muestra/oculta el mensaje de error

4. El usuario hace clic en "✕"
   → eliminarTelefono(tel.id) → telefonos.splice() → Vue elimina el input del DOM

5. Al hacer submit
   → telefonos.forEach(validarTelefono) → muestra errores de todos los ítems
```

---

## Resumen del patrón

```ts
// 1. Interfaz del ítem
interface MiItem { id: number; valor: string; error: string }

// 2. Contador de IDs
let miItemId = 0

// 3. Array reactivo con un ítem inicial
const items = reactive<MiItem[]>([{ id: ++miItemId, valor: '', error: '' }])

// 4. Agregar
function agregar() { items.push({ id: ++miItemId, valor: '', error: '' }) }

// 5. Eliminar (siempre mínimo 1)
function eliminar(id: number) {
  if (items.length === 1) return
  items.splice(items.findIndex(i => i.id === id), 1)
}

// 6. Validar un ítem
function validar(item: MiItem) {
  item.error = !item.valor.trim() ? 'Requerido.' : ''
}
```
