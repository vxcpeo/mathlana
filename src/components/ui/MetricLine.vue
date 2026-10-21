<script setup>
/**
 * A metric line for the blueprint ledger: label, description, a large value with
 * its unit on the right, a cobalt progress rail and a footnote row.
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
  <div class="pp-metric" :class="muted ? 'pp-metric--muted' : ''">
    <div class="pp-metric__top">
      <div class="pp-metric__text">
        <p class="pp-metric__label">{{ label }}</p>
        <p v-if="description" class="pp-metric__desc">{{ description }}</p>
      </div>
      <div class="pp-metric__readout">
        <p class="pp-metric__value">
          <span class="pp-num">{{ display }}</span>
          <span v-if="unit" class="pp-metric__unit">{{ unit }}</span>
        </p>
        <p v-if="note" class="pp-metric__note">{{ note }}</p>
      </div>
    </div>

    <div v-if="progress !== null" class="pp-meter pp-metric__meter">
      <div
        class="pp-meter__fill"
        :style="{ width: `${Math.max(0, Math.min(100, progress))}%` }"
      />
    </div>

    <div
      v-if="from || delta || direction || leaderboard"
      class="pp-metric__foot"
    >
      <span v-if="from">{{ from }}</span>
      <span v-if="delta" class="pp-metric__delta">{{ delta }}</span>
      <span v-if="direction" class="pp-metric__dir"
        >{{ direction === "lower" ? "Lower" : "Higher" }} is better</span
      >
      <a
        v-if="leaderboard"
        href="#"
        class="pp-link pp-metric__board"
        >Official leaderboard<sup aria-hidden="true">↗</sup></a
      >
    </div>
  </div>
</template>
