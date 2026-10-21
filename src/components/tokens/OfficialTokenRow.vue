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
    :aria-label="`${token.name}, the official Qubitess token`"
    class="cq-sheet cq-official"
  >
    <div class="cq-sheet__head cq-official__head">
      <div class="cq-official__id">
        <img
          src="/brand/token.png"
          :alt="`${token.name}'s picture`"
          width="48"
          height="48"
          loading="lazy"
          decoding="async"
          class="cq-thumb"
        />
        <div class="cq-official__names">
          <div class="cq-inline cq-official__line">
            <h2
              translate="no"
              class="cq-h3"
            >
              {{ token.name }}
            </h2>
            <span class="cq-tag cq-tag--accent">
              <Icon name="badge-check" :size="12" :stroke-width="1.75" />Official
            </span>
          </div>
          <div class="cq-inline cq-official__line">
            <span translate="no" class="cq-mono cq-small cq-strong">{{ token.ticker }}</span>
            <NvdaChip />
            <button
              type="button"
              :title="token.mint"
              :aria-label="copied ? 'Address copied' : 'Copy the token address'"
              class="cq-tag cq-official__copy"
              @click="copyAddress"
            >
              <span translate="no">{{ label }}</span>
              <Icon :name="copied ? 'check' : 'copy'" :size="12" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <dl class="cq-official__facts">
      <div class="cq-official__fact">
        <dt class="cq-h4">Market cap</dt>
        <dd class="cq-num cq-official__value">{{ compactUsd(m?.marketCapUsd) }}</dd>
      </div>
      <div class="cq-official__fact">
        <dt class="cq-h4">24h change</dt>
        <dd class="cq-num cq-official__value">
          <template v-if="change">{{ change.arrow }} {{ change.label }}</template>
          <template v-else>-</template>
        </dd>
      </div>
      <div class="cq-official__fact">
        <dt class="cq-h4">Price</dt>
        <dd class="cq-num cq-official__value">{{ priceLabel(m?.priceUsd) }}</dd>
      </div>
      <div class="cq-official__fact">
        <dt class="cq-h4">Vol 24h</dt>
        <dd class="cq-num cq-official__value">{{ compactUsd(m?.volume24hUsd) }}</dd>
      </div>
      <div class="cq-official__fact cq-official__fact--meter">
        <dt class="cq-h4">{{ graduated ? "Graduated" : "Curve" }}</dt>
        <dd
          class="cq-meter cq-official__meter"
          role="meter"
          aria-label="Curve"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="Math.round(graduation)"
        >
          <div
            class="cq-meter__fill cq-official__fill"
            :style="{ transform: `scaleX(${curve})` }"
          />
        </dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.cq-official {
  overflow: clip;
}

.cq-official__head {
  padding: 16px clamp(16px, 2vw, 22px) 15px;
}

.cq-official__id {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.cq-official__names {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.cq-official__line {
  gap: 8px 10px;
  min-width: 0;
}

.cq-official__copy {
  gap: 6px;
  padding: 2px 8px;
  background: transparent;
  cursor: pointer;
  transition: border-color var(--cq-fast) var(--cq-ease), color var(--cq-fast) var(--cq-ease);
}

.cq-official__copy:hover {
  border-color: var(--cq-ink);
  color: var(--cq-ink);
}

/* Figures as full-width ledger rows: label left, figure right. */
.cq-official__facts {
  display: grid;
  gap: 0;
  margin: 0;
}

.cq-official__fact {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding: 11px clamp(16px, 2vw, 22px);
  border-top: 1px solid var(--cq-line-soft);
}

.cq-official__fact:first-child {
  border-top: 0;
}

.cq-official__fact--meter {
  align-items: center;
}

.cq-official__value {
  min-width: 0;
  font-size: 0.94rem;
  color: var(--cq-ink);
  text-align: right;
  overflow-wrap: anywhere;
}

.cq-official__meter {
  width: min(46%, 220px);
  height: 5px;
  flex: 0 0 auto;
}

.cq-official__fill {
  width: 100%;
  transform-origin: left center;
}

@media (max-width: 560px) {
  .cq-official__id {
    align-items: flex-start;
  }

  .cq-official__meter {
    width: min(52%, 160px);
  }
}
</style>
