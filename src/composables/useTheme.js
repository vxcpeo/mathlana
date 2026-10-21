import { onMounted, onUnmounted, ref, computed } from "vue";

/**
 * Theme switching with the same three states the reference exposes in its
 * footer segmented control: light / dark / system.
 */
const STORAGE_KEY = "qubitess-theme";
const mode = ref("system");

let mediaQuery = null;

function apply() {
  if (typeof document === "undefined") return;
  const prefersDark =
    mediaQuery?.matches ?? false;
  const dark = mode.value === "dark" || (mode.value === "system" && prefersDark);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

export function useTheme() {
  onMounted(() => {
    if (mediaQuery) return;
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", apply);
    apply();
  });

  onUnmounted(() => {
    // Listener intentionally lives for the app's lifetime; the media query
    // object is a singleton, so there is nothing per-component to tear down.
  });

  return {
    mode,
    isDark: computed(() => document.documentElement?.classList.contains("dark")),
    setMode(next) {
      mode.value = next;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* storage may be unavailable */
      }
      apply();
    },
  };
}

/** Called once from main.js before mount so the first paint has the right theme. */
export function initTheme() {
  if (typeof window === "undefined") return;
  mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", apply);
  let stored = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  mode.value = stored === "light" || stored === "dark" ? stored : "system";
  apply();
}
