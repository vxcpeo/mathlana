<script setup>
import { RouterView } from "vue-router";
import AppHeader from "@/components/layout/AppHeader.vue";
import AppRail from "@/components/rail/AppRail.vue";
import QuantumTicker from "@/components/layout/QuantumTicker.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
</script>

<template>
  <div class="pp-paper">
    <a href="#main" class="pp-skip sr-only">Skip to content</a>
    <AppHeader />
    <QuantumTicker />
    <div class="pp-shell">
      <main id="main" class="pp-main">
        <RouterView />
      </main>
      <aside class="pp-contents" aria-label="Contents">
        <AppRail />
      </aside>
    </div>
    <AppFooter />
  </div>
</template>
