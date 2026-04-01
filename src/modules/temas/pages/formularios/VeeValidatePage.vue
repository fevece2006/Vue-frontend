<script setup lang="ts">
/**
 * ─── VeeValidate + Yup ──────────────────────────────────────────────────────
 *
 * Esta página es una GUÍA DE INTEGRACIÓN con código de referencia.
 * Para ejecutar el formulario real necesitas instalar las dependencias:
 *
 *   npm install vee-validate yup
 *
 * El formulario "en vivo" al final de la página funciona de todas formas
 * usando una implementación manual equivalente (por si aún no está instalado).
 */

import { ref, reactive } from 'vue'

// ─── Demo interactivo (sin dependencia externa) ─────────────────────────────
// Simula la misma UX que VeeValidate + Yup de forma manual,
// para que los alumnos vean el resultado antes de instalar la librería.
const form = reactive({ nombre: '', email: '', password: '', plan: '' })
const errors = reactive<Record<string, string>>({})
const touched = reactive<Record<string, boolean>>({})
const loading = ref(false)
const sent = ref(false)

const yupLikeSchema: Record<string, (v: string) => string | null> = {
  nombre:   (v) => !v.trim() ? 'Nombre es requerido' : v.trim().length < 2 ? 'Mínimo 2 caracteres' : null,
  email:    (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Email inválido' : null,
  password: (v) => !v ? 'Contraseña requerida' : v.length < 8 ? 'Mínimo 8 caracteres' : null,
  plan:     (v) => !v ? 'Debes elegir un plan' : null,
}

function touch(field: string) {
  touched[field] = true
  const rule = yupLikeSchema[field]
  const msg = rule ? rule(form[field as keyof typeof form]) : null
  if (msg) errors[field] = msg
  else delete errors[field]
}

async function handleSubmit() {
  Object.keys(yupLikeSchema).forEach(touch)
  if (Object.keys(errors).length > 0) return
  loading.value = true
  await new Promise((r) => window.setTimeout(r, 1000))
  loading.value = false
  sent.value = true
}
</script>

<template>
  <Card class="page-card">
    <template #content>
      <header class="page-header">
        <h1 class="page-title">6 · Validación con VeeValidate</h1>
        <p class="page-subtitle">
          Integración de VeeValidate + Yup con la Composition API de Vue 3.
        </p>
      </header>

      <div class="examples">

        <!-- ─── Por qué una librería externa ─────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">📊 Comparativa: Composable propio vs VeeValidate</h2>
          </div>
          <div class="box__body">
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
                <tr>
                  <td><strong>VeeValidate + Yup</strong></td>
                  <td>Schemas declarativos, menos código, i18n, ecosistema</td>
                  <td>Proyectos grandes, formularios complejos, equipos</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ─── Instalación ───────────────────────────────────────────────── -->
        <section class="box box--install">
          <div class="box__head">
            <h2 class="box__title">📦 Instalación</h2>
          </div>
          <div class="box__body">
            <pre class="code">npm install vee-validate yup
# o con pnpm
pnpm add vee-validate yup</pre>
          </div>
        </section>

        <!-- ─── Schema con Yup ────────────────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">1️⃣ Definir el schema con Yup</h2>
            <p class="box__desc">Yup es una librería de validación basada en schemas. Separas las reglas del componente.</p>
          </div>
          <div class="box__body">
            <pre class="code">// schemas/registro.schema.ts
import * as yup from 'yup'

export const registroSchema = yup.object({
  nombre:   yup.string().required('Nombre requerido').min(2, 'Mínimo 2 caracteres'),
  email:    yup.string().required('Email requerido').email('Email inválido'),
  password: yup.string().required('Contraseña requerida').min(8, 'Mínimo 8 caracteres'),
  plan:     yup.string().required('Debes elegir un plan'),
})</pre>
          </div>
        </section>

        <!-- ─── useForm y useField ────────────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">2️⃣ Integrar con <code>useForm</code> y <code>useField</code></h2>
          </div>
          <div class="box__body">
            <pre class="code">// RegistroPage.vue
import { useForm, useField } from 'vee-validate'
import { toTypedSchema }     from '@vee-validate/yup'
import { registroSchema }    from '@/schemas/registro.schema'

// 1. Conectar el schema
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(registroSchema),
})

