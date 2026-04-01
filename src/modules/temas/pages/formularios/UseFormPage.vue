<script setup lang="ts">
import { reactive, computed, ref } from 'vue'

// ─── useForm composable ────────────────────────────────────────────────────
// Centraliza: estado, validación, submit y reset.
// En un proyecto real vive en src/composables/useForm.ts

type Rules<T> = Partial<Record<keyof T, (val: string) => string | null>>

function useForm<T extends Record<string, string>>(
  initialValues: T,
  rules: Rules<T>,
) {
  // ── Estado ────────────────────────────────────────────────
  const values = reactive<T>({ ...initialValues })
  const errors = reactive<Record<string, string>>({})
  const loading = ref(false)
  const submitResult = ref<'idle' | 'success' | 'error'>('idle')

  // ── Validar un campo ──────────────────────────────────────
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

  // ── Validar todo el formulario ────────────────────────────
  function validate(): boolean {
    let ok = true
    for (const field of Object.keys(rules) as (keyof T)[]) {
      if (!validateField(field)) ok = false
    }
    return ok
  }

  // ── Estado computed ───────────────────────────────────────
  const isValid = computed(
    () => Object.keys(errors).length === 0
      && Object.values(values).every((v) => (v as string).trim() !== ''),
  )

  // ── Reset ─────────────────────────────────────────────────
  function reset() {
    Object.assign(values, initialValues)
    for (const k of Object.keys(errors)) delete errors[k]
    submitResult.value = 'idle'
  }

  // ── Submit ────────────────────────────────────────────────
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

  return { values, errors, loading, submitResult, isValid, validateField, validate, reset, handleSubmit }
}

// ─── Ejemplo 1: Formulario de contacto ───────────────────────────────────
const contacto = useForm(
  { nombre: '', correo: '', mensaje: '' },
  {
    nombre: (v) => (!v.trim() ? 'Nombre requerido.' : null),
    correo: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Correo inválido.' : null),
    mensaje: (v) => (v.trim().length < 10 ? 'Mínimo 10 caracteres.' : null),
  },
)

async function enviarContacto() {
  await contacto.handleSubmit(async (vals) => {
    await new Promise((r) => window.setTimeout(r, 1200)) // simula API
    window.console.log('Contacto enviado:', vals)
  })
}

// ─── Ejemplo 2: Mismo composable, otro formulario ─────────────────────────
const suscripcion = useForm(
  { email: '', plan: '' },
  {
    email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Email inválido.' : null),
    plan: (v) => (!v.trim() ? 'Selecciona un plan.' : null),
  },
)

async function enviarSuscripcion() {
  await suscripcion.handleSubmit(async (vals) => {
    await new Promise((r) => window.setTimeout(r, 800))
    window.console.log('Suscripción:', vals)
  })
}
</script>

