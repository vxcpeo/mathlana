<script setup>
/**
 * `/about` — an editorial reading plate for the project.
 *
 * Section order is unchanged from the reference: hero → "Two threats, one
 * target: your keys" (quantum + AI-accelerated math, with the live machine
 * roster) → "How Qubitess works on them" → "The calm response" / "What it does
 * not promise".
 *
 * The acknowledgements and the standing disclaimers live in the site footer
 * (`AppFooter.vue`), exactly as on the reference.
 */
import { computed } from "vue";
import { RouterLink } from "vue-router";
import AppBadge from "@/components/ui/AppBadge.vue";
import CardArt from "@/components/art/CardArt.vue";
import Icon from "@/components/ui/Icon.vue";
import MachineChips from "@/components/about/MachineChips.vue";
import { useQuantumStatus } from "@/composables/useQuantumStatus";

const { state } = useQuantumStatus();

/** Only machines that are up: the reference hides the offline one entirely. */
const machines = computed(() => state.value.machines.filter((m) => m.online !== false));

const STEPS = [
  {
    n: "01",
    title: "Tokens fund the work",
    body: "Each token has an AI/Quantum pool, filled by its fees. The pool pays for everything the token runs: its AI agent, its runs on real quantum computers and its computer time.",
  },
  {
    n: "02",
    title: "Everything is live",
    body: "Every thought, search, proof edit and quantum run streams in public, and replays.",
  },
  {
    n: "03",
    title: "Only checked results count",
    body: "A result shows as checked by Qubitess within minutes, and as officially verified once the challenge's own checker passes it.",
  },
];

const NOT_PROMISED = [
  "Research may find nothing: records move in small steps, against strong solvers.",
  "A token promises no return. Its fees pay for research, not for its holders.",
  "Qubitess is not affiliated with the Ethereum Foundation, Yukon or any challenge's organizers. Their checkers and leaderboards are the authority.",
];
</script>

