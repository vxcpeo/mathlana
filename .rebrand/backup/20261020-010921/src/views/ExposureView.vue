<script setup>
/**
 * /exposure — the wallet exposure check.
 *
 * The page, its copy and its spacing follow the reference's post-hydration DOM
 * (`_reference/netlog/exposure.dom.html`). The form is real: every pasted line
 * is decoded in the browser (Base58Check, Bech32/Bech32m, BIP-32 versions) and
 * classified, then the risk breakdown is drawn from that classification. No
 * request is made and nothing is stored.
 */
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import AppButton from "@/components/ui/AppButton.vue";
import Icon from "@/components/ui/Icon.vue";
import CloseArt from "@/components/exposure/CloseArt.vue";
import ExposureResults from "@/components/exposure/ExposureResults.vue";
import FormArt from "@/components/exposure/FormArt.vue";
import QuantumMark from "@/components/exposure/QuantumMark.vue";
import {
  CHAIN_LABELS,
  MAX_ADDRESSES,
  PROBLEM,
  TYPE_LABELS,
  analyse,
  readPaste,
} from "@/components/exposure/classify";
import { CHALLENGES } from "@/data/challenges";
import { useQuantumStatusReadonly } from "@/composables/useQuantumStatus";
import { group } from "@/lib/format";

const DEFAULT_HINT = `Up to ${MAX_ADDRESSES} addresses at a time, of any of the three chains.`;

/** `exposure.check.legend.*` */
const LEGEND = [
  {
    key: "public",
    icon: "eye",
    tone: "text-caution-text",
    title: "Key public",
    body: "The public key is on chain, or is the address itself.",
  },
  {
    key: "hidden",
    icon: "eye-off",
    tone: "text-brand-text",
    title: "Key hidden",
    body: "The key is still behind a hash: it shows only when the address signs.",
  },
  {
    key: "noKey",
    icon: "code-xml",
    tone: "text-quiet-text",
    title: "No key",
    body: "A contract or a program controls the address: there is no private key.",
  },
];

/** `exposure.check.chain.*` explainers, in reference order. */
const CHAIN_NOTES = [
  {
    n: "01",
    title: "Bitcoin",
    body: "Most addresses (starting with 1, 3 or bc1q) hold a hash of the key, and the key appears when the address spends. Taproot addresses (bc1p) and the earliest pay-to-public-key coins show the key from the start. A wallet key is walked address by address until 20 in a row have never received. History and balances come from mempool.space.",
  },
  {
    n: "02",
    title: "Ethereum",
    body: "An account's key appears with its first transaction, and with any message it signs. Contracts have no key of their own. It reads Ethereum mainnet: ether, wrapped ether, USDC and USDT.",
  },
  {
    n: "03",
    title: "Solana",
    body: "Every address is an Ed25519 public key, by design. Protection has to come from an upgrade of the network, not from a move you make today. Only SOL, USDC and USDT are read.",
  },
];

const FOOTNOTES = [
  {
    title: "Why the key matters",
    body: "Bitcoin, Ethereum and Solana sign with elliptic curves (ECDSA and Ed25519). Their safety rests on one assumption: that nobody can work back from a public key to its private key. If that assumption weakens, a key that is already public is the first one within reach.",
  },
  {
    title: "What we keep",
    body: "Nothing. What you paste reaches our server in the body of a request, never in a link. Lookups go out from our server, so your own connection never touches them. No database, no logs, no analytics, no wallet, no signature.",
  },
  {
    title: "Dollars, from the chain",
    body: "Prices come from Chainlink's feeds on Ethereum; USDC and USDT count at a dollar. Coins and the major stablecoins are counted, not other tokens or NFTs.",
  },
];

/* ------------------------------------------------------------------ *
 * Live measures in the aside
 * ------------------------------------------------------------------ */

const { state } = useQuantumStatusReadonly();

function metric(slug, index = 0) {
  return CHALLENGES.find((challenge) => challenge.slug === slug)?.metrics?.[index] ?? null;
}

const CLOCK = metric("q-day");
const CIRCUIT = metric("ecdsa-fail");

