import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import envCompatible from "vite-plugin-env-compatible";
import tsConfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

export default defineConfig({
  envPrefix: "REACT_APP_",
  plugins: [react(), envCompatible(), tsConfigPaths()],
  resolve: {
    alias: [
      {
        find: "app",
        replacement: resolve(__dirname, "src/app"),
      },
      {
        find: "~app",
        replacement: resolve(__dirname, "src/app"),
      },
    ],
  },
  server: {
    port: 8401,
  },
});
