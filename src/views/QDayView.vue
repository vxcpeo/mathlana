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
    body: "Qubitess builds Shor's circuit itself from the agent's point-addition blocks and the public key, and decodes the counts with one fixed decoder. A run counts only when the true key comes out on top and beats what random numbers would give.",
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
  <div class="cq-page cq-qday">
    <header class="cq-pagehead cq-qday__pagehead">
      <div class="cq-pagehead__head">
        <p class="cq-kicker cq-qday__kicker">
          <QuantumMark class="cq-qday__mark" />
          Run by Qubitess
        </p>
        <h1 class="cq-runhead cq-qday__runhead">Q-Day clock</h1>
      </div>

      <div class="cq-pagehead__edge cq-qday__edge">
        <span class="cq-tag cq-qday__stress">
          <Icon name="crosshair" class="cq-qday__stressicon" />
          Stress test
        </span>
        <AppButton href="#ladder" variant="outline" size="lg">See the ladder</AppButton>
      </div>
    </header>

    <div class="cq-stage cq-qday__stage">
      <div class="cq-stage__main cq-qday__main">
        <section class="cq-band cq-qday__clock">
          <span class="cq-qday__clockrail" aria-hidden="true"></span>

          <p class="cq-qday__caption">
            The biggest key a real quantum computer has broken under the strict check
          </p>

          <p class="cq-qday__figure">
            <span class="cq-qday__bits cq-num">{{ bits }}</span>
            <span class="cq-qday__unit">bits</span>
          </p>

          <p class="cq-qday__target">Bitcoin and Ethereum keys are {{ targetBits }} bits.</p>

          <p class="cq-qday__note">{{ clockNote }}</p>
        </section>

        <section class="cq-sheet cq-qday__record">
          <div class="cq-qday__record-head">
            <p class="cq-h4 cq-qday__recordtitle">The public record, under other rules</p>
            <p class="cq-qday__recordfigure cq-num">15 bits</p>
          </div>

          <div class="cq-qday__record-body">
            <p class="cq-small cq-qday__recordcopy">
              A public prize was awarded on 24 April 2026 for breaking a 15-bit key on a quantum
              computer.
            </p>
            <p class="cq-small cq-qday__recordcopy">
              Its test also passes when the quantum computer is swapped for random numbers: the circuit
              carried the answer in as constants. Qubitess's check would not count that run.
            </p>
          </div>

          <p class="cq-tiny cq-qday__recordnote">
            Our clock counts a break only when the same decoder fails on random numbers and the true
            key wins on the machine, three times, each with a fresh key.
          </p>
        </section>
      </div>

      <aside class="cq-stage__edge cq-qday__rail">
        <div class="cq-sheet cq-qday__brief">
          <span class="cq-qday__briefmark" aria-hidden="true"></span>
          <p class="cq-body cq-qday__briefcopy">
            Agents build Shor's attack on practice keys that use Bitcoin's own curve equation, with
            real field arithmetic. Qubitess checks every step on every point of the curve, runs an
            attack on a real quantum computer only when it can beat random guessing, and counts a
            key size broken after three confirmed runs with fresh keys.
          </p>
          <RouterLink to="/launch?track=q-day" class="cq-btn cq-btn--lg cq-qday__cta"
            >Launch a Q-Day token</RouterLink
          >
        </div>
      </aside>
    </div>

    <div class="cq-qday__sections">
      <section id="ladder" class="cq-qday__section cq-qday__laddersec">
        <header class="cq-qday__sectionhead">
          <h2 class="cq-h2 cq-qday__sectiontitle">The ladder</h2>
          <p class="cq-body cq-qday__sectionintro">
            Each level is a key size. A level has two wins: the smallest correct attack, which moves
            to whoever shrinks it further, and the break, owned for good after three confirmed runs on
            one machine.
          </p>
        </header>

        <ol class="cq-qday__ladder">
          <li v-for="level in ladder" :key="level.bits">
            <LadderCard :level="level" />
          </li>
        </ol>
      </section>

      <section class="cq-qday__section cq-qday__runsec">
        <header class="cq-qday__sectionhead">
          <h2 class="cq-h2 cq-qday__sectiontitle">Hardware runs</h2>
          <p class="cq-body cq-qday__sectionintro">
            Every run is registered here before it is sent and stays public, failures included. Each
            uses a fresh practice key drawn after the attack was fixed: its commitment shows at once,
            the key itself with the verdict.
          </p>
        </header>

        <ul v-if="runs.length" class="cq-qday__runs">
          <li
            v-for="(run, index) in runs"
            :key="run.id ?? run.at ?? index"
            class="cq-qday__run"
          >
            <span class="cq-h3 cq-num cq-qday__runkey">{{ run.bits ?? run.keyBits ?? "—" }}-bit key</span>
            <span class="cq-qday__runmeta">
              <span class="cq-small cq-num">{{ runMachine(run) }}</span>
              <span v-if="runQubits(run)" class="cq-small cq-num">{{ runQubits(run) }} qubits</span>
            </span>
            <AppBadge :tone="run.counted === false ? 'quiet' : 'proven'">
              {{ run.counted === false ? "Not counted" : "Counted" }}
            </AppBadge>
            <span v-if="run.at" class="cq-tiny cq-num cq-qday__runat">{{ timeAgo(run.at) }}</span>
          </li>
        </ul>

        <p v-else class="cq-note cq-qday__empty">
          No run yet. A run is allowed only when the machine's own calibration says the attack can
          beat random guessing, and no attack is that small today.
        </p>
      </section>

      <section class="cq-qday__section cq-qday__rulesec">
        <header class="cq-qday__sectionhead cq-qday__sectionhead--slim">
          <h2 class="cq-h2 cq-qday__sectiontitle">How a level is won</h2>
        </header>

        <ol class="cq-qday__rules">
          <li v-for="rule in RULES" :key="rule.n" class="cq-qday__rule">
            <span class="cq-qday__rulenum cq-num">{{ rule.n }}</span>
            <div class="cq-qday__rulecopy">
              <h3 class="cq-h3">{{ rule.title }}</h3>
              <p class="cq-body">{{ rule.body }}</p>
            </div>
          </li>
        </ol>
      </section>

      <section class="cq-qday__section cq-qday__tokensec">
        <header class="cq-qday__sectionhead cq-qday__sectionhead--slim">
          <h2 class="cq-h2 cq-qday__sectiontitle">Tokens on Q-Day</h2>
        </header>

        <ul v-if="qDayTokens.length" class="cq-qday__tokens">
          <li
            v-for="token in qDayTokens"
            :key="token.mint"
            class="cq-qday__token"
          >
            <Icon name="gem" class="cq-qday__tokenicon" :size="16" />
            <span class="cq-qday__tokencopy">
              <span class="cq-h3">{{ token.name }}</span>
              <span class="cq-tiny">{{ token.ticker }}</span>
            </span>
          </li>
        </ul>

        <p v-else class="cq-note cq-qday__empty">No token races on Q-Day yet.</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.cq-qday {
  display: flex;
  flex-direction: column;
  gap: clamp(28px, 4vw, 58px);
}

