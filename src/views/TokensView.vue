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
 *  "With results" only counts what Qubitlane's own check verified. */
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
    return "No checked result yet. One shows here the moment Qubitlane's check passes.";
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
  <div class="pp-page">
    <div class="pp-head">
      <p class="pp-kicker">
        <span aria-hidden="true" class="pp-dot pp-dot--live pp-live-pulse" />Tokens on Qubitlane
      </p>

      <h1 class="pp-runhead pp-tokens__runhead">
        <span>Every token funds an agent.</span>
        <span class="pp-tone-muted">Watch them work.</span>
      </h1>

      <p class="pp-lede">
        Each token's fees fill its AI/Quantum pool, which pays an AI agent and quantum computer runs
        on a cryptography challenge, live and in public. A result counts only when a machine checks
        it.
      </p>

      <div class="pp-inline pp-tokens__actions">
        <AppButton to="/launch" size="lg">
          Launch a token
          <Icon name="arrow-right" :size="15" />
        </AppButton>
        <AppButton to="/#how" variant="ghost" size="lg">
          How it works
        </AppButton>
      </div>

      <dl aria-label="Qubitlane in figures" class="pp-stats pp-tokens__figures">
        <div class="pp-stat">
          <dt class="pp-stat__label">Tokens</dt>
          <dd class="pp-stat__value pp-num">
            {{ group(TOKENS.length) }}
            <span v-if="launchedToday" class="pp-tokens__delta">+{{ launchedToday }} in 24h</span>
          </dd>
        </div>

        <div class="pp-stat">
          <dt class="pp-stat__label">
            <span aria-hidden="true" class="pp-dot pp-tokens__working" />Working
          </dt>
          <dd class="pp-stat__value pp-num pp-tone-accent">
            {{ group(working) }}
          </dd>
        </div>

        <div class="pp-stat">
          <dt class="pp-stat__label">Sessions</dt>
          <dd class="pp-stat__value pp-num">
            {{ group(sessions) }}
          </dd>
        </div>

        <div class="pp-stat">
          <dt class="pp-stat__label">Pools spent</dt>
          <dd class="pp-stat__value pp-num">
            $0.00
          </dd>
        </div>

        <div class="pp-stat">
          <dt class="pp-stat__label">Checked</dt>
          <dd class="pp-stat__value pp-num pp-tone-live">
            {{ group(checked) }}
          </dd>
        </div>

        <div class="pp-stat">
          <dt class="pp-stat__label pp-inline">
            <Icon name="badge-check" :size="12" :stroke-width="1.75" />Verified
          </dt>
          <dd class="pp-stat__value pp-num pp-tone-live">
            {{ group(verified) }}
          </dd>
        </div>
      </dl>
    </div>

    <div class="pp-stage pp-tokens__stage">
      <section aria-labelledby="tokens-heading" class="pp-wide pp-tokens">
        <h2 id="tokens-heading" class="sr-only">{{ countLabel }}</h2>

        <OfficialTokenRow :token="OFFICIAL_TOKEN" :market="market[OFFICIAL_TOKEN.mint] ?? null" />

        <div class="pp-tokens__command">
          <SegmentedControl v-model="filter" :items="TOKEN_FILTERS" aria-label="Show" />

          <label class="pp-tokens__search">
            <span class="sr-only">Search by name or ticker…</span>
            <span class="pp-tokens__searchbox">
              <Icon name="search" :size="14" class="pp-tokens__glyph" />
              <input
                v-model="query"
                type="search"
                name="q"
                placeholder="Search by name or ticker…"
                autocomplete="off"
                spellcheck="false"
                class="pp-input pp-tokens__input"
              />
            </span>
          </label>

          <span class="pp-index pp-tokens__count" aria-hidden="true">
            {{ countLabel }}
          </span>
        </div>

        <ul v-if="visible.length" class="pp-ledger pp-tokens__ledger">
          <li v-for="token in visible" :key="token.mint">
            <TokenGridCard :token="token" :market="market[token.mint] ?? null" />
          </li>
        </ul>

        <p v-else class="pp-empty pp-small">
          {{ emptyMessage }}
        </p>
      </section>

      <div class="pp-margin pp-tokens__aside">
        <section aria-labelledby="research-log">
          <ResearchLogCard :spent-usd="0" :working="working > 0" :log="RESEARCH_LOG" />
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pp-tokens__runhead {
  display: grid;
  gap: 2px;
}

.pp-tokens__actions {
  padding-top: 2px;
}

.pp-tokens__figures {
  margin-top: var(--pp-t2);
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.pp-tokens__delta {
  display: block;
  margin-top: 3px;
  font-family: var(--pp-mono);
  font-size: 0.66rem;
  font-weight: 400;
  letter-spacing: 0;
  color: var(--pp-muted);
}

.pp-tokens__working {
  display: inline-block;
  margin-right: 6px;
  color: var(--pp-live);
  vertical-align: middle;
}

.pp-tokens__stage {
  padding-top: var(--pp-t4);
}

.pp-tokens {
  gap: 0;
}

.pp-tokens__command {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--pp-line);
}

.pp-tokens__search {
  flex: 1 1 200px;
  max-width: 300px;
  min-width: 0;
}

.pp-tokens__searchbox {
  position: relative;
  display: block;
  min-width: 0;
}

.pp-tokens__glyph {
  position: absolute;
  top: 50%;
  left: 12px;
  translate: 0 -50%;
  color: var(--pp-muted);
  pointer-events: none;
}

.pp-tokens__input {
  padding-left: 33px;
}

.pp-tokens__count {
  margin-left: auto;
  white-space: nowrap;
}

.pp-tokens__ledger {
  border-top: 0;
}

@media (min-width: 1180px) {
  .pp-tokens__figures {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

@media (max-width: 1180px) {
  .pp-tokens__aside {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 560px) {
  .pp-tokens__figures {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pp-tokens__search {
    flex-basis: 100%;
    max-width: none;
  }

  .pp-tokens__count {
    margin-left: 0;
  }
}
</style>
