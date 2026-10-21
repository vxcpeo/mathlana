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
 *  "With results" only counts what Qubitess's own check verified. */
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
    return "No checked result yet. One shows here the moment Qubitess's check passes.";
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
  <div class="cq-page">
    <header class="cq-pagehead cq-tokens__pagehead">
      <div class="cq-pagehead__head">
        <p class="cq-kicker">
          <span aria-hidden="true" class="cq-dot cq-dot--live cq-live-pulse" />Tokens on Qubitess
        </p>

        <h1 class="cq-runhead cq-tokens__runhead">
          <span class="cq-runhead__line">Every token funds an agent.</span>
          <span class="cq-runhead__line cq-runhead__line--dim">Watch them work.</span>
        </h1>
      </div>

      <div class="cq-pagehead__edge">
        <p class="cq-lede">
          Each token's fees fill its AI/Quantum pool, which pays an AI agent and quantum computer runs
          on a cryptography challenge, live and in public. A result counts only when a machine checks
          it.
        </p>

        <div class="cq-inline cq-tokens__actions">
          <AppButton to="/launch" size="lg">
            Launch a token
            <Icon name="arrow-right" :size="15" />
          </AppButton>
          <AppButton to="/#how" variant="ghost" size="lg">
            How it works
          </AppButton>
        </div>
      </div>
    </header>

    <dl aria-label="Qubitess in figures" class="cq-band cq-tokens__figures">
      <div class="cq-stat">
        <dt class="cq-stat__label">Tokens</dt>
        <dd class="cq-stat__value cq-num">
          {{ group(TOKENS.length) }}
          <span v-if="launchedToday" class="cq-tokens__delta">+{{ launchedToday }} in 24h</span>
        </dd>
      </div>

      <div class="cq-stat">
        <dt class="cq-stat__label">
          <span aria-hidden="true" class="cq-dot cq-tokens__working" />Working
        </dt>
        <dd class="cq-stat__value cq-num cq-tone-accent">
          {{ group(working) }}
        </dd>
      </div>

      <div class="cq-stat">
        <dt class="cq-stat__label">Sessions</dt>
        <dd class="cq-stat__value cq-num">
          {{ group(sessions) }}
        </dd>
      </div>

      <div class="cq-stat">
        <dt class="cq-stat__label">Pools spent</dt>
        <dd class="cq-stat__value cq-num">
          $0.00
        </dd>
      </div>

      <div class="cq-stat">
        <dt class="cq-stat__label">Checked</dt>
        <dd class="cq-stat__value cq-num cq-tone-live">
          {{ group(checked) }}
        </dd>
      </div>

      <div class="cq-stat">
        <dt class="cq-stat__label cq-inline">
          <Icon name="badge-check" :size="12" :stroke-width="1.75" />Verified
        </dt>
        <dd class="cq-stat__value cq-num cq-tone-live">
          {{ group(verified) }}
        </dd>
      </div>
    </dl>

    <div class="cq-stage cq-tokens__stage">
      <div class="cq-stage__main">
        <OfficialTokenRow :token="OFFICIAL_TOKEN" :market="market[OFFICIAL_TOKEN.mint] ?? null" />

        <section aria-labelledby="tokens-heading" class="cq-sheet cq-tokens">
          <h2 id="tokens-heading" class="sr-only">{{ countLabel }}</h2>

          <div class="cq-tokens__command">
            <SegmentedControl v-model="filter" :items="TOKEN_FILTERS" aria-label="Show" />

            <label class="cq-tokens__search">
              <span class="sr-only">Search by name or ticker…</span>
              <span class="cq-tokens__searchbox">
                <Icon name="search" :size="14" class="cq-tokens__glyph" />
                <input
                  v-model="query"
                  type="search"
                  name="q"
                  placeholder="Search by name or ticker…"
                  autocomplete="off"
                  spellcheck="false"
                  class="cq-input cq-tokens__input"
                />
              </span>
            </label>

            <span class="cq-index cq-tokens__count" aria-hidden="true">
              {{ countLabel }}
            </span>
          </div>

          <ul v-if="visible.length" class="cq-ledger cq-tokens__ledger">
            <li v-for="token in visible" :key="token.mint">
              <TokenGridCard :token="token" :market="market[token.mint] ?? null" />
            </li>
          </ul>

          <p v-else class="cq-empty cq-small cq-tokens__empty">
            {{ emptyMessage }}
          </p>
        </section>
      </div>

      <aside class="cq-stage__edge">
        <ResearchLogCard :spent-usd="0" :working="working > 0" :log="RESEARCH_LOG" />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.cq-tokens__runhead {
  display: grid;
  gap: 2px;
}

.cq-tokens__pagehead {
  align-items: start;
}

.cq-tokens__actions {
  padding-top: 2px;
}

/* Figures strip: one dark command band, six ruled counters. */
.cq-tokens__figures {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin: 0 0 clamp(26px, 3.2vw, 46px);
  padding: 0;
  border: 1px solid #1b2230;
  border-radius: var(--cq-radius);
  background: #1b2230;
  color: #eef2f9;
  overflow: clip;
}

.cq-tokens__figures .cq-stat {
  gap: 6px;
  padding: clamp(14px, 1.5vw, 19px) clamp(14px, 1.8vw, 20px);
  background: #0a0b0d;
  border-right: 0;
}

.cq-tokens__figures .cq-stat__label {
  color: #93a0b5;
}

.cq-tokens__figures .cq-stat__value {
  color: #eef2f9;
  font-size: clamp(1.35rem, 1.9vw, 1.75rem);
}

.cq-tokens__figures .cq-tone-accent {
  color: #9aa7ff;
}

.cq-tokens__figures .cq-tone-live {
  color: #5fd6a4;
}

.cq-tokens__delta {
  display: block;
  margin-top: 3px;
  font-family: var(--cq-mono);
  font-size: 0.66rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: #93a0b5;
}

.cq-tokens__working {
  display: inline-block;
  margin-right: 6px;
  color: #5fd6a4;
  vertical-align: middle;
}

/* The directory sheet: a ruled ledger, not a card grid. */
.cq-tokens__stage {
  padding-top: 0;
  border-top: 0;
}

.cq-tokens {
  gap: 0;
  overflow: clip;
}

.cq-tokens__command {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
  padding: 14px clamp(16px, 2vw, 22px);
  border-bottom: 1px solid var(--cq-line);
}

.cq-tokens__search {
  flex: 1 1 200px;
  max-width: 300px;
  min-width: 0;
}

.cq-tokens__searchbox {
  position: relative;
  display: block;
  min-width: 0;
}

.cq-tokens__glyph {
  position: absolute;
  top: 50%;
  left: 12px;
  translate: 0 -50%;
  color: var(--cq-muted);
  pointer-events: none;
}

.cq-tokens__input {
  padding-left: 33px;
}

.cq-tokens__count {
  margin-left: auto;
  white-space: nowrap;
}

.cq-tokens__ledger {
  border-top: 0;
}

.cq-tokens__ledger :deep(.cq-entry) {
  padding-inline: clamp(16px, 2vw, 22px);
}

.cq-tokens__ledger li:last-child :deep(.cq-ledger__row) {
  border-bottom: 0;
}

.cq-tokens__empty {
  border-top: 0;
  margin: 0;
  padding: 18px clamp(16px, 2vw, 22px) 22px;
}

@media (min-width: 900px) {
  .cq-tokens__figures {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .cq-tokens__search {
    flex-basis: 100%;
    max-width: none;
  }

  .cq-tokens__count {
    margin-left: 0;
  }
}
</style>
