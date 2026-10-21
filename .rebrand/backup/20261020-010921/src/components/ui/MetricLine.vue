<script setup>
/**
 * A metric line: label, description, a big value + unit, and a progress rail
 * underneath. Used by the home threat panels and the challenges index.
 */
import { computed } from "vue";
import { group } from "@/lib/format";

const props = defineProps({
  label: { type: String, required: true },
  description: { type: String, default: null },
  value: { type: [Number, String], required: true },
  unit: { type: String, default: null },
  /** 0-100, drives the rail. */
  progress: { type: Number, default: null },
  /** Footnote under the rail, left (e.g. "from 74,113,492"). */
  from: { type: String, default: null },
  /** Footnote under the rail, right (e.g. "49.6% smaller"). */
  delta: { type: String, default: null },
  /** "Lower is better" / "Higher is better". */
  direction: { type: String, default: null },
  leaderboard: { type: Boolean, default: false },
  /** Small badge to the right of the value ("No token on it yet"). */
  note: { type: String, default: null },
  noteTone: { type: String, default: "quiet" },
  /** Dim the whole row (used for "Next" / "Later" challenges). */
  muted: { type: Boolean, default: false },
});

const display = computed(() =>
  typeof props.value === "number" ? group(props.value) : props.value,
);
</script>

<template>
  <div class="flex flex-col gap-1.5" :class="muted ? 'opacity-55' : ''">
    <div class="flex items-start gap-3">
      <div class="flex min-w-0 flex-col">
        <p class="font-heading text-sm font-semibold text-foreground">{{ label }}</p>
        <p v-if="description" class="text-xs text-muted-foreground">{{ description }}</p>
      </div>
      <div class="ml-auto flex shrink-0 flex-col items-end">
        <p class="flex items-baseline gap-1.5">
          <span class="font-heading text-lg leading-none font-semibold text-foreground">{{
            display
          }}</span>
          <span v-if="unit" class="text-xs text-muted-foreground">{{ unit }}</span>
        </p>
        <p v-if="note" class="mt-0.5 text-[0.7rem] text-quiet-text">{{ note }}</p>
      </div>
    </div>

    <div v-if="progress !== null" class="h-1 w-full overflow-hidden rounded-full bg-muted">
      <div
        class="h-full rounded-full bg-brand transition-[width] duration-700"
        :style="{ width: `${Math.max(0, Math.min(100, progress))}%` }"
      />
    </div>

    <div
      v-if="from || delta || direction || leaderboard"
      class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[0.7rem] text-muted-foreground"
    >
      <span v-if="from" class="text-quiet-text">{{ from }}</span>
      <span v-if="delta" class="ml-auto text-quiet-text">{{ delta }}</span>
      <span v-if="direction" class="text-quiet-text"
        >{{ direction === "lower" ? "Lower" : "Higher" }} is better</span
      >
      <a
        v-if="leaderboard"
        href="#"
        class="inline-flex items-center gap-1 text-quiet-text underline-offset-4 hover:text-foreground hover:underline"
        >Official leaderboard<sup aria-hidden="true">↗</sup></a
      >
    </div>
  </div>
</template>
