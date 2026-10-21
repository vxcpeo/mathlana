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
  <div class="cq-page cq-home">
    <article class="cq-home__lead">
    <div class="cq-pagehead cq-home__head">
      <div class="cq-pagehead__head">
        <p class="cq-kicker">
          <span aria-hidden="true" class="cq-dot cq-dot--live cq-live-pulse" />
          <span
            ><span class="cq-strong cq-accent">AI</span> and
            <span class="cq-strong cq-accent">quantum</span> vs. crypto keys, on
            Solana</span
          >
        </p>

        <h1 class="cq-runhead">
          <span class="cq-runhead__line">Bitcoin, Ethereum, Solana.</span>
          <span class="cq-runhead__line cq-runhead__line--dim">When do their wallets break?</span>
        </h1>
      </div>

      <div class="cq-pagehead__edge">
        <p class="cq-lede">
          <span class="cq-strong cq-accent">AI</span> and
          <span class="cq-strong cq-accent">quantum computers</span> are closing in on
          the math that guards them. Qubitess measures how close, live.
        </p>

        <p class="cq-lede cq-lede--tight">
          <RouterLink to="/tokens" class="cq-link cq-strong">Run any task</RouterLink>
          on a <span class="cq-strong cq-accent">real quantum computer</span>, or
          <RouterLink to="/launch" class="cq-link cq-strong">launch a token</RouterLink>
          with your picture redrawn 1:1 by one, with
          <span class="cq-strong cq-accent">proof of quantum</span>.
        </p>

        <div class="cq-inline cq-home__actions">
          <AppButton to="/launch" size="lg">
            Launch a token
            <Icon name="arrow-right" :size="15" />
          </AppButton>
          <AppButton to="/#how" variant="ghost" size="lg">How it works</AppButton>
        </div>
      </div>
    </div>
    </article>

    <div class="cq-home__stage">
      <div class="cq-home__band">
      <div class="cq-home__figure" aria-hidden="true">
        <img src="/brand/urania-indigo.png" alt="" class="cq-home__portrait" />
        <img src="/brand/urania-ink.png" alt="" class="cq-home__portrait" />
        <span class="cq-home__tick cq-home__tick--a" />
        <span class="cq-home__tick cq-home__tick--b" />
        <span class="cq-home__tick cq-home__tick--c" />
      </div>

      <div class="cq-home__machines">
        <span class="cq-h4">Running quantum computers:</span>
        <div class="cq-chips">
          <a
            v-for="chip in SHOWN"
            :key="chip.maker + chip.model"
            :href="chip.href"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`${chip.maker} ${chip.model}, its official page (opens in a new tab)`"
            class="cq-chip"
          >
            <MachineLogo :maker="chip.maker" class="cq-chip__logo" />
            <span class="cq-chip__model">{{ chip.model }}</span>
            <Icon name="arrow-up-right" :size="13" class="cq-chip__arrow" />
          </a>
          <span v-if="machineCount > SHOWN.length" class="cq-chip cq-chip--count"
            >+{{ machineCount - SHOWN.length }} more</span
          >
        </div>
      </div>
      </div>

      <div role="list" aria-label="What you can do here" class="cq-home__decks">
      <div v-for="card in CARDS" :key="card.title" role="listitem" class="cq-home__deck">
        <RouterLink :to="card.to" class="cq-home__decklink">
          <span class="cq-home__art" aria-hidden="true">
            <CardArt :name="card.art" />
          </span>
          <span class="cq-home__deckbody">
            <span v-if="card.badge" class="cq-tag cq-tag--accent cq-home__badge">
              <span aria-hidden="true" class="cq-dot" />
              {{ card.badge }}
            </span>
            <span class="cq-home__decktitle">{{ card.title }}</span>
            <span class="cq-home__decktext">{{ card.body }}</span>
            <span class="cq-home__deckcta">
              {{ card.cta }}
              <Icon name="arrow-right" :size="13" />
            </span>
          </span>
        </RouterLink>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cq-home {
  max-width: none;
}

