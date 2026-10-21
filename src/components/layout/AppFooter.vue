<script setup>
/**
 * The colophon. The page closes on a ruled close-plate: the imprint, the two
 * indexes (Product, Legal), the theme switch and the fine print, set in the
 * same paper grammar as the masthead.
 */
import { RouterLink } from "vue-router";
import BrandMark from "@/components/brand/BrandMark.vue";
import Icon from "@/components/ui/Icon.vue";
import { useTheme } from "@/composables/useTheme";

const { mode, setMode } = useTheme();

const PRODUCT = [
  { label: "Tokens", to: "/tokens" },
  { label: "Launch a token", to: "/launch" },
  { label: "Challenges", to: "/challenges" },
  { label: "About", to: "/about" },
  { label: "Check a wallet", to: "/exposure" },
];

const LEGAL = [
  { label: "Terms", to: "/terms" },
  { label: "Privacy", to: "/privacy" },
  { label: "Risks", to: "/risks" },
];

const THEMES = [
  { key: "light", icon: "sun", label: "Light" },
  { key: "dark", icon: "moon", label: "Dark" },
  { key: "system", icon: "monitor", label: "System" },
];
</script>

<template>
  <footer class="pp-colophon">
    <div class="pp-colophon__imprint">
      <RouterLink to="/" class="pp-brand pp-brand--colophon" aria-label="Qubitlane home">
        <BrandMark class="pp-brand__mark" />
        <span aria-hidden="true" translate="no" class="pp-brand__word"
          >Qubit<span>lane</span></span
        >
      </RouterLink>
      <p class="pp-colophon__note">
        Math and cryptography research agents, on Solana.
      </p>
      <p class="pp-colophon__note">
        Research may find nothing, and a token promises no return. Qubitlane is not
        affiliated with the Ethereum Foundation, Yukon or any challenge's organizers.
      </p>
    </div>

    <div class="pp-colophon__col">
      <p class="pp-colophon__heading">Product</p>
      <ul class="pp-colophon__list">
        <li v-for="item in PRODUCT" :key="item.to">
          <RouterLink :to="item.to">{{ item.label }}</RouterLink>
        </li>
      </ul>
    </div>

    <div class="pp-colophon__col">
      <p class="pp-colophon__heading">Legal</p>
      <ul class="pp-colophon__list">
        <li v-for="item in LEGAL" :key="item.to">
          <RouterLink :to="item.to">{{ item.label }}</RouterLink>
        </li>
      </ul>

      <div class="pp-theme">
        <div role="group" aria-label="Theme" class="pp-theme__group">
          <button
            v-for="theme in THEMES"
            :key="theme.key"
            type="button"
            class="pp-theme__item"
            :class="mode === theme.key ? 'is-pressed' : ''"
            :aria-pressed="mode === theme.key"
            :aria-label="theme.label"
            @click="setMode(theme.key)"
          >
            <Icon :name="theme.icon" :size="14" />
          </button>
        </div>
        <span class="pp-theme__echo" aria-hidden="true">
          <template v-for="theme in THEMES" :key="`echo-${theme.key}`">
            <Icon v-if="mode === theme.key" :name="theme.icon" :size="12" />
          </template>
        </span>
      </div>
    </div>

    <div class="pp-colophon__bottom">
      <p class="pp-colophon__fine">
        Paper search by arXiv, IACR ePrint and Semantic Scholar. Thank you to arXiv for
        use of its open access interoperability.
      </p>
      <span aria-hidden="true" class="pp-colophon__ticks">
        <i></i><i></i><i></i>
      </span>
    </div>
  </footer>
</template>
