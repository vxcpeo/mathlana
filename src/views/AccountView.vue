<script setup>
/**
 * `/account` — the signed-out account page.
 *
 * The page is a single empty-state plate with a compact facts margin. The
 * reference hands sign-in to Privy with the copy
 * "Sign in to Qubitlane" / "By email or with a Solana wallet"; here that panel is
 * rendered inline and resolved entirely in the browser — the email path never
 * leaves the page and the wallet path only calls `window.solana` /
 * `window.solflare` when the extension is installed. No external auth API is
 * contacted.
 */
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
import Icon from "@/components/ui/Icon.vue";
import BrandMark from "@/components/brand/BrandMark.vue";
import CardArt from "@/components/art/CardArt.vue";
import { shortAddress } from "@/lib/format";

/* Copy taken from the reference's message catalogue. */
const WORDS = {
  title: "Your tokens",
  signIn: "Sign in",
  signOut: "Sign out",
  signedInAs: "Signed in as {who}",
  signInPrompt: "Sign in to see the tokens you launched.",
  empty: "You haven't launched a token yet.",
  landingHeader: "Sign in to Qubitlane",
  loginMessage: "By email or with a Solana wallet",
  cancelled: "Sign-in was closed before it finished.",
  invalid: "That didn't work. Try again.",
};

const WALLETS = [
  { key: "phantom", name: "Phantom" },
  { key: "solflare", name: "Solflare" },
];

const STORAGE_KEY = "qubitlane:signin";

const account = ref(null); // { kind: "email" | "wallet", who, address? }
const panelOpen = ref(false);
const email = ref("");
const busy = ref(null);
const notice = ref("");
const installed = ref({ phantom: false, solflare: false });

/** Wallet extensions inject themselves late, so re-check while the panel is up. */
function detectWallets() {
  if (typeof window === "undefined") return;
  installed.value = {
    phantom: Boolean(window.solana?.isPhantom),
    solflare: Boolean(window.solflare?.isSolflare || window.solflare?.connect),
  };
}

onMounted(() => {
  detectWallets();
  window.addEventListener("focus", detectWallets);
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) account.value = JSON.parse(saved);
  } catch {
    /* a corrupt entry just means signed out */
  }
});

onBeforeUnmount(() => window.removeEventListener("focus", detectWallets));

const who = computed(() => {
  if (!account.value) return "";
  return account.value.address ? shortAddress(account.value.address) : account.value.who;
});

const signedInLabel = computed(() =>
  WORDS.signedInAs.replace("{who}", who.value),
);

function persist(next) {
  account.value = next;
  try {
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* private mode: keep the session in memory only */
  }
}

function openPanel() {
  notice.value = "";
  detectWallets();
  panelOpen.value = true;
}

function closePanel() {
  panelOpen.value = false;
  busy.value = null;
  notice.value = "";
}

function signInWithEmail() {
  const value = email.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    notice.value = WORDS.invalid;
    return;
  }
  persist({ kind: "email", who: value });
  email.value = "";
  closePanel();
}

async function signInWithWallet(key) {
  notice.value = "";
  detectWallets();
  const provider =
    key === "phantom" ? window.solana : window.solflare ?? null;
  if (!provider?.connect) {
    notice.value = `No ${key === "phantom" ? "Phantom" : "Solflare"} wallet found. Install the browser extension, then try again.`;
    return;
  }
  busy.value = key;
  try {
    const result = await provider.connect();
    const address =
      result?.publicKey?.toString?.() ?? provider.publicKey?.toString?.() ?? "";
    if (!address) {
      notice.value = WORDS.invalid;
      return;
    }
    persist({ kind: "wallet", who: address, address });
    closePanel();
  } catch (error) {
    // Wallets reject with code 4001 when the user dismisses the prompt.
    notice.value = error?.code === 4001 ? WORDS.cancelled : WORDS.invalid;
  } finally {
    busy.value = null;
  }
}

function signOut() {
  persist(null);
  notice.value = "";
}

const walletHint = computed(() => {
  if (installed.value.phantom || installed.value.solflare) return "";
  return "No Solana wallet extension detected in this browser.";
});
</script>

