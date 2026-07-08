import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// The v3 "portfolio" site is served under /portfolio/ behind the audience gate.
// Build output goes to the repo's /docs/portfolio folder (GitHub Pages: main /docs).
export default defineConfig({
  base: "/portfolio/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  build: {
    // emptyOutDir clears only /docs/portfolio, leaving the gate and /docs/dev intact.
    outDir: "../docs/portfolio",
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
