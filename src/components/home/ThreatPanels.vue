<script setup>
/** "Two threats to your keys, measured live" — a two-column blueprint ledger. */
import AppBadge from "@/components/ui/AppBadge.vue";
import Icon from "@/components/ui/Icon.vue";
import PanelCard from "@/components/ui/PanelCard.vue";
import ThreatRow from "@/components/home/ThreatRow.vue";
import { CHALLENGES } from "@/data/challenges";
import { group } from "@/lib/format";

const bySlug = Object.fromEntries(CHALLENGES.map((c) => [c.slug, c]));
const ecdsa = bySlug["ecdsa-fail"];
const siggolf = bySlug["sig-golf"];
const proximity = bySlug["proximity"];

const lower = proximity.metrics[0];
const upper = proximity.metrics[1];
</script>

<template>
  <section class="cq-page cq-sec">
    <div class="cq-sec__head">
      <div class="cq-stack cq-stack--tight cq-measure">
        <h2 class="cq-h2">Two threats to your keys, measured live</h2>
        <p class="cq-body">
          Quantum computers and AI-accelerated math could both break the math that guards crypto
          wallets. Every record below is public, and a machine checked it.
        </p>
      </div>
      <span class="cq-threats__index" aria-hidden="true" />
    </div>

    <div class="cq-threats__frame">
    <div class="cq-threats">
      <!-- Quantum computers -->
      <PanelCard
        class="cq-threat"
        header-size="lg"
        icon="atom"
        title="Quantum computers"
        subtitle="Shor's algorithm against crypto wallet keys"
      >
        <div class="cq-threat__body">
          <p class="cq-threat__group">
            Elliptic curves (ECDSA, Ed25519): your wallet's keys, at risk from both threats
          </p>
          <ul class="cq-ledger cq-ledger--rows">
            <ThreatRow
              to="/q-day"
              aria-label="Open the Q-Day clock"
              icon="atom"
              title="Q-Day clock"
              description="Keys broken on a real quantum computer"
              value="0 bits"
              unit="of 256"
              note="No token racing yet"
              value-tone="brand"
            />
            <ThreatRow
              :to="`/challenges/${ecdsa.slug}`"
              :aria-label="`${ecdsa.name}, Point addition. Open the challenge`"
              icon="crosshair"
              title="ECDSA.fail"
              qualifier="Point addition"
              description="Qubits × Toffoli gates"
              :value="group(ecdsa.metrics[0].value)"
              unit="qubits × Toffoli"
              note="No token on it yet"
              :progress="88"
              progress-label="88.1% smaller"
            />
          </ul>
        </div>
      </PanelCard>

      <!-- AI-accelerated math -->
      <PanelCard
        class="cq-threat"
        header-size="lg"
        icon="sigma"
        title="AI-accelerated math"
        subtitle="Years of math in months: the risks and the way out"
      >
        <div class="cq-threat__body">
          <p class="cq-threat__group">
            Hash-based: the way out, made smaller and proven sound
          </p>
          <ul class="cq-ledger cq-ledger--rows">
            <ThreatRow
              :to="`/challenges/${siggolf.slug}`"
              :aria-label="`${siggolf.name}, ${siggolf.metrics[0].label}. Open the challenge`"
              icon="signature"
              title="sig.golf"
              :description="siggolf.metrics[0].label"
              :value="group(siggolf.metrics[0].value)"
              unit="byte·cycles"
              note="1 token on it"
              :progress="49.6"
              progress-label="49.6% smaller"
            />
            <ThreatRow
              :to="`/challenges/${proximity.slug}`"
              :aria-label="`${proximity.name}, Lower bound. Open the challenge`"
              icon="sigma"
              title="The Proximity Prize"
              qualifier="Lower bound"
              description="Bits proven safe"
              :value="lower.value.toFixed(2)"
              unit="bits"
              note="No token on it yet"
              :progress="20.2"
              progress-label="20.2% of the way"
            />
            <ThreatRow
              :to="`/challenges/${proximity.slug}`"
              :aria-label="`${proximity.name}, Upper bound. Open the challenge`"
              icon="sigma"
              title="The Proximity Prize"
              qualifier="Upper bound"
              description="Bits where it stops being safe"
              :value="upper.value.toFixed(2)"
              unit="bits"
              note="2 tokens on it"
              :progress="9.3"
              progress-label="9.3% smaller"
            />
          </ul>

          <ul class="cq-ledger cq-ledger--rows cq-threat__next">
            <li class="cq-nextrow">
              <Icon name="code-xml" :size="16" class="cq-tone-accent cq-nextrow__icon" />
              <span class="cq-nextrow__text">
                <span class="cq-nextrow__title">precompile.fast</span>
                <span class="cq-nextrow__body"
                  >The EVM's cryptography proven correct in Lean, with its gas measured.</span
                >
              </span>
              <AppBadge tone="quiet" class="cq-nextrow__badge">Next</AppBadge>
            </li>

            <li class="cq-nextrow">
              <Icon name="layers" :size="16" class="cq-tone-accent cq-nextrow__icon" />
              <span class="cq-nextrow__text">
                <span class="cq-nextrow__title">Lattice records</span>
                <span class="cq-nextrow__body"
                  >Lattices such as ML-DSA and FHE, once a public venue checks results by
                  machine.</span
                >
              </span>
              <AppBadge tone="quiet" class="cq-nextrow__badge">Later</AppBadge>
            </li>
          </ul>

          <p class="cq-threat__foot">
            Not open for tokens yet. It opens here when its results can be checked the same way.
          </p>
        </div>
      </PanelCard>
    </div>
    </div>
  </section>
</template>

<style scoped>
.cq-measure {
  max-width: 60ch;
}

.cq-threats__index {
  display: block;
  width: 64px;
  height: 8px;
  background: repeating-linear-gradient(
    90deg,
    var(--cq-accent) 0 8px,
    transparent 8px 12px
  );
}

.cq-threats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--cq-t3);
  align-items: start;
}

.cq-threat__body {
  display: grid;
  gap: 12px;
  padding: 16px 20px 20px;
}

.cq-threat__group {
  font-family: var(--cq-mono);
  font-size: 0.66rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cq-muted);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--cq-line);
}

.cq-nextrow {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: start;
  padding: 14px 0;
  border-bottom: 1px solid var(--cq-line-soft);
}

.cq-threat__next .cq-nextrow__title {
  color: var(--cq-muted);
}

.cq-nextrow__text {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.cq-nextrow__title {
  font-family: var(--cq-display);
  font-size: 0.92rem;
  font-weight: 620;
  letter-spacing: -0.01em;
  color: var(--cq-ink);
}

.cq-nextrow__body {
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--cq-muted);
}

.cq-threat__foot {
  font-size: 0.74rem;
  color: var(--cq-muted);
}

@media (max-width: 1000px) {
  .cq-threats {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
