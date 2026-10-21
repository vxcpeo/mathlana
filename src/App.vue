<script setup>
import { RouterView } from "vue-router";
import CommandRail from "@/components/shell/CommandRail.vue";
import CommandDock from "@/components/shell/CommandDock.vue";
import CommandBar from "@/components/shell/CommandBar.vue";
import QuantumTicker from "@/components/layout/QuantumTicker.vue";
import Colophon from "@/components/shell/Colophon.vue";
</script>

<template>
  <div class="cq-app">
    <a href="#main" class="cq-skip sr-only">Skip to content</a>
    <CommandRail />
    <CommandDock />
    <div class="cq-app__frame">
      <CommandBar />
      <main id="main" class="cq-main">
        <RouterView />
      </main>
      <Colophon />
    </div>
    <div class="cq-stdout" role="presentation">
      <QuantumTicker />
    </div>
  </div>
</template>