.cq-home__head {
  align-items: start;
}

.cq-home__actions {
  margin-top: 6px;
}

/* Figure band: a blueprint plate with the engraving dissolved into the edge. */
.cq-home__band {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 0.46fr);
  align-items: end;
  gap: clamp(16px, 2vw, 32px);
  min-height: clamp(190px, 22vw, 300px);
  padding: clamp(16px, 2vw, 26px);
  border: 1px solid var(--cq-line);
  border-radius: var(--cq-radius-lg);
  background:
    radial-gradient(120% 140% at 78% 10%, rgba(0, 0, 255, 0.07), transparent 60%),
    var(--cq-sheet);
  overflow: hidden;
}

.cq-home__figure {
  position: absolute;
  inset: 0 0 0 auto;
  width: 46%;
  pointer-events: none;
}

.cq-home__portrait {
  position: absolute;
  right: -6%;
  bottom: -14%;
  height: 128%;
  width: auto;
  opacity: 0.42;
  filter: grayscale(1) contrast(1.08) sepia(0.25) hue-rotate(190deg) saturate(2.2);
  mix-blend-mode: multiply;
}

.cq-home__portrait + .cq-home__portrait {
  opacity: 0.16;
  filter: none;
}

.cq-home__tick {
  position: absolute;
  background: var(--cq-accent);
  opacity: 0.55;
}

.cq-home__tick--a {
  right: 22px;
  top: 22px;
  width: 42px;
  height: 1px;
}

.cq-home__tick--b {
  right: 22px;
  top: 22px;
  width: 1px;
  height: 42px;
}

.cq-home__tick--c {
  right: 22px;
  bottom: 22px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.cq-home__machines {
  position: relative;
  display: grid;
  gap: 10px;
  align-content: end;
  z-index: 1;
  max-width: 640px;
}

/* Capability decks: three ruled columns, not three cards. */
.cq-home__decks {
  list-style: none;
  margin: clamp(26px, 3vw, 44px) 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--cq-line);
}

.cq-home__deck {
  border-right: 1px solid var(--cq-line);
}

.cq-home__deck:last-child {
  border-right: 0;
}

.cq-home__decklink {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 16px;
  padding: 20px 22px 22px 0;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.cq-home__deck:first-child .cq-home__decklink {
  padding-left: 0;
}

.cq-home__decklink:hover .cq-home__decktitle,
.cq-home__decklink:focus-visible .cq-home__decktitle {
  color: var(--cq-accent-text);
}

.cq-home__art {
  display: block;
  width: 64px;
  height: 64px;
  color: var(--cq-accent);
  opacity: 0.85;
}

.cq-home__art :deep(svg) {
  width: 100%;
  height: 100%;
}

.cq-home__deckbody {
  display: grid;
  gap: 5px;
  align-content: start;
  min-width: 0;
}

.cq-home__badge {
  justify-self: start;
}

.cq-home__decktitle {
  font-family: var(--cq-display);
  font-weight: 620;
  font-size: 1.02rem;
  letter-spacing: -0.02em;
  color: var(--cq-ink);
}

.cq-home__decktext {
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--cq-muted);
}

.cq-home__deckcta {
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--cq-mono);
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--cq-accent-text);
}

.dark .cq-home__portrait {
  mix-blend-mode: normal;
  opacity: 0.3;
  filter: grayscale(1) invert(1) contrast(1.05);
}

@media (max-width: 1080px) {
  .cq-home__band {
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
  }

  .cq-home__figure {
    width: 70%;
    opacity: 0.5;
  }

  .cq-home__decks {
    grid-template-columns: minmax(0, 1fr);
  }

  .cq-home__deck {
    border-right: 0;
    border-bottom: 1px solid var(--cq-line);
  }

  .cq-home__deck:last-child {
    border-bottom: 0;
  }

  .cq-home__decklink {
    padding: 18px 0;
  }
}
</style>
