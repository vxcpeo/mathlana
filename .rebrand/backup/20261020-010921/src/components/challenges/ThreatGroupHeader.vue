<script setup>
/** The wide bordered header card that fronts each threat group. */
import CardArt from "@/components/art/CardArt.vue";
import ChallengeIcon from "@/components/challenges/ChallengeIcon.vue";

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  icon: { type: String, required: true },
  /** Line art shown faintly on the right. */
  art: { type: String, required: true },
});
</script>

<template>
  <div class="group relative overflow-hidden rounded-xl border bg-card px-5 py-5">
    <span
      aria-hidden="true"
      class="pointer-events-none absolute -top-8 -right-8 bottom-1 flex items-center text-brand opacity-45 transition-[opacity,transform] duration-500 ease-out group-hover:-rotate-2 group-hover:opacity-80 motion-reduce:transition-none"
    >
      <span v-if="art === 'figure'" class="block h-[72%] w-auto translate-y-3 -rotate-[8deg]">
        <CardArt :name="art" class="h-full" />
      </span>
      <CardArt v-else :name="art" class="h-full" />
    </span>

    <h2
      class="relative flex items-center gap-2.5 font-heading text-xl font-semibold tracking-[-0.015em]"
    >
      <ChallengeIcon :name="icon" class="shrink-0 size-5 text-brand-text" />{{ title }}
    </h2>
    <p class="relative mt-1 max-w-[62%] text-sm text-pretty text-muted-foreground">
      {{ subtitle }}
    </p>
  </div>
</template>
