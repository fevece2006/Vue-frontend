<script setup lang="ts">
import { ref } from 'vue'

// ─── .lazy ────────────────────────────────────────────────────────────────────
// Solo actualiza al perder el foco (evento "change"), no en cada tecla
const textoLazy = ref('')

// ─── .number ──────────────────────────────────────────────────────────────────
// Convierte el string del input a número automáticamente
const precio = ref<number>(0)
const cantidad = ref<number>(1)
const total = ref<number | null>(null)

function calcularTotal() {
  total.value = precio.value * cantidad.value
}

// ─── .trim ────────────────────────────────────────────────────────────────────
// Elimina espacios al inicio y al final
const textoConEspacios = ref('')
const textoSinTrim = ref('')

// ─── Combinados ───────────────────────────────────────────────────────────────
const montoFinanciero = ref<number>(0)
const descripcionFinanciera = ref('')
</script>

<template>
  <Card class="page-card">
    <template #content>
      <header class="page-header">
        <h1 class="page-title">2 · v-model con Modificadores</h1>
        <p class="page-subtitle">
          <code>.lazy</code>, <code>.number</code> y <code>.trim</code> para controlar cómo y cuándo se sincroniza el valor.
        </p>
      </header>

      <div class="examples">

        <!-- ─── .lazy ─────────────────────────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title"><code>.lazy</code> — Actualiza solo al perder el foco</h2>
            <p class="box__desc">
              Sin <code>.lazy</code>: cada pulsación actualiza el modelo.
              Con <code>.lazy</code>: solo actualiza al evento <code>change</code> (blur / Enter).
            </p>
          </div>
          <div class="box__body">
            <div class="field">
              <label class="field__label">Sin .lazy (actualización inmediata)</label>
              <input v-model="textoConEspacios" type="text" class="field__input" placeholder="Escribe…" />
            </div>
            <div class="field">
              <label class="field__label">Con .lazy (actualiza al perder foco)</label>
              <input v-model.lazy="textoLazy" type="text" class="field__input" placeholder="Escribe y luego haz click fuera…" />
            </div>
            <div class="compare">
              <p class="result">Sin .lazy: <span class="pill pill--info">{{ textoConEspacios || '—' }}</span></p>
              <p class="result">Con .lazy: <span class="pill pill--ok">{{ textoLazy || '—' }}</span></p>
            </div>
            <div class="tip-box">
              <strong>💡 Enfoque PRO:</strong> Usa <code>.lazy</code> para optimizar formularios con búsquedas
              o validaciones costosas — evita disparar lógica en cada tecla.
            </div>
          </div>
        </section>

        <!-- ─── .number ───────────────────────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title"><code>.number</code> — Convierte a número automáticamente</h2>
            <p class="box__desc">
              Los inputs siempre devuelven <code>string</code>. Con <code>.number</code> Vue aplica
              <code>parseFloat()</code> para que el valor sea numérico.
            </p>
          </div>
          <div class="box__body">
            <div class="fields-row">
              <div class="field">
                <label class="field__label">Precio ($.number)</label>
                <input v-model.number="precio" type="number" class="field__input" min="0" step="0.01" placeholder="0.00" />
              </div>
              <div class="field">
                <label class="field__label">Cantidad (.number)</label>
                <input v-model.number="cantidad" type="number" class="field__input" min="1" placeholder="1" />
              </div>
            </div>
            <button type="button" class="btn" @click="calcularTotal">Calcular total</button>
            <p v-if="total !== null" class="result">
              Total: <span class="pill pill--ok pill--lg">$ {{ total.toFixed(2) }}</span>
            </p>
            <p class="result">
              Tipo de dato: <span class="pill pill--info">{{ typeof precio }}</span>
              (antes de <code>.number</code> sería <code>string</code>)
            </p>
            <div class="tip-box">
              <strong>💡 Formularios financieros:</strong> Siempre usa <code>v-model.number</code> para
              evitar la suma <code>"10" + "5" = "105"</code> en lugar de <code>15</code>.
            </div>
          </div>
        </section>

        <!-- ─── .trim ─────────────────────────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title"><code>.trim</code> — Elimina espacios innecesarios</h2>
            <p class="box__desc">
              Aplica <code>String.prototype.trim()</code> automáticamente al valor del input.
            </p>
          </div>
          <div class="box__body">
            <div class="fields-row">
              <div class="field">
                <label class="field__label">Sin .trim</label>
                <input v-model="textoSinTrim" type="text" class="field__input" placeholder="  con espacios  " />
              </div>
              <div class="field">
                <label class="field__label">Con .trim</label>
                <input v-model.trim="descripcionFinanciera" type="text" class="field__input" placeholder="  con espacios  " />
              </div>
            </div>
            <p class="result">Sin .trim: "<span class="pill pill--off">{{ textoSinTrim }}</span>" (longitud: {{ textoSinTrim.length }})</p>
            <p class="result">Con .trim: "<span class="pill pill--ok">{{ descripcionFinanciera }}</span>" (longitud: {{ descripcionFinanciera.length }})</p>
            <div class="tip-box">
              <strong>💡 UX:</strong> Evita errores de validación por espacios accidentales en emails,
              nombres o códigos de producto.
            </div>
          </div>
        </section>

        <!-- ─── Combinados ────────────────────────────────────────────────── -->
        <section class="box box--highlight">
          <div class="box__head">
            <h2 class="box__title">🔥 Modificadores combinados</h2>
            <p class="box__desc">Puedes combinar varios modificadores en un mismo <code>v-model</code>.</p>
          </div>
          <div class="box__body">
            <pre class="code">&lt;!-- Numérico perezoso --&gt;
