<script setup>
/**
 * The live quantum-machine roster on the about page, set as a compact ruled
 * ledger. The first five machines keep the section to an index-like height;
 * anything beyond them is counted in the trailing "+N more" note, as on the
 * reference.
 */
import { computed } from "vue";
import CardArt from "@/components/art/CardArt.vue";
import MachineLogo from "@/components/art/MachineLogo.vue";

const props = defineProps({
  machines: { type: Array, required: true },
});

/** Official page per machine, matching the reference's outbound links. */
const HREFS = {
  "IBM Kingston": "https://quantum.cloud.ibm.com/computers?system=ibm_kingston",
  "IBM Marrakesh": "https://quantum.cloud.ibm.com/computers?system=ibm_marrakesh",
  "Rigetti Cepheus-1-108Q": "https://www.rigetti.com/what-we-build",
  "IQM Emerald":
    "https://aws.amazon.com/blogs/quantum-computing/amazon-braket-launches-new-54-qubit-superconducting-quantum-processor-from-iqm/",
  "IQM Garnet": "https://aws.amazon.com/braket/quantum-computers/iqm/",
  "IonQ Forte 1": "https://ionq.com/quantum-systems/forte",
  "AQT IBEX Q1": "https://www.aqt.eu/products/ibex-q1/",
};

/**
 * Group by maker and interleave: one machine per maker first, in the order the
 * makers appear, then their second machines, and so on. This is the order the
 * reference renders (IBM Kingston, Rigetti Cepheus-1, IQM Emerald, …).
 */
const ordered = computed(() => {
  const makers = [];
  const buckets = new Map();
  for (const machine of props.machines) {
    if (!buckets.has(machine.maker)) {
      buckets.set(machine.maker, []);
      makers.push(machine.maker);
    }
    buckets.get(machine.maker).push(machine);
  }
  const out = [];
  for (let round = 0; out.length < props.machines.length; round += 1) {
    for (const maker of makers) {
      const machine = buckets.get(maker)[round];
      if (machine) out.push(machine);
    }
  }
  // "Cepheus-1-108Q" reads as "Cepheus-1" on the chip.
  return out.map((machine) => ({
    ...machine,
    label: machine.model.replace(/-\d+Q$/, ""),
    href: HREFS[`${machine.maker} ${machine.model}`] ?? machine.url ?? null,
  }));
});

/** Rows kept in the short index; the rest roll into the count note. */
const visibleCount = 4;

const hiddenCount = computed(() => Math.max(0, ordered.value.length - visibleCount));

/**
 * Label for the trailing note. When everything fits, the note stays in the DOM
 * (hidden) at the full-count width so the ledger rhythm does not shift.
 */
const moreLabel = computed(() =>
  hiddenCount.value > 0 ? hiddenCount.value : ordered.value.length,
);
</script>

<template>
  <div class="cq-machine">
    <p class="cq-h4 cq-machine__title">Running quantum computers:</p>

    <ul class="cq-machine__list">
      <li
        v-for="(machine, index) in ordered"
        :key="`${machine.maker}-${machine.model}`"
        class="cq-machine__item"
        :class="{ 'cq-machine__item--hidden': index >= visibleCount }"
      >
        <a
          :href="machine.href"
          target="_blank"
          rel="noopener noreferrer"
          data-machine="true"
          data-chip
          :aria-label="`${machine.maker} ${machine.label}, its official page (opens in a new tab)`"
          class="cq-machine__chip"
        >
          <MachineLogo :maker="machine.maker" class="cq-machine__logo" />
          <span class="cq-machine__label">{{ machine.label }}</span>
          <span aria-hidden="true" class="cq-machine__art">
            <CardArt name="badge" />
          </span>
        </a>
      </li>
    </ul>

    <span
      data-more
      class="cq-machine__more"
      :class="{ 'cq-machine__more--empty': hiddenCount === 0 }"
      >+{{ moreLabel }} more</span
    >
  </div>
</template>

<style scoped>
.cq-machine {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.cq-machine__title {
  color: var(--cq-muted);
}

.cq-machine__list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}

.cq-machine__item {
  min-width: 0;
}

.cq-machine__item--hidden {
  display: none;
}

.cq-machine__chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  max-width: 100%;
  min-height: 34px;
  padding: 6px 10px;
  border: 1px solid var(--cq-line);
  border-radius: 999px;
  background: var(--cq-sheet);
  color: var(--cq-ink-soft);
  transition: border-color var(--cq-fast) var(--cq-ease), background-color var(--cq-fast) var(--cq-ease);
}

.cq-machine__chip:hover,
.cq-machine__chip:focus-visible {
  border-color: var(--cq-accent-line);
  background: var(--cq-sheet-soft);
}

.cq-machine__logo {
  width: auto;
  height: 11px;
  max-width: 54px;
  flex-shrink: 0;
  overflow: visible;
  filter: grayscale(1);
  opacity: 0.9;
}

.cq-machine__label {
  min-width: 0;
  font-family: var(--cq-mono);
  font-size: 0.72rem;
  line-height: 1.3;
  letter-spacing: 0.01em;
  color: var(--cq-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cq-machine__art {
  display: block;
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  color: var(--cq-accent-text);
  opacity: 0.55;
}

.cq-machine__art :deep(svg) {
  width: 100%;
  height: 100%;
}

.cq-machine__more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding-top: 2px;
  font-family: var(--cq-mono);
  font-size: 0.68rem;
  line-height: 1.4;
  letter-spacing: 0.04em;
  color: var(--cq-muted);
}

.cq-machine__more::before {
  content: "";
  width: 14px;
  height: 1px;
  background: var(--cq-line-strong);
}

.cq-machine__more--empty {
  display: none;
}
</style>
