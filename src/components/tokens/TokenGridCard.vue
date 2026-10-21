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
  <RouterLink :to="`/t/${token.mint}`" class="cq-ledger__row cq-entry">
    <div class="cq-entry__lead">
      <TokenPicture :mint="token.mint" :name="token.name" :size="48" />

      <div class="cq-entry__names">
        <h3 translate="no" class="cq-h3 cq-entry__name">
          {{ token.name }}
        </h3>
        <span class="cq-inline cq-entry__tagline">
          <span translate="no" class="cq-mono cq-small">{{ token.ticker }}</span>
          <NvdaChip />
        </span>
        <span class="cq-inline cq-entry__byline">
          <span translate="no">by {{ shortAddress(token.creator) }}</span>
          <span aria-hidden="true" class="cq-entry__sep">/</span>
          <time :datetime="token.createdAt ?? undefined">{{ timeAgo(token.createdAt) }}</time>
        </span>
      </div>
    </div>

    <div class="cq-entry__status">
      <span class="cq-inline cq-entry__state">
        <span aria-hidden="true" class="cq-dot" />
        Waiting for fees
      </span>
      <span class="cq-mono cq-entry__sessions">{{ sessions }} sessions</span>
      <span class="cq-inline cq-entry__state cq-tone-muted">
        <span aria-hidden="true" class="cq-dot" />
        <span>No progress yet</span>
      </span>
    </div>

    <dl class="cq-entry__facts">
      <div class="cq-entry__fact">
        <dt class="cq-h4">Price</dt>
        <dd class="cq-entry__value">
          <span class="cq-entry__price">{{ priceLabel(m?.priceUsd) }}</span>
          <span
            title="24h change"
            class="cq-entry__delta"
            :class="change?.up ? 'cq-tone-live' : 'cq-tone-muted'"
          >
            <template v-if="change">{{ change.arrow }} {{ change.label }}</template>
            <template v-else>-</template>
            <span class="sr-only"> 24h change</span>
          </span>
        </dd>
      </div>
      <div class="cq-entry__fact">
        <dt class="cq-h4">Market cap</dt>
        <dd class="cq-entry__value">{{ compactUsd(m?.marketCapUsd) }}</dd>
      </div>
      <div class="cq-entry__fact">
        <dt class="cq-h4">Vol 24h</dt>
        <dd class="cq-entry__value">{{ compactUsd(m?.volume24hUsd) }}</dd>
      </div>
    </dl>

    <div class="cq-entry__curve">
      <div
        class="cq-meter"
        role="meter"
        aria-label="Curve"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="Math.round(curve * 100)"
      >
        <div class="cq-meter__fill cq-entry__fill" :style="{ transform: `scaleX(${curve})` }" />
      </div>
      <span class="cq-mono cq-entry__graduation">{{ graduation }}% to graduation</span>
    </div>

    <Icon name="arrow-right" :size="16" class="cq-entry__goto" />

    <div v-if="token.challengeLabel" class="cq-entry__mission">
      <span class="cq-inline cq-entry__missionline">
        <Icon name="shield" :size="13" class="cq-tone-accent" />
        <span class="cq-entry__missiontext">
          <span class="cq-strong">{{ token.challengeVerb }}</span>
          <span aria-hidden="true"> / </span>{{ token.challengeDescription }}
        </span>
      </span>
      <span class="cq-inline cq-entry__missionline cq-tone-muted">
        <Icon name="sigma" :size="13" class="cq-tone-accent" />
        <span class="cq-entry__missiontext">{{ token.challengeLabel }}</span>
      </span>
    </div>
  </RouterLink>
</template>

<style scoped>
.cq-entry {
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.8fr) minmax(0, 1.25fr) minmax(0, 0.75fr) auto;
  align-items: center;
  column-gap: var(--cq-t3);
  row-gap: 12px;
  padding: 18px 0;
}

.cq-entry__lead {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.cq-entry__names {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.cq-entry__name {
  min-width: 0;
  overflow-wrap: anywhere;
}

.cq-entry__tagline {
  gap: 8px;
  min-width: 0;
}

.cq-entry__byline {
  gap: 6px;
  min-width: 0;
  font-family: var(--cq-mono);
  font-size: 0.7rem;
  color: var(--cq-muted);
}

.cq-entry__sep {
  color: var(--cq-line-strong);
}

.cq-entry__status {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.cq-entry__state {
  gap: 7px;
  font-size: 0.78rem;
  color: var(--cq-ink-soft);
}

.cq-entry__state .cq-dot {
  color: var(--cq-line-strong);
}

.cq-entry__sessions {
  padding-left: 14px;
  font-size: 0.7rem;
  color: var(--cq-muted);
}

.cq-entry__facts {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.cq-entry__fact {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.cq-entry__fact .cq-h4 {
  flex-shrink: 0;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
}

.cq-entry__value {
  min-width: 0;
  font-family: var(--cq-mono);
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  color: var(--cq-ink);
  text-align: right;
  overflow-wrap: anywhere;
}

.cq-entry__price {
  display: inline;
}

.cq-entry__delta {
  margin-left: 6px;
  font-size: 0.66rem;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.cq-entry__curve {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.cq-entry__fill {
  width: 100%;
  transform-origin: left center;
}

.cq-entry__graduation {
  font-size: 0.68rem;
  color: var(--cq-muted);
  white-space: nowrap;
}

.cq-entry__goto {
  color: var(--cq-accent-text);
}

.cq-entry__mission {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 22px;
  padding-top: 10px;
  border-top: 1px solid var(--cq-line-soft);
}

.cq-entry__missionline {
  gap: 7px;
  min-width: 0;
  font-size: 0.74rem;
  color: var(--cq-muted);
}

.cq-entry__missiontext {
  min-width: 0;
  overflow-wrap: anywhere;
}

@media (prefers-reduced-motion: no-preference) {
  .cq-entry__goto {
    transition: transform var(--cq-fast) var(--cq-ease);
  }

  .cq-entry:hover .cq-entry__goto {
    transform: translateX(3px);
  }
}

@media (max-width: 1100px) {
  .cq-entry {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
  }

  .cq-entry__status,
  .cq-entry__facts,
  .cq-entry__curve,
  .cq-entry__mission {
    grid-column: 1 / -1;
  }

  .cq-entry__lead {
    grid-column: 1;
  }

  .cq-entry__goto {
    grid-column: 2;
    grid-row: 1;
  }
}

@media (max-width: 560px) {
  .cq-entry {
    grid-template-columns: minmax(0, 1fr);
  }

  .cq-entry__goto {
    display: none;
  }
}
</style>
