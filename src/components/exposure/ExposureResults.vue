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
  public: "cq-tone-warn",
  hidden: "cq-tone-accent",
  noKey: "cq-tone-muted",
  watch: "cq-tone-note",
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
  <div class="cq-results">
    <!-- Problems ------------------------------------------------------- -->
    <section v-if="result.problems?.length" class="cq-results__problems">
      <h2 class="cq-results__ptitle">
        <Icon name="triangle-alert" :size="16" class="cq-results__picon" />
        {{ total ? "Some lines were not read" : "Nothing was checked" }}
      </h2>
      <ul class="cq-results__plist">
        <li v-for="(problem, index) in result.problems" :key="index" class="cq-results__problem">
          {{ problem }}
        </li>
      </ul>
    </section>

    <!-- Money at risk -------------------------------------------------- -->
    <section v-if="total" class="cq-sheet cq-results__sheet">
      <header class="cq-results__head">
        <Icon name="eye" :size="16" class="cq-results__hicon cq-tone-warn" />
        <h2 class="cq-results__htitle">Money at risk</h2>
        <span class="cq-tag cq-results__count">{{ countLabel }}</span>
      </header>

      <div class="cq-results__body">
        <template v-if="addresses">
          <dl class="cq-results__buckets">
            <div v-for="bucket in BUCKETS" :key="bucket.key" class="cq-results__bucket">
              <dt class="cq-results__bucketlabel">{{ bucket.key === "public" ? "Behind a public key" : bucket.label }}</dt>
              <dd class="cq-results__bucketvalue cq-num" :class="bucket.tone">{{ bucket.count }}</dd>
            </div>
          </dl>

          <span aria-hidden="true" class="cq-meter cq-results__meter">
            <span
              class="cq-meter__fill cq-results__fill-public"
              :style="{ width: `${(counts.public / addresses) * 100}%` }"
            />
            <span
              class="cq-meter__fill cq-results__fill-hidden"
              :style="{ width: `${(counts.hidden / addresses) * 100}%` }"
            />
          </span>

          <p class="cq-small">
            <template v-if="counts.public">
              {{ share }}% of what you pasted sits behind a public key that is already on chain.
            </template>
            <template v-else>
              Nothing you pasted shows a public key on chain. Every key behind these addresses is
              still behind a hash.
            </template>
          </p>
        </template>

        <p v-else class="cq-small">
          A wallet key is walked address by address until 20 in a row have never received. Its own
          keys stay behind a hash until an address spends.
        </p>
      </div>

      <ul class="cq-results__rows">
        <li
          v-for="(row, index) in rows"
          :key="`${row.raw}-${index}`"
          class="cq-results__row"
        >
          <Icon :name="row.meta.icon" :size="16" class="cq-results__ricon" :class="row.meta.tone" />
          <span class="cq-results__rbody">
            <span class="cq-results__addr">{{ row.address }}</span>
            <span class="cq-small">{{ row.short }}</span>
            <span v-if="row.spend" class="cq-tiny cq-results__spend">{{ row.spend }}</span>
            <span class="cq-results__meta">
              <template v-if="row.chainLabel">{{ row.chainLabel }}</template>
              <template v-if="row.chainLabel && row.typeLabel"> · </template>
              <template v-if="row.typeLabel">{{ row.typeLabel }}</template>
              <template v-else-if="row.prefix">Bitcoin · {{ row.prefix }}</template>
            </span>
          </span>
          <AppBadge :tone="row.meta.badge">{{ row.meta.label }}</AppBadge>
        </li>
      </ul>

      <p class="cq-results__foot cq-tiny">
        Some balances could not be read or priced, so the totals may count less. This check reads the
        address itself: nothing is stored, and no wallet connects.
      </p>
    </section>

    <!-- One calm step -------------------------------------------------- -->
    <section v-if="total && result.next" class="cq-sheet cq-results__sheet">
      <header class="cq-results__head">
        <Icon name="compass" :size="16" class="cq-results__hicon cq-tone-accent" />
        <h2 class="cq-results__htitle">One calm step</h2>
      </header>
      <div class="cq-results__next">
        <p class="cq-h4">Next step</p>
        <p class="cq-h3">{{ result.next.title }}</p>
        <p class="cq-small">{{ result.next.body }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cq-results {
  display: grid;
  gap: clamp(16px, 2vw, 24px);
  min-width: 0;
}

/* problems ------------------------------------------------------------ */
.cq-results__problems {
  display: grid;
  gap: 8px;
  padding: 16px 20px;
  background: var(--cq-alert-surface);
  border: 1px solid color-mix(in srgb, var(--cq-alert) 32%, transparent);
  border-left: 3px solid var(--cq-alert);
  border-radius: var(--cq-radius-sm);
}

.cq-results__ptitle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--cq-display);
  font-size: 1rem;
  font-weight: 620;
  letter-spacing: -0.01em;
  color: var(--cq-alert);
}

