<script setup>
/**
 * One numbered clause of a legal document: a mono index in the ruled gutter,
 * a heading and a paragraph. The paragraph is either a plain `body` string or,
 * when it needs inline markup (the privacy page's mailto link), an `html`
 * string taken verbatim from the reference.
 */
defineProps({
  index: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, default: "" },
  html: { type: String, default: "" },
});
</script>

<template>
  <li class="pp-doc__clause">
    <span class="pp-doc__clause-index">{{ index }}</span>
    <section class="pp-doc__clause-body">
      <h2 class="pp-h2 pp-doc__clause-title">{{ title }}</h2>
      <p class="pp-body pp-doc__clause-text">
        <span v-if="html" v-html="html" />
        <template v-else>{{ body }}</template>
      </p>
    </section>
  </li>
</template>

<style scoped>
.pp-doc__clause {
  display: grid;
  grid-template-columns: clamp(3.5rem, 7vw, 6.5rem) minmax(0, 1fr);
  gap: clamp(16px, 3vw, 44px);
  padding: clamp(24px, 3.5vw, 42px) clamp(16px, 3vw, 28px);
  border-bottom: 1px solid var(--pp-line);
}

.pp-doc__clause:last-child {
  border-bottom: 0;
}

.pp-doc__clause-index {
  display: block;
  min-width: 0;
  padding-top: 0.28em;
  padding-right: 14px;
  border-right: 1px solid var(--pp-line-soft);
  font-family: var(--pp-mono);
  font-size: 0.72rem;
  line-height: 1.4;
  letter-spacing: 0.12em;
  font-variant-numeric: tabular-nums;
  color: var(--pp-accent-text);
}

.pp-doc__clause-body {
  display: grid;
  gap: 10px;
  max-width: 74ch;
  min-width: 0;
}

.pp-doc__clause-title {
  font-size: clamp(1.3rem, 2.2vw, 1.8rem);
  line-height: 1.02;
  overflow-wrap: anywhere;
}

.pp-doc__clause-text {
  overflow-wrap: anywhere;
}

.pp-doc__clause-text :deep(a) {
  color: var(--pp-accent-text);
  text-decoration: underline;
  text-decoration-color: var(--pp-accent-line);
  text-underline-offset: 3px;
}

.pp-doc__clause-text :deep(a:hover) {
  text-decoration-color: currentColor;
}

@media (max-width: 560px) {
  .pp-doc__clause {
    grid-template-columns: 2.2rem minmax(0, 1fr);
    gap: 12px;
    padding: 22px 14px;
  }

  .pp-doc__clause-index {
    padding-right: 9px;
    font-size: 0.64rem;
  }

  .pp-doc__clause-body {
    gap: 8px;
  }

  .pp-doc__clause-title {
    font-size: 1.22rem;
  }
}
</style>
