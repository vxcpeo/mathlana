<script setup>
/** A "not open yet" challenge: a numbered ledger row with its status pill. */
import ChallengeIcon from "@/components/challenges/ChallengeIcon.vue";

defineProps({
  challenge: { type: Object, required: true },
  copy: { type: Object, required: true },
});
</script>

<template>
  <div class="cq-urow">
    <ChallengeIcon :name="copy.icon" class="cq-urow__icon" />
    <div class="cq-urow__body">
      <p class="cq-inline cq-urow__titleline">
        <span class="cq-h3 cq-urow__name">{{ challenge.name }}</span>
        <span
          class="cq-tag cq-tag--sm"
          :class="copy.statusTone === 'brand' ? 'cq-tag--accent' : ''"
          >{{ challenge.status }}</span
        >
      </p>
      <p class="cq-small cq-urow__description">{{ challenge.description }}</p>
      <p class="cq-tiny cq-urow__note">{{ challenge.note }}</p>
    </div>
  </div>
</template>

<style scoped>
.cq-urow {
  counter-increment: cqledger;
  display: grid;
  grid-template-columns: 42px 24px minmax(0, 1fr);
  align-items: start;
  gap: 12px clamp(12px, 1.6vw, 20px);
  padding: clamp(18px, 2.2vw, 26px) clamp(18px, 2.6vw, 32px);
  min-width: 0;
}

.cq-urow::before {
  content: counter(cqledger, decimal-leading-zero);
  padding-top: 4px;
  font-family: var(--cq-mono);
  font-size: 0.68rem;
  line-height: 1.3;
  letter-spacing: 0.1em;
  color: var(--cq-muted);
}

.cq-urow__icon {
  width: 17px;
  height: 17px;
  margin-top: 4px;
  color: var(--cq-muted);
}

.cq-urow__body {
  display: grid;
  gap: 5px;
  min-width: 0;
}

.cq-urow__titleline {
  align-items: center;
  gap: 8px 10px;
}

.cq-urow__name {
  color: var(--cq-ink-soft);
  overflow-wrap: anywhere;
}

.cq-urow__description {
  max-width: 66ch;
}

.cq-urow__note {
  max-width: 72ch;
}

@media (max-width: 560px) {
  .cq-urow {
    grid-template-columns: 28px 20px minmax(0, 1fr);
    gap: 10px;
    padding: 18px 16px;
  }
}
</style>
