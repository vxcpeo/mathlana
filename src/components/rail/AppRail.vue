<script setup>
/**
 * The marginal contents column. A ruled index in the page margin, not a fixed
 * spine: it sits after <main> in the DOM and is placed in the outer grid column,
 * so the landmark order reads header → index → main → contents → colophon.
 */
import { RouterLink } from "vue-router";
import BrandMark from "@/components/brand/BrandMark.vue";
import Icon from "@/components/ui/Icon.vue";

const NAV = [
  { label: "Tokens", to: "/tokens", icon: "gem" },
  { label: "Challenges", to: "/challenges", icon: "trophy" },
  { label: "How it works", to: "/#how", icon: "compass" },
  { label: "About", to: "/about", icon: "bot" },
  { label: "Check a wallet", to: "/exposure", icon: "scan-line" },
];
</script>

<template>
  <nav class="pp-contents__nav" aria-label="Primary">
    <RouterLink to="/" class="pp-contents__mark" aria-label="Qubitlane home">
      <BrandMark />
    </RouterLink>
    <span class="pp-contents__rule" aria-hidden="true" />
    <ul class="pp-contents__list">
      <li v-for="item in NAV" :key="item.to">
        <RouterLink :to="item.to" class="pp-contents__link" :aria-label="item.label">
          <span class="pp-contents__glyph" aria-hidden="true">
            <Icon :name="item.icon" :size="14" />
          </span>
          <span class="pp-contents__label">{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>
    <span class="pp-contents__foot" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1">
        <circle cx="12" cy="12" r="9" stroke-dasharray="2 3" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      </svg>
    </span>
  </nav>
</template>
