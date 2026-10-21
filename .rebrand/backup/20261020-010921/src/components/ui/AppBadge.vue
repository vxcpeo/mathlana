<script setup>
/** Small pill badge. `tone` selects one of the semantic token families. */
import { computed } from "vue";

const props = defineProps({
  tone: { type: String, default: "brand" }, // brand | proven | caution | failed | note | quantum | quiet | solid
  size: { type: String, default: "default" }, // sm | default
  class: { type: String, default: "" },
});

const tones = {
  brand: "border-brand-border bg-brand-surface text-brand-text",
  proven: "border-proven-border bg-proven-surface text-proven-text",
  caution: "border-caution-border bg-caution-surface text-caution-text",
  failed: "border-failed-border bg-failed-surface text-failed-text",
  note: "border-note-border bg-note-surface text-note-text",
  quantum: "border-quantum-border bg-quantum-surface text-quantum-text",
  quiet: "border-quiet-border bg-quiet-surface text-quiet-text",
  solid: "border-transparent bg-primary text-primary-foreground",
  outline: "border-border bg-background text-muted-foreground",
};

const classes = computed(() => [
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-md border font-medium whitespace-nowrap",
  props.size === "sm" ? "px-1.5 py-0.5 text-[0.65rem]" : "px-2 py-0.5 text-[0.7rem]",
  tones[props.tone] ?? tones.brand,
  props.class,
]);
</script>

<template>
  <span :class="classes"><slot /></span>
</template>
