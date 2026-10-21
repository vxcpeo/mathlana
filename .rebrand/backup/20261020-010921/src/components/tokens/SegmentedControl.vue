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
  <div
    role="group"
    :aria-label="ariaLabel"
    class="relative isolate inline-flex h-10 w-fit max-w-full items-stretch rounded-[calc(var(--radius)+4px)] border bg-muted p-[3px] text-sm [--segmented-radius:var(--radius)]"
  >
    <button
      v-for="item in items"
      :key="item.key"
      type="button"
      :aria-pressed="item.key === modelValue"
      :data-pressed="item.key === modelValue ? '' : undefined"
      class="relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[var(--segmented-radius)] px-3 font-medium whitespace-nowrap transition-[color,scale] duration-150 ease-out outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring active:scale-[0.96]"
      :class="
        item.key === modelValue
          ? 'bg-foreground text-background'
          : 'text-muted-foreground hover:text-foreground'
      "
      @click="$emit('update:modelValue', item.key)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
