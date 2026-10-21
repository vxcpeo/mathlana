<script setup>
/**
 * The token card used by the `/tokens` grid (and by challenge pages that list
 * their tokens). Markup and classes follow the reference 1:1.
 */
import { computed } from "vue";
import { RouterLink } from "vue-router";
import Icon from "@/components/ui/Icon.vue";
import NvdaChip from "@/components/tokens/NvdaChip.vue";
import TokenPicture from "@/components/tokens/TokenPicture.vue";
import { priceLabel } from "@/components/tokens/market";
import { change24h, compactUsd, curvePercent, shortAddress, timeAgo } from "@/lib/format";

const props = defineProps({
  token: { type: Object, required: true },
  /** Live market record; falls back to the snapshot baked into the token. */
  market: { type: Object, default: null },
});

const m = computed(() => props.market ?? props.token.fallback ?? null);
const change = computed(() => change24h(m.value?.change24h));
const curve = computed(() => {
  const value = Number(m.value?.curve ?? 0);
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
});
const graduation = computed(() => curvePercent(curve.value) ?? 0);
const sessions = computed(() => props.token.sessions ?? 0);
</script>

<template>
  <RouterLink :to="`/t/${token.mint}`" class="pp-ledger__row pp-entry">
    <div class="pp-entry__lead">
      <TokenPicture :mint="token.mint" :name="token.name" :size="48" />

      <div class="pp-entry__names">
        <h3 translate="no" class="pp-h3 pp-entry__name">
          {{ token.name }}
        </h3>
        <span class="pp-inline pp-entry__tagline">
          <span translate="no" class="pp-mono pp-small">{{ token.ticker }}</span>
          <NvdaChip />
        </span>
        <span class="pp-inline pp-entry__byline">
          <span translate="no">by {{ shortAddress(token.creator) }}</span>
          <span aria-hidden="true" class="pp-entry__sep">/</span>
          <time :datetime="token.createdAt ?? undefined">{{ timeAgo(token.createdAt) }}</time>
        </span>
      </div>
    </div>

    <div class="pp-entry__status">
      <span class="pp-inline pp-entry__state">
        <span aria-hidden="true" class="pp-dot" />
        Waiting for fees
      </span>
      <span class="pp-mono pp-entry__sessions">{{ sessions }} sessions</span>
      <span class="pp-inline pp-entry__state pp-tone-muted">
        <span aria-hidden="true" class="pp-dot" />
        <span>No progress yet</span>
      </span>
    </div>

    <dl class="pp-entry__facts">
      <div class="pp-entry__fact">
        <dt class="pp-h4">Price</dt>
        <dd class="pp-entry__value">
          <span class="pp-entry__price">{{ priceLabel(m?.priceUsd) }}</span>
          <span
            title="24h change"
            class="pp-entry__delta"
            :class="change?.up ? 'pp-tone-live' : 'pp-tone-muted'"
          >
            <template v-if="change">{{ change.arrow }} {{ change.label }}</template>
            <template v-else>-</template>
            <span class="sr-only"> 24h change</span>
          </span>
        </dd>
      </div>
      <div class="pp-entry__fact">
        <dt class="pp-h4">Market cap</dt>
        <dd class="pp-entry__value">{{ compactUsd(m?.marketCapUsd) }}</dd>
      </div>
      <div class="pp-entry__fact">
        <dt class="pp-h4">Vol 24h</dt>
        <dd class="pp-entry__value">{{ compactUsd(m?.volume24hUsd) }}</dd>
      </div>
    </dl>

    <div class="pp-entry__curve">
      <div
        class="pp-meter"
        role="meter"
        aria-label="Curve"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="Math.round(curve * 100)"
      >
        <div class="pp-meter__fill pp-entry__fill" :style="{ transform: `scaleX(${curve})` }" />
      </div>
      <span class="pp-mono pp-entry__graduation">{{ graduation }}% to graduation</span>
    </div>

    <Icon name="arrow-right" :size="16" class="pp-entry__goto" />

    <div v-if="token.challengeLabel" class="pp-entry__mission">
      <span class="pp-inline pp-entry__missionline">
        <Icon name="shield" :size="13" class="pp-tone-accent" />
        <span class="pp-entry__missiontext">
          <span class="pp-strong">{{ token.challengeVerb }}</span>
          <span aria-hidden="true"> / </span>{{ token.challengeDescription }}
        </span>
      </span>
      <span class="pp-inline pp-entry__missionline pp-tone-muted">
        <Icon name="sigma" :size="13" class="pp-tone-accent" />
        <span class="pp-entry__missiontext">{{ token.challengeLabel }}</span>
      </span>
    </div>
  </RouterLink>
</template>

<style scoped>
.pp-entry {
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.8fr) minmax(0, 1.25fr) minmax(0, 0.75fr) auto;
  align-items: center;
  column-gap: var(--pp-t3);
  row-gap: 12px;
  padding: 18px 0;
}

.pp-entry__lead {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.pp-entry__names {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.pp-entry__name {
  min-width: 0;
  overflow-wrap: anywhere;
}

.pp-entry__tagline {
  gap: 8px;
  min-width: 0;
}

.pp-entry__byline {
  gap: 6px;
  min-width: 0;
  font-family: var(--pp-mono);
  font-size: 0.7rem;
  color: var(--pp-muted);
}

.pp-entry__sep {
  color: var(--pp-line-strong);
}

.pp-entry__status {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.pp-entry__state {
  gap: 7px;
  font-size: 0.78rem;
  color: var(--pp-ink-soft);
}

.pp-entry__state .pp-dot {
  color: var(--pp-line-strong);
}

.pp-entry__sessions {
  padding-left: 14px;
  font-size: 0.7rem;
  color: var(--pp-muted);
}

.pp-entry__facts {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.pp-entry__fact {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.pp-entry__fact .pp-h4 {
  flex-shrink: 0;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
}

.pp-entry__value {
  min-width: 0;
  font-family: var(--pp-mono);
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  color: var(--pp-ink);
  text-align: right;
  overflow-wrap: anywhere;
}

.pp-entry__price {
  display: inline;
}

.pp-entry__delta {
  margin-left: 6px;
  font-size: 0.66rem;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.pp-entry__curve {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.pp-entry__fill {
  width: 100%;
  transform-origin: left center;
}

.pp-entry__graduation {
  font-size: 0.68rem;
  color: var(--pp-muted);
  white-space: nowrap;
}

.pp-entry__goto {
  color: var(--pp-accent-text);
}

.pp-entry__mission {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 22px;
  padding-top: 10px;
  border-top: 1px solid var(--pp-line-soft);
}

.pp-entry__missionline {
  gap: 7px;
  min-width: 0;
  font-size: 0.74rem;
  color: var(--pp-muted);
}

.pp-entry__missiontext {
  min-width: 0;
  overflow-wrap: anywhere;
}

@media (prefers-reduced-motion: no-preference) {
  .pp-entry__goto {
    transition: transform var(--pp-fast) var(--pp-ease);
  }

  .pp-entry:hover .pp-entry__goto {
    transform: translateX(3px);
  }
}

@media (max-width: 1100px) {
  .pp-entry {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
  }

  .pp-entry__status,
  .pp-entry__facts,
  .pp-entry__curve,
  .pp-entry__mission {
    grid-column: 1 / -1;
  }

  .pp-entry__lead {
    grid-column: 1;
  }

  .pp-entry__goto {
    grid-column: 2;
    grid-row: 1;
  }
}

@media (max-width: 560px) {
  .pp-entry {
    grid-template-columns: minmax(0, 1fr);
  }

  .pp-entry__goto {
    display: none;
  }
}
</style>
