<script setup>
/**
 * /launch — the token launcher.
 *
 * Two columns: the four numbered steps on the left, the live preview and the
 * fee split pinned to the right. Nothing is submitted for real: `launch()`
 * validates the form and, with no wallet connected, says so instead of
 * pretending to sign.
 */
import { computed, ref } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
import ChallengePicker from "@/components/launch/ChallengePicker.vue";
import FeeSplitPanel from "@/components/launch/FeeSplitPanel.vue";
import LaunchStep from "@/components/launch/LaunchStep.vue";
import QuantumPortraitStep from "@/components/launch/QuantumPortraitStep.vue";
import TokenPreviewCard from "@/components/launch/TokenPreviewCard.vue";
import { DEFAULT_CHALLENGE, challengeBySlug } from "@/components/launch/launchChallenges";
import { QUOTE_ASSET } from "@/data/challenges";
import { LAUNCH } from "@/data/onchain";

/** The picked picture, as `{ file, name, url }`. */
const picture = ref(null);
const error = ref(null);

const name = ref("");
const ticker = ref("");
const description = ref("");
const challengeSlug = ref(DEFAULT_CHALLENGE);
const openingBuy = ref("");

/**
 * The reference renders this page signed out. No wallet adapter is wired into
 * the site yet, so the primary action stays on "Sign in to launch".
 */
const signedIn = ref(false);

const challenge = computed(() => challengeBySlug(challengeSlug.value));
const pictureUrl = computed(() => picture.value?.url ?? null);

/** Tickers are upper case letters and digits only, as the reference normalises them. */
function onTicker(event) {
  const next = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  ticker.value = next;
  if (event.target.value !== next) event.target.value = next;
}

const ready = computed(
  () => Boolean(picture.value) && Boolean(name.value.trim()) && Boolean(ticker.value.trim()),
);

/** First thing missing, in step order — also what the alert in the rail shows. */
const problem = computed(() => {
  if (!picture.value) return "Add a picture for your token.";
  if (!name.value.trim()) return "Give your token a name.";
  if (!ticker.value.trim()) return "Give your token a ticker.";
  return null;
});

function launch() {
  error.value = problem.value;

  if (!error.value && !signedIn.value) {
    error.value = "No wallet is connected. Sign in with a wallet to launch.";
    return;
  }
  if (!error.value) {
    error.value = `Launching is not wired up in this build yet. The fee is ${LAUNCH.feeSol} SOL.`;
  }
}
</script>

<template>
  <div class="cq-page cq-launchpage">
    <header class="cq-pagehead cq-launchpage__pagehead">
      <div class="cq-pagehead__head">
        <h1 class="cq-runhead cq-launchpage__runhead">Launch a token</h1>
        <p class="cq-lede cq-launchpage__lede">
          Your token's fees fill its AI/Quantum pool, which pays for an AI agent and quantum computer
          runs on the challenge you pick, live and in public.
        </p>
      </div>

      <div class="cq-pagehead__edge cq-launchpage__edge" aria-hidden="true">
        <span class="cq-launchpage__gauge"><i></i><i></i><i></i><i></i></span>
        <span class="cq-launchpage__edgerail"></span>
      </div>
    </header>

    <form novalidate class="cq-stage cq-launchpage__form" @submit.prevent="launch">
      <div class="cq-stage__main cq-launchpage__steps">
        <QuantumPortraitStep v-model:picture="picture" v-model:error="error" />

        <LaunchStep index="02" title="Name it">
          <div class="cq-launchpage__fieldrow">
            <div class="cq-field cq-launchpage__field">
              <label for="launch-name" class="cq-field__label">Name</label>
              <input
                id="launch-name"
                v-model="name"
                placeholder="Sound Proof…"
                maxlength="32"
                autocomplete="off"
                class="cq-input cq-launchpage__mono"
              />
            </div>
            <div class="cq-field cq-launchpage__field">
              <label for="launch-symbol" class="cq-field__label">Ticker</label>
              <input
                id="launch-symbol"
                :value="ticker"
                placeholder="SOUND…"
                maxlength="13"
                autocomplete="off"
                spellcheck="false"
                class="cq-input cq-launchpage__mono"
                @input="onTicker"
              />
            </div>
          </div>

          <div class="cq-field cq-launchpage__description">
            <label for="launch-description" class="cq-field__label cq-launchpage__labelrow"
              >Description<span class="cq-tiny">Optional</span></label
            >
            <textarea
              id="launch-description"
              v-model="description"
              class="cq-textarea cq-launchpage__textarea"
              placeholder="What your token's agent works on, in a sentence…"
              maxlength="1000"
              rows="2"
            ></textarea>
          </div>
        </LaunchStep>

        <LaunchStep
          index="04"
          title="Opening buy"
          hint="NVDAx to buy your own token with in the launch itself, as your wallet shows it. Leave it empty for none."
        >
          <div class="cq-launchpage__buy">
            <input
              id="launch-buy"
              v-model="openingBuy"
              class="cq-input cq-launchpage__mono cq-launchpage__buyfield"
              placeholder="0"
              inputmode="decimal"
              aria-label="Buy at launch"
            />
            <span translate="no" class="cq-mono cq-small cq-launchpage__buyunit">{{ QUOTE_ASSET.symbol }}</span>
          </div>
        </LaunchStep>
      </div>

      <aside class="cq-stage__edge cq-launchpage__rail">
        <div class="cq-sheet cq-launchpage__picker">
          <ChallengePicker v-model="challengeSlug" />
        </div>

        <TokenPreviewCard
          :name="name"
          :ticker="ticker"
          :picture-url="pictureUrl"
          :challenge="challenge"
        />

        <FeeSplitPanel />

        <div class="cq-sheet cq-launchpage__quote">
          <img
            :src="QUOTE_ASSET.logo"
            alt=""
            width="36"
            height="36"
            class="cq-launchpage__logo"
          />
          <div class="cq-launchpage__quotecopy">
            <p class="cq-h3">Paired with {{ QUOTE_ASSET.name }}</p>
            <p class="cq-small">
              Every token trades against {{ QUOTE_ASSET.symbol }}, {{ QUOTE_ASSET.name }}'s tokenized
              stock on Solana. Its fees and its opening buy are in {{ QUOTE_ASSET.symbol }}.
            </p>
          </div>
        </div>

        <div class="cq-sheet cq-launchpage__action">
          <p v-if="error" role="alert" class="cq-callout cq-callout--alert cq-launchpage__alert">
            {{ error }}
          </p>
          <AppButton
            v-if="!signedIn"
            type="button"
            size="lg"
            class="cq-btn--full cq-launchpage__submit"
            @click="launch"
            >Sign in to launch</AppButton
          >
          <AppButton v-else type="submit" size="lg" class="cq-btn--full cq-launchpage__submit" :disabled="!ready"
            >Launch a token</AppButton
          >
          <p class="cq-tiny">
            Launching costs {{ LAUNCH.feeSol }} SOL plus Solana's fees, paid by your wallet.
          </p>
        </div>
      </aside>
    </form>
  </div>
