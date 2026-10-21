<script setup>
/**
 * "What's at stake" — the ruled stake block: what the work protects and the
 * number it defends on the left, the comparison table and the caveat on the
 * right.
 */
defineProps({
  protectsLabel: { type: String, default: "Protects" },
  protects: { type: String, required: true },
  value: { type: String, required: true },
  unit: { type: String, default: null },
});
</script>

<template>
  <div class="pp-stake">
    <div class="pp-stake__facts">
      <div class="pp-stack--tight">
        <p class="pp-h4">{{ protectsLabel }}</p>
        <p class="pp-body">{{ protects }}</p>
      </div>

      <div class="pp-stack--tight">
        <p class="pp-h4">Its number: the public record</p>
        <p class="pp-stake__figure">
          <span class="pp-stake__num pp-num">{{ value }}</span>
          <span v-if="unit" class="pp-stake__unit">{{ unit }}</span>
        </p>
        <slot name="number-note" />
      </div>

      <slot name="extra" />
    </div>

    <div class="pp-stake__scale">
      <p class="pp-h4">For scale</p>
      <slot name="scale" />
      <p class="pp-stake__foot"><slot name="footnote" /></p>
    </div>
  </div>
</template>

<style scoped>
.pp-stake {
  display: grid;
  grid-template-columns: minmax(0, 1.618fr) minmax(0, 1fr);
  gap: clamp(22px, 4vw, 52px);
  align-items: start;
  padding-top: 6px;
}

.pp-stake__facts {
  display: grid;
  gap: var(--pp-t3);
  align-content: start;
  min-width: 0;
}

.pp-stake__figure {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.pp-stake__num {
  font-family: var(--pp-display);
  font-size: clamp(2rem, 3.4vw, 2.8rem);
  font-weight: 620;
  line-height: 0.95;
  letter-spacing: -0.035em;
  color: var(--pp-ink);
  overflow-wrap: anywhere;
}

.pp-stake__unit {
  font-family: var(--pp-mono);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: var(--pp-muted);
}

.pp-stake__scale {
  display: grid;
  gap: 12px;
  align-content: start;
  min-width: 0;
  padding-left: clamp(0px, 2vw, 28px);
  border-left: 1px solid var(--pp-line);
}

.pp-stake__foot {
  margin-top: 4px;
  font-size: 0.72rem;
  line-height: 1.55;
  color: var(--pp-muted);
}

@media (max-width: 1180px) {
  .pp-stake {
    grid-template-columns: minmax(0, 1fr);
  }

  .pp-stake__scale {
    padding-left: 0;
    padding-top: 16px;
    border-left: 0;
    border-top: 1px solid var(--pp-line);
  }
}
</style>
