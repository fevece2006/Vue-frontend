# 7 · Caso Práctico — Registro de Cliente

**Archivo:** `CasoPracticoPage.vue`  
**Tema:** Formulario completo que integra todos los conceptos anteriores: `reactive`, validación manual, campos dinámicos, `watch`, `computed`, submit asíncrono y UX profesional.

---

## Visión general

Este formulario es el "todo en uno" del módulo. Combina:

| Concepto | ¿Dónde aparece? |
|---------|----------------|
| `reactive` | `form`, `errors`, `telefonos` |
| `ref` | `formStatus`, `submittedData`, `telefonoId` |
| `computed` | `isValid` (estado global del form) |
| `watch` | Revalidación en tiempo real de `email` y `nombre` |
| Campos dinámicos | Lista de teléfonos con agregar/eliminar |
| Validación manual | Objeto `rules` + `validateField` + `validateAll` |
| Submit asíncrono | `async/await` + `setTimeout` simulando API |
| Reset | `resetForm` devuelve todo al estado inicial |

---

## Bloque `<script setup>`

### Imports

```ts
import { ref, reactive, computed, watch } from 'vue'
```
- `ref` → para `formStatus` y `submittedData` (primitivos o valores que se reemplazan enteros).
- `reactive` → para `form`, `errors` y `telefonos` (objetos/arrays en profundidad).
- `computed` → para `isValid` (valor derivado que se actualiza automáticamente).
- `watch` → para observar cambios específicos en el formulario.

---

### Tipos TypeScript

```ts
interface Telefono {
  id: number
  valor: string
  error: string
}
```
- `Telefono` → estructura de cada teléfono en el array dinámico.
- `id` → identificador único para `v-for :key` y la función de eliminar.
- `valor` → el texto del input.
- `error` → mensaje de validación propio de ese teléfono.

```ts
type FormStatus = 'idle' | 'loading' | 'success' | 'error'
```
- `type` → alias de tipo TypeScript.
- Union de strings literales: solo se pueden asignar esos 4 valores.
- `'idle'` → estado inicial, sin actividad.
- `'loading'` → se está enviando al servidor.
- `'success'` → el servidor procesó correctamente.
- `'error'` → algo falló durante el envío.

---

### Estado del formulario

```ts
const form = reactive({
  nombre:    '',
  apellido:  '',
  email:     '',
  documento: '',
  plan:      '',
})
```
- `reactive({})` → todos los campos de datos personales en un solo objeto reactivo.
- Inicialmente vacíos.
- Se accede en el template con `form.nombre`, `form.email`, etc.

```ts
const errors = reactive<Record<string, string>>({})
```
- Objeto de errores. Empieza vacío.
- Se puebla dinámicamente con las claves de los campos que fallan (ej: `{ email: 'Correo inválido.' }`).

```ts
let telefonoId = 0
const telefonos = reactive<Telefono[]>([{ id: ++telefonoId, valor: '', error: '' }])
```
- `let telefonoId = 0` → contador no reactivo para generar IDs únicos.
- `reactive<Telefono[]>([...])` → array reactivo empezando con un teléfono vacío.
- `++telefonoId` → el primer teléfono recibe `id = 1`.

```ts
const formStatus = ref<FormStatus>('idle')
const submittedData = ref<object | null>(null)
```
- `formStatus` → estado de la petición (ver tipo `FormStatus` arriba).
- `submittedData` → guarda los datos enviados al servidor (para mostrarlos en la pantalla de éxito).
  - `null` inicial → no se ha enviado nada.
  - `object | null` → puede ser un objeto o null.

---

### Objeto de reglas de validación

