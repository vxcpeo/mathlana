<script setup>
/** "Two threats to your keys, measured live" — the two bordered panels. */
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
  <section class="mx-auto w-full max-w-7xl px-4 pt-14 sm:px-6 sm:pt-16">
    <div class="mb-6 flex max-w-2xl flex-col gap-1.5">
      <h2 class="headline text-2xl sm:text-3xl">Two threats to your keys, measured live</h2>
      <p class="text-sm text-pretty text-muted-foreground">
        Quantum computers and AI-accelerated math could both break the math that guards crypto
        wallets. Every record below is public, and a machine checked it.
      </p>
    </div>

    <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
      <!-- Quantum computers -->
      <PanelCard
        icon="atom"
        title="Quantum computers"
        subtitle="Shor's algorithm against crypto wallet keys"
        art="orbit"
      >
        <ul class="flex flex-col divide-y">
          <li>
            <p class="bg-muted/40 px-5 py-1.5 text-[0.72rem] font-medium text-muted-foreground">
              Elliptic curves (ECDSA, Ed25519): your wallet's keys, at risk from both threats
            </p>
            <ul class="flex flex-col divide-y border-t">
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
          </li>
        </ul>
      </PanelCard>

      <!-- AI-accelerated math -->
      <PanelCard
        icon="sigma"
        title="AI-accelerated math"
        subtitle="Years of math in months: the risks and the way out"
        art="figure"
      >
        <ul class="flex flex-col divide-y">
          <li>
            <p class="bg-muted/40 px-5 py-1.5 text-[0.72rem] font-medium text-muted-foreground">
              Hash-based: the way out, made smaller and proven sound
            </p>
            <ul class="flex flex-col divide-y border-t">
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
          </li>

          <li>
            <div class="flex items-start gap-3 px-5 py-3.5 opacity-55">
              <Icon name="code-xml" class="mt-0.5 size-4 shrink-0 text-brand-text" />
              <span class="flex min-w-0 flex-col gap-0.5">
                <span class="font-heading text-sm font-semibold tracking-[-0.01em]"
                  >precompile.fast</span
                >
                <span class="text-[0.82rem] leading-relaxed text-muted-foreground"
                  >The EVM's cryptography proven correct in Lean, with its gas measured.</span
                >
              </span>
              <AppBadge tone="quiet" class="ml-auto shrink-0">Next</AppBadge>
            </div>
          </li>

          <li>
            <div class="flex items-start gap-3 px-5 py-3.5 opacity-55">
              <Icon name="layers" class="mt-0.5 size-4 shrink-0 text-brand-text" />
              <span class="flex min-w-0 flex-col gap-0.5">
                <span class="font-heading text-sm font-semibold tracking-[-0.01em]"
                  >Lattice records</span
                >
                <span class="text-[0.82rem] leading-relaxed text-muted-foreground"
                  >Lattices such as ML-DSA and FHE, once a public venue checks results by
                  machine.</span
                >
              </span>
              <AppBadge tone="quiet" class="ml-auto shrink-0">Later</AppBadge>
            </div>
          </li>
        </ul>

        <p class="border-t px-5 py-2.5 text-[0.72rem] text-muted-foreground">
          Not open for tokens yet. It opens here when its results can be checked the same way.
        </p>
      </PanelCard>
    </div>
  </section>
</template>
