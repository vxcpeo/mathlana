<script setup>
/**
 * Icon used across the challenge pages.
 *
 * `Icon.vue` carries the plain Lucide set, but the reference draws its own
 * orbital glyph wherever a challenge is marked with the atom, so that one name
 * is swapped for the bespoke geometry here. Everything else falls through.
 */
import Icon from "@/components/ui/Icon.vue";

defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 },
  strokeWidth: { type: [Number, String], default: 1.5 },
});

const ORBITAL =
  '<circle cx="12" cy="12" r="9"></circle>' +
  '<ellipse cx="12" cy="12" rx="9" ry="3.2" stroke-dasharray="2 2.4"></ellipse>' +
  '<path d="M12 3v18" stroke-opacity="0.45"></path>' +
  '<path d="M12 12l4.6-5.4"></path>' +
  '<circle cx="16.6" cy="6.6" r="1.6" fill="currentColor" stroke="none"></circle>';
</script>

<template>
  <svg
    v-if="name === 'atom'"
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    class="cq-icon"
    aria-hidden="true"
    v-html="ORBITAL"
  />
  <Icon v-else :name="name" :size="size" :stroke-width="strokeWidth" />
</template>

<style scoped>
.cq-icon {
  flex-shrink: 0;
}
</style>
