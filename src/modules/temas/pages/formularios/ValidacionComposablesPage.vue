<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// ─── useValidation composable ──────────────────────────────────────────────
// Este composable centraliza la lógica de validación, separándola de la UI.
function useValidation() {
  const errors = reactive<Record<string, string>>({})

  function required(field: string, value: string, label: string): boolean {
    if (!value.trim()) {
      errors[field] = `${label} es obligatorio.`
      return false
    }
    delete errors[field]
    return true
  }

  function email(field: string, value: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(value)) {
      errors[field] = 'El correo no tiene un formato válido.'
      return false
    }
    delete errors[field]
    return true
  }

  function minLength(field: string, value: string, min: number, label: string): boolean {
    if (value.trim().length < min) {
      errors[field] = `${label} debe tener al menos ${min} caracteres.`
      return false
    }
    delete errors[field]
    return true
  }

  function clearError(field: string) {
    delete errors[field]
  }

  return { errors, required, email, minLength, clearError }
}

// ─── Instancia del composable ──────────────────────────────────────────────
const { errors, required, email, minLength } = useValidation()

// ─── Estado del formulario ─────────────────────────────────────────────────
const form = reactive({
  nombre: '',
  correo: '',
  contrasena: '',
})

const submitted = ref(false)
const submitSuccess = ref(false)

// ─── Validar campo individual (al salir del input) ─────────────────────────
function validateNombre() { required('nombre', form.nombre, 'Nombre') }
function validateCorreo() {
  if (required('correo', form.correo, 'Correo')) email('correo', form.correo)
}
function validateContrasena() { minLength('contrasena', form.contrasena, 6, 'Contraseña') }

// ─── Estado global del formulario ─────────────────────────────────────────
const isValid = computed(
  () => !errors.nombre && !errors.correo && !errors.contrasena
    && form.nombre.trim() && form.correo.trim() && form.contrasena.trim(),
)

// ─── Submit ────────────────────────────────────────────────────────────────
function handleSubmit() {
  validateNombre()
  validateCorreo()
  validateContrasena()
  submitted.value = true
  if (isValid.value) submitSuccess.value = true
}
</script>

<template>
  <Card class="page-card">
    <template #content>
      <header class="page-header">
        <h1 class="page-title">3 · Validación con Composables 🔥</h1>
        <p class="page-subtitle">
          Crear <code>useValidation()</code>, manejar errores reactivos y separar la lógica de la UI.
        </p>
      </header>

      <div class="examples">

        <!-- ─── Arquitectura del composable ──────────────────────────────── -->
        <section class="box box--highlight">
          <div class="box__head">
            <h2 class="box__title">💡 Arquitectura limpia: lógica fuera de la UI</h2>
          </div>
          <div class="box__body">
            <pre class="code">// composables/useValidation.ts
export function useValidation() {
  const errors = reactive&lt;Record&lt;string, string&gt;&gt;({})

  function required(field, value, label) {
    if (!value.trim()) {
      errors[field] = `${label} es obligatorio.`
      return false
    }
    delete errors[field]  // limpia el error si pasa la validación
    return true
  }

  function email(field, value) { /* ... */ }
  function minLength(field, value, min, label) { /* ... */ }

  return { errors, required, email, minLength }
}</pre>
            <p class="hint">
              El componente solo llama métodos del composable — no sabe cómo se valida, solo cuándo.
              Esto permite reutilizar las mismas reglas en cualquier formulario del proyecto.
            </p>
          </div>
        </section>

        <!-- ─── Formulario de demostración ───────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">Formulario con validación reactiva</h2>
            <p class="box__desc">Cada campo valida al perder el foco. El botón se activa solo cuando todo es válido.</p>
          </div>
          <div class="box__body">

            <!-- Nombre -->
            <div class="field" :class="{ 'field--error': errors.nombre }">
              <label class="field__label">Nombre *</label>
              <input
                v-model="form.nombre"
                type="text"
                class="field__input"
                placeholder="Tu nombre completo"
                @blur="validateNombre"
              />
              <span v-if="errors.nombre" class="field__error">{{ errors.nombre }}</span>
            </div>

            <!-- Correo -->
            <div class="field" :class="{ 'field--error': errors.correo }">
              <label class="field__label">Correo electrónico *</label>
              <input
                v-model="form.correo"
                type="email"
                class="field__input"
                placeholder="correo@ejemplo.com"
                @blur="validateCorreo"
              />
              <span v-if="errors.correo" class="field__error">{{ errors.correo }}</span>
            </div>

            <!-- Contraseña -->
            <div class="field" :class="{ 'field--error': errors.contrasena }">
              <label class="field__label">Contraseña * (mín. 6 caracteres)</label>
              <input
                v-model="form.contrasena"
                type="password"
                class="field__input"
                placeholder="••••••"
                @blur="validateContrasena"
              />
              <span v-if="errors.contrasena" class="field__error">{{ errors.contrasena }}</span>
            </div>

            <!-- Estado computed -->
            <p class="result">
              Estado del formulario:
              <span :class="isValid ? 'pill pill--ok' : 'pill pill--off'">
                {{ isValid ? '✔ Válido' : '✘ Incompleto' }}
              </span>
            </p>

            <button type="button" class="btn btn--primary" :disabled="false" @click="handleSubmit">
              Enviar formulario
            </button>

            <div v-if="submitted && submitSuccess" class="alert alert--success">
              ✔ Formulario enviado correctamente.
            </div>
            <div v-else-if="submitted && !isValid" class="alert alert--error">
              ✘ Por favor corrige los errores antes de continuar.
            </div>
          </div>
        </section>

        <!-- ─── Estado de los errores en tiempo real ──────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">🔍 Estado reactivo de errores (en tiempo real)</h2>
            <p class="box__desc">Esta caja muestra el objeto <code>errors</code> del composable en vivo.</p>
          </div>
          <div class="box__body">
            <pre class="code">{{ JSON.stringify(errors, null, 2) || '{}' }}</pre>
          </div>
        </section>

        <!-- ─── Beneficios clave ──────────────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">✅ Beneficios de este patrón</h2>
          </div>
          <div class="box__body">
            <ul class="benefit-list">
              <li>🔁 <strong>Reutilizable:</strong> el mismo <code>useValidation()</code> en cualquier formulario.</li>
              <li>🧹 <strong>Testeable:</strong> la lógica de validación existe independiente del DOM.</li>
              <li>📐 <strong>Escalable:</strong> agregar una nueva regla no toca el template.</li>
              <li>🎯 <strong>Responsabilidad única:</strong> el componente solo maneja presentación.</li>
            </ul>
          </div>
        </section>

      </div>
    </template>
  </Card>
