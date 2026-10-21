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
  props.iconClass?.includes("brand") ? "pp-tone-accent" : "pp-tone-ink",
);
</script>

<template>
  <span class="pp-tag pp-tag--accent pp-verb">
    <ChallengeIcon :name="icon" class="pp-verb__icon" :class="tint" />{{ verb }}
  </span>
</template>

<style scoped>
.pp-verb {
  gap: 7px;
}

.pp-verb__icon {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}
</style>
