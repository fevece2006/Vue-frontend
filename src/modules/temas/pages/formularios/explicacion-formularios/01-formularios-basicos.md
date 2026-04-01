# 1 · Formularios Básicos con v-model — Explicación Profesional

**Archivo:** `FormulariosBasicosPage.vue`  
**Tema:** Binding bidireccional con `v-model`, eventos de inputs, select, checkbox y radio.

---

## ¿Qué es `v-model`?

`v-model` es una directiva de Vue 3 que crea un **binding bidireccional** entre un elemento HTML y una variable reactiva. Significa que:
- Cuando el usuario escribe en el input → la variable se actualiza automáticamente.
- Cuando la variable cambia por código → el input muestra el nuevo valor.

Internamente, `v-model` en un `<input type="text">` equivale a:
```html
:value="nombre"  @input="nombre = $event.target.value"
```

---

## Bloque `<script setup>`

```ts
import { ref, reactive } from 'vue'
```
- `import { ref, reactive } from 'vue'` → Importa las dos primitivas de reactividad de Vue 3.
  - `ref` → para valores simples (string, number, boolean).
  - `reactive` → para objetos y arrays.

---

### Sección: Input text

```ts
const nombre = ref('')
```
- `ref('')` → Crea una variable reactiva que empieza como string vacío.
- `''` → valor inicial vacío.
- `nombre.value` es como se accede por código; en el template se usa directamente como `nombre`.

```ts
const lastInput = ref('')
const lastChange = ref('')
```
- Dos variables para demostrar la diferencia entre `@input` y `@change`.

```ts
function onInput(e: Event) {
  lastInput.value = (e.target as unknown as { value: string }).value
}
```
- `e: Event` → el evento nativo del DOM.
- `e.target` → el elemento HTML que disparó el evento (el `<input>`).
- `as unknown as { value: string }` → casteo de TypeScript: le decimos "confía en mí, este target tiene propiedad `value`".
- `.value` al final → el texto que tiene el input en ese momento.
- Se dispara en **cada pulsación** de teclado.

```ts
function onChange(e: Event) {
  lastChange.value = (e.target as unknown as { value: string }).value
}
```
- Igual que `onInput`, pero este handler se asigna al evento `@change`.
- `@change` solo dispara cuando el input **pierde el foco** (blur) o se presiona Enter.

---

### Sección: Select

```ts
const pais = ref('')
const paises = ['Argentina', 'México', 'Colombia', 'España', 'Chile']
```
- `pais` → variable reactiva que guarda la opción seleccionada (inicialmente vacía).
- `paises` → array simple (no reactivo, porque no cambia) con las opciones del select.

---

### Sección: Checkbox

```ts
const aceptaTerminos = ref(false)
```
- `false` como valor inicial → checkbox desmarcado.
- Con `v-model` en un `<input type="checkbox">`, Vue asigna `true` o `false` automáticamente.

```ts
const habilidades = reactive<string[]>([])
```
- `reactive<string[]>([])` → array reactivo vacío de strings.
- Cuando **múltiples checkboxes** comparten el mismo `v-model`, Vue agrega/quita el `value` del checkbox en este array.

```ts
const habilidadesOpciones = ['Vue 3', 'TypeScript', 'Node.js', 'Docker']
```
- Array estático de opciones (no necesita ser reactivo porque no cambia).

---

### Sección: Radio

```ts
const nivel = ref('')
```
- String vacío inicial → ningún radio seleccionado.
- Con `v-model` en radios del mismo grupo, el valor del radio marcado se asigna aquí.

```ts
const niveles = [
  { label: 'Junior', value: 'junior' },
  { label: 'Semi-Senior', value: 'semi-senior' },
  { label: 'Senior', value: 'senior' },
]
```
- Array de objetos con dos propiedades cada uno:
  - `label` → texto visible en pantalla.
  - `value` → valor que se guarda en `nivel` cuando se elige.

---

## Bloque `<template>`

### Input text con v-model básico

```html
<input v-model="nombre" type="text" class="field__input" placeholder="Escribe tu nombre…" />
```
- `v-model="nombre"` → sincroniza el input con la variable `nombre` en ambas direcciones.
- `type="text"` → tipo HTML estándar.
- `placeholder` → texto de guía gris cuando está vacío.

```html
<p class="result">Valor reactivo: <span class="pill pill--ok">{{ nombre || '—' }}</span></p>
```
- `{{ nombre || '—' }}` → interpolación: si `nombre` tiene valor lo muestra; si es vacío, muestra `—`.

### Input con eventos manuales

```html
<input
  type="text"
  class="field__input"
  @input="onInput"
  @change="onChange"
/>
```
- **Sin** `v-model` aquí. En su lugar se escuchan manualmente los eventos.
- `@input` → dispara `onInput` en **cada tecla**.
- `@change` → dispara `onChange` solo al **perder el foco**.

### Select con v-model

```html
<select v-model="pais" class="field__input">
  <option value="">-- Selecciona --</option>
  <option v-for="p in paises" :key="p" :value="p">{{ p }}</option>
</select>
```
- `v-model="pais"` → guarda en `pais` el `value` de la opción elegida.
- `<option value="">` → opción vacía inicial (placeholder).
- `v-for="p in paises"` → itera el array `paises`, creando un `<option>` por cada elemento.
- `:key="p"` → clave única para el algoritmo del Virtual DOM de Vue.
- `:value="p"` → el valor que se asignará a `pais` al elegir esta opción.
- `{{ p }}` → el texto visible en el select.

### Checkbox boolean

```html
<input id="terminos" v-model="aceptaTerminos" type="checkbox" />
<label for="terminos">Acepto los términos y condiciones</label>
```
- `v-model="aceptaTerminos"` → alterna entre `true` y `false`.
- `id="terminos"` + `for="terminos"` → vincula el label con el input (click en label = click en checkbox).

### Checkboxes múltiples (array)

```html
<input v-model="habilidades" type="checkbox" :value="h" />
```
- Múltiples checkboxes con el **mismo** `v-model="habilidades"` apuntando al array.
- `:value="h"` → cada checkbox aporta su propio valor al array.
- Si marcas "Vue 3", el array queda `['Vue 3']`. Si también marcas "TypeScript", queda `['Vue 3', 'TypeScript']`.

### Radio buttons

```html
<input v-model="nivel" type="radio" :value="n.value" :id="'nivel-' + n.value" />
<label :for="'nivel-' + n.value">{{ n.label }}</label>
```
- `v-model="nivel"` → todos los radios del grupo comparten este binding.
- `:value="n.value"` → el valor que se asignará a `nivel` al seleccionar este radio.
- `:id` y `:for` dinámicos → aseguran que cada label apunte a su radio correcto.

---

## Resumen de conceptos

| Elemento     | `v-model` recibe | Tipo del dato    |
|-------------|-----------------|-----------------|
| `<input text>` | string          | `ref<string>`  |
| `<select>`    | value de option  | `ref<string>`  |
| `<checkbox>` (único) | true/false | `ref<boolean>` |
| `<checkbox>` (múltiple) | array de valores | `reactive<string[]>` |
| `<radio>`    | value del radio seleccionado | `ref<string>` |
