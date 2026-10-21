<script setup>
/**
 * "What's at stake" — the dark stake panel's ruled interior: what the work
 * protects and the number it defends, then the comparison table and caveat.
 */
defineProps({
  protectsLabel: { type: String, default: "Protects" },
  protects: { type: String, required: true },
  value: { type: String, required: true },
  unit: { type: String, default: null },
});
</script>

<template>
  <div class="cq-chstake">
    <div class="cq-chstake__facts">
      <div class="cq-chstake__copy">
        <p class="cq-h4">{{ protectsLabel }}</p>
        <p class="cq-chstake__protects">{{ protects }}</p>
      </div>

      <div class="cq-chstake__record">
        <p class="cq-h4">Its number: the public record</p>
        <p class="cq-chstake__figure">
          <span class="cq-chstake__num cq-num">{{ value }}</span>
          <span v-if="unit" class="cq-chstake__unit">{{ unit }}</span>
        </p>
        <div class="cq-chstake__note">
          <slot name="number-note" />
        </div>
      </div>

      <slot name="extra" />
    </div>

    <div class="cq-chstake__scale">
      <p class="cq-h4">For scale</p>
      <slot name="scale" />
      <p class="cq-chstake__foot"><slot name="footnote" /></p>
    </div>
  </div>
</template>

<style scoped>
.cq-chstake {
  display: grid;
  gap: clamp(18px, 2.4vw, 28px);
  min-width: 0;
  padding-top: clamp(18px, 2.2vw, 26px);
  border-top: 1px solid var(--cq-line);
}

.cq-chstake__facts {
  display: grid;
  gap: var(--cq-t3);
  min-width: 0;
}

.cq-chstake__copy,
.cq-chstake__record {
  display: grid;
  gap: 7px;
  min-width: 0;
}

.cq-chstake__protects {
  color: var(--cq-ink-soft);
  font-size: 0.92rem;
  line-height: 1.6;
  text-wrap: pretty;
}

.cq-chstake__figure {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 8px;
}

.cq-chstake__num {
  font-family: var(--cq-display);
  font-size: clamp(2rem, 3.2vw, 2.75rem);
  font-weight: 650;
  line-height: 0.92;
  letter-spacing: -0.045em;
  color: var(--cq-ink);
  overflow-wrap: anywhere;
}

.cq-chstake__unit {
  font-family: var(--cq-mono);
  font-size: 0.7rem;
  line-height: 1.4;
  letter-spacing: 0.04em;
  color: var(--cq-muted);
}

.cq-chstake__note {
  min-width: 0;
}

.cq-chstake__scale {
  display: grid;
  gap: 10px;
  min-width: 0;
  padding-top: clamp(16px, 2vw, 22px);
  border-top: 1px solid var(--cq-line);
}

.cq-chstake__foot {
  margin-top: 2px;
  font-size: 0.72rem;
  line-height: 1.55;
  color: var(--cq-muted);
}
</style>
