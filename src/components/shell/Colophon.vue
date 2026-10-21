<script setup>
/**
 * The colophon — a dark closing plate under the page.
 *
 * Three zones: the imprint on the left, the two indexes in the middle, and the
 * fine print on a base rule. The theme control sits with the legal index, where
 * a reader looks for settings rather than content.
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
  <footer class="cq-colophon">
    <div class="cq-colophon__top">
      <div class="cq-colophon__imprint">
        <RouterLink to="/" class="cq-colophon__brand" aria-label="Qubitess home">
          <BrandMark class="cq-colophon__mark" />
          <span aria-hidden="true" translate="no" class="cq-colophon__word"
            >Qubit<span>ess</span></span
          >
        </RouterLink>
        <p class="cq-colophon__note">
          Math and cryptography research agents, on Solana.
        </p>
        <p class="cq-colophon__note">
          Research may find nothing, and a token promises no return. Qubitess is not
          affiliated with the Ethereum Foundation, Yukon or any challenge's organizers.
        </p>
      </div>

      <div class="cq-colophon__col">
        <p class="cq-colophon__heading">Product</p>
        <ul class="cq-colophon__list">
          <li v-for="item in PRODUCT" :key="item.to">
            <RouterLink :to="item.to">{{ item.label }}</RouterLink>
          </li>
        </ul>
      </div>

      <div class="cq-colophon__col">
        <p class="cq-colophon__heading">Legal</p>
        <ul class="cq-colophon__list">
          <li v-for="item in LEGAL" :key="item.to">
            <RouterLink :to="item.to">{{ item.label }}</RouterLink>
          </li>
        </ul>

        <div class="cq-theme">
          <div role="group" aria-label="Theme" class="cq-theme__group">
            <button
              v-for="theme in THEMES"
              :key="theme.key"
              type="button"
              class="cq-theme__item"
              :class="mode === theme.key ? 'is-pressed' : ''"
              :aria-pressed="mode === theme.key"
              :aria-label="theme.label"
              @click="setMode(theme.key)"
            >
              <Icon :name="theme.icon" :size="14" />
            </button>
          </div>
          <span class="cq-theme__echo" aria-hidden="true">
            <template v-for="theme in THEMES" :key="`echo-${theme.key}`">
              <Icon v-if="mode === theme.key" :name="theme.icon" :size="12" />
            </template>
          </span>
        </div>
      </div>
    </div>

    <div class="cq-colophon__base">
      <p class="cq-colophon__fine">
        Paper search by arXiv, IACR ePrint and Semantic Scholar. Thank you to arXiv for
        use of its open access interoperability.
      </p>
      <span aria-hidden="true" class="cq-colophon__ticks">
        <i></i><i></i><i></i>
      </span>
    </div>
  </footer>
</template>
