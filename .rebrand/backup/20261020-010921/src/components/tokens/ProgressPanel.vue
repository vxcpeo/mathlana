<script setup>
/**
 * Progress: the four milestones Mathlana's own check can mark, and the slot
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
    note: "Not yet: a score past the record that Mathlana's own check passes.",
  },
];
</script>

<template>
  <section aria-labelledby="progress-title" class="flex flex-col gap-3">
    <div class="flex min-w-0 items-baseline justify-between gap-4">
      <h2 id="progress-title" class="headline text-xl whitespace-nowrap">Progress</h2>
      <p class="min-w-0 truncate text-xs whitespace-nowrap text-muted-foreground">
        No session milestones yet
      </p>
    </div>

    <div
      class="grid grid-cols-1 overflow-hidden rounded-xl border bg-card lg:grid-cols-[minmax(0,1.618fr)_minmax(0,1fr)]"
    >
      <div class="flex min-w-0 flex-col gap-3 p-4 sm:p-5">
        <h3
          class="flex min-w-0 items-center gap-1.5 text-[0.7rem] font-medium tracking-[0.08em] whitespace-nowrap text-quiet uppercase"
        >
          <Icon name="circle-check" class="size-3 shrink-0 text-proven-text" :stroke-width="1.75" />
          <span class="truncate">Checked by Mathlana</span>
        </h3>

        <ol class="flex flex-col">
          <li
            v-for="(milestone, index) in MILESTONES"
            :key="milestone.title"
            class="relative flex min-w-0 gap-3 pb-3.5 last:pb-0"
          >
            <span
              v-if="index < MILESTONES.length - 1"
              aria-hidden="true"
              class="absolute top-6 bottom-1 left-[0.5625rem] w-px bg-border"
            />
            <span
              role="img"
              aria-label="Not reached yet"
              class="relative flex size-[1.125rem] shrink-0 items-center justify-center"
            >
              <span class="size-3.5 rounded-full border border-foreground/20 bg-card" />
            </span>
            <div class="flex min-w-0 flex-1 flex-col gap-0.5">
              <div class="flex min-w-0 items-baseline justify-between gap-3">
                <span
                  class="min-w-0 truncate text-sm font-medium whitespace-nowrap text-muted-foreground"
                  >{{ milestone.title }}</span
                >
              </div>
              <div class="min-w-0 text-xs text-pretty text-quiet">{{ milestone.note }}</div>
            </div>
          </li>
        </ol>
      </div>

      <div class="flex min-w-0 flex-col gap-3 border-t p-4 sm:p-5 lg:border-t-0 lg:border-l">
        <h3
          class="flex min-w-0 items-center gap-1.5 text-[0.7rem] font-medium tracking-[0.08em] whitespace-nowrap text-quiet uppercase"
        >
          <span aria-hidden="true" class="h-3 w-0 shrink-0 border-l border-dashed border-note-text" />
          <span class="truncate">The agent's notes</span>
        </h3>
        <p class="text-xs text-pretty text-quiet">
          No notes yet. What the agent measures, rules out or would try next shows here, in its own
          words.
        </p>
      </div>
    </div>

    <p class="text-xs text-pretty text-quiet">
      Green marks only what Mathlana's check or Lean proved. The agent's notes and milestones are
      its own word.
    </p>
  </section>
</template>
