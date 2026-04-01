<script setup lang="ts">
import { ref, reactive } from 'vue'

// ─── Input text ───────────────────────────────────────────────────────────────
const nombre = ref('')
const lastInput = ref('')
const lastChange = ref('')

function onInput(e: Event) {
  lastInput.value = (e.target as unknown as { value: string }).value
}
function onChange(e: Event) {
  lastChange.value = (e.target as unknown as { value: string }).value
}

// ─── Select ───────────────────────────────────────────────────────────────────
const pais = ref('')
const paises = ['Argentina', 'México', 'Colombia', 'España', 'Chile']

// ─── Checkbox ─────────────────────────────────────────────────────────────────
const aceptaTerminos = ref(false)
const habilidades = reactive<string[]>([])
const habilidadesOpciones = ['Vue 3', 'TypeScript', 'Node.js', 'Docker']

// ─── Radio ────────────────────────────────────────────────────────────────────
const nivel = ref('')
const niveles = [
  { label: 'Junior', value: 'junior' },
  { label: 'Semi-Senior', value: 'semi-senior' },
  { label: 'Senior', value: 'senior' },
]

// ─── cómo funciona v-model internamente ──────────────────────────────────────
// v-model en un <input type="text"> es equivalente a:
//   :value="nombre" + @update:modelValue="nombre = $event"
// En componentes propios se recibe via prop `modelValue`
//   y se emite con emit('update:modelValue', newVal)
</script>

<template>
  <Card class="page-card">
    <template #content>
      <header class="page-header">
        <h1 class="page-title">1 · Formularios Básicos con v-model</h1>
        <p class="page-subtitle">
          Inputs reactivos con <code>ref</code> y <code>reactive</code>, binding bidireccional y manejo de eventos.
        </p>
      </header>

      <div class="examples">

        <!-- ─── Input text ─────────────────────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">Input text</h2>
            <p class="box__desc">
              <code>v-model</code> sincroniza el valor del input con el <code>ref</code> en tiempo real.
            </p>
          </div>
          <div class="box__body">
            <div class="field">
              <label class="field__label">Nombre</label>
              <input v-model="nombre" type="text" class="field__input" placeholder="Escribe tu nombre…" />
            </div>
            <p class="result">Valor reactivo: <span class="pill pill--ok">{{ nombre || '—' }}</span></p>

            <!-- Eventos @input / @change -->
            <div class="field mt">
              <label class="field__label">Input con @input y @change</label>
              <input
                type="text"
                class="field__input"
                placeholder="Escribe algo…"
                @input="onInput"
                @change="onChange"
              />
            </div>
            <p class="result"><code>@input</code> (cada tecla): <span class="pill pill--info">{{ lastInput || '—' }}</span></p>
            <p class="result"><code>@change</code> (al perder foco): <span class="pill pill--info">{{ lastChange || '—' }}</span></p>
          </div>
        </section>

        <!-- ─── Select ────────────────────────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">Select</h2>
            <p class="box__desc">
              <code>v-model</code> en <code>&lt;select&gt;</code> captura la opción elegida.
            </p>
          </div>
          <div class="box__body">
            <div class="field">
              <label class="field__label">País</label>
              <select v-model="pais" class="field__input">
                <option value="">-- Selecciona --</option>
                <option v-for="p in paises" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            <p class="result">País seleccionado: <span class="pill pill--ok">{{ pais || '—' }}</span></p>
          </div>
        </section>

        <!-- ─── Checkbox ──────────────────────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">Checkbox</h2>
            <p class="box__desc">
              Un solo checkbox se une a un <code>boolean</code>. Múltiples checkboxes se unen a un array.
            </p>
          </div>
          <div class="box__body">
            <!-- single -->
            <div class="field field--inline">
              <input id="terminos" v-model="aceptaTerminos" type="checkbox" />
              <label for="terminos">Acepto los términos y condiciones</label>
            </div>
            <p class="result">Valor: <span :class="aceptaTerminos ? 'pill pill--ok' : 'pill pill--off'">{{ aceptaTerminos }}</span></p>

            <!-- múltiple -->
            <p class="field__label mt">Habilidades (array)</p>
            <div v-for="hab in habilidadesOpciones" :key="hab" class="field field--inline">
              <input :id="hab" v-model="habilidades" type="checkbox" :value="hab" />
              <label :for="hab">{{ hab }}</label>
            </div>
            <p class="result">Seleccionadas: <span class="pill pill--info">{{ habilidades.length ? habilidades.join(', ') : '—' }}</span></p>
          </div>
        </section>

        <!-- ─── Radio ─────────────────────────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">Radio</h2>
            <p class="box__desc">
              Todos los radios comparten el mismo <code>v-model</code>; Vue asigna el <code>:value</code> del elegido.
            </p>
          </div>
          <div class="box__body">
            <div v-for="n in niveles" :key="n.value" class="field field--inline">
              <input :id="n.value" v-model="nivel" type="radio" :value="n.value" />
              <label :for="n.value">{{ n.label }}</label>
            </div>
            <p class="result">Nivel elegido: <span class="pill pill--ok">{{ nivel || '—' }}</span></p>
          </div>
        </section>



      </div>
    </template>
  </Card>
</template>

<style scoped>
.page-header { margin-bottom: 1rem; }
.page-title  { margin: 0; }
.page-subtitle { margin: 0.25rem 0 0; opacity: 0.75; }

.examples { display: grid; gap: 1rem; margin-top: 1rem; }

.box {
  border: 1px solid rgba(0,0,0,.12);
  border-radius: 12px;
  padding: 1rem;
  background: #fff;
}
.box--highlight {
  border-color: rgba(99,102,241,.3);
  background: rgba(99,102,241,.04);
}
.box__head { margin-bottom: .75rem; padding-bottom: .75rem; border-bottom: 1px dashed rgba(0,0,0,.12); }
.box__title { margin: 0; font-size: 1.05rem; }
.box__desc { margin: .25rem 0 0; opacity: .75; font-size: .95rem; }
.box__body  { display: grid; gap: .75rem; }

.field { display: flex; flex-direction: column; gap: .35rem; }
.field--inline { flex-direction: row; align-items: center; gap: .5rem; }
.field__label { font-size: .9rem; font-weight: 600; opacity: .8; }
.field__input {
  border: 1px solid rgba(0,0,0,.18);
  border-radius: 8px;
  padding: .45rem .65rem;
  font-size: .95rem;
  outline: none;
  transition: border-color .2s;
  max-width: 320px;
}
.field__input:focus { border-color: #6366f1; }

.result { margin: 0; font-size: .9rem; }
.mt { margin-top: .5rem; }

.pill {
  display: inline-block;
  margin-left: .35rem;
  padding: .15rem .55rem;
  border-radius: 999px;
  font-size: .85rem;
  border: 1px solid transparent;
  vertical-align: middle;
}
.pill--ok   { background: rgba(0,128,0,.1);   border-color: rgba(0,128,0,.2); }
.pill--off  { background: rgba(128,128,128,.12); border-color: rgba(128,128,128,.2); }
.pill--info { background: rgba(99,102,241,.1); border-color: rgba(99,102,241,.25); }

.hint { margin: 0; opacity: .75; font-size: .9rem; }

.code {
  background: #1e1e2e;
  color: #cdd6f4;
  border-radius: 8px;
  padding: .75rem 1rem;
  font-size: .85rem;
  line-height: 1.6;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  white-space: pre;
}
</style>
