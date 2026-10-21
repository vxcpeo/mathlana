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
  { key: "public", ...VISIBILITY.public, count: counts.value.public },
  { key: "hidden", ...VISIBILITY.hidden, count: counts.value.hidden },
  { key: "noKey", ...VISIBILITY.noKey, count: counts.value.noKey },
]);

const rows = computed(() =>
  (props.result.entries ?? []).map((entry) => ({
    ...entry,
    meta: VISIBILITY[entry.visibility] ?? VISIBILITY.hidden,
    chainLabel: CHAIN_LABELS[entry.chain] ?? "",
    typeLabel: TYPE_LABELS[entry.type] ?? "",
  })),
);
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Problems ------------------------------------------------------- -->
    <section
      v-if="result.problems?.length"
      class="overflow-hidden rounded-xl border border-failed-border"
    >
      <h2
        class="flex items-center gap-2 border-b border-failed-border bg-failed-surface px-5 py-2.5 font-heading text-sm font-semibold tracking-[-0.01em] text-failed-text"
      >
        <Icon name="triangle-alert" class="size-4 shrink-0" />
        {{ total ? "Some lines were not read" : "Nothing was checked" }}
      </h2>
      <ul class="flex flex-col divide-y divide-failed-border/60">
        <li
          v-for="(problem, index) in result.problems"
          :key="index"
          class="px-5 py-2.5 text-xs leading-relaxed text-pretty text-failed-text"
        >
          {{ problem }}
        </li>
      </ul>
    </section>

    <!-- Money at risk -------------------------------------------------- -->
    <section v-if="total" class="overflow-hidden rounded-xl border bg-card">
      <h2
        class="flex items-center gap-2 border-b px-5 py-2.5 font-heading text-sm font-semibold tracking-[-0.01em]"
      >
        <Icon name="eye" class="size-4 shrink-0 text-caution-text" />
        Money at risk
        <span class="ml-auto font-sans text-xs font-normal text-muted-foreground figures">
          {{ countLabel }}
        </span>
      </h2>

      <div class="flex flex-col gap-4 px-5 py-4">
        <template v-if="addresses">
          <dl class="grid grid-cols-3 gap-4">
            <div v-for="bucket in BUCKETS" :key="bucket.key" class="flex min-w-0 flex-col gap-1">
              <dt class="text-[0.7rem] font-medium tracking-[0.08em] text-quiet uppercase">
                {{ bucket.key === "public" ? "Behind a public key" : bucket.label }}
              </dt>
              <dd
                class="font-mono text-2xl leading-none font-medium tracking-tight figures"
                :class="bucket.tone"
              >
                {{ bucket.count }}
              </dd>
            </div>
          </dl>

          <span aria-hidden="true" class="flex h-1 overflow-hidden rounded-full bg-muted">
            <span
              class="block h-full bg-caution transition-[width] duration-500"
              :style="{ width: `${(counts.public / addresses) * 100}%` }"
            />
            <span
              class="block h-full bg-brand transition-[width] duration-500"
              :style="{ width: `${(counts.hidden / addresses) * 100}%` }"
            />
          </span>

          <p class="text-xs text-pretty text-muted-foreground">
            <template v-if="counts.public">
              {{ share }}% of what you pasted sits behind a public key that is already on chain.
            </template>
            <template v-else>
              Nothing you pasted shows a public key on chain. Every key behind these addresses is
              still behind a hash.
            </template>
          </p>
        </template>

        <p v-else class="text-xs text-pretty text-muted-foreground">
          A wallet key is walked address by address until 20 in a row have never received. Its own
          keys stay behind a hash until an address spends.
        </p>
      </div>

      <ul class="flex flex-col divide-y border-t">
        <li
          v-for="(row, index) in rows"
          :key="`${row.raw}-${index}`"
          class="grid grid-cols-[1.125rem_minmax(0,1fr)_auto] items-start gap-x-3 px-5 py-3.5"
        >
          <Icon :name="row.meta.icon" class="mt-0.5 size-4 shrink-0" :class="row.meta.tone" />
          <span class="flex min-w-0 flex-col gap-0.5">
            <span class="font-mono text-xs break-all text-foreground">{{ row.address }}</span>
            <span class="text-xs text-pretty text-muted-foreground">{{ row.short }}</span>
            <span v-if="row.spend" class="text-xs text-pretty text-quiet">{{ row.spend }}</span>
            <span class="text-[0.7rem] text-quiet">
              <template v-if="row.chainLabel">{{ row.chainLabel }}</template>
              <template v-if="row.chainLabel && row.typeLabel"> · </template>
              <template v-if="row.typeLabel">{{ row.typeLabel }}</template>
              <template v-else-if="row.prefix">Bitcoin · {{ row.prefix }}</template>
            </span>
          </span>
          <span class="flex items-center gap-2">
            <AppBadge :tone="row.meta.badge">{{ row.meta.label }}</AppBadge>
          </span>
        </li>
      </ul>

      <p class="border-t px-5 py-2.5 text-[0.72rem] text-pretty text-quiet">
        Some balances could not be read or priced, so the totals may count less. This check reads the
        address itself: nothing is stored, and no wallet connects.
      </p>
    </section>

    <!-- One calm step -------------------------------------------------- -->
    <section v-if="total && result.next" class="overflow-hidden rounded-xl border bg-card">
      <h2
        class="flex items-center gap-2 border-b px-5 py-2.5 font-heading text-sm font-semibold tracking-[-0.01em]"
      >
        <Icon name="compass" class="size-4 shrink-0 text-brand-text" />
        One calm step
      </h2>
      <div class="flex flex-col gap-1.5 px-5 py-4">
        <p class="text-[0.7rem] font-medium tracking-[0.08em] text-quiet uppercase">Next step</p>
        <p class="font-heading text-sm font-semibold tracking-[-0.01em]">{{ result.next.title }}</p>
        <p class="text-sm leading-relaxed text-pretty text-muted-foreground">
          {{ result.next.body }}
        </p>
      </div>
    </section>
  </div>
</template>
