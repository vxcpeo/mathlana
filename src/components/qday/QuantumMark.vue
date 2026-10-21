<script setup>
/**
 * The site's "quantum" ring mark — the hand-drawn orbit used beside the Q-Day
 * clock and the exposure legend. Not part of `Icon.vue`'s Lucide set, so it
 * lives here as page art.
 */
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    class="pp-mark"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <ellipse cx="12" cy="12" rx="9" ry="3.2" stroke-dasharray="2 2.4" />
    <path d="M12 3v18" stroke-opacity="0.45" />
    <path d="M12 12l4.6-5.4" />
    <circle cx="16.6" cy="6.6" r="1.6" fill="currentColor" stroke="none" />
  </svg>
</template>

<style scoped>
.pp-mark {
  flex-shrink: 0;
}
</style>
