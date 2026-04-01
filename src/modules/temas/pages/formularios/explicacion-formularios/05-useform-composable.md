# 5 · useForm — Composable Genérico de Formularios

**Archivo:** `UseFormPage.vue`  
**Tema:** Crear un composable genérico `useForm<T>` que centraliza estado, validación, submit y reset de cualquier formulario.

---

## ¿Por qué un composable `useForm`?

En los enfoques anteriores, cada componente repetía:
1. Declarar el objeto `form`.
2. Declarar el objeto `errors`.
3. Escribir funciones de `validateField` y `validate`.
4. Manejar el estado `loading`.
5. Manejar el submit con try/catch.
6. Resetear el formulario.

`useForm` centraliza **todo eso** en una función genérica reutilizable. Cualquier formulario (contacto, suscripción, registro, login…) puede usarla.

---

## Bloque `<script setup>`

### Imports

```ts
import { reactive, computed, ref } from 'vue'
```
- `reactive` → para los objetos de valores y errores.
- `computed` → para el estado `isValid` derivado.
- `ref` → para `loading` y `submitResult` (valores primitivos reactivos).

---

## El composable `useForm<T>`

### Definición del tipo `Rules<T>`

```ts
type Rules<T> = Partial<Record<keyof T, (val: string) => string | null>>
```
- `type` → define un alias de tipo TypeScript (como un typedef).
- `Partial<...>` → hace que **todas** las claves sean opcionales. No todos los campos necesitan regla.
- `Record<keyof T, ...>` → un objeto cuyas claves son exactamente las mismas que las claves del tipo `T`.
  - Si `T = { nombre: string; correo: string }`, entonces las claves posibles son `'nombre'` y `'correo'`.
- `(val: string) => string | null` → cada regla es una función que recibe el valor y devuelve:
  - `string` → el mensaje de error si falla.
  - `null` → si la validación pasa (todo está bien).

### Firma de la función

```ts
function useForm<T extends Record<string, string>>(
  initialValues: T,
  rules: Rules<T>,
) {
```
- `<T extends Record<string, string>>` → genérico con restricción: `T` debe ser un objeto cuyas claves y valores sean strings.
- `initialValues: T` → los valores iniciales, con los mismos campos que el formulario.
- `rules: Rules<T>` → el mapa de reglas de validación, parcial (no todos los campos necesitan regla).

---

### Estado interno del composable

```ts
const values = reactive<T>({ ...initialValues })
```
- `reactive<T>` → objeto reactivo con el tipo del formulario.
- `{ ...initialValues }` → spread: copia los valores iniciales. **No** usa el objeto original para evitar mutaciones accidentales del objeto externo.

```ts
const errors = reactive<Record<string, string>>({})
```
- Objeto de errores genérico. Las claves serán los nombres de los campos con error.

```ts
const loading = ref(false)
```
- `false` inicial → no está enviando.
- Cambia a `true` durante el submit asíncrono.

```ts
const submitResult = ref<'idle' | 'success' | 'error'>('idle')
```
- Estado de la petición con tres posibles valores:
  - `'idle'` → no se intentó enviar todavía.
  - `'success'` → el servidor respondió OK.
  - `'error'` → algo salió mal.
- Tipo union string: TypeScript solo permitirá asignar uno de esos tres valores.

---

### `validateField`

```ts
function validateField(field: keyof T): boolean {
  const rule = rules[field]
  if (!rule) return true
  const msg = rule(values[field] as string)
  if (msg) {
    errors[field as string] = msg
    return false
  }
  delete errors[field as string]
  return true
}
```
- `field: keyof T` → el nombre de un campo, restringido a las claves de `T` (TypeScript).
- `const rule = rules[field]` → busca si hay una regla definida para ese campo.
- `if (!rule) return true` → si no hay regla definida, el campo siempre es válido.
- `rule(values[field] as string)` → ejecuta la función de regla pasando el valor actual del campo.
  - `as string` → casteo necesario porque `values[field]` podría ser cualquier tipo de `T`.
- `if (msg)` → si la regla retornó un string (mensaje de error):
  - `errors[field as string] = msg` → guarda el error.
  - `return false` → falló.
- `delete errors[field as string]` → si la regla retornó `null`, borra el error previo.
- `return true` → pasó.

---

### `validate`

```ts
function validate(): boolean {
  let ok = true
  for (const field of Object.keys(rules) as (keyof T)[]) {
    if (!validateField(field)) ok = false
  }
  return ok
}
```
- `Object.keys(rules)` → obtiene todas las claves del objeto de reglas (los campos que tienen regla).
- `as (keyof T)[]` → casteo TypeScript para que `field` tenga el tipo correcto en `validateField`.
- Itera todos los campos con reglas y los valida.
- `let ok = true` → asume éxito; se pone en `false` si cualquier campo falla.
- **No** hace `return false` al primer error → **valida todos** para mostrar todos los errores juntos.

---

### `isValid` (computed)

```ts
const isValid = computed(
  () => Object.keys(errors).length === 0
    && Object.values(values).every((v) => (v as string).trim() !== ''),
)
```
- `Object.keys(errors).length === 0` → no hay ningún error activo.
- `Object.values(values).every(...)` → todos los campos están rellenos.
- `(v as string).trim() !== ''` → el valor no es vacío ni solo espacios.
- Condición AND: ambas deben ser verdaderas para que el formulario esté listo.

