<script setup>
/**
 * A challenge metric sheet: the running record, its scale, and the public rail.
 * The prose facts that sit beside it in the stage belong to the route.
 */
defineProps({
  /** Built by the view from the registry plus `presentation.js`. */
  panel: { type: Object, required: true },
});
</script>

<template>
  <article class="cq-sheet cq-chmetric">
    <header class="cq-chmetric__head">
      <p class="cq-h4">{{ panel.label }}</p>
      <h3 class="cq-chmetric__title">{{ panel.title }}</h3>
      <p class="cq-chmetric__desc">{{ panel.description }}</p>
    </header>

    <div class="cq-chmetric__data">
      <div class="cq-chmetric__record">
        <p class="cq-h4">{{ panel.recordLabel }}</p>
        <p class="cq-chmetric__figure">
          <span class="cq-num">{{ panel.value }}</span>
          <span class="cq-chmetric__unit">{{ panel.unit }}</span>
        </p>
      </div>

      <div class="cq-chmetric__rail">
        <div class="cq-meter cq-chmetric__meter" aria-hidden="true">
          <div class="cq-meter__fill" :style="{ width: `${panel.progress}%` }" />
        </div>
        <p class="cq-chmetric__progress cq-num">{{ panel.progressLabel }}</p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.cq-chmetric {
  overflow: clip;
}

.cq-chmetric__head {
  display: grid;
  gap: 7px;
  padding: clamp(20px, 2.4vw, 30px) clamp(20px, 2.6vw, 34px);
  border-bottom: 1px solid var(--cq-line);
  background: linear-gradient(180deg, var(--cq-sheet) 0%, var(--cq-sheet-soft) 100%);
}

.cq-chmetric__title {
  font-family: var(--cq-display);
  font-size: clamp(1.25rem, 1.8vw, 1.6rem);
  font-weight: var(--cq-display-weight);
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: var(--cq-ink);
}

.cq-chmetric__desc {
  max-width: 52ch;
  font-size: 0.86rem;
  line-height: 1.5;
  color: var(--cq-muted);
}

.cq-chmetric__data {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(190px, 0.52fr);
  align-items: end;
  gap: clamp(18px, 3vw, 44px);
  padding: clamp(20px, 2.4vw, 30px) clamp(20px, 2.6vw, 34px);
}

.cq-chmetric__record {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.cq-chmetric__figure {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 5px 10px;
}

.cq-chmetric__figure .cq-num {
  font-family: var(--cq-display);
  font-size: clamp(2.4rem, 5vw, 4.6rem);
  font-weight: 650;
  line-height: 0.86;
  letter-spacing: -0.055em;
  color: var(--cq-ink);
  overflow-wrap: anywhere;
}

.cq-chmetric__unit {
  font-family: var(--cq-mono);
  font-size: 0.72rem;
  line-height: 1.45;
  letter-spacing: 0.04em;
  color: var(--cq-muted);
}

.cq-chmetric__rail {
  display: grid;
  justify-items: end;
  gap: 9px;
  min-width: 0;
}

.cq-chmetric__meter {
  width: 100%;
  height: 7px;
}

.cq-chmetric__progress {
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: var(--cq-muted);
  text-align: right;
}

@media (max-width: 640px) {
  .cq-chmetric__data {
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
    gap: 18px;
  }

  .cq-chmetric__rail {
    justify-items: start;
  }

  .cq-chmetric__progress {
    text-align: left;
  }
}
</style>
