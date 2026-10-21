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
  <section id="research" class="pp-sec pp-session" aria-labelledby="research-title">
    <div class="pp-sec__head">
      <h2 id="research-title" class="pp-h2">Research</h2>
    </div>

    <div class="pp-plate pp-session__plate">
      <div class="pp-session__state">
        <span aria-hidden="true" class="pp-dot pp-session__dot" />
        <div class="pp-session__copy">
          <p class="pp-h3">{{ headline }}</p>
          <p class="pp-small">
            The first session's chat, workbench and timeline show here, live, the moment it starts.
          </p>
        </div>
      </div>

      <div class="pp-session__progress">
        <p class="pp-body">
          Research starts after about {{ usdRound(firstAfter) }} of trading.
          {{ usdRound(traded) }} so far.
        </p>
        <div
          class="pp-meter pp-session__meter"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="Math.round(progress)"
          aria-label="Fees toward the first session"
        >
          <div class="pp-meter__fill" :style="{ width: `${progress}%` }" />
        </div>
        <p class="pp-tiny">
          Fees pay for every session. Nothing is paid in advance, so a quiet token researches less
          often, never worse.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pp-session {
  scroll-margin-top: 120px;
}

.pp-session__plate {
  grid-template-columns: minmax(0, 1fr);
  gap: var(--pp-t4);
}

.pp-session__state {
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr);
  align-items: start;
  gap: 12px;
}

.pp-session__dot {
  margin-top: 8px;
  color: var(--pp-line-strong);
}

.pp-session__copy {
  display: grid;
  gap: 5px;
  min-width: 0;
}

.pp-session__copy .pp-h3 {
  overflow-wrap: anywhere;
}

.pp-session__progress {
  display: grid;
  gap: 10px;
  padding-left: 22px;
  min-width: 0;
}

.pp-session__meter {
  height: 6px;
}

@media (max-width: 560px) {
  .pp-session__progress {
    padding-left: 0;
  }
}
</style>
