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
    class="relative shrink-0 overflow-hidden border bg-ink"
    :class="shape === 'circle' ? 'rounded-full' : 'rounded-[22%]'"
    :style="box"
  >
    <img
      :src="`/api/t/${mint}/picture`"
      :alt="`${name}'s picture`"
      loading="lazy"
      decoding="async"
      class="absolute inset-0 size-full object-cover"
    />
  </div>
</template>
