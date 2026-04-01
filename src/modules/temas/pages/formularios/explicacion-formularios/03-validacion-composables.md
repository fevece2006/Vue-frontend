# 3 · Validación con Composables

**Archivo:** `ValidacionComposablesPage.vue`  
**Tema:** Crear un composable `useValidation` para separar la lógica de validación de la UI.

---

## ¿Qué es un Composable?

Un **composable** es una función de JavaScript/TypeScript que:
- Usa las APIs reactivas de Vue 3 (`ref`, `reactive`, `computed`…).
- Encapsula lógica reutilizable.
- Se puede importar y usar en cualquier componente.
- Su nombre empieza con `use` por convención (ej: `useValidation`, `useForm`, `useFetch`).

**Analogía con React:** es el equivalente de un custom hook (`useXxx`).

---

## Bloque `<script setup>`

### Imports

```ts
import { ref, reactive, computed } from 'vue'
```
- `ref` → para valores primitivos reactivos (booleanos, strings de estado).
- `reactive` → para el objeto de errores y el objeto del formulario.
- `computed` → para calcular el estado global del formulario de forma derivada.

---

### El composable `useValidation`

```ts
function useValidation() {
  const errors = reactive<Record<string, string>>({})
```
- `useValidation` → función normal de TS que devuelve reactividad de Vue.
- `errors = reactive<Record<string, string>>({})` → objeto reactivo vacío.
  - `Record<string, string>` → tipo TypeScript: un objeto cuyas claves y valores son strings.
  - Ejemplo del objeto en uso: `{ nombre: 'Nombre es obligatorio.', correo: 'Correo inválido.' }`.
  - Las claves son los nombres de los campos; los valores son los mensajes de error.

#### Regla `required`

```ts
function required(field: string, value: string, label: string): boolean {
  if (!value.trim()) {
    errors[field] = `${label} es obligatorio.`
    return false
  }
  delete errors[field]
  return true
}
```
- `field: string` → clave del campo en el objeto `errors` (ej: `'nombre'`).
- `value: string` → el valor actual del campo del formulario.
- `label: string` → el nombre "amigable" del campo para el mensaje (ej: `'Nombre'`).
- `!value.trim()` → si el valor sin espacios es vacío (string vacío = falsy en JS).
- `errors[field] = \`...\`` → asigna el mensaje de error a ese campo.
- `return false` → indica que la validación **falló**.
- `delete errors[field]` → elimina el error si el campo ahora es válido.
- `return true` → indica que la validación **pasó**.

#### Regla `email`

