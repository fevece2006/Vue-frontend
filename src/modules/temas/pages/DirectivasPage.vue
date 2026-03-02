<script setup lang="ts">
const name = 'Vue 3'
const active = false

const arrayFrutas = ['Manzana', 'Banana', 'Sandía', 'Fresa', 'Cereza']
</script>

<template>
  <Card class="page-card">
    <template #content>
      <header class="page-header">
        <h1 class="page-title">Temas · Directivas</h1>
        <p class="page-subtitle">Ejemplos visuales de directivas de Vue en “cuadros”.</p>
      </header>

      <div class="examples">
        <!-- v-if -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">v-if</h2>
            <p class="box__desc">Renderiza el elemento solo si la condición es verdadera.</p>
          </div>

          <div class="box__body">
            <p class="demo">
              Resultado:
              <span v-if="active" class="pill pill--ok">{{ name }}</span>
              <span v-else class="pill pill--off">No se muestra (active = false)</span>
            </p>
          </div>
        </section>

        <!-- v-if / v-else -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">v-if / v-else</h2>
            <p class="box__desc">v-else debe ir inmediatamente después del nodo con v-if.</p>
          </div>

          <div class="box__body">
            <p class="demo">
              Resultado:
              <span v-if="active" class="pill pill--ok">Se muestra: {{ name }}</span>
              <span v-else class="pill pill--off">Se muestra el else: {{ name }}</span>
            </p>
          </div>
        </section>

        <!-- v-show -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">v-show</h2>
            <p class="box__desc">
              No monta/desmonta el nodo: solo alterna CSS (<code>display: none</code>).
            </p>
          </div>

          <div class="box__body">
            <p class="demo">
              Estado:
              <span class="pill pill--info">active = {{ active }}</span>
            </p>

            <h3 v-show="active" class="show-title">Estoy en true</h3>

            <p v-show="!active" class="hint">
              (No se ve el título porque <code>active</code> está en <code>false</code>.)
            </p>
          </div>
        </section>

        <!-- v-for -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">v-for</h2>
            <p class="box__desc">Recorre un arreglo y renderiza un elemento por cada ítem.</p>
          </div>

          <div class="box__body">
            <p class="demo">
              Hola {{ name }}!
              <span class="pill pill--info">arrayFrutas ({{ arrayFrutas.length }})</span>
            </p>

            <ul class="list">
              <li v-for="(fruta, index) in arrayFrutas" :key="index" class="list-item">
                <span class="index">#{{ index }}</span>
                <span class="fruit">{{ fruta }}</span>
              </li>
            </ul>

            <p class="hint">
              Nota: en listas reales es mejor usar un identificador único como <code>:key</code>, no el
              <code>index</code>. Aquí está bien para el ejemplo.
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

/* “Cuadro” */
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
  gap: 0.5rem;
}

.demo {
  margin: 0;
}

/* Etiquetas */
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

.pill--info {
  background: rgba(0, 123, 255, 0.1);
  border-color: rgba(0, 123, 255, 0.2);
}

.show-title {
  margin: 0;
}

.hint {
  margin: 0;
  opacity: 0.75;
}

/* Lista v-for */
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.5rem;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.65rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
}

.index {
  font-size: 0.85rem;
  opacity: 0.7;
  width: 3rem;
}

.fruit {
  font-size: 1rem;
}
</style>