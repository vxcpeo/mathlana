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
    <div role="radiogroup" aria-label="Pick a challenge" class="flex flex-col gap-4">
      <div v-for="group in groups" :key="group.key" class="flex flex-col gap-2">
        <p class="flex items-center gap-1.5 text-[0.72rem] font-medium text-muted-foreground">
          <Icon :name="group.icon" class="size-3.5 shrink-0" :class="group.iconClass" />{{ group.label }}
        </p>
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            v-for="row in group.rows"
            :key="row.slug"
            type="button"
            role="radio"
            :aria-checked="row.slug === selected"
            class="grid min-w-0 grid-cols-[1rem_minmax(0,1fr)_auto] items-center gap-x-2.5 gap-y-0.5 rounded-lg border px-3 py-2.5 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            :class="
              row.slug === selected
                ? 'border-brand-text/70 bg-brand-surface'
                : 'bg-card hover:border-brand-border'
            "
            @click="selected = row.slug"
          >
            <Icon :name="row.icon" class="size-4 text-brand-text" />
            <span class="truncate font-heading text-[0.85rem] font-semibold tracking-[-0.01em]">{{
              row.title
            }}</span>
            <span
              aria-hidden="true"
              class="flex size-4 items-center justify-center rounded-full border"
              :class="
                row.slug === selected
                  ? 'border-brand-text bg-brand-text text-background'
                  : 'border-border'
              "
            >
              <Icon v-if="row.slug === selected" name="check" :stroke-width="2.25" class="size-3" />
            </span>
            <span class="col-span-2 col-start-2 truncate text-[0.72rem] text-muted-foreground">{{
              row.subtitle
            }}</span>
            <span
              class="col-span-2 col-start-2 truncate font-mono text-[0.72rem] text-foreground/80 figures"
              >{{ row.value }} {{ row.unit }}</span
            >
          </button>
        </div>
      </div>
    </div>
  </LaunchStep>
</template>
