<script setup>
/**
 * The "Research log" panel: what the AI/Quantum pools have spent, the launch
 * events, and a link through to the challenges.
 */
import { computed } from "vue";
import { RouterLink } from "vue-router";
import CardArt from "@/components/art/CardArt.vue";
import Icon from "@/components/ui/Icon.vue";
import PanelCard from "@/components/ui/PanelCard.vue";
import TokenPicture from "@/components/tokens/TokenPicture.vue";
import { RESEARCH_LOG, TOKENS } from "@/data/tokens";
import { timeAgo } from "@/lib/format";
import { usd } from "@/components/tokens/tokenSnapshot";

const props = defineProps({
  /** Dollars the pools have spent in total. */
  spentUsd: { type: Number, default: 0 },
  /** True while an agent is running. */
  working: { type: Boolean, default: false },
  log: { type: Array, default: () => RESEARCH_LOG },
});

/**
 * Log rows carry a ticker but no mint: pair each row with the token it
 * belongs to, newest first, so the row links through to the right page.
 */
const rows = computed(() => {
  const byTicker = new Map();
  [...TOKENS]
    .sort((a, b) => Date.parse(b.createdAt ?? 0) - Date.parse(a.createdAt ?? 0))
    .forEach((token) => {
      if (!byTicker.has(token.ticker)) byTicker.set(token.ticker, []);
      byTicker.get(token.ticker).push(token);
    });

  return props.log.map((entry) => {
    const queue = byTicker.get(entry.ticker);
    const match = queue?.length ? queue.shift() : null;
    return { ...entry, mint: match?.mint ?? null };
  });
});

const spent = computed(() => usd(props.spentUsd));
</script>

<template>
  <PanelCard art="portrait" art-responsive class="pp-research">
    <template #art>
      <span aria-hidden="true" class="pp-art pp-research__art">
        <CardArt name="portrait" />
      </span>
    </template>

    <template #header>
      <h2 id="research-log" class="pp-sheet__title">Research log</h2>
      <p class="pp-h4">Spent from AI/Quantum pools</p>
      <p class="pp-figure pp-num">{{ spent }}</p>
      <p class="pp-tag pp-research__state">
        <span
          aria-hidden="true"
          class="pp-dot"
          :class="working ? 'pp-dot--live pp-live-pulse' : ''"
        />
        {{ working ? "An agent is working now" : "No agent working now" }}
      </p>
    </template>

    <ul class="pp-research__log">
      <li
        v-for="(row, index) in rows"
        :key="`${row.ticker}-${row.at}-${index}`"
        class="pp-research__row"
      >
        <TokenPicture
          v-if="row.mint"
          :mint="row.mint"
          :name="row.ticker.replace('$', '')"
          :size="20"
        />
        <span v-else aria-hidden="true" class="pp-research__blank" />

        <span class="pp-research__text">
          <RouterLink
            v-if="row.mint"
            :to="`/t/${row.mint}`"
            class="pp-link pp-mono pp-research__ticker"
            >{{ row.ticker }}</RouterLink
          >
          <span v-else class="pp-mono pp-strong">{{ row.ticker }}</span>
          {{ row.action }}
        </span>

        <span class="pp-research__time">
          <time :datetime="row.at">{{ timeAgo(row.at) }}</time>
        </span>
      </li>
    </ul>

    <RouterLink to="/challenges" class="pp-sheet__foot pp-research__link">
      The challenges
      <Icon name="arrow-up-right" :size="13" />
    </RouterLink>
  </PanelCard>
</template>

<style scoped>
.pp-research {
  min-width: 0;
}

.pp-research__art {
  display: flex;
  justify-content: flex-end;
  height: 58px;
  overflow: clip;
}

.pp-research__state {
  justify-self: start;
  margin-top: 4px;
  background: var(--pp-sheet);
}

.pp-research__log {
  display: grid;
  border-top: 1px solid var(--pp-line);
}

.pp-research__row {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 9px 22px;
  border-bottom: 1px solid var(--pp-line-soft);
}

.pp-research__row:last-child {
  border-bottom: 0;
}

.pp-research__blank {
  width: 20px;
  height: 20px;
  border: 1px solid var(--pp-line);
  border-radius: 4px;
  background: var(--pp-sheet-sunk);
}

.pp-research__text {
  min-width: 0;
  font-size: 0.8rem;
  color: var(--pp-muted);
  overflow-wrap: anywhere;
}

.pp-research__ticker {
  font-weight: 600;
}

.pp-research__time {
  font-family: var(--pp-mono);
  font-size: 0.66rem;
  color: var(--pp-muted);
  white-space: nowrap;
}

.pp-research__link {
  margin-top: auto;
  justify-content: space-between;
  color: var(--pp-muted);
  font-family: var(--pp-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color var(--pp-fast) var(--pp-ease);
}

.pp-research__link:hover {
  color: var(--pp-ink);
}

@media (max-width: 640px) {
  .pp-research__art {
    display: none;
  }
}

@media (max-width: 560px) {
  .pp-research__row {
    padding-inline: 16px;
  }
}
</style>
