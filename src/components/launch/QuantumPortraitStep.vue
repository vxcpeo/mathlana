<script setup>
/**
 * Step 01 鈥?"Its picture". The drop zone plus the "Make it quantum" card and
 * the portrait panel it expands into.
 *
 * The panel's queue is simulated: the reference parks the portrait in a real
 * quantum machine's queue for a few minutes, so here the run walks through the
 * same phases on a short timer and then shows the drawn placeholder, seeded
 * from the picked file.
 */
import { computed, onBeforeUnmount, ref, watch } from "vue";
import CardArt from "@/components/art/CardArt.vue";
import AppButton from "@/components/ui/AppButton.vue";
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
    <div class="pp-intake">
      <label
        for="launch-image"
        class="pp-drop"
        :class="picture ? 'pp-drop--filled' : ''"
      >
        <img v-if="picture" :src="picture.url" alt="" class="pp-drop__img" />
        <span v-if="picture" class="pp-drop__change">Change</span>
        <span v-else class="pp-drop__empty">
          <Icon name="image-up" :size="20" class="pp-drop__icon" />Choose a picture
        </span>
      </label>
      <input id="launch-image" type="file" :accept="ACCEPT" class="sr-only" @change="pick" />

      <div class="pp-quantum" :class="open ? 'pp-quantum--open' : ''">
        <div class="pp-quantum__head">
          <LaunchGlyph name="quantum" width="20" height="20" class="pp-quantum__glyph" />
          <div class="pp-quantum__copy">
            <p class="pp-quantum__title">Make it quantum</p>
            <p class="pp-small">Art made of real quantum measurements, a grain an ordinary computer can only imitate. Platform covers the cost.</p>
          </div>
          <AppButton
            size="sm"
            :aria-expanded="open"
            aria-controls="launch-quantum"
            @click="open = !open"
          >
            {{ open ? "Hide" : "Draw it" }}
            <Icon
              name="chevron-down"
              :stroke-width="1.75"
              :size="15"
              class="pp-quantum__chev"
              :class="open ? 'pp-quantum__chev--up' : ''"
            />
          </AppButton>
        </div>

        <dl class="pp-quantum__facts">
          <div class="pp-quantum__fact">
            <dt class="pp-quantum__term">
              <Icon name="scan-line" :stroke-width="1.75" :size="14" class="pp-quantum__factic" />Real measurements
            </dt>
            <dd class="pp-quantum__def">Real qubits, not AI.</dd>
          </div>
          <div class="pp-quantum__fact">
            <dt class="pp-quantum__term">
              <Icon
                name="fingerprint-pattern"
                :stroke-width="1.75"
                :size="14"
                class="pp-quantum__factic"
              />One of a kind
            </dt>
            <dd class="pp-quantum__def">Every run comes out new.</dd>
          </div>
          <div class="pp-quantum__fact">
            <dt class="pp-quantum__term">
              <Icon name="atom" :stroke-width="1.75" :size="14" class="pp-quantum__factic" />Entanglement check
            </dt>
            <dd class="pp-quantum__def">Its score comes with it.</dd>
          </div>
        </dl>
      </div>
    </div>

    <div v-if="open" class="pp-screen" id="launch-quantum">
      <span aria-hidden="true" class="pp-screen__tick pp-screen__tick--tl"></span>
      <span aria-hidden="true" class="pp-screen__tick pp-screen__tick--tr"></span>
      <span aria-hidden="true" class="pp-screen__tick pp-screen__tick--bl"></span>
      <span aria-hidden="true" class="pp-screen__tick pp-screen__tick--br"></span>

      <div class="pp-screen__bar">
        <span class="pp-screen__label">
          <LaunchGlyph name="quantum" width="14" height="14" />Quantum portrait
        </span>
      </div>

      <div class="pp-screen__grid">
        <figure class="pp-screen__fig">
          <img v-if="picture" :src="picture.url" alt="" class="pp-screen__shot" />
          <label v-else for="launch-image" class="pp-screen__empty">
            <Icon name="image-up" :size="24" class="pp-screen__emptyicon" />Choose a picture
          </label>
          <figcaption class="pp-screen__cap">Your picture</figcaption>
        </figure>

        <figure class="pp-screen__fig">
          <div class="pp-screen__plate">
            <div v-if="stage === 'idle'" class="pp-screen__state">
              <LaunchGlyph name="quantum" :stroke-width="1.25" width="32" height="32" class="pp-screen__big" />
              <AppButton size="sm" :disabled="!picture" @click="draw">
                <LaunchGlyph name="quantum" width="16" height="16" />Draw it
              </AppButton>
              <span v-if="!picture" class="pp-screen__gate">Choose a picture first</span>
            </div>

            <div v-else-if="stage === 'queued'" class="pp-screen__state">
              <LaunchGlyph
                name="quantum"
                :stroke-width="1.25"
                width="40"
                height="40"
                class="pp-screen__big pp-live-pulse"
              />
            </div>

            <div v-else class="pp-screen__state">
              <CardArt name="seal" class="pp-screen__seal" />
            </div>

            <div v-if="stage === 'done'" class="pp-screen__state pp-screen__state--over">
              <AppButton size="sm" @click="draw">
                <LaunchGlyph name="quantum" width="16" height="16" />Draw it again
              </AppButton>
            </div>

            <p v-if="statusText" aria-live="polite" class="pp-screen__status">
              <span class="pp-screen__statustxt">{{ statusText }}</span>
            </p>
          </div>
          <figcaption class="pp-screen__cap pp-screen__cap--accent">Quantum version</figcaption>
        </figure>
      </div>

      <div class="pp-screen__notes">
        <p v-if="stage === 'idle'" class="pp-small">
          Your picture on the left, its quantum version on the right. Press Draw it and a real
          quantum computer measures it point by point; the look comes out different every time.
        </p>
        <p v-else-if="stage === 'done'" class="pp-small">
          Drawn on {{ result.machine.model }}, {{ result.machine.qubits }} qubits. The
          entanglement score, {{ result.score }}, goes on chain with the token.
        </p>
        <div class="pp-screen__caution">
          <p class="pp-screen__note">
            <Icon name="clock" :stroke-width="1.75" :size="14" class="pp-screen__noteicon" />Quantum
            computers are scarce, so each portrait waits its turn in the machine's queue:
            usually about 3 minutes, start to picture, and up to 10 to 15 minutes at busy times.
          </p>
          <p class="pp-screen__note">
            <Icon name="atom" :stroke-width="1.75" :size="14" class="pp-screen__noteicon" />Qubitlane
            runs on its own quantum time on IBM Cloud and AWS, and sends each portrait to the
            machine whose turn comes soonest.
          </p>
          <p class="pp-screen__note">
            <LaunchGlyph name="coins" :stroke-width="1.75" width="14" height="14" class="pp-screen__noteicon" />Quantum
            computer time costs the platform $96 a minute, and the platform covers it. So runs
            are strictly limited: 2 portraits a day each, one at a time.
          </p>
        </div>
      </div>
    </div>
  </LaunchStep>
