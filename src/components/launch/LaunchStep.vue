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
  <section class="cq-lstep">
    <header class="cq-lstep__head">
      <span class="cq-lstep__no">{{ index }}</span>
      <span aria-hidden="true" class="cq-lstep__rule"></span>
      <div class="cq-lstep__titles">
        <h2 class="cq-lstep__title">{{ title }}</h2>
        <p v-if="hint" class="cq-lstep__hint">{{ hint }}</p>
      </div>
    </header>
    <div class="cq-lstep__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.cq-lstep {
  display: grid;
  gap: clamp(15px, 1.8vw, 22px);
  min-width: 0;
  padding-top: clamp(20px, 2.4vw, 30px);
  border-top: 1px solid var(--cq-ink);
}

.cq-lstep__head {
  display: grid;
  grid-template-columns: 2.9rem 28px minmax(0, 1fr);
  align-items: start;
  gap: 14px;
  min-width: 0;
}

.cq-lstep__rule {
  align-self: start;
  width: 28px;
  height: 1px;
  margin-top: 1.45rem;
  background: var(--cq-accent);
}

.cq-lstep__no {
  display: inline-grid;
  place-items: center;
  width: 2.9rem;
  height: 2.9rem;
  font-family: var(--cq-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--cq-accent-text);
  border: 1px solid var(--cq-accent-line);
  background: var(--cq-accent-soft);
}

.cq-lstep__titles {
  display: grid;
  gap: 5px;
  min-width: 0;
  padding-top: 2px;
}

.cq-lstep__title {
  font-family: var(--cq-display);
  font-size: clamp(1.3rem, 2vw, 1.72rem);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.025em;
  color: var(--cq-ink);
  overflow-wrap: anywhere;
}

.cq-lstep__hint {
  max-width: 70ch;
  font-size: 0.84rem;
  line-height: 1.55;
  color: var(--cq-muted);
}

.cq-lstep__body {
  display: grid;
  gap: clamp(14px, 1.8vw, 20px);
  min-width: 0;
}

.cq-lstep--rail {
  padding-top: 0;
  border-top: 0;
}

.cq-lstep--rail .cq-lstep__head {
  grid-template-columns: 2.55rem minmax(0, 1fr);
  gap: 12px;
}

.cq-lstep--rail .cq-lstep__rule {
  display: none;
}

.cq-lstep--rail .cq-lstep__no {
  width: 2.55rem;
  height: 2.55rem;
}

@media (max-width: 560px) {
  .cq-lstep__head {
    grid-template-columns: 2.5rem minmax(0, 1fr);
    gap: 11px;
  }

  .cq-lstep__rule {
    display: none;
  }

  .cq-lstep__no {
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>
