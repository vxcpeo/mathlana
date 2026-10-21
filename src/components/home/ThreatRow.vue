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
  <li class="pp-trow">
    <RouterLink :to="to" :aria-label="ariaLabel ?? undefined" class="pp-trow__link">
      <span class="pp-trow__glyph" aria-hidden="true">
        <Icon :name="icon" :size="15" />
      </span>

      <span class="pp-trow__main">
        <span class="pp-trow__title">
          {{ title }}
          <span v-if="qualifier" class="pp-trow__qualifier">{{ qualifier }}</span>
        </span>
        <span v-if="description" class="pp-trow__desc">{{ description }}</span>
      </span>

      <span class="pp-trow__readout">
        <span class="pp-trow__value" :class="valueTone === 'brand' ? 'pp-tone-accent' : ''">
          <span class="pp-num">{{ value }}</span>
          <span v-if="unit" class="pp-trow__unit">{{ unit }}</span>
        </span>
        <span v-if="note" class="pp-trow__note">{{ note }}</span>
      </span>

      <Icon name="arrow-up-right" :size="13" class="pp-trow__arrow" />

      <span v-if="progress !== null" class="pp-trow__meter">
        <span aria-hidden="true" class="pp-meter">
          <span
            class="pp-meter__fill"
            :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }"
          />
        </span>
        <span v-if="progressLabel" class="pp-trow__meterlabel pp-num">{{ progressLabel }}</span>
      </span>
    </RouterLink>
  </li>
</template>

<style scoped>
.pp-trow {
  border-bottom: 1px solid var(--pp-line-soft);
}

.pp-trow__link {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) auto 14px;
  align-items: start;
  gap: 10px;
  padding: 13px 4px;
  transition: background-color var(--pp-fast) var(--pp-ease);
}

.pp-trow__link:hover {
  background: var(--pp-sheet-soft);
}

.pp-trow__glyph {
  color: var(--pp-accent-text);
  padding-top: 2px;
}

.pp-trow__main {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.pp-trow__title {
  font-family: var(--pp-display);
  font-size: 0.92rem;
  font-weight: 620;
  letter-spacing: -0.01em;
  color: var(--pp-ink);
}

.pp-trow__qualifier {
  font-family: var(--pp-body);
  font-size: 0.76rem;
  font-weight: 400;
  color: var(--pp-muted);
}

.pp-trow__desc {
  font-size: 0.76rem;
  color: var(--pp-muted);
}

.pp-trow__readout {
  display: grid;
  justify-items: end;
  gap: 2px;
  text-align: right;
}

.pp-trow__value {
  display: flex;
  align-items: baseline;
  gap: 5px;
  font-size: 0.95rem;
  color: var(--pp-ink);
  white-space: nowrap;
}

.pp-trow__unit,
.pp-trow__note {
  font-size: 0.68rem;
  color: var(--pp-muted);
  white-space: nowrap;
}

.pp-trow__arrow {
  margin-top: 3px;
  color: var(--pp-muted);
}

.pp-trow__meter {
  grid-column: 2 / -1;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 2px;
}

.pp-trow__meter .pp-meter {
  flex: 1;
}

.pp-trow__meterlabel {
  font-size: 0.66rem;
  color: var(--pp-muted);
  white-space: nowrap;
}

@media (max-width: 560px) {
  .pp-trow__link {
    grid-template-columns: 20px minmax(0, 1fr) 12px;
  }

  .pp-trow__readout {
    grid-column: 2 / 3;
    justify-items: start;
    text-align: left;
  }

  .pp-trow__arrow {
    grid-row: 1;
    grid-column: 3;
  }
}
</style>
