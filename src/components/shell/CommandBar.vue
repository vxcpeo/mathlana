<script setup>
/**
 * The command bar — a floating header, detached from the top edge.
 *
 * One row: the brand lockup, then the two actions. The route index lives in the
 * rail, so the command bar stays a control strip rather than a menu. The compact
 * sheet repeats the sections for narrow viewports only.
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
  <header class="cq-command">
    <div class="cq-command__bar">
      <RouterLink to="/" class="cq-command__brand" aria-label="Qubitess home">
        <BrandMark class="cq-command__mark" />
        <span aria-hidden="true" translate="no" class="cq-command__word"
          >Qubit<span>ess</span></span
        >
      </RouterLink>

      <span class="cq-command__meter" aria-hidden="true">
        <i></i><i></i><i></i><i></i>
      </span>

      <div class="cq-command__actions">
        <AppButton to="/launch" class="cq-command__cta">Launch a token</AppButton>
        <AppButton variant="outline" @click="$emit('sign-in')">Sign in</AppButton>
        <AppButton
          variant="ghost"
          size="icon"
          class="cq-command__menu"
          aria-label="Open the menu"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <Icon :name="menuOpen ? 'x' : 'menu'" />
        </AppButton>
      </div>
    </div>

    <div v-if="menuOpen" class="cq-command__sheet">
      <nav class="cq-command__sheetnav" aria-label="Sections, compact">
        <RouterLink
          v-for="item in NAV"
          :key="item.to"
          :to="item.to"
          class="cq-command__sheetlink"
          @click="menuOpen = false"
          >{{ item.label }}</RouterLink
        >
        <RouterLink
          to="/launch"
          class="cq-command__sheetlink cq-command__sheetlink--cta"
          @click="menuOpen = false"
          >Launch a token</RouterLink
        >
      </nav>
    </div>
  </header>
</template>
