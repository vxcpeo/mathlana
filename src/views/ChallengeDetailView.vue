<script setup>
/**
 * `/challenges/:slug` — one public problem: the brief, the record it defends,
 * what that record is worth, and the tokens racing on it.
 */
import { computed, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import ChallengeHero from "@/components/challenges/ChallengeHero.vue";
import MetricPanel from "@/components/challenges/MetricPanel.vue";
import StakesCard from "@/components/challenges/StakesCard.vue";
import VerbBadge from "@/components/challenges/VerbBadge.vue";
import {
  CARD_COPY,
  CHALLENGE_DETAIL,
  NOT_FOUND,
  PROXIMITY_TARGET_BITS,
  challengeAsks,
  metricDirection,
  metricPercent,
  metricStart,
  metricValue,
  recordLabel,
  recordValue,
} from "@/components/challenges/presentation";
import TokenGridCard from "@/components/tokens/TokenGridCard.vue";
import Icon from "@/components/ui/Icon.vue";
import { useMarket } from "@/composables/useMarket";
import { CHALLENGES } from "@/data/challenges";
import { TOKENS } from "@/data/tokens";

const route = useRoute();
const router = useRouter();

const slug = computed(() => String(route.params.slug ?? ""));
const challenge = computed(() => CHALLENGES.find((c) => c.slug === slug.value) ?? null);
const detail = computed(() => CHALLENGE_DETAIL[slug.value] ?? null);

/** `/challenges/q-day` is a permanent redirect to `/q-day` on the reference. */
const redirecting = computed(() => slug.value === "q-day");
watch(
  redirecting,
  (on) => {
    if (on) router.replace("/q-day");
  },
  { immediate: true },
);

/** Live market data for every token, so switching slugs needs no refetch. */
const { market } = useMarket(TOKENS.map((token) => token.mint));
const tokens = computed(() => TOKENS.filter((token) => token.challengeSlug === slug.value));

const panels = computed(() => {
  if (!challenge.value || !detail.value) return [];
  return detail.value.panels.map((panel) => {
    const metric = challenge.value.metrics[panel.metric];
    return {
      title: panel.title,
      label: metric.label,
      description: metric.description,
      direction: metricDirection(metric),
      value: metricValue(metric),
      unit: metric.unit,
      start: metricStart(metric),
      recordLabel: panel.recordLabel,
      progress: Math.round(metric.progress),
      progressLabel: panel.progressLabel ?? metricPercent(metric),
      progressRight: panel.progressRight ?? null,
      extra: panel.extraRow
        ? {
            label: recordLabel(metric),
            labelNote: panel.extraRow.labelNote,
            value: recordValue(metric),
            unit: panel.extraRow.unit,
          }
        : null,
      leaderboard: detail.value.leaderboard,
    };
  });
});

/**
 * "What's at stake". The reference has two shapes: a single card under an `h2`,
 * or — for the Proximity Prize, which is scored twice — a pair of cards under
 * `h3`s sharing one interval legend.
 */
const stakes = computed(() => {
  if (!challenge.value || !detail.value) return null;
  const copy = detail.value.stakes;
  const metrics = challenge.value.metrics;

  if (copy.kind === "single") {
    const metric = metrics[0];
    const value = metricValue(metric);
    return {
      kind: "single",
      id: copy.id,
      badge: copy.badge,
      protectsLabel: copy.protectsLabel,
      protects: copy.protects,
      value,
      unit: metric.unit,
      numberNote: copy.numberNote({
        metric,
        value,
        improvement: metricPercent(metric),
      }),
      scaleRows: copy.scaleRows({ challenge: challenge.value, metric }),
      scaleNoteAfter: copy.scaleNoteAfter?.() ?? null,
      footnote: copy.footnote,
      sourceHref: copy.sourceHref,
    };
  }

  const lower = Number(metrics[0].value);
  const upper = Number(metrics[1].value);
  return {
    kind: "bounds",
    heading: copy.heading,
    scaleIntro: copy.scaleIntro,
    scaleRows: copy.scaleRows,
    footnote: copy.footnote,
    sourceHref: copy.sourceHref,
    lowerText: metricValue(metrics[0]),
    upperText: metricValue(metrics[1]),
    provenWidth: (lower / PROXIMITY_TARGET_BITS) * 100,
    reachWidth: ((PROXIMITY_TARGET_BITS - upper) / PROXIMITY_TARGET_BITS) * 100,
    bounds: copy.bounds.map((bound) => {
      const metric = metrics[bound.metric];
      const value = metricValue(metric);
      return {
        id: bound.id,
        title: bound.title,
        badge: bound.badge,
        protectsLabel: bound.protectsLabel,
        protects: bound.protects,
        value,
        unit: metric.unit,
        numberNote: bound.numberNote({ metric, value }),
      };
    }),
  };
});

const openChallenges = CHALLENGES.filter((entry) => entry.open);
</script>

<template>
  <!-- /challenges/q-day -> /q-day -->
  <div v-if="redirecting" class="pp-page pp-redirect" />

  <div v-else-if="!challenge || !detail" class="pp-page">
    <div class="pp-head">
      <p class="pp-kicker">{{ NOT_FOUND.eyebrow }}</p>
      <h1 class="pp-runhead">{{ NOT_FOUND.title }}</h1>
      <p class="pp-lede">{{ NOT_FOUND.body }}</p>
    </div>

    <section class="pp-sec">
      <ul class="pp-ledger">
        <li v-for="entry in openChallenges" :key="entry.slug">
          <RouterLink
            :to="CARD_COPY[entry.slug].href ?? `/challenges/${entry.slug}`"
            class="pp-ledger__row pp-ledger__row--link pp-404"
          >
            <span class="pp-stack--tight">
              <span class="pp-h3">{{ entry.name }}</span>
              <span class="pp-small">{{ CARD_COPY[entry.slug].hostLabel }}</span>
            </span>
            <span class="pp-inline pp-404__open"
              >Open<Icon name="arrow-right" :size="14"
            /></span>
          </RouterLink>
        </li>
      </ul>
    </section>

    <div class="pp-band">
      <RouterLink to="/challenges" class="pp-btn pp-btn--lg">{{ NOT_FOUND.cta }}</RouterLink>
    </div>
  </div>

  <div v-else class="pp-page">
    <ChallengeHero
      :host-icon="detail.hostIcon"
      :host-label="detail.hostLabel"
      :verb="detail.verb"
      :verb-icon="detail.verbIcon"
      :verb-icon-class="detail.verbIconClass"
      :name="challenge.name"
      :asks="challengeAsks(challenge)"
      :why="detail.why ?? challenge.why ?? null"
      :track="detail.track"
      :cta-note="detail.ctaNote"
    />

    <div class="pp-stage">
      <div class="pp-wide pp-detail__metrics">
        <MetricPanel v-for="panel in panels" :key="panel.title" :panel="panel" />
      </div>

      <div class="pp-margin">
        <section
          v-for="panel in panels"
          :key="panel.title"
          class="pp-margin__block pp-facts__block"
        >
          <p class="pp-eyebrow">{{ panel.direction }}</p>

          <dl class="pp-facts__list">
            <div class="pp-kv">
              <dt class="pp-kv__k">Where it started</dt>
              <dd class="pp-kv__v">{{ panel.start }}</dd>
            </div>
            <div v-if="panel.extra" class="pp-kv">
              <dt class="pp-kv__k">
                {{ panel.extra.label }}<span class="pp-facts__dot" aria-hidden="true">·</span
                ><span class="pp-facts__note">{{ panel.extra.labelNote }}</span>
              </dt>
              <dd class="pp-kv__v">
                {{ panel.extra.value }} <span class="pp-facts__unit">{{ panel.extra.unit }}</span>
              </dd>
            </div>
          </dl>

          <p v-if="panel.progressRight" class="pp-tag pp-tag--sm pp-facts__target">
            {{ panel.progressRight }}
          </p>

          <a
            :href="panel.leaderboard"
            target="_blank"
            rel="noreferrer"
            class="pp-link pp-facts__board"
            >Official leaderboard<Icon name="external-link" :size="12"
          /></a>
        </section>
      </div>
    </div>

    <!-- What's at stake: the Proximity Prize is scored twice. -->
    <section v-if="stakes.kind === 'bounds'" class="pp-sec">
      <div class="pp-sec__head">
        <h2 class="pp-h2">{{ stakes.heading }}</h2>
      </div>

      <div class="pp-stakes__bounds">
        <section
          v-for="bound in stakes.bounds"
          :key="bound.id"
          :aria-labelledby="bound.id"
          class="pp-stakes__bound"
        >
          <div class="pp-inline pp-stakes__boundhead">
            <h3 :id="bound.id" class="pp-h3">{{ bound.title }}</h3>
            <VerbBadge v-bind="bound.badge" />
          </div>

          <StakesCard
            :protects-label="bound.protectsLabel"
            :protects="bound.protects"
            :value="bound.value"
            :unit="bound.unit"
          >
            <template #number-note>
              <p class="pp-small" v-html="bound.numberNote" />
            </template>

            <template #extra>
              <div class="pp-interval">
                <div
                  class="pp-meter pp-interval__rail"
                  aria-hidden="true"
                  title="Bits, from 0 to the 128-bit target"
                >
                  <span
                    class="pp-interval__proven"
                    :style="{ width: `${stakes.provenWidth}%` }"
                  />
                  <span
                    class="pp-interval__reach"
                    :style="{ width: `${stakes.reachWidth}%` }"
                  />
                </div>
                <ul class="pp-inline pp-interval__legend">
                  <li class="pp-inline pp-interval__key">
                    <span aria-hidden="true" class="pp-dot pp-dot--live" />Proven safe<span
                      class="pp-num pp-tone-ink"
                      >{{ stakes.lowerText }}</span
                    >
                  </li>
                  <li class="pp-inline pp-interval__key">
                    <span aria-hidden="true" class="pp-dot pp-interval__dot" />Still open
                  </li>
                  <li class="pp-inline pp-interval__key">
                    <span
                      aria-hidden="true"
                      class="pp-dot pp-interval__dot pp-interval__dot--reach"
                    />Proven out of reach<span class="pp-num pp-tone-ink">{{
                      stakes.upperText
                    }}</span>
                  </li>
                </ul>
                <p class="pp-small">
                  The truth lies between {{ stakes.lowerText }} and {{ stakes.upperText }} bits.
                </p>
              </div>
            </template>

            <template #scale>
              <p class="pp-small">{{ stakes.scaleIntro }}</p>
              <table class="pp-table pp-stake__table">
                <tbody>
                  <tr v-for="row in stakes.scaleRows" :key="row.label">
                    <td :class="row.tone === 'proven' ? 'pp-tone-live' : ''">{{ row.label }}</td>
                    <td class="pp-table__num">{{ row.value }}</td>
                    <td class="pp-table__num" v-html="row.when" />
                  </tr>
                </tbody>
              </table>
            </template>

            <template #footnote>
              {{ stakes.footnote }}
              <a
                :href="stakes.sourceHref"
                target="_blank"
                rel="noreferrer"
                class="pp-link pp-stake__source"
                >Source: the challenge's own rules<Icon name="external-link" :size="12"
              /></a>
            </template>
          </StakesCard>
        </section>
      </div>
    </section>

    <!-- Everything else: one stake block under one heading. -->
    <section v-else :aria-labelledby="stakes.id" class="pp-sec">
      <div class="pp-sec__head">
        <h2 :id="stakes.id" class="pp-h2">What's at stake</h2>
        <VerbBadge v-bind="stakes.badge" />
      </div>

      <StakesCard
        :protects-label="stakes.protectsLabel"
        :protects="stakes.protects"
        :value="stakes.value"
        :unit="stakes.unit"
      >
        <template #number-note>
          <p class="pp-small" v-html="stakes.numberNote" />
        </template>

        <template #scale>
          <ul class="pp-scale">
            <li v-for="row in stakes.scaleRows" :key="row.label" class="pp-scale__row">
              <span
                class="pp-scale__label"
                :class="row.tone === 'proven' ? 'pp-tone-live' : ''"
                >{{ row.label }}</span
              >
              <span
                class="pp-scale__value pp-num"
                :class="row.tone === 'proven' ? 'pp-tone-live' : 'pp-tone-ink'"
                >{{ row.value }}</span
              >
            </li>
          </ul>
          <p v-if="stakes.scaleNoteAfter" class="pp-small" v-html="stakes.scaleNoteAfter" />
        </template>

        <template #footnote>
          {{ stakes.footnote }}
          <a
            :href="stakes.sourceHref"
            target="_blank"
            rel="noreferrer"
            class="pp-link pp-stake__source"
            >Source: the challenge's own rules<Icon name="external-link" :size="12"
          /></a>
        </template>
      </StakesCard>
    </section>

    <section class="pp-sec">
      <div class="pp-sec__head">
        <h2 class="pp-h2">Tokens on this challenge</h2>
      </div>

      <ul v-if="tokens.length" class="pp-grid pp-grid--2 pp-tokens">
        <li v-for="token in tokens" :key="token.mint" class="pp-tokens__item">
          <TokenGridCard :token="token" :market="market[token.mint] ?? null" />
        </li>
      </ul>
      <p v-else class="pp-note">No token works on it yet.</p>
    </section>
  </div>
</template>

<style scoped>
.pp-redirect {
  min-height: 40vh;
}

.pp-404 {
  padding: 18px 4px;
  text-decoration: none;
}

.pp-404__open {
  gap: 6px;
  font-family: var(--pp-mono);
  font-size: 0.74rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--pp-accent-text);
}

