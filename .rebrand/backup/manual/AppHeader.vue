<script setup>
/** Sticky site header — markup mirrors the reference's `data-slot` structure. */
import { ref } from "vue";
import { RouterLink } from "vue-router";
import BrandMark from "@/components/brand/BrandMark.vue";
import AppButton from "@/components/ui/AppButton.vue";
import Icon from "@/components/ui/Icon.vue";
import QuantumTicker from "@/components/layout/QuantumTicker.vue";

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
  <header
    class="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75"
  >
    <div class="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6">
      <RouterLink
        to="/"
        class="shrink-0 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span
          class="inline-flex items-center gap-[0.5em] text-[1.3rem]"
          role="img"
          aria-label="Qubitlane home"
        >
          <BrandMark />
          <span
            aria-hidden="true"
            translate="no"
            class="font-heading font-semibold tracking-[-0.01em] text-foreground"
            >Math<span style="color: #6c86ff">lana</span></span
          >
        </span>
      </RouterLink>

      <nav class="hidden items-center gap-1 lg:flex">
        <RouterLink
          v-for="item in NAV"
          :key="item.to"
          :to="item.to"
          class="rounded-md px-3 py-2 text-sm whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
          >{{ item.label }}</RouterLink
        >
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <AppButton to="/launch" size="default" class="hidden px-3.5 sm:inline-flex"
          >Launch a token</AppButton
        >
        <AppButton variant="outline" size="default" @click="$emit('sign-in')"
          >Sign in</AppButton
        >
        <div class="lg:hidden">
          <AppButton
            variant="ghost"
            size="icon"
            aria-label="Open the menu"
            :aria-expanded="menuOpen"
            @click="menuOpen = !menuOpen"
          >
            <Icon :name="menuOpen ? 'x' : 'menu'" />
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Mobile sheet -->
    <div v-if="menuOpen" class="border-t lg:hidden">
      <nav class="mx-auto flex w-full max-w-7xl flex-col px-4 py-2 sm:px-6">
        <RouterLink
          v-for="item in NAV"
          :key="item.to"
          :to="item.to"
          class="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          @click="menuOpen = false"
          >{{ item.label }}</RouterLink
        >
        <RouterLink
          to="/launch"
          class="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
          @click="menuOpen = false"
          >Launch a token</RouterLink
        >
      </nav>
    </div>

    <QuantumTicker />
  </header>
</template>
