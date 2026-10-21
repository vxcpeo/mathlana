<script setup>
/**
 * `/about` — an editorial reading plate for the project.
 *
 * Section order is unchanged from the reference: hero → "Two threats, one
 * target: your keys" (quantum + AI-accelerated math, with the live machine
 * roster) → "How Qubitlane works on them" → "The calm response" / "What it does
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
    body: "A result shows as checked by Qubitlane within minutes, and as officially verified once the challenge's own checker passes it.",
  },
];

const NOT_PROMISED = [
  "Research may find nothing: records move in small steps, against strong solvers.",
  "A token promises no return. Its fees pay for research, not for its holders.",
  "Qubitlane is not affiliated with the Ethereum Foundation, Yukon or any challenge's organizers. Their checkers and leaderboards are the authority.",
];
</script>

<template>
  <div class="pp-page pp-about">
    <div class="pp-head pp-about__head">
      <p class="pp-kicker">About</p>

      <div class="pp-about__head-grid">
        <h1 class="pp-runhead pp-about__title">About Qubitlane</h1>
        <p class="pp-lede pp-about__lede">
          Quantum computers and AI-accelerated math are closing in on the math that guards
          crypto wallets. Qubitlane measures how close, in public, and funds the work on the
          way out.
        </p>
      </div>
    </div>

    <section class="pp-sec pp-about__sec">
      <div class="pp-sec__head pp-about__sec-head">
        <div class="pp-about__sec-title">
          <h2 class="pp-h2">Two threats, one target: your keys</h2>
          <p class="pp-body">
            Bitcoin, Ethereum and Solana sign with elliptic curves. Two forces could break
            them, and Qubitlane works on both.
          </p>
        </div>
        <span class="pp-about__sec-mark" aria-hidden="true" />
      </div>

      <div class="pp-about__threats">
        <!-- Quantum computers -->
        <article class="pp-about__threat">
          <div class="pp-about__threat-head">
            <span class="pp-about__threat-kind" aria-hidden="true">
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
            <div class="pp-about__threat-title">
              <h3 class="pp-h2 pp-about__threat-name">Quantum computers</h3>
              <p class="pp-small">Shor's algorithm against crypto wallet keys</p>
            </div>
            <span class="pp-about__threat-art" aria-hidden="true">
              <CardArt name="orbit" />
            </span>
          </div>

          <p class="pp-body pp-about__preamble">
            A large enough quantum computer runs Shor's algorithm and reads a private key
            from its public key. Qubitlane runs that attack on real quantum computers today,
            and measures how small the machine that breaks a real key could be.
          </p>

          <ul class="pp-about__rows">
            <li>
              <RouterLink to="/q-day" aria-label="Q-Day. Open" class="pp-about__row">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  aria-hidden="true"
                  class="pp-about__row-icon"
                >
                  <circle cx="12" cy="12" r="9" />
                  <ellipse cx="12" cy="12" rx="9" ry="3.2" stroke-dasharray="2 2.4" />
                  <path d="M12 3v18" stroke-opacity="0.45" />
                  <path d="M12 12l4.6-5.4" />
                  <circle cx="16.6" cy="6.6" r="1.6" fill="currentColor" stroke="none" />
                </svg>
                <span class="pp-about__row-copy">
                  <span class="pp-about__row-title">Q-Day</span>
                  <span class="pp-about__row-sub"
                    >Shor's attack on practice keys, run on real quantum computers under a
                    strict check.</span
                  >
                </span>
                <Icon name="arrow-up-right" :size="14" class="pp-about__row-arrow" />
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/challenges/ecdsa-fail"
                aria-label="ECDSA.fail. Open"
                class="pp-about__row"
              >
                <Icon name="cpu" :size="16" class="pp-about__row-icon" />
                <span class="pp-about__row-copy">
                  <span class="pp-about__row-title">ECDSA.fail</span>
                  <span class="pp-about__row-sub"
                    >The smallest known circuit that breaks a Bitcoin key, and how fast it
                    shrinks.</span
                  >
                </span>
                <Icon name="arrow-up-right" :size="14" class="pp-about__row-arrow" />
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/tokens" aria-label="Live quantum tasks. Open" class="pp-about__row">
                <Icon name="atom" :size="16" class="pp-about__row-icon" />
                <span class="pp-about__row-copy">
                  <span class="pp-about__row-title">Live quantum tasks</span>
                  <span class="pp-about__row-sub"
                    >A token's chat pushes any task to IBM, IQM or IonQ, and shows the
                    machine's answer.</span
                  >
                </span>
                <Icon name="arrow-up-right" :size="14" class="pp-about__row-arrow" />
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/launch" aria-label="Quantum-drawn picture. Open" class="pp-about__row">
                <Icon name="image" :size="16" class="pp-about__row-icon" />
                <span class="pp-about__row-copy">
                  <span class="pp-about__row-title">Quantum-drawn picture</span>
                  <span class="pp-about__row-sub"
                    >A token's image, redrawn 1:1 by a real quantum computer.</span
                  >
                </span>
                <Icon name="arrow-up-right" :size="14" class="pp-about__row-arrow" />
              </RouterLink>
            </li>
          </ul>

          <div class="pp-about__machines">
            <MachineChips :machines="machines" />
          </div>
        </article>

        <!-- AI-accelerated math -->
        <article class="pp-about__threat">
          <div class="pp-about__threat-head">
            <span class="pp-about__threat-kind" aria-hidden="true">
              <Icon name="sigma" :size="18" />
            </span>
            <div class="pp-about__threat-title">
              <h3 class="pp-h2 pp-about__threat-name">AI-accelerated math</h3>
              <p class="pp-small">Years of math in months: the risks and the way out</p>
            </div>
            <span class="pp-about__threat-art" aria-hidden="true">
              <CardArt name="figure" />
            </span>
          </div>

          <p class="pp-body pp-about__preamble">
            AI is starting to find new math fast. Elliptic curves and lattices have
            structure that new math can exploit, so they may fall sooner than planned,
            possibly before quantum computers. Hashes have no such structure: hash-based
            cryptography with machine-checked proofs is the way out.
          </p>

          <p class="pp-h4 pp-about__group">Hash-based: the way out</p>
          <ul class="pp-about__rows">
            <li>
              <RouterLink
                to="/challenges/sig-golf"
                aria-label="sig.golf. Open"
                class="pp-about__row"
              >
                <Icon name="signature" :size="16" class="pp-about__row-icon" />
                <span class="pp-about__row-copy">
                  <span class="pp-about__row-title">sig.golf</span>
                  <span class="pp-about__row-sub">Hash-based signatures, made smaller.</span>
                </span>
                <Icon name="arrow-up-right" :size="14" class="pp-about__row-arrow" />
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/challenges/proximity"
                aria-label="The Proximity Prize. Open"
                class="pp-about__row"
              >
                <Icon name="sigma" :size="16" class="pp-about__row-icon" />
                <span class="pp-about__row-copy">
                  <span class="pp-about__row-title">The Proximity Prize</span>
                  <span class="pp-about__row-sub"
                    >How sound hash-based proof systems are, proven.</span
                  >
                </span>
                <Icon name="arrow-up-right" :size="14" class="pp-about__row-arrow" />
              </RouterLink>
            </li>
            <li>
              <div class="pp-about__row pp-about__row--static">
                <Icon name="shield" :size="16" class="pp-about__row-icon pp-about__row-icon--quiet" />
                <span class="pp-about__row-copy">
                  <span class="pp-about__row-title">precompile.fast</span>
                  <span class="pp-about__row-sub">The EVM's cryptography, proven correct.</span>
                </span>
                <AppBadge tone="brand" size="sm">Next</AppBadge>
              </div>
            </li>
          </ul>

          <p class="pp-h4 pp-about__group">Lattices (ML-DSA, FHE): the new risk</p>
          <ul class="pp-about__rows">
            <li>
              <div class="pp-about__row pp-about__row--static">
                <Icon name="crosshair" :size="16" class="pp-about__row-icon pp-about__row-icon--quiet" />
                <span class="pp-about__row-copy">
                  <span class="pp-about__row-title">Lattice records</span>
                  <span class="pp-about__row-sub">Once a public venue checks them by machine.</span>
                </span>
                <AppBadge tone="quiet" size="sm">Later</AppBadge>
              </div>
            </li>
          </ul>
        </article>
      </div>
    </section>

    <section class="pp-sec">
      <div class="pp-sec__head">
        <h2 class="pp-h2">How Qubitlane works on them</h2>
        <span class="pp-about__sec-mark" aria-hidden="true" />
      </div>

      <ol class="pp-about__steps">
        <li v-for="step in STEPS" :key="step.n" class="pp-about__step">
          <span class="pp-about__step-n">{{ step.n }}</span>
          <h3 class="pp-about__step-title">{{ step.title }}</h3>
          <p class="pp-about__step-body">{{ step.body }}</p>
        </li>
      </ol>
    </section>

    <div class="pp-about__close">
      <section class="pp-about__close-block">
        <h2 class="pp-h3">The calm response</h2>
        <p class="pp-body">
          Keep savings at fresh addresses, whose keys stay hidden until they sign. Never
          rush a migration: hurried moves are where funds are most often lost.
        </p>
        <RouterLink to="/exposure" class="pp-about__cta">
          Check a wallet
          <Icon name="arrow-right" :stroke-width="1.75" :size="15" />
        </RouterLink>
      </section>

      <section class="pp-about__close-block pp-about__close-block--quiet">
        <h2 class="pp-h3">What it does not promise</h2>
        <ul class="pp-about__promises">
          <li v-for="line in NOT_PROMISED" :key="line" class="pp-about__promise">
            <span aria-hidden="true" class="pp-about__promise-mark" />
            {{ line }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pp-about {
  padding-bottom: var(--pp-t6);
}

.pp-about__head {
  gap: var(--pp-t3);
  padding-top: var(--pp-t6);
  padding-bottom: var(--pp-t5);
}

.pp-about__head-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.55fr);
  align-items: end;
  gap: var(--pp-t4) var(--pp-t5);
}

.pp-about__title {
  max-width: 13ch;
  font-size: clamp(2.7rem, 7vw, 5.4rem);
  line-height: 0.92;
  letter-spacing: -0.05em;
}

.pp-about__lede {
  max-width: 48ch;
  padding-top: var(--pp-t3);
  border-top: 1px solid var(--pp-line);
}

.pp-about__sec {
  padding-top: var(--pp-t5);
}

.pp-about__sec-head {
  align-items: flex-start;
}

.pp-about__sec-title {
  display: grid;
  gap: 10px;
  max-width: 64ch;
}

.pp-about__sec-mark {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-top: 1px solid var(--pp-line-strong);
  border-right: 1px solid var(--pp-line-strong);
}

.pp-about__threats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(28px, 4vw, 64px);
}

.pp-about__threat {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding-top: 18px;
  border-top: 1px solid var(--pp-line-strong);
}

.pp-about__threat-head {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 92px;
  gap: 12px;
  align-items: start;
  min-height: 78px;
}

.pp-about__threat-kind {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--pp-line);
  color: var(--pp-accent-text);
  background: var(--pp-sheet);
}

.pp-about__threat-title {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.pp-about__threat-name {
  font-size: clamp(1.35rem, 2.2vw, 1.8rem);
  line-height: 1.05;
}

.pp-about__threat-art {
  display: block;
  height: 74px;
  overflow: hidden;
  color: var(--pp-accent);
  opacity: 0.5;
}

.pp-about__threat-art :deep(svg) {
  width: 100%;
  height: 100%;
}

.pp-about__preamble {
  max-width: 62ch;
  padding: var(--pp-t3) 0 var(--pp-t4);
}

.pp-about__group {
  margin-top: var(--pp-t3);
  padding-top: var(--pp-t3);
  color: var(--pp-accent-text);
  border-top: 1px solid var(--pp-line);
}

.pp-about__rows {
  display: grid;
  border-top: 1px solid var(--pp-line);
}

.pp-about__row {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
  min-width: 0;
  padding: 13px 2px;
  border-bottom: 1px solid var(--pp-line-soft);
  color: var(--pp-ink);
  transition: background-color var(--pp-fast) var(--pp-ease), padding-left var(--pp-fast) var(--pp-ease);
}

a.pp-about__row:hover {
  padding-left: 8px;
  background: var(--pp-sheet-soft);
}

.pp-about__row--static {
  cursor: default;
}

.pp-about__row-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--pp-accent-text);
}

.pp-about__row-icon--quiet {
  color: var(--pp-muted);
}

.pp-about__row-copy {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.pp-about__row-title {
  font-family: var(--pp-display);
  font-size: 0.98rem;
  font-weight: 620;
  line-height: 1.2;
  letter-spacing: -0.015em;
  color: var(--pp-ink);
}

.pp-about__row-sub {
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--pp-muted);
  text-wrap: pretty;
}

.pp-about__row-arrow {
  margin-top: 3px;
  color: var(--pp-muted);
  transition: color var(--pp-fast) var(--pp-ease), transform var(--pp-fast) var(--pp-ease);
}

a.pp-about__row:hover .pp-about__row-arrow {
  color: var(--pp-accent-text);
  transform: translate(1px, -1px);
}

.pp-about__row :deep(.pp-tag) {
  margin-top: 1px;
}

.pp-about__machines {
  margin-top: var(--pp-t4);
  padding-top: var(--pp-t3);
  border-top: 1px solid var(--pp-line);
}

.pp-about__steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--pp-line);
}

.pp-about__step {
  display: grid;
  align-content: start;
  gap: 10px;
  min-width: 0;
  padding: 20px clamp(14px, 2vw, 26px) 0;
  border-right: 1px solid var(--pp-line);
}

.pp-about__step:first-child {
  padding-left: 0;
}

.pp-about__step:last-child {
  padding-right: 0;
  border-right: 0;
}

.pp-about__step-n {
  font-family: var(--pp-mono);
  font-size: clamp(1.5rem, 2.2vw, 2rem);
  line-height: 1;
  letter-spacing: 0.02em;
  color: var(--pp-accent-text);
}

.pp-about__step-title {
  font-family: var(--pp-display);
  font-size: 1.02rem;
  font-weight: 620;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--pp-ink);
}

.pp-about__step-body {
  max-width: 40ch;
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--pp-ink-soft);
}

.pp-about__close {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: clamp(24px, 4vw, 64px);
  padding-top: var(--pp-t4);
}

.pp-about__close-block {
  display: grid;
  align-content: start;
  gap: 14px;
  min-width: 0;
  padding-top: 20px;
  border-top: 1px solid var(--pp-line-strong);
}

.pp-about__close-block--quiet {
  border-top-style: dashed;
}

.pp-about__cta {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--pp-accent-line);
  font-family: var(--pp-mono);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--pp-accent-text);
  transition: border-color var(--pp-fast) var(--pp-ease), gap var(--pp-fast) var(--pp-ease);
}

.pp-about__cta:hover {
  gap: 11px;
  border-bottom-color: currentColor;
}

.pp-about__promises {
  display: grid;
  gap: 10px;
}

.pp-about__promise {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: 8px;
  align-items: start;
  font-size: 0.86rem;
  line-height: 1.6;
  color: var(--pp-ink-soft);
}

.pp-about__promise-mark {
  width: 5px;
  height: 5px;
  margin-top: 0.65em;
  background: var(--pp-muted);
  rotate: 45deg;
}

@media (max-width: 900px) {
  .pp-about__head {
    padding-top: var(--pp-t5);
  }

  .pp-about__head-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--pp-t3);
  }

  .pp-about__lede {
    padding-top: var(--pp-t3);
  }

  .pp-about__threats {
    grid-template-columns: minmax(0, 1fr);
  }

  .pp-about__steps {
    grid-template-columns: minmax(0, 1fr);
  }

  .pp-about__step {
    padding: 18px 0;
    border-right: 0;
    border-bottom: 1px solid var(--pp-line);
  }

  .pp-about__step:last-child {
    border-bottom: 0;
  }

  .pp-about__close {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 560px) {
  .pp-about {
    padding-bottom: var(--pp-t5);
  }

  .pp-about__title {
    font-size: clamp(2.55rem, 13vw, 3.6rem);
  }

  .pp-about__sec-mark {
    display: none;
  }

  .pp-about__threat-head {
    grid-template-columns: 30px minmax(0, 1fr);
    min-height: 0;
  }

  .pp-about__threat-kind {
    width: 28px;
    height: 28px;
  }

  .pp-about__threat-art {
    display: none;
  }

  .pp-about__row {
    grid-template-columns: 17px minmax(0, 1fr) auto;
    gap: 9px;
  }

  .pp-about__row-title {
    font-size: 0.94rem;
  }

  .pp-about__row-sub {
    font-size: 0.78rem;
  }
}
</style>
