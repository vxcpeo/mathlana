<script setup>
/**
 * `/challenges` — the two threat families, each fronted by a ruled group band
 * and followed by a ledger of the public problems that measure it.
 */
import ChallengeCard from "@/components/challenges/ChallengeCard.vue";
import ChallengeIcon from "@/components/challenges/ChallengeIcon.vue";
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
  <div class="pp-page pp-groups">
    <div class="pp-head">
      <div class="pp-head__row pp-groups__head">
        <div class="pp-stack pp-groups__intro">
          <h1 class="pp-runhead">{{ CHALLENGES_PAGE.title }}</h1>
          <p class="pp-lede">{{ CHALLENGES_PAGE.subtitle }}</p>
        </div>

        <ol class="pp-gindex">
          <li v-for="group in GROUPS" :key="group.key" class="pp-gindex__item">
            <a :href="`#group-${group.key}`" :aria-label="group.title" class="pp-gindex__link">
              <span class="pp-gindex__num" aria-hidden="true" />
              <ChallengeIcon :name="group.icon" class="pp-gindex__icon" />
            </a>
          </li>
        </ol>
      </div>
    </div>

    <section
      v-for="group in GROUPS"
      :key="group.key"
      :id="`group-${group.key}`"
      class="pp-sec pp-group"
    >
      <ThreatGroupHeader
        :title="group.title"
        :subtitle="group.subtitle"
        :icon="group.icon"
        :art="group.art"
      />

      <div v-for="block in group.blocks" :key="block.label" class="pp-group__block">
        <div class="pp-sec__head pp-group__label">
          <p class="pp-h4">{{ block.label }}</p>
        </div>

        <ul class="pp-ledger pp-cards">
          <template v-for="item in block.items" :key="item.key">
            <li class="pp-cards__item">
              <ChallengeCard
                v-if="item.challenge.open"
                :challenge="item.challenge"
                :copy="CARD_COPY[item.key]"
              />
              <UpcomingCard v-else :challenge="item.challenge" :copy="CARD_COPY[item.key]" />
            </li>
          </template>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.pp-groups {
  counter-reset: ppgroup;
}

.pp-groups__head {
  align-items: end;
  gap: var(--pp-t4);
}

.pp-groups__intro {
  min-width: 0;
  max-width: 56rem;
  gap: var(--pp-t3);
}

.pp-gindex {
  display: flex;
  flex-shrink: 0;
  gap: 10px;
  counter-reset: ppgindex;
}

.pp-gindex__link {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--pp-line);
  border-radius: 999px;
  color: var(--pp-muted);
  transition: color var(--pp-fast) var(--pp-ease), border-color var(--pp-fast) var(--pp-ease),
    background-color var(--pp-fast) var(--pp-ease);
}

.pp-gindex__link:hover {
  color: var(--pp-accent-text);
  border-color: var(--pp-accent-line);
  background: var(--pp-accent-soft);
}

.pp-gindex__num {
  counter-increment: ppgindex;
  font-family: var(--pp-mono);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
}

.pp-gindex__num::before {
  content: counter(ppgindex, decimal-leading-zero);
}

.pp-gindex__item {
  display: flex;
}

.pp-gindex__icon {
  width: 14px;
  height: 14px;
  align-self: center;
}

.pp-group {
  padding-top: var(--pp-t5);
}

.pp-group__block {
  margin-top: var(--pp-t4);
  padding-top: var(--pp-t3);
  border-top: 1px solid var(--pp-line);
}

.pp-group__label {
  margin-bottom: 0;
}

.pp-cards {
  border-top: 0;
}

.pp-cards__item {
  display: block;
  min-width: 0;
}

@media (max-width: 720px) {
  .pp-groups__head {
    align-items: start;
  }
}
</style>
