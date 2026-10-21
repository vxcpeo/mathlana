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
    dot: "cq-fee__fill--pool",
    bps: aiQuantumPoolBps,
  },
  { label: "Qubitess, the platform", dot: "cq-fee__fill--platform", bps: platformBps },
  { label: "You, the creator", dot: "cq-fee__fill--creator", bps: creatorBps },
]);

const workedExample = `On $${LAUNCH.workedExample.tradedUsd.toLocaleString("en-US")} traded: $${LAUNCH.workedExample.poolUsd.toFixed(2)} to its AI/Quantum pool, $${LAUNCH.workedExample.creatorUsd.toFixed(2)} to you.`;
</script>

<template>
  <section class="cq-sheet cq-lfee">
    <header class="cq-lfee__head">
      <span aria-hidden="true" class="cq-lfee__art">
        <CardArt name="figure" />
      </span>
      <p class="cq-lfee__title">Where the fees go</p>
      <p class="cq-lfee__sub">Of the token's share of every trade's fee, locked on chain:</p>
    </header>

    <div class="cq-lfee__body">
      <div class="cq-lfee__bar" aria-hidden="true">
        <span
          v-for="row in rows"
          :key="row.label"
          class="cq-lfee__seg"
          :class="row.dot"
          :style="{ width: share(row.bps) }"
        ></span>
      </div>
      <ul class="cq-lfee__list">
        <li v-for="row in rows" :key="row.label" class="cq-lfee__row">
          <span class="cq-lfee__name">
            <span class="cq-lfee__key" :class="row.dot" aria-hidden="true"></span>
            <span class="cq-lfee__label">{{ row.label }}</span>
          </span>
          <span class="cq-lfee__pc cq-num">{{ percent(row.bps) }}%</span>
        </li>
      </ul>
    </div>

    <p class="cq-lfee__note cq-tiny">{{ workedExample }}</p>
  </section>
</template>

<style scoped>
.cq-lfee {
  position: relative;
  display: grid;
  min-width: 0;
  padding: 0;
  overflow: hidden;
  background: var(--cq-sheet);
  border-top: 1px solid var(--cq-line-strong);
  box-shadow: none;
}

.cq-lfee__head {
  position: relative;
  display: grid;
  gap: 4px;
  padding: 16px 18px 13px;
  overflow: hidden;
  border-bottom: 1px solid var(--cq-line);
}

.cq-lfee__art {
  position: absolute;
  top: 0;
  right: 0;
  width: 52%;
  height: 100%;
  overflow: clip;
  opacity: 0.18;
  pointer-events: none;
}

.cq-lfee__title {
  position: relative;
  font-family: var(--cq-display);
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--cq-ink);
}

.cq-lfee__sub {
  position: relative;
  max-width: 34ch;
  font-size: 0.77rem;
  line-height: 1.5;
  color: var(--cq-muted);
}

.cq-lfee__body {
  display: grid;
  gap: 13px;
  padding: 15px 18px 16px;
}

.cq-lfee__bar {
  display: flex;
  gap: 3px;
  height: 5px;
  overflow: hidden;
  background: var(--cq-line-soft);
}

.cq-lfee__seg {
  display: block;
  height: 100%;
}

.cq-fee__fill--pool {
  background: var(--cq-accent);
}

.cq-fee__fill--platform {
  background: color-mix(in srgb, var(--cq-accent) 42%, var(--cq-sheet));
}

.cq-fee__fill--creator {
  background: var(--cq-line-strong);
}

.cq-lfee__list {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.cq-lfee__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.cq-lfee__name {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-size: 0.74rem;
  color: var(--cq-muted);
}

.cq-lfee__key {
  width: 7px;
  height: 7px;
  flex: 0 0 auto;
}

.cq-lfee__label {
  min-width: 0;
  overflow-wrap: anywhere;
}

.cq-lfee__pc {
  flex: 0 0 auto;
  font-size: 0.72rem;
  color: var(--cq-ink);
}

.cq-lfee__note {
  padding: 11px 18px 13px;
  border-top: 1px solid var(--cq-line);
}
</style>
