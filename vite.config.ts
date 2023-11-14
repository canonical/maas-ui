/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import eslint from "vite-plugin-eslint";
import { configDefaults } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "./");

  return {
    envDir: "./",
    base: "/",
    define: {
      "process.env": env,
    },
    plugins: [react(), eslint()],
    server: { port: 8401, hmr: { port: 8402 } },
    resolve: {
      alias: { "@": path.resolve(__dirname, "src") },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      exclude: [...configDefaults.exclude, "**/tests/**"],
    },
  };
});
