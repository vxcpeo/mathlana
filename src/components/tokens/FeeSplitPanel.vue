<script setup>
/** "Where its fees go": the on-chain 60/20/20 split, with a worked example. */
import { computed } from "vue";
import { LAUNCH } from "@/data/onchain";

const example = computed(() => {
  const { tradedUsd, poolUsd, creatorUsd } = LAUNCH.workedExample;
  return `On $${tradedUsd.toLocaleString("en-US")} traded: $${poolUsd.toFixed(2)} to its AI/Quantum pool, $${creatorUsd.toFixed(2)} to you.`;
});

const SPLIT = [
  { label: "AI/Quantum pool", share: 60, dot: "cq-tone-accent" },
  { label: "Qubitess", share: 20, dot: "cq-tone-muted" },
  { label: "Creator", share: 20, dot: "cq-tone-ink" },
];
</script>

<template>
  <section class="cq-sheet cq-fee" aria-labelledby="fee-title">
    <div class="cq-sheet__head cq-fee__head">
      <h2 id="fee-title" class="cq-sheet__title">Where its fees go</h2>
    </div>

    <div class="cq-fee__body">
      <div class="cq-fee__bar" aria-hidden="true">
        <span class="cq-fee__seg" style="width: 60%" />
        <span class="cq-fee__seg cq-fee__seg--b" style="width: 20%" />
        <span class="cq-fee__seg cq-fee__seg--c" style="width: 20%" />
      </div>

      <dl class="cq-fee__rows">
        <div v-for="row in SPLIT" :key="row.label" class="cq-fee__row">
          <dt class="cq-fee__label">
            <span class="cq-dot cq-fee__dot" :class="row.dot" aria-hidden="true" />{{ row.label }}
          </dt>
          <dd class="cq-num cq-fee__share">{{ row.share }}%</dd>
        </div>
      </dl>

      <p class="cq-note cq-fee__example">{{ example }}</p>
    </div>
  </section>
</template>

<style scoped>
.cq-fee {
  gap: 0;
  overflow: clip;
}

.cq-fee__head {
  padding: 16px clamp(16px, 2vw, 20px) 13px;
}

.cq-fee__body {
  display: grid;
  gap: 14px;
  padding: 16px clamp(16px, 2vw, 20px) 18px;
}

.cq-fee__bar {
  display: flex;
  height: 4px;
  overflow: clip;
}

.cq-fee__seg {
  display: block;
  height: 100%;
  background: var(--cq-accent);
}

.cq-fee__seg--b {
  background: var(--cq-ink-soft);
}

.cq-fee__seg--c {
  background: var(--cq-line-strong);
}

.cq-fee__rows {
  display: grid;
  margin: 0;
  border-top: 1px solid var(--cq-line);
}

.cq-fee__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--cq-line-soft);
}

.cq-fee__row:last-child {
  border-bottom: 0;
}

.cq-fee__label {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  font-size: 0.86rem;
  color: var(--cq-ink);
}

.cq-fee__dot {
  color: var(--cq-muted);
}

.cq-fee__share {
  font-size: 0.9rem;
  color: var(--cq-ink);
  text-align: right;
}

.cq-fee__example {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.55;
}
</style>
