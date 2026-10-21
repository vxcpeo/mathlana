<script setup>
/** A token's quantum-drawn picture, served by `/api/t/<mint>/picture`. */
import { computed } from "vue";

const props = defineProps({
  mint: { type: String, required: true },
  name: { type: String, default: "" },
  /** Rendered size in pixels (the reference sets it inline). */
  size: { type: Number, default: 48 },
  /** `square` (rounded 22%, the default) or `circle`. */
  shape: { type: String, default: "square" },
});

const box = computed(() => ({ width: `${props.size}px`, height: `${props.size}px` }));
</script>

<template>
  <div
    class="pp-pic"
    :class="shape === 'circle' ? 'pp-pic--circle' : ''"
    :style="box"
  >
    <img
      :src="`/api/t/${mint}/picture`"
      :alt="`${name}'s picture`"
      loading="lazy"
      decoding="async"
      class="pp-pic__img"
    />
  </div>
</template>

<style scoped>
.pp-pic {
  position: relative;
  flex-shrink: 0;
  overflow: clip;
  border: 1px solid var(--pp-line);
  border-radius: 6px;
  background: var(--pp-sheet-sunk);
}

.pp-pic--circle {
  border-radius: 999px;
}

.pp-pic__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
