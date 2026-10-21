<script setup>
/** A "not open yet" challenge: a quiet ledger row with its status pill. */
import ChallengeIcon from "@/components/challenges/ChallengeIcon.vue";

defineProps({
  challenge: { type: Object, required: true },
  copy: { type: Object, required: true },
});
</script>

<template>
  <div class="pp-ledger__row pp-urow">
    <div class="pp-urow__id">
      <ChallengeIcon :name="copy.icon" class="pp-urow__icon" />
      <div class="pp-stack--tight pp-urow__body">
        <p class="pp-inline pp-urow__titleline">
          <span class="pp-h3 pp-urow__name">{{ challenge.name }}</span>
          <span
            class="pp-tag pp-tag--sm"
            :class="copy.statusTone === 'brand' ? 'pp-tag--accent' : ''"
            >{{ challenge.status }}</span
          >
        </p>
        <p class="pp-small">{{ challenge.description }}</p>
        <p class="pp-tiny pp-urow__note">{{ challenge.note }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pp-urow.pp-ledger__row {
  gap: 12px;
  padding: 18px 4px;
}

.pp-urow__id {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  align-items: start;
  gap: 12px;
}

.pp-urow__icon {
  width: 16px;
  height: 16px;
  margin-top: 4px;
  color: var(--pp-muted);
}

.pp-urow__titleline {
  align-items: center;
  gap: 8px 10px;
}

.pp-urow__body {
  min-width: 0;
}

.pp-urow__name {
  color: var(--pp-ink-soft);
}

.pp-urow__note {
  max-width: 72ch;
}
</style>
