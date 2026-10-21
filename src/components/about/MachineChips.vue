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
  <div class="pp-machine">
    <p class="pp-h4 pp-machine__title">Running quantum computers:</p>

    <ul class="pp-machine__list">
      <li
        v-for="(machine, index) in ordered"
        :key="`${machine.maker}-${machine.model}`"
        class="pp-machine__item"
        :class="{ 'pp-machine__item--hidden': index >= visibleCount }"
      >
        <a
          :href="machine.href"
          target="_blank"
          rel="noopener noreferrer"
          data-machine="true"
          data-chip
          :aria-label="`${machine.maker} ${machine.label}, its official page (opens in a new tab)`"
          class="pp-machine__row"
        >
          <MachineLogo :maker="machine.maker" class="pp-machine__logo" />
          <span class="pp-machine__label">{{ machine.label }}</span>
          <span aria-hidden="true" class="pp-machine__art">
            <CardArt name="badge" />
          </span>
        </a>
      </li>
    </ul>

    <span
      data-more
      class="pp-machine__more"
      :class="{ 'pp-machine__more--empty': hiddenCount === 0 }"
      >+{{ moreLabel }} more</span
    >
  </div>
</template>

<style scoped>
.pp-machine {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.pp-machine__title {
  color: var(--pp-ink-soft);
}

.pp-machine__list {
  display: grid;
  border-top: 1px solid var(--pp-line);
}

.pp-machine__item {
  min-width: 0;
  border-bottom: 1px solid var(--pp-line-soft);
}

.pp-machine__item--hidden {
  display: none;
}

.pp-machine__row {
  display: grid;
  grid-template-columns: 60px minmax(0, 1fr) 16px;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 35px;
  padding: 7px 2px;
  color: var(--pp-ink-soft);
}

.pp-machine__logo {
  width: auto;
  height: 14px;
  max-width: 60px;
  flex-shrink: 0;
  overflow: visible;
  filter: grayscale(1);
  opacity: 0.9;
}

.pp-machine__label {
  min-width: 0;
  font-family: var(--pp-mono);
  font-size: 0.79rem;
  line-height: 1.3;
  letter-spacing: 0.01em;
  color: var(--pp-ink);
  overflow-wrap: anywhere;
  transition: color var(--pp-fast) var(--pp-ease);
}

.pp-machine__row:hover .pp-machine__label {
  color: var(--pp-accent-text);
}

.pp-machine__art {
  display: block;
  width: 16px;
  height: 16px;
  color: var(--pp-accent-text);
  opacity: 0.6;
}

.pp-machine__art :deep(svg) {
  width: 100%;
  height: 100%;
}

.pp-machine__more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding-top: 2px;
  font-family: var(--pp-mono);
  font-size: 0.68rem;
  line-height: 1.4;
  letter-spacing: 0.04em;
  color: var(--pp-muted);
}

.pp-machine__more::before {
  content: "";
  width: 14px;
  height: 1px;
  background: var(--pp-line-strong);
}

.pp-machine__more--empty {
  display: none;
}

@media (max-width: 560px) {
  .pp-machine__row {
    grid-template-columns: 48px minmax(0, 1fr) 14px;
    gap: 8px;
    padding: 6px 0;
  }

  .pp-machine__logo {
    max-width: 48px;
    height: 12px;
  }

  .pp-machine__label {
    font-size: 0.68rem;
  }

  .pp-machine__art {
    width: 14px;
    height: 14px;
  }
}
</style>
