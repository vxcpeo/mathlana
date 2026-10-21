<script setup>
/**
 * `/challenges` — the two threat families, each fronted by a wide header card
 * and followed by the public problems that measure it.
 */
import ChallengeCard from "@/components/challenges/ChallengeCard.vue";
import ThreatGroupHeader from "@/components/challenges/ThreatGroupHeader.vue";
import UpcomingCard from "@/components/challenges/UpcomingCard.vue";
import {
  CARD_COPY,
  CHALLENGES_PAGE,
  GROUP_HEADERS,
  GROUP_LABELS,
} from "@/components/challenges/presentation";
import { CHALLENGES, THREAT_GROUPS } from "@/data/challenges";

const bySlug = Object.fromEntries(CHALLENGES.map((challenge) => [challenge.slug, challenge]));

/** Group order and the sub-labels come straight off the reference page. */
const GROUPS = [
  {
    ...THREAT_GROUPS.quantum,
    art: GROUP_HEADERS.quantum.art,
    blocks: [
      { label: GROUP_LABELS.quantum, items: ["q-day", "ecdsa-fail"] },
    ],
  },
  {
    ...THREAT_GROUPS.math,
    art: GROUP_HEADERS.math.art,
    blocks: [
      { label: GROUP_LABELS.math, items: ["sig-golf", "proximity", "precompile-fast"] },
      { label: GROUP_LABELS.lattices, items: ["lattice-records"] },
    ],
  },
].map((group) => ({
  ...group,
  blocks: group.blocks.map((block) => ({
    ...block,
    items: block.items.map((slug) => ({ key: slug, challenge: bySlug[slug] })).filter((i) => i.challenge),
  })),
}));
</script>

<template>
  <div class="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 sm:py-14">
    <header class="flex max-w-2xl flex-col gap-2.5">
      <h1 class="headline text-4xl sm:text-5xl">{{ CHALLENGES_PAGE.title }}</h1>
      <p class="text-base text-pretty text-muted-foreground">{{ CHALLENGES_PAGE.subtitle }}</p>
    </header>

    <section v-for="group in GROUPS" :key="group.key" class="flex flex-col gap-4">
      <ThreatGroupHeader
        :title="group.title"
        :subtitle="group.subtitle"
        :icon="group.icon"
        :art="group.art"
      />

      <div v-for="block in group.blocks" :key="block.label" class="flex flex-col gap-3">
        <p class="px-1 text-[0.78rem] font-medium text-muted-foreground">{{ block.label }}</p>
        <div class="grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
          <template v-for="item in block.items" :key="item.key">
            <ChallengeCard
              v-if="item.challenge.open"
              :challenge="item.challenge"
              :copy="CARD_COPY[item.key]"
            />
            <UpcomingCard v-else :challenge="item.challenge" :copy="CARD_COPY[item.key]" />
          </template>
        </div>
      </div>
    </section>
  </div>
</template>
