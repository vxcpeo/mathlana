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
  <li class="cq-doc__clause">
    <span class="cq-doc__clause-index cq-num">{{ index }}</span>
    <section class="cq-doc__clause-body">
      <h2 class="cq-h3 cq-doc__clause-title">{{ title }}</h2>
      <p class="cq-body cq-doc__clause-text">
        <span v-if="html" v-html="html" />
        <template v-else>{{ body }}</template>
      </p>
    </section>
  </li>
</template>

<style scoped>
.cq-doc__clause {
  display: grid;
  grid-template-columns: clamp(3.4rem, 7vw, 6.2rem) minmax(0, 1fr);
  gap: clamp(16px, 3vw, 44px);
  padding: clamp(22px, 3.2vw, 38px) clamp(18px, 3vw, 32px);
  border-bottom: 1px solid var(--cq-line);
}

.cq-doc__clause:last-child {
  border-bottom: 0;
}

.cq-doc__clause-index {
  display: block;
  min-width: 0;
  padding-top: 0.18em;
  padding-right: 14px;
  border-right: 1px solid var(--cq-line-soft);
  font-size: 0.72rem;
  line-height: 1.4;
  letter-spacing: 0.12em;
  color: var(--cq-accent-text);
}

.cq-doc__clause-body {
  display: grid;
  gap: 9px;
  max-width: 76ch;
  min-width: 0;
}

.cq-doc__clause-title {
  font-size: clamp(1.12rem, 1.7vw, 1.34rem);
  line-height: 1.12;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
}

.cq-doc__clause-text {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--cq-ink-soft);
  overflow-wrap: anywhere;
}

.cq-doc__clause-text :deep(a) {
  color: var(--cq-accent-text);
  text-decoration: underline;
  text-decoration-color: var(--cq-accent-line);
  text-underline-offset: 3px;
}

.cq-doc__clause-text :deep(a:hover) {
  text-decoration-color: currentColor;
}

@media (max-width: 560px) {
  .cq-doc__clause {
    grid-template-columns: 2.2rem minmax(0, 1fr);
    gap: 12px;
    padding: 20px 14px;
  }

  .cq-doc__clause-index {
    padding-right: 9px;
    font-size: 0.64rem;
  }

  .cq-doc__clause-body {
    gap: 8px;
  }

  .cq-doc__clause-title {
    font-size: 1.08rem;
  }
}
</style>
