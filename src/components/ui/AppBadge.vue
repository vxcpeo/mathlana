<script setup>
/** Small labelled tag. `tone` selects one of the semantic families. */
import { computed } from "vue";

const props = defineProps({
  tone: { type: String, default: "brand" }, // brand | proven | caution | failed | note | quantum | quiet | solid | outline
  size: { type: String, default: "default" }, // sm | default
  class: { type: String, default: "" },
});

const tones = {
  brand: "cq-tag--accent",
  proven: "cq-tag--live",
  caution: "cq-tag--warn",
  failed: "cq-tag--alert",
  note: "cq-tag--note",
  quantum: "cq-tag--accent",
  quiet: "",
  solid: "cq-tag--accent",
  outline: "",
};

const classes = computed(() => [
  "cq-tag",
  props.size === "sm" ? "cq-tag--sm" : "",
  tones[props.tone] ?? "",
  props.class,
]);
</script>

<template>
  <span :class="classes"><slot /></span>
</template>
