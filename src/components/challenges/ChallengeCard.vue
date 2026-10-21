<script setup>
/**
 * One open challenge on `/challenges`: a ruled ledger row with the name and
 * brief, the verb tag, the scale metric, and the way in. Q-Day is the odd one
 * out — its single row is a link through to `/q-day` rather than a scored metric.
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
  <article class="pp-ledger__row pp-crow">
    <div class="pp-crow__id">
      <div class="pp-inline pp-crow__titleline">
        <RouterLink :to="href" class="pp-crow__head">
          <ChallengeIcon :name="copy.icon" class="pp-crow__icon" />
          <h3 class="pp-h3 pp-crow__name">{{ challenge.name }}</h3>
        </RouterLink>
        <span v-if="copy.hostLabel" class="pp-tag pp-tag--sm pp-crow__host">{{ copy.hostLabel }}</span>
      </div>
      <p class="pp-small pp-crow__asks">{{ challengeAsks(challenge) }}</p>
    </div>

    <div class="pp-crow__scale">
      <!-- Q-Day: the clock, one link row. -->
      <RouterLink
        v-if="clock"
        :to="href"
        :aria-label="copy.clockAriaLabel"
        class="pp-crow__clock"
      >
        <ChallengeIcon :name="copy.icon" class="pp-crow__clockicon" />
        <span class="pp-crow__clocktext">
          <span class="pp-h3">{{ clock.label }}</span>
          <span class="pp-tiny">{{ clock.description }}</span>
        </span>
        <span class="pp-crow__clockfig">
          <span class="pp-crow__big pp-num">{{ clock.value }} {{ clock.unit }}</span>
          <span class="pp-tiny">of {{ clock.of }}</span>
          <span class="pp-tiny">{{ clock.note }}</span>
        </span>
        <Icon name="arrow-up-right" class="pp-crow__arrow" :size="14" />
      </RouterLink>

      <!-- Open challenges: label, description, value and the rail underneath. -->
      <div
        v-for="row in clock ? [] : rows"
        :key="row.metric.label"
        class="pp-crow__metric"
      >
        <div class="pp-crow__metrichead">
          <div class="pp-stack--tight pp-crow__metrictext">
            <p class="pp-h3">{{ row.metric.label }}</p>
            <p class="pp-tiny">{{ row.metric.description }}</p>
          </div>
          <p class="pp-crow__value">
            <span class="pp-num">{{ row.value }}</span>
            <span class="pp-crow__unit">{{ row.metric.unit }}</span>
          </p>
        </div>
        <p class="pp-eyebrow pp-crow__type">{{ copy.recordType }}</p>
        <span class="pp-meter pp-crow__meter" aria-hidden="true">
          <span class="pp-meter__fill" :style="{ width: `${Math.round(row.metric.progress)}%` }" />
        </span>
        <div class="pp-metric__foot pp-crow__foot">
          <span class="pp-num">{{ row.footnote }}</span>
          <span v-if="row.record" class="pp-crow__record"
            >{{ row.record.label }}
            <span class="pp-num">{{ row.record.value }}</span></span
          >
          <span class="pp-inline pp-crow__linkline">
            <span>{{ row.direction }}</span>
            <a
              :href="copy.leaderboard"
              target="_blank"
              rel="noopener noreferrer"
              class="pp-link pp-crow__board"
              >Official leaderboard<Icon name="external-link" :size="12"
            /></a>
          </span>
        </div>
      </div>
    </div>

    <div class="pp-crow__cta">
      <RouterLink :to="href" class="pp-btn pp-btn--line pp-btn--sm pp-crow__open"
        >Open<Icon name="arrow-right" :size="14"
      /></RouterLink>
    </div>
  </article>
</template>

<style scoped>
.pp-crow.pp-ledger__row {
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.35fr) auto;
  gap: clamp(18px, 3vw, 40px);
  align-items: start;
  padding: 22px 4px;
}

.pp-crow__id {
  min-width: 0;
}

.pp-crow__titleline {
  align-items: center;
  gap: 8px 10px;
}

.pp-crow__head {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.pp-crow__icon {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  color: var(--pp-accent-text);
}

.pp-crow__name {
  transition: color var(--pp-fast) var(--pp-ease);
}

.pp-crow__verb {
  border-color: var(--pp-accent-line);
  color: var(--pp-accent-text);
}

.pp-crow__host {
  text-transform: none;
  letter-spacing: 0.02em;
}

.pp-crow__metric {
  display: grid;
  gap: 0;
  min-width: 0;
}

.pp-crow__record {
  color: var(--pp-muted);
}

.pp-crow__open {
  white-space: nowrap;
}

.pp-crow__head:hover .pp-crow__name {
  color: var(--pp-accent-text);
}

.pp-crow__asks {
  max-width: 46ch;
  margin-top: 8px;
}

.pp-crow__scale {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.pp-crow__metrichead {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.pp-crow__metrictext {
  min-width: 0;
}

.pp-crow__value {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-shrink: 0;
}

.pp-crow__value .pp-num {
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1;
}

.pp-crow__unit {
  font-family: var(--pp-mono);
  font-size: 0.66rem;
  line-height: 1.3;
  letter-spacing: 0.04em;
  color: var(--pp-muted);
}

.pp-crow__type {
  margin-top: 8px;
}

.pp-crow__meter {
  width: 100%;
  margin: 8px 0 6px;
}

.pp-crow__foot {
  justify-content: space-between;
  gap: 6px 16px;
}

.pp-crow__linkline {
  gap: 12px;
}

.pp-crow__board {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.pp-crow__cta {
  justify-self: end;
}

.pp-crow__clock {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: start;
  gap: 16px;
  padding: 10px 0;
  border-top: 1px solid var(--pp-line-soft);
  border-bottom: 1px solid var(--pp-line-soft);
}

.pp-crow__clockicon {
  width: 17px;
  height: 17px;
  margin-top: 2px;
  color: var(--pp-accent-text);
}

.pp-crow__arrow {
  margin-top: 2px;
  color: var(--pp-muted);
}

.pp-crow__clocktext,
.pp-crow__clockfig {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.pp-crow__clockfig {
  justify-items: end;
  text-align: right;
}

.pp-crow__big {
  font-size: 1.3rem;
  line-height: 1;
  color: var(--pp-accent-text);
}

@media (max-width: 1024px) {
  .pp-crow.pp-ledger__row {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .pp-crow__scale {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .pp-crow.pp-ledger__row {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }

  .pp-crow__scale {
    grid-column: auto;
  }

  .pp-crow__cta {
    justify-self: start;
  }

  .pp-crow__metrichead {
    flex-direction: column;
    gap: 8px;
  }

  .pp-crow__clock {
    grid-template-columns: minmax(0, 1fr);
  }

  .pp-crow__clockfig {
    justify-items: start;
    text-align: left;
  }

  .pp-crow__clockicon,
  .pp-crow__arrow {
    display: none;
  }
}
</style>
