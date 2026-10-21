import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

/**
 * Vite's stock ports (5173 dev / 4173 preview) are shared with every other Vite
 * app on a machine, and this checkout often runs alongside others. Explicit,
 * distinctive ports keep the two apart; `strictPort` makes a collision fail
 * loudly instead of silently serving a different project on the port you were
 * told to open.
 */
const DEV_PORT = 5310;
const PREVIEW_PORT = 4310;

/** Both servers read market and quantum data from the live origin. */
const apiProxy = {
  "/api": {
    target: "https://mathlana.si",
    changeOrigin: true,
    secure: false,
  },
};

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: DEV_PORT,
    strictPort: true,
    proxy: apiProxy,
  },
  preview: {
    port: PREVIEW_PORT,
    strictPort: true,
    proxy: apiProxy,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
