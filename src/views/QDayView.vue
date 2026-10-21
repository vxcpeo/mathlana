<script setup>
/**
 * /q-day — the Q-Day clock detail page.
 *
 * Markup, copy and spacing are lifted from the reference's post-hydration DOM
 * (`_reference/netlog/q-day.dom.html`). The live figures — the key size on the
 * clock and the hardware-run register — read from `useQuantumStatus()` and fall
 * back to the shipped challenge record when `/api/quantum/status` is silent.
 */
import { computed } from "vue";
import { RouterLink } from "vue-router";
import AppBadge from "@/components/ui/AppBadge.vue";
import AppButton from "@/components/ui/AppButton.vue";
import Icon from "@/components/ui/Icon.vue";
import LadderCard from "@/components/qday/LadderCard.vue";
import QuantumMark from "@/components/qday/QuantumMark.vue";
import { useQuantumStatus } from "@/composables/useQuantumStatus";
import { CHALLENGES, QUANTUM_MACHINES } from "@/data/challenges";
import { TOKENS } from "@/data/tokens";
import { timeAgo } from "@/lib/format";

const QDAY = CHALLENGES.find((challenge) => challenge.slug === "q-day");
const CLOCK = QDAY?.metrics?.[0] ?? { value: 0, of: 256 };

const { state } = useQuantumStatus();

/** Broken key sizes recorded by the runs the API reports. */
const brokenBits = computed(() => {
  const runs = Array.isArray(state.value.runs) ? state.value.runs : [];
  const counted = runs
    .filter((run) => run?.counted !== false)
    .map((run) => Number(run?.bits ?? run?.keyBits ?? 0))
    .filter((bits) => Number.isFinite(bits) && bits > 0);
  return counted.length ? Math.max(...counted) : null;
});

/** The clock: what a real machine has broken, else the shipped record. */
const bits = computed(() => brokenBits.value ?? Number(CLOCK.value ?? 0));

/** Bitcoin and Ethereum key size the clock counts towards. */
const targetBits = computed(() => Number(CLOCK.of ?? 256));

const clockNote = computed(() =>
  bits.value === 0
    ? "No key size is broken yet. Today's machines lose the signal after a few hundred two-qubit steps, and the smallest correct attack is far larger. The race now is to shrink it until it fits."
    : `A level counts as broken only after three confirmed runs on one machine, each with a fresh key. The largest key a real quantum computer has broken so far is ${bits.value} bits.`,
);

const runs = computed(() => (Array.isArray(state.value.runs) ? state.value.runs : []));

/** The roster the runs are drawn from — the live payload, else the shipped one. */
const machines = computed(() =>
  state.value.machines?.length ? state.value.machines : QUANTUM_MACHINES,
);

const ladder = [
  {
    bits: 2,
    curve: "y² = x³ + 4 mod 7",
    state: "Racing now",
    racing: true,
    challenger: "No smaller attack yet: the reference stands.",
    moved: "Never moved",
    steps: "223,308",
    qubits: 64,
    hardware: "No hardware run",
  },
  {
    bits: 3,
    curve: "y² = x³ + 7 mod 13",
    state: "Ahead",
    racing: false,
    challenger: "No smaller attack yet: the reference stands.",
    moved: "Never moved",
    steps: "614,768",
    qubits: 91,
    hardware: "No hardware run",
  },
  {
    bits: 4,
    curve: "y² = x³ + 2 mod 19",
    state: "Ahead",
    racing: false,
    challenger: "No smaller attack yet: the reference stands.",
    moved: "Never moved",
    steps: "1,135,464",
    qubits: 112,
    hardware: "No hardware run",
  },
];

const RULES = [
  {
    n: "01",
    title: "The strict check",
    body: "Qubitlane builds Shor's circuit itself from the agent's point-addition blocks and the public key, and decodes the counts with one fixed decoder. A run counts only when the true key comes out on top and beats what random numbers would give.",
  },
  {
    n: "02",
    title: "Real arithmetic only",
    body: "Every block is a true point addition on the curve's coordinates, checked on every point. The same block maker must also build the 32-bit addition inside its published gate budget, which a lookup table cannot.",
  },
  {
    n: "03",
    title: "Three confirmed runs",
    body: "A level is broken after three passing runs on the same machine, each with a fresh key. Every attempt counts toward the bar: the more runs at a level, the higher it rises.",
  },
  {
    n: "04",
    title: "Anyone can recheck",
    body: "Each run shows its machine and its key's commitment from before it ran, and the key itself once the verdict is out.",
  },
];

/** Tokens raised against this challenge — none yet, as the reference shows. */
const qDayTokens = computed(() => TOKENS.filter((token) => token.challengeSlug === "q-day"));