.pp-detail__metrics {
  gap: var(--pp-t3);
}

.pp-facts__block {
  gap: 12px;
}

.pp-facts__list {
  display: grid;
}

.pp-facts__list .pp-kv {
  grid-template-columns: minmax(0, 1fr);
  gap: 2px;
}

.pp-facts__list .pp-kv__v {
  text-align: left;
}

.pp-facts__dot {
  padding: 0 4px;
  color: var(--pp-line-strong);
}

.pp-facts__note {
  color: var(--pp-muted);
}

.pp-facts__unit {
  color: var(--pp-muted);
}

.pp-facts__target {
  justify-self: start;
}

.pp-facts__board {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--pp-mono);
  font-size: 0.72rem;
}

.pp-stakes__bounds {
  display: grid;
  gap: var(--pp-t5);
}

.pp-stakes__bound {
  display: grid;
  gap: var(--pp-t3);
}

.pp-stakes__boundhead {
  justify-content: space-between;
  gap: 12px;
}

.pp-stakes__boundhead .pp-h3 {
  min-width: 0;
  overflow-wrap: anywhere;
}

.pp-stakes__bound + .pp-stakes__bound {
  padding-top: var(--pp-t5);
  border-top: 1px solid var(--pp-line);
}

.pp-interval {
  display: grid;
  gap: 10px;
  margin-top: 4px;
}

