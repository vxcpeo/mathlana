<script setup>
/**
 * "What's at stake" — the two-column card: what the work protects and the number
 * it defends on the left, the comparison table and the caveat on the right.
 */
defineProps({
  protectsLabel: { type: String, default: "Protects" },
  protects: { type: String, required: true },
  value: { type: String, required: true },
  unit: { type: String, default: null },
});
</script>

<template>
  <div
    class="grid grid-cols-1 overflow-hidden rounded-xl border bg-card lg:grid-cols-[minmax(0,1.618fr)_minmax(0,1fr)]"
  >
    <div class="flex min-w-0 flex-col gap-4 p-4 sm:p-5">
      <div class="flex min-w-0 flex-col gap-1.5">
        <p
          class="truncate text-[0.7rem] font-medium tracking-[0.08em] whitespace-nowrap text-quiet uppercase"
        >
          {{ protectsLabel }}
        </p>
        <p class="text-sm text-pretty text-foreground/90">{{ protects }}</p>
      </div>
      <div class="flex min-w-0 flex-col gap-1.5">
        <p
          class="truncate text-[0.7rem] font-medium tracking-[0.08em] whitespace-nowrap text-quiet uppercase"
        >
          Its number: the public record
        </p>
        <p class="flex items-baseline gap-2 whitespace-nowrap">
          <span class="font-mono text-2xl leading-none font-medium tracking-tight figures">{{
            value
          }}</span>
          <span v-if="unit" class="text-sm text-muted-foreground">{{ unit }}</span>
        </p>
        <slot name="number-note" />
      </div>
      <slot name="extra" />
    </div>

    <div class="flex min-w-0 flex-col gap-3 border-t p-4 sm:p-5 lg:border-t-0 lg:border-l">
      <p
        class="truncate text-[0.7rem] font-medium tracking-[0.08em] whitespace-nowrap text-quiet uppercase"
      >
        For scale
      </p>
      <div class="flex min-w-0 flex-col gap-2">
        <slot name="scale" />
      </div>
      <p class="mt-auto text-xs text-pretty text-quiet"><slot name="footnote" /></p>
    </div>
  </div>
</template>
