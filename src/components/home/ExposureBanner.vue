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
  <section class="cq-page cq-sec">
    <div class="cq-exposure">
      <div class="cq-exposure__head">
        <p class="cq-kicker">
          <Icon name="scan-line" :size="15" />
          Exposure check
        </p>
        <h2 class="cq-runhead cq-runhead--tight">Is your money behind a public key?</h2>
        <p class="cq-lede">
          Paste your addresses or a Bitcoin xpub. Nothing is stored, and no wallet connects.
        </p>
      </div>

      <ul class="cq-exposure__facts">
        <li v-for="card in CARDS" :key="card.title" class="cq-exposure__fact">
          <Icon :name="card.icon" :size="16" class="cq-tone-accent" />
          <span class="cq-exposure__fact-text">
            <span class="cq-exposure__fact-title">{{ card.title }}</span>
            <span class="cq-exposure__fact-body">{{ card.body }}</span>
          </span>
        </li>
      </ul>

      <div class="cq-exposure__foot">
        <RouterLink to="/exposure" class="cq-btn cq-btn--line">
          Check a wallet
          <Icon name="arrow-right" :size="14" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cq-exposure {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 64px);
  padding: clamp(26px, 3vw, 44px);
  background: var(--cq-sheet);
  border: 1px solid var(--cq-line);
  border-left: 3px solid var(--cq-accent);
  border-radius: var(--cq-radius);
}

.cq-exposure__head {
  display: grid;
  gap: 12px;
  align-content: start;
}

.cq-exposure__facts {
  display: grid;
  gap: 0;
  align-content: start;
  border-top: 1px solid var(--cq-line);
}

.cq-exposure__fact {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  padding: 14px 0;
  border-bottom: 1px solid var(--cq-line-soft);
}

.cq-exposure__fact-text {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.cq-exposure__fact-title {
  font-family: var(--cq-display);
  font-size: 0.94rem;
  font-weight: 620;
  letter-spacing: -0.01em;
  color: var(--cq-ink);
}

.cq-exposure__fact-body {
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--cq-muted);
}

.cq-exposure__foot {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
}

@media (max-width: 860px) {
  .cq-exposure {
    grid-template-columns: minmax(0, 1fr);
  }

  .cq-exposure__foot {
    justify-content: flex-start;
  }
}
</style>
