<script setup>
/**
 * `/account` — the signed-out account page.
 *
 * The page is a single empty-state plate with a compact facts margin. The
 * reference hands sign-in to Privy with the copy
 * "Sign in to Qubitess" / "By email or with a Solana wallet"; here that panel is
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
  landingHeader: "Sign in to Qubitess",
  loginMessage: "By email or with a Solana wallet",
  cancelled: "Sign-in was closed before it finished.",
  invalid: "That didn't work. Try again.",
};

const WALLETS = [
  { key: "phantom", name: "Phantom" },
  { key: "solflare", name: "Solflare" },
];

const STORAGE_KEY = "qubitess:signin";

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
  <div class="cq-page cq-account">
    <header class="cq-pagehead cq-account__head">
      <div class="cq-pagehead__head">
        <span class="cq-account__folio" aria-hidden="true" />
        <h1 class="cq-runhead cq-account__title">{{ WORDS.title }}</h1>
      </div>

      <div class="cq-pagehead__edge cq-account__headedge">
        <span class="cq-account__headmark" aria-hidden="true" />
      </div>
    </header>

    <section class="cq-account__stage">
      <div class="cq-sheet cq-account__plate">
        <span class="cq-account__plate-mark" aria-hidden="true" />
        <span class="cq-account__plate-art" aria-hidden="true">
          <CardArt name="figure" />
        </span>

        <div class="cq-account__plate-body">
          <template v-if="account">
            <p class="cq-lede cq-account__empty">{{ WORDS.empty }}</p>
            <AppButton variant="outline" @click="signOut">
              {{ WORDS.signOut }}
            </AppButton>
          </template>
          <template v-else>
            <AppButton size="lg" @click="openPanel">{{ WORDS.signIn }}</AppButton>
          </template>
        </div>

        <div class="cq-account__fact">
          <template v-if="account">
            <span class="cq-account__fact-line" aria-hidden="true" />
            <p class="cq-account__fact-value">
              <Icon name="wallet" :size="16" class="cq-account__fact-icon" />
              <span>{{ signedInLabel }}</span>
            </p>
          </template>
          <template v-else>
            <p class="cq-small cq-account__note">{{ WORDS.signInPrompt }}</p>
          </template>
        </div>
      </div>
    </section>

    <!-- Sign-in panel. Stands in for the reference's Privy modal. -->
    <div
      v-if="panelOpen"
      class="cq-account__scrim"
      role="presentation"
      @click.self="closePanel"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-title"
        class="cq-account__dialog"
      >
        <div class="cq-account__dialog-head">
          <span class="cq-account__brand" role="img" aria-label="Qubitess">
            <BrandMark />
            <span
              aria-hidden="true"
              translate="no"
              class="cq-account__wordmark"
              >Qubit<span class="cq-account__wordmark-accent">ess</span></span
            >
          </span>
          <AppButton variant="ghost" size="icon" aria-label="Close" @click="closePanel">
            <Icon name="x" />
          </AppButton>
        </div>

        <div class="cq-account__dialog-title">
          <h2 id="signin-title" class="cq-h2">{{ WORDS.landingHeader }}</h2>
          <p class="cq-small">{{ WORDS.loginMessage }}</p>
        </div>

        <form class="cq-account__form" @submit.prevent="signInWithEmail">
          <div class="cq-field">
            <label for="signin-email" class="cq-field__label">Email</label>
            <input
              id="signin-email"
              v-model="email"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="you@example.com"
              class="cq-input"
            />
          </div>
          <AppButton
            type="submit"
            class="cq-btn--full cq-account__submit"
            :disabled="busy === 'email'"
          >
            <Icon v-if="busy === 'email'" name="loader-circle" />
            {{ WORDS.signIn }}
          </AppButton>
        </form>

        <div class="cq-account__divider">
          <span aria-hidden="true" class="cq-account__divider-line" />
          or
          <span aria-hidden="true" class="cq-account__divider-line" />
        </div>

        <div class="cq-account__wallets">
          <AppButton
            v-for="wallet in WALLETS"
            :key="wallet.key"
            variant="outline"
            class="cq-btn--full cq-account__wallet"
            :disabled="busy === wallet.key"
            @click="signInWithWallet(wallet.key)"
          >
            <Icon name="wallet" />
            Continue with {{ wallet.name }}
            <span v-if="installed[wallet.key]" class="cq-tag cq-tag--sm cq-account__installed"
              >Installed</span
            >
          </AppButton>
        </div>

        <p v-if="notice" class="cq-field__error">{{ notice }}</p>
        <p v-else-if="walletHint" class="cq-small">{{ walletHint }}</p>

        <p class="cq-tiny cq-account__preview">
          This preview keeps the session in your browser only. No email is sent and no
          account is created.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cq-account {
  padding-bottom: clamp(28px, 4vw, 56px);
}

/* running head -------------------------------------------------------- */
.cq-account__head {
  align-items: end;
}

