<script setup>
/**
 * The "Research log" panel: what the AI/Quantum pools have spent, the launch
 * events, and a link through to the challenges.
 */
import { computed } from "vue";
import { RouterLink } from "vue-router";
import Icon from "@/components/ui/Icon.vue";
import TokenPicture from "@/components/tokens/TokenPicture.vue";
import CardArt from "@/components/art/CardArt.vue";
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
  <section aria-labelledby="research-log" class="cq-sheet cq-research">
    <div class="cq-sheet__head cq-research__head">
      <h2 id="research-log" class="cq-sheet__title">Research log</h2>
      <CardArt name="portrait" class="cq-research__art" aria-hidden="true" />
      <p class="cq-h4">Spent from AI/Quantum pools</p>
      <p class="cq-figure cq-num cq-research__spent">{{ spent }}</p>
      <p class="cq-tag cq-research__state">
        <span
          aria-hidden="true"
          class="cq-dot"
          :class="working ? 'cq-dot--live cq-live-pulse' : ''"
        />
        {{ working ? "An agent is working now" : "No agent working now" }}
      </p>
    </div>

    <ul class="cq-research__log">
      <li
        v-for="(row, index) in rows"
        :key="`${row.ticker}-${row.at}-${index}`"
        class="cq-research__row"
      >
        <TokenPicture
          v-if="row.mint"
          :mint="row.mint"
          :name="row.ticker.replace('$', '')"
          :size="20"
        />
        <span v-else aria-hidden="true" class="cq-research__blank" />

        <span class="cq-research__text">
          <RouterLink
            v-if="row.mint"
            :to="`/t/${row.mint}`"
            class="cq-link cq-mono cq-research__ticker"
            >{{ row.ticker }}</RouterLink
          >
          <span v-else class="cq-mono cq-strong">{{ row.ticker }}</span>
          {{ row.action }}
        </span>

        <span class="cq-research__time">
          <time :datetime="row.at">{{ timeAgo(row.at) }}</time>
        </span>
      </li>
    </ul>

    <RouterLink to="/challenges" class="cq-sheet__foot cq-research__link">
      The challenges
      <Icon name="arrow-up-right" :size="13" />
    </RouterLink>
  </section>
</template>

<style scoped>
.cq-research {
  gap: 0;
  overflow: clip;
}

.cq-research__head {
  gap: 4px;
  padding: 16px clamp(16px, 2vw, 20px) 14px;
}

.cq-research__spent {
  margin: 6px 0 2px;
  font-size: clamp(1.8rem, 2.8vw, 2.4rem);
  color: var(--cq-ink);
}

.cq-research__state {
  justify-self: start;
  margin-top: 6px;
  background: transparent;
}

.cq-research__log {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
}

.cq-research__row {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 9px clamp(16px, 2vw, 20px);
  border-bottom: 1px solid var(--cq-line-soft);
}

.cq-research__row:last-child {
  border-bottom: 0;
}

.cq-research__blank {
  width: 20px;
  height: 20px;
  border: 1px solid var(--cq-line);
  border-radius: 4px;
  background: var(--cq-sheet-sunk);
}

.cq-research__text {
  min-width: 0;
  font-size: 0.8rem;
  color: var(--cq-muted);
  overflow-wrap: anywhere;
}

.cq-research__ticker {
  font-weight: 600;
}

.cq-research__time {
  font-family: var(--cq-mono);
  font-size: 0.66rem;
  color: var(--cq-muted);
  white-space: nowrap;
}

.cq-research__link {
  margin-top: auto;
  justify-content: space-between;
  padding: 12px clamp(16px, 2vw, 20px);
  color: var(--cq-muted);
  font-family: var(--cq-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  transition: color var(--cq-fast) var(--cq-ease);
}

.cq-research__link:hover {
  color: var(--cq-ink);
}
</style>
