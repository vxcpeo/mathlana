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
import { INPUT_CLASS, TEXTAREA_CLASS } from "@/components/launch/launchFields";
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
  <div class="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 sm:py-16">
    <header class="flex max-w-2xl flex-col gap-3">
      <h1 class="headline text-4xl sm:text-5xl">Launch a token</h1>
      <p class="text-base text-pretty text-muted-foreground">
        Your token's fees fill its AI/Quantum pool, which pays for an AI agent and quantum computer
        runs on the challenge you pick, live and in public.
      </p>
    </header>

    <form
      novalidate
      class="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.618fr)_minmax(0,1fr)]"
      @submit.prevent="launch"
    >
      <div class="flex min-w-0 flex-col gap-9">
        <QuantumPortraitStep v-model:picture="picture" v-model:error="error" />

        <LaunchStep index="02" title="Name it">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1.618fr)_minmax(0,1fr)]">
            <div class="flex min-w-0 flex-col gap-1.5">
              <label for="launch-name" class="flex items-baseline justify-between text-sm font-medium"
                >Name</label
              >
              <input
                id="launch-name"
                v-model="name"
                placeholder="Sound Proof…"
                maxlength="32"
                autocomplete="off"
                :class="[INPUT_CLASS, 'h-10']"
              />
            </div>
            <div class="flex min-w-0 flex-col gap-1.5">
              <label
                for="launch-symbol"
                class="flex items-baseline justify-between text-sm font-medium"
                >Ticker</label
              >
              <input
                id="launch-symbol"
                :value="ticker"
                placeholder="SOUND…"
                maxlength="13"
                autocomplete="off"
                spellcheck="false"
                :class="[INPUT_CLASS, 'h-10 font-mono']"
                @input="onTicker"
              />
            </div>
          </div>

          <div class="flex min-w-0 flex-col gap-1.5">
            <label
              for="launch-description"
              class="flex items-baseline justify-between text-sm font-medium"
              >Description<span class="text-xs font-normal text-muted-foreground">Optional</span></label
            >
            <textarea
              id="launch-description"
              v-model="description"
              :class="TEXTAREA_CLASS"
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
          <div class="flex max-w-xs items-center gap-2">
            <input
              id="launch-buy"
              v-model="openingBuy"
              :class="[INPUT_CLASS, 'h-10 font-mono']"
              placeholder="0"
              inputmode="decimal"
              aria-label="Buy at launch"
            />
            <span translate="no" class="font-mono text-sm text-muted-foreground">{{
              QUOTE_ASSET.symbol
            }}</span>
          </div>
        </LaunchStep>
      </div>

      <aside class="flex min-w-0 flex-col gap-5 lg:sticky lg:top-28">
        <div class="flex min-w-0 items-center gap-3 rounded-xl border bg-card px-4 py-3">
          <img
            :src="QUOTE_ASSET.logo"
            alt=""
            width="36"
            height="36"
            class="size-9 shrink-0 rounded-[22%]"
          />
          <div class="flex min-w-0 flex-1 flex-col gap-0.5">
            <p class="font-heading text-sm font-semibold tracking-[-0.01em] whitespace-nowrap">
              Paired with {{ QUOTE_ASSET.name }}
            </p>
            <p class="text-xs text-pretty text-muted-foreground">
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

        <div class="flex flex-col gap-3">
          <p
            v-if="error"
            role="alert"
            class="rounded-lg border border-failed-border bg-failed-surface px-3 py-2 text-xs text-failed-text"
          >
            {{ error }}
          </p>
          <AppButton
            v-if="!signedIn"
            type="button"
            class="h-11 w-full"
            @click="launch"
            >Sign in to launch</AppButton
          >
          <AppButton v-else type="submit" class="h-11 w-full" :disabled="!ready"
            >Launch a token</AppButton
          >
          <p class="text-[0.7rem] text-muted-foreground">
            Launching costs {{ LAUNCH.feeSol }} SOL plus Solana's fees, paid by your wallet.
          </p>
        </div>
      </aside>
    </form>
  </div>
</template>
