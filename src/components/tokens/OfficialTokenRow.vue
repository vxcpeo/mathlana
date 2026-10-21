<script setup>
/**
 * The pinned row for the platform's own token at the top of `/tokens`:
 * identity at the left, the market strip at the right, graduated by default.
 */
import { computed, ref } from "vue";
import Icon from "@/components/ui/Icon.vue";
import NvdaChip from "@/components/tokens/NvdaChip.vue";
import { mintLabel, priceLabel } from "@/components/tokens/market";
import { change24h, compactUsd, curvePercent } from "@/lib/format";

const props = defineProps({
  token: { type: Object, required: true },
  market: { type: Object, default: null },
});

const m = computed(() => props.market ?? props.token.fallback ?? null);
const change = computed(() => change24h(m.value?.change24h));
const curve = computed(() => {
  const value = Number(m.value?.curve ?? 0);
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
});
const graduated = computed(() => Boolean(m.value?.graduated) || curve.value >= 1);
const graduation = computed(() => curvePercent(curve.value) ?? 0);

const label = computed(() => mintLabel(props.token.mint));

const copied = ref(false);
let timer = null;

async function copyAddress() {
  try {
    await navigator.clipboard.writeText(props.token.mint);
  } catch {
    /* clipboard blocked: the button still confirms the intent */
  }
  copied.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (copied.value = false), 1600);
}
</script>

<template>
  <section
    :aria-label="`${token.name}, the official Qubitlane token`"
    class="pp-official"
  >
    <div class="pp-official__id">
      <img
        src="/brand/token.png"
        :alt="`${token.name}'s picture`"
        width="48"
        height="48"
        loading="lazy"
        decoding="async"
        class="pp-thumb"
      />
      <div class="pp-official__names">
        <div class="pp-inline pp-official__line">
          <h2
            translate="no"
            class="pp-h3"
          >
            {{ token.name }}
          </h2>
          <span class="pp-tag pp-tag--accent">
            <Icon name="badge-check" :size="12" :stroke-width="1.75" />Official
          </span>
        </div>
        <div class="pp-inline pp-official__line">
          <span translate="no" class="pp-mono pp-small pp-strong">{{ token.ticker }}</span>
          <NvdaChip />
          <button
            type="button"
            :title="token.mint"
            :aria-label="copied ? 'Address copied' : 'Copy the token address'"
            class="pp-tag pp-official__copy"
            @click="copyAddress"
          >
            <span translate="no">{{ label }}</span>
            <Icon :name="copied ? 'check' : 'copy'" :size="12" />
          </button>
        </div>
      </div>
    </div>

    <dl class="pp-official__facts">
      <div class="pp-official__fact">
        <dt class="pp-h4">Market cap</dt>
        <dd class="pp-num pp-official__value">{{ compactUsd(m?.marketCapUsd) }}</dd>
      </div>
      <div class="pp-official__fact">
        <dt class="pp-h4">24h change</dt>
        <dd class="pp-num pp-official__value">
          <template v-if="change">{{ change.arrow }} {{ change.label }}</template>
          <template v-else>-</template>
        </dd>
      </div>
      <div class="pp-official__fact">
        <dt class="pp-h4">Price</dt>
        <dd class="pp-num pp-official__value">{{ priceLabel(m?.priceUsd) }}</dd>
      </div>
      <div class="pp-official__fact">
        <dt class="pp-h4">Vol 24h</dt>
        <dd class="pp-num pp-official__value">{{ compactUsd(m?.volume24hUsd) }}</dd>
      </div>
      <div class="pp-official__fact">
        <dt class="pp-h4">{{ graduated ? "Graduated" : "Curve" }}</dt>
        <dd
          class="pp-meter pp-official__meter"
          role="meter"
          aria-label="Curve"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="Math.round(graduation)"
        >
          <div
            class="pp-meter__fill pp-official__fill"
            :style="{ transform: `scaleX(${curve})` }"
          />
        </dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.pp-official {
  display: grid;
  gap: var(--pp-t3);
  padding: 16px 0 18px;
  border-top: 3px solid var(--pp-accent);
  border-bottom: 1px solid var(--pp-line);
}

.pp-official__id {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.pp-official__names {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.pp-official__line {
  gap: 8px 10px;
  min-width: 0;
}

.pp-official__copy {
  gap: 6px;
  padding: 2px 8px;
  background: var(--pp-sheet);
  cursor: pointer;
  transition: border-color var(--pp-fast) var(--pp-ease), color var(--pp-fast) var(--pp-ease);
}

.pp-official__copy:hover {
  border-color: var(--pp-ink);
  color: var(--pp-ink);
}

.pp-official__facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(148px, 1fr));
  gap: 14px 20px;
  min-width: 0;
}

.pp-official__fact {
  display: grid;
  gap: 5px;
  align-content: start;
  min-width: 0;
}

.pp-official__value {
  font-size: 0.92rem;
  color: var(--pp-ink);
  overflow-wrap: anywhere;
}

.pp-official__meter {
  height: 6px;
}

.pp-official__fill {
  width: 100%;
  transform-origin: left center;
}

@media (min-width: 1320px) {
  .pp-official {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    align-items: center;
    gap: var(--pp-t3) var(--pp-t4);
  }

  .pp-official__facts {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}
</style>
