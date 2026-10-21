<script setup>
/**
 * Step 01 — "Its picture". The drop zone plus the "Make it quantum" card and
 * the portrait panel it expands into.
 *
 * The panel's queue is simulated: the reference parks the portrait in a real
 * quantum machine's queue for a few minutes, so here the run walks through the
 * same phases on a short timer and then shows the drawn placeholder, seeded
 * from the picked file.
 */
import { computed, onBeforeUnmount, ref, watch } from "vue";
import CardArt from "@/components/art/CardArt.vue";
import Icon from "@/components/ui/Icon.vue";
import LaunchGlyph from "@/components/launch/LaunchGlyph.vue";
import LaunchStep from "@/components/launch/LaunchStep.vue";
import { QUANTUM_MACHINES } from "@/data/challenges";

const picture = defineModel("picture", { type: Object, default: null });
const error = defineModel("error", { type: String, default: null });

const ACCEPT = "image/png,image/jpeg,image/gif,image/webp";
const ACCEPTED_TYPES = ACCEPT.split(",");
const MAX_BYTES = 2 * 1024 * 1024;

const open = ref(false);
const stage = ref("idle"); // idle | queued | done
const phase = ref(0);
const result = ref(null);

let timers = [];

const PHASES = ["Preparing the qubits", "Measuring, point by point", "Entangling the grain"];

const online = QUANTUM_MACHINES.filter((machine) => machine.online);