</template>

<style scoped>
.page-header { margin-bottom: 1rem; }
.page-title  { margin: 0; }
.page-subtitle { margin: .25rem 0 0; opacity: .75; }

.examples { display: grid; gap: 1rem; margin-top: 1rem; }

.box {
  border: 1px solid rgba(0,0,0,.12);
  border-radius: 12px;
  padding: 1rem;
  background: #fff;
}
.box--highlight { border-color: rgba(99,102,241,.3); background: rgba(99,102,241,.04); }
.box__head { margin-bottom: .75rem; padding-bottom: .75rem; border-bottom: 1px dashed rgba(0,0,0,.12); }
.box__title { margin: 0; font-size: 1.05rem; }
.box__desc { margin: .25rem 0 0; opacity: .75; font-size: .95rem; }
.box__body  { display: grid; gap: .75rem; }

.field { display: flex; flex-direction: column; gap: .3rem; }
.field--error .field__input { border-color: #ef4444; }
.field__label { font-size: .9rem; font-weight: 600; opacity: .8; }
.field__input {
  border: 1px solid rgba(0,0,0,.18);
  border-radius: 8px;
  padding: .45rem .65rem;
  font-size: .95rem;
  outline: none;
  transition: border-color .2s;
  max-width: 400px;
}
.field__input:focus { border-color: #6366f1; }
.field__error { color: #ef4444; font-size: .82rem; }

.result { margin: 0; font-size: .9rem; }
.hint { margin: 0; opacity: .75; font-size: .88rem; }

.pill {
  display: inline-block;
  margin-left: .35rem;
  padding: .15rem .55rem;
  border-radius: 999px;
  font-size: .85rem;
  border: 1px solid transparent;
  vertical-align: middle;
}
.pill--ok  { background: rgba(0,128,0,.1); border-color: rgba(0,128,0,.2); }
.pill--off { background: rgba(128,128,128,.12); border-color: rgba(128,128,128,.2); }

.btn {
  appearance: none;
  border: none;
  border-radius: 10px;
  padding: .55rem 1.25rem;
  cursor: pointer;
  font-size: .95rem;
  width: fit-content;
  transition: opacity .2s;
}
.btn--primary { background: #6366f1; color: #fff; }
.btn--primary:hover { background: #4f46e5; }
.btn:disabled { opacity: .5; cursor: not-allowed; }

.alert {
  border-radius: 8px;
  padding: .6rem .85rem;
  font-size: .9rem;
}
.alert--success { background: rgba(0,128,0,.1); border: 1px solid rgba(0,128,0,.2); }
.alert--error   { background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.2); color: #b91c1c; }

.code {
  background: #1e1e2e;
  color: #cdd6f4;
  border-radius: 8px;
  padding: .75rem 1rem;
  font-size: .82rem;
  line-height: 1.6;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  white-space: pre;
  margin: 0;
}

.benefit-list { margin: 0; padding-left: 1.25rem; display: grid; gap: .4rem; }
.benefit-list li { font-size: .92rem; }
</style>
