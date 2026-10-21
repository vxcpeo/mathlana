<script setup>
/**
 * The agent's session panel: where the chat, the workbench and the timeline
 * show up, and what still has to be paid in before the first session starts.
 */
import { computed } from "vue";
import { usd, usdRound } from "@/components/tokens/tokenSnapshot";

const props = defineProps({
  token: { type: Object, required: true },
  /** `{ neededUsd, progressPct, firstSessionAfterTradedUsd, tradedUsd }` */
  pool: { type: Object, required: true },
});

const needed = computed(() => Number(props.pool?.neededUsd ?? 0));
const firstAfter = computed(() => Number(props.pool?.firstSessionAfterTradedUsd ?? 0));
const traded = computed(() => Number(props.pool?.tradedUsd ?? 0));
const sessions = computed(() => props.token?.sessions ?? 0);

/** Share of the first session's cost the pool already holds. The reference
 *  counts only fees credited on chain, so it stays at zero until then. */
const progress = computed(() => {
  const value = Number(props.pool?.progressPct ?? 0);
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
});

const headline = computed(() =>
  needed.value > 0
    ? `Waiting for fees: ${usd(needed.value)} more in the AI/Quantum pool for the first session`
    : "Waiting for fees: its AI/Quantum pool funds the first session",
);
</script>

<template>
  <section id="research" class="flex scroll-mt-28 flex-col gap-3" aria-labelledby="research-title">
    <div class="flex min-w-0 items-center justify-between gap-3">
      <div class="flex min-w-0 items-center gap-3">
        <h2 id="research-title" class="headline text-xl whitespace-nowrap">Research</h2>
      </div>
    </div>

    <div class="flex flex-col gap-3 rounded-xl border bg-card p-5">
      <div class="flex items-start gap-3">
        <span class="relative mt-1.5 flex size-2 shrink-0" aria-hidden="true">
          <span class="relative size-2 rounded-full border border-muted-foreground" />
        </span>
        <div class="flex min-w-0 flex-col gap-1">
          <p class="font-heading text-base font-semibold tracking-[-0.01em] text-pretty">
            {{ headline }}
          </p>
          <p class="text-sm text-pretty text-muted-foreground">
            The first session's chat, workbench and timeline show here, live, the moment it starts.
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-2 pl-5">
        <p class="text-sm text-muted-foreground">
          Research starts after about {{ usdRound(firstAfter) }} of trading.
          {{ usdRound(traded) }} so far.
        </p>
        <div
          class="h-1.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="Math.round(progress)"
          aria-label="Fees toward the first session"
        >
          <div class="h-full rounded-full bg-brand" :style="{ width: `${progress}%` }" />
        </div>
        <p class="text-xs text-quiet">
          Fees pay for every session. Nothing is paid in advance, so a quiet token researches less
          often, never worse.
        </p>
      </div>
    </div>
  </section>
</template>
