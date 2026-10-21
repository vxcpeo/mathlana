<script setup>
/** "Where its fees go": the on-chain 60/20/20 split, with a worked example. */
import { computed } from "vue";
import { LAUNCH } from "@/data/onchain";

const example = computed(() => {
  const { tradedUsd, poolUsd, creatorUsd } = LAUNCH.workedExample;
  return `On $${tradedUsd.toLocaleString("en-US")} traded: $${poolUsd.toFixed(2)} to its AI/Quantum pool, $${creatorUsd.toFixed(2)} to you.`;
});

const SPLIT = [
  { label: "AI/Quantum pool", share: 60, dot: "pp-tone-accent" },
  { label: "Qubitlane", share: 20, dot: "pp-tone-muted" },
  { label: "Creator", share: 20, dot: "pp-tone-ink" },
];
</script>

<template>
  <section class="pp-sec pp-fee" aria-labelledby="fee-title">
    <div class="pp-sec__head">
      <h2 id="fee-title" class="pp-h2">Where its fees go</h2>
    </div>

    <div class="pp-fee__body">
      <div class="pp-fee__bar" aria-hidden="true">
        <span class="pp-fee__seg" style="width: 60%" />
        <span class="pp-fee__seg pp-fee__seg--b" style="width: 20%" />
        <span class="pp-fee__seg pp-fee__seg--c" style="width: 20%" />
      </div>

      <table class="pp-table pp-fee__table">
        <tbody>
          <tr v-for="row in SPLIT" :key="row.label">
            <td class="pp-fee__label">
              <span class="pp-dot pp-fee__dot" :class="row.dot" aria-hidden="true" />{{ row.label }}
            </td>
            <td class="pp-table__num pp-fee__share">{{ row.share }}%</td>
          </tr>
        </tbody>
      </table>

      <p class="pp-note pp-fee__example">{{ example }}</p>
    </div>
  </section>
</template>

<style scoped>
.pp-fee {
  min-width: 0;
}

.pp-fee__body {
  display: grid;
  gap: 14px;
  max-width: 46rem;
}

.pp-fee__bar {
  display: flex;
  height: 5px;
  overflow: clip;
  border-radius: 999px;
}

.pp-fee__seg {
  display: block;
  height: 100%;
  background: var(--pp-accent);
}

.pp-fee__seg--b {
  background: var(--pp-ink-soft);
}

.pp-fee__seg--c {
  background: var(--pp-line-strong);
}

.pp-fee__table {
  border-top: 1px solid var(--pp-line);
}

.pp-fee__label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.86rem;
  color: var(--pp-ink);
}

.pp-fee__dot {
  color: var(--pp-muted);
}

.pp-fee__share {
  color: var(--pp-ink);
  font-size: 0.86rem;
}

.pp-fee__example {
  font-size: 0.78rem;
  line-height: 1.55;
}
</style>