const clockBits = computed(() => {
  const runs = Array.isArray(state.value.runs) ? state.value.runs : [];
  const counted = runs
    .filter((run) => run?.counted !== false)
    .map((run) => Number(run?.bits ?? run?.keyBits ?? 0))
    .filter((bits) => bits > 0);
  return counted.length ? Math.max(...counted) : Number(CLOCK?.value ?? 0);
});
const clockTarget = computed(() => Number(CLOCK?.of ?? 256));
const circuitValue = computed(() => group(CIRCUIT?.value ?? 0));

/* ------------------------------------------------------------------ *
 * The form
 * ------------------------------------------------------------------ */

const raw = ref("");
const checked = ref(null);
const error = ref("");

/** A live read of the paste, so the hint answers before the button is pressed. */
const preview = computed(() => analyse(raw.value));

function describe(entry) {
  if (!entry) return "";
  if (entry.kind === "watch") {
    return `A Bitcoin wallet key (${entry.prefix}): every address it made is checked`;
  }
  if (entry.chain === "bitcoin") return `Bitcoin, ${TYPE_LABELS[entry.type] ?? "address"}`;
  if (entry.chain === "ethereum") return "Ethereum address";
  if (entry.chain === "solana") return "Solana address";
  return CHAIN_LABELS[entry.chain] ?? "";
}

const hint = computed(() => {
  if (error.value) return error.value;
  if (!raw.value.trim()) return DEFAULT_HINT;
  if (preview.value.problems.length) return preview.value.problems[0];
  const entries = preview.value.entries;
  if (entries.length === 1) return `Read as: ${describe(entries[0])}`;
  return `${entries.length} addresses to check`;
});

const hintTone = computed(() =>
  error.value || preview.value.problems.length ? "text-failed-text" : "text-muted-foreground",
);

function check() {
  error.value = "";
  if (!raw.value.trim()) {
    checked.value = null;
    error.value = PROBLEM.empty;
    return;
  }
  checked.value = readPaste(raw.value);
}

