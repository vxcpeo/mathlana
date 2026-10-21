<script setup>
/** One challenge row inside a threat ledger. */
import Icon from "@/components/ui/Icon.vue";

defineProps({
  to: { type: String, required: true },
  ariaLabel: { type: String, default: null },
  icon: { type: String, required: true },
  /** Row title, optionally followed by an inline qualifier (e.g. "Point addition"). */
  title: { type: String, required: true },
  qualifier: { type: String, default: null },
  description: { type: String, default: null },
  value: { type: String, required: true },
  unit: { type: String, default: null },
  /** Small line under the value ("No token on it yet"). */
  note: { type: String, default: null },
  /** 0-100; when set, renders the rail plus the label on the right. */
  progress: { type: Number, default: null },
  progressLabel: { type: String, default: null },
  /** Tint the value (the Q-Day clock uses brand; metrics use foreground). */
  valueTone: { type: String, default: "foreground" },
});
</script>

<template>
  <li class="cq-trow">
    <RouterLink :to="to" :aria-label="ariaLabel ?? undefined" class="cq-trow__link">
      <span class="cq-trow__glyph" aria-hidden="true">
        <Icon :name="icon" :size="15" />
      </span>

      <span class="cq-trow__main">
        <span class="cq-trow__title">
          {{ title }}
          <span v-if="qualifier" class="cq-trow__qualifier">{{ qualifier }}</span>
        </span>
        <span v-if="description" class="cq-trow__desc">{{ description }}</span>
      </span>

      <span class="cq-trow__readout">
        <span class="cq-trow__value" :class="valueTone === 'brand' ? 'cq-tone-accent' : ''">
          <span class="cq-num">{{ value }}</span>
          <span v-if="unit" class="cq-trow__unit">{{ unit }}</span>
        </span>
        <span v-if="note" class="cq-trow__note">{{ note }}</span>
      </span>

      <Icon name="arrow-up-right" :size="13" class="cq-trow__arrow" />

      <span v-if="progress !== null" class="cq-trow__meter">
        <span aria-hidden="true" class="cq-meter">
          <span
            class="cq-meter__fill"
            :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }"
          />
        </span>
        <span v-if="progressLabel" class="cq-trow__meterlabel cq-num">{{ progressLabel }}</span>
      </span>
    </RouterLink>
  </li>
</template>

<style scoped>
.cq-trow {
  border-bottom: 1px solid var(--cq-line-soft);
}

.cq-trow__link {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) auto 14px;
  align-items: start;
  gap: 10px;
  padding: 13px 4px;
  transition: background-color var(--cq-fast) var(--cq-ease);
}

.cq-trow__link:hover {
  background: var(--cq-sheet-soft);
}

.cq-trow__glyph {
  color: var(--cq-accent-text);
  padding-top: 2px;
}

.cq-trow__main {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.cq-trow__title {
  font-family: var(--cq-display);
  font-size: 0.92rem;
  font-weight: 620;
  letter-spacing: -0.01em;
  color: var(--cq-ink);
}

.cq-trow__qualifier {
  font-family: var(--cq-body);
  font-size: 0.76rem;
  font-weight: 400;
  color: var(--cq-muted);
}

.cq-trow__desc {
  font-size: 0.76rem;
  color: var(--cq-muted);
}

.cq-trow__readout {
  display: grid;
  justify-items: end;
  gap: 2px;
  text-align: right;
}

.cq-trow__value {
  display: flex;
  align-items: baseline;
  gap: 5px;
  font-size: 0.95rem;
  color: var(--cq-ink);
  white-space: nowrap;
}

.cq-trow__unit,
.cq-trow__note {
  font-size: 0.68rem;
  color: var(--cq-muted);
  white-space: nowrap;
}

.cq-trow__arrow {
  margin-top: 3px;
  color: var(--cq-muted);
}

.cq-trow__meter {
  grid-column: 2 / -1;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 2px;
}

.cq-trow__meter .cq-meter {
  flex: 1;
}

.cq-trow__meterlabel {
  font-size: 0.66rem;
  color: var(--cq-muted);
  white-space: nowrap;
}

@media (max-width: 560px) {
  .cq-trow__link {
    grid-template-columns: 20px minmax(0, 1fr) 12px;
  }

  .cq-trow__readout {
    grid-column: 2 / 3;
    justify-items: start;
    text-align: left;
  }

  .cq-trow__arrow {
    grid-row: 1;
    grid-column: 3;
  }
}
</style>
