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
  <div class="pp-page">
    <div class="pp-head">
      <h1 class="pp-runhead">Launch a token</h1>
      <p class="pp-lede">
        Your token's fees fill its AI/Quantum pool, which pays for an AI agent and quantum computer
        runs on the challenge you pick, live and in public.
      </p>
    </div>

    <form novalidate class="pp-stage pp-launch" @submit.prevent="launch">
      <div class="pp-wide">
        <QuantumPortraitStep v-model:picture="picture" v-model:error="error" />

        <LaunchStep index="02" title="Name it">
          <div class="pp-field-row">
            <div class="pp-field">
              <label for="launch-name" class="pp-field__label">Name</label>
              <input
                id="launch-name"
                v-model="name"
                placeholder="Sound Proof…"
                maxlength="32"
                autocomplete="off"
                class="pp-input"
              />
            </div>
            <div class="pp-field">
              <label for="launch-symbol" class="pp-field__label">Ticker</label>
              <input
                id="launch-symbol"
                :value="ticker"
                placeholder="SOUND…"
                maxlength="13"
                autocomplete="off"
                spellcheck="false"
                class="pp-input pp-launch__mono"
                @input="onTicker"
              />
            </div>
          </div>

          <div class="pp-field">
            <label for="launch-description" class="pp-field__label pp-launch__labelrow"
              >Description<span class="pp-tiny">Optional</span></label
            >
            <textarea
              id="launch-description"
              v-model="description"
              class="pp-textarea"
              placeholder="What your token's agent works on, in a sentence…"
              maxlength="1000"
              rows="2"
            ></textarea>
          </div>
        </LaunchStep>

        <ChallengePicker v-model="challengeSlug" />

        <LaunchStep
          index="04"
          title="Opening buy"
          hint="NVDAx to buy your own token with in the launch itself, as your wallet shows it. Leave it empty for none."
        >
          <div class="pp-inline">
            <input
              id="launch-buy"
              v-model="openingBuy"
              class="pp-input pp-launch__mono pp-launch__buyfield"
              placeholder="0"
              inputmode="decimal"
              aria-label="Buy at launch"
            />
            <span translate="no" class="pp-mono pp-small">{{ QUOTE_ASSET.symbol }}</span>
          </div>
        </LaunchStep>
      </div>

      <div class="pp-margin pp-launch__aside">
        <div class="pp-plate pp-plate--quiet pp-launch__quote">
          <img
            :src="QUOTE_ASSET.logo"
            alt=""
            width="36"
            height="36"
            class="pp-launch__logo"
          />
          <div class="pp-launch__quotecopy">
            <p class="pp-h3">Paired with {{ QUOTE_ASSET.name }}</p>
            <p class="pp-small">
              Every token trades against {{ QUOTE_ASSET.symbol }}, {{ QUOTE_ASSET.name }}'s tokenized
              stock on Solana. Its fees and its opening buy are in {{ QUOTE_ASSET.symbol }}.
            </p>
          </div>
        </div>

        <TokenPreviewCard
          :name="name"
          :ticker="ticker"
          :picture-url="pictureUrl"
          :challenge="challenge"
        />

        <FeeSplitPanel />

        <div class="pp-margin__block pp-launch__action">
          <p v-if="error" role="alert" class="pp-callout pp-callout--alert pp-launch__alert">
            {{ error }}
          </p>
          <AppButton
            v-if="!signedIn"
            type="button"
            size="lg"
            class="pp-btn--full"
            @click="launch"
            >Sign in to launch</AppButton
          >
          <AppButton v-else type="submit" size="lg" class="pp-btn--full" :disabled="!ready"
            >Launch a token</AppButton
          >
          <p class="pp-tiny">
            Launching costs {{ LAUNCH.feeSol }} SOL plus Solana's fees, paid by your wallet.
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.pp-launch {
  align-items: start;
}

.pp-launch__aside {
  align-content: start;
  min-width: 0;
}

.pp-launch__quote {
  grid-template-columns: 36px minmax(0, 1fr);
  align-items: start;
  gap: 12px;
}

.pp-launch__logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--pp-line);
}

.pp-launch__quotecopy {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.pp-launch__labelrow {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.pp-launch__mono {
  font-family: var(--pp-mono);
  letter-spacing: 0.03em;
}

.pp-launch__buyfield {
  flex: 0 0 auto;
  width: 160px;
  max-width: 100%;
}

.pp-launch__action {
  align-content: start;
  align-items: start;
  gap: var(--pp-t2);
}

.pp-launch__alert {
  padding: 10px 12px;
  border-radius: var(--pp-radius-sm);
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--pp-alert);
}

@media (min-width: 1181px) {
  .pp-launch__aside {
    position: sticky;
    top: 104px;
  }
}

@media (max-width: 1180px) {
  .pp-launch__aside {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }
}

@media (max-width: 700px) {
  .pp-launch__aside {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
