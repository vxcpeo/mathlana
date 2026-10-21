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
  <div class="pp-page">
    <template v-if="token">
      <div class="pp-head">
        <div class="pp-token__title">
          <h1 class="pp-runhead pp-runhead--tight">
            {{ token.name }}
          </h1>

          <div class="pp-inline pp-token__ids">
            <span class="pp-mono pp-token__ticker">{{ token.ticker }}</span>
            <NvdaChip />
            <a href="#research" class="pp-token__status">
              <span class="pp-inline pp-token__dotlabel">
                <span aria-hidden="true" class="pp-dot" />
                Waiting for fees
              </span>
            </a>
          </div>
        </div>

        <div class="pp-inline pp-token__meta">
          <RouterLink
            v-if="token.challengeSlug"
            :to="`/challenges/${token.challengeSlug}`"
            class="pp-inline pp-token__metalink"
          >
            <Icon name="sigma" :size="13" class="pp-tone-accent" />Works on
            {{ token.challengeLabel }}
          </RouterLink>

          <span class="pp-mono pp-token__creator">
            Created by {{ shortAddress(token.creator) }}
          </span>

          <nav class="pp-inline pp-token__links">
            <a
              :href="`https://pump.fun/coin/${token.mint}`"
              target="_blank"
              rel="noreferrer"
              class="pp-tag pp-token__link"
              >pump.fun<Icon name="external-link" :size="11"
            /></a>
            <a
              :href="`https://solscan.io/token/${token.mint}`"
              target="_blank"
              rel="noreferrer"
              class="pp-tag pp-token__link"
              >Solscan<Icon name="external-link" :size="11"
            /></a>
          </nav>
        </div>

        <p v-if="stakes" class="pp-token__stake">
          <Icon name="shield" :size="14" class="pp-token__stakeicon pp-tone-accent" />
          <span class="pp-token__staketext">
            <span class="pp-strong">{{ stakes.label }}</span>
            <span aria-hidden="true" class="pp-token__sep">·</span>{{ stakes.note }}
          </span>
        </p>

        <p v-if="snapshot.description" class="pp-lede">
          {{ snapshot.description }}
        </p>

        <a href="#research" class="pp-plate pp-token__board">
          <AiQuantumIcon class="pp-token__boardmark pp-tone-accent" />
          <span class="pp-token__boardbody">
            <span class="pp-inline pp-token__boardhead">
              <span class="pp-h3">AI and quantum board</span>
              <span class="pp-inline pp-token__dotlabel">
                <span aria-hidden="true" class="pp-dot" />
                Waiting for fees
              </span>
            </span>
            <span class="pp-small"
              >The agent starts once fees fund it; the board shows where it stands.</span
            >
          </span>
          <span class="pp-inline pp-token__boardcta">
            <span>See it live</span>
            <Icon name="arrow-down" :size="14" :stroke-width="1.75" />
          </span>
        </a>
      </div>

      <div class="pp-stage pp-token__stage">
        <div class="pp-wide">
          <dl class="pp-stats pp-token__stats">
            <div v-for="stat in stats" :key="stat.label" class="pp-stat">
              <dt class="pp-stat__label">{{ stat.label }}</dt>
              <dd class="pp-stat__value pp-num">
                <span v-if="stat.value !== null">{{ stat.value }}</span>
                <span v-else class="pp-tone-muted">-</span>
              </dd>
            </div>
          </dl>

          <ProgressPanel />

          <ResearchPanel :token="token" :pool="snapshot.pool" />

          <div class="pp-split">
            <section class="pp-sec" aria-labelledby="results-title">
              <div class="pp-sec__head">
                <h2 id="results-title" class="pp-h2">Results</h2>
                <a
                  :href="challenge?.host ?? 'https://better.codes'"
                  target="_blank"
                  rel="noreferrer"
                  class="pp-inline pp-token__boardlink"
                  >Official leaderboard<Icon name="external-link" :size="11"
                /></a>
              </div>
              <p class="pp-empty pp-small">
                No result yet. A result shows here the moment Qubitlane's check passes.
              </p>
            </section>

            <FeeSplitPanel />
          </div>
        </div>

        <div class="pp-margin pp-token__margin">
          <div class="pp-art-frame pp-token__picture">
            <TokenPicture :mint="token.mint" :name="token.name" :size="132" />
          </div>

          <PoolPanel :pool="snapshot.pool" />
        </div>
      </div>
    </template>

    <template v-else>
      <div class="pp-head">
        <p class="pp-kicker">
          <span aria-hidden="true" class="pp-dot pp-dot--live pp-live-pulse" />Token
        </p>
        <h1 class="pp-runhead">No token at that address</h1>
        <p class="pp-lede">
          Qubitlane has no token at
          <span class="pp-mono pp-token__mint">{{ mint }}</span>. The address may be mistyped, or
          the token may predate the directory.
        </p>
        <div class="pp-inline pp-token__actions">
          <AppButton to="/tokens" size="lg">
            See every token
            <Icon name="arrow-right" :size="15" />
          </AppButton>
          <a
            :href="`https://pump.fun/coin/${mint}`"
            target="_blank"
            rel="noreferrer"
            class="pp-tag pp-token__link"
            >pump.fun<Icon name="external-link" :size="11"
          /></a>
          <a
            :href="`https://solscan.io/token/${mint}`"
            target="_blank"
            rel="noreferrer"
            class="pp-tag pp-token__link"
            >Solscan<Icon name="external-link" :size="11"
          /></a>
        </div>
      </div>

      <p class="pp-note pp-token__fallback">
        A token's page shows its quantum-drawn picture, its market, the AI/Quantum pool that pays
        for its agent, and every session the agent runs on its challenge.
      </p>
    </template>
  </div>
