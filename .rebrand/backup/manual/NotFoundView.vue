<script setup>
/**
 * 404 — the reference's own "Nothing here" page: the brand mark, the headline,
 * one line of copy and the way back. A second button to the challenge index is
 * added on top of the reference's single "Go home".
 */
import { RouterLink } from "vue-router";
import BrandMark from "@/components/brand/BrandMark.vue";
import CardArt from "@/components/art/CardArt.vue";
import AppButton from "@/components/ui/AppButton.vue";
</script>

<template>
  <!-- The layout already provides <main id="main">, so the page root is a div. -->
  <div
    class="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.618fr_1fr]"
  >
    <div class="flex flex-col gap-5">
      <RouterLink to="/" class="w-fit">
        <span
          class="inline-flex items-center gap-[0.5em] text-xl"
          role="img"
          aria-label="Qubitlane home"
        >
          <BrandMark />
          <span
            aria-hidden="true"
            translate="no"
            class="font-heading font-semibold tracking-[-0.01em] text-foreground"
            >Math<span style="color: #6c86ff">lana</span></span
          >
        </span>
      </RouterLink>

      <h1 class="headline text-4xl">Nothing here</h1>
      <p class="text-muted-foreground">This page doesn't exist, or it moved.</p>

      <div class="flex flex-wrap items-center gap-2">
        <AppButton to="/" class="w-fit px-4">Go home</AppButton>
        <AppButton to="/challenges" variant="outline" class="w-fit px-4"
          >See the challenges</AppButton
        >
      </div>
    </div>

    <CardArt name="figure" class="hidden h-auto w-full md:block" />
  </div>
</template>
