<script setup>
/**
 * The Qubitess brand mark — an ink ring (the loop crypto lives in) with the
 * qubit as a detached accent dot escaping it.
 */
</script>

<template>
  <svg
    viewBox="0 0 600 480"
    class="cq-brandmark"
    aria-hidden="true"
    data-brand-mark="true"
  >
    <circle class="cq-brandmark__ring" cx="272" cy="228" r="132" fill="none" stroke-width="56" />
    <circle class="cq-brandmark__dot" cx="470" cy="380" r="34" stroke="none" />
  </svg>
</template>

<style scoped>
.cq-brandmark {
  height: 1.05em;
  width: auto;
  flex-shrink: 0;
}

.cq-brandmark__ring {
  stroke: var(--cq-ink);
}

.cq-brandmark__dot {
  fill: var(--cq-accent);
}
</style>
