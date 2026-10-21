<script setup>
/**
 * Shared shell for the three legal documents (`/terms`, `/privacy`, `/risks`).
 *
 * Mirrors the reference exactly: a max-w-3xl article with the "Legal" eyebrow,
 * the document title, the "Last updated" line, the cross-link chip row and the
 * numbered `<ol>` list that the sections are slotted into.
 */
import { RouterLink } from "vue-router";

defineProps({
  title: { type: String, required: true },
  /** Key of the page being viewed: "terms" | "privacy" | "risks". */
  current: { type: String, required: true },
  eyebrow: { type: String, default: "Legal" },
  updated: { type: String, default: "Last updated October 10, 2026" },
});

const PAGES = [
  { key: "terms", label: "Terms", to: "/terms" },
  { key: "privacy", label: "Privacy", to: "/privacy" },
  { key: "risks", label: "Risks", to: "/risks" },
];

const CHIP =
  "rounded-md border px-2.5 text-[0.8rem] leading-7 whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50";
</script>

<template>
  <article
    class="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-14"
  >
    <header class="flex flex-col gap-3">
      <p class="text-sm font-medium text-brand-text">{{ eyebrow }}</p>
      <h1 class="headline text-3xl sm:text-4xl">{{ title }}</h1>
      <p class="text-sm text-muted-foreground">{{ updated }}</p>
      <nav aria-label="Legal pages" class="flex flex-wrap gap-1.5 pt-1">
        <RouterLink
          v-for="page in PAGES"
          :key="page.key"
          :to="page.to"
          :aria-current="page.key === current ? 'page' : undefined"
          :class="[
            CHIP,
            page.key === current
              ? 'border-brand-border text-brand-text'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          >{{ page.label }}</RouterLink
        >
      </nav>
    </header>

    <ol class="flex flex-col divide-y overflow-hidden rounded-xl border bg-card">
      <slot />
    </ol>
  </article>
</template>