<template>
  <Card class="page-card">
    <template #content>
      <header class="page-header">
        <h1 class="page-title">5 · Composables para Formularios Reutilizables 🔥 Senior</h1>
        <p class="page-subtitle">
          Un único <code>useForm()</code> centraliza estado, validación, submit y reset.
          Se instancia una vez por formulario — máxima reutilización y escalabilidad.
        </p>
      </header>

      <div class="examples">

        <!-- ─── Anatomía de useForm ────────────────────────────────────────── -->
        <section class="box box--highlight">
          <div class="box__head">
            <h2 class="box__title">🧬 Anatomía de <code>useForm()</code></h2>
          </div>
          <div class="box__body">
            <pre class="code">function useForm&lt;T&gt;(initialValues: T, rules: Rules&lt;T&gt;) {

  const values  = reactive({ ...initialValues })  // estado
  const errors  = reactive({})                     // errores reactivos
  const loading = ref(false)                       // estado de carga
  const isValid = computed(...)                    // estado calculado

  function validateField(field) { /* aplica la regla */ }
  function validate()           { /* valida todo */     }
  function reset()               { /* limpia todo */     }

  async function handleSubmit(onValid) {
    if (!validate()) return
    loading.value = true
    try   { await onValid(values) }
    finally { loading.value = false }
  }

  return { values, errors, loading, isValid, validateField, reset, handleSubmit }
}</pre>
            <p class="hint">
              El formulario no sabe cómo se valida ni cómo se envía — solo llama <code>handleSubmit(callback)</code>.
              Responsabilidad única aplicada al máximo.
            </p>
          </div>
        </section>

        <!-- ─── Formulario de contacto ────────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">📬 Instancia 1: Formulario de Contacto</h2>
            <p class="box__desc">Usa <code>useForm()</code> con 3 campos y sus reglas.</p>
          </div>
          <div class="box__body">

            <div class="field" :class="{ 'field--error': contacto.errors.nombre }">
              <label class="field__label">Nombre</label>
              <input
                v-model="contacto.values.nombre"
                type="text"
                class="field__input"
                placeholder="Tu nombre"
                @blur="contacto.validateField('nombre')"
              />
              <span v-if="contacto.errors.nombre" class="field__error">{{ contacto.errors.nombre }}</span>
            </div>

            <div class="field" :class="{ 'field--error': contacto.errors.correo }">
              <label class="field__label">Correo</label>
              <input
                v-model="contacto.values.correo"
                type="email"
                class="field__input"
                placeholder="correo@ejemplo.com"
                @blur="contacto.validateField('correo')"
              />
              <span v-if="contacto.errors.correo" class="field__error">{{ contacto.errors.correo }}</span>
            </div>

            <div class="field" :class="{ 'field--error': contacto.errors.mensaje }">
              <label class="field__label">Mensaje</label>
              <textarea
                v-model="contacto.values.mensaje"
                class="field__input field__textarea"
                placeholder="Mínimo 10 caracteres…"
                rows="3"
                @blur="contacto.validateField('mensaje')"
              />
              <span v-if="contacto.errors.mensaje" class="field__error">{{ contacto.errors.mensaje }}</span>
            </div>

            <p class="result">Estado: <span :class="contacto.isValid.value ? 'pill pill--ok' : 'pill pill--off'">{{ contacto.isValid.value ? 'válido' : 'incompleto' }}</span></p>

            <div class="actions">
              <button type="button" class="btn btn--primary" :disabled="contacto.loading.value" @click="enviarContacto">
                {{ contacto.loading.value ? 'Enviando…' : 'Enviar contacto' }}
              </button>
              <button type="button" class="btn" @click="contacto.reset()">Reset</button>
            </div>

            <div v-if="contacto.submitResult.value === 'success'" class="alert alert--success">✔ Contacto enviado correctamente.</div>
          </div>
        </section>

        <!-- ─── Formulario de suscripción ─────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">📋 Instancia 2: Formulario de Suscripción</h2>
            <p class="box__desc">El mismo composable, distintas reglas y campos.</p>
          </div>
          <div class="box__body">

            <div class="field" :class="{ 'field--error': suscripcion.errors.email }">
              <label class="field__label">Email</label>
              <input
                v-model="suscripcion.values.email"
                type="email"
                class="field__input"
                placeholder="tu@email.com"
                @blur="suscripcion.validateField('email')"
              />
              <span v-if="suscripcion.errors.email" class="field__error">{{ suscripcion.errors.email }}</span>
            </div>

            <div class="field" :class="{ 'field--error': suscripcion.errors.plan }">
              <label class="field__label">Plan</label>
              <select v-model="suscripcion.values.plan" class="field__input" @blur="suscripcion.validateField('plan')">
                <option value="">-- Selecciona un plan --</option>
                <option value="free">Free</option>
                <option value="pro">Pro · $9/mes</option>
                <option value="enterprise">Enterprise · $49/mes</option>
              </select>
              <span v-if="suscripcion.errors.plan" class="field__error">{{ suscripcion.errors.plan }}</span>
            </div>

            <div class="actions">
              <button type="button" class="btn btn--primary" :disabled="suscripcion.loading.value" @click="enviarSuscripcion">
                {{ suscripcion.loading.value ? 'Procesando…' : 'Suscribirme' }}
              </button>
              <button type="button" class="btn" @click="suscripcion.reset()">Reset</button>
            </div>

            <div v-if="suscripcion.submitResult.value === 'success'" class="alert alert--success">✔ Suscripción registrada.</div>
          </div>
        </section>

        <!-- ─── Beneficios ────────────────────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">✅ Por qué esto es nivel Senior</h2>
          </div>
          <div class="box__body">
            <ul class="benefit-list">
              <li>🔁 <strong>Reutilización real:</strong> mismo código para N formularios distintos.</li>
              <li>🧪 <strong>Testeable:</strong> <code>useForm</code> es una función pura, sin DOM.</li>
              <li>📐 <strong>Escalable:</strong> agregar campos o reglas no rompe nada existente.</li>
              <li>🔒 <strong>Loading/success/error</strong> centralizados — no necesitas <code>ref</code>s sueltos.</li>
              <li>🔄 <strong>Reset automático</strong> en un sola llamada.</li>
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
.field__textarea { resize: vertical; max-width: 100%; width: 100%; max-width: 400px; }
.field__error { color: #ef4444; font-size: .82rem; }

.result { margin: 0; font-size: .9rem; }
.hint { margin: 0; opacity: .75; font-size: .88rem; }

.actions { display: flex; gap: .75rem; flex-wrap: wrap; }

.btn {
  appearance: none;
  border: 1px solid rgba(0,0,0,.18);
  background: #fff;
  border-radius: 10px;
  padding: .5rem .85rem;
  cursor: pointer;
  font-size: .9rem;
  transition: background .2s, opacity .2s;
}
.btn:hover { background: rgba(0,0,0,.04); }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn--primary { background: #6366f1; color: #fff; border: none; }
.btn--primary:hover { background: #4f46e5; }

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

.alert {
  border-radius: 8px;
  padding: .6rem .85rem;
  font-size: .9rem;
}
.alert--success { background: rgba(0,128,0,.1); border: 1px solid rgba(0,128,0,.2); }

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
