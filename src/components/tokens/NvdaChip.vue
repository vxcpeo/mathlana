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
  <span :title="PAIRING" class="pp-tag pp-tag--sm pp-nvda">
    <img
      :src="QUOTE_ASSET.logo"
      alt=""
      width="14"
      height="14"
      loading="lazy"
      decoding="async"
      class="pp-nvda__logo"
    />
    <span translate="no" aria-hidden="true">{{ QUOTE_ASSET.symbol }}</span>
    <span class="sr-only">{{ PAIRING }}</span>
  </span>
</template>

<style scoped>
.pp-nvda {
  gap: 4px;
  padding: 1px 6px 1px 3px;
  border-radius: 4px;
  background: var(--pp-sheet);
  text-transform: none;
  letter-spacing: 0.01em;
}

.pp-nvda__logo {
  width: 13px;
  height: 13px;
  border-radius: 2px;
}
</style>
