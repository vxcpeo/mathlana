<script setup>
/**
 * "Where the fees go" — the on-chain fee split, read from `LAUNCH.feeShare`
 * so the bars and the percentages can never drift from the program.
 */
import { computed } from "vue";
import CardArt from "@/components/art/CardArt.vue";
import PanelCard from "@/components/ui/PanelCard.vue";
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
    dot: "pp-fee__fill--pool",
    bps: aiQuantumPoolBps,
  },
  { label: "Qubitlane, the platform", dot: "pp-fee__fill--platform", bps: platformBps },
  { label: "You, the creator", dot: "pp-fee__fill--creator", bps: creatorBps },
]);

const workedExample = `On $${LAUNCH.workedExample.tradedUsd.toLocaleString("en-US")} traded: $${LAUNCH.workedExample.poolUsd.toFixed(2)} to its AI/Quantum pool, $${LAUNCH.workedExample.creatorUsd.toFixed(2)} to you.`;
</script>

<template>
  <PanelCard class="pp-fee">
    <template #art>
      <span aria-hidden="true" class="pp-art pp-fee__art">
        <CardArt name="figure" />
      </span>
    </template>

    <template #header>
      <p class="pp-sheet__title">Where the fees go</p>
      <p class="pp-sheet__sub">Of the token's share of every trade's fee, locked on chain:</p>
    </template>

    <div class="pp-sheet__body pp-fee__body">
      <div class="pp-fee__bar" aria-hidden="true">
        <span
          v-for="row in rows"
          :key="row.label"
          class="pp-fee__seg"
          :class="row.dot"
          :style="{ width: share(row.bps) }"
        ></span>
      </div>
      <ul class="pp-fee__list">
        <li v-for="row in rows" :key="row.label" class="pp-fee__row">
          <span class="pp-fee__name">
            <span class="pp-fee__key" :class="row.dot" aria-hidden="true"></span>
            <span class="pp-fee__label">{{ row.label }}</span>
          </span>
          <span class="pp-fee__pc pp-num">{{ percent(row.bps) }}%</span>
        </li>
      </ul>
    </div>

    <p class="pp-fee__note pp-tiny">{{ workedExample }}</p>
  </PanelCard>
</template>

<style scoped>
.pp-fee {
  min-width: 0;
}

.pp-fee .pp-fee__art {
  position: absolute;
  top: 0;
  right: 0;
  width: 58%;
  height: 92px;
  overflow: clip;
  opacity: 0.22;
  pointer-events: none;
}

.pp-fee__body {
  gap: var(--pp-t2);
}

.pp-fee__bar {
  display: flex;
  gap: 3px;
  height: 8px;
  overflow: hidden;
  border-radius: 0;
  background: var(--pp-line-soft);
}

.pp-fee__seg {
  display: block;
  height: 100%;
}

.pp-fee__fill--pool {
  background: var(--pp-accent);
}

.pp-fee__fill--platform {
  background: color-mix(in srgb, var(--pp-accent) 42%, var(--pp-sheet));
}

.pp-fee__fill--creator {
  background: var(--pp-line-strong);
}

.pp-fee__list {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.pp-fee__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.pp-fee__name {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-size: 0.78rem;
  color: var(--pp-muted);
}

.pp-fee__key {
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  border-radius: 0;
}

.pp-fee__label {
  min-width: 0;
  overflow-wrap: anywhere;
}

.pp-fee__pc {
  flex: 0 0 auto;
  font-size: 0.76rem;
  color: var(--pp-ink);
}

.pp-fee__note {
  padding: 10px 0 0;
  border-top: 1px solid var(--pp-line);
  background: transparent;
}
</style>