.cq-results__picon {
  flex: 0 0 auto;
}

.cq-results__plist {
  display: grid;
  gap: 5px;
  padding-left: 24px;
  list-style: disc;
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--cq-alert);
}

.cq-results__problem {
  overflow-wrap: anywhere;
}

/* ledger sheets ------------------------------------------------------- */
.cq-results__sheet {
  min-width: 0;
  overflow: clip;
}

.cq-results__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 16px clamp(18px, 3vw, 28px);
  border-bottom: 1px solid var(--cq-line);
  background: var(--cq-sheet-soft);
}

.cq-results__hicon {
  flex: 0 0 auto;
}

.cq-results__htitle {
  font-family: var(--cq-display);
  font-size: clamp(1.1rem, 1.8vw, 1.4rem);
  font-weight: var(--cq-display-weight);
  letter-spacing: var(--cq-display-tracking);
  line-height: 1;
  color: var(--cq-ink);
}

.cq-results__count {
  margin-left: auto;
}

.cq-results__body {
  display: grid;
  gap: clamp(14px, 2vw, 20px);
  padding: clamp(18px, 3vw, 28px);
}

.cq-results__buckets {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border: 1px solid var(--cq-line);
  border-radius: var(--cq-radius-sm);
  background: var(--cq-sheet-soft);
  overflow: clip;
}

.cq-results__bucket {
  display: grid;
  gap: 5px;
  padding: 14px 18px;
  border-left: 1px solid var(--cq-line);
}

.cq-results__bucket:first-child {
  border-left: 0;
}

.cq-results__bucketlabel {
  font-family: var(--cq-mono);
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cq-muted);
}

.cq-results__bucketvalue {
  font-family: var(--cq-display);
  font-size: clamp(1.4rem, 2.4vw, 1.9rem);
  font-weight: 620;
  letter-spacing: -0.03em;
  line-height: 1;
}

.cq-results__meter {
  display: flex;
  height: 6px;
  border-radius: 0;
}

.cq-results__fill-public {
  background: var(--cq-warn);
  transition: width 500ms var(--cq-ease);
}

.cq-results__fill-hidden {
  background: var(--cq-accent);
  transition: width 500ms var(--cq-ease);
}

/* rows ---------------------------------------------------------------- */
.cq-results__rows {
  border-top: 1px solid var(--cq-line);
}

.cq-results__row {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  align-items: start;
  gap: 10px;
  padding: 13px clamp(18px, 3vw, 28px);
  border-top: 1px solid var(--cq-line-soft);
}

.cq-results__row:first-child {
  border-top: 0;
}

.cq-results__ricon {
  margin-top: 2px;
}

.cq-results__rbody {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.cq-results__addr {
  font-family: var(--cq-mono);
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--cq-ink);
  overflow-wrap: anywhere;
}

.cq-results__spend {
  color: var(--cq-muted);
}

.cq-results__meta {
  font-family: var(--cq-mono);
  font-size: 0.68rem;
  letter-spacing: 0.02em;
  color: var(--cq-muted);
  overflow-wrap: anywhere;
}

.cq-results__foot {
  display: block;
  padding: 13px clamp(18px, 3vw, 28px);
  border-top: 1px solid var(--cq-line);
  background: var(--cq-sheet-soft);
}

.cq-results__next {
  display: grid;
  gap: 6px;
  padding: clamp(18px, 3vw, 28px);
}

.cq-results__next .cq-h4 {
  color: var(--cq-accent-text);
}

@media (max-width: 560px) {
  .cq-results__buckets {
    grid-template-columns: minmax(0, 1fr);
  }

  .cq-results__bucket {
    border-left: 0;
    border-top: 1px solid var(--cq-line);
  }

  .cq-results__bucket:first-child {
    border-top: 0;
  }
}
</style>
