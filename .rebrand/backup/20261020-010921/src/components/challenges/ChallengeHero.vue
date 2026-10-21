<script setup>
/** Challenge detail masthead: host, verb, name, the brief, and the launch CTA. */
import { RouterLink } from "vue-router";
import ChallengeIcon from "@/components/challenges/ChallengeIcon.vue";
import VerbBadge from "@/components/challenges/VerbBadge.vue";

defineProps({
  hostIcon: { type: String, required: true },
  hostLabel: { type: String, required: true },
  verb: { type: String, required: true },
  verbIcon: { type: String, required: true },
  verbIconClass: { type: String, default: "text-brand" },
  name: { type: String, required: true },
  asks: { type: String, required: true },
  why: { type: String, default: null },
  /** `?track=` value the launch page reads. */
  track: { type: String, required: true },
  ctaNote: { type: String, required: true },
});
</script>

<template>
  <section class="border-b">
    <div
      class="mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-8 px-4 sm:px-6 lg:grid-cols-[1.618fr_1fr]"
    >
      <div class="flex flex-col gap-5 py-12 sm:py-16">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p class="flex items-center gap-2 text-sm whitespace-nowrap text-muted-foreground">
            <ChallengeIcon :name="hostIcon" class="size-4 text-brand" />{{ hostLabel }}
          </p>
          <VerbBadge :verb="verb" :icon="verbIcon" :icon-class="verbIconClass" />
        </div>

        <h1 class="headline text-4xl sm:text-6xl">{{ name }}</h1>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="flex flex-col gap-1.5">
            <h2 class="text-[0.7rem] font-medium tracking-[0.08em] text-quiet uppercase">
              What it asks
            </h2>
            <p class="text-sm text-pretty text-muted-foreground">{{ asks }}</p>
          </div>
          <div v-if="why" class="flex flex-col gap-1.5">
            <h2 class="text-[0.7rem] font-medium tracking-[0.08em] text-quiet uppercase">
              Why it matters
            </h2>
            <p class="text-sm text-pretty text-muted-foreground">{{ why }}</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <RouterLink
            :to="`/launch?track=${track}`"
            class="group/button inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-primary bg-clip-padding px-5 text-sm font-medium whitespace-nowrap text-primary-foreground transition-all outline-none select-none hover:bg-primary/80 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px"
            >Launch a token on it</RouterLink
          >
          <p class="max-w-sm text-xs text-quiet">{{ ctaNote }}</p>
        </div>
      </div>

      <div class="relative hidden h-full min-h-[22rem] lg:block">
        <div
          class="pointer-events-none absolute inset-x-0 bottom-0 mx-auto aspect-[1584/2000] h-[min(30rem,100%)] w-auto select-none"
          aria-hidden="true"
        >
          <img
            src="/brand/urania-ink.png"
            alt=""
            class="size-full object-contain object-bottom opacity-80 dark:hidden"
            style="mask-image: linear-gradient(to bottom, black 58%, transparent 96%)"
          />
          <img
            src="/brand/urania-indigo.png"
            alt=""
            class="hidden size-full object-contain object-bottom dark:block"
            style="mask-image: linear-gradient(to bottom, black 58%, transparent 96%)"
          />
        </div>
      </div>
    </div>
  </section>
</template>
