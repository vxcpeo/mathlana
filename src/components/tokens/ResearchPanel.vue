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
  <section id="research" class="cq-sheet cq-session" aria-labelledby="research-title">
    <div class="cq-sheet__head cq-session__head">
      <h2 id="research-title" class="cq-sheet__title">Research</h2>
    </div>

    <div class="cq-sheet__body cq-session__body">
      <div class="cq-plate cq-session__plate">
        <div class="cq-session__state">
          <span aria-hidden="true" class="cq-dot cq-session__dot" />
          <div class="cq-session__copy">
            <p class="cq-h3">{{ headline }}</p>
            <p class="cq-small">
              The first session's chat, workbench and timeline show here, live, the moment it starts.
            </p>
          </div>
        </div>

        <div class="cq-session__progress">
          <p class="cq-body">
            Research starts after about {{ usdRound(firstAfter) }} of trading.
            {{ usdRound(traded) }} so far.
          </p>
          <div
            class="cq-meter cq-session__meter"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="Math.round(progress)"
            aria-label="Fees toward the first session"
          >
            <div class="cq-meter__fill" :style="{ width: `${progress}%` }" />
          </div>
          <p class="cq-tiny">
            Fees pay for every session. Nothing is paid in advance, so a quiet token researches less
            often, never worse.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cq-session {
  gap: 0;
  overflow: clip;
  scroll-margin-top: 120px;
}

.cq-session__head {
  padding: 16px clamp(16px, 2vw, 22px) 13px;
}

.cq-session__body {
  padding: 16px clamp(16px, 2vw, 22px) 18px;
}

.cq-session__plate {
  grid-template-columns: minmax(0, 1fr);
  gap: var(--cq-t4);
  padding: 16px 18px;
  border-top: 1px solid var(--cq-line);
  border-left: 2px solid var(--cq-accent);
  border-radius: var(--cq-radius-sm);
  background: var(--cq-sheet-soft);
}

.cq-session__state {
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr);
  align-items: start;
  gap: 12px;
}

.cq-session__dot {
  margin-top: 8px;
  color: var(--cq-line-strong);
}

.cq-session__copy {
  display: grid;
  gap: 5px;
  min-width: 0;
}

.cq-session__copy .cq-h3 {
  overflow-wrap: anywhere;
}

.cq-session__progress {
  display: grid;
  gap: 10px;
  padding-left: 22px;
  min-width: 0;
}

.cq-session__meter {
  height: 5px;
}

@media (max-width: 560px) {
  .cq-session__progress {
    padding-left: 0;
  }
}
</style>