</template>

<style scoped>
.pp-intake {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  align-items: start;
  gap: var(--pp-t3);
  min-width: 0;
}

/* drop zone ------------------------------------------------------------- */
.pp-drop {
  position: relative;
  display: grid;
  place-items: center;
  justify-self: start;
  width: 96px;
  height: 96px;
  overflow: hidden;
  cursor: pointer;
  background: var(--pp-sheet);
  border: 1px solid var(--pp-line-strong);
  border-radius: 0;
  transition: border-color var(--pp-fast) var(--pp-ease);
}

.pp-drop:hover {
  border-color: var(--pp-accent);
}

.pp-drop--filled {
  border-style: solid;
  border-color: var(--pp-line);
}

.pp-drop__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pp-drop__change {
  position: absolute;
  inset: auto 0 0 0;
  padding: 3px 0;
  background: color-mix(in srgb, var(--pp-sheet) 88%, transparent);
  font-family: var(--pp-mono);
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: center;
  color: var(--pp-ink);
  opacity: 0;
  transition: opacity var(--pp-fast) var(--pp-ease);
}

.pp-drop:hover .pp-drop__change {
  opacity: 1;
}

.pp-drop__empty {
  display: grid;
  justify-items: center;
  gap: 6px;
  padding: 0 8px;
  text-align: center;
  font-size: 0.72rem;
  line-height: 1.3;
  color: var(--pp-muted);
}

.pp-drop__icon {
  color: var(--pp-accent-text);
}

/* "Make it quantum" plate ---------------------------------------------- */
.pp-quantum {
  display: grid;
  min-width: 0;
  background: transparent;
  border: 0;
  border-top: 1px solid var(--pp-ink);
  border-left: 2px solid var(--pp-accent);
  border-radius: 0;
}

.pp-quantum--open {
  border-left-color: var(--pp-accent);
}

.pp-quantum__head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
  padding: 12px 0 10px 14px;
}

.pp-quantum__glyph {
  margin-top: 2px;
  color: var(--pp-accent-text);
}

.pp-quantum__copy {
  display: grid;
  gap: 3px;
  flex: 1 1 auto;
  min-width: 0;
}

.pp-quantum__title {
  font-family: var(--pp-display);
  font-size: 1.04rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--pp-ink);
}

.pp-quantum__chev {
  transition: transform var(--pp-fast) var(--pp-ease);
}

