<script setup>
/**
 * One rung of the Q-Day ladder: the key size, its curve, the standing smallest
 * correct attack and the reference attack's cost. A ruled row in the blueprint
 * ledger, with the key size set as the figure.
 */
defineProps({
  level: { type: Object, required: true },
});
</script>

<template>
  <article class="pp-ledger__row pp-ladder" :class="level.racing ? 'pp-ladder--live' : ''">
    <div class="pp-ladder__id">
      <p class="pp-ladder__level">
        <span class="pp-ladder__num pp-num">{{ level.bits }}-bit key</span>
      </p>
      <p class="pp-ladder__curve pp-num">{{ level.curve }}</p>
      <span class="pp-tag pp-tag--sm" :class="level.racing ? 'pp-tag--live' : ''">{{
        level.state
      }}</span>
    </div>

    <div class="pp-ladder__col">
      <p class="pp-h4">Smallest correct attack</p>
      <p class="pp-body">{{ level.challenger }}</p>
      <p class="pp-tiny">{{ level.moved }}</p>
    </div>

    <div class="pp-ladder__col">
      <p class="pp-h4">Reference attack</p>
      <p class="pp-ladder__stat">
        <span class="pp-num">{{ level.steps }}</span> two-qubit steps
      </p>
      <p class="pp-ladder__stat">
        <span class="pp-num">{{ level.qubits }}</span> qubits
      </p>
      <p class="pp-tiny">{{ level.hardware }}</p>
    </div>
  </article>
</template>

<style scoped>
.pp-ladder.pp-ledger__row {
  grid-template-columns: minmax(0, 10rem) minmax(0, 1fr) minmax(0, 1.15fr);
  gap: clamp(18px, 3vw, 44px);
  align-items: start;
  padding: 22px 4px;
}

.pp-ladder--live {
  background: color-mix(in srgb, var(--pp-accent-soft) 55%, transparent);
}

.pp-ladder__id {
  display: grid;
  gap: 8px;
  justify-items: start;
  align-content: start;
}

.pp-ladder__id::before {
  counter-increment: crladder;
  content: counter(crladder, decimal-leading-zero);
  font-family: var(--pp-mono);
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  color: var(--pp-muted);
}

.pp-ladder__level {
  display: flex;
  align-items: baseline;
}

.pp-ladder__num {
  font-family: var(--pp-display);
  font-size: clamp(1.4rem, 2vw, 1.75rem);
  font-weight: 620;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--pp-ink);
}

.pp-ladder__unit {
  font-family: var(--pp-mono);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--pp-muted);
}

.pp-ladder__curve {
  font-size: 0.74rem;
  line-height: 1.4;
  color: var(--pp-muted);
  overflow-wrap: anywhere;
}

.pp-ladder__col {
  display: grid;
  gap: 6px;
  align-content: start;
}

.pp-ladder__stat {
  font-size: 0.9rem;
  color: var(--pp-ink-soft);
}

@media (max-width: 760px) {
  .pp-ladder.pp-ledger__row {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }
}
</style>
