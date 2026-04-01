<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// ─── Teléfonos dinámicos ──────────────────────────────────────────────────
interface TelefonoItem {
  id: number
  valor: string
  error: string
}

let telefonoId = 0
const telefonos = reactive<TelefonoItem[]>([{ id: ++telefonoId, valor: '', error: '' }])

function agregarTelefono() {
  telefonos.push({ id: ++telefonoId, valor: '', error: '' })
}

function eliminarTelefono(id: number) {
  if (telefonos.length === 1) return
  const idx = telefonos.findIndex((t) => t.id === id)
  if (idx !== -1) telefonos.splice(idx, 1)
}

function validarTelefono(item: TelefonoItem) {
  const re = /^\+?[\d\s\-()]{7,15}$/
  item.error = item.valor.trim() === ''
    ? 'El teléfono no puede estar vacío.'
    : !re.test(item.valor.trim())
      ? 'Formato de teléfono inválido.'
      : ''
}

const telefonosValidos = computed(() =>
  telefonos.every((t) => t.valor.trim() !== '' && t.error === ''),
)

// ─── Correos múltiples ────────────────────────────────────────────────────
interface CorreoItem {
  id: number
  valor: string
  error: string
}

let correoId = 0
const correos = reactive<CorreoItem[]>([{ id: ++correoId, valor: '', error: '' }])

function agregarCorreo() {
  correos.push({ id: ++correoId, valor: '', error: '' })
}

function eliminarCorreo(id: number) {
  if (correos.length === 1) return
  const idx = correos.findIndex((c) => c.id === id)
  if (idx !== -1) correos.splice(idx, 1)
}

function validarCorreo(item: CorreoItem) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  item.error = item.valor.trim() === ''
    ? 'El correo no puede estar vacío.'
    : !re.test(item.valor.trim())
      ? 'Correo con formato inválido.'
      : ''
}

const correosValidos = computed(() =>
  correos.every((c) => c.valor.trim() !== '' && c.error === ''),
)

// ─── Summary ──────────────────────────────────────────────────────────────
const submitted = ref(false)
const formValido = computed(() => telefonosValidos.value && correosValidos.value)

function handleSubmit() {
  telefonos.forEach(validarTelefono)
  correos.forEach(validarCorreo)
  submitted.value = true
}
</script>

<template>
  <Card class="page-card">
    <template #content>
      <header class="page-header">
        <h1 class="page-title">4 · Formularios Dinámicos con Campos Array</h1>
        <p class="page-subtitle">
          Uso de <code>v-for</code> para renderizar campos dinámicamente, agregar/eliminar filas y validar arrays.
        </p>
      </header>

      <div class="examples">

        <!-- ─── Explicación del patrón ────────────────────────────────────── -->
        <section class="box box--highlight">
          <div class="box__head">
            <h2 class="box__title">💡 Patrón: array de objetos reactivos</h2>
          </div>
          <div class="box__body">
            <pre class="code">// Estado: array de objetos con id único + valor + error
const telefonos = reactive([
  { id: 1, valor: '', error: '' }
])

// Agregar fila
function agregarTelefono() {
  telefonos.push({ id: ++id, valor: '', error: '' })
}

// Eliminar fila
function eliminarTelefono(id: number) {
  const idx = telefonos.findIndex(t => t.id === id)
  telefonos.splice(idx, 1)
}

