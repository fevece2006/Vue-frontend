<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'

// ─── Types ─────────────────────────────────────────────────────────────────
interface Telefono {
  id: number
  valor: string
  error: string
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

// ─── Estado del formulario ─────────────────────────────────────────────────
const form = reactive({
  nombre:    '',
  apellido:  '',
  email:     '',
  documento: '',
  plan:      '',
})

const errors = reactive<Record<string, string>>({})

let telefonoId = 0
const telefonos = reactive<Telefono[]>([{ id: ++telefonoId, valor: '', error: '' }])

const formStatus = ref<FormStatus>('idle')
const submittedData = ref<object | null>(null)

// ─── Validaciones ──────────────────────────────────────────────────────────
const rules: Record<string, (v: string) => string | null> = {
  nombre:    (v) => !v.trim() ? 'Nombre es obligatorio.' : v.trim().length < 2 ? 'Mínimo 2 caracteres.' : null,
  apellido:  (v) => !v.trim() ? 'Apellido es obligatorio.' : null,
  email:     (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Correo inválido.' : null,
  documento: (v) => !/^\d{7,10}$/.test(v.trim()) ? 'Documento: entre 7 y 10 dígitos.' : null,
  plan:      (v) => !v ? 'Debes seleccionar un plan.' : null,
}

function validateField(field: string) {
  const msg = rules[field]?.(form[field as keyof typeof form])
  if (msg) errors[field] = msg
  else delete errors[field]
}

function validateAll(): boolean {
  Object.keys(rules).forEach(validateField)
  telefonos.forEach(validateTelefono)
  return Object.keys(errors).length === 0 && telefonos.every((t) => !t.error)
}

function validateTelefono(t: Telefono) {
  if (!t.valor.trim()) { t.error = 'Requerido.'; return }
  t.error = /^\+?[\d\s\-()]{7,15}$/.test(t.valor.trim()) ? '' : 'Formato inválido.'
}

// ─── watch: validación reactiva parcial (BONUS) ────────────────────────────
// Solo revalida un campo si ya fue tocado (tiene error)
watch(() => form.email, () => {
  if (errors.email) validateField('email')
})
watch(() => form.nombre, () => {
  if (errors.nombre) validateField('nombre')
})

// ─── computed: estado global del formulario (BONUS) ─────────────────────────
const isValid = computed(() => {
  const camposRellenos = Object.values(form).every((v) => v.trim() !== '')
  const sinErrores     = Object.keys(errors).length === 0
  const telefonosOk    = telefonos.every((t) => t.valor.trim() !== '' && !t.error)
  return camposRellenos && sinErrores && telefonosOk
})

// ─── Teléfonos dinámicos ───────────────────────────────────────────────────
function agregarTelefono() {
  telefonos.push({ id: ++telefonoId, valor: '', error: '' })
}
function eliminarTelefono(id: number) {
  if (telefonos.length === 1) return
  telefonos.splice(telefonos.findIndex((t) => t.id === id), 1)
}

// ─── Submit async ──────────────────────────────────────────────────────────
async function handleSubmit() {
  if (!validateAll()) {
    formStatus.value = 'error'
    return
  }
  formStatus.value = 'loading'
  try {
    // Simulación de llamada API
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

function resetForm() {
  Object.assign(form, { nombre: '', apellido: '', email: '', documento: '', plan: '' })
  telefonos.splice(0, telefonos.length, { id: ++telefonoId, valor: '', error: '' })
  for (const k of Object.keys(errors)) delete errors[k]
  formStatus.value = 'idle'
  submittedData.value = null
}
</script>

<template>
  <Card class="page-card">
    <template #content>
      <header class="page-header">
        <h1 class="page-title">7 · Caso Práctico — Registro de Cliente 🧪</h1>
        <p class="page-subtitle">
          Todo en uno: datos personales, teléfonos dinámicos, validación con composables, submit async y UX profesional.
        </p>
      </header>

      <!-- ─── Éxito ───────────────────────────────────────────────── -->
      <div v-if="formStatus === 'success'" class="success-screen">
        <div class="success-icon">✔</div>
        <h2>¡Cliente registrado!</h2>
        <p>Los datos se enviaron correctamente al servidor (simulado).</p>
        <pre class="code">{{ JSON.stringify(submittedData, null, 2) }}</pre>
        <button type="button" class="btn btn--primary" @click="resetForm">Nuevo registro</button>
      </div>

      <!-- ─── Formulario ─────────────────────────────────────────── -->
      <div v-else class="form-layout">

        <!-- Estado global (BONUS: computed isValid) -->
        <div class="status-bar">
          <span class="status-label">Estado del formulario:</span>
          <span :class="isValid ? 'pill pill--ok' : 'pill pill--off'">
            {{ isValid ? '✔ Listo para enviar' : '⚠ Completa todos los campos' }}
          </span>
          <span v-if="formStatus === 'loading'" class="pill pill--loading">⏳ Enviando…</span>
        </div>

        <!-- ─── Datos personales ──────────────────────────────────── -->
        <section class="form-section">
          <h3 class="section-title">👤 Datos personales</h3>

          <div class="fields-grid">
            <div class="field" :class="{ 'field--error': errors.nombre }">
              <label class="field__label">Nombre *</label>
              <input v-model="form.nombre" type="text" class="field__input" placeholder="Nombre" @blur="validateField('nombre')" />
              <span v-if="errors.nombre" class="field__error">{{ errors.nombre }}</span>
            </div>

            <div class="field" :class="{ 'field--error': errors.apellido }">
              <label class="field__label">Apellido *</label>
              <input v-model="form.apellido" type="text" class="field__input" placeholder="Apellido" @blur="validateField('apellido')" />
              <span v-if="errors.apellido" class="field__error">{{ errors.apellido }}</span>
            </div>

            <div class="field" :class="{ 'field--error': errors.email }">
              <label class="field__label">Correo electrónico *</label>
              <input v-model="form.email" type="email" class="field__input" placeholder="correo@dominio.com" @blur="validateField('email')" />
              <span v-if="errors.email" class="field__error">{{ errors.email }}</span>
            </div>

            <div class="field" :class="{ 'field--error': errors.documento }">
              <label class="field__label">Documento (DNI / Cédula) *</label>
              <input v-model.trim="form.documento" type="text" class="field__input" placeholder="12345678" @blur="validateField('documento')" />
              <span v-if="errors.documento" class="field__error">{{ errors.documento }}</span>
            </div>

            <div class="field" :class="{ 'field--error': errors.plan }">
              <label class="field__label">Plan *</label>
              <select v-model="form.plan" class="field__input" @blur="validateField('plan')">
                <option value="">-- Selecciona un plan --</option>
                <option value="basic">Básico · $0/mes</option>
                <option value="pro">Pro · $9/mes</option>
                <option value="enterprise">Enterprise · $49/mes</option>
              </select>
              <span v-if="errors.plan" class="field__error">{{ errors.plan }}</span>
            </div>
          </div>
        </section>

        <!-- ─── Teléfonos dinámicos ──────────────────────────────── -->
        <section class="form-section">
          <h3 class="section-title">📞 Teléfonos <span class="badge">Dinámico</span></h3>

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

          <button type="button" class="btn btn--add" @click="agregarTelefono">
            + Agregar teléfono
          </button>
        </section>

        <!-- ─── BONUS: conceptos en vivo ────────────────────────── -->
        <section class="bonus-section">
          <h3 class="section-title">🔥 BONUS activo en este formulario</h3>
          <div class="bonus-grid">
            <div class="bonus-item">
              <span class="bonus-tag">watch</span>
              Revalida <code>email</code> y <code>nombre</code> en tiempo real si ya hubo error.
            </div>
            <div class="bonus-item">
              <span class="bonus-tag">computed</span>
              <code>isValid</code> calcula el estado global del formulario.
            </div>
            <div class="bonus-item">
              <span class="bonus-tag">submit async</span>
              Simula una llamada API con <code>await + setTimeout</code> y estado <code>loading</code>.
            </div>
            <div class="bonus-item">
              <span class="bonus-tag">v-model.trim</span>
              El campo Documento usa <code>.trim</code> para evitar espacios.
            </div>
          </div>
        </section>

        <!-- ─── Acciones ─────────────────────────────────────────── -->
        <div class="form-actions">
          <button
            type="button"
            class="btn btn--primary"
            :disabled="formStatus === 'loading'"
            @click="handleSubmit"
          >
            <span v-if="formStatus === 'loading'">⏳ Registrando cliente…</span>
            <span v-else>Registrar cliente</span>
          </button>
          <button type="button" class="btn" @click="resetForm">Limpiar</button>
        </div>

        <div v-if="formStatus === 'error'" class="alert alert--error">
          ✘ Hay errores en el formulario. Revisá los campos marcados.
        </div>

      </div>
    </template>
  </Card>
</template>

<style scoped>
.page-header { margin-bottom: 1.25rem; }
.page-title  { margin: 0; }
.page-subtitle { margin: .25rem 0 0; opacity: .75; }

/* ─── Layout ─────────────────────────────────────────────── */
.form-layout { display: grid; gap: 1.25rem; }

.status-bar {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .5rem .85rem;
  background: rgba(0,0,0,.02);
  border: 1px solid rgba(0,0,0,.08);
  border-radius: 8px;
  font-size: .9rem;
  flex-wrap: wrap;
}
.status-label { font-weight: 600; opacity: .7; }

.form-section {
  border: 1px solid rgba(0,0,0,.12);
  border-radius: 12px;
  padding: 1rem;
  background: #fff;
}
.section-title { margin: 0 0 .85rem; font-size: 1rem; display: flex; align-items: center; gap: .5rem; }
.badge {
  font-size: .72rem;
  font-weight: 700;
  padding: .15rem .45rem;
  border-radius: 999px;
  background: rgba(99,102,241,.15);
  color: #4f46e5;
  letter-spacing: .03em;
}

.fields-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: .85rem;
}

/* ─── Fields ─────────────────────────────────────────────── */
.field { display: flex; flex-direction: column; gap: .3rem; }
.field--error .field__input { border-color: #ef4444 !important; }
.field__label { font-size: .88rem; font-weight: 600; opacity: .8; }
.field__input {
  border: 1px solid rgba(0,0,0,.18);
  border-radius: 8px;
  padding: .45rem .65rem;
  font-size: .95rem;
  outline: none;
  transition: border-color .2s;
  width: 100%;
}
.field__input:focus { border-color: #6366f1; }
.field__error { color: #ef4444; font-size: .8rem; }

/* ─── Dyn rows ───────────────────────────────────────────── */
.dyn-row { display: flex; align-items: flex-start; gap: .5rem; margin-bottom: .5rem; }
.dyn-row--error .field__input { border-color: #ef4444; }

/* ─── Buttons ────────────────────────────────────────────── */
.btn {
  appearance: none;
  border: 1px solid rgba(0,0,0,.18);
  background: #fff;
  border-radius: 10px;
  padding: .5rem .85rem;
  cursor: pointer;
  font-size: .92rem;
  transition: background .2s, opacity .2s;
}
.btn:hover { background: rgba(0,0,0,.04); }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn--primary { background: #6366f1; color: #fff; border: none; padding: .6rem 1.5rem; font-size: 1rem; }
.btn--primary:hover { background: #4f46e5; }
.btn--add { border-color: rgba(99,102,241,.35); color: #6366f1; margin-top: .25rem; }
.btn--add:hover { background: rgba(99,102,241,.06); }

.btn-icon {
  appearance: none;
  background: transparent;
  border: 1px solid rgba(0,0,0,.15);
  border-radius: 8px;
  padding: .4rem .7rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: background .2s;
}
.btn-icon--remove { border-color: rgba(239,68,68,.35); color: #ef4444; }
.btn-icon--remove:hover { background: rgba(239,68,68,.08); }
.btn-icon:disabled { opacity: .3; cursor: not-allowed; }

.form-actions { display: flex; gap: .75rem; flex-wrap: wrap; }

/* ─── Alerts ─────────────────────────────────────────────── */
.alert { border-radius: 8px; padding: .65rem .9rem; font-size: .9rem; }
.alert--error { background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.2); color: #b91c1c; }

/* ─── Success screen ─────────────────────────────────────── */
.success-screen {
  display: grid;
  gap: 1rem;
  justify-items: center;
  text-align: center;
  padding: 2rem 1rem;
}
.success-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(0,128,0,.12);
  border: 2px solid rgba(0,128,0,.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: green;
}
.success-screen h2 { margin: 0; }
.success-screen p  { margin: 0; opacity: .75; }

/* ─── Bonus section ──────────────────────────────────────── */
.bonus-section {
  border: 1px solid rgba(245,158,11,.3);
  background: rgba(245,158,11,.04);
  border-radius: 12px;
  padding: 1rem;
}
.bonus-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: .75rem; }
.bonus-item {
  background: #fff;
  border: 1px solid rgba(0,0,0,.08);
  border-radius: 8px;
  padding: .6rem .85rem;
  font-size: .88rem;
  display: flex;
  flex-direction: column;
  gap: .25rem;
}
.bonus-tag {
  font-size: .75rem;
  font-weight: 700;
  padding: .1rem .45rem;
  border-radius: 999px;
  background: rgba(245,158,11,.2);
  color: #92400e;
  width: fit-content;
}

/* ─── Pill ───────────────────────────────────────────────── */
.pill {
  display: inline-flex;
  align-items: center;
  padding: .15rem .55rem;
  border-radius: 999px;
  font-size: .82rem;
  border: 1px solid transparent;
}
.pill--ok      { background: rgba(0,128,0,.1);    border-color: rgba(0,128,0,.2); }
.pill--off     { background: rgba(128,128,128,.12); border-color: rgba(128,128,128,.2); }
.pill--loading { background: rgba(99,102,241,.1); border-color: rgba(99,102,241,.25); }

/* ─── Code block ─────────────────────────────────────────── */
.code {
  background: #1e1e2e;
  color: #cdd6f4;
  border-radius: 8px;
  padding: .75rem 1rem;
  font-size: .8rem;
  line-height: 1.6;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  white-space: pre;
  text-align: left;
  width: 100%;
  max-width: 500px;
}
</style>
