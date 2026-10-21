<script setup>
/**
 * `/about` — reproduced 1:1 from the reference page.
 *
 * Section order: hero → "Two threats, one target: your keys" (quantum +
 * AI-accelerated math cards, with the live machine chips) → "How Mathlana works
 * on them" → "The calm response" / "What it does not promise".
 *
 * The acknowledgements and the standing disclaimers live in the site footer
 * (`AppFooter.vue`), exactly as on the reference.
 */
import { computed } from "vue";
import { RouterLink } from "vue-router";
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
    body: "A result shows as checked by Mathlana within minutes, and as officially verified once the challenge's own checker passes it.",
  },
];

const NOT_PROMISED = [
  "Research may find nothing: records move in small steps, against strong solvers.",
  "A token promises no return. Its fees pay for research, not for its holders.",
  "Mathlana is not affiliated with the Ethereum Foundation, Yukon or any challenge's organizers. Their checkers and leaderboards are the authority.",
];

const ROW_LINK =
  "grid grid-cols-[1.125rem_minmax(0,1fr)_auto] items-start gap-x-3 px-5 py-3.5 group/row transition-colors outline-none hover:bg-accent/50 focus-visible:bg-accent/50";
const ROW_STATIC =
  "grid grid-cols-[1.125rem_minmax(0,1fr)_auto] items-start gap-x-3 px-5 py-3.5";
const ROW_ARROW =
  "mt-0.5 size-3.5 text-muted-foreground transition-colors group-hover/row:text-brand-text";
const HEAD_ICON = "shrink-0 mt-0.5 size-4 text-brand-text";
const STATIC_ICON = "shrink-0 mt-0.5 size-4 text-muted-foreground";
const GROUP_LABEL =
  "border-b bg-muted/40 px-5 py-1.5 text-[0.72rem] font-medium text-muted-foreground";
const ROW_TITLE = "truncate font-heading text-sm font-semibold tracking-[-0.01em]";
const ROW_SUB = "text-xs text-pretty text-muted-foreground";
const STATUS_BRAND =
  "rounded-md border px-1.5 text-[0.68rem] leading-5 whitespace-nowrap border-brand-border text-brand-text";
const STATUS_QUIET =
  "rounded-md border px-1.5 text-[0.68rem] leading-5 whitespace-nowrap text-muted-foreground";
</script>

