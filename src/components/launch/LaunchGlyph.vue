<script setup>
/**
 * The two marks the launch page draws itself: the quantum-portrait glyph (a
 * qubit with an orbit, used for the "Make it quantum" affordances) and Lucide's
 * `coins`, which the shared icon set does not carry.
 *
 * Sizing and colour come from the class attribute, exactly like `ui/Icon.vue`.
 */
import { computed } from "vue";

const GLYPHS = {
  quantum:
    '<circle cx="12" cy="12" r="9"></circle><ellipse cx="12" cy="12" rx="9" ry="3.2" stroke-dasharray="2 2.4"></ellipse><path d="M12 3v18" stroke-opacity="0.45"></path><path d="M12 12l4.6-5.4"></path><circle cx="16.6" cy="6.6" r="1.6" fill="currentColor" stroke="none"></circle>',
  coins:
    '<path d="M13.744 17.736a6 6 0 1 1-7.48-7.48"></path><path d="M15 6h1v4"></path><path d="m6.134 14.768.866-.5 2 3.464"></path><circle cx="16" cy="8" r="6"></circle>',
};

const props = defineProps({
  name: { type: String, required: true },
  strokeWidth: { type: [Number, String], default: 1.5 },
});

const body = computed(() => GLYPHS[props.name] ?? "");
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    aria-hidden="true"
    class="pp-glyph"
    v-html="body"
  />
</template>

<style scoped>
.pp-glyph {
  flex: 0 0 auto;
}
</style>
