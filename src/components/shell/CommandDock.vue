<script setup>
/**
 * The dock — the rail's counterpart under 960 px.
 *
 * A five-glyph bar along the bottom edge. Each glyph keeps its label, so the
 * dock is never an unlabelled icon row on a phone.
 */
import { RouterLink } from "vue-router";
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
  <nav class="cq-dock" aria-label="Primary">
    <ul class="cq-dock__list">
      <li v-for="item in NAV" :key="item.to" class="cq-dock__li">
        <RouterLink :to="item.to" class="cq-dock__link" :aria-label="item.label">
          <span class="cq-dock__glyph" aria-hidden="true">
            <Icon :name="item.icon" :size="17" />
          </span>
          <span class="cq-dock__label">{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
