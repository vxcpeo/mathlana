<script setup>
/** A "not open yet" challenge: a dashed card with a status pill. */
import ChallengeIcon from "@/components/challenges/ChallengeIcon.vue";

defineProps({
  challenge: { type: Object, required: true },
  copy: { type: Object, required: true },
});
</script>

<template>
  <div class="flex min-w-0 items-start gap-3 rounded-xl border border-dashed px-5 py-4">
    <ChallengeIcon :name="copy.icon" class="shrink-0 mt-1 size-4 text-muted-foreground" />
    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <p class="flex items-center gap-2">
        <span class="truncate font-heading text-base font-semibold tracking-[-0.01em]">{{
          challenge.name
        }}</span>
        <span
          class="rounded-md border px-1.5 text-[0.68rem] leading-5"
          :class="
            copy.statusTone === 'brand'
              ? 'border-brand-border text-brand-text'
              : 'text-muted-foreground'
          "
          >{{ challenge.status }}</span
        >
      </p>
      <p class="text-[0.82rem] text-pretty text-muted-foreground">{{ challenge.description }}</p>
      <p class="text-[0.72rem] text-quiet">{{ challenge.note }}</p>
    </div>
  </div>
</template>