function clear() {
  raw.value = "";
  checked.value = null;
  error.value = "";
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-14">
    <header class="flex max-w-3xl flex-col gap-3">
      <p class="text-sm font-medium text-brand-text">Exposure check</p>
      <h1 class="headline text-3xl text-balance sm:text-4xl">Is your money behind a public key?</h1>
      <p class="text-sm text-pretty text-muted-foreground sm:text-base">
        If the math behind wallet signatures weakens, through quantum computers or AI-accelerated
        math, coins behind a public key are the first within reach. Paste a wallet to see how much
        sits where, and the one calm step that fits.
      </p>
    </header>

    <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.618fr_1fr]">
      <div class="min-w-0">
        <div class="flex flex-col gap-4">
          <form
            novalidate
            class="group overflow-hidden rounded-xl border bg-card"
            @submit.prevent="check"
          >
            <div class="relative overflow-hidden border-b px-5 py-4">
              <span
                aria-hidden="true"
                class="pointer-events-none absolute -top-8 -right-8 bottom-1 flex items-center text-brand opacity-45 transition-[opacity,transform] duration-500 ease-out group-hover:-rotate-2 group-hover:opacity-80 motion-reduce:transition-none max-sm:hidden"
              >
                <FormArt />
              </span>
              <h2
                class="relative flex items-center gap-2 font-heading text-base font-semibold tracking-[-0.01em]"
              >
                <Icon name="wallet" class="size-4 text-brand-text" />
                Check a wallet
              </h2>
              <p
                class="relative mt-0.5 text-[0.8rem] text-pretty text-muted-foreground sm:max-w-[62%]"
              >
                Addresses of Bitcoin, Ethereum or Solana, one per line, or a Bitcoin wallet's xpub,
                ypub or zpub.
              </p>
            </div>

            <div class="flex flex-col gap-3 p-4 sm:px-5">
              <label for="wallet" class="sr-only">Addresses or a wallet key</label>
              <div
                class="relative flex w-full min-w-0 items-center rounded-lg border border-input bg-background transition-colors outline-none focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30"
              >
                <textarea
                  id="wallet"
                  v-model="raw"
                  name="wallet"
                  rows="2"
                  placeholder="bc1q…, 0x…, a Solana address, or an xpub"
                  maxlength="2000"
                  autocomplete="off"
                  autocapitalize="none"
                  autocorrect="off"
                  spellcheck="false"
                  aria-describedby="wallet-hint wallet-privacy"
                  class="max-h-56 min-h-[4.25rem] w-full flex-1 resize-none rounded-lg border-0 bg-transparent px-3 py-2 font-mono text-base leading-relaxed break-all text-foreground outline-none placeholder:text-muted-foreground sm:text-sm dark:bg-transparent"
                  @input="error = ''"
                />
              </div>

              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p
                  id="wallet-hint"
                  aria-live="polite"
                  class="flex min-h-5 min-w-0 items-start gap-1.5 text-xs text-pretty"
                  :class="hintTone"
                >
                  {{ hint }}
                </p>
                <div class="flex shrink-0 gap-2">
                  <AppButton
                    v-if="raw.trim() || checked"
                    variant="outline"
                    class="h-10 px-4"
                    @click="clear"
                  >
                    Clear
                  </AppButton>
                  <AppButton type="submit" class="h-10 flex-1 px-5 sm:min-w-28 sm:flex-none">
                    Check
                  </AppButton>
                </div>
              </div>
            </div>

            <p
              id="wallet-privacy"
              class="flex items-start gap-1.5 border-t px-5 py-2.5 text-xs text-pretty text-muted-foreground"
            >
              <Icon name="shield-check" class="mt-px size-3.5 shrink-0 text-quiet" />
              Read-only. Nothing is saved or logged, and no wallet or signature is asked for.
            </p>
          </form>

          <ExposureResults v-if="checked" :result="checked" />

          <section class="overflow-hidden rounded-xl border border-dashed">
            <h2 class="border-b border-dashed px-5 py-2.5 text-xs font-medium text-muted-foreground">
              What the answer can be
            </h2>
            <ul
              class="grid grid-cols-1 divide-y divide-dashed sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            >
              <li v-for="item in LEGEND" :key="item.key" class="flex items-start gap-2.5 px-5 py-3.5">
                <Icon :name="item.icon" class="mt-0.5 size-4 shrink-0" :class="item.tone" />
                <div class="flex min-w-0 flex-col gap-0.5">
                  <p class="font-heading text-sm font-semibold tracking-[-0.01em]">
                    {{ item.title }}
                  </p>
                  <p class="text-xs leading-relaxed text-pretty text-muted-foreground">
                    {{ item.body }}
                  </p>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <aside class="flex min-w-0 flex-col gap-4 lg:sticky lg:top-28">
        <section class="group overflow-hidden rounded-xl border bg-card">
          <div class="relative overflow-hidden border-b px-5 py-4">
            <span
              aria-hidden="true"
              class="pointer-events-none absolute -top-8 -right-8 bottom-1 flex items-center text-brand opacity-45 transition-[opacity,transform] duration-500 ease-out group-hover:-rotate-2 group-hover:opacity-80 motion-reduce:transition-none"
            >
              <CloseArt />
            </span>
            <h2
              class="relative flex items-center gap-2 font-heading text-base font-semibold tracking-[-0.01em]"
            >
              <QuantumMark class="shrink-0 size-4 text-brand-text" />
              How close it is
            </h2>
            <p class="relative mt-0.5 max-w-[62%] text-[0.8rem] text-pretty text-muted-foreground">
              Two public measures of the quantum threat to today's keys, read live.
            </p>
          </div>

          <ul class="flex flex-col divide-y">
            <li>
              <RouterLink
                to="/q-day"
                :aria-label="`Q-Day clock: ${clockBits} of ${clockTarget} bits. Open`"
                class="group/row grid grid-cols-[1.125rem_minmax(0,1fr)_auto] items-start gap-x-3 px-5 py-3.5 transition-colors outline-none hover:bg-accent/50 focus-visible:bg-accent/50"
              >
                <QuantumMark class="shrink-0 mt-0.5 size-4 text-brand-text" />
                <span class="flex min-w-0 flex-col gap-0.5">
                  <span class="truncate font-heading text-sm font-semibold tracking-[-0.01em]"
                    >Q-Day clock</span
                  >
                  <span class="text-xs text-pretty text-muted-foreground"
                    >The biggest key a real quantum computer has broken, under the strict check</span
                  >
                </span>
                <Icon
                  name="arrow-up-right"
                  class="mt-0.5 size-3.5 text-muted-foreground transition-colors group-hover/row:text-brand-text"
                />
                <span class="col-span-2 col-start-2 mt-2.5 flex flex-col gap-1.5">
                  <span class="flex items-baseline gap-1.5 whitespace-nowrap">
                    <span
                      class="font-mono text-[0.95rem] leading-none font-medium text-foreground figures"
                      >{{ clockBits }}</span
                    >
                    <span class="text-xs text-muted-foreground">of {{ clockTarget }} bits</span>
                  </span>
                  <span aria-hidden="true" class="h-1 overflow-hidden rounded-full bg-muted">
                    <span
                      class="block h-full rounded-full bg-brand"
                      :style="{ width: `${clockTarget ? Math.round((clockBits / clockTarget) * 100) : 0}%` }"
                    />
                  </span>
                </span>
              </RouterLink>
            </li>

            <li>
              <RouterLink
                to="/challenges/ecdsa-fail"
                :aria-label="`ECDSA.fail: ${circuitValue} qubits × Toffoli. Open`"
                class="group/row grid grid-cols-[1.125rem_minmax(0,1fr)_auto] items-start gap-x-3 px-5 py-3.5 transition-colors outline-none hover:bg-accent/50 focus-visible:bg-accent/50"
              >
                <Icon name="cpu" class="mt-0.5 size-4 shrink-0 text-brand-text" />
                <span class="flex min-w-0 flex-col gap-0.5">
                  <span class="truncate font-heading text-sm font-semibold tracking-[-0.01em]"
                    >ECDSA.fail</span
                  >
                  <span class="text-xs text-pretty text-muted-foreground"
                    >The smallest known quantum circuit that breaks a Bitcoin key</span
                  >
                </span>
                <Icon
                  name="arrow-up-right"
                  class="mt-0.5 size-3.5 text-muted-foreground transition-colors group-hover/row:text-brand-text"
                />
                <span class="col-span-2 col-start-2 mt-2.5 flex flex-col gap-1.5">
                  <span class="flex items-baseline gap-1.5 whitespace-nowrap">
                    <span
                      class="font-mono text-[0.95rem] leading-none font-medium text-foreground figures"
                      >{{ circuitValue }}</span
                    >
                    <span class="text-xs text-muted-foreground">qubits × Toffoli</span>
                  </span>
                  <span aria-hidden="true" class="h-1 overflow-hidden rounded-full bg-muted">
                    <span
                      class="block h-full rounded-full bg-brand"
                      :style="{ width: `${Math.round(CIRCUIT?.progress ?? 0)}%` }"
                    />
                  </span>
                  <span class="text-[0.7rem] text-muted-foreground figures"
                    >{{ CIRCUIT?.improvementLabel ?? "88.1% smaller" }} than at the start</span
                  >
                </span>
              </RouterLink>
            </li>
          </ul>

          <p class="border-t px-5 py-2.5 text-[0.72rem] text-pretty text-quiet">
            Neither is a date. Both show which way the work is moving.
          </p>
        </section>

        <section class="overflow-hidden rounded-xl border bg-card">
          <h2 class="border-b px-5 py-2.5 font-heading text-sm font-semibold tracking-[-0.01em]">
            How it reads each chain
          </h2>
          <ol class="flex flex-col divide-y">
            <li
              v-for="note in CHAIN_NOTES"
              :key="note.n"
              class="grid grid-cols-[1.125rem_minmax(0,1fr)] gap-x-3 px-5 py-3"
            >
              <span class="pt-0.5 font-mono text-xs text-brand-text figures">{{ note.n }}</span>
              <div class="flex min-w-0 flex-col gap-0.5">
                <h3 class="font-heading text-sm font-semibold tracking-[-0.01em]">
                  {{ note.title }}
                </h3>
                <p class="text-xs leading-relaxed text-pretty text-muted-foreground">
                  {{ note.body }}
                </p>
              </div>
            </li>
          </ol>
        </section>
      </aside>
    </div>

    <section class="grid grid-cols-1 gap-6 border-t pt-8 md:grid-cols-3">
      <div v-for="note in FOOTNOTES" :key="note.title" class="flex min-w-0 flex-col gap-1.5">
        <h2 class="font-heading text-sm font-semibold tracking-[-0.01em]">{{ note.title }}</h2>
        <p class="text-[0.82rem] leading-relaxed text-pretty text-muted-foreground">
          {{ note.body }}
        </p>
      </div>
    </section>
  </div>
</template>
