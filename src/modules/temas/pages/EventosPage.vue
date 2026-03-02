<script setup lang="ts">
const name = 'Vue 3'

const handleClick = (): void => {
  console.log('Me diste click')
}
</script>

<template>
  <Card class="page-card">
    <template #content>
      <header class="page-header">
        <h1 class="page-title">Temas · Eventos</h1>
        <p class="page-subtitle">Ejemplos visuales de eventos con <code>v-on</code> / <code>@</code>.</p>
      </header>

      <div class="examples">
        <!-- v-on -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">v-on:click</h2>
            <p class="box__desc">Escucha eventos del DOM usando la sintaxis larga.</p>
          </div>

          <div class="box__body">
            <p class="demo">
              Hola {{ name }}!
              <span class="pill pill--info">Abre la consola para ver el mensaje</span>
            </p>

            <div class="actions">
              <button type="button" class="btn" v-on:click="handleClick">Click aquí</button>
            </div>
          </div>
        </section>

        <!-- @click -->
        <section class="box">
          <div class="box__head">
            <h2 class="box__title">@click</h2>
            <p class="box__desc">Atajo de <code>v-on</code>. Es equivalente a <code>v-on:click</code>.</p>
          </div>

          <div class="box__body">
            <p class="demo">
              Hola {{ name }}!
              <span class="pill pill--info">Abre la consola para ver el mensaje</span>
            </p>

            <div class="actions">
              <button type="button" class="btn" @click="handleClick">Click aquí</button>
            </div>
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
  gap: 0.75rem;
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

.pill--info {
  background: rgba(0, 123, 255, 0.1);
  border-color: rgba(0, 123, 255, 0.2);
}

/* Botones */
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
</style>