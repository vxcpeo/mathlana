<script setup>
/**
 * The "Research log" panel: what the AI/Quantum pools have spent, the launch
 * events, and a link through to the challenges.
 */
import { computed } from "vue";
import { RouterLink } from "vue-router";
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
  <PanelCard art="portrait" class="flex-1">
    <template #header>
      <h2 id="research-log" class="relative font-heading text-base font-semibold tracking-[-0.01em]">
        Research log
      </h2>
      <p class="relative mt-3 text-[0.72rem] text-muted-foreground">Spent from AI/Quantum pools</p>
      <p class="relative font-mono text-2xl leading-tight font-medium figures">{{ spent }}</p>
      <p
        class="relative mt-2.5 inline-flex items-center gap-1.5 rounded-md border px-2 text-[0.72rem] leading-6 whitespace-nowrap text-muted-foreground"
      >
        <span aria-hidden="true" class="relative flex size-1.5">
          <span
            class="relative size-1.5 rounded-full"
            :class="working ? 'bg-brand animate-quantum-pulse' : 'bg-muted-foreground'"
          />
        </span>
        {{ working ? "An agent is working now" : "No agent working now" }}
      </p>
    </template>

    <ul class="flex flex-col divide-y">
      <li
        v-for="(row, index) in rows"
        :key="`${row.ticker}-${row.at}-${index}`"
        class="grid grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-x-3 px-5 py-2.5"
      >
        <TokenPicture
          v-if="row.mint"
          :mint="row.mint"
          :name="row.ticker.replace('$', '')"
          :size="20"
        />
        <span v-else aria-hidden="true" class="size-5 shrink-0 rounded-[22%] border bg-ink" />

        <span class="truncate text-[0.8rem] text-muted-foreground">
          <RouterLink
            v-if="row.mint"
            :to="`/t/${row.mint}`"
            class="font-mono font-medium text-foreground hover:underline"
            >{{ row.ticker }}</RouterLink
          >
          <span v-else class="font-mono font-medium text-foreground">{{ row.ticker }}</span>
          {{ row.action }}
        </span>

        <span class="font-mono text-[0.68rem] whitespace-nowrap text-muted-foreground figures">
          <time :datetime="row.at">{{ timeAgo(row.at) }}</time>
        </span>
      </li>
    </ul>

    <RouterLink
      to="/challenges"
      class="mt-auto flex items-center justify-between border-t px-5 py-2.5 text-[0.72rem] text-quiet transition-colors hover:text-foreground"
    >
      The challenges
      <Icon name="arrow-up-right" class="size-3.5" />
    </RouterLink>
  </PanelCard>
</template>
