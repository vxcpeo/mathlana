<script setup>
/**
 * One numbered step of the launch form: the mono index, the heading and its
 * one-line helper, then the step's own controls.
 */
defineProps({
  index: { type: String, required: true },
  title: { type: String, required: true },
  hint: { type: String, default: null },
});
</script>

<template>
  <section class="pp-step">
    <div class="pp-step__bar">
      <span class="pp-step__no">{{ index }}</span>
      <span aria-hidden="true" class="pp-step__rule"></span>
      <h2 class="pp-step__title">{{ title }}</h2>
    </div>
    <p v-if="hint" class="pp-step__hint">{{ hint }}</p>
    <div class="pp-step__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.pp-step {
  display: grid;
  gap: var(--pp-t3);
  min-width: 0;
  padding-top: var(--pp-t3);
  border-top: 1px solid var(--pp-ink);
}

.pp-step__bar {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.pp-step__no {
  display: inline-block;
  flex-shrink: 0;
  font-family: var(--pp-mono);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--pp-accent-text);
}

.pp-step__rule {
  flex: 0 0 26px;
  height: 1px;
  background: var(--pp-accent);
}

.pp-step__bar::after {
  content: "";
  flex: 1 1 48px;
  height: 1px;
  background: var(--pp-line-strong);
}

.pp-step__title {
  min-width: 0;
  font-family: var(--pp-display);
  font-size: clamp(1.25rem, 1.9vw, 1.6rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--pp-ink);
  overflow-wrap: anywhere;
}

.pp-step__hint {
  max-width: 72ch;
  margin-left: 0;
  font-family: var(--pp-display);
  font-style: italic;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--pp-muted);
}

.pp-step__body {
  display: grid;
  gap: var(--pp-t3);
  min-width: 0;
}

@media (max-width: 560px) {
  .pp-step__hint {
    margin-left: 0;
  }
}
</style>
