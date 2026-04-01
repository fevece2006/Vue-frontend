# 2 · v-model con Modificadores

**Archivo:** `ModificadoresPage.vue`  
**Tema:** Los tres modificadores de `v-model`: `.lazy`, `.number` y `.trim`.

---

## ¿Qué son los modificadores de `v-model`?

Los modificadores cambian el **comportamiento** de la sincronización del binding. Se escriben después del `v-model` con un punto:

```html
v-model.lazy     → actualiza solo al perder foco
v-model.number   → convierte el valor a número
v-model.trim     → elimina espacios al inicio y al final
v-model.lazy.number  → se pueden combinar
```

---

## Bloque `<script setup>`

### Modificador `.lazy`

```ts
import { ref } from 'vue'
```
- Solo se necesita `ref` en esta página porque todos los valores son primitivos (string/number).

```ts
const textoLazy = ref('')
```
- Variable reactiva para capturar el valor **cuando pierde el foco** (con `.lazy`).
- Empieza vacía con `''`.

---

### Modificador `.number`

```ts
const precio = ref<number>(0)
const cantidad = ref<number>(1)
const total = ref<number | null>(null)
```
- `ref<number>(0)` → tipo explícito `number`, valor inicial `0`.
- `ref<number>(1)` → cantidad inicia en 1 (tiene sentido para un multiplicador).
- `ref<number | null>(null)` → el total empieza como `null` porque aún no se calculó; `null` permite diferenciarlo de `0`.

```ts
function calcularTotal() {
  total.value = precio.value * cantidad.value
}
```
- `total.value =` → asigna el resultado al ref (siempre con `.value` en el `<script>`).
- `precio.value * cantidad.value` → multiplicación. Funciona correctamente porque `.number` garantiza que ambos son números y no strings.
- **Sin `.number`**, `precio.value` sería `"10"` (string) y `precio.value * cantidad.value` daría `NaN` o resultados incorrectos.

---

### Modificador `.trim`

```ts
const textoConEspacios = ref('')
const textoSinTrim = ref('')
```
- `textoConEspacios` → se usa en el input **sin** `.trim`, para comparar.
- `textoSinTrim` → nombre un poco confuso en la página original; sirve para mostrar el contraste.

---

### Combinación de modificadores

```ts
const montoFinanciero = ref<number>(0)
const descripcionFinanciera = ref('')
```
- `montoFinanciero` → será binding con `.lazy.number` (actualiza solo al perder foco Y convierte a número).
- `descripcionFinanciera` → será binding con `.lazy.trim` (actualiza al perder foco Y elimina espacios).

---

## Bloque `<template>`

### `.lazy` — Actualiza solo al perder el foco

```html
<input v-model="textoConEspacios" type="text" class="field__input" placeholder="Escribe…" />
```
- `v-model` sin modificador → actualiza `textoConEspacios` **en cada tecla** (evento `input`).
- Es la referencia de comparación "comportamiento normal".

```html
<input v-model.lazy="textoLazy" type="text" class="field__input" placeholder="Escribe y luego haz click fuera…" />
```
- `v-model.lazy` → Vue escucha el evento `change` en lugar de `input`.
- El evento `change` se dispara cuando el input **pierde el foco** (click fuera) o al presionar Enter.
- `textoLazy` no cambia mientras escribes; solo cambia cuando abandonas el campo.

```html
<p class="result">Sin .lazy: <span class="pill pill--info">{{ textoConEspacios || '—' }}</span></p>
<p class="result">Con .lazy: <span class="pill pill--ok">{{ textoLazy || '—' }}</span></p>
```
- Muestra ambos valores en tiempo real para evidenciar la diferencia.
- `|| '—'` → si el valor es vacío/falsy, muestra el guión como placeholder visual.

```html
<div class="tip-box">
  <strong>💡 Enfoque PRO:</strong> Usa <code>.lazy</code> para optimizar formularios con búsquedas
  o validaciones costosas — evita disparar lógica en cada tecla.
</div>
```
- Cuadro de tip: `.lazy` es útil para búsquedas en API o validaciones que hacen peticiones HTTP, porque no las lanzás en cada tecla.

---

### `.number` — Convierte a número automáticamente