.pp-quantum__chev--up {
  transform: rotate(180deg);
}

.pp-quantum__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px 18px;
  padding: 10px 0 12px 14px;
  border-top: 1px solid var(--pp-line);
}

.pp-quantum__fact {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.pp-quantum__term {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--pp-mono);
  font-size: 0.66rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--pp-accent-text);
}

.pp-quantum__factic {
  flex: 0 0 auto;
}

.pp-quantum__def {
  font-size: 0.72rem;
  line-height: 1.4;
  color: var(--pp-muted);
  overflow-wrap: anywhere;
}

/* the drawn portrait screen -------------------------------------------- */
.pp-screen {
  position: relative;
  display: grid;
  min-width: 0;
  background: transparent;
  border: 1px solid var(--pp-line-strong);
  border-radius: 0;
}

.pp-screen__tick {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 0 solid var(--pp-accent);
  pointer-events: none;
}

.pp-screen__tick--tl {
  top: -1px;
  left: -1px;
  border-top-width: 2px;
  border-left-width: 2px;
}

.pp-screen__tick--tr {
  top: -1px;
  right: -1px;
  border-top-width: 2px;
  border-right-width: 2px;
}

.pp-screen__tick--bl {
  bottom: -1px;
  left: -1px;
  border-bottom-width: 2px;
  border-left-width: 2px;
}

.pp-screen__tick--br {
  bottom: -1px;
  right: -1px;
  border-bottom-width: 2px;
  border-right-width: 2px;
}

.pp-screen__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  padding: 8px 12px;
  border-bottom: 1px solid var(--pp-line);
}

.pp-screen__label {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  font-family: var(--pp-mono);
  font-size: 0.64rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--pp-accent-text);
}

.pp-screen__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  padding: 14px;
  border-bottom: 1px solid var(--pp-line);
}

.pp-screen__fig {
  display: grid;
  gap: 7px;
  min-width: 0;
}

.pp-screen__shot,
.pp-screen__empty {
  width: 100%;
  aspect-ratio: 1;
  border: 1px solid var(--pp-line);
  border-radius: 0;
}

.pp-screen__shot {
  object-fit: cover;
}

.pp-screen__empty {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 8px;
  padding: 12px;
  cursor: pointer;
  border-style: dashed;
  background: var(--pp-sheet-soft);
  text-align: center;
  font-size: 0.74rem;
  color: var(--pp-muted);
  transition: border-color var(--pp-fast) var(--pp-ease);
}

.pp-screen__empty:hover {
  border-color: var(--pp-accent);
}

.pp-screen__emptyicon {
  color: var(--pp-accent-text);
}

.pp-screen__cap {
  font-family: var(--pp-mono);
  font-size: 0.64rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: center;
  color: var(--pp-muted);
  overflow-wrap: anywhere;
}

.pp-screen__cap--accent {
  color: var(--pp-accent-text);
}

.pp-screen__plate {
  position: relative;
  display: grid;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid #171610;
  border-radius: 0;
  background: #171610;
}

.pp-screen__state {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 12px;
  padding: 12px;
  text-align: center;
}

.pp-screen__state--over {
  background: color-mix(in srgb, #171610 55%, transparent);
}

.pp-screen__big {
  color: #b9baff;
}

.pp-screen__seal {
  width: 92%;
  height: 92%;
  margin: auto;
}

.pp-screen__gate {
  padding: 2px 6px;
  border-radius: 0;
  background: color-mix(in srgb, #171610 80%, transparent);
  font-family: var(--pp-mono);
  font-size: 0.62rem;
  letter-spacing: 0.04em;
  color: #c9d0ff;
}

.pp-screen__status {
  position: absolute;
  inset: auto 8px 8px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  padding: 4px 8px;
  border-radius: 0;
  background: color-mix(in srgb, #171610 85%, transparent);
  font-family: var(--pp-mono);
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #c9d0ff;
}

.pp-screen__statustxt {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pp-screen__notes {
  display: grid;
  gap: 12px;
  padding: 14px;
}

.pp-screen__caution {
  display: grid;
  gap: 10px;
  padding: 10px 0 10px 14px;
  background: transparent;
  border: 0;
  border-left: 2px solid var(--pp-warn);
  border-radius: 0;
}

.pp-screen__note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--pp-warn);
}

.pp-screen__noteicon {
  flex: 0 0 auto;
  margin-top: 2px;
}

@media (max-width: 560px) {
  .pp-intake {
    grid-template-columns: minmax(0, 1fr);
  }

  .pp-quantum__facts {
    grid-template-columns: minmax(0, 1fr);
  }

  .pp-quantum__head {
    flex-wrap: wrap;
  }

  .pp-screen__grid {
    gap: 10px;
    padding: 10px;
  }
}
</style>
