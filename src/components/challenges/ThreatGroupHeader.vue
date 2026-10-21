<script setup>
/** The wide ruled band that fronts each threat group. */
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
  <div class="pp-tgh">
    <span class="pp-tgh__art" aria-hidden="true">
      <span v-if="art === 'figure'" class="pp-tgh__figure">
        <CardArt :name="art" class="pp-tgh__artsvg" />
      </span>
      <CardArt v-else :name="art" class="pp-tgh__artsvg" />
    </span>

    <div class="pp-tgh__main">
      <span class="pp-tgh__num" aria-hidden="true" />
      <h2 class="pp-h2 pp-tgh__title">
        <ChallengeIcon :name="icon" class="pp-tgh__icon" />{{ title }}
      </h2>
      <p class="pp-lede pp-tgh__sub">{{ subtitle }}</p>
    </div>
  </div>
</template>

<style scoped>
.pp-tgh {
  position: relative;
  display: grid;
  overflow: clip;
  padding: 20px 0 24px;
  border-top: 1px solid var(--pp-line);
  border-bottom: 1px solid var(--pp-line);
}

.pp-tgh__main {
  position: relative;
  display: grid;
  gap: 10px;
  max-width: 62ch;
}

.pp-tgh__num {
  font-family: var(--pp-mono);
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  color: var(--pp-muted);
}

.pp-tgh__num::before {
  counter-increment: ppgroup;
  content: counter(ppgroup, decimal-leading-zero);
}

.pp-tgh__title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pp-tgh__icon {
  width: 20px;
  height: 20px;
  color: var(--pp-accent-text);
}

.pp-tgh__sub {
  font-size: 0.95rem;
}

.pp-tgh__art {
  position: absolute;
  top: -12%;
  right: 0;
  height: 124%;
  color: var(--pp-accent);
  opacity: 0.42;
  pointer-events: none;
}

.pp-tgh__artsvg {
  height: 100%;
  width: auto;
}

.pp-tgh__figure {
  display: block;
  height: 76%;
  transform: translateY(12%) rotate(-8deg);
}

@media (max-width: 720px) {
  .pp-tgh__art {
    display: none;
  }
}
</style>
