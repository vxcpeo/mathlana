<script setup>
/**
 * Step 03 — the challenge radio group: a header per threat family, then the
 * rows it holds. Selecting a row drives the sticky preview's footer.
 */
import { computed } from "vue";
import Icon from "@/components/ui/Icon.vue";
import LaunchStep from "@/components/launch/LaunchStep.vue";
import { CHALLENGE_GROUPS, LAUNCH_CHALLENGE_ROWS } from "@/components/launch/launchChallenges";

const selected = defineModel({ type: String, required: true });

const groups = computed(() =>
  CHALLENGE_GROUPS.map((group) => ({
    ...group,
    rows: LAUNCH_CHALLENGE_ROWS.filter((row) => row.group === group.key),
  })).filter((group) => group.rows.length),
);
</script>

<template>
  <LaunchStep
    index="03"
    title="Pick a challenge"
    hint="Your token works on this one for good, unless the challenge closes."
  >
    <div role="radiogroup" aria-label="Pick a challenge" class="pp-choices">
      <div v-for="group in groups" :key="group.key" class="pp-choices__group">
        <p class="pp-choices__legend">
          <Icon :name="group.icon" :size="14" class="pp-choices__glyph" />{{ group.label }}
        </p>
        <div class="pp-choices__rows">
          <button
            v-for="row in group.rows"
            :key="row.slug"
            type="button"
            role="radio"
            :aria-checked="row.slug === selected"
            class="pp-choice"
            :class="row.slug === selected ? 'pp-choice--on' : ''"
            @click="selected = row.slug"
          >
            <span class="pp-choice__main">
              <Icon :name="row.icon" :size="16" class="pp-choice__icon" />
              <span class="pp-choice__title">{{ row.title }}</span>
            </span>
            <span class="pp-choice__sub">{{ row.subtitle }}</span>
            <span class="pp-choice__val pp-num">{{ row.value }} {{ row.unit }}</span>
            <span aria-hidden="true" class="pp-choice__mark">
              <Icon v-if="row.slug === selected" name="check" :stroke-width="2.25" :size="12" />
            </span>
          </button>
        </div>
      </div>
    </div>
  </LaunchStep>
</template>

<style scoped>
.pp-choices {
  display: grid;
  gap: var(--pp-t4);
  min-width: 0;
}

.pp-choices__group {
  min-width: 0;
  background: transparent;
  border: 0;
  border-top: 1px solid var(--pp-ink);
  border-radius: 0;
  overflow: visible;
}

.pp-choices__legend {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 0;
  background: transparent;
  border-bottom: 1px solid var(--pp-line);
  font-family: var(--pp-mono);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--pp-ink);
}

.pp-choices__glyph {
  flex: 0 0 auto;
  color: var(--pp-accent-text);
}

.pp-choices__rows {
  display: grid;
  min-width: 0;
}

.pp-choice {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 3px 16px;
  width: 100%;
  min-width: 0;
  padding: 13px 4px;
  text-align: left;
  background: transparent;
  border-bottom: 1px solid var(--pp-line-soft);
  transition: box-shadow var(--pp-fast) var(--pp-ease), background-color var(--pp-fast) var(--pp-ease);
}

.pp-choice:last-child {
  border-bottom: 0;
}

.pp-choice:hover {
  background: transparent;
  box-shadow: inset 2px 0 0 var(--pp-line-strong);
}

.pp-choice--on {
  background: transparent;
  box-shadow: inset 2px 0 0 var(--pp-accent);
}

.pp-choice__main {
  grid-column: 1;
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}

.pp-choice__icon {
  flex: 0 0 auto;
  color: var(--pp-accent-text);
}

.pp-choice__title {
  min-width: 0;
  font-family: var(--pp-display);
  font-size: 1.02rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--pp-ink);
  overflow-wrap: anywhere;
}

.pp-choice__sub {
  grid-column: 1;
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--pp-muted);
  overflow-wrap: anywhere;
}

.pp-choice__val {
  grid-column: 1;
  font-family: var(--pp-mono);
  font-size: 0.72rem;
  color: var(--pp-ink-soft);
  overflow-wrap: anywhere;
}

.pp-choice__mark {
  grid-column: 2;
  grid-row: 1 / span 3;
  align-self: center;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border: 1px solid var(--pp-line-strong);
  border-radius: 0;
  color: var(--pp-sheet);
}

.pp-choice--on .pp-choice__mark {
  background: var(--pp-accent);
  border-color: var(--pp-accent);
}
</style>
