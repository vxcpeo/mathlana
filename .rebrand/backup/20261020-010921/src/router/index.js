import { createRouter, createWebHistory } from "vue-router";
import { CHALLENGES } from "@/data/challenges";
import { ALL_TOKENS } from "@/data/tokens";

/** "Tokens · Mathlana" — the separator the reference uses in every <title>. */
const t = (page) => `${page} · Mathlana`;

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
    meta: { title: "Mathlana: When do Bitcoin, Ethereum and Solana wallets break?" },
  },
  {
    path: "/tokens",
    name: "tokens",
    component: () => import("@/views/TokensView.vue"),
    meta: { title: t("Tokens") },
  },
  {
    path: "/t/:mint",
    name: "token",
    component: () => import("@/views/TokenDetailView.vue"),
    // Resolved per token: "Quantum Sword Cat ($QSC) · Mathlana".
    meta: { title: t("Token") },
  },
  {
    path: "/challenges",
    name: "challenges",
    component: () => import("@/views/ChallengesView.vue"),
    meta: { title: t("Challenges") },
  },
  {
    path: "/challenges/:slug",
    name: "challenge",
    component: () => import("@/views/ChallengeDetailView.vue"),
    // Resolved per challenge: "sig.golf · Mathlana".
    meta: { title: t("Challenge") },
  },
  {
    path: "/q-day",
    name: "q-day",
    component: () => import("@/views/QDayView.vue"),
    meta: { title: t("Q-Day clock") },
  },
  {
    path: "/launch",
    name: "launch",
    component: () => import("@/views/LaunchView.vue"),
    meta: { title: t("Launch a token") },
  },
  {
    path: "/exposure",
    name: "exposure",
    component: () => import("@/views/ExposureView.vue"),
    meta: { title: t("Exposure check") },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/AboutView.vue"),
    meta: { title: t("About Mathlana") },
  },
  {
    path: "/terms",
    name: "terms",
    component: () => import("@/views/TermsView.vue"),
    meta: { title: t("Terms") },
  },
  {
    path: "/privacy",
    name: "privacy",
    component: () => import("@/views/PrivacyView.vue"),
    meta: { title: t("Privacy") },
  },
  {
    path: "/risks",
    name: "risks",
    component: () => import("@/views/RisksView.vue"),
    meta: { title: t("Risks") },
  },
  {
    path: "/account",
    name: "account",
    component: () => import("@/views/AccountView.vue"),
    meta: { title: t("Your tokens") },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFoundView.vue"),
    meta: { title: t("Nothing here") },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    if (to.hash) return { el: to.hash, behavior: "smooth", top: 80 };
    return { top: 0 };
  },
});

/**
 * Titles for the parameterised routes come from the same data the pages render,
 * so they read exactly like the reference's: the challenge name for
 * `/challenges/:slug`, and "<name> (<ticker>)" for `/t/:mint`.
 */
function resolveTitle(to) {
  if (to.name === "challenge") {
    const challenge = CHALLENGES.find((c) => c.slug === to.params.slug);
    if (challenge) return t(challenge.name);
    return t("No such challenge");
  }
  if (to.name === "token") {
    const token = ALL_TOKENS.find((candidate) => candidate.mint === to.params.mint);
    if (token) return t(`${token.name} (${token.ticker})`);
    return t("No token at that address");
  }
  return null;
}

router.afterEach((to) => {
  document.title = resolveTitle(to) ?? to.meta?.title ?? "Mathlana";
});
