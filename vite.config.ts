/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "./");

  return {
    envDir: "./",
    base: "/",
    define: {
      "process.env": env,
    },
    build: {
      manifest: "asset-manifest.json",
      outDir: "build",
      rollupOptions: {
        output: {
          sanitizeFileName: false,
        },
      },
      sourcemap: true,
    },
    plugins: [react(), eslint()],
    server: { port: 8401, hmr: { port: 8402 } },
    resolve: {
      alias: { "@": path.resolve(__dirname, "src") },
    },
  };
});