.cq-account__folio {
  display: block;
  width: 32px;
  height: 32px;
  margin-bottom: 14px;
  border-top: 1px solid var(--cq-accent);
  border-left: 1px solid var(--cq-accent);
  opacity: 0.8;
}

.cq-account__title {
  margin-top: 0;
  font-size: clamp(46px, 9vw, 112px);
  line-height: 0.88;
  letter-spacing: -0.055em;
}

.cq-account__headedge {
  align-items: flex-end;
  padding-bottom: 10px;
}

.cq-account__headmark {
  position: relative;
  display: block;
  width: 42px;
  height: 42px;
  border-right: 1px solid var(--cq-line-strong);
  border-bottom: 1px solid var(--cq-line-strong);
}

.cq-account__headmark::before {
  content: "";
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 6px;
  height: 6px;
  background: var(--cq-accent);
}

/* plate --------------------------------------------------------------- */
.cq-account__stage {
  display: grid;
  place-items: start center;
  padding-top: clamp(4px, 1vw, 12px);
}

.cq-account__plate {
  position: relative;
  width: 100%;
  max-width: 720px;
  min-height: clamp(260px, 38vh, 380px);
  padding: clamp(22px, 3vw, 36px);
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: end;
  gap: clamp(20px, 3vw, 34px);
  overflow: clip;
}

.cq-account__plate-mark {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 22px;
  height: 22px;
  border-top: 1px solid var(--cq-line-strong);
  border-right: 1px solid var(--cq-line-strong);
}

.cq-account__plate-art {
  position: absolute;
  right: -8%;
  bottom: -14%;
  display: block;
  width: min(68%, 420px);
  color: var(--cq-accent);
  opacity: 0.2;
  pointer-events: none;
}

.cq-account__plate-art :deep(svg) {
  width: 100%;
  height: auto;
}

.cq-account__plate-body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
}

.cq-account__empty {
  max-width: 26ch;
  margin-right: auto;
}

.cq-account__fact {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--cq-line);
}

.cq-account__fact-line {
  display: block;
  width: 28px;
  height: 2px;
  background: var(--cq-accent);
}

.cq-account__fact-value {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--cq-ink);
  overflow-wrap: anywhere;
}

.cq-account__fact-icon {
  flex-shrink: 0;
  color: var(--cq-accent-text);
}

.cq-account__note {
  max-width: 42ch;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--cq-ink-soft);
}

/* Sign-in dialog */
.cq-account__scrim {
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

.cq-account__dialog {
  display: grid;
  gap: var(--cq-t3);
  width: min(100%, 32rem);
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  padding: clamp(20px, 3vw, 30px);
  background: var(--cq-sheet);
  border: 1px solid var(--cq-line-strong);
  border-top: 3px solid var(--cq-accent);
  border-radius: var(--cq-radius);
  box-shadow: var(--cq-shadow);
}

.cq-account__dialog-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.cq-account__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  min-width: 0;
  font-size: 1.15rem;
}

.cq-account__wordmark {
  font-family: var(--cq-display);
  font-weight: 620;
  letter-spacing: -0.03em;
  color: var(--cq-ink);
}

.cq-account__wordmark-accent {
  color: var(--cq-accent-text);
}

.cq-account__dialog-title {
  display: grid;
  gap: 4px;
}

.cq-account__form {
  display: grid;
  gap: 12px;
}

.cq-account__submit {
  width: 100%;
}

.cq-account__divider {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--cq-mono);
  font-size: 0.66rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--cq-muted);
}

.cq-account__divider-line {
  flex: 1;
  height: 1px;
  background: var(--cq-line);
}

.cq-account__wallets {
  display: grid;
  gap: 8px;
}

.cq-account__wallet {
  width: 100%;
  justify-content: flex-start;
  font-family: var(--cq-body);
  font-size: 0.88rem;
  letter-spacing: 0;
  text-transform: none;
}

.cq-account__installed {
  margin-left: auto;
}

.cq-account__preview {
  padding-top: 4px;
  border-top: 1px dashed var(--cq-line-strong);
}

@media (max-width: 960px) {
  .cq-account__headedge {
    align-items: flex-start;
  }

  .cq-account__plate {
    max-width: 100%;
  }
}

@media (max-width: 560px) {
  .cq-account__title {
    font-size: clamp(40px, 15vw, 64px);
  }

  .cq-account__plate {
    min-height: 250px;
    padding: 18px;
  }

  .cq-account__plate-art {
    right: -18%;
    bottom: -8%;
    width: 88%;
  }

  .cq-account__empty {
    max-width: 24ch;
  }

  .cq-account__dialog {
    padding: 18px;
    max-height: calc(100dvh - 24px);
  }

  .cq-account__scrim {
    padding: 12px;
  }
}
</style>