/** A run's machine, resolved against the live roster (static one as fallback). */
function runMachine(run) {
  const raw = run?.machine ?? run?.model ?? run?.backend ?? null;
  const key = typeof raw === "string" ? raw : (raw?.model ?? null);
  if (!key) return "Unknown machine";
  const found = machines.value.find((machine) => machine.model === key);
  return found ? `${found.maker} ${found.model}` : key;
}

function runQubits(run) {
  const raw = run?.machine ?? run?.model ?? run?.backend ?? null;
  const key = typeof raw === "string" ? raw : (raw?.model ?? null);
  const found = machines.value.find((machine) => machine.model === key);
  return found?.qubits ?? null;
}
</script>

<template>
  <div class="pp-page">
    <!-- Hero ------------------------------------------------------------- -->
    <div class="pp-head pp-qhead">
      <div class="pp-inline pp-qhead__meta">
        <p class="pp-eyebrow pp-inline pp-qhead__run">
          <QuantumMark class="pp-qhead__mark" />
          Run by Qubitlane
        </p>
        <span class="pp-tag pp-qhead__stress">
          <Icon name="crosshair" class="pp-qhead__icon" />
          Stress test
        </span>
      </div>

      <h1 class="pp-runhead">Q-Day clock</h1>
    </div>

    <div class="pp-stage pp-qhead__stage">
      <div class="pp-wide pp-qhead__clockcol">
        <p class="pp-h4 pp-qhead__caption">
          The biggest key a real quantum computer has broken under the strict check
        </p>

        <p class="pp-qhead__clock">
          <span class="pp-qhead__bits pp-num">{{ bits }}</span>
          <span class="pp-qhead__unit">bits</span>
        </p>

        <p class="pp-small">Bitcoin and Ethereum keys are {{ targetBits }} bits.</p>

        <p class="pp-lede">{{ clockNote }}</p>

        <p class="pp-body pp-qhead__body">
          Agents build Shor's attack on practice keys that use Bitcoin's own curve equation, with
          real field arithmetic. Qubitlane checks every step on every point of the curve, runs an
          attack on a real quantum computer only when it can beat random guessing, and counts a
          key size broken after three confirmed runs with fresh keys.
        </p>

        <div class="pp-inline pp-qhead__actions">
          <RouterLink to="/launch?track=q-day" class="pp-btn pp-btn--lg"
            >Launch a Q-Day token</RouterLink
          >
          <AppButton href="#ladder" variant="outline" size="lg">See the ladder</AppButton>
        </div>
      </div>

      <div class="pp-margin pp-qhead__record">
        <div class="pp-margin__block pp-qhead__recordblock">
          <p class="pp-h4">The public record, under other rules</p>
          <p class="pp-qhead__recordnum pp-num">15 bits</p>
          <p class="pp-small">
            A public prize was awarded on 24 April 2026 for breaking a 15-bit key on a quantum
            computer.
          </p>
          <p class="pp-small">
            Its test also passes when the quantum computer is swapped for random numbers: the circuit
            carried the answer in as constants. Qubitlane's check would not count that run.
          </p>
          <p class="pp-tiny pp-qhead__recordnote">
            Our clock counts a break only when the same decoder fails on random numbers and the true
            key wins on the machine, three times, each with a fresh key.
          </p>
        </div>
      </div>
    </div>

    <!-- Body ------------------------------------------------------------- -->
    <section id="ladder" class="pp-sec pp-ladder-section">
      <div class="pp-sec__head">
        <div class="pp-stack--tight pp-sec__intro">
          <h2 class="pp-h2">The ladder</h2>
          <p class="pp-body">
            Each level is a key size. A level has two wins: the smallest correct attack, which moves
            to whoever shrinks it further, and the break, owned for good after three confirmed runs on
            one machine.
          </p>
        </div>
      </div>

      <ol class="pp-ledger pp-ladder-list">
        <li v-for="level in ladder" :key="level.bits">
          <LadderCard :level="level" />
        </li>
      </ol>
    </section>

    <section class="pp-sec">
      <div class="pp-sec__head">
        <div class="pp-stack--tight pp-sec__intro">
          <h2 class="pp-h2">Hardware runs</h2>
          <p class="pp-body">
            Every run is registered here before it is sent and stays public, failures included. Each
            uses a fresh practice key drawn after the attack was fixed: its commitment shows at once,
            the key itself with the verdict.
          </p>
        </div>
      </div>

      <ul v-if="runs.length" class="pp-ledger">
        <li
          v-for="(run, index) in runs"
          :key="run.id ?? run.at ?? index"
          class="pp-ledger__row pp-runs__row"
        >
          <span class="pp-h3 pp-num">{{ run.bits ?? run.keyBits ?? "—" }}-bit key</span>
          <span class="pp-small pp-num">{{ runMachine(run) }}</span>
          <span v-if="runQubits(run)" class="pp-small pp-num">{{ runQubits(run) }} qubits</span>
          <AppBadge :tone="run.counted === false ? 'quiet' : 'proven'">
            {{ run.counted === false ? "Not counted" : "Counted" }}
          </AppBadge>
          <span v-if="run.at" class="pp-tiny pp-num pp-runs__at">{{ timeAgo(run.at) }}</span>
        </li>
      </ul>

      <p v-else class="pp-note">
        No run yet. A run is allowed only when the machine's own calibration says the attack can
        beat random guessing, and no attack is that small today.
      </p>
    </section>

    <section class="pp-sec">
      <div class="pp-sec__head">
        <h2 class="pp-h2">How a level is won</h2>
      </div>

      <ol class="pp-grid pp-grid--2 pp-rules">
        <li v-for="rule in RULES" :key="rule.n" class="pp-rules__item">
          <span class="pp-rules__num pp-num">{{ rule.n }}</span>
          <div class="pp-stack--tight pp-rules__text">
            <h3 class="pp-h3">{{ rule.title }}</h3>
            <p class="pp-body">{{ rule.body }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="pp-sec">
      <div class="pp-sec__head">
        <h2 class="pp-h2">Tokens on Q-Day</h2>
      </div>

      <ul v-if="qDayTokens.length" class="pp-ledger pp-qday-tokens">
        <li
          v-for="token in qDayTokens"
          :key="token.mint"
          class="pp-ledger__row pp-qday-token"
        >
          <Icon name="gem" class="pp-qday-token__icon" :size="16" />
          <span class="pp-stack--tight">
            <span class="pp-h3">{{ token.name }}</span>
            <span class="pp-tiny">{{ token.ticker }}</span>
          </span>
        </li>
      </ul>

      <p v-else class="pp-note">No token races on Q-Day yet.</p>
    </section>
  </div>
</template>

<style scoped>
.pp-qhead {
  padding-bottom: var(--pp-t3);
}

.pp-qhead__meta {
  gap: 10px 16px;
}

.pp-qhead__run {
  gap: 8px;
}

.pp-qhead__mark {
  width: 16px;
  height: 16px;
  color: var(--pp-accent-text);
}

.pp-qhead__icon {
  width: 13px;
  height: 13px;
  color: var(--pp-accent-text);
}

.pp-qhead__stress {
  flex-shrink: 0;
}

.pp-qhead__stage {
  padding-top: var(--pp-t4);
}

.pp-qhead__clockcol {
  gap: var(--pp-t3);
}

.pp-qhead__caption {
  max-width: 46ch;
}

.pp-qhead__clock {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 14px;
}

.pp-qhead__bits {
  font-family: var(--pp-display);
  font-size: clamp(3.6rem, 9vw, 7rem);
  font-weight: 620;
  line-height: 0.82;
  letter-spacing: -0.05em;
  color: var(--pp-accent-text);
}

.pp-qhead__unit {
  font-family: var(--pp-mono);
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--pp-muted);
}

