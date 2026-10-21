<script setup>
/**
 * `/t/:mint` — a single token: its quantum-drawn picture, its challenge, the
 * pool that pays for the agent, and where its fees go.
 */
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import AppButton from "@/components/ui/AppButton.vue";
import Icon from "@/components/ui/Icon.vue";
import NvdaChip from "@/components/tokens/NvdaChip.vue";
import PoolPanel from "@/components/tokens/PoolPanel.vue";
import ProgressPanel from "@/components/tokens/ProgressPanel.vue";
import ResearchPanel from "@/components/tokens/ResearchPanel.vue";
import FeeSplitPanel from "@/components/tokens/FeeSplitPanel.vue";
import TokenPicture from "@/components/tokens/TokenPicture.vue";
import AiQuantumIcon from "@/components/tokens/AiQuantumIcon.vue";
import { snapshotFor } from "@/components/tokens/tokenSnapshot";
import { ALL_MINTS, ALL_TOKENS } from "@/data/tokens";
import { CHALLENGES } from "@/data/challenges";
import { useMarket } from "@/composables/useMarket";
import { compactUsd, curvePercent, shortAddress } from "@/lib/format";

/** The route is declared as `/t/:mint`; the param is read from the route so
 *  the view works whether or not the route forwards props. */
const route = useRoute();
const mint = computed(() => String(route.params.mint ?? ""));

const token = computed(() => ALL_TOKENS.find((entry) => entry.mint === mint.value) ?? null);
const snapshot = computed(() => snapshotFor(mint.value));

/** The market cache is shared module state; watching every mint keeps the page
 *  live when the route moves from one token to another. */
const { market } = useMarket(ALL_MINTS);
const m = computed(() => market.value?.[mint.value] ?? token.value?.fallback ?? null);

const challenge = computed(
  () => CHALLENGES.find((entry) => entry.slug === token.value?.challengeSlug) ?? null,
);

const stats = computed(() => [
  { label: "Market cap", value: compactUsd(m.value?.marketCapUsd) },
  { label: "Bonding curve", value: `${curvePercent(m.value?.curve) ?? 0}%` },
  { label: "Sessions", value: String(token.value?.sessions ?? 0) },
  { label: "Best checked", value: null },
]);

const stakes = computed(() => {
  if (!token.value?.challengeLabel) return null;
  if (snapshot.value.stakes) return snapshot.value.stakes;
  return {
    label: token.value.challengeVerb,
    note: token.value.challengeDescription,
  };
});
</script>