<template>
  <div class="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 sm:py-14">
    <header class="flex max-w-3xl flex-col gap-3">
      <p class="text-sm font-medium text-brand-text">About</p>
      <h1 class="headline text-3xl text-balance sm:text-4xl">About Mathlana</h1>
      <p class="text-base text-pretty text-muted-foreground sm:text-lg">
        Quantum computers and AI-accelerated math are closing in on the math that guards
        crypto wallets. Mathlana measures how close, in public, and funds the work on the
        way out.
      </p>
    </header>

    <section class="flex flex-col gap-5">
      <div class="flex max-w-2xl flex-col gap-1.5">
        <h2 class="headline text-2xl sm:text-3xl">Two threats, one target: your keys</h2>
        <p class="text-sm text-pretty text-muted-foreground">
          Bitcoin, Ethereum and Solana sign with elliptic curves. Two forces could break
          them, and Mathlana works on both.
        </p>
      </div>

      <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <!-- Quantum computers -->
        <article class="group flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card">
          <div class="relative overflow-hidden border-b px-5 py-4">
            <span
              aria-hidden="true"
              class="pointer-events-none absolute -top-8 -right-8 bottom-1 flex items-center text-brand opacity-45 transition-[opacity,transform] duration-500 ease-out group-hover:-rotate-2 group-hover:opacity-80 motion-reduce:transition-none max-sm:hidden"
            >
              <CardArt name="orbit" class="h-full" />
            </span>
            <h3
              class="relative flex items-center gap-2 font-heading text-base font-semibold tracking-[-0.01em]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                aria-hidden="true"
                class="shrink-0 size-4 text-brand-text"
              >
                <circle cx="12" cy="12" r="9" />
                <ellipse cx="12" cy="12" rx="9" ry="3.2" stroke-dasharray="2 2.4" />
                <path d="M12 3v18" stroke-opacity="0.45" />
                <path d="M12 12l4.6-5.4" />
                <circle cx="16.6" cy="6.6" r="1.6" fill="currentColor" stroke="none" />
              </svg>
              Quantum computers
            </h3>
            <p
              class="relative mt-0.5 max-w-[60%] text-[0.8rem] text-pretty text-muted-foreground sm:max-w-[65%]"
            >
              Shor's algorithm against crypto wallet keys
            </p>
          </div>

          <p
            class="border-b px-5 py-3.5 text-[0.82rem] leading-relaxed text-pretty text-muted-foreground"
          >
            A large enough quantum computer runs Shor's algorithm and reads a private key
            from its public key. Mathlana runs that attack on real quantum computers today,
            and measures how small the machine that breaks a real key could be.
          </p>

          <ul class="flex flex-col divide-y">
            <li>
              <RouterLink to="/q-day" aria-label="Q-Day. Open" :class="ROW_LINK">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  aria-hidden="true"
                  :class="HEAD_ICON"
                >
                  <circle cx="12" cy="12" r="9" />
                  <ellipse cx="12" cy="12" rx="9" ry="3.2" stroke-dasharray="2 2.4" />
                  <path d="M12 3v18" stroke-opacity="0.45" />
                  <path d="M12 12l4.6-5.4" />
                  <circle cx="16.6" cy="6.6" r="1.6" fill="currentColor" stroke="none" />
                </svg>
                <span class="flex min-w-0 flex-col gap-0.5">
                  <span :class="ROW_TITLE">Q-Day</span>
                  <span :class="ROW_SUB"
                    >Shor's attack on practice keys, run on real quantum computers under a
                    strict check.</span
                  >
                </span>
                <Icon name="arrow-up-right" :class="ROW_ARROW" />
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/challenges/ecdsa-fail"
                aria-label="ECDSA.fail. Open"
                :class="ROW_LINK"
              >
                <Icon name="cpu" :class="HEAD_ICON" />
                <span class="flex min-w-0 flex-col gap-0.5">
                  <span :class="ROW_TITLE">ECDSA.fail</span>
                  <span :class="ROW_SUB"
                    >The smallest known circuit that breaks a Bitcoin key, and how fast it
                    shrinks.</span
                  >
                </span>
                <Icon name="arrow-up-right" :class="ROW_ARROW" />
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/tokens" aria-label="Live quantum tasks. Open" :class="ROW_LINK">
                <Icon name="atom" :class="HEAD_ICON" />
                <span class="flex min-w-0 flex-col gap-0.5">
                  <span :class="ROW_TITLE">Live quantum tasks</span>
                  <span :class="ROW_SUB"
                    >A token's chat pushes any task to IBM, IQM or IonQ, and shows the
                    machine's answer.</span
                  >
                </span>
                <Icon name="arrow-up-right" :class="ROW_ARROW" />
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/launch" aria-label="Quantum-drawn picture. Open" :class="ROW_LINK">
                <Icon name="image" :class="HEAD_ICON" />
                <span class="flex min-w-0 flex-col gap-0.5">
                  <span :class="ROW_TITLE">Quantum-drawn picture</span>
                  <span :class="ROW_SUB"
                    >A token's image, redrawn 1:1 by a real quantum computer.</span
                  >
                </span>
                <Icon name="arrow-up-right" :class="ROW_ARROW" />
              </RouterLink>
            </li>
          </ul>

          <div class="border-t px-5 py-3.5 empty:hidden">
            <MachineChips :machines="machines" />
          </div>
        </article>

        <!-- AI-accelerated math -->
        <article class="group flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card">
          <div class="relative overflow-hidden border-b px-5 py-4">
            <span
              aria-hidden="true"
              class="pointer-events-none absolute -top-8 -right-8 bottom-1 flex items-center text-brand opacity-45 transition-[opacity,transform] duration-500 ease-out group-hover:-rotate-2 group-hover:opacity-80 motion-reduce:transition-none max-sm:hidden"
            >
              <span class="block h-[72%] w-auto translate-y-3 -rotate-[8deg]">
                <CardArt name="figure" class="h-full" />
              </span>
            </span>
            <h3
              class="relative flex items-center gap-2 font-heading text-base font-semibold tracking-[-0.01em]"
            >
              <Icon name="sigma" class="size-4 text-brand-text" />
              AI-accelerated math
            </h3>
            <p
              class="relative mt-0.5 max-w-[60%] text-[0.8rem] text-pretty text-muted-foreground sm:max-w-[65%]"
            >
              Years of math in months: the risks and the way out
            </p>
          </div>

          <p
            class="border-b px-5 py-3.5 text-[0.82rem] leading-relaxed text-pretty text-muted-foreground"
          >
            AI is starting to find new math fast. Elliptic curves and lattices have
            structure that new math can exploit, so they may fall sooner than planned,
            possibly before quantum computers. Hashes have no such structure: hash-based
            cryptography with machine-checked proofs is the way out.
          </p>

          <ul class="flex flex-col divide-y">
            <li>
              <p :class="GROUP_LABEL">Hash-based: the way out</p>
              <ul class="flex flex-col divide-y">
                <li>
                  <RouterLink
                    to="/challenges/sig-golf"
                    aria-label="sig.golf. Open"
                    :class="ROW_LINK"
                  >
                    <Icon name="signature" :class="HEAD_ICON" />
                    <span class="flex min-w-0 flex-col gap-0.5">
                      <span :class="ROW_TITLE">sig.golf</span>
                      <span :class="ROW_SUB">Hash-based signatures, made smaller.</span>
                    </span>
                    <Icon name="arrow-up-right" :class="ROW_ARROW" />
                  </RouterLink>
                </li>
                <li>
                  <RouterLink
                    to="/challenges/proximity"
                    aria-label="The Proximity Prize. Open"
                    :class="ROW_LINK"
                  >
                    <Icon name="sigma" :class="HEAD_ICON" />
                    <span class="flex min-w-0 flex-col gap-0.5">
                      <span :class="ROW_TITLE">The Proximity Prize</span>
                      <span :class="ROW_SUB"
                        >How sound hash-based proof systems are, proven.</span
                      >
                    </span>
                    <Icon name="arrow-up-right" :class="ROW_ARROW" />
                  </RouterLink>
                </li>
                <li>
                  <div :class="ROW_STATIC">
                    <Icon name="shield" :class="STATIC_ICON" />
                    <span class="flex min-w-0 flex-col gap-0.5">
                      <span :class="ROW_TITLE">precompile.fast</span>
                      <span :class="ROW_SUB">The EVM's cryptography, proven correct.</span>
                    </span>
                    <span :class="STATUS_BRAND">Next</span>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p :class="GROUP_LABEL">Lattices (ML-DSA, FHE): the new risk</p>
              <ul class="flex flex-col divide-y">
                <li>
                  <div :class="ROW_STATIC">
                    <Icon name="crosshair" :class="STATIC_ICON" />
                    <span class="flex min-w-0 flex-col gap-0.5">
                      <span :class="ROW_TITLE">Lattice records</span>
                      <span :class="ROW_SUB">Once a public venue checks them by machine.</span>
                    </span>
                    <span :class="STATUS_QUIET">Later</span>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </article>
      </div>
    </section>

    <section class="overflow-hidden rounded-xl border bg-card">
      <h2
        class="border-b px-5 py-3 font-heading text-base font-semibold tracking-[-0.01em] sm:px-6"
      >
        How Mathlana works on them
      </h2>
      <ol class="grid grid-cols-1 divide-y lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        <li
          v-for="step in STEPS"
          :key="step.n"
          class="relative flex flex-col gap-1.5 px-5 pt-5 pb-4 sm:px-6"
        >
          <span aria-hidden="true" class="absolute inset-x-0 top-0 h-px bg-brand-border" />
          <span
            aria-hidden="true"
            class="absolute top-0 left-5 size-2 -translate-y-1/2 rounded-full bg-brand sm:left-6"
          />
          <span class="font-mono text-xs text-brand-text figures">{{ step.n }}</span>
          <h3 class="font-heading text-sm font-semibold tracking-[-0.01em]">{{ step.title }}</h3>
          <p class="text-[0.82rem] leading-relaxed text-pretty text-muted-foreground">
            {{ step.body }}
          </p>
        </li>
      </ol>
    </section>

    <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
      <section class="flex flex-col gap-2 rounded-xl border bg-card px-5 py-4">
        <h2 class="font-heading text-base font-semibold tracking-[-0.01em]">
          The calm response
        </h2>
        <p class="text-[0.82rem] leading-relaxed text-pretty text-muted-foreground">
          Keep savings at fresh addresses, whose keys stay hidden until they sign. Never
          rush a migration: hurried moves are where funds are most often lost.
        </p>
        <RouterLink
          to="/exposure"
          class="group/go flex w-fit items-center gap-1 pt-1 text-[0.82rem] font-medium text-brand-text outline-none hover:underline focus-visible:underline"
        >
          Check a wallet
          <Icon
            name="arrow-right"
            :stroke-width="1.75"
            class="size-3.5 transition-transform group-hover/go:translate-x-0.5"
          />
        </RouterLink>
      </section>

      <section class="flex flex-col gap-2 rounded-xl border border-dashed px-5 py-4">
        <h2 class="font-heading text-base font-semibold tracking-[-0.01em]">
          What it does not promise
        </h2>
        <ul class="flex flex-col gap-1.5">
          <li
            v-for="line in NOT_PROMISED"
            :key="line"
            class="flex gap-2.5 text-[0.82rem] leading-relaxed text-pretty text-muted-foreground"
          >
            <span aria-hidden="true" class="mt-[0.6rem] size-1 shrink-0 rounded-full bg-quiet" />
            {{ line }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