// 2. Vincular cada campo
const { value: nombre,   errorMessage: nombreError   } = useField('nombre')
const { value: email,    errorMessage: emailError    } = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')
const { value: plan,     errorMessage: planError     } = useField('plan')

// 3. Submit — VeeValidate valida automáticamente antes de llamar el callback
const onSubmit = handleSubmit(async (values) => {
  await registrarUsuario(values) // tu lógica de API
})</pre>
          </div>
        </section>

        <!-- ─── Template ──────────────────────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">3️⃣ Template con enlace a los campos</h2>
          </div>
          <div class="box__body">
            <pre v-pre class="code">&lt;template&gt;
  &lt;form @submit.prevent="onSubmit"&gt;

    &lt;div :class="{ 'field--error': nombreError }"&gt;
      &lt;input v-model="nombre" type="text" placeholder="Nombre" /&gt;
      &lt;span v-if="nombreError"&gt;{{ nombreError }}&lt;/span&gt;
    &lt;/div&gt;

    &lt;div :class="{ 'field--error': emailError }"&gt;
      &lt;input v-model="email" type="email" placeholder="Email" /&gt;
      &lt;span v-if="emailError"&gt;{{ emailError }}&lt;/span&gt;
    &lt;/div&gt;

    &lt;button type="submit" :disabled="isSubmitting"&gt;
      {{ isSubmitting ? 'Enviando…' : 'Registrarme' }}
    &lt;/button&gt;

  &lt;/form&gt;
&lt;/template&gt;</pre>
          </div>
        </section>

        <!-- ─── Demo interactivo ──────────────────────────────────────────── -->
        <section class="box box--demo">
          <div class="box__head">
            <h2 class="box__title">🎮 Demo interactivo (equivalente sin instalar)</h2>
            <p class="box__desc">
              Misma UX que VeeValidate — valida al salir del campo y al enviar.
            </p>
          </div>
          <div class="box__body">

            <div v-if="sent" class="alert alert--success">
              ✔ Registro simulado con éxito. Los datos pasaron la validación estilo Yup.
            </div>

            <template v-else>
              <div class="field" :class="{ 'field--error': touched.nombre && errors.nombre }">
                <label class="field__label">Nombre</label>
                <input v-model="form.nombre" type="text" class="field__input" placeholder="Tu nombre" @blur="touch('nombre')" />
                <span v-if="touched.nombre && errors.nombre" class="field__error">{{ errors.nombre }}</span>
              </div>

              <div class="field" :class="{ 'field--error': touched.email && errors.email }">
                <label class="field__label">Email</label>
                <input v-model="form.email" type="email" class="field__input" placeholder="correo@dominio.com" @blur="touch('email')" />
                <span v-if="touched.email && errors.email" class="field__error">{{ errors.email }}</span>
              </div>

              <div class="field" :class="{ 'field--error': touched.password && errors.password }">
                <label class="field__label">Contraseña</label>
                <input v-model="form.password" type="password" class="field__input" placeholder="Mínimo 8 caracteres" @blur="touch('password')" />
                <span v-if="touched.password && errors.password" class="field__error">{{ errors.password }}</span>
              </div>

              <div class="field" :class="{ 'field--error': touched.plan && errors.plan }">
                <label class="field__label">Plan</label>
                <select v-model="form.plan" class="field__input" @blur="touch('plan')">
                  <option value="">-- Elige tu plan --</option>
                  <option value="free">Free</option>
                  <option value="pro">Pro · $9/mes</option>
                  <option value="enterprise">Enterprise · $49/mes</option>
                </select>
                <span v-if="touched.plan && errors.plan" class="field__error">{{ errors.plan }}</span>
              </div>

              <button type="button" class="btn btn--primary" :disabled="loading" @click="handleSubmit">
                {{ loading ? 'Registrando…' : 'Registrarme' }}
              </button>
            </template>
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
.box--install { border-color: rgba(20,184,166,.3); background: rgba(20,184,166,.04); }
.box--demo    { border-color: rgba(245,158,11,.3); background: rgba(245,158,11,.04); }
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

.table { width: 100%; border-collapse: collapse; font-size: .88rem; }
.table th, .table td { padding: .5rem .75rem; text-align: left; border-bottom: 1px solid rgba(0,0,0,.08); }
.table th { font-weight: 700; background: rgba(0,0,0,.03); }
.table tr:last-child td { border-bottom: none; }

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
</style>