&lt;input v-model.lazy.number="monto" type="number" /&gt;

&lt;!-- Texto limpio y perezoso --&gt;
&lt;input v-model.lazy.trim="descripcion" type="text" /&gt;</pre>
            <div class="field">
              <label class="field__label">Monto financiero (lazy + number)</label>
              <input v-model.lazy.number="montoFinanciero" type="number" class="field__input" min="0" step="100" placeholder="0" />
            </div>
            <p class="result">Valor: <span class="pill pill--ok">{{ montoFinanciero }}</span> — tipo: <span class="pill pill--info">{{ typeof montoFinanciero }}</span></p>
          </div>
        </section>

        <!-- ─── Tabla comparativa ─────────────────────────────────────────── -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">📊 Tabla comparativa</h2>
          </div>
          <div class="box__body">
            <table class="table">
              <thead>
                <tr>
                  <th>Modificador</th>
                  <th>Cuándo actualiza</th>
                  <th>Caso de uso ideal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>v-model</code></td>
                  <td>Cada tecla (<code>input</code>)</td>
                  <td>Búsquedas en tiempo real</td>
                </tr>
                <tr>
                  <td><code>v-model.lazy</code></td>
                  <td>Al perder foco (<code>change</code>)</td>
                  <td>Validaciones costosas, guardar borrador</td>
                </tr>
                <tr>
                  <td><code>v-model.number</code></td>
                  <td>Cada tecla (como número)</td>
                  <td>Formularios financieros, cálculos</td>
                </tr>
                <tr>
                  <td><code>v-model.trim</code></td>
                  <td>Cada tecla (sin espacios)</td>
                  <td>Emails, nombres, códigos</td>
                </tr>
              </tbody>
            </table>
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

.fields-row { display: flex; gap: 1rem; flex-wrap: wrap; }
.field { display: flex; flex-direction: column; gap: .35rem; flex: 1; min-width: 180px; }
.field__label { font-size: .9rem; font-weight: 600; opacity: .8; }
.field__input {
  border: 1px solid rgba(0,0,0,.18);
  border-radius: 8px;
  padding: .45rem .65rem;
  font-size: .95rem;
  outline: none;
  transition: border-color .2s;
}
.field__input:focus { border-color: #6366f1; }

.compare { display: flex; gap: 1rem; flex-wrap: wrap; }
.result { margin: 0; font-size: .9rem; }

.tip-box {
  background: rgba(251,191,36,.12);
  border: 1px solid rgba(251,191,36,.3);
  border-radius: 8px;
  padding: .6rem .85rem;
  font-size: .88rem;
}

.btn {
  appearance: none;
  border: 1px solid rgba(0,0,0,.18);
  background: #fff;
  border-radius: 10px;
  padding: .5rem .85rem;
  cursor: pointer;
  width: fit-content;
}
.btn:hover { background: rgba(0,0,0,.04); }

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
.pill--lg   { font-size: 1rem; padding: .2rem .75rem; }

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

.table { width: 100%; border-collapse: collapse; font-size: .9rem; }
.table th, .table td { padding: .5rem .75rem; text-align: left; border-bottom: 1px solid rgba(0,0,0,.08); }
.table th { font-weight: 700; background: rgba(0,0,0,.03); }
.table tr:last-child td { border-bottom: none; }
</style>