/* running head ---------------------------------------------------------- */
.cq-qday__pagehead {
  margin-bottom: 0;
}

.cq-qday__kicker {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: var(--cq-muted-ground);
}

.cq-qday__mark {
  width: 17px;
  height: 17px;
  color: var(--cq-accent-text);
}

.cq-qday__runhead {
  margin-top: 12px;
}

.cq-qday__edge {
  align-items: flex-end;
  gap: 12px;
}

.cq-qday__stress {
  flex-shrink: 0;
}

.cq-qday__stressicon {
  width: 13px;
  height: 13px;
  color: var(--cq-accent-text);
}

/* clock stage ----------------------------------------------------------- */
.cq-qday__stage {
  margin-top: 0;
  padding-top: clamp(4px, 1vw, 10px);
  border-top: 0;
}

.cq-qday__main {
  gap: clamp(18px, 2vw, 26px);
}

.cq-qday__clock {
  position: relative;
  display: grid;
  gap: clamp(17px, 2.2vw, 28px);
  padding: clamp(26px, 4vw, 52px);
  margin-top: 0;
  overflow: hidden;
  color: #eef2f9;
  background-color: #0a0b0d;
  background-image:
    radial-gradient(circle at 82% 18%, rgba(77, 91, 255, 0.32), transparent 34%),
    linear-gradient(115deg, #07080b 0%, #0a0b0d 62%, #0e1220 100%);
  border: 1px solid #1b2230;
  border-radius: calc(var(--cq-radius-lg) + 2px);
  isolation: isolate;
}

.cq-qday__clock::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 54px 54px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.85), transparent 78%);
}