---

### `reset`

```ts
function reset() {
  Object.assign(values, initialValues)
  for (const k of Object.keys(errors)) delete errors[k]
  submitResult.value = 'idle'
}
```
- `Object.assign(values, initialValues)` → copia los valores iniciales de vuelta al objeto reactivo, reseteando todos los campos sin perder la referencia reactiva.
  - **NO** se puede hacer `values = { ...initialValues }` porque eso reemplazaría el objeto y perdería la reactividad.
- `for (const k of Object.keys(errors)) delete errors[k]` → elimina todos los errores uno por uno.
  - Tampoco se puede hacer `errors = {}` por la misma razón de reactividad.
- `submitResult.value = 'idle'` → vuelve al estado inicial.

---

### `handleSubmit`

```ts
async function handleSubmit(onValid: (vals: T) => Promise<void>) {
  if (!validate()) return
  loading.value = true
  submitResult.value = 'idle'
  try {
    await onValid(values as T)
    submitResult.value = 'success'
  } catch {
    submitResult.value = 'error'
  } finally {
    loading.value = false
  }
}
```
- `onValid: (vals: T) => Promise<void>` → callback: la función que el componente pasa para hacer el envío real (llamada API, acción de store…).
- `if (!validate()) return` → si hay errores, no envía.
- `loading.value = true` → activa el estado de carga para bloquear el botón y mostrar spinner.
- `await onValid(values as T)` → espera a que el componente complete su lógica asíncrona.
- `submitResult.value = 'success'` → solo llega aquí si `onValid` no lanzó excepción.
- `catch` → si `onValid` lanzó un error (red, server error), captura y marca como `'error'`.
- `finally` → se ejecuta **siempre**, tanto en éxito como en error: desactiva `loading`.

---

### Return del composable

```ts
return { values, errors, loading, submitResult, isValid, validateField, validate, reset, handleSubmit }
```
- Exporta todo lo que el template necesita: datos, estado y acciones.

---

## Uso del composable: Formulario de Contacto

```ts
const contacto = useForm(
  { nombre: '', correo: '', mensaje: '' },
  {
    nombre: (v) => (!v.trim() ? 'Nombre requerido.' : null),
    correo: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Correo inválido.' : null),
    mensaje: (v) => (v.trim().length < 10 ? 'Mínimo 10 caracteres.' : null),
  },
)
```
- Primera llamada con los valores `{ nombre, correo, mensaje }` → `T` se infiere como `{ nombre: string; correo: string; mensaje: string }`.
- Las reglas se definen inline como arrows: `(v) => condicion ? 'mensaje' : null`.
- `contacto` recibe todo el objeto devuelto por `useForm`.

```ts
async function enviarContacto() {
  await contacto.handleSubmit(async (vals) => {
    await new Promise((r) => window.setTimeout(r, 1200)) // simula API
    window.console.log('Contacto enviado:', vals)
  })
}
```
- `contacto.handleSubmit(...)` → llama al método del composable pasando el callback.
- `async (vals) => { ... }` → el callback recibe los valores validados y hace la petición real (o simulada).
- `await new Promise((r) => window.setTimeout(r, 1200))` → simula un delay de 1.2 segundos de llamada API.

## Uso del composable: Mismo composable, diferente formulario

```ts
const suscripcion = useForm(
  { email: '', plan: '' },
  {
    email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Email inválido.' : null),
    plan: (v) => (!v.trim() ? 'Selecciona un plan.' : null),
  },
)
```
- **Segunda instancia** del mismo composable. Totalmente independiente de `contacto`.
- `T` ahora es `{ email: string; plan: string }`.
- Cada instancia tiene su propio `values`, `errors`, `loading`, `submitResult`.

---

## Bloque `<template>` — Patrones clave

### Binding con el composable

```html
<input v-model="contacto.values.nombre" type="text" @blur="contacto.validateField('nombre')" />
<span v-if="contacto.errors.nombre">{{ contacto.errors.nombre }}</span>
```
- `v-model="contacto.values.nombre"` → accede al `values` del composable.
- `@blur="contacto.validateField('nombre')"` → valida ese campo al salir.

### Botón de submit con estado

```html
<button
  type="button"
  :disabled="contacto.loading.value || !contacto.isValid.value"
  @click="enviarContacto"
>
  <span v-if="contacto.loading.value">Enviando…</span>
  <span v-else>Enviar</span>
</button>
```
- `:disabled` cuando está enviando O cuando el formulario no es válido.
- Doble estado visual: texto cambia según `loading`.

---

## Ventajas del patrón `useForm<T>`

| Característica | Detalle |
|---------------|---------|
| Genérico | Funciona con cualquier estructura de formulario |
| Reutilizable | Un solo composable para todos los formularios del proyecto |
| Tipado | TypeScript garantiza que las claves de `rules` coinciden con las de `values` |
| Testeable | Función pura de TypeScript, fácil de unit testear |
| Separación de responsabilidades | El componente solo maneja la UI; el composable maneja la lógica |