<template>
  <div class="pp-page pp-account">
    <div class="pp-head pp-account__head">
      <span class="pp-account__folio" aria-hidden="true" />
      <h1 class="pp-runhead pp-account__title">{{ WORDS.title }}</h1>
    </div>

    <div class="pp-stage pp-account__stage">
      <section class="pp-wide pp-account__plate">
        <span class="pp-account__plate-mark" aria-hidden="true" />
        <span class="pp-account__plate-art" aria-hidden="true">
          <CardArt name="figure" />
        </span>

        <div class="pp-account__plate-body">
          <template v-if="account">
            <p class="pp-lede pp-account__empty">{{ WORDS.empty }}</p>
            <AppButton variant="outline" @click="signOut">
              {{ WORDS.signOut }}
            </AppButton>
          </template>
          <template v-else>
            <AppButton size="lg" @click="openPanel">{{ WORDS.signIn }}</AppButton>
          </template>
        </div>
      </section>

      <div class="pp-margin pp-account__margin">
        <div class="pp-margin__block pp-account__fact">
          <template v-if="account">
            <span class="pp-account__fact-line" aria-hidden="true" />
            <p class="pp-account__fact-value">
              <Icon name="wallet" :size="16" class="pp-account__fact-icon" />
              <span>{{ signedInLabel }}</span>
            </p>
          </template>
          <template v-else>
            <p class="pp-small pp-account__note">{{ WORDS.signInPrompt }}</p>
          </template>
        </div>
      </div>
    </div>

    <!-- Sign-in panel. Stands in for the reference's Privy modal. -->
    <div
      v-if="panelOpen"
      class="pp-account__scrim"
      role="presentation"
      @click.self="closePanel"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-title"
        class="pp-account__dialog"
      >
        <div class="pp-account__dialog-head">
          <span class="pp-account__brand" role="img" aria-label="Qubitlane">
            <BrandMark />
            <span
              aria-hidden="true"
              translate="no"
              class="pp-account__wordmark"
              >Qubit<span class="pp-account__wordmark-accent">lane</span></span
            >
          </span>
          <AppButton variant="ghost" size="icon" aria-label="Close" @click="closePanel">
            <Icon name="x" />
          </AppButton>
        </div>

        <div class="pp-account__dialog-title">
          <h2 id="signin-title" class="pp-h2">{{ WORDS.landingHeader }}</h2>
          <p class="pp-small">{{ WORDS.loginMessage }}</p>
        </div>

        <form class="pp-account__form" @submit.prevent="signInWithEmail">
          <div class="pp-field">
            <label for="signin-email" class="pp-field__label">Email</label>
            <input
              id="signin-email"
              v-model="email"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="you@example.com"
              class="pp-input"
            />
          </div>
          <AppButton
            type="submit"
            class="pp-btn--full pp-account__submit"
            :disabled="busy === 'email'"
          >
            <Icon v-if="busy === 'email'" name="loader-circle" />
            {{ WORDS.signIn }}
          </AppButton>
        </form>

        <div class="pp-account__divider">
          <span aria-hidden="true" class="pp-account__divider-line" />
          or
          <span aria-hidden="true" class="pp-account__divider-line" />
        </div>

        <div class="pp-account__wallets">
          <AppButton
            v-for="wallet in WALLETS"
            :key="wallet.key"
            variant="outline"
            class="pp-btn--full pp-account__wallet"
            :disabled="busy === wallet.key"
            @click="signInWithWallet(wallet.key)"
          >
            <Icon name="wallet" />
            Continue with {{ wallet.name }}
            <span v-if="installed[wallet.key]" class="pp-tag pp-tag--sm pp-account__installed"
              >Installed</span
            >
          </AppButton>
        </div>

        <p v-if="notice" class="pp-field__error">{{ notice }}</p>
        <p v-else-if="walletHint" class="pp-small">{{ walletHint }}</p>

        <p class="pp-tiny pp-account__preview">
          This preview keeps the session in your browser only. No email is sent and no
          account is created.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pp-account {
  padding-bottom: var(--pp-t6);
}

.pp-account__head {
  position: relative;
  gap: 12px;
  padding-top: var(--pp-t6);
  padding-bottom: var(--pp-t5);
}

.pp-account__folio {
  display: block;
  width: 32px;
  height: 32px;
  border-top: 1px solid var(--pp-accent);
  border-left: 1px solid var(--pp-accent);
  opacity: 0.8;
}

.pp-account__title {
  font-size: clamp(3.2rem, 9vw, 7rem);
  line-height: 0.9;
  letter-spacing: -0.055em;
}

.pp-account__stage {
  padding-top: var(--pp-t4);
  align-items: stretch;
}

