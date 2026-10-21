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
  <div class="cq-page">
    <template v-if="token">
      <header class="cq-pagehead cq-token__pagehead">
        <div class="cq-pagehead__head cq-token__head">
          <h1 class="cq-runhead cq-runhead--tight cq-token__name">
            {{ token.name }}
          </h1>

          <div class="cq-inline cq-token__ids">
            <span class="cq-mono cq-token__ticker">{{ token.ticker }}</span>
            <NvdaChip />
            <a href="#research" class="cq-token__status">
              <span class="cq-inline cq-token__dotlabel">
                <span aria-hidden="true" class="cq-dot" />
                Waiting for fees
              </span>
            </a>
          </div>

          <div class="cq-inline cq-token__meta">
            <RouterLink
              v-if="token.challengeSlug"
              :to="`/challenges/${token.challengeSlug}`"
              class="cq-inline cq-token__metalink"
            >
              <Icon name="sigma" :size="13" class="cq-tone-accent" />Works on
              {{ token.challengeLabel }}
            </RouterLink>

            <span class="cq-mono cq-token__creator">
              Created by {{ shortAddress(token.creator) }}
            </span>

            <nav class="cq-inline cq-token__links">
              <a
                :href="`https://pump.fun/coin/${token.mint}`"
                target="_blank"
                rel="noreferrer"
                class="cq-tag cq-token__link"
                >pump.fun<Icon name="external-link" :size="11"
              /></a>
              <a
                :href="`https://solscan.io/token/${token.mint}`"
                target="_blank"
                rel="noreferrer"
                class="cq-tag cq-token__link"
                >Solscan<Icon name="external-link" :size="11"
              /></a>
            </nav>
          </div>
        </div>

        <div class="cq-pagehead__edge cq-token__summary">
          <p v-if="snapshot.description" class="cq-lede">
            {{ snapshot.description }}
          </p>

          <p v-if="stakes" class="cq-token__stake">
            <Icon name="shield" :size="14" class="cq-token__stakeicon cq-tone-accent" />
            <span class="cq-token__staketext">
              <span class="cq-strong">{{ stakes.label }}</span>
              <span aria-hidden="true" class="cq-token__sep">·</span>{{ stakes.note }}
            </span>
          </p>

          <a href="#research" class="cq-plate cq-token__board">
            <AiQuantumIcon class="cq-token__boardmark cq-tone-accent" />
            <span class="cq-token__boardbody">
              <span class="cq-inline cq-token__boardhead">
                <span class="cq-h3">AI and quantum board</span>
                <span class="cq-inline cq-token__dotlabel">
                  <span aria-hidden="true" class="cq-dot" />
                  Waiting for fees
                </span>
              </span>
              <span class="cq-small"
                >The agent starts once fees fund it; the board shows where it stands.</span
              >
            </span>
            <span class="cq-inline cq-token__boardcta">
              <span>See it live</span>
              <Icon name="arrow-down" :size="14" :stroke-width="1.75" />
            </span>
          </a>
        </div>
      </header>

      <div class="cq-stage cq-token__stage">
        <div class="cq-stage__main">
          <dl class="cq-sheet cq-token__stats">
            <div v-for="stat in stats" :key="stat.label" class="cq-token__stat">
              <dt class="cq-h4">{{ stat.label }}</dt>
              <dd class="cq-num cq-token__statvalue">
                <span v-if="stat.value !== null">{{ stat.value }}</span>
                <span v-else class="cq-tone-muted">-</span>
              </dd>
            </div>
          </dl>

          <ProgressPanel />

          <ResearchPanel :token="token" :pool="snapshot.pool" />

          <section class="cq-sheet cq-token__results" aria-labelledby="results-title">
            <div class="cq-sheet__head cq-token__resultshead">
              <h2 id="results-title" class="cq-h2">Results</h2>
              <a
                :href="challenge?.host ?? 'https://better.codes'"
                target="_blank"
                rel="noreferrer"
                class="cq-inline cq-token__boardlink"
                >Official leaderboard<Icon name="external-link" :size="11"
              /></a>
            </div>
            <p class="cq-empty cq-small cq-token__empty">
              No result yet. A result shows here the moment Qubitess's check passes.
            </p>
          </section>
        </div>

        <aside class="cq-stage__edge cq-token__edge">
          <div class="cq-sheet cq-token__picture">
            <TokenPicture :mint="token.mint" :name="token.name" :size="132" />
          </div>

          <PoolPanel :pool="snapshot.pool" />

          <FeeSplitPanel />
        </aside>
      </div>
    </template>

    <template v-else>
      <header class="cq-pagehead cq-token__pagehead">
        <div class="cq-pagehead__head cq-token__head">
          <p class="cq-kicker">
            <span aria-hidden="true" class="cq-dot cq-dot--live cq-live-pulse" />Token
          </p>
          <h1 class="cq-runhead">No token at that address</h1>
        </div>

        <div class="cq-pagehead__edge cq-token__summary">
          <p class="cq-lede">
            Qubitess has no token at
            <span class="cq-mono cq-token__mint">{{ mint }}</span>. The address may be mistyped, or
            the token may predate the directory.
          </p>
          <div class="cq-inline cq-token__actions">
            <AppButton to="/tokens" size="lg">
              See every token
              <Icon name="arrow-right" :size="15" />
            </AppButton>
            <a
              :href="`https://pump.fun/coin/${mint}`"
              target="_blank"
              rel="noreferrer"
              class="cq-tag cq-token__link"
              >pump.fun<Icon name="external-link" :size="11"
            /></a>
            <a
              :href="`https://solscan.io/token/${mint}`"
              target="_blank"
              rel="noreferrer"
              class="cq-tag cq-token__link"
              >Solscan<Icon name="external-link" :size="11"
            /></a>
          </div>
        </div>
      </header>

      <p class="cq-note cq-token__fallback">
        A token's page shows its quantum-drawn picture, its market, the AI/Quantum pool that pays
        for its agent, and every session the agent runs on its challenge.
      </p>
    </template>
  </div>
