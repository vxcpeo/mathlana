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
import PanelCard from "@/components/ui/PanelCard.vue";
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
    tone: "pp-tone-warn",
    title: "Key public",
    body: "The public key is on chain, or is the address itself.",
  },
  {
    key: "hidden",
    icon: "eye-off",
    tone: "pp-tone-accent",
    title: "Key hidden",
    body: "The key is still behind a hash: it shows only when the address signs.",
  },
  {
    key: "noKey",
    icon: "code-xml",
    tone: "pp-tone-muted",
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
  error.value || preview.value.problems.length ? "pp-tone-alert" : "pp-tone-muted",
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
  <div class="pp-page">
    <div class="pp-head">
      <p class="pp-kicker">Exposure check</p>
      <h1 class="pp-runhead">Is your money behind a public key?</h1>
      <p class="pp-lede">
        If the math behind wallet signatures weakens, through quantum computers or AI-accelerated
        math, coins behind a public key are the first within reach. Paste a wallet to see how much
        sits where, and the one calm step that fits.
      </p>
    </div>

    <div class="pp-stage pp-expo">
      <div class="pp-wide">
        <form novalidate class="pp-sheet pp-expo__form" @submit.prevent="check">
          <div class="pp-sheet__head pp-expo__formhead">
            <span aria-hidden="true" class="pp-art pp-sheet__art pp-expo__formart">
              <FormArt />
            </span>
            <div class="pp-sheet__head-row">
              <Icon name="wallet" :size="16" class="pp-tone-accent" />
              <h2 class="pp-sheet__title">Check a wallet</h2>
            </div>
            <p class="pp-sheet__sub">
              Addresses of Bitcoin, Ethereum or Solana, one per line, or a Bitcoin wallet's xpub,
              ypub or zpub.
            </p>
          </div>

          <div class="pp-sheet__body pp-expo__body">
            <label for="wallet" class="sr-only">Addresses or a wallet key</label>
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
              class="pp-textarea pp-expo__paste"
              @input="error = ''"
            ></textarea>

            <div class="pp-expo__actions">
              <p id="wallet-hint" aria-live="polite" class="pp-expo__hint" :class="hintTone">
                {{ hint }}
              </p>
              <div class="pp-inline pp-expo__buttons">
                <AppButton
                  v-if="raw.trim() || checked"
                  variant="outline"
                  @click="clear"
                >
                  Clear
                </AppButton>
                <AppButton type="submit">Check</AppButton>
              </div>
            </div>
          </div>

          <p id="wallet-privacy" class="pp-sheet__foot pp-expo__privacy">
            <Icon name="shield-check" :size="14" class="pp-expo__privacyicon" />
            Read-only. Nothing is saved or logged, and no wallet or signature is asked for.
          </p>
        </form>

        <ExposureResults v-if="checked" :result="checked" />

        <section class="pp-sheet pp-expo__legend">
          <div class="pp-sheet__head">
            <h2 class="pp-sheet__title">What the answer can be</h2>
          </div>
          <ul class="pp-expo__legendlist">
            <li v-for="item in LEGEND" :key="item.key" class="pp-expo__legenditem">
              <Icon :name="item.icon" :size="16" class="pp-expo__legendicon" :class="item.tone" />
              <div class="pp-expo__legendcopy">
                <p class="pp-h3">{{ item.title }}</p>
                <p class="pp-small">{{ item.body }}</p>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <div class="pp-margin pp-expo__aside">
        <PanelCard class="pp-expo__panel">
          <template #art>
            <span aria-hidden="true" class="pp-art pp-expo__closeart">
              <CloseArt />
            </span>
          </template>

          <template #header>
            <div class="pp-sheet__head-row">
              <QuantumMark class="pp-expo__qm" />
              <h2 class="pp-sheet__title">How close it is</h2>
            </div>
            <p class="pp-sheet__sub">
              Two public measures of the quantum threat to today's keys, read live.
            </p>
          </template>

          <ul class="pp-ledger pp-expo__measures">
            <li>
              <RouterLink
                to="/q-day"
                :aria-label="`Q-Day clock: ${clockBits} of ${clockTarget} bits. Open`"
                class="pp-expo__measure pp-reveal"
              >
                <QuantumMark class="pp-expo__qm" />
                <span class="pp-expo__mtext">
                  <span class="pp-expo__mname">Q-Day clock</span>
                  <span class="pp-expo__mdesc"
                    >The biggest key a real quantum computer has broken, under the strict check</span
                  >
                </span>
                <Icon name="arrow-up-right" :size="14" class="pp-expo__mgo" />
                <span class="pp-expo__mfig">
                  <span class="pp-expo__mnum">
                    <span class="pp-expo__figure pp-num">{{ clockBits }}</span>
                    <span class="pp-tiny">of {{ clockTarget }} bits</span>
                  </span>
                  <span aria-hidden="true" class="pp-meter pp-expo__meter">
                    <span
                      class="pp-meter__fill"
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
                class="pp-expo__measure pp-reveal"
              >
                <Icon name="cpu" :size="16" class="pp-expo__qm" />
                <span class="pp-expo__mtext">
                  <span class="pp-expo__mname">ECDSA.fail</span>
                  <span class="pp-expo__mdesc"
                    >The smallest known quantum circuit that breaks a Bitcoin key</span
                  >
                </span>
                <Icon name="arrow-up-right" :size="14" class="pp-expo__mgo" />
                <span class="pp-expo__mfig">
                  <span class="pp-expo__mnum">
                    <span class="pp-expo__figure pp-num">{{ circuitValue }}</span>
                    <span class="pp-tiny">qubits × Toffoli</span>
                  </span>
                  <span aria-hidden="true" class="pp-meter pp-expo__meter">
                    <span
                      class="pp-meter__fill"
                      :style="{ width: `${Math.round(CIRCUIT?.progress ?? 0)}%` }"
                    />
                  </span>
                  <span class="pp-expo__delta"
                    >{{ CIRCUIT?.improvementLabel ?? "88.1% smaller" }} than at the start</span
                  >
                </span>
              </RouterLink>
            </li>
          </ul>

          <p class="pp-sheet__foot pp-tiny pp-expo__asidefoot">
            Neither is a date. Both show which way the work is moving.
          </p>
        </PanelCard>
      </div>
    </div>

    <section class="pp-sec pp-expo__chains">
      <div class="pp-sec__head">
        <h2 class="pp-h4">How it reads each chain</h2>
      </div>
      <ol class="pp-grid pp-grid--3 pp-expo__chainlist">
        <li v-for="note in CHAIN_NOTES" :key="note.n" class="pp-expo__chainrow">
          <span class="pp-index pp-expo__no">{{ note.n }}</span>
          <div class="pp-expo__chaincopy">
            <h3 class="pp-h3">{{ note.title }}</h3>
            <p class="pp-small">{{ note.body }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="pp-sec">
      <div class="pp-grid pp-grid--3">
        <div v-for="note in FOOTNOTES" :key="note.title" class="pp-expo__footnote">
          <h2 class="pp-h3">{{ note.title }}</h2>
          <p class="pp-small">{{ note.body }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.pp-expo {
  align-items: start;
}

/* form ---------------------------------------------------------------- */
.pp-expo__form {
  min-width: 0;
}

.pp-expo__formhead {
  position: relative;
  overflow: clip;
}

.pp-expo__formart {
  opacity: 0.4;
}

.pp-expo__closeart {
  opacity: 0.4;
}

.pp-expo__panel .pp-expo__closeart {
  position: absolute;
  top: 0;
  right: 0;
  width: 64%;
  height: 104px;
  overflow: clip;
  pointer-events: none;
}

.pp-expo__body {
  gap: var(--pp-t2);
}

.pp-expo__paste {
  min-height: 96px;
  font-family: var(--pp-mono);
  font-size: 0.86rem;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.pp-expo__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 16px;
}

.pp-expo__hint {
  min-width: 0;
  min-height: 20px;
  font-size: 0.8rem;
  line-height: 1.5;
  text-wrap: pretty;
  overflow-wrap: anywhere;
}

.pp-expo__buttons {
  margin-left: auto;
}

.pp-expo__privacy {
  gap: 7px;
  font-size: 0.76rem;
  line-height: 1.5;
  color: var(--pp-muted);
}

.pp-expo__privacyicon {
  flex: 0 0 auto;
  margin-top: 2px;
  color: var(--pp-muted);
}

/* legend -------------------------------------------------------------- */
.pp-expo__legend {
  min-width: 0;
}

.pp-expo__legendlist {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  min-width: 0;
}

.pp-expo__legenditem {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  min-width: 0;
  padding: 14px 22px;
  border-left: 1px solid var(--pp-line-soft);
}

.pp-expo__legenditem:first-child {
  border-left: 0;
}

.pp-expo__legendicon {
  flex: 0 0 auto;
  margin-top: 3px;
}

.pp-expo__legendcopy {
  display: grid;
  gap: 2px;
  min-width: 0;
}

/* aside --------------------------------------------------------------- */
.pp-expo__aside {
  align-content: start;
}

.pp-expo__panel {
  min-width: 0;
}

.pp-expo__measures {
  min-width: 0;
}

.pp-expo__measure {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  align-items: start;
  gap: 4px 10px;
  min-width: 0;
  padding: 12px 18px;
  border-bottom: 1px solid var(--pp-line-soft);
}

.pp-expo__measure:last-child {
  border-bottom: 0;
}

.pp-expo__qm {
  color: var(--pp-accent-text);
}

.pp-expo__mtext {
  grid-column: 2;
  display: grid;
  gap: 2px;
  min-width: 0;
}

.pp-expo__mname {
  font-family: var(--pp-display);
  font-size: 0.9rem;
  font-weight: 620;
  letter-spacing: -0.01em;
  color: var(--pp-ink);
}

.pp-expo__mdesc {
  font-size: 0.74rem;
  line-height: 1.45;
  color: var(--pp-muted);
  overflow-wrap: anywhere;
}

.pp-expo__mgo {
  grid-column: 3;
  margin-top: 2px;
  color: var(--pp-muted);
}

.pp-expo__mfig {
  grid-column: 2 / -1;
  display: grid;
  gap: 6px;
  min-width: 0;
  margin-top: 6px;
}

.pp-expo__mnum {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px;
}

.pp-expo__figure {
  font-size: 1rem;
  color: var(--pp-ink);
}

.pp-expo__meter {
  display: block;
  height: 5px;
}

.pp-expo__delta {
  font-family: var(--pp-mono);
  font-size: 0.68rem;
  color: var(--pp-muted);
}

.pp-expo__asidefoot {
  font-size: 0.74rem;
  color: var(--pp-muted);
}

/* chain notes --------------------------------------------------------- */
.pp-expo__chains {
  min-width: 0;
}

.pp-expo__chainlist {
  min-width: 0;
}

.pp-expo__chainrow {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  align-content: start;
  gap: 4px 10px;
  padding-top: var(--pp-t2);
  border-top: 1px solid var(--pp-line);
}

.pp-expo__no {
  padding-top: 2px;
  color: var(--pp-accent-text);
}

.pp-expo__chaincopy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

/* footnotes ----------------------------------------------------------- */
.pp-expo__footnote {
  display: grid;
  gap: 6px;
  align-content: start;
  min-width: 0;
}

@media (max-width: 1180px) {
  .pp-expo__aside {
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
  }
}

@media (max-width: 700px) {
  .pp-expo__legendlist {
    grid-template-columns: minmax(0, 1fr);
  }

  .pp-expo__legenditem {
    border-left: 0;
    border-top: 1px solid var(--pp-line-soft);
  }

  .pp-expo__legenditem:first-child {
    border-top: 0;
  }
}

@media (min-width: 1181px) {
  .pp-expo {
    grid-template-columns: minmax(0, 1.45fr) minmax(290px, 0.55fr);
  }
}
</style>