/** Stable per-file seed, so the same picture always draws the same result. */
function seedOf(file) {
  const key = `${file.name}:${file.size}:${file.lastModified}`;
  let hash = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

const score = computed(() => result.value?.score ?? null);

const statusText = computed(() => {
  if (stage.value === "queued") return PHASES[phase.value] ?? PHASES[0];
  if (stage.value === "done" && score.value) return `Entangled ${score.value}`;
  return null;
});

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function pick(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  if (file.size > MAX_BYTES) {
    error.value = "The picture is over 2 MB.";
    return;
  }
  if (!ACCEPTED_TYPES.includes(file.type)) {
    error.value = "Use a PNG, JPEG, GIF or WebP picture.";
    return;
  }

  error.value = null;
  if (picture.value?.url) URL.revokeObjectURL(picture.value.url);
  picture.value = { file, name: file.name, url: URL.createObjectURL(file) };
  clearTimers();
  stage.value = "idle";
  result.value = null;
}

function draw() {
  if (!picture.value || stage.value === "queued") return;
  clearTimers();
  phase.value = 0;
  stage.value = "queued";

  PHASES.slice(1).forEach((_, index) => {
    timers.push(setTimeout(() => (phase.value = index + 1), 2200 * (index + 1)));
  });
  timers.push(
    setTimeout(() => {
      const seed = seedOf(picture.value.file);
      result.value = {
        score: (0.8 + (seed % 2000) / 10000).toFixed(4),
        machine: online[seed % online.length],
      };
      stage.value = "done";
    }, 6800),
  );
}

watch(open, (isOpen) => {
  if (!isOpen) clearTimers();
});

onBeforeUnmount(() => {
  clearTimers();
  if (picture.value?.url) URL.revokeObjectURL(picture.value.url);
});
</script>

<template>
  <LaunchStep index="01" title="Its picture" hint="PNG, JPEG, GIF or WebP, up to 2 MB. Square looks best.">
    <div class="grid grid-cols-1 items-center gap-3 sm:grid-cols-[auto_minmax(0,1fr)]">
      <label
        for="launch-image"
        class="group relative flex size-24 cursor-pointer items-center justify-center overflow-hidden rounded-[22%] border bg-card transition-colors hover:border-brand-text/60"
        :class="picture ? 'border-solid' : 'border-dashed'"
      >
        <img v-if="picture" :src="picture.url" alt="" class="size-full object-cover" />
        <span
          v-if="picture"
          class="absolute inset-x-0 bottom-0 bg-background/80 py-1 text-center text-[0.7rem] font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100"
          >Change</span
        >
        <span
          v-else
          class="flex flex-col items-center gap-1.5 px-2 text-center text-xs text-muted-foreground"
        >
          <Icon name="image-up" class="size-5 text-brand-text" />Choose a picture
        </span>
      </label>
      <input id="launch-image" type="file" :accept="ACCEPT" class="sr-only" @change="pick" />

      <div
        class="flex min-w-0 flex-col rounded-xl border bg-brand-surface transition-colors"
        :class="open ? 'border-brand-text/70' : 'border-brand-border'"
      >
        <div class="flex min-w-0 items-center gap-3 px-3.5 py-3">
          <LaunchGlyph name="quantum" class="size-5 shrink-0 text-brand-text" />
          <div class="flex min-w-0 flex-1 flex-col gap-0.5">
            <p
              class="font-heading text-[0.95rem] font-semibold tracking-[-0.01em] whitespace-nowrap text-foreground"
            >
              Make it quantum
            </p>
            <p class="text-xs text-pretty text-muted-foreground">
              Art made of real quantum measurements, a grain an ordinary computer can only imitate.
              Platform covers the cost.
            </p>
          </div>
          <button
            type="button"
            :aria-expanded="open"
            aria-controls="launch-quantum"
            class="inline-flex h-8 shrink-0 items-center gap-1 rounded-md bg-brand-text px-3 text-sm font-medium whitespace-nowrap text-background transition-opacity outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50"
            @click="open = !open"
          >
            {{ open ? "Hide" : "Draw it" }}
            <Icon
              name="chevron-down"
              :stroke-width="1.75"
              class="size-4 transition-transform"
              :class="open ? 'rotate-180' : ''"
            />
          </button>
        </div>

        <dl class="grid grid-cols-1 gap-x-5 gap-y-2.5 border-t border-brand-border/60 px-3.5 py-3 sm:grid-cols-3">
          <div class="flex min-w-0 flex-col gap-0.5">
            <dt class="flex items-center gap-1.5 text-[0.72rem] font-medium whitespace-nowrap text-brand-text">
              <Icon name="scan-line" :stroke-width="1.75" class="size-3.5 shrink-0" />Real measurements
            </dt>
            <dd class="text-[0.72rem] leading-snug text-pretty text-muted-foreground">
              Real qubits, not AI.
            </dd>
          </div>
          <div class="flex min-w-0 flex-col gap-0.5">
            <dt class="flex items-center gap-1.5 text-[0.72rem] font-medium whitespace-nowrap text-brand-text">
              <Icon name="fingerprint-pattern" :stroke-width="1.75" class="size-3.5 shrink-0" />One of a kind
            </dt>
            <dd class="text-[0.72rem] leading-snug text-pretty text-muted-foreground">
              Every run comes out new.
            </dd>
          </div>
          <div class="flex min-w-0 flex-col gap-0.5">
            <dt class="flex items-center gap-1.5 text-[0.72rem] font-medium whitespace-nowrap text-brand-text">
              <Icon name="atom" :stroke-width="1.75" class="size-3.5 shrink-0" />Entanglement check
            </dt>
            <dd class="text-[0.72rem] leading-snug text-pretty text-muted-foreground">
              Its score comes with it.
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <div v-if="open">
      <div id="launch-quantum">
        <div class="relative overflow-hidden rounded-lg border bg-card border-brand-border">
          <span
            aria-hidden="true"
            class="pointer-events-none absolute size-2.5 border-brand-text left-0 top-0 border-l border-t rounded-tl-lg"
          />
          <span
            aria-hidden="true"
            class="pointer-events-none absolute size-2.5 border-brand-text right-0 top-0 border-r border-t rounded-tr-lg"
          />
          <span
            aria-hidden="true"
            class="pointer-events-none absolute size-2.5 border-brand-text left-0 bottom-0 border-l border-b rounded-bl-lg"
          />
          <span
            aria-hidden="true"
            class="pointer-events-none absolute size-2.5 border-brand-text right-0 bottom-0 border-r border-b rounded-br-lg"
          />

          <header class="flex min-w-0 items-center justify-between gap-3 border-b px-3 py-1.5 border-brand-border">
            <span
              class="flex min-w-0 items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.14em] whitespace-nowrap uppercase text-brand-text"
            >
              <LaunchGlyph name="quantum" class="size-3.5" />Quantum portrait
            </span>
          </header>

          <div class="flex flex-col divide-y divide-brand-border/60">
            <div class="grid grid-cols-2 gap-3 px-3 py-3 sm:gap-5 sm:px-4 sm:py-4">
              <figure class="flex min-w-0 flex-col gap-1.5">
                <img
                  v-if="picture"
                  :src="picture.url"
                  alt=""
                  class="aspect-square w-full rounded-md border object-cover"
                />
                <label
                  v-else
                  for="launch-image"
                  class="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-card p-3 text-center text-xs text-muted-foreground transition-colors hover:border-brand/50"
                >
                  <Icon name="image-up" class="size-6 text-brand" />Choose a picture
                </label>
                <figcaption class="truncate text-center text-[0.7rem] text-muted-foreground">
                  Your picture
                </figcaption>
              </figure>

              <figure class="flex min-w-0 flex-col gap-1.5">
                <div
                  class="relative aspect-square w-full overflow-hidden rounded-md border border-brand-border bg-[#0b0d10]"
                >
                  <div
                    v-if="stage === 'idle'"
                    class="absolute inset-0 flex flex-col items-center justify-center gap-3 p-3 text-center"
                  >
                    <LaunchGlyph
                      name="quantum"
                      :stroke-width="1.25"
                      class="size-8 text-brand-text"
                    />
                    <button
                      type="button"
                      :disabled="!picture"
                      class="flex h-9 items-center gap-2 rounded-md bg-brand-text px-3.5 text-sm font-medium whitespace-nowrap text-background transition-opacity hover:opacity-90 disabled:opacity-40"
                      @click="draw"
                    >
                      <LaunchGlyph name="quantum" class="size-4" />Draw it
                    </button>
                    <span
                      v-if="!picture"
                      class="rounded bg-[#0b0d10]/80 px-1.5 py-0.5 text-[0.7rem] text-[#a8a8b3]"
                      >Choose a picture first</span
                    >
                  </div>

                  <div
                    v-else-if="stage === 'queued'"
                    class="absolute inset-0 flex items-center justify-center"
                  >
                    <LaunchGlyph
                      name="quantum"
                      :stroke-width="1.25"
                      class="size-10 animate-quantum-pulse text-brand-text"
                    />
                  </div>

                  <div v-else class="absolute inset-0 flex items-center justify-center p-4">
                    <CardArt name="seal" class="h-full" />
                  </div>

                  <div
                    v-if="stage === 'done'"
                    class="absolute inset-0 flex flex-col items-center justify-center gap-3 p-3 text-center"
                  >
                    <button
                      type="button"
                      class="flex h-9 items-center gap-2 rounded-md bg-brand-text px-3.5 text-sm font-medium whitespace-nowrap text-background transition-opacity hover:opacity-90 disabled:opacity-40"
                      @click="draw"
                    >
                      <LaunchGlyph name="quantum" class="size-4" />Draw it again
                    </button>
                  </div>

                  <p
                    v-if="statusText"
                    aria-live="polite"
                    class="absolute inset-x-2 bottom-2 flex min-w-0 items-center justify-between gap-2 rounded bg-[#0b0d10]/85 px-2 py-1 font-mono text-[0.6rem] tracking-[0.08em] text-[#8da2ff] uppercase sm:text-[0.65rem]"
                  >
                    <span class="min-w-0 truncate">{{ statusText }}</span>
                  </p>
                </div>
                <figcaption class="truncate text-center text-[0.7rem] text-brand-text">
                  Quantum version
                </figcaption>
              </figure>
            </div>

            <section class="flex flex-col gap-2.5 px-3 py-3 sm:px-4">
              <p v-if="stage === 'idle'" class="text-xs text-pretty text-muted-foreground">
                Your picture on the left, its quantum version on the right. Press Draw it and a real
                quantum computer measures it point by point; the look comes out different every time.
              </p>
              <p v-else-if="stage === 'done'" class="text-xs text-pretty text-muted-foreground">
                Drawn on {{ result.machine.model }}, {{ result.machine.qubits }} qubits. The
                entanglement score, {{ result.score }}, goes on chain with the token.
              </p>
              <div
                class="flex flex-col gap-1.5 rounded-md border border-caution-border bg-caution-surface px-3 py-2 text-xs text-pretty text-caution-text"
              >
                <p class="flex items-start gap-2 font-medium">
                  <Icon name="clock" :stroke-width="1.75" class="mt-px size-3.5 shrink-0" />Quantum
                  computers are scarce, so each portrait waits its turn in the machine's queue:
                  usually about 3 minutes, start to picture, and up to 10 to 15 minutes at busy times.
                </p>
                <p class="flex items-start gap-2">
                  <Icon name="atom" :stroke-width="1.75" class="mt-px size-3.5 shrink-0" />Mathlana
                  runs on its own quantum time on IBM Cloud and AWS, and sends each portrait to the
                  machine whose turn comes soonest.
                </p>
                <p class="flex items-start gap-2">
                  <LaunchGlyph name="coins" :stroke-width="1.75" class="mt-px size-3.5" />Quantum
                  computer time costs the platform $96 a minute, and the platform covers it. So runs
                  are strictly limited: 2 portraits a day each, one at a time.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </LaunchStep>
</template>
