<script setup>
/**
 * `/account` — the signed-out account page.
 *
 * The page shell is the reference's: "Your tokens", and a card asking you to
 * sign in. The reference hands sign-in to Privy with the copy
 * "Sign in to Mathlana" / "By email or with a Solana wallet"; here that panel is
 * rendered inline and resolved entirely in the browser — the email path never
 * leaves the page and the wallet path only calls `window.solana` /
 * `window.solflare` when the extension is installed. No external auth API is
 * contacted.
 */
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
import Icon from "@/components/ui/Icon.vue";
import BrandMark from "@/components/brand/BrandMark.vue";
import { shortAddress } from "@/lib/format";

/* Copy taken from the reference's message catalogue. */
const WORDS = {
  title: "Your tokens",
  signIn: "Sign in",
  signOut: "Sign out",
  signedInAs: "Signed in as {who}",
  signInPrompt: "Sign in to see the tokens you launched.",
  empty: "You haven't launched a token yet.",
  landingHeader: "Sign in to Mathlana",
  loginMessage: "By email or with a Solana wallet",
  cancelled: "Sign-in was closed before it finished.",
  invalid: "That didn't work. Try again.",
};

const WALLETS = [
  { key: "phantom", name: "Phantom" },
  { key: "solflare", name: "Solflare" },
];

const STORAGE_KEY = "mathlana:signin";

const INPUT =
  "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:h-10";

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
  <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
    <h1 class="headline text-4xl">{{ WORDS.title }}</h1>

    <div v-if="account" class="flex flex-col items-start gap-4 rounded-xl border bg-card p-6">
      <div class="flex flex-wrap items-center gap-3">
        <span class="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="wallet" class="size-4 text-brand-text" />
          {{ signedInLabel }}
        </span>
        <AppButton variant="outline" size="sm" @click="signOut">
          {{ WORDS.signOut }}
        </AppButton>
      </div>
      <p class="text-sm text-muted-foreground">{{ WORDS.empty }}</p>
    </div>

    <div v-else class="flex flex-col items-start gap-4 rounded-xl border bg-card p-6">
      <p class="text-sm text-muted-foreground">{{ WORDS.signInPrompt }}</p>
      <AppButton @click="openPanel">{{ WORDS.signIn }}</AppButton>
    </div>

    <!-- Sign-in panel. Stands in for the reference's Privy modal. -->
    <div
      v-if="panelOpen"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm"
      role="presentation"
      @click.self="closePanel"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-title"
        class="flex w-full max-w-sm flex-col gap-5 rounded-xl border bg-card p-6 shadow-lg"
      >
        <div class="flex items-start justify-between gap-4">
          <span
            class="inline-flex items-center gap-[0.5em] text-lg"
            role="img"
            aria-label="Mathlana"
          >
            <BrandMark />
            <span
              aria-hidden="true"
              translate="no"
              class="font-heading font-semibold tracking-[-0.01em] text-foreground"
              >Math<span style="color: #6c86ff">lana</span></span
            >
          </span>
          <AppButton variant="ghost" size="icon" aria-label="Close" @click="closePanel">
            <Icon name="x" />
          </AppButton>
        </div>

        <div class="flex flex-col gap-1">
          <h2 id="signin-title" class="font-heading text-lg font-semibold tracking-[-0.01em]">
            {{ WORDS.landingHeader }}
          </h2>
          <p class="text-sm text-muted-foreground">{{ WORDS.loginMessage }}</p>
        </div>

        <form class="flex flex-col gap-2" @submit.prevent="signInWithEmail">
          <label for="signin-email" class="text-sm font-medium">Email</label>
          <input
            id="signin-email"
            v-model="email"
            data-slot="input"
            type="email"
            name="email"
            autocomplete="email"
            placeholder="you@example.com"
            :class="INPUT"
          />
          <AppButton type="submit" class="mt-1 w-full" :disabled="busy === 'email'">
            <Icon v-if="busy === 'email'" name="loader-circle" class="animate-spin" />
            {{ WORDS.signIn }}
          </AppButton>
        </form>

        <div class="flex items-center gap-3 text-xs text-muted-foreground">
          <span class="h-px flex-1 bg-border" />
          or
          <span class="h-px flex-1 bg-border" />
        </div>

        <div class="flex flex-col gap-2">
          <AppButton
            v-for="wallet in WALLETS"
            :key="wallet.key"
            variant="outline"
            class="w-full justify-start"
            :disabled="busy === wallet.key"
            @click="signInWithWallet(wallet.key)"
          >
            <Icon name="wallet" />
            Continue with {{ wallet.name }}
            <span
              v-if="installed[wallet.key]"
              class="ml-auto text-[0.7rem] font-normal text-muted-foreground"
              >Installed</span
            >
          </AppButton>
        </div>

        <p v-if="notice" class="text-xs leading-relaxed text-failed-text">{{ notice }}</p>
        <p
          v-else-if="walletHint"
          class="text-xs leading-relaxed text-muted-foreground"
        >
          {{ walletHint }}
        </p>

        <p class="text-xs leading-relaxed text-quiet">
          This preview keeps the session in your browser only. No email is sent and no
          account is created.
        </p>
      </div>
    </div>
  </div>
</template>
