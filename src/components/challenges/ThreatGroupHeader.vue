<script setup>
/** The dark ruled band that fronts each threat group's ledger. */
import CardArt from "@/components/art/CardArt.vue";
import ChallengeIcon from "@/components/challenges/ChallengeIcon.vue";

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  icon: { type: String, required: true },
  /** Line art shown faintly on the right. */
  art: { type: String, required: true },
});
</script>

<template>
  <header class="cq-tgh cq-band">
    <span class="cq-tgh__art" aria-hidden="true">
      <span v-if="art === 'figure'" class="cq-tgh__figure">
        <CardArt :name="art" class="cq-tgh__artsvg" />
      </span>
      <CardArt v-else :name="art" class="cq-tgh__artsvg" />
    </span>

    <div class="cq-tgh__main">
      <span class="cq-tgh__num" aria-hidden="true" />
      <h2 class="cq-h2 cq-tgh__title">
        <ChallengeIcon :name="icon" class="cq-tgh__icon" />{{ title }}
      </h2>
      <p class="cq-lede cq-tgh__sub">{{ subtitle }}</p>
    </div>
  </header>
</template>

<style scoped>
.cq-tgh {
  --cq-ink: #f1f5fc;
  --cq-ink-soft: #d3dcea;
  --cq-muted: #a5b2c5;
  --cq-muted-ground: #b8c4d6;
  --cq-line: #2c3647;
  --cq-line-soft: #232c3a;
  --cq-line-strong: #46536a;
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: stretch;
  overflow: clip;
  margin: 0;
  padding: clamp(24px, 3.2vw, 40px) clamp(22px, 3vw, 38px);
  border-radius: 0;
}

.cq-tgh__main {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 10px;
  max-width: 66ch;
}

.cq-tgh__num {
  font-family: var(--cq-mono);
  font-size: 0.68rem;
  line-height: 1;
  letter-spacing: 0.18em;
  color: #8798b0;
}

.cq-tgh__num::before {
  counter-increment: cqgroup;
  content: counter(cqgroup, decimal-leading-zero);
}

.cq-tgh__title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: clamp(1.65rem, 3vw, 2.5rem);
  line-height: 1;
  letter-spacing: -0.04em;
  overflow-wrap: anywhere;
}

.cq-tgh__icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: #aab6ff;
}

.cq-tgh__sub {
  max-width: 54ch;
  font-size: clamp(0.92rem, 1.1vw, 1.02rem);
  line-height: 1.5;
}

.cq-tgh__art {
  position: absolute;
  top: -18%;
  right: clamp(-24px, -1vw, 0px);
  height: 136%;
  color: #6f86ff;
  opacity: 0.34;
  pointer-events: none;
}

.cq-tgh__artsvg {
  height: 100%;
  width: auto;
}

.cq-tgh__figure {
  display: block;
  height: 76%;
  transform: translateY(12%) rotate(-8deg);
}

@media (max-width: 720px) {
  .cq-tgh__art {
    display: none;
  }
}
</style>