<template>
  <div class="cq-page cq-about">
    <header class="cq-pagehead cq-about__head">
      <div class="cq-pagehead__head">
        <p class="cq-kicker">About</p>
        <h1 class="cq-runhead cq-about__title">About Qubitess</h1>
      </div>

      <div class="cq-pagehead__edge cq-about__headedge">
        <p class="cq-lede cq-about__lede">
          Quantum computers and AI-accelerated math are closing in on the math that guards
          crypto wallets. Qubitess measures how close, in public, and funds the work on the
          way out.
        </p>
        <span class="cq-about__rule" aria-hidden="true" />
      </div>
    </header>

    <div class="cq-stage cq-about__stage">
      <div class="cq-stage__main cq-about__main">
        <section class="cq-about__intro">
          <h2 class="cq-h2">Two threats, one target: your keys</h2>
          <p class="cq-body">
            Bitcoin, Ethereum and Solana sign with elliptic curves. Two forces could break
            them, and Qubitess works on both.
          </p>
        </section>

        <!-- Quantum computers -->
        <article class="cq-about__threat">
          <header class="cq-about__threathead">
            <span class="cq-about__kind" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                width="18"
                height="18"
              >
                <circle cx="12" cy="12" r="9" />
                <ellipse cx="12" cy="12" rx="9" ry="3.2" stroke-dasharray="2 2.4" />
                <path d="M12 3v18" stroke-opacity="0.45" />
                <path d="M12 12l4.6-5.4" />
                <circle cx="16.6" cy="6.6" r="1.6" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <div class="cq-about__threattitle">
              <h3 class="cq-h2 cq-about__threatname">Quantum computers</h3>
              <p class="cq-small">Shor's algorithm against crypto wallet keys</p>
            </div>
            <span class="cq-about__threatart" aria-hidden="true">
              <CardArt name="orbit" />
            </span>
          </header>

          <p class="cq-body cq-about__preamble">
            A large enough quantum computer runs Shor's algorithm and reads a private key
            from its public key. Qubitess runs that attack on real quantum computers today,
            and measures how small the machine that breaks a real key could be.
          </p>

          <ul class="cq-about__rows">
            <li>
              <RouterLink to="/q-day" aria-label="Q-Day. Open" class="cq-about__row">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  aria-hidden="true"
                  class="cq-about__row-icon"
                >
                  <circle cx="12" cy="12" r="9" />
                  <ellipse cx="12" cy="12" rx="9" ry="3.2" stroke-dasharray="2 2.4" />
                  <path d="M12 3v18" stroke-opacity="0.45" />
                  <path d="M12 12l4.6-5.4" />
                  <circle cx="16.6" cy="6.6" r="1.6" fill="currentColor" stroke="none" />
                </svg>
                <span class="cq-about__row-copy">
                  <span class="cq-about__row-title">Q-Day</span>
                  <span class="cq-about__row-sub"
                    >Shor's attack on practice keys, run on real quantum computers under a
                    strict check.</span
                  >
                </span>
                <Icon name="arrow-up-right" :size="14" class="cq-about__row-arrow" />
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/challenges/ecdsa-fail"
                aria-label="ECDSA.fail. Open"
                class="cq-about__row"
              >
                <Icon name="cpu" :size="16" class="cq-about__row-icon" />
                <span class="cq-about__row-copy">
                  <span class="cq-about__row-title">ECDSA.fail</span>
                  <span class="cq-about__row-sub"
                    >The smallest known circuit that breaks a Bitcoin key, and how fast it
                    shrinks.</span
                  >
                </span>
                <Icon name="arrow-up-right" :size="14" class="cq-about__row-arrow" />
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/tokens" aria-label="Live quantum tasks. Open" class="cq-about__row">
                <Icon name="atom" :size="16" class="cq-about__row-icon" />
                <span class="cq-about__row-copy">
                  <span class="cq-about__row-title">Live quantum tasks</span>
                  <span class="cq-about__row-sub"
                    >A token's chat pushes any task to IBM, IQM or IonQ, and shows the
                    machine's answer.</span
                  >
                </span>
                <Icon name="arrow-up-right" :size="14" class="cq-about__row-arrow" />
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/launch" aria-label="Quantum-drawn picture. Open" class="cq-about__row">
                <Icon name="image" :size="16" class="cq-about__row-icon" />
                <span class="cq-about__row-copy">
                  <span class="cq-about__row-title">Quantum-drawn picture</span>
                  <span class="cq-about__row-sub"
                    >A token's image, redrawn 1:1 by a real quantum computer.</span
                  >
                </span>
                <Icon name="arrow-up-right" :size="14" class="cq-about__row-arrow" />
              </RouterLink>
            </li>
          </ul>
        </article>

        <!-- AI-accelerated math -->
        <article class="cq-about__threat">
          <header class="cq-about__threathead">
            <span class="cq-about__kind" aria-hidden="true">
              <Icon name="sigma" :size="18" />
            </span>
            <div class="cq-about__threattitle">
              <h3 class="cq-h2 cq-about__threatname">AI-accelerated math</h3>
              <p class="cq-small">Years of math in months: the risks and the way out</p>
            </div>
            <span class="cq-about__threatart" aria-hidden="true">
              <CardArt name="figure" />
            </span>
          </header>

          <p class="cq-body cq-about__preamble">
            AI is starting to find new math fast. Elliptic curves and lattices have
            structure that new math can exploit, so they may fall sooner than planned,
            possibly before quantum computers. Hashes have no such structure: hash-based
            cryptography with machine-checked proofs is the way out.
          </p>

          <p class="cq-h4 cq-about__group">Hash-based: the way out</p>
          <ul class="cq-about__rows">
            <li>
              <RouterLink
                to="/challenges/sig-golf"
                aria-label="sig.golf. Open"
                class="cq-about__row"
              >
                <Icon name="signature" :size="16" class="cq-about__row-icon" />
                <span class="cq-about__row-copy">
                  <span class="cq-about__row-title">sig.golf</span>
                  <span class="cq-about__row-sub">Hash-based signatures, made smaller.</span>
                </span>
                <Icon name="arrow-up-right" :size="14" class="cq-about__row-arrow" />
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/challenges/proximity"
                aria-label="The Proximity Prize. Open"
                class="cq-about__row"
              >
                <Icon name="sigma" :size="16" class="cq-about__row-icon" />
                <span class="cq-about__row-copy">
                  <span class="cq-about__row-title">The Proximity Prize</span>
                  <span class="cq-about__row-sub"
                    >How sound hash-based proof systems are, proven.</span
                  >
                </span>
                <Icon name="arrow-up-right" :size="14" class="cq-about__row-arrow" />
              </RouterLink>
            </li>
            <li>
              <div class="cq-about__row cq-about__row--static">
                <Icon name="shield" :size="16" class="cq-about__row-icon cq-about__row-icon--quiet" />
                <span class="cq-about__row-copy">
                  <span class="cq-about__row-title">precompile.fast</span>
                  <span class="cq-about__row-sub">The EVM's cryptography, proven correct.</span>
                </span>
                <AppBadge tone="brand" size="sm">Next</AppBadge>
              </div>
            </li>
          </ul>

          <p class="cq-h4 cq-about__group">Lattices (ML-DSA, FHE): the new risk</p>
          <ul class="cq-about__rows">
            <li>
              <div class="cq-about__row cq-about__row--static">
                <Icon name="crosshair" :size="16" class="cq-about__row-icon cq-about__row-icon--quiet" />
                <span class="cq-about__row-copy">
                  <span class="cq-about__row-title">Lattice records</span>
                  <span class="cq-about__row-sub">Once a public venue checks them by machine.</span>
                </span>
                <AppBadge tone="quiet" size="sm">Later</AppBadge>
              </div>
            </li>
          </ul>
        </article>
      </div>

      <aside class="cq-stage__edge cq-about__edge">
        <div class="cq-about__machines">
          <MachineChips :machines="machines" />
        </div>

        <section class="cq-about__close-block">
          <h2 class="cq-h3">The calm response</h2>
          <p class="cq-body">
            Keep savings at fresh addresses, whose keys stay hidden until they sign. Never
            rush a migration: hurried moves are where funds are most often lost.
          </p>
          <RouterLink to="/exposure" class="cq-about__cta">
            Check a wallet
            <Icon name="arrow-right" :stroke-width="1.75" :size="15" />
          </RouterLink>
        </section>

        <section class="cq-about__close-block cq-about__close-block--quiet">
          <h2 class="cq-h3">What it does not promise</h2>
          <ul class="cq-about__promises">
            <li v-for="line in NOT_PROMISED" :key="line" class="cq-about__promise">
              <span aria-hidden="true" class="cq-about__promise-mark" />
              {{ line }}
            </li>
          </ul>
        </section>
      </aside>
    </div>

    <section class="cq-about__works">
      <div class="cq-about__workshead">
        <h2 class="cq-h2">How Qubitess works on them</h2>
      </div>

      <ol class="cq-about__steps">
        <li v-for="step in STEPS" :key="step.n" class="cq-about__step">
          <span class="cq-about__step-n cq-num">{{ step.n }}</span>
          <h3 class="cq-about__step-title">{{ step.title }}</h3>
          <p class="cq-about__step-body">{{ step.body }}</p>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.cq-about {
  padding-bottom: clamp(28px, 4vw, 56px);
}

