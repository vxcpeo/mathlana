<script setup>
/** "How it works" — four numbered steps on a blueprint rule. */
import Icon from "@/components/ui/Icon.vue";
import CardArt from "@/components/art/CardArt.vue";

const STEPS = [
  {
    n: "01",
    title: "Launch a token",
    body: "Pick a challenge, name your token and sign once with your wallet.",
    cta: { label: "Launch a token", to: "/launch" },
  },
  {
    n: "02",
    title: "Fees fill the AI/Quantum pool",
    body: "60% of your token's fees go to its AI/Quantum pool. The pool pays for everything the token runs: its AI agent, its quantum computer runs and its computer time.",
    cta: null,
  },
  {
    n: "03",
    title: "The agent works live",
    body: "Every thought, search and proof edit streams in public, and replays.",
    cta: null,
  },
  {
    n: "04",
    title: "A machine checks it",
    body: "A result counts only when the challenge's own checker accepts it: Lean, or Qubitess's check.",
    cta: { label: "See the challenges", to: "/challenges" },
  },
];
</script>

<template>
  <section id="how" class="cq-page cq-sec cq-how">
    <div class="cq-sec__head">
      <div class="cq-stack cq-stack--tight cq-how__intro">
        <h2 class="cq-h2">How it works</h2>
        <p class="cq-body">
          From a token to a result a machine has checked, in four steps, all in public.
        </p>
      </div>
      <span class="cq-how__art" aria-hidden="true">
        <CardArt name="figure" />
      </span>
    </div>

    <ol class="cq-how__steps">
      <li v-for="step in STEPS" :key="step.n" class="cq-how__step">
        <span class="cq-how__n cq-num">{{ step.n }}</span>
        <h3 class="cq-how__title">{{ step.title }}</h3>
        <p class="cq-how__body">{{ step.body }}</p>
        <RouterLink v-if="step.cta" :to="step.cta.to" class="cq-how__cta">
          {{ step.cta.label }}
          <Icon name="arrow-right" :size="13" />
        </RouterLink>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.cq-how__intro {
  max-width: 56ch;
}

.cq-sec__head {
  position: relative;
}

.cq-how__art {
  position: absolute;
  top: 6px;
  right: 0;
  display: block;
  width: 180px;
  height: 84px;
  overflow: hidden;
  color: var(--cq-accent);
  opacity: 0.4;
}

.cq-how__art svg {
  height: 100%;
  width: auto;
}

.cq-how__steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  border-top: 1px solid var(--cq-line);
}

.cq-how__step {
  display: grid;
  align-content: start;
  gap: 8px;
  padding: 20px 22px 22px 0;
  border-right: 1px solid var(--cq-line);
}

.cq-how__step:last-child {
  border-right: 0;
}

.cq-how__n {
  font-size: 0.72rem;
  color: var(--cq-accent-text);
  letter-spacing: 0.12em;
}

.cq-how__title {
  font-family: var(--cq-display);
  font-size: 1rem;
  font-weight: 620;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--cq-ink);
}

.cq-how__body {
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--cq-muted);
}

.cq-how__cta {
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--cq-mono);
  font-size: 0.64rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cq-accent-text);
}

@media (max-width: 1100px) {
  .cq-how__art {
    display: none;
  }

  .cq-how__steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cq-how__step:nth-child(2) {
    border-right: 0;
  }

  .cq-how__step:nth-child(-n + 2) {
    border-bottom: 1px solid var(--cq-line);
  }
}

@media (max-width: 620px) {
  .cq-how__steps {
    grid-template-columns: minmax(0, 1fr);
  }

  .cq-how__step {
    border-right: 0;
    border-bottom: 1px solid var(--cq-line);
    padding-right: 0;
  }

  .cq-how__step:last-child {
    border-bottom: 0;
  }
}
</style>
