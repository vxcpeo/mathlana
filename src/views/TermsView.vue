<script setup>
/**
 * Terms — full prose reproduced verbatim from the reference page.
 *
 * Generated from the site's server-rendered markup so punctuation and
 * clause order match the reference byte for byte.
 */
import LegalArticle from "@/components/legal/LegalArticle.vue";
import LegalSection from "@/components/legal/LegalSection.vue";

const SECTIONS = [
  {
    n: "01",
    title: "What Qubitess is",
    body: "Qubitess is a website where anyone can launch a token on Solana through pump.fun. Its creator fees fill an AI/Quantum pool that pays for an AI agent and its runs on real quantum computers, working on public challenges about the threats to the cryptography that guards wallets: quantum computers and AI-accelerated math. Launches, fee routing and each token's AI/Quantum pool run through a launch and fee-routing service.",
  },
  {
    n: "02",
    title: "Your wallet, your launch",
    body: "You sign every launch with your own wallet, and you pay its costs. Qubitess never holds your keys or your funds. A launch on Solana can't be undone.",
  },
  {
    n: "03",
    title: "No promise of returns",
    body: "A token on Qubitess is not an investment product. Its fees pay for research, never for its holders, and research may find nothing. Prices can fall to zero.",
  },
  {
    n: "04",
    title: "Prizes",
    body: "Challenge organizers decide their awards on their own terms, and may give none. When an award reaches Qubitess for a token's result, Qubitess pays the same amount to that token's creator wallet. Qubitess promises no award.",
  },
  {
    n: "05",
    title: "What you may not launch",
    body: "No token may name or picture a real person, copy another project's brand, or show adult or hateful content. Qubitess may hide such a token and stop its research.",
  },
  {
    n: "06",
    title: "The research",
    body: "Agents work only inside the challenges' own rules, and Q‑Day attacks only practice keys drawn fresh for each run, never a key in use. Everything agents do is public. Qubitess may pause any agent at any time, and hides any finding that could harm a system in use until it is disclosed privately to the people who run it.",
  },
  {
    n: "07",
    title: "Quantum computers",
    body: "Quantum tasks and portraits run on machines reached through IBM Quantum and Amazon Braket. Their answers carry noise, a run can wait in a long queue, and it can fail. Every run is public, failures included. A token's tasks are paid from its own fees; a launch portrait is on Qubitess, within daily limits.",
  },
  {
    n: "08",
    title: "The exposure check",
    body: "The exposure check reads public chain records and says whether an address's public key is visible and what it holds now. It is information, not financial or security advice, and it can be incomplete. It never asks for a key or a signature, and any move of funds is your own decision.",
  },
  {
    n: "09",
    title: "No warranty",
    body: "Qubitess is provided as it is, without any warranty. To the extent the law allows, Qubitess is not liable for losses from using it, from tokens, or from services it relies on.",
  },
];
</script>

<template>
  <LegalArticle title="Terms" current="terms">
    <LegalSection
      v-for="section in SECTIONS"
      :key="section.n"
      :index="section.n"
      :title="section.title"
      :body="section.body"
      :html="section.html"
    />
  </LegalArticle>
</template>
