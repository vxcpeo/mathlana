<script setup>
/**
 * One numbered step of the launch form: the mono index, the heading and its
 * one-line helper, then the step's own controls.
 */
defineProps({
  index: { type: String, required: true },
  title: { type: String, required: true },
  hint: { type: String, default: null },
});
</script>

<template>
  <section class="flex flex-col gap-4">
    <div class="flex items-baseline gap-3">
      <span class="font-mono text-xs text-quiet figures">{{ index }}</span>
      <div class="flex flex-col gap-0.5">
        <h2 class="font-heading text-base font-semibold tracking-[-0.01em]">{{ title }}</h2>
        <p v-if="hint" class="text-xs text-muted-foreground">{{ hint }}</p>
      </div>
    </div>
    <slot />
  </section>
</template>
