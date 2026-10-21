<script setup>
/**
 * `/challenges` — the two threat families as numbered ledger sheets: a dark
 * running band per family, then hairline-separated challenge rows.
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
  <div class="cq-page cq-chmap">
    <header class="cq-pagehead cq-chmap__pagehead">
      <div class="cq-pagehead__head">
        <p class="cq-kicker cq-chmap__kicker" aria-hidden="true"></p>
        <h1 class="cq-runhead">{{ CHALLENGES_PAGE.title }}</h1>
      </div>

      <div class="cq-pagehead__edge">
        <p class="cq-lede cq-chmap__lede">{{ CHALLENGES_PAGE.subtitle }}</p>

        <ol class="cq-chmap__jumps">
          <li v-for="group in GROUPS" :key="group.key" class="cq-chmap__jumpitem">
            <a :href="`#group-${group.key}`" :aria-label="group.title" class="cq-chmap__jump">
              <span class="cq-chmap__jumpnum" aria-hidden="true" />
              <ChallengeIcon :name="group.icon" class="cq-chmap__jumpicon" />
            </a>
          </li>
        </ol>
      </div>
    </header>

    <div class="cq-chmap__sheets">
      <section
        v-for="group in GROUPS"
        :key="group.key"
        :id="`group-${group.key}`"
        class="cq-sheet cq-chmap__group"
      >
        <ThreatGroupHeader
          :title="group.title"
          :subtitle="group.subtitle"
          :icon="group.icon"
          :art="group.art"
        />

        <div v-for="block in group.blocks" :key="block.label" class="cq-chmap__block">
          <div class="cq-chmap__blockhead">
            <p class="cq-h4">{{ block.label }}</p>
          </div>

          <ol class="cq-chmap__ledger">
            <li v-for="item in block.items" :key="item.key" class="cq-chmap__item">
              <ChallengeCard
                v-if="item.challenge.open"
                :challenge="item.challenge"
                :copy="CARD_COPY[item.key]"
              />
              <UpcomingCard v-else :challenge="item.challenge" :copy="CARD_COPY[item.key]" />
            </li>
          </ol>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.cq-chmap {
  counter-reset: cqgroup;
}

.cq-chmap__pagehead {
  align-items: start;
}

.cq-chmap__kicker {
  display: flex;
  min-height: 12px;
  margin: 0;
}

.cq-chmap__lede {
  max-width: 48ch;
  font-size: clamp(0.95rem, 1.1vw, 1.08rem);
  line-height: 1.6;
  color: var(--cq-muted);
}

.cq-chmap__jumps {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  margin: 4px 0 0;
  padding: 0;
  counter-reset: cqjump;
}

.cq-chmap__jumpitem {
  display: flex;
}

.cq-chmap__jump {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 8px 12px;
  border: 1px solid var(--cq-line);
  border-radius: 999px;
  color: var(--cq-muted);
  text-decoration: none;
  transition: color var(--cq-fast) var(--cq-ease), border-color var(--cq-fast) var(--cq-ease),
    background var(--cq-fast) var(--cq-ease);
}

.cq-chmap__jump:hover,
.cq-chmap__jump:focus-visible {
  color: var(--cq-accent-text);
  border-color: var(--cq-accent-line);
  background: var(--cq-accent-soft);
}

.cq-chmap__jumpnum {
  font-family: var(--cq-mono);
  font-size: 0.64rem;
  line-height: 1;
  letter-spacing: 0.12em;
}

.cq-chmap__jumpnum::before {
  counter-increment: cqjump;
  content: counter(cqjump, decimal-leading-zero);
}

.cq-chmap__jumpicon {
  width: 14px;
  height: 14px;
}

.cq-chmap__sheets {
  display: grid;
  gap: clamp(22px, 3vw, 38px);
}

.cq-chmap__group {
  counter-reset: cqledger;
  border-radius: var(--cq-radius-lg);
  scroll-margin-top: 108px;
}

.cq-chmap__blockhead {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 42px;
  padding: 12px clamp(20px, 2.6vw, 32px);
  border-top: 1px solid var(--cq-line);
  border-bottom: 1px solid var(--cq-line);
  background: var(--cq-sheet-soft);
}

.cq-chmap__blockhead .cq-h4 {
  margin: 0;
  max-width: 82ch;
  color: var(--cq-muted-ground);
  line-height: 1.5;
}

.cq-chmap__ledger {
  list-style: none;
  margin: 0;
  padding: 0;
}

.cq-chmap__item {
  min-width: 0;
}

.cq-chmap__item + .cq-chmap__item {
  border-top: 1px solid var(--cq-line-soft);
}

.cq-chmap__item:hover {
  background: color-mix(in srgb, var(--cq-sheet-soft) 58%, transparent);
}

@media (max-width: 960px) {
  .cq-chmap__pagehead {
    gap: 20px;
  }

  .cq-chmap__lede {
    max-width: 62ch;
  }
}

@media (max-width: 560px) {
  .cq-chmap__group {
    border-radius: var(--cq-radius);
  }

  .cq-chmap__blockhead {
    padding: 12px 16px;
  }
}
</style>
