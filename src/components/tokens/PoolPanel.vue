<script setup>
/**
 * The token's AI/Quantum pool: what its trading fees have paid in, what the
 * agent and the quantum runs have spent, and the 60/20/20 fee split.
 */
import { computed } from "vue";
import AiQuantumIcon from "@/components/tokens/AiQuantumIcon.vue";
import CardArt from "@/components/art/CardArt.vue";
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
  <section aria-labelledby="pool-title" class="cq-sheet cq-pool">
    <div class="cq-sheet__head cq-pool__head">
      <h2 id="pool-title" class="cq-sheet__title cq-inline">
        <AiQuantumIcon class="cq-pool__mark cq-tone-accent" />AI/Quantum pool
      </h2>
      <p class="cq-sheet__sub">Pays for its AI agent, quantum runs and computer time.</p>
      <CardArt name="orbit" class="cq-pool__art" aria-hidden="true" />
    </div>

    <div class="cq-sheet__body cq-pool__body">
      <div class="cq-pool__figure">
        <p class="cq-h4">In the pool now</p>
        <p class="cq-figure cq-num cq-pool__amount">{{ usd(inPool) }}</p>
      </div>

      <dl class="cq-pool__facts">
        <div class="cq-kv">
          <dt class="cq-kv__k">Paid in by fees</dt>
          <dd class="cq-kv__v">{{ usd(paidIn) }}</dd>
        </div>
        <div class="cq-kv">
          <dt class="cq-kv__k">Spent</dt>
          <dd class="cq-kv__v">{{ usd(spent) }}</dd>
        </div>
      </dl>

      <div
        aria-hidden="true"
        class="cq-meter cq-pool__spent"
        title="How much of what was paid in is spent"
      >
        <span class="cq-meter__fill" :style="{ width: `${spentShare}%` }" />
      </div>

      <p
        class="cq-pool__trades"
        title="Fees the token's trades earned that are not collected yet. They count in the pool now and reach its credit once collected."
      >
        <span class="cq-inline cq-pool__tradeslabel">
          <span aria-hidden="true" class="cq-dot cq-dot--live cq-live-pulse" />From trades, being
          collected
        </span>
        <span class="cq-mono cq-pool__collected">{{ usd(collected) }}</span>
      </p>

      <p class="cq-kv cq-pool__latest">
        <span class="cq-kv__k">Latest fees paid in</span>
        <span class="cq-kv__v cq-tone-muted">None yet</span>
      </p>

      <div class="cq-pool__share">
        <div aria-hidden="true" class="cq-pool__bar">
          <span class="cq-pool__seg" style="width: 60%" />
          <span class="cq-pool__seg cq-pool__seg--b" style="width: 20%" />
          <span class="cq-pool__seg cq-pool__seg--c" style="width: 20%" />
        </div>
        <p class="cq-tiny">Token's share: 60% pool, 20% creator, 20% Qubitess</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cq-pool {
  gap: 0;
  overflow: clip;
}

.cq-pool__head {
  gap: 5px;
  padding: 16px clamp(16px, 2vw, 20px) 13px;
}

.cq-pool__head .cq-sheet__sub {
  max-width: 34ch;
  font-style: normal;
}

.cq-pool__mark {
  font-size: 15px;
  color: var(--cq-accent-text);
}

.cq-sheet__title.cq-inline {
  gap: 8px;
}

.cq-pool__body {
  gap: 14px;
  padding: 16px clamp(16px, 2vw, 20px) 18px;
}

.cq-pool__figure {
  display: grid;
  gap: 4px;
}

.cq-pool__amount {
  font-size: clamp(1.6rem, 3vw, 2rem);
  overflow-wrap: anywhere;
}

.cq-pool__facts {
  display: grid;
  margin: 0;
}

.cq-pool__facts .cq-kv {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 0;
}

.cq-pool__spent {
  height: 4px;
}

.cq-pool__trades {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px 12px;
  font-size: 0.72rem;
  color: var(--cq-muted);
}

.cq-pool__tradeslabel {
  gap: 7px;
  min-width: 0;
}

.cq-pool__collected {
  color: var(--cq-ink);
  white-space: nowrap;
}

.cq-pool__latest {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin: 0;
  padding: 9px 0 0;
  border-top: 1px solid var(--cq-line-soft);
  border-bottom: 0;
}

.cq-pool__share {
  display: grid;
  gap: 8px;
  padding-top: 4px;
}

.cq-pool__bar {
  display: flex;
  height: 4px;
  overflow: clip;
}

.cq-pool__seg {
  display: block;
  height: 100%;
  background: var(--cq-accent);
}

.cq-pool__seg--b {
  background: var(--cq-ink-soft);
}

.cq-pool__seg--c {
  background: var(--cq-line-strong);
}
</style>
