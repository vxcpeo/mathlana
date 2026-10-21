<script setup>
/**
 * The exposure answer: what sits behind a public key, what is still behind a
 * hash, each address on its own row, and the one calm step that fits.
 *
 * The wording is the reference site's own (`exposure.check.summary.*`,
 * `visibility.*`, `row.*`, `next.*`). Balances are never claimed: nothing is
 * fetched, so the totals count addresses rather than dollars.
 */
import { computed } from "vue";
import AppBadge from "@/components/ui/AppBadge.vue";
import Icon from "@/components/ui/Icon.vue";
import { CHAIN_LABELS, TYPE_LABELS, VISIBILITY } from "@/components/exposure/classify";

const props = defineProps({
  result: { type: Object, required: true },
});

/** Status colour per visibility class, in the blueprint's tone vocabulary. */
const TONES = {
  public: "pp-tone-warn",
  hidden: "pp-tone-accent",
  noKey: "pp-tone-muted",
  watch: "pp-tone-note",
};

const counts = computed(() => props.result.counts ?? { public: 0, hidden: 0, noKey: 0, watch: 0 });
const total = computed(() => props.result.entries?.length ?? 0);
/** Addresses proper — a wallet key is not an address of its own. */
const addresses = computed(() => total.value - counts.value.watch);
const onlyWatch = computed(() => total.value > 0 && addresses.value === 0);
const share = computed(() =>
  addresses.value ? Math.round((counts.value.public / addresses.value) * 100) : 0,
);
const countLabel = computed(() =>
  addresses.value
    ? `${addresses.value} ${addresses.value === 1 ? "address" : "addresses"}`
    : `${counts.value.watch} wallet ${counts.value.watch === 1 ? "key" : "keys"}`,
);

const BUCKETS = computed(() => [
  {
    key: "public",
    ...VISIBILITY.public,
    tone: TONES.public,
    count: counts.value.public,
  },
  {
    key: "hidden",
    ...VISIBILITY.hidden,
    tone: TONES.hidden,
    count: counts.value.hidden,
  },
  {
    key: "noKey",
    ...VISIBILITY.noKey,
    tone: TONES.noKey,
    count: counts.value.noKey,
  },
]);

const rows = computed(() =>
  (props.result.entries ?? []).map((entry) => ({
    ...entry,
    meta: { ...(VISIBILITY[entry.visibility] ?? VISIBILITY.hidden), tone: TONES[entry.visibility] ?? TONES.hidden },
    chainLabel: CHAIN_LABELS[entry.chain] ?? "",
    typeLabel: TYPE_LABELS[entry.type] ?? "",
  })),
);
</script>