</template>

<style scoped>
.cq-launchpage {
  display: flex;
  flex-direction: column;
  gap: clamp(26px, 3.4vw, 46px);
}

/* running head ---------------------------------------------------------- */
.cq-launchpage__pagehead {
  margin-bottom: 0;
}

.cq-launchpage__runhead {
  max-width: 12ch;
}

.cq-launchpage__lede {
  margin-top: clamp(13px, 1.6vw, 20px);
}

.cq-launchpage__edge {
  justify-content: flex-end;
  align-items: flex-end;
  gap: 14px;
  padding-bottom: 2px;
}

.cq-launchpage__gauge {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 5px;
  width: 100%;
  max-width: 196px;
}

.cq-launchpage__gauge i {
  display: block;
  height: 4px;
  background: var(--cq-line);
}

.cq-launchpage__gauge i:first-child {
  background: var(--cq-accent);
}

.cq-launchpage__edgerail {
  width: 1px;
  height: clamp(44px, 7vw, 80px);
  background: linear-gradient(to bottom, var(--cq-line-strong), transparent);
}

/* questionnaire --------------------------------------------------------- */
.cq-launchpage__form {
  padding-top: 0;
  border-top: 0;
}

.cq-launchpage__steps {
  gap: clamp(25px, 3.4vw, 42px);
}

.cq-launchpage__fieldrow {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(14px, 2vw, 24px);
}

.cq-launchpage__field,
.cq-launchpage__description {
  min-width: 0;
}

.cq-launchpage__labelrow {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.cq-launchpage__mono {
  font-family: var(--cq-mono);
  letter-spacing: 0.03em;
}

.cq-launchpage__textarea {
  min-height: 94px;
}

.cq-launchpage__buy {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 14px;
}

.cq-launchpage__buyfield {
  flex: 0 0 auto;
  width: 170px;
  max-width: 100%;
}

.cq-launchpage__buyunit {
  color: var(--cq-muted);
}

/* sticky marginal rail -------------------------------------------------- */
.cq-launchpage__rail {
  position: sticky;
  top: 104px;
  align-self: start;
  gap: 14px;
}

.cq-launchpage__picker {
  padding: 17px 18px 19px;
  border-top: 2px solid var(--cq-accent);
  box-shadow: none;
}

.cq-launchpage__quote {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  align-items: start;
  gap: 12px;
  padding: 15px 17px;
  border-top: 1px solid var(--cq-line-strong);
  box-shadow: none;
}

.cq-launchpage__logo {
  width: 36px;
  height: 36px;
  border: 1px solid var(--cq-line);
}

.cq-launchpage__quotecopy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.cq-launchpage__action {
  display: grid;
  gap: 11px;
  padding: 16px 17px 17px;
  border-top: 1px solid var(--cq-line-strong);
  box-shadow: none;
}

.cq-launchpage__alert {
  padding: 10px 12px;
  font-size: 0.77rem;
  line-height: 1.45;
}

.cq-launchpage__submit {
  width: 100%;
}

@media (max-width: 1180px) {
  .cq-launchpage__edge {
    align-items: flex-start;
  }
}

@media (max-width: 960px) {
  .cq-launchpage__form {
    display: flex;
    flex-direction: column;
    gap: clamp(22px, 4vw, 34px);
  }

  .cq-launchpage__steps,
  .cq-launchpage__rail {
    display: contents;
  }

  .cq-launchpage__steps > :nth-child(1) {
    order: 1;
  }

  .cq-launchpage__steps > :nth-child(2) {
    order: 2;
  }

  .cq-launchpage__steps > :nth-child(3) {
    order: 4;
  }

  .cq-launchpage__rail > :nth-child(1) {
    order: 3;
  }

  .cq-launchpage__rail > :nth-child(2) {
    order: 5;
  }

  .cq-launchpage__rail > :nth-child(3) {
    order: 6;
  }

  .cq-launchpage__rail > :nth-child(4) {
    order: 7;
  }

  .cq-launchpage__rail > :nth-child(5) {
    order: 8;
  }

  .cq-launchpage__edge {
    display: none;
  }
}

@media (max-width: 620px) {
  .cq-launchpage__fieldrow {
    grid-template-columns: minmax(0, 1fr);
  }

  .cq-launchpage__buyfield {
    width: 100%;
  }
}
</style>
