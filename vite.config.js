import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import "dotenv/config";

export default defineConfig({
  root: "sources",          // where index.html is
  envDir: "../",            // where .env is
  publicDir: "../static",   // static assets
  base: "./",

  server: {
    host: true,
    open: true
  },

  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: false
  },

  plugins: [
    wasm(),
    topLevelAwait(),
    nodePolyfills()
  ]
});