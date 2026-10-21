<script setup>
/**
 * The metric panel on a challenge page: the challenge and metric names, the
 * record where it started, the rail, and the link out to the leaderboard.
 */
import Icon from "@/components/ui/Icon.vue";

defineProps({
  /** Built by the view from the registry plus `presentation.js`. */
  panel: { type: Object, required: true },
});
</script>

<template>
  <div class="flex flex-col gap-5 rounded-xl border bg-card p-5">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="truncate font-heading text-sm font-semibold tracking-[-0.01em]">
          {{ panel.title }}
        </p>
        <p class="truncate text-xs text-muted-foreground">{{ panel.label }}</p>
        <p class="truncate text-xs text-quiet">{{ panel.description }}</p>
      </div>
      <span class="shrink-0 rounded-md border px-2 py-0.5 text-[0.7rem] text-muted-foreground">{{
        panel.direction
      }}</span>
    </div>

    <dl class="grid grid-cols-1 gap-4 min-[22rem]:grid-cols-2">
      <div class="flex flex-col gap-1">
        <dt class="text-[0.7rem] font-medium tracking-[0.06em] text-quiet uppercase">
          {{ panel.recordLabel }}
        </dt>
        <dd
          class="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 font-mono text-xl leading-none figures sm:text-2xl"
        >
          <span class="whitespace-nowrap">{{ panel.value }}</span>
          <span class="text-sm whitespace-nowrap text-muted-foreground">{{ panel.unit }}</span>
        </dd>
      </div>
      <div class="flex flex-col gap-1">
        <dt class="text-[0.7rem] font-medium tracking-[0.06em] text-quiet uppercase">
          Where it started
        </dt>
        <dd
          class="font-mono text-xl leading-none whitespace-nowrap text-muted-foreground figures sm:text-2xl"
        >
          {{ panel.start }}
        </dd>
      </div>
      <div v-if="panel.extra" class="flex flex-col gap-1 min-[22rem]:col-span-2">
        <dt class="text-[0.7rem] font-medium tracking-[0.06em] text-quiet uppercase">
          {{ panel.extra.label
          }}<span class="px-1.5 normal-case" aria-hidden="true">·</span
          ><span class="normal-case">{{ panel.extra.labelNote }}</span>
        </dt>
        <dd
          class="font-mono text-base leading-none whitespace-nowrap text-muted-foreground figures"
        >
          {{ panel.extra.value }} <span class="text-sm">{{ panel.extra.unit }}</span>
        </dd>
      </div>
    </dl>

    <div class="flex flex-col gap-2">
      <div class="h-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div class="h-full rounded-full bg-brand" :style="{ width: `${panel.progress}%` }" />
      </div>
      <div class="flex items-center justify-between text-xs text-muted-foreground">
        <span class="font-mono figures">{{ panel.progressLabel }}</span>
        <span v-if="panel.progressRight" class="font-mono figures">{{ panel.progressRight }}</span>
      </div>
    </div>

    <a
      :href="panel.leaderboard"
      target="_blank"
      rel="noreferrer"
      class="flex items-center justify-between gap-3 border-t pt-3 text-xs text-muted-foreground hover:text-foreground"
      >Official leaderboard<Icon name="external-link" class="size-3"
    /></a>
  </div>
</template>
