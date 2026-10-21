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
  <RouterLink
    :to="`/t/${token.mint}`"
    class="group flex h-full min-w-0 flex-col gap-3.5 rounded-xl border bg-card p-4 transition-colors outline-none hover:border-brand/45 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-ring/40"
  >
    <div class="flex min-w-0 items-start gap-3">
      <TokenPicture :mint="token.mint" :name="token.name" :size="48" />

      <div class="flex min-w-0 flex-1 flex-col gap-1">
        <h3
          translate="no"
          class="font-heading text-[0.95rem] leading-snug font-semibold tracking-[-0.01em] text-pretty wrap-anywhere text-foreground"
        >
          {{ token.name }}
        </h3>
        <p class="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
          <span translate="no" class="font-mono wrap-anywhere text-foreground/85">{{ token.ticker }}</span>
          <NvdaChip />
        </p>
        <p class="flex min-w-0 flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
          <span translate="no" class="whitespace-nowrap">by {{ shortAddress(token.creator) }}</span>
          <span aria-hidden="true" class="text-border">/</span>
          <span class="whitespace-nowrap">
            <time :datetime="token.createdAt ?? undefined">{{ timeAgo(token.createdAt) }}</time>
          </span>
        </p>
      </div>
    </div>

    <div class="flex min-w-0 flex-col gap-1.5">
      <div class="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span
          class="inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap text-muted-foreground"
        >
          <span class="relative flex size-2">
            <span class="relative size-2 rounded-full border border-muted-foreground" />
          </span>
          Waiting for fees
        </span>
        <span class="font-mono text-[0.7rem] whitespace-nowrap text-muted-foreground figures"
          >{{ sessions }} sessions</span
        >
      </div>
      <p class="flex min-w-0 items-center gap-1.5 text-xs text-quiet-text">
        <span aria-hidden="true" class="size-2 shrink-0 rounded-full border border-foreground/25" />
        <span class="min-w-0 text-pretty">No progress yet</span>
      </p>
    </div>

    <div class="mt-auto flex min-w-0 flex-col gap-3">
      <div class="flex min-w-0 items-end justify-between gap-3">
        <div class="flex min-w-0 flex-col">
          <span class="text-xs text-muted-foreground">Market cap</span>
          <span class="font-mono text-lg leading-tight font-medium text-foreground figures">{{
            compactUsd(m?.marketCapUsd)
          }}</span>
        </div>
        <span
          title="24h change"
          class="shrink-0 rounded-md border px-1.5 font-mono text-xs leading-5 whitespace-nowrap figures"
          :class="change?.up ? 'border-brand-border text-foreground' : 'text-muted-foreground'"
        >
          <template v-if="change">{{ change.arrow }} {{ change.label }}</template>
          <template v-else>-</template>
          <span class="sr-only"> 24h change</span>
        </span>
      </div>

      <dl class="grid grid-cols-2 gap-3 text-xs">
        <div class="flex min-w-0 flex-col gap-0.5">
          <dt class="text-muted-foreground">Price</dt>
          <dd class="font-mono wrap-anywhere text-foreground/85 figures">
            {{ priceLabel(m?.priceUsd) }}
          </dd>
        </div>
        <div class="flex min-w-0 flex-col gap-0.5">
          <dt class="text-muted-foreground">Vol 24h</dt>
          <dd class="font-mono wrap-anywhere text-foreground/85 figures">
            {{ compactUsd(m?.volume24hUsd) }}
          </dd>
        </div>
      </dl>

      <div class="flex flex-col gap-1.5">
        <div
          class="h-1 overflow-hidden rounded-full bg-muted"
          role="meter"
          aria-label="Curve"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="Math.round(curve * 100)"
        >
          <div
            class="h-full origin-left rounded-full bg-brand transition-transform duration-500 motion-reduce:transition-none"
            :style="{ transform: `scaleX(${curve})` }"
          />
        </div>
        <span class="font-mono text-[0.7rem] text-muted-foreground figures"
          >{{ graduation }}% to graduation</span
        >
      </div>
    </div>

    <div v-if="token.challengeLabel" class="flex min-w-0 flex-col gap-2 border-t pt-3 text-xs">
      <p class="flex min-w-0 items-start gap-1.5 text-muted-foreground">
        <Icon name="shield" class="text-brand mt-px size-3.5 shrink-0" />
        <span class="min-w-0 text-pretty">
          <span class="font-medium text-foreground/85">{{ token.challengeVerb }}</span>
          <span aria-hidden="true" class="text-border"> / </span>{{ token.challengeDescription }}
        </span>
      </p>
      <div class="flex min-w-0 items-start justify-between gap-3">
        <span class="flex min-w-0 items-start gap-1.5 text-muted-foreground">
          <Icon name="sigma" class="mt-px size-3.5 shrink-0 text-brand" />
          <span class="min-w-0 text-pretty">{{ token.challengeLabel }}</span>
        </span>
      </div>
    </div>
  </RouterLink>
</template>
