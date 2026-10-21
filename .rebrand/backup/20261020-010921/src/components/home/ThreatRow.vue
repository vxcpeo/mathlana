<script setup>
/** One challenge row inside a threat panel. */
import Icon from "@/components/ui/Icon.vue";

defineProps({
  to: { type: String, required: true },
  ariaLabel: { type: String, default: null },
  icon: { type: String, required: true },
  /** Row title, optionally followed by an inline qualifier (e.g. "Point addition"). */
  title: { type: String, required: true },
  qualifier: { type: String, default: null },
  description: { type: String, default: null },
  value: { type: String, required: true },
  unit: { type: String, default: null },
  /** Small line under the value ("No token on it yet"). */
  note: { type: String, default: null },
  /** 0-100; when set, renders the rail plus the label on the right. */
  progress: { type: Number, default: null },
  progressLabel: { type: String, default: null },
  /** Tint the value (the Q-Day clock uses brand; metrics use foreground). */
  valueTone: { type: String, default: "foreground" },
});
</script>

<template>
  <li>
    <RouterLink
      :to="to"
      :aria-label="ariaLabel ?? undefined"
      class="group/row grid grid-cols-[1.125rem_minmax(0,1fr)_auto] items-start gap-x-3 px-5 py-3.5 transition-colors outline-none hover:bg-accent/50 focus-visible:bg-accent/50"
    >
      <Icon :name="icon" class="mt-0.5 size-4 text-brand-text" />

      <span class="flex min-w-0 flex-col gap-0.5">
        <span class="truncate font-heading text-sm font-semibold tracking-[-0.01em]">
          {{ title }}
          <span v-if="qualifier" class="font-sans font-normal text-muted-foreground">
            · {{ qualifier }}
          </span>
        </span>
        <span v-if="description" class="truncate text-xs text-muted-foreground">{{
          description
        }}</span>
      </span>

      <span
        class="col-span-2 col-start-2 mt-2 flex items-center gap-3 sm:col-span-1 sm:col-start-auto sm:mt-0"
      >
        <span
          class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 sm:flex-col sm:flex-nowrap sm:items-end sm:text-right [&>span]:whitespace-nowrap"
        >
          <span class="flex items-baseline gap-1.5">
            <span
              class="font-mono text-[0.95rem] leading-none font-medium figures"
              :class="valueTone === 'brand' ? 'text-brand-text' : 'text-foreground'"
              >{{ value }}</span
            >
            <span v-if="unit" class="text-xs text-muted-foreground">{{ unit }}</span>
          </span>
          <span v-if="note" class="text-[0.7rem] text-muted-foreground">{{ note }}</span>
        </span>
        <Icon
          name="arrow-up-right"
          class="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/row:opacity-100"
        />
      </span>

      <span v-if="progress !== null" class="col-span-2 col-start-2 mt-2.5 flex items-center gap-3">
        <span aria-hidden="true" class="h-1 flex-1 overflow-hidden rounded-full bg-muted">
          <span
            class="block h-full rounded-full bg-brand"
            :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }"
          />
        </span>
        <span
          v-if="progressLabel"
          class="font-mono text-[0.68rem] whitespace-nowrap text-muted-foreground figures"
          >{{ progressLabel }}</span
        >
      </span>
    </RouterLink>
  </li>
</template>
