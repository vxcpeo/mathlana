<script setup>
/**
 * "How it shows on Qubitlane" — the token card as it will appear in the
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
  <div class="pp-preview">
    <p class="pp-h4 pp-preview__caption">
      <span aria-hidden="true" class="pp-preview__dot"></span>How it shows on Qubitlane
    </p>

    <div class="pp-sheet pp-preview__sheet">
      <a href="/t/preview" class="pp-preview__link">
        <div class="pp-preview__ident">
          <div class="pp-preview__avatar">
            <img
              v-if="pictureUrl"
              :src="pictureUrl"
              :alt="`${tokenTicker}'s picture`"
              class="pp-preview__img"
            />
            <svg
              v-else
              viewBox="0 0 100 100"
              class="pp-preview__seal"
              role="img"
              :aria-label="`${tokenTicker}'s picture`"
              aria-hidden="false"
            >
              <g transform="rotate(0 50 50)" fill="none" stroke-width="1.5">
                <path
                  d="M18 82 A64 64 0 0 1 82 18"
                  class="pp-preview__arc"
                  vector-effect="non-scaling-stroke"
                ></path>
                <circle
                  cx="82"
                  cy="18"
                  r="3.2"
                  class="pp-preview__node"
                  stroke="none"
                ></circle>
              </g>
              <text
                x="50"
                y="50"
                text-anchor="middle"
                dominant-baseline="central"
                class="pp-preview__initial"
                font-size="44"
                letter-spacing="-1"
              >
                {{ initial }}
              </text>
            </svg>
          </div>

          <div class="pp-preview__meta">
            <h3 translate="no" class="pp-preview__name">{{ tokenName }}</h3>
            <p class="pp-preview__ticker">
              <span translate="no" class="pp-preview__sym">${{ tokenTicker }}</span>
              <span :title="quoteNote" class="pp-tag pp-tag--sm pp-preview__quote">
                <img :src="QUOTE_ASSET.logo" alt="" class="pp-preview__qlogo" />
                <span translate="no" aria-hidden="true">{{ QUOTE_ASSET.symbol }}</span>
                <span class="sr-only">{{ quoteNote }}</span>
              </span>
            </p>
          </div>
        </div>

        <div class="pp-preview__stats">
          <span class="pp-preview__status">
            <span aria-hidden="true" class="pp-preview__pending"></span>Waiting for fees
          </span>
          <span class="pp-preview__sessions pp-num">0 sessions</span>
        </div>

        <p class="pp-preview__empty">No trades yet</p>

        <div class="pp-preview__foot">
          <p class="pp-preview__line">
            <Icon
              :name="challenge.group === 'stress' ? 'crosshair' : 'shield'"
              :size="14"
              class="pp-preview__icon"
            />
            <span class="pp-preview__goaltxt"
              ><span class="pp-preview__goalname">{{
                challenge.group === "stress" ? "Stress test" : "Defend"
              }}</span
              ><span aria-hidden="true" class="pp-preview__slash"> / </span>{{ challenge.goal }}</span
            >
          </p>
          <p class="pp-preview__line">
            <Icon :name="challenge.icon" :size="14" class="pp-preview__icon" />
            <span class="pp-preview__labeltxt">{{ challenge.label }}</span>
          </p>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.pp-preview {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.pp-preview__caption {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pp-preview__dot {
  width: 6px;
  height: 6px;
  flex: 0 0 auto;
  border-radius: 0;
  background: var(--pp-accent);
}

.pp-preview__sheet {
  pointer-events: none;
  border-top-color: var(--pp-line-strong);
}

.pp-preview__link {
  display: grid;
  gap: 12px;
  min-width: 0;
  padding: 14px 0;
}

.pp-preview__ident {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
}

.pp-preview__avatar {
  position: relative;
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  overflow: hidden;
  border: 1px solid var(--pp-line-strong);
  border-radius: 0;
  background: #171610;
}

.pp-preview__img,
.pp-preview__seal {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pp-preview__arc {
  stroke: var(--pp-accent);
}

.pp-preview__node {
  fill: var(--pp-accent);
}

.pp-preview__initial {
  fill: #fff;
  color: #fff;
  font-family: var(--pp-display);
  font-weight: 620;
  letter-spacing: -1px;
}

.pp-preview__meta {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.pp-preview__name {
  min-width: 0;
  font-family: var(--pp-display);
  font-size: 1.08rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.2;
  color: var(--pp-ink);
  overflow-wrap: anywhere;
}

.pp-preview__ticker {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.pp-preview__sym {
  font-family: var(--pp-mono);
  font-size: 0.76rem;
  color: var(--pp-ink-soft);
  overflow-wrap: anywhere;
}

.pp-preview__quote {
  gap: 5px;
  padding-right: 7px;
  color: var(--pp-ink-soft);
}

.pp-preview__qlogo {
  width: 14px;
  height: 14px;
  border-radius: 0;
}

.pp-preview__stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px 12px;
  min-width: 0;
}

.pp-preview__status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.74rem;
  color: var(--pp-muted);
  white-space: nowrap;
}

.pp-preview__pending {
  width: 7px;
  height: 7px;
  flex: 0 0 auto;
  border: 1px solid var(--pp-line-strong);
  border-radius: 0;
}

.pp-preview__sessions {
  font-size: 0.72rem;
  color: var(--pp-muted);
  white-space: nowrap;
}

.pp-preview__empty {
  font-size: 0.78rem;
  color: var(--pp-muted);
}

.pp-preview__foot {
  display: grid;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--pp-line);
}

.pp-preview__line {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  min-width: 0;
  font-size: 0.76rem;
  line-height: 1.45;
  color: var(--pp-muted);
}

.pp-preview__icon {
  flex: 0 0 auto;
  margin-top: 1px;
  color: var(--pp-accent-text);
}

.pp-preview__goaltxt,
.pp-preview__labeltxt {
  min-width: 0;
  text-wrap: pretty;
  overflow-wrap: anywhere;
}

.pp-preview__goalname {
  font-weight: 620;
  color: var(--pp-ink-soft);
}

.pp-preview__slash {
  color: var(--pp-line-strong);
}
</style>
