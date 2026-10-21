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
    art: "orbit",
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
  <section class="relative overflow-hidden border-b">
    <div
      class="mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-8 px-4 sm:px-6 lg:grid-cols-[1.618fr_1fr]"
    >
      <!-- Copy column -->
      <div class="flex min-w-0 flex-col gap-6 py-14 sm:py-20 lg:py-24">
        <p
          class="flex items-center gap-2 text-[0.78rem] whitespace-nowrap text-muted-foreground min-[400px]:text-sm"
        >
          <span aria-hidden="true" class="size-1.5 shrink-0 rounded-full bg-brand" />
          <span
            ><span class="font-medium text-brand-text">AI</span> and
            <span class="font-medium text-brand-text">quantum</span> vs. crypto keys, on
            Solana</span
          >
        </p>

        <h1 class="headline text-[clamp(1.15rem,6vw,2.8rem)] xl:text-[3.4rem]">
          <span class="block whitespace-nowrap text-foreground">Bitcoin, Ethereum, Solana.</span>
          <span class="block whitespace-nowrap text-quiet">When do their wallets break?</span>
        </h1>

        <p class="max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
          <span class="font-medium text-brand-text">AI</span> and
          <span class="font-medium text-brand-text">quantum computers</span> are closing in on
          the math that guards them. Mathlana measures how close, live.
        </p>

        <p class="-mt-2 max-w-xl text-base text-pretty text-foreground sm:text-lg">
          <RouterLink
            to="/tokens"
            class="font-semibold text-brand-text underline decoration-brand-border underline-offset-4 transition-colors outline-none hover:decoration-brand-text"
            >Run any task</RouterLink
          >
          on a <span class="font-medium text-brand-text">real quantum computer</span>, or
          <RouterLink
            to="/launch"
            class="font-semibold text-brand-text underline decoration-brand-border underline-offset-4 transition-colors outline-none hover:decoration-brand-text"
            >launch a token</RouterLink
          >
          with your picture redrawn 1:1 by one, with
          <span class="font-medium text-brand-text">proof of quantum</span>.
        </p>

        <div class="flex min-w-0 flex-col gap-2">
          <span class="text-[0.8rem] text-muted-foreground">Running quantum computers:</span>
          <div class="flex h-7 min-w-0 items-center gap-1.5 overflow-hidden">
            <a
              v-for="chip in SHOWN"
              :key="chip.maker + chip.model"
              :href="chip.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`${chip.maker} ${chip.model}, its official page (opens in a new tab)`"
              class="relative inline-flex h-7 shrink-0 items-center gap-2 overflow-hidden rounded-md border bg-card pr-7 pl-2.5 whitespace-nowrap transition-colors outline-none hover:border-brand-border focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <MachineLogo :maker="chip.maker" class="h-2.5 text-foreground" />
              <span class="text-[0.72rem] text-muted-foreground">{{ chip.model }}</span>
              <svg
                viewBox="0 0 40 40"
                aria-hidden="true"
                class="pointer-events-none absolute top-1/2 -right-2.5 size-7 -translate-y-1/2 text-brand"
              >
                <circle
                  v-for="(r, i) in [5, 9, 13, 17]"
                  :key="r"
                  cx="20"
                  cy="20"
                  :r="r"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1"
                  vector-effect="non-scaling-stroke"
                  :stroke-opacity="0.5 - 0.11 * i"
                />
                <circle cx="20" cy="20" r="2" fill="currentColor" fill-opacity="0.85" />
              </svg>
            </a>
            <span
              v-if="machineCount > SHOWN.length"
              class="inline-flex h-7 shrink-0 items-center rounded-md border bg-card px-2.5 text-[0.72rem] whitespace-nowrap text-muted-foreground"
              >+{{ machineCount - SHOWN.length }} more</span
            >
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <AppButton to="/launch" class="h-11 px-5 text-[0.95rem]">
            Launch a token
            <Icon name="arrow-right" />
          </AppButton>
          <AppButton to="/#how" variant="ghost" class="h-11 px-4 text-[0.95rem]">
            How it works
          </AppButton>
        </div>

        <ul aria-label="What you can do here" class="grid max-w-3xl gap-3 pt-2 sm:grid-cols-3">
          <li v-for="card in CARDS" :key="card.title">
            <RouterLink
              :to="card.to"
              class="group relative flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-colors outline-none hover:border-brand-border focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span class="relative block h-20 overflow-hidden sm:h-24">
                <span
                  aria-hidden="true"
                  class="pointer-events-none absolute -top-8 -right-8 bottom-1 flex items-center text-brand opacity-45 transition-[opacity,transform] duration-500 ease-out group-hover:-rotate-2 group-hover:opacity-80 motion-reduce:transition-none"
                >
                  <CardArt :name="card.art" class="h-full" />
                </span>
                <span
                  v-if="card.badge"
                  class="absolute top-4 left-4 flex items-center gap-1.5 text-[0.72rem] font-medium text-brand-text"
                >
                  <span aria-hidden="true" class="size-1.5 rounded-full bg-brand-text" />
                  {{ card.badge }}
                </span>
              </span>
              <span class="flex flex-1 flex-col gap-1.5 px-4 pb-4">
                <span class="font-heading text-base font-semibold text-foreground">{{
                  card.title
                }}</span>
                <span class="text-[0.82rem] leading-relaxed text-pretty text-muted-foreground">{{
                  card.body
                }}</span>
                <span
                  class="mt-auto flex items-center gap-1 pt-2 text-[0.82rem] font-medium text-brand-text"
                >
                  {{ card.cta }}
                  <Icon name="arrow-right" class="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Urania -->
      <div class="relative hidden h-full min-h-[26rem] self-stretch lg:block">
        <div
          class="pointer-events-none absolute inset-x-0 bottom-0 mx-auto aspect-[1584/2000] h-[min(36rem,100%)] w-auto select-none"
          aria-hidden="true"
        >
          <img
            src="/brand/urania-indigo.png"
            alt=""
            class="hidden size-full object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_58%,transparent_96%)] [-webkit-mask-image:linear-gradient(to_bottom,black_58%,transparent_96%)] dark:block"
          />
          <img
            src="/brand/urania-ink.png"
            alt=""
            class="size-full object-contain object-bottom opacity-80 [mask-image:linear-gradient(to_bottom,black_58%,transparent_96%)] [-webkit-mask-image:linear-gradient(to_bottom,black_58%,transparent_96%)] dark:hidden"
          />
        </div>
      </div>
    </div>
  </section>
</template>
