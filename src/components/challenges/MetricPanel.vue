<script setup>
/**
 * The metric sheet on a challenge page: the challenge and metric names, the
 * record, and the cobalt rail. The surrounding facts (where it started, the
 * public record, the leaderboard link) sit in the page margin.
 */
import PanelCard from "@/components/ui/PanelCard.vue";

defineProps({
  /** Built by the view from the registry plus `presentation.js`. */
  panel: { type: Object, required: true },
});
</script>

<template>
  <PanelCard class="pp-metricsheet">
    <template #header>
      <p class="pp-h4">{{ panel.label }}</p>
      <h3 class="pp-sheet__title">{{ panel.title }}</h3>
      <p class="pp-sheet__sub">{{ panel.description }}</p>
    </template>

    <div class="pp-sheet__body">
      <div class="pp-metric">
        <div class="pp-metric__top">
          <div class="pp-metric__text">
            <p class="pp-metric__label">{{ panel.recordLabel }}</p>
          </div>
          <div class="pp-metric__readout">
            <p class="pp-metric__value">
              <span class="pp-num">{{ panel.value }}</span>
              <span class="pp-metric__unit">{{ panel.unit }}</span>
            </p>
          </div>
        </div>

        <div class="pp-meter pp-metric__meter" aria-hidden="true">
          <div class="pp-meter__fill" :style="{ width: `${panel.progress}%` }" />
        </div>

        <div class="pp-metric__foot">
          <span class="pp-num">{{ panel.progressLabel }}</span>
        </div>
      </div>
    </div>
  </PanelCard>
</template>

<style scoped>
.pp-metricsheet .pp-sheet__body {
  gap: 0;
  padding-top: 6px;
  padding-bottom: 12px;
}

.pp-metricsheet .pp-metric {
  padding-bottom: 0;
  border-bottom: 0;
}

.pp-metricsheet .pp-metric__value .pp-num {
  font-size: clamp(1.5rem, 2.4vw, 2rem);
  font-weight: 620;
  letter-spacing: -0.03em;
}

.pp-metricsheet .pp-metric__label {
  font-family: var(--pp-display);
  font-size: 0.95rem;
  font-weight: 620;
  letter-spacing: -0.01em;
  color: var(--pp-ink);
}

@media (max-width: 560px) {
  .pp-metricsheet .pp-metric__top {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .pp-metricsheet .pp-metric__readout {
    text-align: left;
  }

  .pp-metricsheet .pp-metric__value {
    justify-content: flex-start;
  }
}
</style>
