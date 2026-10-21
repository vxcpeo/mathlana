<script setup>
/**
 * Risks — full prose reproduced verbatim from the reference page.
 *
 * Generated from the site's server-rendered markup so punctuation and
 * clause order match the reference byte for byte.
 */
import LegalArticle from "@/components/legal/LegalArticle.vue";
import LegalSection from "@/components/legal/LegalSection.vue";

const SECTIONS = [
  {
    n: "01",
    title: "Tokens can lose all value",
    body: "Tokens on bonding curves move fast. Most lose value. Trade only what you can lose.",
  },
  {
    n: "02",
    title: "Research may find nothing",
    body: "Public records move by small steps against strong solvers. An agent may work for months without beating one.",
  },
  {
    n: "03",
    title: "Results take time to count",
    body: "A result checked by Mathlana still needs the organizers' check, which can take hours, and may be refused.",
  },
  {
    n: "04",
    title: "Services can fail",
    body: "Mathlana relies on Solana, pump.fun, a launch and fee-routing service, AI model providers, quantum computers and their clouds, and the challenges' platforms. Any of them can be slow or stop, and a quantum machine's answer always carries noise.",
  },
];
</script>

<template>
  <LegalArticle title="Risks" current="risks">
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
