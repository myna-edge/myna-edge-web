import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    conditions: ["development", "import", "module", "browser", "default"],
  },
  // Avoid picking up leftover root postcss/tailwind from old Next app
  css: {
    postcss: {
      plugins: [],
    },
  },
  server: {
    host: true,
    port: 43127,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 43127,
    strictPort: true,
  },
});