```ts
const rules: Record<string, (v: string) => string | null> = {
  nombre:    (v) => !v.trim() ? 'Nombre es obligatorio.' : v.trim().length < 2 ? 'Mínimo 2 caracteres.' : null,
  apellido:  (v) => !v.trim() ? 'Apellido es obligatorio.' : null,
  email:     (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Correo inválido.' : null,
  documento: (v) => !/^\d{7,10}$/.test(v.trim()) ? 'Documento: entre 7 y 10 dígitos.' : null,
  plan:      (v) => !v ? 'Debes seleccionar un plan.' : null,
}
```
- `Record<string, (v: string) => string | null>` → tipo: objeto con claves string y funciones que reciben string y devuelven string o null.
- Cada entrada es una **función de validación** para su campo:
  - `nombre`: obligatorio Y mínimo 2 caracteres.
  - `apellido`: solo obligatorio.
  - `email`: debe pasar la regex de email.
  - `documento`: solo dígitos, entre 7 y 10 caracteres. Regex: `^\d{7,10}$` donde `\d` = dígito, `{7,10}` = entre 7 y 10 repeticiones.
  - `plan`: no puede estar vacío (select sin opción = string vacío).
- Devuelven `null` si el campo es válido (sin error).

---

### `validateField`

```ts
function validateField(field: string) {
  const msg = rules[field]?.(form[field as keyof typeof form])
  if (msg) errors[field] = msg
  else delete errors[field]
}
```
- `rules[field]?.(...)` → **optional chaining** (`?.`): si `rules[field]` existe, llama la función; si no existe, devuelve `undefined` (no lanza error).
- `form[field as keyof typeof form]` → accede al valor del campo en el objeto `form`. El `as keyof typeof form` es una aserción TypeScript.
- `if (msg)` → string no vacío = hay error.
- `else delete errors[field]` → si el campo se corrigió, borra el error previo.

---

### `validateAll`

```ts
function validateAll(): boolean {
  Object.keys(rules).forEach(validateField)
  telefonos.forEach(validateTelefono)
  return Object.keys(errors).length === 0 && telefonos.every((t) => !t.error)
}
```
- `Object.keys(rules).forEach(validateField)` → valida todos los campos del `form`.
- `telefonos.forEach(validateTelefono)` → valida también cada teléfono dinámico.
- `return Object.keys(errors).length === 0` → no hay errores en los campos del form.
- `&& telefonos.every((t) => !t.error)` → ningún teléfono tiene error.
- Ambas condiciones deben ser verdaderas para devolver `true`.

---

### `validateTelefono`

```ts
function validateTelefono(t: Telefono) {
  if (!t.valor.trim()) { t.error = 'Requerido.'; return }
  t.error = /^\+?[\d\s\-()]{7,15}$/.test(t.valor.trim()) ? '' : 'Formato inválido.'
}
```
- `if (!t.valor.trim()) { t.error = 'Requerido.'; return }` → si vacío, asigna error y **sale** de la función (`return` anticipado).
- Si no está vacío, evalúa el regex:
  - `true` → pasa el formato → `t.error = ''` (limpia el error).
  - `false` → no pasa → `t.error = 'Formato inválido.'`.
- Muta directamente `t.error` del objeto dentro del array reactivo.

---

### `watch` — Revalidación en tiempo real

```ts
watch(() => form.email, () => {
  if (errors.email) validateField('email')
})
watch(() => form.nombre, () => {
  if (errors.nombre) validateField('nombre')
})
```
- `watch(() => form.email, callback)` → observa la propiedad `form.email`.
  - Usar `() => form.email` (getter) en lugar de `form.email` directamente, porque `watch` necesita una función para observar propiedades de objetos `reactive`.
- **Condición de guarda**: `if (errors.email)` → solo revalida si **ya hay un error** en ese campo.
  - Patrón de UX inteligente: si el usuario nunca tocó el campo, no lo molesta mientras escribe.
  - Si ya cometió un error y lo está corrigiendo, le muestra en tiempo real cuando lo arregló.
- Se aplica a `email` y `nombre` (los campos más críticos del formulario).

---

### `computed` — Estado global `isValid`

```ts
const isValid = computed(() => {
  const camposRellenos = Object.values(form).every((v) => v.trim() !== '')
  const sinErrores     = Object.keys(errors).length === 0
  const telefonosOk    = telefonos.every((t) => t.valor.trim() !== '' && !t.error)
  return camposRellenos && sinErrores && telefonosOk
})
```
- `computed` → se recalcula automáticamente cuando cambia `form`, `errors` o `telefonos`.
- `Object.values(form).every((v) => v.trim() !== '')` → todos los 5 campos del form están rellenos.
- `Object.keys(errors).length === 0` → el objeto de errores está vacío (sin errores activos).
- `telefonos.every((t) => t.valor.trim() !== '' && !t.error)` → todos los teléfonos tienen valor y sin error.
- `camposRellenos && sinErrores && telefonosOk` → las tres condiciones en AND: todas deben ser `true`.
- Usado en el template para: habilitar/deshabilitar el botón de envío y cambiar el color del indicador de estado.

