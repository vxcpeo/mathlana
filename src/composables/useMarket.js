import { ref, onMounted, onUnmounted } from "vue";

/**
 * `/api/market?mints=<csv>` polling, plus the same normalisation the reference
 * applies (curve -> "N% to graduation", 24h change -> signed delta).
 */
const cache = ref({}); // mint -> market record
const fetchedAt = ref(null);
const loading = ref(false);

let timer = null;
let subscribers = 0;
let watching = new Set();

async function fetchMarket() {
  const mints = [...watching];
  if (!mints.length) return;
  loading.value = true;
  try {
    const res = await fetch(`/api/market?mints=${mints.join(",")}`, {
      headers: { accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cache.value = { ...cache.value, ...(data.tokens ?? {}) };
    fetchedAt.value = data.fetchedAt ?? new Date().toISOString();
  } catch {
    /* keep the previous snapshot */
  } finally {
    loading.value = false;
  }
}

export function useMarket(mints = []) {
  const list = Array.isArray(mints) ? mints : [mints];
  list.forEach((m) => m && watching.add(m));

  onMounted(() => {
    subscribers += 1;
    fetchMarket();
    if (subscribers === 1) timer = setInterval(fetchMarket, 60_000);
  });

  onUnmounted(() => {
    subscribers -= 1;
    if (subscribers === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  });

  return { market: cache, fetchedAt, loading, refresh: fetchMarket };
}
