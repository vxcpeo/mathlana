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
    tone: "cq-tone-warn",
    title: "Key public",
    body: "The public key is on chain, or is the address itself.",
  },
  {
    key: "hidden",
    icon: "eye-off",
    tone: "cq-tone-accent",
    title: "Key hidden",
    body: "The key is still behind a hash: it shows only when the address signs.",
  },
  {
    key: "noKey",
    icon: "code-xml",
    tone: "cq-tone-muted",
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
  error.value || preview.value.problems.length ? "cq-tone-alert" : "cq-tone-muted",
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
  <div class="cq-page cq-expo">
    <header class="cq-pagehead cq-expo__head">
      <div class="cq-pagehead__head">
        <p class="cq-kicker">Exposure check</p>
        <h1 class="cq-runhead cq-expo__title">Is your money behind a public key?</h1>
        <p class="cq-lede cq-expo__lede">
          If the math behind wallet signatures weakens, through quantum computers or AI-accelerated
          math, coins behind a public key are the first within reach. Paste a wallet to see how much
          sits where, and the one calm step that fits.
        </p>
      </div>

      <div class="cq-pagehead__edge cq-expo__headedge">
        <PanelCard class="cq-expo__panel">
          <template #art>
            <span aria-hidden="true" class="cq-expo__closeart">
              <CloseArt />
            </span>
          </template>

          <template #header>
            <div class="cq-sheet__head-row">
              <QuantumMark class="cq-expo__qm" />
              <h2 class="cq-sheet__title">How close it is</h2>
            </div>
            <p class="cq-sheet__sub">
              Two public measures of the quantum threat to today's keys, read live.
            </p>
          </template>

          <ul class="cq-expo__measures">
            <li>
              <RouterLink
                to="/q-day"
                :aria-label="`Q-Day clock: ${clockBits} of ${clockTarget} bits. Open`"
                class="cq-expo__measure"
              >
                <QuantumMark class="cq-expo__qm" />
                <span class="cq-expo__mtext">
                  <span class="cq-expo__mname">Q-Day clock</span>
                  <span class="cq-expo__mdesc"
                    >The biggest key a real quantum computer has broken, under the strict check</span
                  >
                </span>
                <Icon name="arrow-up-right" :size="14" class="cq-expo__mgo" />
                <span class="cq-expo__mfig">
                  <span class="cq-expo__mnum">
                    <span class="cq-expo__figure cq-num">{{ clockBits }}</span>
                    <span class="cq-tiny">of {{ clockTarget }} bits</span>
                  </span>
                  <span aria-hidden="true" class="cq-meter cq-expo__meter">
                    <span
                      class="cq-meter__fill"
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
                class="cq-expo__measure"
              >
                <Icon name="cpu" :size="16" class="cq-expo__qm" />
                <span class="cq-expo__mtext">
                  <span class="cq-expo__mname">ECDSA.fail</span>
                  <span class="cq-expo__mdesc"
                    >The smallest known quantum circuit that breaks a Bitcoin key</span
                  >
                </span>
                <Icon name="arrow-up-right" :size="14" class="cq-expo__mgo" />
                <span class="cq-expo__mfig">
                  <span class="cq-expo__mnum">
                    <span class="cq-expo__figure cq-num">{{ circuitValue }}</span>
                    <span class="cq-tiny">qubits × Toffoli</span>
                  </span>
                  <span aria-hidden="true" class="cq-meter cq-expo__meter">
                    <span
                      class="cq-meter__fill"
                      :style="{ width: `${Math.round(CIRCUIT?.progress ?? 0)}%` }"
                    />
                  </span>
                  <span class="cq-expo__delta"
                    >{{ CIRCUIT?.improvementLabel ?? "88.1% smaller" }} than at the start</span
                  >
                </span>
              </RouterLink>
            </li>
          </ul>

          <p class="cq-sheet__foot cq-tiny cq-expo__asidefoot">
            Neither is a date. Both show which way the work is moving.
          </p>
        </PanelCard>
      </div>
    </header>

    <div class="cq-stage cq-expo__stage">
      <div class="cq-stage__main">
        <section class="cq-band cq-expo__plate">
          <form novalidate class="cq-expo__form" @submit.prevent="check">
            <div class="cq-expo__formhead">
              <span aria-hidden="true" class="cq-expo__formart">
                <FormArt />
              </span>
              <div class="cq-expo__formrow">
                <Icon name="wallet" :size="16" class="cq-expo__formicon" />
                <h2 class="cq-h2 cq-expo__formtitle">Check a wallet</h2>
              </div>
              <p class="cq-expo__formsub">
                Addresses of Bitcoin, Ethereum or Solana, one per line, or a Bitcoin wallet's xpub,
                ypub or zpub.
              </p>
            </div>

            <div class="cq-expo__body">
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
                class="cq-textarea cq-expo__paste"
                @input="error = ''"
              ></textarea>

              <div class="cq-expo__actions">
                <p id="wallet-hint" aria-live="polite" class="cq-expo__hint" :class="hintTone">
                  {{ hint }}
                </p>
                <div class="cq-inline cq-expo__buttons">
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

            <p id="wallet-privacy" class="cq-expo__privacy">
              <Icon name="shield-check" :size="14" class="cq-expo__privacyicon" />
              Read-only. Nothing is saved or logged, and no wallet or signature is asked for.
            </p>
          </form>
        </section>
      </div>

      <aside class="cq-stage__edge">
        <section class="cq-sheet cq-expo__legend">
          <div class="cq-sheet__head">
            <h2 class="cq-sheet__title">What the answer can be</h2>
          </div>
          <ul class="cq-expo__legendlist">
            <li v-for="item in LEGEND" :key="item.key" class="cq-expo__legenditem">
              <Icon :name="item.icon" :size="16" class="cq-expo__legendicon" :class="item.tone" />
              <div class="cq-expo__legendcopy">
                <p class="cq-h3">{{ item.title }}</p>
                <p class="cq-small">{{ item.body }}</p>
              </div>
            </li>
          </ul>
        </section>
      </aside>
    </div>

    <section v-if="checked" class="cq-expo__results">
      <ExposureResults :result="checked" />
    </section>

    <section class="cq-sheet cq-expo__chains">
      <div class="cq-expo__chainshead">
        <h2 class="cq-h2">How it reads each chain</h2>
      </div>
      <ol class="cq-expo__chainlist">
        <li v-for="note in CHAIN_NOTES" :key="note.n" class="cq-expo__chainrow">
          <span class="cq-expo__no">{{ note.n }}</span>
          <div class="cq-expo__chaincopy">
            <h3 class="cq-h3">{{ note.title }}</h3>
            <p class="cq-body">{{ note.body }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="cq-expo__notes">
      <div v-for="note in FOOTNOTES" :key="note.title" class="cq-expo__note">
        <h2 class="cq-h3">{{ note.title }}</h2>
        <p class="cq-small">{{ note.body }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cq-expo {
  padding-bottom: clamp(28px, 4vw, 56px);
}

/* running head -------------------------------------------------------- */
.cq-expo__title {
  max-width: 14ch;
  font-size: clamp(40px, 5.6vw, 82px);
  margin-top: 12px;
}

.cq-expo__head {
  grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.6fr);
}

.cq-expo__lede {
  margin-top: 18px;
  max-width: 54ch;
}

.cq-expo__headedge {
  justify-content: flex-end;
  align-items: stretch;
}

.cq-expo__panel {
  width: 100%;
  min-width: 0;
}

.cq-expo__closeart {
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  width: 82%;
  height: 96px;
  overflow: clip;
  opacity: 0.4;
  pointer-events: none;
}

/* measures ------------------------------------------------------------ */
.cq-expo__measures {
  display: grid;
  min-width: 0;
}

.cq-expo__measure {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  align-items: start;
  gap: 4px 10px;
  min-width: 0;
  padding: 13px 18px;
  border-top: 1px solid var(--cq-line-soft);
}

.cq-expo__measures > li:first-child .cq-expo__measure {
  border-top: 0;
}

.cq-expo__measure:hover {
  background: var(--cq-sheet-soft);
}

.cq-expo__qm {
  color: var(--cq-accent-text);
}

.cq-expo__mtext {
  grid-column: 2;
  display: grid;
  gap: 2px;
  min-width: 0;
}

.cq-expo__mname {
  font-family: var(--cq-display);
  font-size: 0.9rem;
  font-weight: 620;
  letter-spacing: -0.01em;
  color: var(--cq-ink);
}

.cq-expo__mdesc {
  font-size: 0.74rem;
  line-height: 1.45;
  color: var(--cq-muted);
  overflow-wrap: anywhere;
}

.cq-expo__mgo {
  grid-column: 3;
  margin-top: 2px;
  color: var(--cq-muted);
}

.cq-expo__mfig {
  grid-column: 2 / -1;
  display: grid;
  gap: 6px;
  min-width: 0;
  margin-top: 6px;
}

.cq-expo__mnum {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px;
}

.cq-expo__figure {
  font-size: 1rem;
  color: var(--cq-ink);
}

.cq-expo__meter {
  display: block;
  height: 5px;
}

.cq-expo__delta {
  font-family: var(--cq-mono);
  font-size: 0.68rem;
  color: var(--cq-muted);
}

.cq-expo__asidefoot {
  display: block;
  width: 100%;
  font-size: 0.72rem;
  color: var(--cq-muted);
}

/* stage --------------------------------------------------------------- */
.cq-expo__stage {
  margin-top: clamp(8px, 1.4vw, 18px);
}

/* form plate ---------------------------------------------------------- */
.cq-expo__plate {
  display: block;
  margin-top: 0;
  padding: clamp(20px, 3vw, 34px);
  box-shadow: var(--cq-shadow);
}

.cq-expo__form {
  display: grid;
  gap: clamp(18px, 2.4vw, 26px);
  min-width: 0;
}

.cq-expo__formhead {
  position: relative;
  display: grid;
  gap: 8px;
  overflow: clip;
  padding-bottom: 2px;
}

.cq-expo__formart {
  position: absolute;
  top: -56px;
  right: -30px;
  display: block;
  width: min(58%, 320px);
  height: 190px;
  color: #8fa0d6;
  opacity: 0.38;
  pointer-events: none;
}

.cq-expo__formart :deep(svg) {
  width: 100%;
  height: 100%;
}

.cq-expo__formrow {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.cq-expo__formicon {
  flex: 0 0 auto;
  color: #aab6ff;
}

.cq-expo__formtitle {
  color: #f2f5ff;
  font-size: clamp(1.6rem, 2.6vw, 2.2rem);
  line-height: 1.02;
}

.cq-expo__formsub {
  position: relative;
  z-index: 1;
  max-width: 52ch;
  font-size: 0.86rem;
  line-height: 1.55;
  color: #a9b5c8;
}

.cq-expo__body {
  display: grid;
  gap: 14px;
  min-width: 0;
}

.cq-expo__paste {
  min-height: 112px;
  padding: 12px 14px;
  background: #11141b;
  border: 1px solid #2b3446;
  border-radius: var(--cq-radius-sm);
  color: #eef2f9;
  font-family: var(--cq-mono);
  font-size: 0.86rem;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.cq-expo__paste::placeholder {
  color: #6f7f99;
}

.cq-expo__paste:hover {
  border-color: #3d4b64;
}

.cq-expo__paste:focus-visible {
  outline: 2px solid #8fa0ff;
  outline-offset: 1px;
  border-color: #8fa0ff;
}

.cq-expo__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 16px;
}

.cq-expo__hint {
  min-width: 0;
  min-height: 20px;
  font-size: 0.8rem;
  line-height: 1.5;
  color: #a9b5c8;
  text-wrap: pretty;
  overflow-wrap: anywhere;
}

.cq-expo__hint.cq-tone-alert {
  color: #ffb4a1;
}

.cq-expo__buttons {
  margin-left: auto;
}

.cq-expo__plate :deep(.cq-btn) {
  background: #eef2f9;
  border-color: #eef2f9;
  color: #0a0b0d;
}

.cq-expo__plate :deep(.cq-btn:hover) {
  background: #4d5bff;
  border-color: #4d5bff;
  color: #ffffff;
}

.cq-expo__plate :deep(.cq-btn--line) {
  background: transparent;
  border-color: #3d4b64;
  color: #eef2f9;
}

.cq-expo__plate :deep(.cq-btn--line:hover) {
  background: #1a1f29;
  border-color: #6d7c96;
  color: #ffffff;
}

.cq-expo__privacy {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  padding-top: 14px;
  border-top: 1px solid #222a38;
  font-size: 0.76rem;
  line-height: 1.5;
  color: #8f9cb2;
}

.cq-expo__privacyicon {
  flex: 0 0 auto;
  margin-top: 2px;
  color: #8f9cb2;
}

/* legend (edge) ------------------------------------------------------- */
.cq-expo__legend {
  min-width: 0;
}

.cq-expo__legendlist {
  display: grid;
  min-width: 0;
}

.cq-expo__legenditem {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  align-items: start;
  gap: 10px;
  min-width: 0;
  padding: 15px 18px;
  border-top: 1px solid var(--cq-line-soft);
}

.cq-expo__legenditem:first-child {
  border-top: 0;
}

.cq-expo__legendicon {
  flex: 0 0 auto;
  margin-top: 3px;
}

.cq-expo__legendcopy {
  display: grid;
  gap: 3px;
  min-width: 0;
}

/* results ------------------------------------------------------------- */
.cq-expo__results {
  margin-top: clamp(26px, 4vw, 48px);
}

/* chains -------------------------------------------------------------- */
.cq-expo__chains {
  margin-top: clamp(30px, 4vw, 54px);
  overflow: clip;
}

.cq-expo__chainshead {
  padding: clamp(18px, 2.6vw, 26px) clamp(18px, 3vw, 30px);
  border-bottom: 1px solid var(--cq-line);
  background: var(--cq-sheet-soft);
}

.cq-expo__chainlist {
  display: grid;
}

.cq-expo__chainrow {
  display: grid;
  grid-template-columns: clamp(56px, 6vw, 80px) minmax(0, 1fr);
  align-items: start;
  gap: clamp(12px, 2vw, 26px);
  padding: clamp(18px, 2.4vw, 26px) clamp(18px, 3vw, 30px);
  border-top: 1px solid var(--cq-line-soft);
}

.cq-expo__chainrow:first-child {
  border-top: 0;
}

.cq-expo__no {
  font-family: var(--cq-mono);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: var(--cq-accent-text);
}

.cq-expo__chaincopy {
  display: grid;
  gap: 5px;
  min-width: 0;
  max-width: 88ch;
}

.cq-expo__chaincopy .cq-body {
  font-size: 0.9rem;
  color: var(--cq-ink-soft);
}

/* footnotes ----------------------------------------------------------- */
.cq-expo__notes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  margin-top: clamp(26px, 4vw, 44px);
  border-top: 1px solid var(--cq-line);
}

.cq-expo__note {
  display: grid;
  align-content: start;
  gap: 7px;
  min-width: 0;
  padding: 20px clamp(14px, 2vw, 24px) 0;
  border-left: 1px solid var(--cq-line-soft);
}

.cq-expo__note:first-child {
  padding-left: 0;
  border-left: 0;
}

@media (max-width: 960px) {
  .cq-expo__head {
    grid-template-columns: minmax(0, 1fr);
  }

  .cq-expo__headedge {
    justify-content: flex-start;
  }

  .cq-expo__panel {
    max-width: 420px;
  }

  .cq-expo__title {
    font-size: clamp(34px, 9vw, 56px);
  }
}

@media (max-width: 720px) {
  .cq-expo__notes {
    grid-template-columns: minmax(0, 1fr);
  }

  .cq-expo__note {
    padding: 16px 0;
    border-left: 0;
    border-top: 1px solid var(--cq-line-soft);
  }

  .cq-expo__note:first-child {
    border-top: 0;
  }

  .cq-expo__chainrow {
    grid-template-columns: 34px minmax(0, 1fr);
  }
}
</style>
