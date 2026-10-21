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
  <section aria-labelledby="pool-title" class="pp-sheet pp-pool">
    <div class="pp-sheet__head">
      <span aria-hidden="true" class="pp-art pp-sheet__art">
        <CardArt name="orbit" />
      </span>

      <h2 id="pool-title" class="pp-sheet__title pp-inline">
        <AiQuantumIcon class="pp-pool__mark pp-tone-accent" />AI/Quantum pool
      </h2>
      <p class="pp-sheet__sub">Pays for its AI agent, quantum runs and computer time.</p>
    </div>

    <div class="pp-sheet__body">
      <div class="pp-pool__figure">
        <p class="pp-h4">In the pool now</p>
        <p class="pp-figure pp-num pp-pool__amount">{{ usd(inPool) }}</p>
      </div>

      <dl class="pp-pool__facts">
        <div class="pp-kv">
          <dt class="pp-kv__k">Paid in by fees</dt>
          <dd class="pp-kv__v">{{ usd(paidIn) }}</dd>
        </div>
        <div class="pp-kv">
          <dt class="pp-kv__k">Spent</dt>
          <dd class="pp-kv__v">{{ usd(spent) }}</dd>
        </div>
      </dl>

      <div
        aria-hidden="true"
        class="pp-meter pp-pool__spent"
        title="How much of what was paid in is spent"
      >
        <span class="pp-meter__fill" :style="{ width: `${spentShare}%` }" />
      </div>

      <p
        class="pp-pool__trades"
        title="Fees the token's trades earned that are not collected yet. They count in the pool now and reach its credit once collected."
      >
        <span class="pp-inline pp-pool__tradeslabel">
          <span aria-hidden="true" class="pp-dot pp-dot--live pp-live-pulse" />From trades, being
          collected
        </span>
        <span class="pp-mono pp-pool__collected">{{ usd(collected) }}</span>
      </p>

      <p class="pp-kv pp-pool__latest">
        <span class="pp-kv__k">Latest fees paid in</span>
        <span class="pp-kv__v pp-tone-muted">None yet</span>
      </p>

      <div class="pp-pool__share">
        <div aria-hidden="true" class="pp-pool__bar">
          <span class="pp-pool__seg" style="width: 60%" />
          <span class="pp-pool__seg pp-pool__seg--b" style="width: 20%" />
          <span class="pp-pool__seg pp-pool__seg--c" style="width: 20%" />
        </div>
        <p class="pp-tiny">Token's share: 60% pool, 20% creator, 20% Qubitlane</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pp-pool {
  min-width: 0;
}

.pp-pool .pp-sheet__head {
  position: relative;
  overflow: clip;
}

.pp-pool .pp-sheet__sub {
  max-width: 68%;
}

.pp-pool__mark {
  font-size: 15px;
  color: var(--pp-accent-text);
}

.pp-sheet__title.pp-inline {
  gap: 8px;
}

.pp-pool__figure {
  display: grid;
  gap: 4px;
}

.pp-pool__amount {
  font-size: clamp(1.6rem, 3vw, 2rem);
  overflow-wrap: anywhere;
}

.pp-pool__facts {
  display: grid;
}

.pp-pool__spent {
  height: 5px;
}

.pp-pool__trades {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px 12px;
  font-size: 0.72rem;
  color: var(--pp-muted);
}

.pp-pool__tradeslabel {
  gap: 7px;
  min-width: 0;
}

.pp-pool__collected {
  color: var(--pp-ink);
  white-space: nowrap;
}

.pp-pool__latest {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0 0;
  border-top: 1px solid var(--pp-line-soft);
  border-bottom: 0;
}

.pp-pool__share {
  display: grid;
  gap: 8px;
  padding-top: 4px;
}

.pp-pool__bar {
  display: flex;
  height: 4px;
  overflow: clip;
  border-radius: 999px;
}

.pp-pool__seg {
  display: block;
  height: 100%;
  background: var(--pp-accent);
}

.pp-pool__seg--b {
  background: var(--pp-ink-soft);
}

.pp-pool__seg--c {
  background: var(--pp-line-strong);
}
</style>