```ts
function email(field: string, value: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(value)) {
    errors[field] = 'El correo no tiene un formato válido.'
    return false
  }
  delete errors[field]
  return true
}
```
- `const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/` → expresión regular para validar email:
  - `^` → inicio del string.
  - `[^\s@]+` → uno o más caracteres que NO sean espacio ni `@`.
  - `@` → el símbolo arroba literal.
  - `[^\s@]+` → uno o más caracteres que NO sean espacio ni `@` (dominio).
  - `\.` → un punto literal (escapado con `\`).
  - `[^\s@]+$` → extensión del dominio, hasta el final del string.
- `re.test(value)` → devuelve `true` si el valor cumple el patrón, `false` si no.
- `!re.test(value)` → si **no** cumple el patrón → entra al if → asigna error.

#### Regla `minLength`

```ts
function minLength(field: string, value: string, min: number, label: string): boolean {
  if (value.trim().length < min) {
    errors[field] = `${label} debe tener al menos ${min} caracteres.`
    return false
  }
  delete errors[field]
  return true
}
```
- `min: number` → la longitud mínima requerida (ej: `6` para contraseña).
- `value.trim().length < min` → longitud del texto (sin espacios) menor que el mínimo.
- El mensaje incluye tanto el `label` (nombre del campo) como `min` (cantidad) para ser descriptivo.

#### `clearError`

```ts
function clearError(field: string) {
  delete errors[field]
}
```
- Permite borrar el error de un campo específico manualmente.
- Útil para limpiar errores cuando el usuario empieza a escribir de nuevo.

#### Return del composable

```ts
return { errors, required, email, minLength, clearError }
```
- Exporta todo lo que el componente necesita: el objeto de errores y las funciones de validación.
- Cualquier componente que llame a `useValidation()` recibe su **propia instancia** independiente de `errors`.

---

### Instancia del composable

```ts
const { errors, required, email, minLength } = useValidation()
```
- Desestructuración: saca del objeto devuelto por el composable las partes que necesita el componente.
- `clearError` no se desestructura porque en esta página no se usa directamente.
- `errors` sigue siendo reactivo después de desestructurar porque `reactive` mantiene la referencia.

---

### Estado del formulario

```ts
const form = reactive({
  nombre: '',
  correo: '',
  contrasena: '',
})
```
- `reactive({})` → objeto reactivo con los tres campos del formulario.
- Todos inician vacíos `''`.
- Se accede como `form.nombre`, `form.correo`, `form.contrasena`.

```ts
const submitted = ref(false)
const submitSuccess = ref(false)
```
- `submitted` → `true` después del primer intento de envío (para mostrar mensajes de estado).
- `submitSuccess` → `true` si el formulario pasó todas las validaciones al enviarlo.

---

### Validators individuales por campo

```ts
function validateNombre() { required('nombre', form.nombre, 'Nombre') }
```
- Función pequeña que llama a la regla `required` con los parámetros correctos para `nombre`.
- Se llama desde el template con `@blur="validateNombre"` → valida cuando el usuario **sale** del campo.

```ts
function validateCorreo() {
  if (required('correo', form.correo, 'Correo')) email('correo', form.correo)
}
```
- **Validación en cadena**: primero verifica que no esté vacío (`required`).
- Si `required` devuelve `true` (campo relleno), **entonces** verifica el formato con `email`.
- Patrón: las validaciones posteriores solo se ejecutan si las anteriores pasaron.

```ts
function validateContrasena() { minLength('contrasena', form.contrasena, 6, 'Contraseña') }
```
- Valida que la contraseña tenga al menos 6 caracteres.
- Nota: el campo se llama `'contrasena'` (sin tilde) porque es la clave del objeto `errors`.

---

### Estado global del formulario

```ts
const isValid = computed(
  () => !errors.nombre && !errors.correo && !errors.contrasena
    && form.nombre.trim() && form.correo.trim() && form.contrasena.trim(),
)
```
- `computed` → se recalcula automáticamente cuando cualquiera de sus dependencias cambia.
- `!errors.nombre` → no hay error en nombre (`undefined` o `''` son falsy → `!undefined = true`).
- `!errors.correo` → no hay error en correo.
- `!errors.contrasena` → no hay error en contraseña.
- `form.nombre.trim()` → el campo no está vacío (string no vacío = truthy).
- La expresión completa es `true` solo cuando **todos** los campos están llenos **y** sin errores.

---

### Función submit

```ts
function handleSubmit() {
  validateNombre()
  validateCorreo()
  validateContrasena()
  submitted.value = true
  if (isValid.value) submitSuccess.value = true
}
```
- 1️⃣ Llama todas las validaciones para mostrar errores de todos los campos de una vez.
- 2️⃣ Marca `submitted = true` para que la UI pueda mostrar mensajes de estado.
- 3️⃣ Si el `computed` `isValid` es `true`, marca `submitSuccess = true` → éxito.
- Nota: no hay `async` aquí porque es una demostración educativa sin llamada a API real.

---

## Bloque `<template>` — Patrones clave

### Campo con validación al blur

```html
<input
  v-model="form.nombre"
  type="text"
  class="field__input"
  @blur="validateNombre"
/>
<span v-if="errors.nombre" class="field__error">{{ errors.nombre }}</span>
```
- `v-model="form.nombre"` → sincroniza el input con el campo `nombre` del objeto `form`.
- `@blur="validateNombre"` → valida al salir del campo (UX profesional: no molesta mientras escribe).
- `v-if="errors.nombre"` → muestra el span de error solo si existe el error (`errors.nombre` es un string no vacío).
- `{{ errors.nombre }}` → muestra el mensaje de error.

### Clases condicionales de error

```html
<div class="field" :class="{ 'field--error': errors.nombre }">
```
- `:class="{ 'field--error': errors.nombre }"` → agrega la clase CSS `field--error` al div solo cuando hay un error en `nombre`.
- Permite cambiar el borde, color de label y fondo del campo en CSS cuando es inválido.

---

## Ventaja del patrón Composable vs lógica en el componente

| Aspecto | Sin composable | Con composable |
|---------|---------------|----------------|
| Reutilización | Copiar/pegar entre componentes | Una sola definición |
| Testeo | Difícil (mezclado con UI) | Fácil (es solo TypeScript puro) |
| Tamaño del componente | Crece con cada campo | El componente solo contiene la UI |
| Nuevas reglas de validación | Modificar cada componente | Solo modificar el composable |