<template>
  <div class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-12">
    <template v-if="token">
      <header class="flex flex-col gap-6">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
          <div class="flex min-w-0 flex-col gap-5">
            <div class="flex min-w-0 items-start gap-4">
              <TokenPicture :mint="token.mint" :name="token.name" :size="72" />

              <div class="flex min-w-0 flex-col gap-2">
                <div class="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                  <h1 class="headline max-w-full truncate text-3xl sm:text-4xl">
                    {{ token.name }}
                  </h1>
                  <span class="font-mono text-base text-muted-foreground">{{ token.ticker }}</span>
                  <NvdaChip />
                </div>

                <div
                  class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground"
                >
                  <a href="#research" class="rounded-sm hover:opacity-80">
                    <span
                      class="inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap text-muted-foreground"
                    >
                      <span class="relative flex size-2">
                        <span class="relative size-2 rounded-full border border-muted-foreground" />
                      </span>
                      Waiting for fees
                    </span>
                  </a>

                  <RouterLink
                    v-if="token.challengeSlug"
                    :to="`/challenges/${token.challengeSlug}`"
                    class="flex items-center gap-1.5 hover:text-foreground"
                  >
                    <Icon name="sigma" class="size-3.5 text-brand" />Works on
                    {{ token.challengeLabel }}
                  </RouterLink>

                  <span class="font-mono text-xs">Created by {{ shortAddress(token.creator) }}</span>
                </div>

                <p v-if="stakes" class="flex max-w-2xl min-w-0 items-start gap-2 text-sm">
                  <Icon name="shield" class="text-brand mt-[3px] size-3.5 shrink-0" />
                  <span class="min-w-0 text-pretty text-muted-foreground">
                    <span class="font-medium whitespace-nowrap text-foreground">{{
                      stakes.label
                    }}</span>
                    <span aria-hidden="true" class="px-1.5 text-quiet">·</span>{{ stakes.note }}
                  </span>
                </p>

                <p
                  v-if="snapshot.description"
                  class="max-w-2xl text-sm text-pretty text-muted-foreground"
                >
                  {{ snapshot.description }}
                </p>

                <nav class="flex flex-wrap gap-2 pt-1">
                  <a
                    :href="`https://pump.fun/coin/${token.mint}`"
                    target="_blank"
                    rel="noreferrer"
                    class="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
                    >pump.fun<Icon name="external-link" class="size-3"
                  /></a>
                  <a
                    :href="`https://solscan.io/token/${token.mint}`"
                    target="_blank"
                    rel="noreferrer"
                    class="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
                    >Solscan<Icon name="external-link" class="size-3"
                  /></a>
                </nav>
              </div>
            </div>

            <dl class="grid grid-cols-2 overflow-hidden rounded-xl border bg-card sm:grid-cols-4">
              <div
                v-for="stat in stats"
                :key="stat.label"
                class="flex min-w-0 flex-col gap-0.5 border-r border-b px-3.5 py-2.5 [&:nth-child(2n)]:border-r-0 [&:nth-child(n+3)]:border-b-0 sm:border-b-0 sm:last:border-r-0 sm:[&:nth-child(2n)]:border-r"
              >
                <dt
                  class="truncate text-[0.66rem] font-medium tracking-[0.06em] text-quiet uppercase"
                >
                  {{ stat.label }}
                </dt>
                <dd class="truncate font-mono text-base text-foreground figures">
                  <span v-if="stat.value !== null">{{ stat.value }}</span>
                  <span v-else class="text-muted-foreground">-</span>
                </dd>
              </div>
            </dl>
          </div>

          <PoolPanel :pool="snapshot.pool" />
        </div>

        <a
          href="#research"
          class="group/board flex min-w-0 items-center gap-3 rounded-xl border border-brand-border bg-card px-4 py-3.5 transition-colors outline-none hover:bg-accent/40 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <AiQuantumIcon class="size-5 shrink-0 text-brand-text" />
          <span class="flex min-w-0 flex-1 flex-col gap-0.5">
            <span class="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-0.5">
              <span class="font-heading text-sm font-semibold tracking-[-0.01em] whitespace-nowrap"
                >AI and quantum board</span
              >
              <span
                class="inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap text-muted-foreground"
              >
                <span class="relative flex size-2">
                  <span class="relative size-2 rounded-full border border-muted-foreground" />
                </span>
                Waiting for fees
              </span>
            </span>
            <span class="text-xs text-pretty text-muted-foreground"
              >The agent starts once fees fund it; the board shows where it stands.</span
            >
          </span>
          <span class="flex shrink-0 items-center gap-1 text-[0.8rem] font-medium text-brand-text">
            <span class="max-sm:sr-only">See it live</span>
            <Icon
              name="arrow-down"
              class="size-4 transition-transform group-hover/board:translate-y-0.5 motion-reduce:transition-none"
              :stroke-width="1.75"
            />
          </span>
        </a>
      </header>

      <ProgressPanel />

      <ResearchPanel :token="token" :pool="snapshot.pool" />

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.618fr)_minmax(0,1fr)]">
        <section class="flex flex-col gap-3">
          <div class="flex items-center justify-between gap-3">
            <h2 class="headline text-xl">Results</h2>
            <a
              :href="challenge?.host ?? 'https://better.codes'"
              target="_blank"
              rel="noreferrer"
              class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >Official leaderboard<Icon name="external-link" class="size-3"
            /></a>
          </div>
          <p class="rounded-xl border border-dashed px-5 py-8 text-sm text-muted-foreground">
            No result yet. A result shows here the moment Mathlana's check passes.
          </p>
        </section>

        <FeeSplitPanel />
      </div>
    </template>

    <template v-else>
      <header class="flex flex-col gap-5">
        <p class="flex items-center gap-2 text-sm whitespace-nowrap text-muted-foreground">
          <span aria-hidden="true" class="size-1.5 shrink-0 rounded-full bg-brand" />Token
        </p>
        <h1 class="headline text-3xl sm:text-4xl">No token at that address</h1>
        <p class="max-w-2xl text-pretty text-muted-foreground">
          Mathlana has no token at
          <span class="font-mono text-[0.9em] break-all">{{ mint }}</span>. The address may be
          mistyped, or the token may predate the directory.
        </p>
        <div class="flex flex-wrap items-center gap-3 pt-1">
          <AppButton to="/tokens" class="h-11 px-5 text-[0.95rem]">
            See every token
            <Icon name="arrow-right" />
          </AppButton>
          <a
            :href="`https://pump.fun/coin/${mint}`"
            target="_blank"
            rel="noreferrer"
            class="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
            >pump.fun<Icon name="external-link" class="size-3"
          /></a>
          <a
            :href="`https://solscan.io/token/${mint}`"
            target="_blank"
            rel="noreferrer"
            class="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
            >Solscan<Icon name="external-link" class="size-3"
          /></a>
        </div>
      </header>

      <p class="rounded-xl border border-dashed px-5 py-8 text-sm text-muted-foreground">
        A token's page shows its quantum-drawn picture, its market, the AI/Quantum pool that pays
        for its agent, and every session the agent runs on its challenge.
      </p>
    </template>
  </div>
</template>
