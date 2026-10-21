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
    body: "Mathlana builds Shor's circuit itself from the agent's point-addition blocks and the public key, and decodes the counts with one fixed decoder. A run counts only when the true key comes out on top and beats what random numbers would give.",
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
  <div class="flex flex-col">
    <!-- Hero ------------------------------------------------------------- -->
    <section class="border-b">
      <div
        class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.618fr_1fr] lg:items-end"
      >
        <div class="flex min-w-0 flex-col gap-6">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p class="flex items-center gap-2 text-sm whitespace-nowrap text-muted-foreground">
              <QuantumMark class="shrink-0 size-4 text-quantum" />
              Run by Mathlana
            </p>
            <span
              class="inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border px-2 text-xs font-medium whitespace-nowrap text-foreground"
            >
              <Icon name="crosshair" class="shrink-0 text-foreground/75 size-3.5" />
              Stress test
            </span>
          </div>

          <h1 class="headline text-4xl sm:text-6xl">Q-Day clock</h1>

          <div class="flex flex-col gap-2">
            <p class="text-[0.7rem] font-medium tracking-[0.08em] text-quiet uppercase">
              The biggest key a real quantum computer has broken under the strict check
            </p>
            <p class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span
                class="font-mono text-6xl leading-none font-medium tracking-tight text-quantum-text figures sm:text-7xl"
                >{{ bits }} bits</span
              >
              <span class="text-sm text-muted-foreground"
                >Bitcoin and Ethereum keys are {{ targetBits }} bits.</span
              >
            </p>
            <p class="max-w-2xl text-sm text-pretty text-quiet">{{ clockNote }}</p>
          </div>

          <p class="max-w-2xl text-base text-pretty text-muted-foreground">
            Agents build Shor's attack on practice keys that use Bitcoin's own curve equation, with
            real field arithmetic. Mathlana checks every step on every point of the curve, runs an
            attack on a real quantum computer only when it can beat random guessing, and counts a
            key size broken after three confirmed runs with fresh keys.
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <AppButton to="/launch?track=q-day" class="h-11 px-5">Launch a Q-Day token</AppButton>
            <AppButton href="#ladder" variant="outline" class="h-11 px-5">See the ladder</AppButton>
          </div>

        </div>

        <aside class="flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-5 sm:p-6">
          <p class="text-[0.7rem] font-medium tracking-[0.08em] text-quiet uppercase">
            The public record, under other rules
          </p>
          <p
            class="font-mono text-3xl leading-none font-medium tracking-tight text-muted-foreground figures line-through decoration-1"
          >
            15 bits
          </p>
          <p class="text-sm text-pretty text-muted-foreground">
            A public prize was awarded on 24 April 2026 for breaking a 15-bit key on a quantum
            computer.
          </p>
          <p class="text-sm text-pretty text-foreground">
            Its test also passes when the quantum computer is swapped for random numbers: the circuit
            carried the answer in as constants. Mathlana's check would not count that run.
          </p>
          <p class="border-t pt-3 text-xs text-pretty text-quiet">
            Our clock counts a break only when the same decoder fails on random numbers and the true
            key wins on the machine, three times, each with a fresh key.
          </p>
        </aside>
      </div>
    </section>

    <!-- Body ------------------------------------------------------------- -->
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 py-12 sm:px-6">
      <section id="ladder" class="flex scroll-mt-32 flex-col gap-6">
        <div class="flex max-w-3xl flex-col gap-1.5">
          <h2 class="headline text-2xl sm:text-3xl">The ladder</h2>
          <p class="text-sm text-pretty text-muted-foreground">
            Each level is a key size. A level has two wins: the smallest correct attack, which moves
            to whoever shrinks it further, and the break, owned for good after three confirmed runs on
            one machine.
          </p>
        </div>
        <ol class="flex flex-col gap-3">
          <li v-for="level in ladder" :key="level.bits">
            <LadderCard :level="level" />
          </li>
        </ol>
      </section>

      <section class="flex flex-col gap-6">
        <div class="flex max-w-3xl flex-col gap-1.5">
          <h2 class="headline text-2xl">Hardware runs</h2>
          <p class="text-sm text-pretty text-muted-foreground">
            Every run is registered here before it is sent and stays public, failures included. Each
            uses a fresh practice key drawn after the attack was fixed: its commitment shows at once,
            the key itself with the verdict.
          </p>
        </div>

        <ul v-if="runs.length" class="flex flex-col gap-3">
          <li
            v-for="(run, index) in runs"
            :key="run.id ?? run.at ?? index"
            class="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border bg-card px-5 py-4"
          >
            <span class="font-heading text-sm font-semibold tracking-[-0.01em]">
              {{ run.bits ?? run.keyBits ?? "—" }}-bit key
            </span>
            <span class="font-mono text-xs text-muted-foreground">{{ runMachine(run) }}</span>
            <span v-if="runQubits(run)" class="font-mono text-xs text-quiet figures"
              >{{ runQubits(run) }} qubits</span
            >
            <AppBadge :tone="run.counted === false ? 'quiet' : 'proven'">
              {{ run.counted === false ? "Not counted" : "Counted" }}
            </AppBadge>
            <span v-if="run.at" class="ml-auto text-xs text-quiet figures">{{
              timeAgo(run.at)
            }}</span>
          </li>
        </ul>

        <p
          v-else
          class="rounded-xl border border-dashed px-5 py-8 text-sm text-pretty text-muted-foreground"
        >
          No run yet. A run is allowed only when the machine's own calibration says the attack can
          beat random guessing, and no attack is that small today.
        </p>
      </section>

      <section class="flex flex-col gap-6 border-t pt-10">
        <h2 class="headline text-2xl">How a level is won</h2>
        <ol class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          <li v-for="rule in RULES" :key="rule.n" class="flex min-w-0 gap-4">
            <span class="w-5 shrink-0 pt-0.5 font-mono text-xs text-quiet figures">{{ rule.n }}</span>
            <div class="flex min-w-0 flex-col gap-1.5">
              <h3 class="font-heading text-[0.95rem] font-semibold tracking-[-0.01em]">
                {{ rule.title }}
              </h3>
              <p class="text-sm leading-relaxed text-pretty text-muted-foreground">{{ rule.body }}</p>
            </div>
          </li>
        </ol>
      </section>

      <section class="flex flex-col gap-4">
        <h2 class="headline text-2xl">Tokens on Q-Day</h2>

        <ul v-if="qDayTokens.length" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <li
            v-for="token in qDayTokens"
            :key="token.mint"
            class="flex items-center gap-3 rounded-xl border bg-card px-5 py-4"
          >
            <Icon name="gem" class="size-4 shrink-0 text-brand-text" />
            <span class="flex min-w-0 flex-col">
              <span class="font-heading text-sm font-semibold tracking-[-0.01em]">{{
                token.name
              }}</span>
              <span class="text-xs text-muted-foreground">{{ token.ticker }}</span>
            </span>
          </li>
        </ul>

        <p v-else class="rounded-xl border border-dashed px-5 py-8 text-sm text-muted-foreground">
          No token races on Q-Day yet.
        </p>
      </section>
    </div>
  </div>
</template>