// Template: v-for sobre el array
// &lt;div v-for="tel in telefonos" :key="tel.id"&gt;
//   &lt;input v-model="tel.valor" @blur="validarTelefono(tel)" /&gt;
// &lt;/div&gt;</pre>
            <p class="hint">
              Clave: usa un <code>id</code> numérico único como <code>:key</code>, no el índice.
              Así Vue rastrea correctamente cada fila al agregar o eliminar.
            </p>
          </div>
        </section>

        <!-- ─── Teléfonos dinámicos ───────────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">📞 Teléfonos dinámicos</h2>
            <p class="box__desc">El usuario puede agregar o quitar teléfonos. Cada uno se valida individualmente.</p>
          </div>
          <div class="box__body">
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
                  @blur="validarTelefono(tel)"
                />
                <span v-if="tel.error" class="field__error">{{ tel.error }}</span>
              </div>
              <button
                type="button"
                class="btn btn--danger"
                :disabled="telefonos.length === 1"
                @click="eliminarTelefono(tel.id)"
              >
                ✕
              </button>
            </div>

            <button type="button" class="btn btn--add" @click="agregarTelefono">
              + Agregar teléfono
            </button>

            <p class="result">
              Teléfonos válidos:
              <span :class="telefonosValidos ? 'pill pill--ok' : 'pill pill--off'">
                {{ telefonosValidos ? '✔' : '✘' }}
              </span>
            </p>
          </div>
        </section>

        <!-- ─── Correos múltiples ─────────────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">✉ Correos múltiples</h2>
            <p class="box__desc">Mismo patrón aplicado a correos electrónicos.</p>
          </div>
          <div class="box__body">
            <div
              v-for="correo in correos"
              :key="correo.id"
              class="dyn-row"
              :class="{ 'dyn-row--error': correo.error }"
            >
              <div class="field" style="flex:1">
                <input
                  v-model="correo.valor"
                  type="email"
                  class="field__input"
                  :placeholder="`Correo ${correo.id}, ej: usuario@dominio.com`"
                  @blur="validarCorreo(correo)"
                />
                <span v-if="correo.error" class="field__error">{{ correo.error }}</span>
              </div>
              <button
                type="button"
                class="btn btn--danger"
                :disabled="correos.length === 1"
                @click="eliminarCorreo(correo.id)"
              >
                ✕
              </button>
            </div>

            <button type="button" class="btn btn--add" @click="agregarCorreo">
              + Agregar correo
            </button>

            <p class="result">
              Correos válidos:
              <span :class="correosValidos ? 'pill pill--ok' : 'pill pill--off'">
                {{ correosValidos ? '✔' : '✘' }}
              </span>
            </p>
          </div>
        </section>

        <!-- ─── Estado en tiempo real ────────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">🔍 Arrays reactivos en tiempo real</h2>
          </div>
          <div class="box__body">
            <div class="two-cols">
              <div>
                <p class="field__label">Teléfonos:</p>
                <pre class="code">{{ JSON.stringify(telefonos.map(t => ({ valor: t.valor, error: t.error })), null, 2) }}</pre>
              </div>
              <div>
                <p class="field__label">Correos:</p>
                <pre class="code">{{ JSON.stringify(correos.map(c => ({ valor: c.valor, error: c.error })), null, 2) }}</pre>
              </div>
            </div>
          </div>
        </section>

        <!-- ─── Enviar ─────────────────────────────────────────────────────── -->
        <section class="box">
          <div class="box__body">
            <button type="button" class="btn btn--primary" @click="handleSubmit">
              Validar y enviar
            </button>
            <div v-if="submitted && formValido" class="alert alert--success">
              ✔ Todos los campos son válidos.
            </div>
            <div v-else-if="submitted && !formValido" class="alert alert--error">
              ✘ Hay campos con errores. Revisá cada fila.
            </div>
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

.dyn-row {
  display: flex;
  align-items: flex-start;
  gap: .5rem;
  padding: .35rem;
  border-radius: 8px;
  transition: background .2s;
}
.dyn-row--error { background: rgba(239,68,68,.04); }

.field { display: flex; flex-direction: column; gap: .3rem; }
.field__label { font-size: .9rem; font-weight: 600; opacity: .8; }
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
.field__error { color: #ef4444; font-size: .82rem; }

.result { margin: 0; font-size: .9rem; }
.hint { margin: 0; opacity: .75; font-size: .88rem; }

.btn {
  appearance: none;
  border: 1px solid rgba(0,0,0,.18);
  background: #fff;
  border-radius: 8px;
  padding: .4rem .75rem;
  cursor: pointer;
  font-size: .9rem;
  transition: background .2s, opacity .2s;
}
.btn:hover { background: rgba(0,0,0,.04); }
.btn:disabled { opacity: .35; cursor: not-allowed; }
.btn--danger { border-color: rgba(239,68,68,.35); color: #ef4444; flex-shrink: 0; }
.btn--danger:hover { background: rgba(239,68,68,.08); }
.btn--add { border-color: rgba(99,102,241,.35); color: #6366f1; width: fit-content; }
.btn--add:hover { background: rgba(99,102,241,.06); }
.btn--primary { background: #6366f1; color: #fff; border: none; padding: .55rem 1.25rem; border-radius: 10px; width: fit-content; }
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
.alert--error   { background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.2); color: #b91c1c; }

.two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

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
  margin: 0;
}
</style>