---

### Campos dinámicos de teléfonos

```ts
function agregarTelefono() {
  telefonos.push({ id: ++telefonoId, valor: '', error: '' })
}
```
- Agrega un nuevo objeto vacío al array. Vue lo renderiza automáticamente.

```ts
function eliminarTelefono(id: number) {
  if (telefonos.length === 1) return
  telefonos.splice(telefonos.findIndex((t) => t.id === id), 1)
}
```
- `if (telefonos.length === 1) return` → siempre debe quedar al menos un teléfono.
- `findIndex` busca la posición del ítem por `id`.
- `splice(idx, 1)` → elimina 1 elemento en esa posición.

---

### Submit asíncrono

```ts
async function handleSubmit() {
  if (!validateAll()) {
    formStatus.value = 'error'
    return
  }
  formStatus.value = 'loading'
  try {
    await new Promise((r) => window.setTimeout(r, 1500))
    submittedData.value = {
      ...form,
      telefonos: telefonos.map((t) => t.valor),
    }
    formStatus.value = 'success'
  } catch {
    formStatus.value = 'error'
  }
}
```
- `if (!validateAll())` → si la validación completa falla:
  - `formStatus.value = 'error'` → muestra mensaje de error global.
  - `return` → no continúa.
- `formStatus.value = 'loading'` → activa estado de carga (bloquea botón, muestra spinner).
- `try { ... }` → intenta la operación asíncrona.
- `await new Promise((r) => window.setTimeout(r, 1500))` → simula 1.5 segundos de latencia de red.
  - `window.setTimeout` → se usa `window.setTimeout` en lugar de `setTimeout` para evitar ambigüedad con el TypeScript del entorno Node.
- `submittedData.value = { ...form, telefonos: telefonos.map((t) => t.valor) }` → construye el objeto a "enviar":
  - `...form` → spread de los datos personales.
  - `telefonos: telefonos.map((t) => t.valor)` → extrae solo los valores de los teléfonos (no los ids ni los errores).
- `formStatus.value = 'success'` → éxito: la UI mostrará la pantalla de confirmación.
- `catch` → si algo lanza un error → `formStatus.value = 'error'`.

---

### `resetForm`

```ts
function resetForm() {
  Object.assign(form, { nombre: '', apellido: '', email: '', documento: '', plan: '' })
  telefonos.splice(0, telefonos.length, { id: ++telefonoId, valor: '', error: '' })
  for (const k of Object.keys(errors)) delete errors[k]
  formStatus.value = 'idle'
  submittedData.value = null
}
```
- `Object.assign(form, {...})` → restablece los valores del form **sin reemplazar** el objeto (preserve la reactividad).
- `telefonos.splice(0, telefonos.length, {...})` → en un solo `splice`:
  - Borra **todos** los elementos del array (`0` es el índice de inicio, `telefonos.length` es cuántos eliminar).
  - Inserta el nuevo teléfono vacío como reemplazo.
  - Vista del array: `[tel1, tel2, tel3]` → `[{id: N, valor: '', error: ''}]` (un solo ítem vacío).
- `for...of + delete` → elimina cada clave del objeto `errors` (no se puede hacer `errors = {}`).
- `formStatus.value = 'idle'` → vuelve al estado inicial.
- `submittedData.value = null` → limpia los datos almacenados del envío.

---

## Bloque `<template>` — Patrones clave

### Pantalla de éxito condicional

```html
<div v-if="formStatus === 'success'" class="success-screen">
  <div class="success-icon">✔</div>
  <h2>¡Cliente registrado!</h2>
  <pre class="code">{{ JSON.stringify(submittedData, null, 2) }}</pre>
  <button type="button" class="btn btn--primary" @click="resetForm">Nuevo registro</button>
</div>

<div v-else class="form-layout">
  <!-- El formulario -->
</div>
```
- `v-if` / `v-else` → bifurcación entre dos "pantallas" del componente.
- `JSON.stringify(submittedData, null, 2)` → serializa el objeto enviado con indentación de 2 espacios para mostrarlo bonito.
- `<pre>` → etiqueta HTML que muestra el texto respetando espacios y saltos de línea.

