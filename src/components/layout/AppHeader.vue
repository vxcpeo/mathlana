<script setup>
/**
 * The masthead — the documentary front page header.
 *
 * A wordmark and the two actions sit on the first line; the route index is a
 * ruled line beneath it, like the contents strip of a printed journal. The live
 * wire follows in the shell. No floating bar, no rail, no pills.
 */
import { ref } from "vue";
import { RouterLink } from "vue-router";
import BrandMark from "@/components/brand/BrandMark.vue";
import AppButton from "@/components/ui/AppButton.vue";
import Icon from "@/components/ui/Icon.vue";

const NAV = [
  { label: "Tokens", to: "/tokens" },
  { label: "Challenges", to: "/challenges" },
  { label: "How it works", to: "/#how" },
  { label: "About", to: "/about" },
  { label: "Check a wallet", to: "/exposure" },
];

const menuOpen = ref(false);
</script>

<template>
  <header class="pp-masthead">
    <div class="pp-masthead__brandrow">
      <RouterLink to="/" class="pp-brand" aria-label="Qubitlane home">
        <BrandMark class="pp-brand__mark" />
        <span aria-hidden="true" translate="no" class="pp-brand__word"
          >Qubit<span>lane</span></span
        >
      </RouterLink>

      <div class="pp-masthead__actions">
        <AppButton to="/launch" class="pp-masthead__cta">Launch a token</AppButton>
        <AppButton variant="outline" @click="$emit('sign-in')">Sign in</AppButton>
        <AppButton
          variant="ghost"
          size="icon"
          class="pp-masthead__menu"
          aria-label="Open the menu"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <Icon :name="menuOpen ? 'x' : 'menu'" />
        </AppButton>
      </div>
    </div>

    <div class="pp-masthead__indexrow">
      <nav class="pp-indexbar" aria-label="Sections">
        <RouterLink
          v-for="item in NAV"
          :key="item.to"
          :to="item.to"
          class="pp-indexbar__link"
          >{{ item.label }}</RouterLink
        >
      </nav>
      <span class="pp-masthead__marks" aria-hidden="true">
        <i></i><i></i><i></i>
      </span>
    </div>

    <div v-if="menuOpen" class="pp-masthead__sheet">
      <nav class="pp-masthead__sheetnav" aria-label="Sections, compact">
        <RouterLink
          v-for="item in NAV"
          :key="item.to"
          :to="item.to"
          class="pp-masthead__sheetlink"
          @click="menuOpen = false"
          >{{ item.label }}</RouterLink
        >
        <RouterLink
          to="/launch"
          class="pp-masthead__sheetlink pp-masthead__sheetlink--cta"
          @click="menuOpen = false"
          >Launch a token</RouterLink
        >
      </nav>
    </div>
  </header>
</template>
