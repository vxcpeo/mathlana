<script setup>
/**
 * The "Live quantum computer stats" strip under the header. One machine chip
 * is revealed at a time with a rotating highlight, matching the reference's
 * staggered reveal.
 */
import { computed, onMounted, onUnmounted, ref } from "vue";
import Icon from "@/components/ui/Icon.vue";
import { useQuantumStatus } from "@/composables/useQuantumStatus";

const { state, machineCount } = useQuantumStatus();

const activeIndex = ref(0);
let timer = null;

const online = computed(() => state.value.machines.filter((m) => m.online !== false));

/** Machines rotate through the strip; the first few are always visible. */
const visible = computed(() => {
  const all = online.value;
  if (all.length <= 5) return all.map((m, i) => ({ ...m, highlighted: i === activeIndex.value }));
  const start = activeIndex.value % all.length;
  return Array.from({ length: 5 }, (_, offset) => {
    const machine = all[(start + offset) % all.length];
    return { ...machine, highlighted: offset === 0 };
  });
});

onMounted(() => {
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % Math.max(1, online.value.length);
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
  <section :aria-label="label" class="border-t">
    <div
      class="mx-auto flex h-10 w-full max-w-7xl items-center gap-5 px-4 text-[0.8125rem] whitespace-nowrap sm:gap-6 sm:px-6"
    >
      <span class="flex shrink-0 items-center gap-2">
        <Icon name="atom" class="shrink-0 size-4 text-brand-text" />
        <span class="hidden text-xs text-muted-foreground sm:inline"
          >Live quantum computer stats</span
        >
      </span>

      <span class="flex shrink-0 items-center gap-1.5">
        <span class="size-1.5 rounded-full bg-brand-text" aria-hidden="true" />
        <span v-if="state.status === 'live'" class="text-muted-foreground">
          <span class="inline-block font-semibold text-brand-text figures"
            >{{ machineCount }} running instances</span
          >
        </span>
        <span v-else class="text-muted-foreground">Connecting</span>
      </span>

      <div class="scrollbar-none flex min-w-0 items-center gap-4 overflow-hidden sm:gap-5">
        <span
          v-for="machine in visible"
          :key="`${machine.maker}-${machine.model}`"
          class="flex shrink-0 items-center gap-2"
          :class="machine.highlighted ? 'animate-ticker-in' : ''"
        >
          <span
            aria-hidden="true"
            class="size-1.5 shrink-0 rounded-full"
            :class="machine.highlighted ? 'bg-brand-text' : 'bg-brand-text/40'"
          />
          <a
            v-if="machine.url"
            :href="machine.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`${machine.maker} ${machine.model}, its official page (opens in a new tab)`"
            class="font-medium text-foreground underline-offset-4 hover:text-brand-text hover:underline"
            >{{ machine.model }}</a
          >
          <span v-else class="font-medium text-foreground">{{ machine.model }}</span>
          <span class="text-muted-foreground figures">{{ machine.qubits }} qubits</span>
        </span>
      </div>
    </div>
  </section>
</template>