</template>

<style scoped>
.cq-token__pagehead {
  align-items: start;
}

.cq-token__stage {
  padding-top: 0;
  border-top: 0;
}

.cq-token__head {
  display: grid;
  gap: clamp(12px, 1.5vw, 18px);
  min-width: 0;
}

.cq-token__name {
  min-width: 0;
  overflow-wrap: anywhere;
}

.cq-token__ids {
  gap: 10px 14px;
  min-width: 0;
}

.cq-token__ticker {
  font-size: 0.98rem;
  color: var(--cq-muted);
  overflow-wrap: anywhere;
}

.cq-token__status {
  color: inherit;
}

.cq-token__dotlabel {
  gap: 7px;
  font-family: var(--cq-mono);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cq-muted);
  white-space: nowrap;
}

.cq-token__dotlabel .cq-dot {
  color: var(--cq-line-strong);
}

.cq-token__meta {
  gap: 8px 20px;
  min-width: 0;
  font-family: var(--cq-mono);
  font-size: 0.72rem;
  color: var(--cq-muted);
}

.cq-token__metalink {
  gap: 6px;
  color: var(--cq-muted);
  transition: color var(--cq-fast) var(--cq-ease);
}

.cq-token__metalink:hover {
  color: var(--cq-accent-text);
}

.cq-token__creator {
  min-width: 0;
  overflow-wrap: anywhere;
}

.cq-token__links {
  gap: 8px;
}

.cq-token__link {
  background: var(--cq-sheet);
  transition: border-color var(--cq-fast) var(--cq-ease), color var(--cq-fast) var(--cq-ease);
}

.cq-token__link:hover {
  border-color: var(--cq-ink);
  color: var(--cq-ink);
}

.cq-token__summary {
  gap: clamp(12px, 1.5vw, 18px);
}

.cq-token__stake {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 72ch;
  font-size: 0.88rem;
  color: var(--cq-ink-soft);
}

.cq-token__stakeicon {
  margin-top: 3px;
  flex-shrink: 0;
}

.cq-token__staketext {
  min-width: 0;
  overflow-wrap: anywhere;
}

.cq-token__sep {
  padding: 0 6px;
  color: var(--cq-line-strong);
}

.cq-token__board {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  align-self: stretch;
  gap: 14px;
  padding: 14px 16px;
  text-decoration: none;
  transition: border-color var(--cq-fast) var(--cq-ease), background-color var(--cq-fast) var(--cq-ease);
}

.cq-token__board:hover {
  border-color: var(--cq-accent-line);
  background: var(--cq-accent-soft);
}

.cq-token__boardmark {
  font-size: 22px;
}

.cq-token__boardbody {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.cq-token__boardhead {
  gap: 4px 14px;
  min-width: 0;
}

.cq-token__boardcta {
  grid-column: 1 / -1;
  gap: 6px;
  font-family: var(--cq-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--cq-accent-text);
  white-space: nowrap;
}

/* Four figures as one ruled sheet, label left, figure right. */
.cq-token__stats {
  gap: 0;
  overflow: clip;
}

.cq-token__stat {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding: 12px clamp(16px, 2vw, 22px);
  border-bottom: 1px solid var(--cq-line-soft);
}

.cq-token__stat:last-child {
  border-bottom: 0;
}

.cq-token__stat .cq-h4 {
  color: var(--cq-muted);
}

.cq-token__statvalue {
  font-size: 1rem;
  color: var(--cq-ink);
  text-align: right;
  overflow-wrap: anywhere;
}

.cq-token__results {
  gap: 0;
  overflow: clip;
}

.cq-token__resultshead {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 6px 16px;
  padding: 16px clamp(16px, 2vw, 22px) 13px;
}

.cq-token__resultshead .cq-h2 {
  font-size: clamp(1.4rem, 2vw, 1.8rem);
}

.cq-token__boardlink {
  gap: 6px;
  font-family: var(--cq-mono);
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  color: var(--cq-muted);
  transition: color var(--cq-fast) var(--cq-ease);
}

.cq-token__boardlink:hover {
  color: var(--cq-accent-text);
}

.cq-token__empty {
  border-top: 0;
  margin: 0;
  padding: 2px clamp(16px, 2vw, 22px) 20px;
}

.cq-token__picture {
  display: grid;
  place-items: center;
  padding: clamp(14px, 2vw, 20px);
}

.cq-token__mint {
  overflow-wrap: anywhere;
}

.cq-token__actions {
  gap: 10px;
}

.cq-token__fallback {
  margin-top: var(--cq-t4);
  max-width: 72ch;
}
</style>
