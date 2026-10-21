<script setup>
/**
 * `/tokens` — the token directory: hero with the live research log, the
 * platform's own token pinned on top, then the filterable grid.
 */
import { computed, ref } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
import Icon from "@/components/ui/Icon.vue";
import OfficialTokenRow from "@/components/tokens/OfficialTokenRow.vue";
import ResearchLogCard from "@/components/tokens/ResearchLogCard.vue";
import SegmentedControl from "@/components/tokens/SegmentedControl.vue";
import TokenGridCard from "@/components/tokens/TokenGridCard.vue";
import { tokenCount } from "@/components/tokens/market";
import { ALL_MINTS, OFFICIAL_TOKEN, RESEARCH_LOG, TOKENS, TOKEN_FILTERS } from "@/data/tokens";
import { useMarket } from "@/composables/useMarket";
import { group } from "@/lib/format";

const { market } = useMarket(ALL_MINTS);

const filter = ref(TOKEN_FILTERS[0].key);
const query = ref("");

/** "New" has no session yet, "Researching" has run but proven nothing, and
 *  "With results" only counts what Mathlana's own check verified. */
const matchesFilter = (token) => {
  const sessions = token.sessions ?? 0;
  if (filter.value === "researching") return sessions > 0 && !token.verified;
  if (filter.value === "results") return Boolean(token.verified);
  return sessions === 0;
};

const matchesQuery = (token) => {
  const q = query.value.trim().toLowerCase();
  if (!q) return true;
  return (
    token.name.toLowerCase().includes(q) || token.ticker.toLowerCase().includes(q)
  );
};

const visible = computed(() =>
  TOKENS.filter((token) => matchesFilter(token) && matchesQuery(token)),
);

const countLabel = computed(() => tokenCount(visible.value.length));

/** Nothing to show: say why, in the same voice as the reference's empty states. */
const emptyMessage = computed(() => {
  if (query.value.trim()) return "No token matches that name or ticker.";
  if (filter.value === "researching")
    return "No token is researching yet. An agent starts once a pool pays for a session.";
  if (filter.value === "results")
    return "No checked result yet. One shows here the moment Mathlana's check passes.";
  return "No token here yet. One shows up the moment it launches.";
});

/** Tokens launched in the last 24 hours, shown next to the total. */
const launchedToday = computed(() => {
  const dayAgo = Date.now() - 86_400_000;
  return TOKENS.filter((token) => Date.parse(token.createdAt ?? 0) > dayAgo).length;
});

const working = computed(() => TOKENS.filter((token) => (token.sessions ?? 0) > 0).length);
const sessions = computed(() => TOKENS.reduce((total, token) => total + (token.sessions ?? 0), 0));
const checked = computed(() => TOKENS.filter((token) => token.checked).length);
const verified = computed(() => TOKENS.filter((token) => token.verified).length);
</script>

