# 6 · Validación con VeeValidate

**Archivo:** `VeeValidatePage.vue`  
**Tema:** Librería de validación VeeValidate + esquemas Yup para Vue 3.

---

## ¿Qué es VeeValidate?

**VeeValidate** es la librería de validación más popular del ecosistema Vue. Provee:
- Binding directo con el template de Vue.
- Integración con Yup (librería de esquemas de validación).
- Manejo automático del estado `dirty`, `touched`, `valid`, `invalid` por campo.
- Soporte nativo de accesibilidad (ARIA).

**Yup** es una librería de JavaScript para definir esquemas de validación de forma declarativa.

Para instalar:
```bash
npm install vee-validate yup
```

---

## Bloque `<script setup>`

### Imports

```ts
import { ref, reactive } from 'vue'
```
- En la **demo interactiva** de la página (que no usa la librería externa) solo se necesita `ref` y `reactive`.
- En una implementación real con VeeValidate, los imports serían:
  ```ts
  import { useForm, useField } from 'vee-validate'
  import * as yup from 'yup'
  ```

---

### Estado de la demo interactiva

```ts
const form = reactive({ nombre: '', email: '', password: '', plan: '' })
```
- `reactive({})` → objeto con los 4 campos del formulario demo.
- Son strings porque los inputs siempre trabajan con strings.

```ts
const errors = reactive<Record<string, string>>({})
```
- Objeto de errores por campo. Clave = nombre del campo, valor = mensaje de error.

```ts
const touched = reactive<Record<string, boolean>>({})
```
- **Nuevo concepto**: registro de qué campos el usuario ya "tocó" (interactuó con ellos).
- VeeValidate real maneja esto internamente; aquí se simula manualmente.
- Un campo "tocado" = el usuario hizo foco en él o intentó enviar el formulario.
- Patrón UX: solo mostrar errores de campos tocados (no mostrar errores de campos que el usuario aún no vio).

```ts
const loading = ref(false)
const sent = ref(false)
```
- `loading` → `true` mientras se procesa el envío.
- `sent` → `true` cuando el envío fue exitoso (para mostrar pantalla de éxito).

---

### Esquema de validación estilo Yup

```ts
const yupLikeSchema: Record<string, (v: string) => string | null> = {
  nombre:   (v) => !v.trim() ? 'Nombre es requerido' : v.trim().length < 2 ? 'Mínimo 2 caracteres' : null,
  email:    (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Email inválido' : null,
  password: (v) => !v ? 'Contraseña requerida' : v.length < 8 ? 'Mínimo 8 caracteres' : null,
  plan:     (v) => !v ? 'Debes elegir un plan' : null,
}
```
- `yupLikeSchema` → simula la forma en que Yup define reglas, pero implementado manualmente.
- Con Yup real, se definiría así:
  ```ts
  const schema = yup.object({
    nombre:   yup.string().required('Nombre es requerido').min(2, 'Mínimo 2 caracteres'),
    email:    yup.string().email('Email inválido').required(),
    password: yup.string().required('Contraseña requerida').min(8, 'Mínimo 8 caracteres'),
    plan:     yup.string().required('Debes elegir un plan'),
  })
  ```
- Cada regla es una función `(v: string) => string | null`.
- Ternarios encadenados: si la primera condición falla, devuelve el mensaje; si no, continúa con la siguiente condición.

---

### Función `touch`

```ts
function touch(field: string) {
  touched[field] = true
  const rule = yupLikeSchema[field]
  const msg = rule ? rule(form[field as keyof typeof form]) : null
  if (msg) errors[field] = msg
  else delete errors[field]
}
```
- `touched[field] = true` → marca el campo como "tocado".
- `const rule = yupLikeSchema[field]` → busca la regla de ese campo.
- `rule ? rule(form[field...]) : null` → si hay regla, la ejecuta; si no, asume válido.
- `form[field as keyof typeof form]` → acceso al valor del campo. El `as keyof typeof form` es el casteo TypeScript para satisfacer al compilador.
- Si hay mensaje de error → lo guarda en `errors[field]`.
- Si no hay error → `delete errors[field]` limpia el error previo.

---

### `handleSubmit` asíncrono

```ts
async function handleSubmit() {
  Object.keys(yupLikeSchema).forEach(touch)
  if (Object.keys(errors).length > 0) return
  loading.value = true
  await new Promise((r) => window.setTimeout(r, 1000))
  loading.value = false
  sent.value = true
}
```
- `Object.keys(yupLikeSchema).forEach(touch)` → al hacer submit, marca **todos** los campos como tocados y los valida todos.
  - Esto es importante: muestra errores en campos que el usuario nunca tocó.
