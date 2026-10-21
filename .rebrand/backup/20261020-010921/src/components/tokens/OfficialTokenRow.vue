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
    :aria-label="`${token.name}, the official Mathlana token`"
    class="relative overflow-hidden rounded-xl border border-brand-border bg-card"
  >
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand/80 to-transparent"
    />
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-brand/8 to-transparent"
    />

    <div class="relative flex flex-col gap-4 p-4 sm:px-5 lg:flex-row lg:items-center lg:gap-8">
      <div class="flex min-w-0 shrink-0 items-center gap-3">
        <img
          src="/brand/token.png"
          :alt="`${token.name}'s picture`"
          width="48"
          height="48"
          loading="lazy"
          decoding="async"
          class="size-12 shrink-0 rounded-lg ring-1 ring-brand-border"
        />
        <div class="flex min-w-0 flex-col gap-1">
          <div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <h2
              translate="no"
              class="font-heading text-[0.95rem] leading-snug font-semibold tracking-[-0.01em] text-foreground"
            >
              {{ token.name }}
            </h2>
            <span
              class="inline-flex h-5 items-center gap-1 rounded-md border border-brand-border bg-brand-surface pr-1.5 pl-1 text-[0.68rem] font-medium text-brand-text"
            >
              <Icon name="badge-check" class="size-3.5" :stroke-width="1.75" />Official
            </span>
          </div>
          <div class="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
            <span translate="no" class="font-mono text-foreground/85">{{ token.ticker }}</span>
            <NvdaChip />
            <button
              type="button"
              :title="token.mint"
              :aria-label="copied ? 'Address copied' : 'Copy the token address'"
              class="inline-flex h-6 w-fit items-center gap-1.5 rounded-md border px-2 font-mono text-[0.7rem] text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              @click="copyAddress"
            >
              <span translate="no">{{ label }}</span>
              <Icon :name="copied ? 'check' : 'copy'" class="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <dl
        class="grid min-w-0 flex-1 grid-cols-2 gap-x-3 gap-y-4 border-t pt-4 sm:grid-cols-4 lg:grid-cols-[repeat(4,auto)_minmax(9rem,1fr)] lg:divide-x lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
      >
        <div class="flex min-w-0 flex-col gap-1.5 lg:px-5 lg:first:pl-0">
          <dt class="text-[0.7rem] whitespace-nowrap text-muted-foreground">Market cap</dt>
          <dd class="font-mono text-[0.95rem] leading-none font-medium wrap-anywhere text-foreground figures">
            {{ compactUsd(m?.marketCapUsd) }}
          </dd>
        </div>
        <div class="flex min-w-0 flex-col gap-1.5 lg:px-5 lg:first:pl-0">
          <dt class="text-[0.7rem] whitespace-nowrap text-muted-foreground">24h change</dt>
          <dd class="font-mono text-[0.95rem] leading-none font-medium wrap-anywhere text-foreground figures">
            <template v-if="change">{{ change.arrow }} {{ change.label }}</template>
            <template v-else>-</template>
          </dd>
        </div>
        <div class="flex min-w-0 flex-col gap-1.5 lg:px-5 lg:first:pl-0">
          <dt class="text-[0.7rem] whitespace-nowrap text-muted-foreground">Price</dt>
          <dd class="font-mono text-[0.95rem] leading-none font-medium wrap-anywhere text-foreground figures">
            {{ priceLabel(m?.priceUsd) }}
          </dd>
        </div>
        <div class="flex min-w-0 flex-col gap-1.5 lg:px-5 lg:first:pl-0">
          <dt class="text-[0.7rem] whitespace-nowrap text-muted-foreground">Vol 24h</dt>
          <dd class="font-mono text-[0.95rem] leading-none font-medium wrap-anywhere text-foreground figures">
            {{ compactUsd(m?.volume24hUsd) }}
          </dd>
        </div>
        <div class="col-span-2 flex min-w-0 flex-col gap-2 sm:col-span-4 lg:col-span-1 lg:px-5 lg:pr-0">
          <dt class="text-[0.7rem] whitespace-nowrap text-muted-foreground">
            {{ graduated ? "Graduated" : "Curve" }}
          </dt>
          <dd
            class="h-1 overflow-hidden rounded-full bg-muted"
            role="meter"
            aria-label="Curve"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="Math.round(graduation)"
          >
            <div
              class="h-full origin-left rounded-full bg-brand transition-transform duration-500 motion-reduce:transition-none"
              :style="{ transform: `scaleX(${curve})` }"
            />
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
