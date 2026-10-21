<script setup>
/**
 * "How it shows on Mathlana" — the token card as it will appear in the
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
  <div class="flex flex-col gap-2.5">
    <p class="flex items-center gap-2 text-sm text-muted-foreground">
      <span aria-hidden="true" class="size-1.5 shrink-0 rounded-full bg-brand"></span>How it shows on
      Mathlana
    </p>
    <div class="pointer-events-none">
      <a
        href="/t/preview"
        class="group flex h-full min-w-0 flex-col gap-3.5 rounded-xl border bg-card p-4 transition-colors outline-none hover:border-brand/45 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        <div class="flex min-w-0 items-start gap-3">
          <div
            class="relative shrink-0 overflow-hidden rounded-[22%] border bg-ink"
            style="width: 48px; height: 48px"
          >
            <img
              v-if="pictureUrl"
              :src="pictureUrl"
              :alt="`${tokenTicker}'s picture`"
              class="absolute inset-0 h-full w-full object-cover"
            />
            <svg
              v-else
              viewBox="0 0 100 100"
              class="absolute inset-0 size-full"
              role="img"
              :aria-label="`${tokenTicker}'s picture`"
              aria-hidden="false"
            >
              <g transform="rotate(0 50 50)" fill="none" stroke-width="1.5">
                <path d="M18 82 A64 64 0 0 1 82 18" stroke="#6c86ff" vector-effect="non-scaling-stroke"></path>
                <circle cx="82" cy="18" r="3.2" fill="#6c86ff" stroke="none"></circle>
              </g>
              <text
                x="50"
                y="50"
                text-anchor="middle"
                dominant-baseline="central"
                class="fill-white font-heading font-semibold"
                font-size="44"
                letter-spacing="-1"
              >
                {{ initial }}
              </text>
            </svg>
          </div>

          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <h3
              translate="no"
              class="font-heading text-[0.95rem] leading-snug font-semibold tracking-[-0.01em] text-pretty wrap-anywhere text-foreground"
            >
              {{ tokenName }}
            </h3>
            <p class="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
              <span translate="no" class="font-mono wrap-anywhere text-foreground/85">${{ tokenTicker }}</span>
              <span
                :title="quoteNote"
                class="inline-flex shrink-0 items-center gap-1 rounded-[5px] border py-px pr-1.5 pl-0.5 font-mono text-[0.65rem] leading-4 text-foreground/85"
              >
                <img :src="QUOTE_ASSET.logo" alt="" class="size-3.5 rounded-[3px]" />
                <span translate="no" aria-hidden="true">{{ QUOTE_ASSET.symbol }}</span>
                <span class="sr-only">{{ quoteNote }}</span>
              </span>
            </p>
            <p class="flex min-w-0 flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
              <span class="whitespace-nowrap"></span>
            </p>
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-1.5">
          <div class="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <span class="inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap text-muted-foreground">
              <span class="relative flex size-2">
                <span class="relative size-2 rounded-full border border-muted-foreground"></span>
              </span>Waiting for fees</span
            >
            <span class="font-mono text-[0.7rem] whitespace-nowrap text-muted-foreground figures"
              >0 sessions</span
            >
          </div>
        </div>

        <p class="mt-auto text-xs text-muted-foreground">No trades yet</p>

        <div class="flex min-w-0 flex-col gap-2 border-t pt-3 text-xs">
          <p class="flex min-w-0 items-start gap-1.5 text-muted-foreground">
            <Icon
              :name="challenge.group === 'stress' ? 'crosshair' : 'shield'"
              class="text-brand mt-px size-3.5 shrink-0"
            />
            <span class="min-w-0 text-pretty"
              ><span class="font-medium text-foreground/85">{{
                challenge.group === "stress" ? "Stress test" : "Defend"
              }}</span
              ><span aria-hidden="true" class="text-border"> / </span>{{ challenge.goal }}</span
            >
          </p>
          <div class="flex min-w-0 items-start justify-between gap-3">
            <span class="flex min-w-0 items-start gap-1.5 text-muted-foreground">
              <Icon :name="challenge.icon" class="mt-px size-3.5 shrink-0 text-brand" />
              <span class="min-w-0 text-pretty">{{ challenge.label }}</span>
            </span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>