/* running head -------------------------------------------------------- */
.cq-about__title {
  max-width: 11ch;
  margin-top: 12px;
  font-size: clamp(44px, 7vw, 92px);
  letter-spacing: -0.05em;
}

.cq-about__headedge {
  justify-content: flex-end;
  padding-bottom: 10px;
}

.cq-about__lede {
  max-width: 44ch;
  font-size: clamp(16px, 1.25vw, 19px);
  line-height: 1.55;
}

.cq-about__rule {
  display: block;
  width: 100%;
  height: 1px;
  margin-top: 16px;
  background: var(--cq-line);
}

/* stage --------------------------------------------------------------- */
.cq-about__stage {
  margin-top: clamp(4px, 1vw, 12px);
}

.cq-about__main {
  gap: clamp(30px, 4vw, 52px);
}

/* intro --------------------------------------------------------------- */
.cq-about__intro {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  align-items: start;
  gap: clamp(16px, 3vw, 44px);
  padding-top: clamp(18px, 2vw, 26px);
  border-top: 1px solid var(--cq-line);
}

.cq-about__intro .cq-h2 {
  max-width: 18ch;
}

.cq-about__intro .cq-body {
  max-width: 56ch;
  padding-top: 4px;
}

/* threat articles ----------------------------------------------------- */
.cq-about__threat {
  display: grid;
  gap: clamp(16px, 2vw, 22px);
  padding-top: clamp(18px, 2vw, 26px);
  border-top: 1px solid var(--cq-line-strong);
}

.cq-about__threathead {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 96px;
  align-items: start;
  gap: 14px;
  min-height: 76px;
}

.cq-about__kind {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--cq-line);
  border-radius: var(--cq-radius-sm);
  background: var(--cq-sheet);
  color: var(--cq-accent-text);
}

.cq-about__threattitle {
  display: grid;
  gap: 5px;
  min-width: 0;
}

.cq-about__threatname {
  font-family: var(--cq-display);
  font-size: clamp(1.5rem, 2.6vw, 2.2rem);
  font-weight: var(--cq-display-weight);
  letter-spacing: var(--cq-display-tracking);
  line-height: 1;
}

.cq-about__threatart {
  display: block;
  height: 74px;
  overflow: hidden;
  color: var(--cq-accent);
  opacity: 0.5;
}

.cq-about__threatart :deep(svg) {
  width: 100%;
  height: 100%;
}

.cq-about__preamble {
  max-width: 68ch;
  font-size: 0.98rem;
}

/* rows ---------------------------------------------------------------- */
.cq-about__rows {
  display: grid;
  border-top: 1px solid var(--cq-line);
}

.cq-about__row {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
  min-width: 0;
  padding: 13px 2px;
  border-bottom: 1px solid var(--cq-line-soft);
  color: var(--cq-ink);
  transition: background-color var(--cq-fast) var(--cq-ease), padding-left var(--cq-fast) var(--cq-ease);
}

