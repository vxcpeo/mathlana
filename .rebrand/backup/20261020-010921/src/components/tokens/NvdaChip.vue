<script setup>
/**
 * The NVDAx pairing chip: every token trades against NVIDIA's tokenized stock
 * on Solana. Identical to the reference on cards, the official row and the
 * token page.
 */
import { QUOTE_ASSET } from "@/data/challenges";

const PAIRING = "Trades against NVDAx, NVIDIA's tokenized stock";
</script>

<template>
  <span
    :title="PAIRING"
    class="inline-flex shrink-0 items-center gap-1 rounded-[5px] border py-px pr-1.5 pl-0.5 font-mono text-[0.65rem] leading-4 text-foreground/85"
  >
    <img
      :src="QUOTE_ASSET.logo"
      alt=""
      width="14"
      height="14"
      loading="lazy"
      decoding="async"
      class="size-3.5 rounded-[3px]"
    />
    <span translate="no" aria-hidden="true">{{ QUOTE_ASSET.symbol }}</span>
    <span class="sr-only">{{ PAIRING }}</span>
  </span>
</template>
