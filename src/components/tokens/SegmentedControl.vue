<script setup>
/**
 * Segmented tabs, matching the reference's `data-slot="segmented"` control:
 * a `bg-muted` track with the pressed item drawn as a `bg-foreground` pill.
 */
defineProps({
  modelValue: { type: String, required: true },
  /** `[{ key, label }]` */
  items: { type: Array, required: true },
  ariaLabel: { type: String, default: "Show" },
});

defineEmits(["update:modelValue"]);
</script>

<template>
  <div role="group" :aria-label="ariaLabel" class="pp-seg">
    <button
      v-for="item in items"
      :key="item.key"
      type="button"
      :aria-pressed="item.key === modelValue"
      class="pp-seg__item"
      :class="{ 'is-pressed': item.key === modelValue }"
      @click="$emit('update:modelValue', item.key)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