a.cq-about__row:hover {
  padding-left: 8px;
  background: var(--cq-sheet-soft);
}

.cq-about__row--static {
  cursor: default;
}

.cq-about__row-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--cq-accent-text);
}

.cq-about__row-icon--quiet {
  color: var(--cq-muted);
}

.cq-about__row-copy {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.cq-about__row-title {
  font-family: var(--cq-display);
  font-size: 0.98rem;
  font-weight: 620;
  line-height: 1.2;
  letter-spacing: -0.015em;
  color: var(--cq-ink);
}

.cq-about__row-sub {
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--cq-muted);
  text-wrap: pretty;
}

.cq-about__row-arrow {
  margin-top: 3px;
  color: var(--cq-muted);
  transition: color var(--cq-fast) var(--cq-ease), transform var(--cq-fast) var(--cq-ease);
}

a.cq-about__row:hover .cq-about__row-arrow {
  color: var(--cq-accent-text);
  transform: translate(1px, -1px);
}

.cq-about__row :deep(.cq-tag) {
  margin-top: 1px;
}

.cq-about__group {
  margin-top: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--cq-line);
  color: var(--cq-accent-text);
}

/* marginal column ----------------------------------------------------- */
.cq-about__edge {
  gap: clamp(22px, 2.6vw, 34px);
}

.cq-about__machines {
  padding-bottom: 20px;
  border-bottom: 1px solid var(--cq-line);
}

.cq-about__close-block {
  display: grid;
  align-content: start;
  gap: 10px;
  min-width: 0;
  padding-top: 18px;
  border-top: 1px solid var(--cq-line-strong);
}

.cq-about__close-block--quiet {
  border-top-style: dashed;
}

.cq-about__cta {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--cq-accent-line);
  font-family: var(--cq-mono);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cq-accent-text);
  transition: border-color var(--cq-fast) var(--cq-ease), gap var(--cq-fast) var(--cq-ease);
}

.cq-about__cta:hover {
  gap: 11px;
  border-bottom-color: currentColor;
}

.cq-about__promises {
  display: grid;
  gap: 10px;
}

.cq-about__promise {
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr);
  gap: 8px;
  align-items: start;
  font-size: 0.84rem;
  line-height: 1.6;
  color: var(--cq-ink-soft);
}

.cq-about__promise-mark {
  width: 5px;
  height: 5px;
  margin-top: 0.65em;
  background: var(--cq-muted);
  rotate: 45deg;
}

/* works --------------------------------------------------------------- */
.cq-about__works {
  margin-top: clamp(36px, 5vw, 64px);
  padding-top: clamp(18px, 2vw, 26px);
  border-top: 1px solid var(--cq-line-strong);
}

.cq-about__workshead {
  margin-bottom: clamp(16px, 2vw, 24px);
}

.cq-about__steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--cq-line);
}

.cq-about__step {
  display: grid;
  align-content: start;
  gap: 10px;
  min-width: 0;
  padding: 20px clamp(14px, 2vw, 26px) 0;
  border-left: 1px solid var(--cq-line);
}

.cq-about__step:first-child {
  padding-left: 0;
  border-left: 0;
}

.cq-about__step-n {
  font-size: clamp(1.5rem, 2.2vw, 2rem);
  line-height: 1;
  letter-spacing: 0.02em;
  color: var(--cq-accent-text);
}

.cq-about__step-title {
  font-family: var(--cq-display);
  font-size: 1.02rem;
  font-weight: 620;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--cq-ink);
}

.cq-about__step-body {
  max-width: 40ch;
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--cq-ink-soft);
}

@media (max-width: 1180px) {
  .cq-about__intro {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
}

@media (max-width: 960px) {
  .cq-about__headedge {
    justify-content: flex-start;
  }

  .cq-about__lede {
    max-width: 56ch;
  }

  .cq-about__edge {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  .cq-about__machines {
    grid-column: 1 / -1;
  }

  .cq-about__steps {
    grid-template-columns: minmax(0, 1fr);
    border-top: 0;
  }

  .cq-about__step {
    padding: 18px 0;
    border-left: 0;
    border-top: 1px solid var(--cq-line);
  }

  .cq-about__step:first-child {
    border-top: 0;
  }
}

@media (max-width: 640px) {
  .cq-about__edge {
    grid-template-columns: minmax(0, 1fr);
  }

  .cq-about__threathead {
    grid-template-columns: 30px minmax(0, 1fr);
    min-height: 0;
  }

  .cq-about__threatart {
    display: none;
  }

  .cq-about__title {
    font-size: clamp(38px, 13vw, 56px);
  }
}
</style>
