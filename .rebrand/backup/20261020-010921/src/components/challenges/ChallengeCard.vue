<script setup>
/**
 * One open challenge on `/challenges`: a title row, the one-line brief, and a
 * divided list of its metric rows. Q-Day is the odd one out — its single row is
 * a link through to `/q-day` rather than a scored metric.
 */
import { computed } from "vue";
import { RouterLink } from "vue-router";
import ChallengeIcon from "@/components/challenges/ChallengeIcon.vue";
import Icon from "@/components/ui/Icon.vue";
import {
  challengeAsks,
  metricDirection,
  metricFootnote,
  metricValue,
  recordLabel,
  recordValue,
} from "@/components/challenges/presentation";

const props = defineProps({
  challenge: { type: Object, required: true },
  /** Display details the registry does not carry (icon, host, record label…). */
  copy: { type: Object, required: true },
});

const href = computed(() => props.copy.href ?? `/challenges/${props.challenge.slug}`);

/** Q-Day shows a clock, not a record: one link row to `/q-day`. */
const clock = computed(() =>
  props.challenge.slug === "q-day" ? props.challenge.metrics[0] : null,
);

/** Everything else renders the standard metric row. */
const rows = computed(() =>
  props.challenge.metrics.map((metric) => ({
    metric,
    value: metricValue(metric),
    footnote: metricFootnote(metric),
    direction: metricDirection(metric),
    record: metric.record
      ? { label: recordLabel(metric), value: recordValue(metric) }
      : null,
  })),
);
</script>

<template>
  <article class="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card">
    <div class="flex flex-col gap-1.5 px-5 pt-4 pb-4">
      <div class="flex items-center justify-between gap-3">
        <RouterLink
          :to="href"
          class="group/title flex min-w-0 items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ChallengeIcon :name="copy.icon" class="shrink-0 size-4 text-brand-text" />
          <h3
            class="truncate font-heading text-lg font-semibold tracking-[-0.015em] transition-colors group-hover/title:text-brand-text"
          >
            {{ challenge.name }}
          </h3>
          <span v-if="copy.hostLabel" class="hidden shrink-0 text-xs text-muted-foreground sm:inline">{{
            copy.hostLabel
          }}</span>
        </RouterLink>
        <RouterLink
          :to="href"
          class="flex shrink-0 items-center gap-1 text-[0.8rem] font-medium text-brand-text outline-none hover:underline focus-visible:underline"
          >Open<Icon name="arrow-right" class="size-3.5"
        /></RouterLink>
      </div>
      <p class="text-[0.82rem] leading-relaxed text-pretty text-muted-foreground">
        {{ challengeAsks(challenge) }}
      </p>
    </div>

    <ul class="mt-auto flex flex-col divide-y border-t">
      <!-- Q-Day: the clock, one link row. -->
      <li v-if="clock">
        <RouterLink
          :to="href"
          :aria-label="copy.clockAriaLabel"
          class="group/row grid grid-cols-[1.125rem_minmax(0,1fr)_auto] items-start gap-x-3 px-5 py-3.5 transition-colors outline-none hover:bg-accent/50 focus-visible:bg-accent/50"
        >
          <ChallengeIcon :name="copy.icon" class="shrink-0 mt-0.5 size-4 text-brand-text" />
          <span class="flex min-w-0 flex-col gap-0.5">
            <span class="truncate font-heading text-sm font-semibold tracking-[-0.01em]">{{
              clock.label
            }}</span>
            <span class="truncate text-xs text-muted-foreground">{{ clock.description }}</span>
          </span>
          <span
            class="col-span-2 col-start-2 mt-2 flex items-center gap-3 sm:col-span-1 sm:col-start-auto sm:mt-0"
          >
            <span
              class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 sm:flex-col sm:flex-nowrap sm:items-end sm:text-right [&>span]:whitespace-nowrap"
            >
              <span class="flex items-baseline gap-1.5">
                <span
                  class="font-mono text-[0.95rem] leading-none font-medium text-brand-text figures"
                  >{{ clock.value }} {{ clock.unit }}</span
                >
                <span class="text-xs text-muted-foreground">of {{ clock.of }}</span>
              </span>
              <span class="text-[0.7rem] text-muted-foreground">{{ clock.note }}</span>
            </span>
            <Icon
              name="arrow-up-right"
              class="hidden size-3.5 text-muted-foreground transition-colors group-hover/row:text-brand-text sm:block"
            />
          </span>
        </RouterLink>
      </li>

      <!-- Open challenges: label, description, value and the rail underneath. -->
      <li
        v-for="row in clock ? [] : rows"
        :key="row.metric.label"
        class="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2.5 px-5 py-3.5"
      >
        <div class="col-span-2 min-w-0 sm:col-span-1">
          <p class="truncate text-sm font-medium">{{ row.metric.label }}</p>
          <p class="truncate text-xs text-muted-foreground">{{ row.metric.description }}</p>
        </div>
        <div
          class="col-span-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 sm:col-span-1 sm:flex-col sm:flex-nowrap sm:items-end sm:text-right [&>p]:whitespace-nowrap"
        >
          <p class="flex items-baseline gap-1.5">
            <span class="font-mono text-base leading-none font-medium figures">{{ row.value }}</span>
            <span class="text-xs text-muted-foreground">{{ row.metric.unit }}</span>
          </p>
          <p class="text-[0.7rem] text-muted-foreground">{{ copy.recordType }}</p>
        </div>
        <div class="col-span-2 flex flex-col gap-1.5">
          <span aria-hidden="true" class="h-1 overflow-hidden rounded-full bg-muted">
            <span
              class="block h-full rounded-full bg-brand"
              :style="{ width: `${Math.round(row.metric.progress)}%` }"
            />
          </span>
          <div
            class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[0.7rem] text-muted-foreground"
          >
            <span class="font-mono whitespace-nowrap figures">{{ row.footnote }}</span>
            <span v-if="row.record" class="whitespace-nowrap"
              >{{ row.record.label }}
              <span class="font-mono figures">{{ row.record.value }}</span></span
            >
            <span class="flex items-center gap-3 whitespace-nowrap">
              <span>{{ row.direction }}</span>
              <a
                :href="copy.leaderboard"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1 hover:text-foreground"
                >Official leaderboard<Icon name="external-link" class="size-3"
              /></a>
            </span>
          </div>
        </div>
      </li>
    </ul>
  </article>
</template>