- `if (Object.keys(errors).length > 0) return` → si hay errores después de la validación total, detiene el submit.
- `loading.value = true` → activa el spinner / deshabilita el botón.
- `await new Promise(...)` → simula 1 segundo de llamada a API.
- `loading.value = false` → desactiva el spinner.
- `sent.value = true` → éxito: la UI mostrará la pantalla de confirmación.

---

## Cómo sería con VeeValidate real

### Configuración

```ts
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

// Definir el esquema
const schema = yup.object({
  nombre: yup.string().required('Nombre es requerido').min(2, 'Mínimo 2 caracteres'),
  email:  yup.string().email('Email inválido').required('Email requerido'),
  password: yup.string().required().min(8, 'Mínimo 8 caracteres'),
  plan: yup.string().required('Elige un plan'),
})

// Crear el form
const { handleSubmit, errors, isSubmitting } = useForm({ validationSchema: schema })

// Crear campos individuales
const { value: nombre, errorMessage: nombreError } = useField<string>('nombre')
const { value: email,  errorMessage: emailError  } = useField<string>('email')
```
- `useForm({ validationSchema: schema })` → inicializa el formulario con el esquema Yup.
  - `errors` → objeto reactivo de errores, igual que en la versión manual.
  - `isSubmitting` → booleano reactivo que VeeValidate gestiona automáticamente.
- `useField<string>('nombre')` → crea un campo individual vinculado al formulario.
  - `value` → el valor del campo (para usar con `v-model`).
  - `errorMessage` → el mensaje de error de ese campo.

### Template con VeeValidate real

```html
<!-- Con VeeValidate real -->
<Form @submit="onSubmit" :validation-schema="schema">
  <Field name="nombre" v-slot="{ field, errors }">
    <input v-bind="field" type="text" />
    <span>{{ errors[0] }}</span>
  </Field>

  <ErrorMessage name="nombre" />
</Form>
```
- `<Form>` → componente de VeeValidate que reemplaza `<form>`.
- `<Field>` → componente que provee binding + validación automática con slot `v-slot`.
- `<ErrorMessage>` → muestra automáticamente el error del campo especificado.

---

## Bloque `<template>` — Patrones clave

### Tabla comparativa (parte del template)

```html
<table class="table">
  <thead>
    <tr>
      <th>Enfoque</th>
      <th>Ventajas</th>
      <th>Cuándo usarlo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Composable propio</strong></td>
      <td>Control total, sin dependencias, fácil de extender</td>
      <td>Proyectos pequeños / medianos, necesidades específicas</td>
    </tr>
```
- Tabla HTML estándar. Muestra al alumno cuándo usar composable propio vs VeeValidate.

### Demo interactiva con estado `touched`

```html
<input
  v-model="form.email"
  type="email"
  @blur="touch('email')"
/>
<span v-if="touched.email && errors.email" class="field__error">{{ errors.email }}</span>
```
- `@blur="touch('email')"` → al salir del campo, se marca como tocado y se valida.
- `v-if="touched.email && errors.email"` → **patrón UX profesional**: el error solo se muestra si el usuario ya interactuó con el campo (`touched.email`) Y hay un error. Evita mostrar errores antes de que el usuario llegue al campo.

---

## Comparativa: Composable propio vs VeeValidate

| Característica | Composable propio | VeeValidate + Yup |
|---------------|-------------------|-------------------|
| Dependencias | Ninguna | `vee-validate`, `yup` |
| Curva de aprendizaje | Baja | Media |
| Control | Total | Parcial (abstracción) |
| Accesibilidad | Manual | Automática |
| Formularios complejos | Puede crecer en complejidad | Manejado por la librería |
| Esquemas reutilizables | Manual | Yup schemas |
| Integración con UI libs | Manual | Via plugins |
| Tamaño del bundle | 0 bytes extra | ~30KB |

### Cuándo usar cada uno

**Composable propio:**
- Proyectos pequeños/medianos.
- Control total sobre el comportamiento.
- Sin querer añadir dependencias.
- Reglas de negocio muy específicas.

**VeeValidate + Yup:**
- Formularios muy complejos con muchos campos.
- Esquemas de validación compartidos entre frontend y backend.
- Equipos que ya conocen Yup.
- Necesidad de validación asíncrona (verificar email en servidor).