### Indicador de estado global (barra de estado)

```html
<div class="status-bar">
  <span class="status-label">Estado del formulario:</span>
  <span :class="isValid ? 'pill pill--ok' : 'pill pill--off'">
    {{ isValid ? '✔ Listo para enviar' : '⚠ Completa todos los campos' }}
  </span>
  <span v-if="formStatus === 'loading'" class="pill pill--loading">⏳ Enviando…</span>
</div>
```
- `:class` ternario → cambia la clase CSS según el estado del `computed` `isValid`.
- El texto también cambia según `isValid` (operador ternario en interpolación).
- `v-if="formStatus === 'loading'"` → muestra el badge de "enviando" solo cuando se está procesando.

### Campo con validación al blur y clase de error

```html
<div class="field" :class="{ 'field--error': errors.nombre }">
  <label class="field__label">Nombre *</label>
  <input v-model="form.nombre" type="text" class="field__input" placeholder="Nombre" @blur="validateField('nombre')" />
  <span v-if="errors.nombre" class="field__error">{{ errors.nombre }}</span>
</div>
```
- `:class="{ 'field--error': errors.nombre }"` → el contenedor del campo se tiñe de rojo cuando hay error.
- `@blur="validateField('nombre')"` → valida cuando el usuario sale del campo.
- `v-if="errors.nombre"` → muestra el mensaje solo si hay error.

### Teléfonos dinámicos en el template

```html
<div
  v-for="tel in telefonos"
  :key="tel.id"
  class="dyn-row"
  :class="{ 'dyn-row--error': tel.error }"
>
  <div class="field" style="flex:1">
    <input
      v-model="tel.valor"
      type="tel"
      class="field__input"
      :placeholder="`Teléfono ${tel.id}, ej: +54 11 1234-5678`"
      @blur="validateTelefono(tel)"
    />
    <span v-if="tel.error" class="field__error">{{ tel.error }}</span>
  </div>
  <button
    type="button"
    class="btn-icon btn-icon--remove"
    :disabled="telefonos.length === 1"
    @click="eliminarTelefono(tel.id)"
  >✕</button>
</div>
```
- `:placeholder="\`Teléfono ${tel.id}…\`"` → placeholder dinámico con template literal.
- `@blur="validateTelefono(tel)"` → pasa el objeto completo del ítem al validador.
- `:disabled="telefonos.length === 1"` → deshabilita el botón de eliminar si es el último.

### Botón de submit con estados

```html
<button
  type="button"
  class="btn btn--primary"
  :disabled="formStatus === 'loading'"
  @click="handleSubmit"
>
  <span v-if="formStatus === 'loading'">⏳ Registrando cliente…</span>
  <span v-else>Registrar cliente</span>
</button>
```
- `:disabled="formStatus === 'loading'"` → el botón se deshabilita mientras se envía (evita doble submit).
- El texto cambia según el estado: "Registrando…" vs "Registrar cliente".

---

## Flujo completo del formulario

```
1. Usuario llena campos → v-model actualiza `form` en tiempo real
2. Usuario sale de un campo → @blur dispara validateField → aparece/desaparece error
3. Usuario corrige email/nombre → watch detecta cambio → revalida en tiempo real (si ya había error)
4. computed `isValid` se recalcula por cada cambio → barra de estado muestra el semáforo
5. Usuario agrega teléfonos → agregarTelefono() → Vue renderiza nuevo input
6. Usuario hace click en "Registrar cliente" → handleSubmit()
   a. validateAll() → muestra TODOS los errores si hay campos vacíos
   b. Si todo OK → status = 'loading' → simula API 1.5s → status = 'success'
   c. Si falla → status = 'error'
7. Pantalla de éxito muestra los datos y botón "Nuevo registro"
8. Click "Nuevo registro" → resetForm() → todo vuelve al estado inicial
```
