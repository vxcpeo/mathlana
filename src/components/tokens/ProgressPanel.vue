<script setup>
/**
 * Progress: the four milestones Qubitlane's own check can mark, and the slot
 * where the agent's notes appear once a session has run.
 */
import Icon from "@/components/ui/Icon.vue";

const MILESTONES = [
  {
    title: "A change of its own builds",
    note: "Not yet: the first rung is a change of its own that builds and passes the audit.",
  },
  {
    title: "Closest to the record",
    note: "Not yet: a change that builds gets a score.",
  },
  {
    title: "Lemmas proved",
    note: "Not yet: a lemma counts once a checked change proves it in Lean.",
  },
  {
    title: "Beats the record",
    note: "Not yet: a score past the record that Qubitlane's own check passes.",
  },
];
</script>

<template>
  <section aria-labelledby="progress-title" class="pp-sec">
    <div class="pp-sec__head">
      <h2 id="progress-title" class="pp-h2">Progress</h2>
      <p class="pp-eyebrow pp-progress__state">No session milestones yet</p>
    </div>

    <div class="pp-split">
      <div class="pp-stack">
        <h3 class="pp-h4 pp-inline">
          <Icon name="circle-check" :size="13" class="pp-tone-live" :stroke-width="1.75" />
          <span class="pp-progress__h3">Checked by Qubitlane</span>
        </h3>

        <ol class="pp-progress__list">
          <li
            v-for="(milestone, index) in MILESTONES"
            :key="milestone.title"
            class="pp-progress__item"
          >
            <span class="pp-index pp-progress__index">{{ String(index + 1).padStart(2, "0") }}</span>
            <span role="img" aria-label="Not reached yet" class="pp-progress__mark">
              <span aria-hidden="true" class="pp-progress__dot" />
            </span>
            <div class="pp-progress__text">
              <p class="pp-progress__title">{{ milestone.title }}</p>
              <p class="pp-small pp-tone-muted">{{ milestone.note }}</p>
            </div>
          </li>
        </ol>
      </div>

      <div class="pp-margin pp-progress__notes">
        <div class="pp-margin__block">
          <h3 class="pp-h4 pp-inline">
            <span aria-hidden="true" class="pp-progress__dash" />
            <span class="pp-progress__h3">The agent's notes</span>
          </h3>
          <p class="pp-small pp-tone-muted">
            No notes yet. What the agent measures, rules out or would try next shows here, in its
            own words.
          </p>
        </div>
      </div>
    </div>

    <p class="pp-tiny pp-progress__fine">
      Green marks only what Qubitlane's check or Lean proved. The agent's notes and milestones are
      its own word.
    </p>
  </section>
</template>

<style scoped>
.pp-progress__state {
  white-space: nowrap;
}

.pp-progress__h3 {
  min-width: 0;
  overflow-wrap: anywhere;
}

.pp-progress__list {
  display: grid;
  border-top: 1px solid var(--pp-line);
}

.pp-progress__item {
  display: grid;
  grid-template-columns: 34px 16px minmax(0, 1fr);
  align-items: start;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--pp-line-soft);
}

.pp-progress__item:last-child {
  border-bottom: 0;
}

.pp-progress__index {
  padding-top: 2px;
}

.pp-progress__mark {
  position: relative;
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  margin-top: 3px;
}

.pp-progress__dot {
  width: 9px;
  height: 9px;
  border: 1px solid var(--pp-line-strong);
  border-radius: 999px;
  background: var(--pp-sheet);
}

.pp-progress__text {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.pp-progress__title {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--pp-muted);
  overflow-wrap: anywhere;
}

.pp-progress__dash {
  width: 14px;
  height: 1px;
  flex-shrink: 0;
  background: var(--pp-note);
}

.pp-progress__notes {
  padding-top: 2px;
}

.pp-progress__fine {
  margin-top: var(--pp-t3);
  max-width: 78ch;
}

@media (max-width: 560px) {
  .pp-progress__item {
    grid-template-columns: 26px 16px minmax(0, 1fr);
    gap: 10px;
  }
}
</style>