.cq-qday__clock::after {
  content: "";
  position: absolute;
  right: clamp(18px, 3vw, 42px);
  top: clamp(18px, 3vw, 38px);
  width: clamp(14px, 2vw, 26px);
  height: clamp(14px, 2vw, 26px);
  border-top: 1px solid rgba(170, 182, 255, 0.7);
  border-right: 1px solid rgba(170, 182, 255, 0.7);
  pointer-events: none;
}

.cq-qday__clockrail {
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: linear-gradient(180deg, var(--cq-accent) 0%, #7f8dff 38%, transparent 100%);
  pointer-events: none;
}

.cq-qday__caption {
  max-width: 46ch;
  font-family: var(--cq-mono);
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.7;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: #aab4c6;
}

.cq-qday__figure {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px clamp(12px, 2vw, 24px);
}

.cq-qday__bits {
  font-family: var(--cq-display);
  font-size: clamp(6.5rem, 18vw, 13.5rem);
  font-weight: 500;
  line-height: 0.76;
  letter-spacing: -0.085em;
  color: #fff;
}

.cq-qday__unit {
  font-family: var(--cq-mono);
  font-size: clamp(0.72rem, 1vw, 0.86rem);
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #aab6ff;
}

.cq-qday__target {
  margin-top: -2px;
  padding-top: 13px;
  font-family: var(--cq-mono);
  font-size: 0.74rem;
  letter-spacing: 0.04em;
  color: #aab4c6;
  border-top: 1px solid #293143;
}

.cq-qday__note {
  max-width: 58ch;
  font-family: var(--cq-display);
  font-size: clamp(1.02rem, 1.35vw, 1.2rem);
  line-height: 1.55;
  color: #d5deec;
}

/* public record sheet --------------------------------------------------- */
.cq-qday__record {
  display: grid;
  gap: clamp(16px, 2vw, 22px);
  padding: clamp(20px, 3vw, 34px);
  border-top: 2px solid var(--cq-ink);
  box-shadow: none;
}

.cq-qday__record-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px 24px;
}

.cq-qday__recordtitle {
  max-width: 32ch;
}

.cq-qday__recordfigure {
  font-family: var(--cq-display);
  font-size: clamp(2.4rem, 4vw, 3.7rem);
  font-weight: 500;
  line-height: 0.85;
  letter-spacing: -0.05em;
  color: var(--cq-muted);
  text-decoration: line-through;
  text-decoration-thickness: 1px;
}

.cq-qday__record-body {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(16px, 2.4vw, 30px);
  padding-top: 2px;
}

.cq-qday__recordcopy {
  max-width: 52ch;
}

.cq-qday__recordnote {
  max-width: 78ch;
  padding-top: 13px;
  border-top: 1px solid var(--cq-line);
}

/* marginal brief -------------------------------------------------------- */
.cq-qday__rail {
  position: sticky;
  top: 104px;
  align-self: start;
}

.cq-qday__brief {
  display: grid;
  gap: 20px;
  padding: clamp(19px, 2.2vw, 26px);
  overflow: hidden;
  background: var(--cq-sheet);
  border-top: 2px solid var(--cq-accent);
}

.cq-qday__briefmark {
  width: 32px;
  height: 2px;
  background: var(--cq-ink);
}

