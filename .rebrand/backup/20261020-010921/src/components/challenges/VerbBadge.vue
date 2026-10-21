<script setup>
/** The pill that carries what a challenge asks of you ("Defend", "Stress test"). */
import ChallengeIcon from "@/components/challenges/ChallengeIcon.vue";

defineProps({
  verb: { type: String, required: true },
  icon: { type: String, default: "shield" },
  iconClass: { type: String, default: "text-brand" },
});
</script>

<template>
  <span
    class="inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border px-2 text-xs font-medium whitespace-nowrap text-foreground"
  >
    <ChallengeIcon :name="icon" class="shrink-0 size-3.5" :class="iconClass" />{{ verb }}
  </span>
</template>
