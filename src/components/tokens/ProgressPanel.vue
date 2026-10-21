<script setup>
/**
 * Progress: the four milestones Qubitess's own check can mark, and the slot
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
    note: "Not yet: a score past the record that Qubitess's own check passes.",
  },
];
</script>

<template>
  <section aria-labelledby="progress-title" class="cq-sheet cq-progress">
    <div class="cq-sheet__head cq-progress__head">
      <h2 id="progress-title" class="cq-sheet__title">Progress</h2>
      <p class="cq-eyebrow cq-progress__state">No session milestones yet</p>
    </div>

    <div class="cq-sheet__body cq-progress__body">
      <h3 class="cq-h4 cq-inline">
        <Icon name="circle-check" :size="13" class="cq-tone-live" :stroke-width="1.75" />
        <span class="cq-progress__h3">Checked by Qubitess</span>
      </h3>

      <ol class="cq-progress__list">
        <li
          v-for="(milestone, index) in MILESTONES"
          :key="milestone.title"
          class="cq-progress__item"
        >
          <span class="cq-index cq-progress__index">{{ String(index + 1).padStart(2, "0") }}</span>
          <span role="img" aria-label="Not reached yet" class="cq-progress__mark">
            <span aria-hidden="true" class="cq-progress__dot" />
          </span>
          <div class="cq-progress__text">
            <p class="cq-progress__title">{{ milestone.title }}</p>
            <p class="cq-small cq-tone-muted">{{ milestone.note }}</p>
          </div>
        </li>
      </ol>

      <div class="cq-progress__notes">
        <h3 class="cq-h4 cq-inline">
          <span aria-hidden="true" class="cq-progress__dash" />
          <span class="cq-progress__h3">The agent's notes</span>
        </h3>
        <p class="cq-small cq-tone-muted">
          No notes yet. What the agent measures, rules out or would try next shows here, in its
          own words.
        </p>
      </div>

      <p class="cq-tiny cq-progress__fine">
        Green marks only what Qubitess's check or Lean proved. The agent's notes and milestones are
        its own word.
      </p>
    </div>
  </section>
</template>

<style scoped>
.cq-progress {
  gap: 0;
  overflow: clip;
}

.cq-progress__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 6px 16px;
  padding: 16px clamp(16px, 2vw, 22px) 13px;
}

.cq-progress__state {
  white-space: nowrap;
}

.cq-progress__body {
  gap: 16px;
  padding: 16px clamp(16px, 2vw, 22px) 18px;
}

.cq-progress__h3 {
  min-width: 0;
  overflow-wrap: anywhere;
}

.cq-progress__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  border-top: 1px solid var(--cq-line);
}

.cq-progress__item {
  display: grid;
  grid-template-columns: 34px 16px minmax(0, 1fr);
  align-items: start;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid var(--cq-line-soft);
}

.cq-progress__item:last-child {
  border-bottom: 0;
}

.cq-progress__index {
  padding-top: 2px;
}

.cq-progress__mark {
  position: relative;
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  margin-top: 3px;
}

.cq-progress__dot {
  width: 9px;
  height: 9px;
  border: 1px solid var(--cq-line-strong);
  border-radius: 999px;
  background: var(--cq-sheet);
}

.cq-progress__text {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.cq-progress__title {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--cq-muted);
  overflow-wrap: anywhere;
}

.cq-progress__notes {
  display: grid;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--cq-ink);
}

.cq-progress__dash {
  width: 14px;
  height: 1px;
  flex-shrink: 0;
  background: var(--cq-note);
}

.cq-progress__fine {
  max-width: 78ch;
  margin: 0;
}

@media (max-width: 560px) {
  .cq-progress__item {
    grid-template-columns: 26px 16px minmax(0, 1fr);
    gap: 10px;
  }
}
</style>
