<script setup>
/**
 * `/challenges/:slug` — one public problem: the running head, its record stage,
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
  <div v-if="redirecting" class="cq-page cq-chredirect" />

  <div v-else-if="!challenge || !detail" class="cq-page cq-ch404">
    <header class="cq-pagehead cq-ch404__head">
      <div class="cq-pagehead__head">
        <p class="cq-kicker">{{ NOT_FOUND.eyebrow }}</p>
        <h1 class="cq-runhead">{{ NOT_FOUND.title }}</h1>
      </div>
      <div class="cq-pagehead__edge">
        <p class="cq-lede cq-ch404__body">{{ NOT_FOUND.body }}</p>
      </div>
    </header>

    <section class="cq-sheet cq-ch404__list">
      <ul class="cq-ch404__ledger">
        <li v-for="entry in openChallenges" :key="entry.slug" class="cq-ch404__item">
          <RouterLink
            :to="CARD_COPY[entry.slug].href ?? `/challenges/${entry.slug}`"
            class="cq-ch404__row"
          >
            <span class="cq-ch404__who">
              <span class="cq-h3">{{ entry.name }}</span>
              <span class="cq-small">{{ CARD_COPY[entry.slug].hostLabel }}</span>
            </span>
            <span class="cq-ch404__open"
              >Open<Icon name="arrow-right" :size="14"
            /></span>
          </RouterLink>
        </li>
      </ul>
    </section>

    <div class="cq-band cq-ch404__band">
      <RouterLink to="/challenges" class="cq-btn cq-btn--lg cq-ch404__cta">{{
        NOT_FOUND.cta
      }}</RouterLink>
    </div>
  </div>

  <div v-else class="cq-page cq-chdetail">
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

    <div class="cq-stage cq-chdetail__stage">
      <div class="cq-stage__main">
        <div class="cq-chdetail__figures">
          <MetricPanel v-for="panel in panels" :key="panel.title" :panel="panel" />
        </div>

        <section
          v-for="panel in panels"
          :key="panel.title"
          class="cq-sheet cq-chfacts"
        >
          <div class="cq-chfacts__head">
            <p class="cq-eyebrow">{{ panel.direction }}</p>

            <p v-if="panel.progressRight" class="cq-tag cq-tag--sm cq-chfacts__target">
              {{ panel.progressRight }}
            </p>
          </div>

          <dl class="cq-chfacts__list">
            <div class="cq-kv">
              <dt class="cq-kv__k">Where it started</dt>
              <dd class="cq-kv__v">{{ panel.start }}</dd>
            </div>
            <div v-if="panel.extra" class="cq-kv">
              <dt class="cq-kv__k">
                {{ panel.extra.label }}<span class="cq-chfacts__dot" aria-hidden="true">·</span
                ><span class="cq-chfacts__note">{{ panel.extra.labelNote }}</span>
              </dt>
              <dd class="cq-kv__v">
                {{ panel.extra.value }} <span class="cq-chfacts__unit">{{ panel.extra.unit }}</span>
              </dd>
            </div>
          </dl>

          <a
            :href="panel.leaderboard"
            target="_blank"
            rel="noreferrer"
            class="cq-link cq-chfacts__board"
            >Official leaderboard<Icon name="external-link" :size="12"
          /></a>
        </section>
      </div>

      <aside class="cq-stage__edge cq-chdetail__edge">
        <!-- What's at stake: the Proximity Prize is scored twice. -->
        <section v-if="stakes.kind === 'bounds'" class="cq-band cq-chstakes">
          <div class="cq-chstakes__head">
            <h2 class="cq-h2">{{ stakes.heading }}</h2>
          </div>

          <section
            v-for="bound in stakes.bounds"
            :key="bound.id"
            :aria-labelledby="bound.id"
            class="cq-chstakes__bound"
          >
            <div class="cq-chstakes__boundhead">
              <h3 :id="bound.id" class="cq-h3">{{ bound.title }}</h3>
              <VerbBadge v-bind="bound.badge" />
            </div>

            <StakesCard
              :protects-label="bound.protectsLabel"
              :protects="bound.protects"
              :value="bound.value"
              :unit="bound.unit"
            >
              <template #number-note>
                <p class="cq-small" v-html="bound.numberNote" />
              </template>

              <template #extra>
                <div class="cq-chstakes__interval">
                  <div
                    class="cq-meter cq-chstakes__rail"
                    aria-hidden="true"
                    title="Bits, from 0 to the 128-bit target"
                  >
                    <span
                      class="cq-chstakes__proven"
                      :style="{ width: `${stakes.provenWidth}%` }"
                    />
                    <span
                      class="cq-chstakes__reach"
                      :style="{ width: `${stakes.reachWidth}%` }"
                    />
                  </div>
                  <ul class="cq-inline cq-chstakes__legend">
                    <li class="cq-inline cq-chstakes__key">
                      <span aria-hidden="true" class="cq-dot cq-dot--live" />Proven safe<span
                        class="cq-num cq-chstakes__tone"
                        >{{ stakes.lowerText }}</span
                      >
                    </li>
                    <li class="cq-inline cq-chstakes__key">
                      <span aria-hidden="true" class="cq-dot cq-chstakes__dot" />Still open
                    </li>
                    <li class="cq-inline cq-chstakes__key">
                      <span
                        aria-hidden="true"
                        class="cq-dot cq-chstakes__dot cq-chstakes__dot--reach"
                      />Proven out of reach<span class="cq-num cq-chstakes__tone">{{
                        stakes.upperText
                      }}</span>
                    </li>
                  </ul>
                  <p class="cq-small">
                    The truth lies between {{ stakes.lowerText }} and {{ stakes.upperText }} bits.
                  </p>
                </div>
              </template>

              <template #scale>
                <p class="cq-small">{{ stakes.scaleIntro }}</p>
                <table class="cq-table cq-chstakes__table">
                  <tbody>
                    <tr v-for="row in stakes.scaleRows" :key="row.label">
                      <td :class="row.tone === 'proven' ? 'cq-tone-live' : ''">{{ row.label }}</td>
                      <td class="cq-table__num">{{ row.value }}</td>
                      <td class="cq-table__num" v-html="row.when" />
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
                  class="cq-link cq-chstakes__source"
                  >Source: the challenge's own rules<Icon name="external-link" :size="12"
                /></a>
              </template>
            </StakesCard>
          </section>
        </section>

        <!-- Everything else: one stake block under one heading. -->
        <section v-else :aria-labelledby="stakes.id" class="cq-band cq-chstakes">
          <div class="cq-chstakes__head">
            <h2 :id="stakes.id" class="cq-h2">What's at stake</h2>
            <VerbBadge v-bind="stakes.badge" />
          </div>

          <StakesCard
            :protects-label="stakes.protectsLabel"
            :protects="stakes.protects"
            :value="stakes.value"
            :unit="stakes.unit"
          >
            <template #number-note>
              <p class="cq-small" v-html="stakes.numberNote" />
            </template>

            <template #scale>
              <ul class="cq-chscale">
                <li v-for="row in stakes.scaleRows" :key="row.label" class="cq-chscale__row">
                  <span
                    class="cq-chscale__label"
                    :class="row.tone === 'proven' ? 'cq-tone-live' : ''"
                    >{{ row.label }}</span
                  >
                  <span
                    class="cq-chscale__value cq-num"
                    :class="row.tone === 'proven' ? 'cq-tone-live' : 'cq-tone-ink'"
                    >{{ row.value }}</span
                  >
                </li>
              </ul>
              <p v-if="stakes.scaleNoteAfter" class="cq-small" v-html="stakes.scaleNoteAfter" />
            </template>

            <template #footnote>
              {{ stakes.footnote }}
              <a
                :href="stakes.sourceHref"
                target="_blank"
                rel="noreferrer"
                class="cq-link cq-chstakes__source"
                >Source: the challenge's own rules<Icon name="external-link" :size="12"
              /></a>
            </template>
          </StakesCard>
        </section>
      </aside>
    </div>

    <section class="cq-sheet cq-chtokens">
      <div class="cq-chtokens__head">
        <h2 class="cq-h2">Tokens on this challenge</h2>
      </div>

      <ul v-if="tokens.length" class="cq-chtokens__list">
        <li v-for="token in tokens" :key="token.mint" class="cq-chtokens__item">
          <TokenGridCard :token="token" :market="market[token.mint] ?? null" />
        </li>
      </ul>
      <p v-else class="cq-note cq-chtokens__empty">No token works on it yet.</p>
    </section>
  </div>
</template>

<style scoped>
.cq-chredirect {
  min-height: 40vh;
}

/* ---------- not found ---------------------------------------------------- */

