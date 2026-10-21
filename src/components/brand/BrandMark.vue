<script setup>
/** The Qubitlane brand mark — a Q drawn as a key ring with a cobalt tail. */
</script>

<template>
  <svg
    viewBox="0 0 600 480"
    class="pp-brandmark"
    aria-hidden="true"
    data-brand-mark="true"
  >
    <circle class="pp-brandmark__ring" cx="255" cy="215" r="150" fill="none" stroke-width="60" />
    <path class="pp-brandmark__tail" d="M330 280 L505 445" fill="none" stroke-width="60" stroke-linecap="round" />
  </svg>
</template>

<style scoped>
.pp-brandmark {
  height: 1.05em;
  width: auto;
  flex-shrink: 0;
}

.pp-brandmark__ring {
  stroke: var(--pp-ink);
}

.pp-brandmark__tail {
  stroke: var(--pp-accent);
}
</style>
