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
    body: "A result counts only when the challenge's own checker accepts it: Lean, or Qubitlane's check.",
    cta: { label: "See the challenges", to: "/challenges" },
  },
];
</script>

<template>
  <section id="how" class="pp-page pp-sec pp-how">
    <div class="pp-sec__head">
      <div class="pp-stack pp-stack--tight pp-how__intro">
        <h2 class="pp-h2">How it works</h2>
        <p class="pp-body">
          From a token to a result a machine has checked, in four steps, all in public.
        </p>
      </div>
      <span class="pp-how__art" aria-hidden="true">
        <CardArt name="figure" />
      </span>
    </div>

    <ol class="pp-how__steps">
      <li v-for="step in STEPS" :key="step.n" class="pp-how__step">
        <span class="pp-how__n pp-num">{{ step.n }}</span>
        <h3 class="pp-how__title">{{ step.title }}</h3>
        <p class="pp-how__body">{{ step.body }}</p>
        <RouterLink v-if="step.cta" :to="step.cta.to" class="pp-how__cta">
          {{ step.cta.label }}
          <Icon name="arrow-right" :size="13" />
        </RouterLink>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.pp-how__intro {
  max-width: 56ch;
}

.pp-sec__head {
  position: relative;
}

.pp-how__art {
  position: absolute;
  top: 6px;
  right: 0;
  display: block;
  width: 180px;
  height: 84px;
  overflow: hidden;
  color: var(--pp-accent);
  opacity: 0.4;
}

.pp-how__art svg {
  height: 100%;
  width: auto;
}

.pp-how__steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  border-top: 1px solid var(--pp-line);
}

.pp-how__step {
  display: grid;
  align-content: start;
  gap: 8px;
  padding: 20px 22px 22px 0;
  border-right: 1px solid var(--pp-line);
}

.pp-how__step:last-child {
  border-right: 0;
}

.pp-how__n {
  font-size: 0.72rem;
  color: var(--pp-accent-text);
  letter-spacing: 0.12em;
}

.pp-how__title {
  font-family: var(--pp-display);
  font-size: 1rem;
  font-weight: 620;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--pp-ink);
}

.pp-how__body {
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--pp-muted);
}

.pp-how__cta {
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--pp-mono);
  font-size: 0.64rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--pp-accent-text);
}

@media (max-width: 1100px) {
  .pp-how__art {
    display: none;
  }

  .pp-how__steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pp-how__step:nth-child(2) {
    border-right: 0;
  }

  .pp-how__step:nth-child(-n + 2) {
    border-bottom: 1px solid var(--pp-line);
  }
}

@media (max-width: 620px) {
  .pp-how__steps {
    grid-template-columns: minmax(0, 1fr);
  }

  .pp-how__step {
    border-right: 0;
    border-bottom: 1px solid var(--pp-line);
    padding-right: 0;
  }

  .pp-how__step:last-child {
    border-bottom: 0;
  }
}
</style>