.pp-account__plate {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: clamp(260px, 38vh, 400px);
  padding: clamp(22px, 3vw, 36px);
  background: var(--pp-sheet);
  border: 1px solid var(--pp-line);
  border-radius: 2px;
  overflow: hidden;
}

.pp-account__plate-mark {
  position: absolute;
  top: 22px;
  right: 22px;
  width: 24px;
  height: 24px;
  border-top: 1px solid var(--pp-line-strong);
  border-right: 1px solid var(--pp-line-strong);
}

.pp-account__plate-art {
  position: absolute;
  right: -8%;
  bottom: -12%;
  display: block;
  width: min(72%, 560px);
  color: var(--pp-accent);
  opacity: 0.22;
  pointer-events: none;
}

.pp-account__plate-art :deep(svg) {
  width: 100%;
  height: auto;
}

.pp-account__plate-body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
}

.pp-account__empty {
  max-width: 26ch;
  margin-right: auto;
}

.pp-account__margin {
  align-content: start;
}

.pp-account__fact {
  gap: 12px;
  padding-left: 14px;
  border-top: 1px solid var(--pp-line);
  border-left: 2px solid var(--pp-accent);
}

.pp-account__fact-line {
  display: block;
  width: 28px;
  height: 2px;
  background: var(--pp-accent);
}

.pp-account__fact-value {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--pp-ink);
  overflow-wrap: anywhere;
}

.pp-account__fact-icon {
  flex-shrink: 0;
  color: var(--pp-accent-text);
}

.pp-account__note {
  max-width: 32ch;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--pp-ink-soft);
}

/* Sign-in dialog */
.pp-account__scrim {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  overflow-y: auto;
  padding: clamp(16px, 4vw, 32px);
  background: rgba(10, 11, 13, 0.62);
  backdrop-filter: blur(6px);
}

.pp-account__dialog {
  display: grid;
  gap: var(--pp-t3);
  width: min(100%, 32rem);
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  padding: clamp(20px, 3vw, 30px);
  background: var(--pp-sheet);
  border: 1px solid var(--pp-line-strong);
  border-top: 3px solid var(--pp-accent);
  border-radius: 2px;
  box-shadow: var(--pp-shadow);
}

.pp-account__dialog-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.pp-account__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  min-width: 0;
  font-size: 1.15rem;
}

.pp-account__wordmark {
  font-family: var(--pp-display);
  font-weight: 620;
  letter-spacing: -0.03em;
  color: var(--pp-ink);
}

.pp-account__wordmark-accent {
  color: var(--pp-accent-text);
}

.pp-account__dialog-title {
  display: grid;
  gap: 4px;
}

.pp-account__form {
  display: grid;
  gap: 12px;
}

.pp-account__submit {
  width: 100%;
}

.pp-account__divider {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--pp-mono);
  font-size: 0.66rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--pp-muted);
}

.pp-account__divider-line {
  flex: 1;
  height: 1px;
  background: var(--pp-line);
}

.pp-account__wallets {
  display: grid;
  gap: 8px;
}

.pp-account__wallet {
  width: 100%;
  justify-content: flex-start;
  font-family: var(--pp-body);
  font-size: 0.88rem;
  letter-spacing: 0;
  text-transform: none;
}

.pp-account__installed {
  margin-left: auto;
}

.pp-account__preview {
  padding-top: 4px;
  border-top: 1px dashed var(--pp-line-strong);
}

@media (max-width: 1180px) {
  .pp-account__stage {
    align-items: stretch;
  }

  .pp-account__margin {
    grid-template-columns: minmax(0, 1fr);
  }

  .pp-account__note {
    max-width: 60ch;
  }
}

@media (max-width: 900px) {
  .pp-account__head {
    padding-top: var(--pp-t5);
  }

  .pp-account__plate {
    min-height: 320px;
  }
}

@media (max-width: 560px) {
  .pp-account {
    padding-bottom: var(--pp-t5);
  }

  .pp-account__title {
    font-size: clamp(2.9rem, 15vw, 4rem);
  }

  .pp-account__plate {
    min-height: 260px;
    padding: 18px;
  }

  .pp-account__plate-mark {
    top: 16px;
    right: 16px;
    width: 18px;
    height: 18px;
  }

  .pp-account__plate-art {
    right: -18%;
    bottom: -8%;
    width: 92%;
  }

  .pp-account__empty {
    max-width: 24ch;
  }

  .pp-account__dialog {
    padding: 18px;
    max-height: calc(100dvh - 24px);
  }

  .pp-account__scrim {
    padding: 12px;
  }
}
</style>