```html
<input v-model.number="precio" type="number" class="field__input" min="0" step="0.01" placeholder="0.00" />
<input v-model.number="cantidad" type="number" class="field__input" min="1" placeholder="1" />
```
- `v-model.number` → Vue aplica `parseFloat()` al valor del input antes de asignarlo a la variable.
- `type="number"` → el input solo acepta números (restricción HTML).
- `min="0"` / `min="1"` → restricción HTML: no permite valores menores.
- `step="0.01"` → permite decimales con precisión de centavo.
- Aunque `type="number"` en el HTML, **JavaScript siempre recibe un string** del DOM. `.number` convierte ese string a `number` de JS.

```html
<button type="button" class="btn" @click="calcularTotal">Calcular total</button>
```
- `type="button"` → importante en formularios: evita el submit automático del form por pressing Enter.
- `@click="calcularTotal"` → llama la función al hacer click.

```html
<p v-if="total !== null" class="result">
  Total: <span class="pill pill--ok pill--lg">$ {{ total.toFixed(2) }}</span>
</p>
```
- `v-if="total !== null"` → solo muestra el resultado después del primer cálculo (cuando `total` deja de ser `null`).
- `total.toFixed(2)` → formatea el número con exactamente 2 decimales (ej: `10` → `"10.00"`).

```html
<p class="result">
  Tipo de dato: <span class="pill pill--info">{{ typeof precio }}</span>
</p>
```
- `typeof precio` → prueba en vivo que el tipo es `"number"` y no `"string"`.
- Didáctico: los alumnos pueden ver que sin `.number`, este resultado sería `"string"`.

---

### `.trim` — Elimina espacios al inicio y al final

```html
<input v-model="textoConEspacios" type="text" class="field__input" placeholder="Ingresar con espacios…" />
<input v-model.trim="textoSinTrim" type="text" class="field__input" placeholder="Mismo texto, con .trim…" />
```
- Primer input: guarda el texto **con** los espacios que escriba el usuario.
- Segundo input: guarda el texto **sin** espacios al inicio/final (Vue aplica `.trim()` automáticamente).

```html
<p class="result">Sin .trim: "<span class="pill pill--info">{{ textoConEspacios }}</span>"</p>
<p class="result">Con .trim: "<span class="pill pill--ok">{{ textoSinTrim }}</span>"</p>
```
- Las comillas literales en el HTML permiten ver si hay espacios extra.
- Sin `.trim`: `"  hola  "` (con espacios). Con `.trim`: `"hola"`.

---

### Combinación `.lazy.number` y `.lazy.trim`

```html
<input v-model.lazy.number="montoFinanciero" type="number" class="field__input" />
<input v-model.lazy.trim="descripcionFinanciera" type="text" class="field__input" />
```
- **`.lazy.number`** → el valor no cambia en cada tecla (`.lazy`) Y cuando cambia se convierte a número (`.number`). Ideal para inputs de montos financieros donde no querés recalcular en tiempo real.
- **`.lazy.trim`** → el valor se actualiza al perder foco (`.lazy`) Y sin espacios extra (`.trim`). Ideal para campos de texto donde querés validar recién cuando el usuario termina de escribir.

---

## Tabla resumen de modificadores

| Modificador | Cuándo actualiza | Transformación | Caso de uso típico |
|-------------|-----------------|---------------|-------------------|
| (ninguno)   | Cada tecla (`input`) | Ninguna | Campos normales |
| `.lazy`     | Al perder foco (`change`) | Ninguna | Búsquedas, validaciones costosas |
| `.number`   | Cada tecla | `parseFloat()` | Precios, cantidades, edades |
| `.trim`     | Cada tecla | `.trim()` en JS | Nombres, emails, usernames |
| `.lazy.number` | Al perder foco | `parseFloat()` | Montos financieros con cálculo diferido |
| `.lazy.trim` | Al perder foco | `.trim()` | Campos de texto con validación tardía |

---

## Diferencia clave entre `.lazy` y `@change`

```html
<!-- Con v-model.lazy -->
<input v-model.lazy="texto" />

<!-- Equivale a hacer esto manualmente -->
<input :value="texto" @change="texto = $event.target.value" />
```

`.lazy` simplifica escribir ese binding manual; son exactamente equivalentes.
