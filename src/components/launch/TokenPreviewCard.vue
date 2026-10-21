<script setup>
/**
 * "How it shows on Qubitess" — the token card as it will appear in the
 * directory, driven live by the form. With no picture picked it falls back to
 * the quantum seal carrying the ticker's first letter.
 */
import { computed } from "vue";
import Icon from "@/components/ui/Icon.vue";
import { QUOTE_ASSET } from "@/data/challenges";

const props = defineProps({
  name: { type: String, default: "" },
  ticker: { type: String, default: "" },
  pictureUrl: { type: String, default: null },
  challenge: { type: Object, required: true },
});

const tokenName = computed(() => props.name.trim() || "Your token");
const tokenTicker = computed(() => props.ticker.trim() || "TICKER");
const initial = computed(() => tokenTicker.value.charAt(0).toUpperCase());

const quoteNote = `Trades against ${QUOTE_ASSET.symbol}, ${QUOTE_ASSET.name}'s tokenized stock`;
</script>

<template>
  <section class="cq-sheet cq-lprev">
    <header class="cq-lprev__head">
      <p class="cq-h4 cq-lprev__caption">
        <span aria-hidden="true" class="cq-lprev__dot"></span>How it shows on Qubitess
      </p>
      <span aria-hidden="true" class="cq-lprev__tick"></span>
    </header>

    <a href="/t/preview" class="cq-lprev__link">
      <div class="cq-lprev__ident">
        <div class="cq-lprev__avatar">
          <img
            v-if="pictureUrl"
            :src="pictureUrl"
            :alt="`${tokenTicker}'s picture`"
            class="cq-lprev__img"
          />
          <svg
            v-else
            viewBox="0 0 100 100"
            class="cq-lprev__seal"
            role="img"
            :aria-label="`${tokenTicker}'s picture`"
            aria-hidden="false"
          >
            <g transform="rotate(0 50 50)" fill="none" stroke-width="1.5">
              <path
                d="M18 82 A64 64 0 0 1 82 18"
                class="cq-lprev__arc"
                vector-effect="non-scaling-stroke"
              ></path>
              <circle
                cx="82"
                cy="18"
                r="3.2"
                class="cq-lprev__node"
                stroke="none"
              ></circle>
            </g>
            <text
              x="50"
              y="50"
              text-anchor="middle"
              dominant-baseline="central"
              class="cq-lprev__initial"
              font-size="44"
              letter-spacing="-1"
            >
              {{ initial }}
            </text>
          </svg>
        </div>

        <div class="cq-lprev__meta">
          <h3 translate="no" class="cq-lprev__name">{{ tokenName }}</h3>
          <p class="cq-lprev__ticker">
            <span translate="no" class="cq-lprev__sym">${{ tokenTicker }}</span>
            <span :title="quoteNote" class="cq-tag cq-tag--sm cq-lprev__quote">
              <img :src="QUOTE_ASSET.logo" alt="" class="cq-lprev__qlogo" />
              <span translate="no" aria-hidden="true">{{ QUOTE_ASSET.symbol }}</span>
              <span class="sr-only">{{ quoteNote }}</span>
            </span>
          </p>
        </div>
      </div>

      <div class="cq-lprev__stats">
        <span class="cq-lprev__status">
          <span aria-hidden="true" class="cq-lprev__pending"></span>Waiting for fees
        </span>
        <span class="cq-lprev__sessions cq-num">0 sessions</span>
      </div>

      <p class="cq-lprev__empty">No trades yet</p>

      <div class="cq-lprev__foot">
        <p class="cq-lprev__line">
          <Icon
            :name="challenge.group === 'stress' ? 'crosshair' : 'shield'"
            :size="14"
            class="cq-lprev__icon"
          />
          <span class="cq-lprev__goaltxt"
            ><span class="cq-lprev__goalname">{{
              challenge.group === "stress" ? "Stress test" : "Defend"
            }}</span
            ><span aria-hidden="true" class="cq-lprev__slash"> / </span>{{ challenge.goal }}</span
          >
        </p>
        <p class="cq-lprev__line">
          <Icon :name="challenge.icon" :size="14" class="cq-lprev__icon" />
          <span class="cq-lprev__labeltxt">{{ challenge.label }}</span>
        </p>
      </div>
    </a>
  </section>
</template>

<style scoped>
.cq-lprev {
  display: grid;
  min-width: 0;
  overflow: hidden;
  background: var(--cq-sheet);
  border-top: 1px solid var(--cq-line-strong);
  box-shadow: none;
}

.cq-lprev__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 16px 11px;
  border-bottom: 1px solid var(--cq-line);
}

.cq-lprev__caption {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.cq-lprev__dot {
  width: 6px;
  height: 6px;
  flex: 0 0 auto;
  background: var(--cq-accent);
}

.cq-lprev__tick {
  width: 24px;
  height: 1px;
  flex: 0 0 auto;
  background: var(--cq-line-strong);
}

.cq-lprev__link {
  display: grid;
  gap: 12px;
  min-width: 0;
  padding: 14px 16px 16px;
  pointer-events: none;
}

.cq-lprev__ident {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  min-width: 0;
}

.cq-lprev__avatar {
  position: relative;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  overflow: hidden;
  border: 1px solid var(--cq-line-strong);
  background: #171610;
}

.cq-lprev__img,
.cq-lprev__seal {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cq-lprev__arc {
  stroke: var(--cq-accent);
}

.cq-lprev__node {
  fill: var(--cq-accent);
}

.cq-lprev__initial {
  fill: #fff;
  color: #fff;
  font-family: var(--cq-display);
  font-weight: 620;
  letter-spacing: -1px;
}

.cq-lprev__meta {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.cq-lprev__name {
  min-width: 0;
  font-family: var(--cq-display);
  font-size: 1.04rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.2;
  color: var(--cq-ink);
  overflow-wrap: anywhere;
}

.cq-lprev__ticker {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.cq-lprev__sym {
  font-family: var(--cq-mono);
  font-size: 0.73rem;
  color: var(--cq-ink-soft);
  overflow-wrap: anywhere;
}

.cq-lprev__quote {
  gap: 5px;
  padding-right: 7px;
  color: var(--cq-ink-soft);
}

.cq-lprev__qlogo {
  width: 14px;
  height: 14px;
}

.cq-lprev__stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px 12px;
  min-width: 0;
}

.cq-lprev__status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.72rem;
  color: var(--cq-muted);
  white-space: nowrap;
}

.cq-lprev__pending {
  width: 7px;
  height: 7px;
  flex: 0 0 auto;
  border: 1px solid var(--cq-line-strong);
}

.cq-lprev__sessions {
  font-size: 0.69rem;
  color: var(--cq-muted);
  white-space: nowrap;
}

.cq-lprev__empty {
  font-size: 0.76rem;
  color: var(--cq-muted);
}

.cq-lprev__foot {
  display: grid;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--cq-line);
}

.cq-lprev__line {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  min-width: 0;
  font-size: 0.74rem;
  line-height: 1.45;
  color: var(--cq-muted);
}

.cq-lprev__icon {
  flex: 0 0 auto;
  margin-top: 1px;
  color: var(--cq-accent-text);
}

.cq-lprev__goaltxt,
.cq-lprev__labeltxt {
  min-width: 0;
  text-wrap: pretty;
  overflow-wrap: anywhere;
}

.cq-lprev__goalname {
  font-weight: 620;
  color: var(--cq-ink-soft);
}

.cq-lprev__slash {
  color: var(--cq-line-strong);
}
</style>