.pp-interval__rail {
  position: relative;
  height: 8px;
  background: var(--pp-sheet-sunk);
  border-radius: 999px;
  overflow: hidden;
}

.pp-interval__proven,
.pp-interval__reach {
  position: absolute;
  top: 0;
  bottom: 0;
  display: block;
}

.pp-interval__proven {
  left: 0;
  background: var(--pp-live);
}

.pp-interval__reach {
  right: 0;
  background: color-mix(in srgb, var(--pp-line-strong) 70%, transparent);
}

.pp-interval__legend {
  gap: 6px 16px;
  font-size: 0.72rem;
  color: var(--pp-muted);
}

.pp-interval__key {
  gap: 6px;
}

.pp-interval__dot {
  background: var(--pp-line-strong);
}

.pp-interval__dot--reach {
  background: color-mix(in srgb, var(--pp-line-strong) 70%, transparent);
}

.pp-stake__table {
  font-size: 0.8rem;
}

.pp-stake__table td:first-child {
  padding-left: 0;
}

.pp-stake__table td:last-child {
  padding-right: 0;
}

.pp-stake__source {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-left: 4px;
  white-space: nowrap;
}

.pp-scale {
  display: grid;
}

.pp-scale__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--pp-line-soft);
}

.pp-scale__row:last-child {
  border-bottom: 0;
}

.pp-scale__label {
  font-size: 0.78rem;
  color: var(--pp-muted);
}

.pp-scale__value {
  font-size: 0.82rem;
}

.pp-tokens {
  margin-top: var(--pp-t3);
}

.pp-tokens__item {
  min-width: 0;
}

@media (max-width: 560px) {
  .pp-scale__row {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
  }
}
</style>