.cq-qday__briefcopy {
  color: var(--cq-ink-soft);
  font-size: 0.97rem;
  line-height: 1.65;
}

.cq-qday__cta {
  width: 100%;
}

/* hairline sections ----------------------------------------------------- */
.cq-qday__sections {
  border-top: 1px solid var(--cq-line);
}

.cq-qday__section {
  display: grid;
  gap: clamp(20px, 3vw, 34px);
  padding: clamp(30px, 4vw, 52px) 0;
  border-bottom: 1px solid var(--cq-line);
}

.cq-qday__laddersec {
  scroll-margin-top: 118px;
}

.cq-qday__sectionhead {
  display: grid;
  grid-template-columns: minmax(0, 0.64fr) minmax(0, 1.36fr);
  align-items: end;
  gap: 16px clamp(26px, 4vw, 62px);
}

.cq-qday__sectionhead--slim {
  grid-template-columns: minmax(0, 1fr);
}

.cq-qday__sectionintro {
  max-width: 68ch;
  justify-self: end;
}

.cq-qday__sectiontitle {
  max-width: 16ch;
}

.cq-qday__ladder {
  display: grid;
  border-top: 1px solid var(--cq-line-strong);
}

.cq-qday__ladder > li {
  min-width: 0;
}

/* hardware rows --------------------------------------------------------- */
.cq-qday__runs {
  display: grid;
  border-top: 1px solid var(--cq-line-strong);
}

.cq-qday__run {
  display: grid;
  grid-template-columns: minmax(8rem, 0.8fr) minmax(0, 1.5fr) auto auto;
  align-items: center;
  gap: 10px 22px;
  padding: 16px 2px;
  border-bottom: 1px solid var(--cq-line);
}

.cq-qday__runkey {
  min-width: 0;
}

.cq-qday__runmeta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  min-width: 0;
}

.cq-qday__runat {
  justify-self: end;
  white-space: nowrap;
}

.cq-qday__empty {
  max-width: 78ch;
}

/* rules ----------------------------------------------------------------- */
.cq-qday__rules {
  display: grid;
  border-top: 1px solid var(--cq-line-strong);
}

.cq-qday__rule {
  display: grid;
  grid-template-columns: 3.4rem minmax(0, 1fr);
  gap: 16px;
  padding: 20px 2px;
  border-bottom: 1px solid var(--cq-line);
}

.cq-qday__rulenum {
  padding-top: 3px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--cq-accent-text);
}

.cq-qday__rulecopy {
  display: grid;
  gap: 7px;
  max-width: 78ch;
  min-width: 0;
}

/* token rows ------------------------------------------------------------ */
.cq-qday__tokens {
  display: grid;
  border-top: 1px solid var(--cq-line-strong);
}

.cq-qday__token {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 2px;
  border-bottom: 1px solid var(--cq-line);
}

.cq-qday__tokenicon {
  color: var(--cq-accent-text);
}

.cq-qday__tokencopy {
  display: grid;
  gap: 2px;
}

/* responsive ------------------------------------------------------------ */
@media (max-width: 960px) {
  .cq-qday__rail {
    position: static;
  }

  .cq-qday__edge {
    align-items: flex-start;
  }
}

@media (max-width: 760px) {
  .cq-qday__record-body,
  .cq-qday__sectionhead {
    grid-template-columns: minmax(0, 1fr);
  }

  .cq-qday__sectionintro {
    justify-self: start;
  }

  .cq-qday__run {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
  }

  .cq-qday__runmeta {
    grid-column: 1 / -1;
  }

  .cq-qday__runat {
    justify-self: start;
  }
}

@media (max-width: 560px) {
  .cq-qday__clock {
    padding: 24px 22px 28px;
  }

  .cq-qday__bits {
    font-size: clamp(5.8rem, 30vw, 8.5rem);
  }

  .cq-qday__record {
    padding: 19px 18px 22px;
  }

  .cq-qday__rule {
    grid-template-columns: minmax(0, 1fr);
    gap: 6px;
  }
}
</style>