.cq-ch404__body {
  max-width: 48ch;
}

.cq-ch404__list {
  margin-bottom: clamp(22px, 3vw, 34px);
  overflow: clip;
}

.cq-ch404__ledger {
  list-style: none;
  margin: 0;
  padding: 0;
}

.cq-ch404__item + .cq-ch404__item {
  border-top: 1px solid var(--cq-line-soft);
}

.cq-ch404__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 20px;
  padding: 18px clamp(20px, 2.6vw, 30px);
  color: var(--cq-ink);
  text-decoration: none;
}

.cq-ch404__row:hover,
.cq-ch404__row:focus-visible {
  background: var(--cq-sheet-soft);
}

.cq-ch404__who {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.cq-ch404__open {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--cq-mono);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--cq-accent-text);
}

.cq-ch404__band {
  display: flex;
  align-items: center;
  margin-top: 0;
  padding: clamp(18px, 2.4vw, 26px) clamp(20px, 2.8vw, 34px);
}

/* ---------- data stage --------------------------------------------------- */

.cq-chdetail__stage {
  padding-top: clamp(22px, 3.2vw, 44px);
  align-items: start;
}

.cq-chdetail__figures {
  display: grid;
  gap: clamp(18px, 2vw, 28px);
}

.cq-chfacts {
  display: grid;
  min-width: 0;
}

