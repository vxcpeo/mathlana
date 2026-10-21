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
    class="cq-lstep--rail"
  >
    <div role="radiogroup" aria-label="Pick a challenge" class="cq-lpick">
      <div v-for="group in groups" :key="group.key" class="cq-lpick__group">
        <p class="cq-lpick__legend">
          <Icon :name="group.icon" :size="14" class="cq-lpick__glyph" />{{ group.label }}
        </p>
        <div class="cq-lpick__rows">
          <button
            v-for="row in group.rows"
            :key="row.slug"
            type="button"
            role="radio"
            :aria-checked="row.slug === selected"
            class="cq-lpick__choice"
            :class="row.slug === selected ? 'cq-lpick__choice--on' : ''"
            @click="selected = row.slug"
          >
            <span class="cq-lpick__main">
              <Icon :name="row.icon" :size="16" class="cq-lpick__icon" />
              <span class="cq-lpick__title">{{ row.title }}</span>
            </span>
            <span class="cq-lpick__sub">{{ row.subtitle }}</span>
            <span class="cq-lpick__val cq-num">{{ row.value }} {{ row.unit }}</span>
            <span aria-hidden="true" class="cq-lpick__mark">
              <Icon v-if="row.slug === selected" name="check" :stroke-width="2.25" :size="12" />
            </span>
          </button>
        </div>
      </div>
    </div>
  </LaunchStep>
</template>

<style scoped>
.cq-lpick {
  display: grid;
  gap: 16px;
  min-width: 0;
}

.cq-lpick__group {
  min-width: 0;
  border-top: 1px solid var(--cq-ink);
}

.cq-lpick__legend {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 0;
  border-bottom: 1px solid var(--cq-line);
  font-family: var(--cq-mono);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cq-ink);
}

.cq-lpick__glyph {
  flex: 0 0 auto;
  color: var(--cq-accent-text);
}

.cq-lpick__rows {
  display: grid;
  min-width: 0;
}

.cq-lpick__choice {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 3px 12px;
  width: 100%;
  min-width: 0;
  padding: 11px 5px 11px 8px;
  text-align: left;
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--cq-line-soft);
  border-left: 2px solid transparent;
  transition: background-color var(--cq-fast) var(--cq-ease),
    border-color var(--cq-fast) var(--cq-ease);
}

.cq-lpick__choice:last-child {
  border-bottom: 0;
}

.cq-lpick__choice:hover {
  background: var(--cq-sheet-soft);
  border-left-color: var(--cq-line-strong);
}

.cq-lpick__choice--on {
  background: var(--cq-accent-soft);
  border-left-color: var(--cq-accent);
}

.cq-lpick__main {
  grid-column: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.cq-lpick__icon {
  flex: 0 0 auto;
  color: var(--cq-accent-text);
}

.cq-lpick__title {
  min-width: 0;
  font-family: var(--cq-display);
  font-size: 0.98rem;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--cq-ink);
  overflow-wrap: anywhere;
}

.cq-lpick__sub {
  grid-column: 1;
  padding-left: 24px;
  font-size: 0.72rem;
  line-height: 1.45;
  color: var(--cq-muted);
  overflow-wrap: anywhere;
}

.cq-lpick__val {
  grid-column: 1;
  padding-left: 24px;
  font-size: 0.66rem;
  color: var(--cq-ink-soft);
  overflow-wrap: anywhere;
}

.cq-lpick__mark {
  grid-column: 2;
  grid-row: 1 / span 3;
  align-self: center;
  display: grid;
  place-items: center;
  width: 17px;
  height: 17px;
  border: 1px solid var(--cq-line-strong);
  color: var(--cq-sheet);
}

.cq-lpick__choice--on .cq-lpick__mark {
  background: var(--cq-accent);
  border-color: var(--cq-accent);
}
</style>
