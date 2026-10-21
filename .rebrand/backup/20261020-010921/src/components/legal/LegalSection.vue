<script setup>
/**
 * One numbered clause of a legal document: mono number in the gutter, a
 * heading and a paragraph. The paragraph is either a plain `body` string or,
 * when it needs inline markup (the privacy page's mailto link), an `html`
 * string taken verbatim from the reference.
 */
defineProps({
  index: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, default: "" },
  html: { type: String, default: "" },
});
</script>

<template>
  <li class="grid grid-cols-[1.375rem_minmax(0,1fr)] gap-x-3 px-5 py-4 sm:px-6">
    <span class="pt-0.5 font-mono text-xs text-brand-text figures">{{ index }}</span>
    <section class="flex min-w-0 flex-col gap-1">
      <h2 class="font-heading text-[0.95rem] font-semibold tracking-[-0.01em]">
        {{ title }}
      </h2>
      <p class="text-[0.88rem] leading-relaxed text-pretty text-muted-foreground">
        <span v-if="html" v-html="html" />
        <template v-else>{{ body }}</template>
      </p>
    </section>
  </li>
</template>
