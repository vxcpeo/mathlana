<script setup>
/**
 * One rung of the Q-Day ladder: the key size, its curve, the standing smallest
 * correct attack and the reference attack's cost. Markup mirrors the reference
 * article one-to-one.
 */
defineProps({
  level: { type: Object, required: true },
});
</script>

<template>
  <article
    class="grid grid-cols-1 gap-5 rounded-xl border p-5 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_minmax(0,1fr)] md:gap-8"
    :class="level.racing ? 'border-quantum-border bg-card' : 'bg-transparent'"
  >
    <div class="flex min-w-0 flex-col gap-2">
      <p class="flex items-center gap-2">
        <span class="font-heading text-lg font-semibold tracking-[-0.01em] whitespace-nowrap"
          >{{ level.bits }}-bit key</span
        >
      </p>
      <p class="font-mono text-xs whitespace-nowrap text-muted-foreground">{{ level.curve }}</p>
      <span
        class="inline-flex h-6 w-fit items-center rounded-full border px-2 text-xs font-medium whitespace-nowrap"
        :class="
          level.racing
            ? 'border-quantum-border bg-quantum-surface text-quantum-text'
            : 'text-muted-foreground'
        "
        >{{ level.state }}</span
      >
    </div>

    <div class="flex min-w-0 flex-col gap-1.5">
      <p class="text-[0.7rem] font-medium tracking-[0.08em] text-quiet uppercase">
        Smallest correct attack
      </p>
      <p class="text-sm text-muted-foreground">{{ level.challenger }}</p>
      <p class="text-xs text-quiet">{{ level.moved }}</p>
    </div>

    <div class="flex min-w-0 flex-col gap-1.5">
      <p class="text-[0.7rem] font-medium tracking-[0.08em] text-quiet uppercase">
        Reference attack
      </p>
      <p class="font-mono text-sm text-muted-foreground figures">
        {{ level.steps }} two-qubit steps
      </p>
      <p class="font-mono text-sm text-muted-foreground figures">{{ level.qubits }} qubits</p>
      <p class="text-xs text-quiet">{{ level.hardware }}</p>
    </div>
  </article>
</template>
