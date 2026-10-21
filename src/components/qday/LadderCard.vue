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
  <article class="cq-rung" :class="level.racing ? 'cq-rung--live' : ''">
    <div class="cq-rung__lead">
      <p class="cq-rung__level">
        <span class="cq-rung__num cq-num">{{ level.bits }}-bit key</span>
      </p>
      <p class="cq-rung__curve cq-num">{{ level.curve }}</p>
      <span class="cq-tag cq-tag--sm" :class="level.racing ? 'cq-tag--live' : ''">{{
        level.state
      }}</span>
    </div>

    <div class="cq-rung__copy">
      <p class="cq-h4 cq-rung__label">Smallest correct attack</p>
      <p class="cq-body cq-rung__body">{{ level.challenger }}</p>
      <p class="cq-tiny cq-rung__moved">{{ level.moved }}</p>
    </div>

    <div class="cq-rung__cost">
      <p class="cq-h4 cq-rung__label">Reference attack</p>
      <p class="cq-rung__stat">
        <span class="cq-num">{{ level.steps }}</span> two-qubit steps
      </p>
      <p class="cq-rung__stat">
        <span class="cq-num">{{ level.qubits }}</span> qubits
      </p>
      <p class="cq-tiny cq-rung__hardware">{{ level.hardware }}</p>
    </div>
  </article>
</template>

<style scoped>
.cq-rung {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 11rem) minmax(0, 1fr) minmax(0, 1.1fr);
  align-items: start;
  gap: clamp(16px, 3vw, 42px);
  padding: 24px 4px 24px 18px;
  border-top: 1px solid var(--cq-line);
  border-left: 2px solid transparent;
}

.cq-rung:first-child {
  border-top: 0;
}

.cq-rung:last-child {
  border-bottom: 1px solid var(--cq-line);
}

.cq-rung--live {
  border-left-color: var(--cq-accent);
  background: linear-gradient(90deg, var(--cq-accent-soft), transparent 58%);
}

.cq-rung__lead {
  display: grid;
  gap: 8px;
  justify-items: start;
  min-width: 0;
}

.cq-rung__level {
  display: flex;
  align-items: baseline;
  min-width: 0;
}

.cq-rung__num {
  font-family: var(--cq-display);
  font-size: clamp(1.55rem, 2.2vw, 2rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.035em;
  color: var(--cq-ink);
}

.cq-rung__curve {
  font-size: 0.72rem;
  line-height: 1.45;
  color: var(--cq-muted);
  overflow-wrap: anywhere;
}

.cq-rung__copy,
.cq-rung__cost {
  display: grid;
  gap: 6px;
  align-content: start;
  min-width: 0;
}

.cq-rung__label {
  padding-bottom: 4px;
}

.cq-rung__body {
  max-width: 44ch;
}

.cq-rung__stat {
  font-size: 0.9rem;
  line-height: 1.45;
  color: var(--cq-ink-soft);
}

.cq-rung__hardware {
  padding-top: 3px;
}

@media (max-width: 820px) {
  .cq-rung {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .cq-rung__lead {
    grid-column: 1 / -1;
    grid-template-columns: auto auto 1fr;
    align-items: center;
    gap: 10px 16px;
  }

  .cq-rung__curve {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .cq-rung {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
    padding-left: 14px;
  }

  .cq-rung__lead {
    grid-template-columns: minmax(0, 1fr);
    gap: 7px;
  }

  .cq-rung__curve {
    grid-column: auto;
  }
}
</style>
