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
    host: "127.0.0.1",
    port: 43127,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: "127.0.0.1",
    port: 43127,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true,
      },
    },
  },
});
