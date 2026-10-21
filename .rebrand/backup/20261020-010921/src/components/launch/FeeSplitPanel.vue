<script setup>
/**
 * "Where the fees go" — the on-chain fee split, read from `LAUNCH.feeShare`
 * so the bars and the percentages can never drift from the program.
 */
import { computed } from "vue";
import CardArt from "@/components/art/CardArt.vue";
import { LAUNCH } from "@/data/onchain";

const { aiQuantumPoolBps, platformBps, creatorBps } = LAUNCH.feeShare;
const totalBps = aiQuantumPoolBps + platformBps + creatorBps;

function share(bps) {
  return `${(bps / totalBps) * 100}%`;
}

function percent(bps) {
  return Number(((bps / totalBps) * 100).toFixed(2)).toString();
}

const rows = computed(() => [
  {
    label: "Your token's AI/Quantum pool: AI, quantum runs, computer time",
    dot: "bg-brand",
    bps: aiQuantumPoolBps,
  },
  { label: "Mathlana, the platform", dot: "bg-brand/45", bps: platformBps },
  { label: "You, the creator", dot: "bg-foreground/70", bps: creatorBps },
]);

const workedExample = `On $${LAUNCH.workedExample.tradedUsd.toLocaleString("en-US")} traded: $${LAUNCH.workedExample.poolUsd.toFixed(2)} to its AI/Quantum pool, $${LAUNCH.workedExample.creatorUsd.toFixed(2)} to you.`;
</script>

<template>
  <div class="group flex flex-col overflow-hidden rounded-xl border bg-card">
    <div class="relative overflow-hidden border-b px-4 py-3.5">
      <span
        aria-hidden="true"
        class="pointer-events-none absolute -top-8 -right-8 bottom-1 flex items-center text-brand opacity-45 transition-[opacity,transform] duration-500 ease-out group-hover:-rotate-2 group-hover:opacity-80 motion-reduce:transition-none"
      >
        <span class="block h-[72%] w-auto translate-y-3 -rotate-[8deg]">
          <CardArt name="figure" class="h-full" />
        </span>
      </span>
      <p class="relative font-heading text-sm font-semibold tracking-[-0.01em]">Where the fees go</p>
      <p class="relative mt-0.5 max-w-[62%] text-xs text-pretty text-muted-foreground">
        Of the token's share of every trade's fee, locked on chain:
      </p>
    </div>

    <div class="flex flex-col gap-3 px-4 py-3.5">
      <div class="flex h-1.5 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
        <span
          v-for="row in rows"
          :key="row.label"
          :class="row.dot"
          :style="{ width: share(row.bps) }"
        ></span>
      </div>
      <ul class="flex flex-col gap-1.5 text-xs">
        <li v-for="row in rows" :key="row.label" class="flex items-center justify-between gap-3">
          <span class="flex min-w-0 items-center gap-2 text-muted-foreground">
            <span class="size-2 shrink-0 rounded-full" :class="row.dot" aria-hidden="true"></span>
            <span class="truncate">{{ row.label }}</span>
          </span>
          <span class="font-mono text-foreground figures">{{ percent(row.bps) }}%</span>
        </li>
      </ul>
    </div>

    <p class="border-t px-4 py-2.5 text-[0.72rem] text-pretty text-quiet">{{ workedExample }}</p>
  </div>
</template>
