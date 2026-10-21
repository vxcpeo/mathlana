<script setup>
/**
 * One open challenge on `/challenges`: number, identity and brief on the left
 * channel, the scale record on the right channel of a full-width ledger row.
 * Q-Day is the odd one out — its single row is a link through to `/q-day`.
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
  <article class="cq-chrow">
    <div class="cq-chrow__main">
      <div class="cq-chrow__titleline">
        <RouterLink :to="href" class="cq-chrow__head">
          <ChallengeIcon :name="copy.icon" class="cq-chrow__icon" />
          <h3 class="cq-h3 cq-chrow__name">{{ challenge.name }}</h3>
        </RouterLink>
        <span v-if="copy.hostLabel" class="cq-tag cq-tag--sm cq-chrow__host">{{
          copy.hostLabel
        }}</span>
      </div>

      <p class="cq-small cq-chrow__asks">{{ challengeAsks(challenge) }}</p>

      <!-- Q-Day: the clock, one link row. -->
      <RouterLink
        v-if="clock"
        :to="href"
        :aria-label="copy.clockAriaLabel"
        class="cq-chrow__clock"
      >
        <ChallengeIcon :name="copy.icon" class="cq-chrow__clockicon" />
        <span class="cq-chrow__clocktext">
          <span class="cq-h3">{{ clock.label }}</span>
          <span class="cq-tiny">{{ clock.description }}</span>
        </span>
        <span class="cq-chrow__clockfig">
          <span class="cq-chrow__big cq-num">{{ clock.value }} {{ clock.unit }}</span>
          <span class="cq-tiny">of {{ clock.of }}</span>
          <span class="cq-tiny">{{ clock.note }}</span>
        </span>
        <Icon name="arrow-up-right" class="cq-chrow__arrow" :size="14" />
      </RouterLink>

      <!-- Open challenges: identity on the left, figure on the right. -->
      <div
        v-for="row in clock ? [] : rows"
        :key="row.metric.label"
        class="cq-chrow__metric"
      >
        <div class="cq-chrow__metriccopy">
          <div class="cq-chrow__metrictext">
            <p class="cq-h3">{{ row.metric.label }}</p>
            <p class="cq-tiny">{{ row.metric.description }}</p>
          </div>
          <p class="cq-eyebrow cq-chrow__type">{{ copy.recordType }}</p>
          <span class="cq-inline cq-chrow__linkline">
            <span>{{ row.direction }}</span>
            <a
              :href="copy.leaderboard"
              target="_blank"
              rel="noopener noreferrer"
              class="cq-link cq-chrow__board"
              >Official leaderboard<Icon name="external-link" :size="12"
            /></a>
          </span>
        </div>

        <div class="cq-chrow__readout">
          <p class="cq-chrow__value">
            <span class="cq-num">{{ row.value }}</span>
            <span class="cq-chrow__unit">{{ row.metric.unit }}</span>
          </p>
          <span class="cq-meter cq-chrow__meter" aria-hidden="true">
            <span class="cq-meter__fill" :style="{ width: `${Math.round(row.metric.progress)}%` }" />
          </span>
          <div class="cq-chrow__foot">
            <span class="cq-num">{{ row.footnote }}</span>
            <span v-if="row.record" class="cq-chrow__record"
              >{{ row.record.label }}
              <span class="cq-num">{{ row.record.value }}</span></span
            >
          </div>
        </div>
      </div>
    </div>

    <div class="cq-chrow__act">
      <RouterLink :to="href" class="cq-btn cq-btn--line cq-btn--sm cq-chrow__open"
        >Open<Icon name="arrow-right" :size="14"
      /></RouterLink>
    </div>
  </article>
</template>

<style scoped>
.cq-chrow {
  counter-increment: cqledger;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  align-items: start;
  gap: 12px clamp(16px, 2.2vw, 30px);
  padding: clamp(20px, 2.5vw, 30px) clamp(18px, 2.6vw, 32px);
  min-width: 0;
}

.cq-chrow::before {
  content: counter(cqledger, decimal-leading-zero);
  grid-column: 1;
  padding-top: 3px;
  font-family: var(--cq-mono);
  font-size: 0.68rem;
  line-height: 1.3;
  letter-spacing: 0.1em;
  color: var(--cq-accent-text);
}

.cq-chrow__main {
  grid-column: 2;
  display: grid;
  gap: 14px;
  min-width: 0;
}

.cq-chrow__titleline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 10px;
  min-width: 0;
}

.cq-chrow__head {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.cq-chrow__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--cq-accent-text);
}

.cq-chrow__name {
  font-size: clamp(1.1rem, 1.5vw, 1.32rem);
  transition: color var(--cq-fast) var(--cq-ease);
  overflow-wrap: anywhere;
}

.cq-chrow__head:hover .cq-chrow__name,
.cq-chrow__head:focus-visible .cq-chrow__name {
  color: var(--cq-accent-text);
}

.cq-chrow__host {
  text-transform: none;
  letter-spacing: 0.02em;
}

.cq-chrow__asks {
  max-width: 68ch;
  color: var(--cq-muted);
}

.cq-chrow__clock {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto 14px;
  align-items: start;
  gap: 10px 16px;
  min-width: 0;
  padding-top: 14px;
  border-top: 1px solid var(--cq-line-soft);
  color: inherit;
  text-decoration: none;
}

.cq-chrow__clockicon {
  width: 17px;
  height: 17px;
  margin-top: 2px;
  color: var(--cq-accent-text);
}

.cq-chrow__clocktext,
.cq-chrow__clockfig {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.cq-chrow__clockfig {
  justify-items: end;
  text-align: right;
}

.cq-chrow__big {
  font-family: var(--cq-display);
  font-size: clamp(1.8rem, 2.8vw, 2.4rem);
  font-weight: 650;
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: var(--cq-ink);
  white-space: nowrap;
}

.cq-chrow__arrow {
  margin-top: 3px;
  color: var(--cq-muted);
}

.cq-chrow__metric {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(210px, 0.48fr);
  align-items: start;
  gap: clamp(16px, 2.4vw, 34px);
  padding-top: 14px;
  border-top: 1px solid var(--cq-line-soft);
  min-width: 0;
}

.cq-chrow__metriccopy {
  display: grid;
  gap: 8px;
  align-content: start;
  min-width: 0;
}

.cq-chrow__metrictext {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.cq-chrow__type {
  margin-top: 1px;
}

.cq-chrow__linkline {
  gap: 8px 16px;
  font-family: var(--cq-mono);
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  color: var(--cq-muted);
}

.cq-chrow__board {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--cq-mono);
  font-size: 0.7rem;
}

.cq-chrow__readout {
  display: grid;
  justify-items: end;
  gap: 7px;
  min-width: 0;
  text-align: right;
}

.cq-chrow__value {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: flex-end;
  gap: 4px 8px;
}

.cq-chrow__value .cq-num {
  font-family: var(--cq-display);
  font-size: clamp(1.8rem, 2.8vw, 2.5rem);
  font-weight: 650;
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: var(--cq-ink);
  overflow-wrap: anywhere;
}

.cq-chrow__unit {
  font-family: var(--cq-mono);
  font-size: 0.66rem;
  line-height: 1.35;
  letter-spacing: 0.04em;
  color: var(--cq-muted);
}

.cq-chrow__meter {
  width: 100%;
  height: 5px;
}

.cq-chrow__foot {
  display: grid;
  justify-items: end;
  gap: 2px;
  font-family: var(--cq-mono);
  font-size: 0.7rem;
  line-height: 1.45;
  color: var(--cq-muted);
}

.cq-chrow__record {
  color: var(--cq-muted);
}

.cq-chrow__act {
  grid-column: 3;
  display: flex;
  justify-content: flex-end;
  padding-top: 2px;
}

.cq-chrow__open {
  white-space: nowrap;
}

@media (max-width: 900px) {
  .cq-chrow {
    grid-template-columns: 34px minmax(0, 1fr);
  }

  .cq-chrow__act {
    grid-column: 2;
    justify-content: flex-start;
  }

  .cq-chrow__metric {
    grid-template-columns: minmax(0, 1fr);
  }

  .cq-chrow__readout {
    justify-items: start;
    text-align: left;
  }

  .cq-chrow__value {
    justify-content: flex-start;
  }

  .cq-chrow__foot {
    justify-items: start;
  }
}

@media (max-width: 560px) {
  .cq-chrow {
    grid-template-columns: 28px minmax(0, 1fr);
    gap: 10px 12px;
    padding: 20px 16px;
  }

  .cq-chrow__clock {
    grid-template-columns: 18px minmax(0, 1fr);
  }

  .cq-chrow__clockfig {
    grid-column: 2;
    justify-items: start;
    text-align: left;
  }

  .cq-chrow__arrow {
    display: none;
  }
}
</style>
