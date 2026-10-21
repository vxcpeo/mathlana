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
  <div v-if="redirecting" class="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6" />

  <div
    v-else-if="!challenge || !detail"
    class="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 sm:py-14"
  >
    <header class="flex max-w-2xl flex-col gap-2.5">
      <p class="text-[0.7rem] font-medium tracking-[0.08em] text-quiet uppercase">
        {{ NOT_FOUND.eyebrow }}
      </p>
      <h1 class="headline text-4xl sm:text-5xl">{{ NOT_FOUND.title }}</h1>
      <p class="text-base text-pretty text-muted-foreground">{{ NOT_FOUND.body }}</p>
    </header>

    <ul class="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <li v-for="entry in openChallenges" :key="entry.slug" class="min-w-0">
        <RouterLink
          :to="CARD_COPY[entry.slug].href ?? `/challenges/${entry.slug}`"
          class="group/title flex min-w-0 items-center justify-between gap-3 rounded-xl border bg-card px-5 py-4 outline-none transition-colors hover:border-brand/45 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span class="flex min-w-0 flex-col gap-0.5">
            <span
              class="truncate font-heading text-base font-semibold tracking-[-0.01em] transition-colors group-hover/title:text-brand-text"
              >{{ entry.name }}</span
            >
            <span class="truncate text-xs text-muted-foreground">{{
              CARD_COPY[entry.slug].hostLabel
            }}</span>
          </span>
          <span class="flex shrink-0 items-center gap-1 text-[0.8rem] font-medium text-brand-text"
            >Open<Icon name="arrow-right" class="size-3.5"
          /></span>
        </RouterLink>
      </li>
    </ul>

    <div>
      <RouterLink
        to="/challenges"
        class="inline-flex h-11 shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary px-5 text-sm font-medium whitespace-nowrap text-primary-foreground transition-all outline-none select-none hover:bg-primary/80 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >{{ NOT_FOUND.cta }}</RouterLink
      >
    </div>
  </div>

  <div v-else class="flex flex-col">
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

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6">
      <div
        :class="
          panels.length > 1
            ? 'grid grid-cols-1 gap-3 md:grid-cols-2'
            : 'grid grid-cols-1 gap-3 max-w-xl'
        "
      >
        <MetricPanel v-for="panel in panels" :key="panel.title" :panel="panel" />
      </div>

      <!-- What's at stake: the Proximity Prize is scored twice. -->
      <section v-if="stakes.kind === 'bounds'" class="flex flex-col gap-6">
        <h2 class="headline text-2xl">{{ stakes.heading }}</h2>

        <section
          v-for="bound in stakes.bounds"
          :key="bound.id"
          :aria-labelledby="bound.id"
          class="flex flex-col gap-3"
        >
          <div class="flex min-w-0 items-center justify-between gap-4">
            <h3 :id="bound.id" class="min-w-0 truncate headline whitespace-nowrap text-lg">
              {{ bound.title }}
            </h3>
            <VerbBadge v-bind="bound.badge" />
          </div>

          <StakesCard
            :protects-label="bound.protectsLabel"
            :protects="bound.protects"
            :value="bound.value"
            :unit="bound.unit"
          >
            <template #number-note>
              <p class="text-sm text-pretty text-muted-foreground" v-html="bound.numberNote" />
            </template>

            <template #extra>
              <div class="flex min-w-0 flex-col gap-2.5">
                <div
                  class="relative h-2 overflow-hidden rounded-full bg-muted"
                  aria-hidden="true"
                  title="Bits, from 0 to the 128-bit target"
                >
                  <span
                    class="absolute inset-y-0 left-0 rounded-l-full bg-proven"
                    :style="{ width: `${stakes.provenWidth}%` }"
                  />
                  <span
                    class="absolute inset-y-0 right-0 rounded-r-full bg-quiet/45"
                    :style="{ width: `${stakes.reachWidth}%` }"
                  />
                </div>
                <ul class="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                  <li class="flex items-center gap-1.5 whitespace-nowrap">
                    <span aria-hidden="true" class="size-2 shrink-0 rounded-full bg-proven" />Proven
                    safe<span class="font-mono text-foreground figures">{{ stakes.lowerText }}</span>
                  </li>
                  <li class="flex items-center gap-1.5 whitespace-nowrap">
                    <span
                      aria-hidden="true"
                      class="size-2 shrink-0 rounded-full bg-muted border border-foreground/15"
                    />Still open
                  </li>
                  <li class="flex items-center gap-1.5 whitespace-nowrap">
                    <span
                      aria-hidden="true"
                      class="size-2 shrink-0 rounded-full bg-quiet/45"
                    />Proven out of reach<span class="font-mono text-foreground figures">{{
                      stakes.upperText
                    }}</span>
                  </li>
                </ul>
                <p class="text-xs text-pretty text-muted-foreground">
                  The truth lies between {{ stakes.lowerText }} and {{ stakes.upperText }} bits.
                </p>
              </div>
            </template>

            <template #scale>
              <p class="text-xs text-pretty text-muted-foreground">{{ stakes.scaleIntro }}</p>
              <ul class="@container flex flex-col divide-y">
                <li
                  v-for="row in stakes.scaleRows"
                  :key="row.label"
                  class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-0.5 py-2 first:pt-0 last:pb-0 @min-[25rem]:grid-cols-[minmax(0,1fr)_auto_auto]"
                >
                  <span
                    class="min-w-0 truncate text-xs whitespace-nowrap"
                    :class="row.tone === 'proven' ? 'text-proven-text' : 'text-muted-foreground'"
                    >{{ row.label }}</span
                  >
                  <span class="font-mono text-xs whitespace-nowrap text-foreground figures">{{
                    row.value
                  }}</span>
                  <span
                    class="col-span-2 text-right font-mono text-xs whitespace-nowrap text-foreground/90 figures @min-[25rem]:col-span-1 @min-[25rem]:min-w-[9.5rem]"
                    v-html="row.when"
                  />
                </li>
              </ul>
            </template>

            <template #footnote>
              {{ stakes.footnote }}
              <a
                :href="stakes.sourceHref"
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center gap-1 whitespace-nowrap text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-brand"
                >Source: the challenge's own rules<Icon name="external-link" class="size-3"
              /></a>
            </template>
          </StakesCard>
        </section>
      </section>

      <!-- Everything else: one card under one heading. -->
      <section v-else :aria-labelledby="stakes.id" class="flex flex-col gap-3">
        <div class="flex min-w-0 items-center justify-between gap-4">
          <h2 :id="stakes.id" class="min-w-0 truncate headline whitespace-nowrap text-xl">
            What's at stake
          </h2>
          <VerbBadge v-bind="stakes.badge" />
        </div>

        <StakesCard
          :protects-label="stakes.protectsLabel"
          :protects="stakes.protects"
          :value="stakes.value"
          :unit="stakes.unit"
        >
          <template #number-note>
            <p class="text-sm text-pretty text-muted-foreground" v-html="stakes.numberNote" />
          </template>

          <template #scale>
            <ul class="flex flex-col divide-y">
              <li
                v-for="row in stakes.scaleRows"
                :key="row.label"
                class="flex min-w-0 items-baseline justify-between gap-3 py-2 first:pt-0 last:pb-0"
              >
                <span class="min-w-0 truncate text-xs whitespace-nowrap text-muted-foreground">{{
                  row.label
                }}</span>
                <span
                  class="font-mono text-xs whitespace-nowrap figures"
                  :class="row.tone === 'proven' ? 'text-proven-text' : 'text-foreground'"
                  >{{ row.value }}</span
                >
              </li>
            </ul>
            <p
              v-if="stakes.scaleNoteAfter"
              class="text-xs text-pretty text-muted-foreground"
              v-html="stakes.scaleNoteAfter"
            />
          </template>

          <template #footnote>
            {{ stakes.footnote }}
            <a
              :href="stakes.sourceHref"
              target="_blank"
              rel="noreferrer"
              class="inline-flex items-center gap-1 whitespace-nowrap text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-brand"
              >Source: the challenge's own rules<Icon name="external-link" class="size-3"
            /></a>
          </template>
        </StakesCard>
      </section>

      <section class="flex flex-col gap-4">
        <h2 class="headline text-2xl">Tokens on this challenge</h2>
        <ul v-if="tokens.length" class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <li v-for="token in tokens" :key="token.mint" class="min-w-0">
            <TokenGridCard :token="token" :market="market[token.mint] ?? null" />
          </li>
        </ul>
        <p v-else class="rounded-xl border border-dashed px-5 py-8 text-sm text-muted-foreground">
          No token works on it yet.
        </p>
      </section>
    </div>
  </div>
</template>