<template>
  <div class="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
    <section class="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1.618fr_1fr]">
      <div class="flex min-w-0 flex-col gap-5">
        <p class="flex items-center gap-2 text-sm whitespace-nowrap text-muted-foreground">
          <span aria-hidden="true" class="size-1.5 shrink-0 rounded-full bg-brand" />Tokens on
          Mathlana
        </p>

        <h1 class="headline text-[clamp(1.15rem,6vw,2.25rem)] xl:text-[2.6rem]">
          <span class="block whitespace-nowrap text-foreground">Every token funds an agent.</span>
          <span class="block whitespace-nowrap text-quiet">Watch them work.</span>
        </h1>

        <p class="max-w-xl text-pretty text-muted-foreground">
          Each token's fees fill its AI/Quantum pool, which pays an AI agent and quantum computer
          runs on a cryptography challenge, live and in public. A result counts only when a machine
          checks it.
        </p>

        <div class="flex flex-wrap items-center gap-3">
          <AppButton to="/launch" class="h-11 px-5 text-[0.95rem]">
            Launch a token
            <Icon name="arrow-right" />
          </AppButton>
          <AppButton to="/#how" variant="ghost" class="h-11 px-4 text-[0.95rem]">
            How it works
          </AppButton>
        </div>

        <div class="mt-auto pt-2">
          <dl
            aria-label="Mathlana in figures"
            class="grid grid-cols-3 gap-y-4 border-y py-3.5 xl:grid-cols-6 xl:divide-x"
          >
            <div class="flex min-w-0 flex-col gap-1 pr-3 xl:px-4 xl:first:pl-0 xl:last:pr-0">
              <dt class="flex items-center gap-1.5 text-[0.7rem] whitespace-nowrap text-muted-foreground">
                Tokens
              </dt>
              <dd
                class="flex items-baseline gap-1.5 font-mono text-[0.95rem] leading-none font-medium whitespace-nowrap figures"
              >
                {{ group(TOKENS.length) }}
                <span
                  v-if="launchedToday"
                  class="text-[0.66rem] font-normal text-muted-foreground"
                  >+{{ launchedToday }} in 24h</span
                >
              </dd>
            </div>

            <div class="flex min-w-0 flex-col gap-1 pr-3 xl:px-4 xl:first:pl-0 xl:last:pr-0">
              <dt class="flex items-center gap-1.5 text-[0.7rem] whitespace-nowrap text-muted-foreground">
                <span aria-hidden="true" class="relative flex size-1.5">
                  <span class="relative size-1.5 rounded-full bg-brand" />
                </span>Working
              </dt>
              <dd
                class="flex items-baseline gap-1.5 font-mono text-[0.95rem] leading-none font-medium whitespace-nowrap figures text-brand-text"
              >
                {{ group(working) }}
              </dd>
            </div>

            <div class="flex min-w-0 flex-col gap-1 pr-3 xl:px-4 xl:first:pl-0 xl:last:pr-0">
              <dt class="flex items-center gap-1.5 text-[0.7rem] whitespace-nowrap text-muted-foreground">
                Sessions
              </dt>
              <dd
                class="flex items-baseline gap-1.5 font-mono text-[0.95rem] leading-none font-medium whitespace-nowrap figures"
              >
                {{ group(sessions) }}
              </dd>
            </div>

            <div class="flex min-w-0 flex-col gap-1 pr-3 xl:px-4 xl:first:pl-0 xl:last:pr-0">
              <dt class="flex items-center gap-1.5 text-[0.7rem] whitespace-nowrap text-muted-foreground">
                Pools spent
              </dt>
              <dd
                class="flex items-baseline gap-1.5 font-mono text-[0.95rem] leading-none font-medium whitespace-nowrap figures"
              >
                $0.00
              </dd>
            </div>

            <div class="flex min-w-0 flex-col gap-1 pr-3 xl:px-4 xl:first:pl-0 xl:last:pr-0">
              <dt class="flex items-center gap-1.5 text-[0.7rem] whitespace-nowrap text-muted-foreground">
                Checked
              </dt>
              <dd
                class="flex items-baseline gap-1.5 font-mono text-[0.95rem] leading-none font-medium whitespace-nowrap figures text-proven-text"
              >
                {{ group(checked) }}
              </dd>
            </div>

            <div class="flex min-w-0 flex-col gap-1 pr-3 xl:px-4 xl:first:pl-0 xl:last:pr-0">
              <dt class="flex items-center gap-1.5 text-[0.7rem] whitespace-nowrap text-muted-foreground">
                <Icon name="badge-check" class="size-3" :stroke-width="1.75" />Verified
              </dt>
              <dd
                class="flex items-baseline gap-1.5 font-mono text-[0.95rem] leading-none font-medium whitespace-nowrap figures text-proven-text"
              >
                {{ group(verified) }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <section aria-labelledby="research-log" class="flex min-w-0 flex-col">
        <ResearchLogCard :spent-usd="0" :working="working > 0" :log="RESEARCH_LOG" />
      </section>
    </section>

    <section aria-labelledby="tokens-heading" class="flex flex-col gap-3">
      <h2 id="tokens-heading" class="sr-only">{{ countLabel }}</h2>

      <OfficialTokenRow :token="OFFICIAL_TOKEN" :market="market[OFFICIAL_TOKEN.mint] ?? null" />

      <div class="flex flex-wrap items-center gap-2">
        <SegmentedControl
          v-model="filter"
          :items="TOKEN_FILTERS"
          aria-label="Show"
          class="max-w-full"
        />

        <label class="relative block w-full sm:max-w-xs">
          <Icon
            name="search"
            class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <span class="sr-only">Search by name or ticker…</span>
          <input
            v-model="query"
            type="search"
            name="q"
            placeholder="Search by name or ticker…"
            autocomplete="off"
            spellcheck="false"
            class="h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 pl-9 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
          />
        </label>

        <span class="ml-auto text-sm text-muted-foreground figures" aria-hidden="true">
          {{ countLabel }}
        </span>
      </div>

      <ul
        v-if="visible.length"
        class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        <li
          v-for="token in visible"
          :key="token.mint"
          class="min-w-0 [content-visibility:auto] [contain-intrinsic-size:auto_23rem]"
        >
          <TokenGridCard :token="token" :market="market[token.mint] ?? null" />
        </li>
      </ul>

      <p v-else class="rounded-xl border border-dashed px-5 py-8 text-sm text-muted-foreground">
        {{ emptyMessage }}
      </p>
    </section>
  </div>
</template>
