<script setup>
/** The Qubitlane brand mark — a Q drawn as a key ring with a cobalt tail. */
</script>

<template>
  <svg
    viewBox="0 0 600 480"
    class="brand-mark h-[1.05em] w-auto shrink-0"
    aria-hidden="true"
    data-brand-mark="true"
  >
    <circle
      class="brand-mark__ring"
      cx="255"
      cy="215"
      r="150"
      fill="none"
      stroke-width="60"
    />
    <path
      class="brand-mark__tail"
      d="M330 280 L520 460"
      fill="none"
      stroke-width="60"
      stroke-linecap="round"
    />
  </svg>
</template>

<style scoped>
.brand-mark__ring {
  stroke: var(--foreground);
}

.brand-mark__tail {
  stroke: var(--brand);
}
</style>