.cq-chfacts__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 14px;
  padding: 13px clamp(18px, 2.4vw, 26px);
  border-bottom: 1px solid var(--cq-line);
  background: var(--cq-sheet-soft);
}

.cq-chfacts__target {
  flex-shrink: 0;
}

.cq-chfacts__list {
  display: grid;
  margin: 0;
  padding: 4px clamp(18px, 2.4vw, 26px);
}

.cq-chfacts__dot {
  padding: 0 4px;
  color: var(--cq-line-strong);
}

.cq-chfacts__note {
  color: var(--cq-muted);
}

.cq-chfacts__unit {
  color: var(--cq-muted);
}

.cq-chfacts__board {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  justify-self: start;
  margin: 2px clamp(18px, 2.4vw, 26px) 18px;
  font-family: var(--cq-mono);
  font-size: 0.72rem;
}

@media (max-width: 560px) {
  .cq-chfacts .cq-kv {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
  }

  .cq-chfacts .cq-kv__v {
    text-align: left;
  }
}

/* ---------- stakes, dark edge ------------------------------------------- */

.cq-chstakes.cq-band {
  --cq-ink: #f2f5fc;
  --cq-ink-soft: #d4dceb;
  --cq-muted: #a1aec2;
  --cq-muted-ground: #bcc7d8;
  --cq-line: #2b3546;
  --cq-line-soft: #222b39;
  --cq-line-strong: #475568;
  --cq-sheet-soft: #151c27;
  --cq-sheet-sunk: #27303e;
  --cq-accent-text: #b9c4ff;
  --cq-accent-soft: #1b2442;
  --cq-accent-line: #3a4a86;
  --cq-live: #5fd6a4;
  --cq-live-surface: #0d2b20;
  display: grid;
  align-items: stretch;
  gap: 0;
  margin: 0;
  padding: clamp(20px, 2.4vw, 28px);
  border: 1px solid #232c3b;
  border-radius: var(--cq-radius-lg);
  align-self: start;
}

