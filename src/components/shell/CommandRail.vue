<script setup>
/**
 * The command rail — a fixed 76 px spine on the left edge.
 *
 * It is navigation, not a sidebar: no 240 px panel, no logo block. Each glyph
 * carries the route it opens as a rotated micro-label, so the label is still
 * readable text (never an unlabelled icon) and the rail stays a spine.
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
  <nav class="cq-rail" aria-label="Primary">
    <RouterLink to="/" class="cq-rail__brand" aria-label="Qubitess home">
      <BrandMark class="cq-rail__mark" />
    </RouterLink>

    <span class="cq-rail__hair" aria-hidden="true"></span>

    <ul class="cq-rail__list">
      <li v-for="item in NAV" :key="item.to" class="cq-rail__li">
        <RouterLink :to="item.to" class="cq-rail__link" :aria-label="item.label">
          <span class="cq-rail__glyph" aria-hidden="true">
            <Icon :name="item.icon" :size="16" />
          </span>
          <span class="cq-rail__label">{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>

    <span class="cq-rail__foot" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1">
        <circle cx="12" cy="12" r="9" stroke-dasharray="2 3" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      </svg>
    </span>
  </nav>
</template>