<template>
  <div class="pp-results">
    <!-- Problems ------------------------------------------------------- -->
    <section v-if="result.problems?.length" class="pp-callout pp-callout--alert pp-results__problems">
      <h2 class="pp-results__ptitle">
        <Icon name="triangle-alert" :size="16" class="pp-results__picon" />
        {{ total ? "Some lines were not read" : "Nothing was checked" }}
      </h2>
      <ul class="pp-results__plist">
        <li v-for="(problem, index) in result.problems" :key="index" class="pp-results__problem">
          {{ problem }}
        </li>
      </ul>
    </section>

    <!-- Money at risk -------------------------------------------------- -->
    <section v-if="total" class="pp-sheet pp-results__sheet">
      <div class="pp-sheet__head">
        <div class="pp-sheet__head-row">
          <Icon name="eye" :size="16" class="pp-tone-warn" />
          <h2 class="pp-sheet__title">Money at risk</h2>
          <span class="pp-tag pp-results__count">{{ countLabel }}</span>
        </div>
      </div>

      <div class="pp-sheet__body pp-results__summary">
        <template v-if="addresses">
          <dl class="pp-stats pp-results__buckets">
            <div v-for="bucket in BUCKETS" :key="bucket.key" class="pp-stat">
              <dt class="pp-stat__label">{{ bucket.key === "public" ? "Behind a public key" : bucket.label }}</dt>
              <dd class="pp-stat__value pp-num" :class="bucket.tone">{{ bucket.count }}</dd>
            </div>
          </dl>

          <span aria-hidden="true" class="pp-meter pp-results__meter">
            <span
              class="pp-meter__fill pp-results__fill-public"
              :style="{ width: `${(counts.public / addresses) * 100}%` }"
            />
            <span
              class="pp-meter__fill pp-results__fill-hidden"
              :style="{ width: `${(counts.hidden / addresses) * 100}%` }"
            />
          </span>

          <p class="pp-small">
            <template v-if="counts.public">
              {{ share }}% of what you pasted sits behind a public key that is already on chain.
            </template>
            <template v-else>
              Nothing you pasted shows a public key on chain. Every key behind these addresses is
              still behind a hash.
            </template>
          </p>
        </template>

        <p v-else class="pp-small">
          A wallet key is walked address by address until 20 in a row have never received. Its own
          keys stay behind a hash until an address spends.
        </p>
      </div>

      <ul class="pp-ledger pp-results__rows">
        <li
          v-for="(row, index) in rows"
          :key="`${row.raw}-${index}`"
          class="pp-results__row"
        >
          <Icon :name="row.meta.icon" :size="16" class="pp-results__ricon" :class="row.meta.tone" />
          <span class="pp-results__rbody">
            <span class="pp-results__addr">{{ row.address }}</span>
            <span class="pp-small">{{ row.short }}</span>
            <span v-if="row.spend" class="pp-tiny pp-results__spend">{{ row.spend }}</span>
            <span class="pp-results__meta">
              <template v-if="row.chainLabel">{{ row.chainLabel }}</template>
              <template v-if="row.chainLabel && row.typeLabel"> · </template>
              <template v-if="row.typeLabel">{{ row.typeLabel }}</template>
              <template v-else-if="row.prefix">Bitcoin · {{ row.prefix }}</template>
            </span>
          </span>
          <AppBadge :tone="row.meta.badge">{{ row.meta.label }}</AppBadge>
        </li>
      </ul>

      <p class="pp-sheet__foot pp-tiny">
        Some balances could not be read or priced, so the totals may count less. This check reads the
        address itself: nothing is stored, and no wallet connects.
      </p>
    </section>

    <!-- One calm step -------------------------------------------------- -->
    <section v-if="total && result.next" class="pp-sheet pp-results__sheet">
      <div class="pp-sheet__head">
        <div class="pp-sheet__head-row">
          <Icon name="compass" :size="16" class="pp-tone-accent" />
          <h2 class="pp-sheet__title">One calm step</h2>
        </div>
      </div>
      <div class="pp-sheet__body pp-results__next">
        <p class="pp-h4">Next step</p>
        <p class="pp-h3">{{ result.next.title }}</p>
        <p class="pp-small">{{ result.next.body }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.pp-results {
  display: grid;
  gap: var(--pp-t3);
  min-width: 0;
}

.pp-results__sheet {
  min-width: 0;
}

.pp-results__problems {
  padding: 14px 18px;
}

.pp-results__ptitle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--pp-display);
  font-size: 1rem;
  font-weight: 620;
  letter-spacing: -0.01em;
  color: var(--pp-alert);
}

.pp-results__picon {
  flex: 0 0 auto;
}

.pp-results__plist {
  display: grid;
  gap: 6px;
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--pp-alert);
}

.pp-results__problem {
  overflow-wrap: anywhere;
}

.pp-results__count {
  margin-left: auto;
}

.pp-results__summary {
  gap: var(--pp-t3);
}

.pp-results__buckets {
  background: var(--pp-line-soft);
  border-color: var(--pp-line);
}

.pp-results__meter {
  display: flex;
  height: 6px;
}

.pp-results__fill-public {
  background: var(--pp-warn);
  transition: width 500ms var(--pp-ease);
}

.pp-results__fill-hidden {
  background: var(--pp-accent);
  transition: width 500ms var(--pp-ease);
}

.pp-results__rows {
  padding: 0 22px;
  border-top: 1px solid var(--pp-line);
}

.pp-results__row {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  align-items: start;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid var(--pp-line-soft);
}

.pp-results__row:last-child {
  border-bottom: 0;
}

.pp-results__ricon {
  margin-top: 2px;
}

.pp-results__rbody {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.pp-results__addr {
  font-family: var(--pp-mono);
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--pp-ink);
  overflow-wrap: anywhere;
}

.pp-results__spend {
  color: var(--pp-muted);
}

.pp-results__meta {
  font-family: var(--pp-mono);
  font-size: 0.68rem;
  letter-spacing: 0.02em;
  color: var(--pp-muted);
  overflow-wrap: anywhere;
}

.pp-results__next {
  gap: 6px;
}

@media (max-width: 560px) {
  .pp-results__rows {
    padding-inline: 16px;
  }
}
</style>
