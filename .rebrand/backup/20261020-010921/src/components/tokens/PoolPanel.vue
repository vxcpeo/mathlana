<script setup>
/**
 * The token's AI/Quantum pool: what its trading fees have paid in, what the
 * agent and the quantum runs have spent, and the 60/20/20 fee split.
 */
import { computed } from "vue";
import CardArt from "@/components/art/CardArt.vue";
import AiQuantumIcon from "@/components/tokens/AiQuantumIcon.vue";
import { usd } from "@/components/tokens/tokenSnapshot";

const props = defineProps({
  /** `{ paidInUsd, spentUsd, collectedUsd }` */
  pool: { type: Object, required: true },
});

const paidIn = computed(() => Number(props.pool?.paidInUsd ?? 0));
const spent = computed(() => Number(props.pool?.spentUsd ?? 0));
const collected = computed(() => Number(props.pool?.collectedUsd ?? 0));
const inPool = computed(() => Math.max(0, paidIn.value - spent.value));
const spentShare = computed(() =>
  paidIn.value > 0 ? Math.max(0, Math.min(100, (spent.value / paidIn.value) * 100)) : 0,
);
</script>

<template>
  <section
    aria-labelledby="pool-title"
    class="group flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card"
  >
    <div class="relative overflow-hidden border-b px-5 py-3.5">
      <span
        aria-hidden="true"
        class="pointer-events-none absolute -top-8 -right-8 bottom-1 flex items-center text-brand opacity-45 transition-[opacity,transform] duration-500 ease-out group-hover:-rotate-2 group-hover:opacity-80 motion-reduce:transition-none"
      >
        <CardArt name="orbit" class="h-full" />
      </span>

      <h2
        id="pool-title"
        class="relative flex items-center gap-2 font-heading text-base font-semibold tracking-[-0.01em]"
      >
        <AiQuantumIcon class="size-4 shrink-0 text-brand-text" />AI/Quantum pool
      </h2>
      <p class="relative mt-0.5 max-w-[62%] text-[0.8rem] text-pretty text-muted-foreground">
        Pays for its AI agent, quantum runs and computer time.
      </p>
    </div>

    <div class="flex flex-col gap-2.5 px-5 py-3.5">
      <div class="flex min-w-0 flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div class="flex min-w-0 flex-col">
          <p class="text-[0.72rem] text-muted-foreground">In the pool now</p>
          <p class="font-mono text-[1.7rem] leading-tight font-medium figures">{{ usd(inPool) }}</p>
        </div>
        <dl class="flex shrink-0 gap-5 pb-1 text-right">
          <div class="flex flex-col gap-0.5">
            <dt class="text-[0.68rem] whitespace-nowrap text-muted-foreground">Paid in by fees</dt>
            <dd class="font-mono text-[0.85rem] text-foreground figures">{{ usd(paidIn) }}</dd>
          </div>
          <div class="flex flex-col gap-0.5">
            <dt class="text-[0.68rem] whitespace-nowrap text-muted-foreground">Spent</dt>
            <dd class="font-mono text-[0.85rem] text-foreground figures">{{ usd(spent) }}</dd>
          </div>
        </dl>
      </div>

      <div
        aria-hidden="true"
        class="h-1 overflow-hidden rounded-full bg-muted"
        title="How much of what was paid in is spent"
      >
        <span class="block h-full rounded-full bg-brand" :style="{ width: `${spentShare}%` }" />
      </div>

      <p
        class="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-[0.72rem] text-muted-foreground"
        title="Fees the token's trades earned that are not collected yet. They count in the pool now and reach its credit once collected."
      >
        <span class="flex min-w-0 items-center gap-1.5">
          <span aria-hidden="true" class="size-1.5 shrink-0 rounded-full bg-brand motion-safe:animate-pulse" />From
          trades, being collected
        </span>
        <span class="font-mono text-foreground/85 figures">{{ usd(collected) }}</span>
      </p>
    </div>

    <p class="flex min-w-0 items-center justify-between gap-3 border-t px-5 py-2 text-[0.75rem]">
      <span class="truncate text-muted-foreground">Latest fees paid in</span>
      <span class="shrink-0 text-quiet">None yet</span>
    </p>

    <div class="mt-auto flex flex-col gap-2 border-t px-5 py-3">
      <div aria-hidden="true" class="flex h-1 gap-0.5 overflow-hidden rounded-full">
        <span class="bg-brand" style="width: 60%" />
        <span class="bg-foreground/70" style="width: 20%" />
        <span class="bg-brand/45" style="width: 20%" />
      </div>
      <p class="text-[0.72rem] text-quiet figures">
        Token's share: 60% pool, 20% creator, 20% Mathlana
      </p>
    </div>
  </section>
</template>
