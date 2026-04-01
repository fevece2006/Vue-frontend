<script setup lang="ts">
import { ref } from 'vue'

const name = 'Vue 3'

/**
 * Sección 1: variable NO reactiva (let)
 * Nota: esto NO actualizará el DOM, solo verás el cambio en consola.
 */
let counter = 0
const increment = (): void => {
  counter++
  console.log(counter)
}



/**
 * Sección 2: variable reactiva con ref
 * Esto SÍ actualizará el DOM.
 */
const counterRef = ref(0)
const incrementRef = (): void => {
  counterRef.value++
}

const decrementRef = (): void => {
  counterRef.value--
}

</script>

<template>
  <Card class="page-card">
    <template #content>
      <header class="page-header">
        <h1 class="page-title">Temas · Variables reactivas</h1>
        <p class="page-subtitle">
          Comparación entre una variable normal (<code>let</code>) y una reactiva con <code>ref</code>.
        </p>
      </header>

      <div class="examples">
        <!-- Sección 1 -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">let (NO reactivo)</h2>
            <p class="box__desc">
              Al hacer click, el valor aumenta en consola, pero la vista NO se actualiza.
            </p>
          </div>

          <div class="box__body">
            <p class="demo">Hola {{ name }}!</p>

            <p class="counter">
              Counter:
              <span class="pill pill--off">{{ counter }}</span>
            </p>

            <div class="actions">
              <button type="button" class="btn" @click="increment">Click increment</button>
            </div>

            <p class="hint">
              Abre la consola: verás el número incrementando, pero este valor se queda igual.
            </p>
          </div>
        </section>

        <!-- Sección 2 -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">ref (reactivo)</h2>
            <p class="box__desc">
              <code>ref</code> crea una referencia reactiva. Se muta con <code>.value</code>.
            </p>
          </div>

          <div class="box__body">
            <p class="demo">Hola {{ name }}!</p>

            <p class="counter">
              Counter:
              <span class="pill pill--ok">{{ counterRef }}</span>
            </p>

            <div class="actions">
              <button type="button" class="btn" @click="incrementRef">Click increment</button>
            </div>

						            <div class="actions">
              <button type="button" class="btn" @click="decrementRef">Click decrement</button>
            </div>

            <p class="hint">
              Aquí sí verás el número aumentar en pantalla porque <code>counterRef</code> es reactivo.
            </p>
          </div>
        </section>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.page-header {
  margin-bottom: 1rem;
}

.page-title {
  margin: 0;
}

.page-subtitle {
  margin: 0.25rem 0 0;
  opacity: 0.75;
}

.examples {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.box {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  padding: 1rem;
  background: #fff;
}

.box__head {
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.12);
}

.box__title {
  margin: 0;
  font-size: 1.05rem;
}

.box__desc {
  margin: 0.25rem 0 0;
  opacity: 0.75;
  font-size: 0.95rem;
}

.box__body {
  display: grid;
  gap: 0.75rem;
}

.demo,
.counter {
  margin: 0;
}

.pill {
  display: inline-block;
  margin-left: 0.35rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.85rem;
  border: 1px solid transparent;
  vertical-align: middle;
}

.pill--ok {
  background: rgba(0, 128, 0, 0.1);
  border-color: rgba(0, 128, 0, 0.2);
}

.pill--off {
  background: rgba(128, 128, 128, 0.12);
  border-color: rgba(128, 128, 128, 0.2);
}

.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn {
  appearance: none;
  border: 1px solid rgba(0, 0, 0, 0.18);
  background: #fff;
  border-radius: 10px;
  padding: 0.5rem 0.85rem;
  cursor: pointer;
}

.btn:hover {
  background: rgba(0, 0, 0, 0.04);
}

.hint {
  margin: 0;
  opacity: 0.75;
}
</style>