</template>

<style scoped>
.pp-token__title {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.pp-token__ids {
  gap: 10px 14px;
  min-width: 0;
}

.pp-token__ticker {
  font-size: 0.98rem;
  color: var(--pp-muted);
  overflow-wrap: anywhere;
}

.pp-token__status {
  color: inherit;
}

.pp-token__dotlabel {
  gap: 7px;
  font-family: var(--pp-mono);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--pp-muted);
  white-space: nowrap;
}

.pp-token__dotlabel .pp-dot {
  color: var(--pp-line-strong);
}

.pp-token__meta {
  gap: 8px 20px;
  min-width: 0;
  font-family: var(--pp-mono);
  font-size: 0.72rem;
  color: var(--pp-muted);
}

.pp-token__metalink {
  gap: 6px;
  color: var(--pp-muted);
  transition: color var(--pp-fast) var(--pp-ease);
}

.pp-token__metalink:hover {
  color: var(--pp-accent-text);
}

.pp-token__creator {
  min-width: 0;
  overflow-wrap: anywhere;
}

.pp-token__links {
  gap: 8px;
}

.pp-token__link {
  background: var(--pp-sheet);
  transition: border-color var(--pp-fast) var(--pp-ease), color var(--pp-fast) var(--pp-ease);
}

.pp-token__link:hover {
  border-color: var(--pp-ink);
  color: var(--pp-ink);
}

.pp-token__stake {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 72ch;
  font-size: 0.88rem;
  color: var(--pp-ink-soft);
}

.pp-token__stakeicon {
  margin-top: 3px;
  flex-shrink: 0;
}

.pp-token__staketext {
  min-width: 0;
  overflow-wrap: anywhere;
}

.pp-token__sep {
  padding: 0 6px;
  color: var(--pp-line-strong);
}

.pp-token__board {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  transition: border-color var(--pp-fast) var(--pp-ease), background-color var(--pp-fast) var(--pp-ease);
}

.pp-token__board:hover {
  border-color: var(--pp-accent-line);
  background: var(--pp-accent-soft);
}

.pp-token__boardmark {
  font-size: 22px;
}

.pp-token__boardbody {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.pp-token__boardhead {
  gap: 4px 14px;
  min-width: 0;
}

.pp-token__boardcta {
  gap: 6px;
  font-family: var(--pp-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--pp-accent-text);
  white-space: nowrap;
}

.pp-token__stage {
  padding-top: var(--pp-t4);
}

.pp-token__stats {
  margin-top: var(--pp-t1);
}

.pp-token__boardlink {
  gap: 6px;
  font-family: var(--pp-mono);
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  color: var(--pp-muted);
  transition: color var(--pp-fast) var(--pp-ease);
}

.pp-token__boardlink:hover {
  color: var(--pp-accent-text);
}

.pp-token__margin {
  gap: var(--pp-t3);
}

.pp-token__picture {
  display: grid;
  justify-self: start;
  padding: 14px;
}

.pp-token__mint {
  overflow-wrap: anywhere;
}

.pp-token__actions {
  gap: 10px;
}

.pp-token__fallback {
  margin-top: var(--pp-t4);
  max-width: 72ch;
}

@media (max-width: 1180px) {
  .pp-token__margin {
    grid-template-columns: minmax(0, 1fr);
    order: -1;
  }
}

@media (max-width: 560px) {
  .pp-token__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pp-token__board {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .pp-token__boardcta {
    grid-column: 1 / -1;
  }
}
</style>
