<script setup>
/**
 * Privacy — full prose reproduced verbatim from the reference page.
 *
 * Generated from the site's server-rendered markup so punctuation and
 * clause order match the reference byte for byte.
 */
import LegalArticle from "@/components/legal/LegalArticle.vue";
import LegalSection from "@/components/legal/LegalSection.vue";

const SECTIONS = [
  {
    n: "01",
    title: "What we store",
    body: "Your wallet address and, if you sign in by email, your email address, through Privy. The tokens you launch, the messages you send your token's agent, and the quantum runs it makes, all of which are public.",
  },
  {
    n: "02",
    title: "Quantum portraits",
    body: "For a quantum portrait, your browser sends a small brightness grid and a colour thumbnail of your picture, never the file itself. The programs made from them and the machine's answers are kept with the run, and the drawn picture becomes your token's public image.",
  },
  {
    n: "03",
    title: "The exposure check",
    body: "What you paste reaches our server in the body of a request, never in a link, and is not saved or logged. Our server looks it up for you, so your own connection never reaches the explorers and chain providers it asks.",
  },
  {
    n: "04",
    title: "What is public",
    body: "Everything on Solana is public, and so is everything a token's agent does: its chat, its searches, its tool results and every creator message.",
  },
  {
    n: "05",
    title: "Who processes it",
    body: "Privy for sign-in, a launch and fee-routing service for launches and each token's AI/Quantum pool, Vercel for hosting, and the AI model providers the agent's calls are routed to, which see the agent's work but nothing about you. IBM Quantum and Amazon Braket run quantum programs. mempool.space and Ethereum and Solana node providers answer the chain lookups.",
  },
  {
    n: "06",
    title: "Your choices",
    html: "You can sign out at any time. To have your email deleted, or for any question about your data, write to <a href=\"mailto:privacy@qubitess.xyz\" class=\"cq-link\">privacy@qubitess.xyz</a>.",
  },
];
</script>

<template>
  <LegalArticle title="Privacy" current="privacy">
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
