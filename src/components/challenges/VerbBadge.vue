<script setup>
/** The pill that carries what a challenge asks of you ("Defend", "Stress test"). */
import { computed } from "vue";
import ChallengeIcon from "@/components/challenges/ChallengeIcon.vue";

const props = defineProps({
  verb: { type: String, required: true },
  icon: { type: String, default: "shield" },
  iconClass: { type: String, default: "text-brand" },
});

/** The registry still hands over the old Tailwind colour hints; map them. */
const tint = computed(() =>
  props.iconClass?.includes("brand") ? "cq-tone-accent" : "cq-tone-ink",
);
</script>

<template>
  <span class="cq-tag cq-tag--accent cq-verb">
    <ChallengeIcon :name="icon" class="cq-verb__icon" :class="tint" />{{ verb }}
  </span>
</template>

<style scoped>
.cq-verb {
  gap: 7px;
}

.cq-verb__icon {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}
</style>
