<script setup>
/** "Where its fees go": the on-chain 60/20/20 split, with a worked example. */
import { computed } from "vue";
import { LAUNCH } from "@/data/onchain";

const example = computed(() => {
  const { tradedUsd, poolUsd, creatorUsd } = LAUNCH.workedExample;
  return `On $${tradedUsd.toLocaleString("en-US")} traded: $${poolUsd.toFixed(2)} to its AI/Quantum pool, $${creatorUsd.toFixed(2)} to you.`;
});

const SPLIT = [
  { label: "AI/Quantum pool", share: 60, dot: "bg-brand" },
  { label: "Mathlana", share: 20, dot: "bg-brand/45" },
  { label: "Creator", share: 20, dot: "bg-foreground/70" },
];
</script>

<template>
  <section class="flex flex-col gap-3">
    <h2 class="headline text-xl">Where its fees go</h2>
    <div class="flex flex-col gap-4 rounded-xl border bg-card p-4">
      <div class="flex h-2 overflow-hidden rounded-full" aria-hidden="true">
        <span class="bg-brand" style="width: 60%" />
        <span class="bg-brand/45" style="width: 20%" />
        <span class="bg-foreground/70" style="width: 20%" />
      </div>
      <ul class="flex flex-col gap-2 text-sm">
        <li v-for="row in SPLIT" :key="row.label" class="flex items-center justify-between gap-3">
          <span class="flex items-center gap-2 text-muted-foreground">
            <span class="size-2 rounded-full" :class="row.dot" aria-hidden="true" />{{ row.label }}
          </span>
          <span class="font-mono figures">{{ row.share }}%</span>
        </li>
      </ul>
      <p class="text-xs text-pretty text-quiet">{{ example }}</p>
    </div>
  </section>
</template>
