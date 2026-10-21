<script setup>
/** Small labelled tag. `tone` selects one of the semantic families. */
import { computed } from "vue";

const props = defineProps({
  tone: { type: String, default: "brand" }, // brand | proven | caution | failed | note | quantum | quiet | solid | outline
  size: { type: String, default: "default" }, // sm | default
  class: { type: String, default: "" },
});

const tones = {
  brand: "pp-tag--accent",
  proven: "pp-tag--live",
  caution: "pp-tag--warn",
  failed: "pp-tag--alert",
  note: "pp-tag--note",
  quantum: "pp-tag--accent",
  quiet: "",
  solid: "pp-tag--accent",
  outline: "",
};

const classes = computed(() => [
  "pp-tag",
  props.size === "sm" ? "pp-tag--sm" : "",
  tones[props.tone] ?? "",
  props.class,
]);
</script>

<template>
  <span :class="classes"><slot /></span>
</template>
