<script setup>
/** "Is your money behind a public key?" — a bordered exposure callout. */
import Icon from "@/components/ui/Icon.vue";

const CARDS = [
  {
    icon: "eye",
    title: "Money at risk",
    body: "How much sits behind a public key, and how much behind a hash.",
  },
  {
    icon: "compass",
    title: "One calm step",
    body: "The move that fits your wallet, never a hurried one.",
  },
  {
    icon: "key-round",
    title: "How close it is",
    body: "The Q-Day clock and the smallest known circuit, live.",
  },
];
</script>

<template>
  <section class="pp-page pp-sec">
    <div class="pp-exposure">
      <div class="pp-exposure__head">
        <p class="pp-kicker">
          <Icon name="scan-line" :size="15" />
          Exposure check
        </p>
        <h2 class="pp-runhead pp-runhead--tight">Is your money behind a public key?</h2>
        <p class="pp-lede">
          Paste your addresses or a Bitcoin xpub. Nothing is stored, and no wallet connects.
        </p>
      </div>

      <ul class="pp-exposure__facts">
        <li v-for="card in CARDS" :key="card.title" class="pp-exposure__fact">
          <Icon :name="card.icon" :size="16" class="pp-tone-accent" />
          <span class="pp-exposure__fact-text">
            <span class="pp-exposure__fact-title">{{ card.title }}</span>
            <span class="pp-exposure__fact-body">{{ card.body }}</span>
          </span>
        </li>
      </ul>

      <div class="pp-exposure__foot">
        <RouterLink to="/exposure" class="pp-btn pp-btn--line">
          Check a wallet
          <Icon name="arrow-right" :size="14" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pp-exposure {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 64px);
  padding: clamp(26px, 3vw, 44px);
  background: var(--pp-sheet);
  border: 1px solid var(--pp-line);
  border-left: 3px solid var(--pp-accent);
  border-radius: var(--pp-radius);
}

.pp-exposure__head {
  display: grid;
  gap: 12px;
  align-content: start;
}

.pp-exposure__facts {
  display: grid;
  gap: 0;
  align-content: start;
  border-top: 1px solid var(--pp-line);
}

.pp-exposure__fact {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  padding: 14px 0;
  border-bottom: 1px solid var(--pp-line-soft);
}

.pp-exposure__fact-text {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.pp-exposure__fact-title {
  font-family: var(--pp-display);
  font-size: 0.94rem;
  font-weight: 620;
  letter-spacing: -0.01em;
  color: var(--pp-ink);
}

.pp-exposure__fact-body {
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--pp-muted);
}

.pp-exposure__foot {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
}

@media (max-width: 860px) {
  .pp-exposure {
    grid-template-columns: minmax(0, 1fr);
  }

  .pp-exposure__foot {
    justify-content: flex-start;
  }
}
</style>
