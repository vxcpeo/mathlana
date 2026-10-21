<script setup>
/**
 * The live wire: the quantum-computer readout printed as a ruled dateline under
 * the masthead. The machine window is fixed to the first five online systems and
 * only the highlight advances, so the line never reflows while it animates.
 */
import { computed, onMounted, onUnmounted, ref } from "vue";
import Icon from "@/components/ui/Icon.vue";
import { useQuantumStatus } from "@/composables/useQuantumStatus";

const { state, machineCount } = useQuantumStatus();

const activeIndex = ref(0);
let timer = null;

const online = computed(() => state.value.machines.filter((m) => m.online !== false));

/** The five systems always shown, with the rotating highlight. */
const visible = computed(() =>
  online.value.slice(0, 5).map((m, i) => ({ ...m, highlighted: i === activeIndex.value % 5 })),
);

onMounted(() => {
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % 5;
  }, 3200);
});

onUnmounted(() => timer && clearInterval(timer));

const label = computed(() =>
  state.value.status === "live"
    ? `Live quantum computer stats: ${machineCount.value} running instances`
    : "Live quantum computer stats",
);
</script>

<template>
  <section :aria-label="label" class="pp-wire">
    <span class="pp-wire__label">
      <Icon name="atom" :size="14" class="pp-accent" />
      <span class="pp-wire__title">Live quantum computer stats</span>
    </span>

    <span class="pp-wire__item">
      <span class="pp-dot pp-dot--live pp-live-pulse" aria-hidden="true" />
      <span v-if="state.status === 'live'">
        <span class="pp-wire__count pp-num">{{ machineCount }} running instances</span>
      </span>
      <span v-else>Connecting</span>
    </span>

    <span class="pp-wire__rule" aria-hidden="true" />

    <div class="pp-wire__track">
      <span
        v-for="machine in visible"
        :key="`${machine.maker}-${machine.model}`"
        class="pp-wire__item"
        :class="{ 'pp-wire__item--on': machine.highlighted }"
      >
        <span aria-hidden="true" class="pp-dot" :class="machine.highlighted ? 'pp-dot--live' : ''" />
        <a
          v-if="machine.url"
          :href="machine.url"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`${machine.maker} ${machine.model}, its official page (opens in a new tab)`"
          >{{ machine.model }}</a
        >
        <span v-else class="pp-wire__name">{{ machine.model }}</span>
        <span class="pp-wire__qubits pp-num">{{ machine.qubits }} qubits</span>
      </span>
    </div>
  </section>
</template>