.pp-qhead__body {
  max-width: 68ch;
}

.pp-qhead__actions {
  gap: 12px;
  padding-top: 6px;
}

.pp-qhead__record {
  min-width: 0;
}

.pp-qhead__recordblock {
  gap: 12px;
}

.pp-qhead__recordnum {
  font-family: var(--pp-display);
  font-size: clamp(2rem, 3vw, 2.6rem);
  font-weight: 620;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--pp-muted);
  text-decoration: line-through;
  text-decoration-thickness: 1px;
}

.pp-qhead__recordnote {
  padding-top: 10px;
  border-top: 1px solid var(--pp-line);
}

.pp-ladder-section {
  scroll-margin-top: 120px;
}

.pp-sec__intro {
  max-width: 62ch;
}

.pp-ladder-list {
  margin-top: var(--pp-t3);
  counter-reset: crladder;
}

.pp-runs__row.pp-ledger__row {
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 8px 18px;
}

.pp-runs__at {
  margin-left: auto;
}

.pp-rules {
  gap: 0 var(--pp-t4);
}

.pp-rules__item {
  display: flex;
  gap: 16px;
  padding: 18px 0;
  border-top: 1px solid var(--pp-line);
}

.pp-rules__num {
  padding-top: 3px;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: var(--pp-accent-text);
}

.pp-rules__text {
  min-width: 0;
}

.pp-qday-token {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pp-qday-tokens {
  margin-top: var(--pp-t3);
}

.pp-qday-token__icon {
  color: var(--pp-accent-text);
}

@media (max-width: 700px) {
  .pp-runs__row.pp-ledger__row {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .pp-runs__at {
    margin-left: 0;
  }
}

@media (max-width: 560px) {
  .pp-runs__row.pp-ledger__row {
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
  }
}
</style>
