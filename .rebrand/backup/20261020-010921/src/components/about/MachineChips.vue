<script setup>
/**
 * The "Running quantum computers:" chip strip on the about page.
 *
 * The reference reveals as many machine chips as fit the row and collapses the
 * rest into a "+N more" note, so the strip never wraps or scrolls. Chip widths
 * are measured after briefly laying every chip out; because the reveal and the
 * measurement happen inside the same microtask the browser never paints the
 * intermediate state.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
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

const rowRef = ref(null);
/** Starts above the roster size so the first render lays every chip out. */
const visibleCount = ref(Number.MAX_SAFE_INTEGER);
let scheduled = false;

const hiddenCount = computed(() =>
  Math.max(0, ordered.value.length - visibleCount.value),
);

/**
 * Label for the trailing note. While every chip is laid out for measuring
 * nothing is hidden, so the element stays in the DOM (invisible) at a
 * realistic width — that width is what the fit calculation has to reserve.
 */
const moreLabel = computed(() =>
  hiddenCount.value > 0 ? hiddenCount.value : ordered.value.length,
);

/** Measures the row while every chip is laid out, then keeps what fits. */
function measure() {
  const row = rowRef.value;
  const chips = row ? Array.from(row.querySelectorAll("[data-chip]")) : [];
  if (!row || !chips.length) {
    visibleCount.value = ordered.value.length;
    return;
  }

  const more = row.querySelector("[data-more]");
  const moreWidth = more ? more.getBoundingClientRect().width : 0;
  const available = row.clientWidth;
  const gap = 6; // gap-1.5

  let used = 0;
  let count = 0;
  for (let i = 0; i < chips.length; i += 1) {
    const width = chips[i].getBoundingClientRect().width;
    const next = used + (i > 0 ? gap : 0) + width;
    // While chips remain after this one, keep room for "+N more".
    const reserve = i + 1 < chips.length ? gap + moreWidth : 0;
    if (next + reserve > available) break;
    used = next;
    count = i + 1;
  }
  visibleCount.value = Math.max(1, count);
}

async function remeasure() {
  if (scheduled) return;
  scheduled = true;
  visibleCount.value = ordered.value.length; // lay every chip out
  await nextTick(); // still before the browser paints
  measure();
  scheduled = false;
}

let observer = null;

onMounted(() => {
  // Every chip is already laid out from the first render, so this can be
  // measured synchronously — the browser never paints the overflowing state.
  measure();
  if (typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(remeasure);
    if (rowRef.value) observer.observe(rowRef.value);
  } else {
    window.addEventListener("resize", remeasure);
  }
  document.fonts?.ready.then(remeasure);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  window.removeEventListener("resize", remeasure);
});

watch(ordered, () => remeasure(), { flush: "post" });
</script>

<template>
  <div class="flex min-w-0 flex-col gap-2">
    <span class="text-[0.8rem] text-muted-foreground">Running quantum computers:</span>

    <div ref="rowRef" class="flex h-7 min-w-0 items-center gap-1.5 overflow-hidden">
      <a
        v-for="(machine, index) in ordered"
        :key="`${machine.maker}-${machine.model}`"
        :href="machine.href"
        target="_blank"
        rel="noopener noreferrer"
        data-machine="true"
        data-chip
        :aria-label="`${machine.maker} ${machine.label}, its official page (opens in a new tab)`"
        class="relative h-7 shrink-0 items-center gap-2 overflow-hidden rounded-md border bg-card pr-7 pl-2.5 whitespace-nowrap transition-colors hover:border-brand-border outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        :class="index < visibleCount ? 'inline-flex' : 'hidden'"
      >
        <MachineLogo :maker="machine.maker" class="h-2.5 text-foreground" />
        <span class="font-heading text-[0.75rem] font-semibold text-foreground">
          {{ machine.label }}
        </span>
        <span
          aria-hidden="true"
          class="pointer-events-none absolute top-1/2 -right-2.5 size-7 -translate-y-1/2 text-brand [&>svg]:size-7"
        >
          <CardArt name="badge" />
        </span>
      </a>

      <span
        data-more
        class="text-[0.8rem] whitespace-nowrap text-muted-foreground"
        :class="hiddenCount > 0 ? '' : 'invisible'"
        >+{{ moreLabel }} more</span
      >
    </div>
  </div>
</template>
