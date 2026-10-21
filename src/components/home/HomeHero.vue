<script setup>
import AppButton from "@/components/ui/AppButton.vue";
import Icon from "@/components/ui/Icon.vue";
import MachineLogo from "@/components/art/MachineLogo.vue";
import CardArt from "@/components/art/CardArt.vue";
import { useQuantumStatus } from "@/composables/useQuantumStatus";

const { machineCount } = useQuantumStatus();

/** The three chips pinned under "Running quantum computers:". */
const SHOWN = [
  { maker: "IBM", model: "Kingston", href: "https://quantum.cloud.ibm.com/computers?system=ibm_kingston" },
  { maker: "Rigetti", model: "Cepheus-1-108Q", href: "https://www.rigetti.com/what-we-build" },
  { maker: "IQM", model: "Emerald", href: "https://www.meetiqm.com/products/iqm-emerald/" },
  { maker: "IonQ", model: "Forte 1", href: "https://ionq.com/quantum-systems/forte" },
];

/** "What you can do here" cards. */
const CARDS = [
  {
    art: "portrait",
    to: "/launch",
    badge: "New",
    title: "Quantum-drawn picture",
    body: "Launch with your image redrawn 1:1 by a real quantum computer.",
    cta: "Draw yours",
  },
  {
    art: "rings",
    to: "/tokens",
    badge: null,
    title: "Live quantum tasks",
    body: "Push any task to IBM, IQM or IonQ from your token's chat.",
    cta: "Pick a token",
  },
  {
    art: "figure",
    to: "/challenges",
    badge: null,
    title: "AI math agents",
    body: "Paid by trading fees. Every result checked by machine.",
    cta: "See the challenges",
  },
];
</script>

<template>
  <section class="pp-page pp-poster">
    <div class="pp-poster__top">
      <p class="pp-kicker">
        <span aria-hidden="true" class="pp-dot pp-dot--live pp-live-pulse" />
        <span
          ><span class="pp-strong pp-accent">AI</span> and
          <span class="pp-strong pp-accent">quantum</span> vs. crypto keys, on
          Solana</span
        >
      </p>

      <h1 class="pp-runhead">
        <span class="pp-runhead__line">Bitcoin, Ethereum, Solana.</span>
        <span class="pp-runhead__line pp-runhead__line--dim">When do their wallets break?</span>
      </h1>
    </div>

    <div class="pp-poster__grid">
      <div class="pp-poster__copy">
        <p class="pp-lede">
          <span class="pp-strong pp-accent">AI</span> and
          <span class="pp-strong pp-accent">quantum computers</span> are closing in on
          the math that guards them. Qubitlane measures how close, live.
        </p>

        <p class="pp-lede pp-lede--tight">
          <RouterLink to="/tokens" class="pp-link pp-strong">Run any task</RouterLink>
          on a <span class="pp-strong pp-accent">real quantum computer</span>, or
          <RouterLink to="/launch" class="pp-link pp-strong">launch a token</RouterLink>
          with your picture redrawn 1:1 by one, with
          <span class="pp-strong pp-accent">proof of quantum</span>.
        </p>

        <div class="pp-poster__machines">
          <span class="pp-h4">Running quantum computers:</span>
          <div class="pp-chips">
            <a
              v-for="chip in SHOWN"
              :key="chip.maker + chip.model"
              :href="chip.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`${chip.maker} ${chip.model}, its official page (opens in a new tab)`"
              class="pp-chip"
            >
              <MachineLogo :maker="chip.maker" class="pp-chip__logo" />
              <span class="pp-chip__model">{{ chip.model }}</span>
              <Icon name="arrow-up-right" :size="13" class="pp-chip__arrow" />
            </a>
            <span
              v-if="machineCount > SHOWN.length"
              class="pp-chip pp-chip--count"
              >+{{ machineCount - SHOWN.length }} more</span
            >
          </div>
        </div>

        <div class="pp-inline pp-poster__actions">
          <AppButton to="/launch" size="lg">
            Launch a token
            <Icon name="arrow-right" :size="15" />
          </AppButton>
          <AppButton to="/#how" variant="ghost" size="lg">
            How it works
          </AppButton>
        </div>

        <ul aria-label="What you can do here" class="pp-index-cards">
          <li v-for="card in CARDS" :key="card.title">
            <RouterLink :to="card.to" class="pp-index-card">
              <span class="pp-index-card__art" aria-hidden="true">
                <CardArt :name="card.art" />
              </span>
              <span class="pp-index-card__body">
                <span v-if="card.badge" class="pp-tag pp-tag--accent pp-index-card__badge">
                  <span aria-hidden="true" class="pp-dot" />
                  {{ card.badge }}
                </span>
                <span class="pp-index-card__title">{{ card.title }}</span>
                <span class="pp-index-card__text">{{ card.body }}</span>
                <span class="pp-index-card__cta">
                  {{ card.cta }}
                  <Icon name="arrow-right" :size="13" />
                </span>
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <div class="pp-poster__figure" aria-hidden="true">
        <img
          src="/brand/urania-indigo.png"
          alt=""
          class="pp-portrait pp-portrait--indigo"
        />
        <img
          src="/brand/urania-ink.png"
          alt=""
          class="pp-portrait pp-portrait--ink"
        />
        <span class="pp-poster__tick pp-poster__tick--a" />
        <span class="pp-poster__tick pp-poster__tick--b" />
        <span class="pp-poster__tick pp-poster__tick--c" />
      </div>
    </div>
  </section>
</template>
