import { ref, computed, onMounted, onUnmounted } from "vue";
import { QUANTUM_MACHINES } from "@/data/challenges";

/**
 * `/api/quantum/status` polling. Falls back to the static roster when the
 * endpoint is unreachable so the ticker always renders, exactly like the
 * reference's "Connecting" state.
 */
const state = ref({
  status: "connecting", // connecting | live | error
  running: 0,
  machines: QUANTUM_MACHINES,
  runs: [],
  at: null,
});

let timer = null;
let subscribers = 0;

async function fetchStatus() {
  try {
    const res = await fetch("/api/quantum/status", {
      headers: { accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.value = {
      status: "live",
      running: data.running ?? 0,
      machines: Array.isArray(data.machines) && data.machines.length
        ? data.machines
        : QUANTUM_MACHINES,
      runs: data.runs ?? [],
      at: data.at ?? new Date().toISOString(),
    };
  } catch {
    // Keep the last good payload; only downgrade the label.
    if (state.value.status !== "live") state.value = { ...state.value, status: "error" };
  }
}

export function useQuantumStatus() {
  onMounted(() => {
    subscribers += 1;
    if (subscribers === 1) {
      fetchStatus();
      timer = setInterval(fetchStatus, 30_000);
    }
  });

  onUnmounted(() => {
    subscribers -= 1;
    if (subscribers === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  });

  const machineCount = computed(
    () => state.value.machines.filter((m) => m.online !== false).length,
  );

  return { state, machineCount, refresh: fetchStatus };
}

/** Shared access for components that only read (no polling side effects). */
export function useQuantumStatusReadonly() {
  return {
    state,
    machineCount: computed(
      () => state.value.machines.filter((m) => m.online !== false).length,
    ),
  };
}