.cq-chstakes__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 14px;
  padding-bottom: clamp(12px, 1.6vw, 18px);
}

.cq-chstakes__head .cq-h2 {
  font-size: clamp(1.4rem, 2vw, 1.85rem);
  color: var(--cq-ink);
}

.cq-chstakes__bound + .cq-chstakes__bound {
  margin-top: clamp(20px, 2.6vw, 28px);
  padding-top: clamp(18px, 2.2vw, 26px);
  border-top: 1px solid var(--cq-line);
}

.cq-chstakes__boundhead {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 12px;
  padding-bottom: 2px;
}

.cq-chstakes__boundhead .cq-h3 {
  min-width: 0;
  overflow-wrap: anywhere;
  color: var(--cq-ink);
}

.cq-chstakes__interval {
  display: grid;
  gap: 10px;
  padding-top: 4px;
}

.cq-chstakes__rail {
  position: relative;
  height: 8px;
  background: var(--cq-sheet-sunk);
  border-radius: 999px;
  overflow: hidden;
}

.cq-chstakes__proven,
.cq-chstakes__reach {
  position: absolute;
  top: 0;
  bottom: 0;
  display: block;
}

.cq-chstakes__proven {
  left: 0;
  background: var(--cq-live);
}

.cq-chstakes__reach {
  right: 0;
  background: #566276;
}

.cq-chstakes__legend {
  gap: 6px 16px;
  padding: 0;
  margin: 0;
  list-style: none;
  font-family: var(--cq-mono);
  font-size: 0.68rem;
  line-height: 1.45;
  color: var(--cq-muted);
}

.cq-chstakes__key {
  gap: 6px;
}

.cq-chstakes__tone {
  color: var(--cq-ink);
}

.cq-chstakes__dot {
  background: #7b8799;
}

.cq-chstakes__dot--reach {
  background: #566276;
}

.cq-chstakes__table {
  width: 100%;
  font-size: 0.75rem;
}

.cq-chstakes__table td {
  padding: 7px 0;
  border-top: 1px solid var(--cq-line-soft);
  overflow-wrap: anywhere;
}

.cq-chstakes__table td + td {
  padding-left: 12px;
  text-align: right;
}

.cq-chstakes__source {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 3px;
  margin-left: 4px;
  white-space: normal;
  overflow-wrap: anywhere;
}

.cq-chscale {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cq-chscale__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid var(--cq-line-soft);
}

.cq-chscale__row:last-child {
  border-bottom: 0;
}

.cq-chscale__label {
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--cq-muted);
}

.cq-chscale__value {
  font-size: 0.8rem;
  color: var(--cq-ink);
  text-align: right;
}

@media (max-width: 560px) {
  .cq-chscale__row {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
  }

  .cq-chscale__value {
    text-align: left;
  }
}

/* ---------- tokens ------------------------------------------------------- */

.cq-chtokens {
  margin-top: clamp(28px, 4vw, 56px);
  display: grid;
  min-width: 0;
}

.cq-chtokens__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 18px;
  padding: clamp(18px, 2.4vw, 26px) clamp(20px, 2.8vw, 32px);
  border-bottom: 1px solid var(--cq-line);
  background: var(--cq-sheet-soft);
}

.cq-chtokens__head .cq-h2 {
  font-size: clamp(1.35rem, 2vw, 1.75rem);
}

.cq-chtokens__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.cq-chtokens__item {
  min-width: 0;
  padding: 0 clamp(18px, 2.6vw, 30px);
}

.cq-chtokens__item + .cq-chtokens__item {
  border-top: 1px solid var(--cq-line-soft);
}

.cq-chtokens__empty {
  margin: clamp(18px, 2.4vw, 26px) clamp(20px, 2.8vw, 32px);
}

@media (max-width: 1180px) {
  .cq-chdetail__edge {
    gap: 14px;
  }

  .cq-chdetail__stage {
    grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
  }
}

@media (max-width: 960px) {
  .cq-chdetail__stage {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
