/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import eslint from "vite-plugin-eslint";

const manualChunks = [
  "@canonical/react-components",
  "@canonical/maas-react-components",
  "@canonical/macaroon-bakery",
  "@/app/store/machine/slice",
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "./");

  return {
    envDir: "./",
    base: "/",
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
          quietDeps: true,
          silenceDeprecations: ["import", "global-builtin"],
        },
      },
    },
    define: {
      "process.env": env,
    },
    build: {
      manifest: "asset-manifest.json",
      outDir: "build",
      rollupOptions: {
        output: {
          sanitizeFileName: false,
          // Creates an object with sanitized camel-cased module names as keys and original module names as values.
          // e.g.: { "canonicalReactComponents": ["@canonical/react-components"] }.
          manualChunks: manualChunks.reduce((chunks, module) => {
            const sanitizedModule = module
              .replace(/(^|[-\/])(.)/g, (_, _separator, letter) =>
                letter.toUpperCase()
              )
              .replace(/[^a-zA-Z0-9]/g, "")
              .replace(/^./, (firstChar) => firstChar.toLowerCase());
            chunks[sanitizedModule] = [module];
            return chunks;
          }, {}),
        },
      },
      sourcemap: true,
    },
    plugins: [react(), eslint()],
    server: { port: 8401, hmr: process.env.CI ? false : { port: 8402 } },
    resolve: {
      alias: { "@": path.resolve(__dirname, "src") },
      // Ensure a single copy of these packages is used, even when
      // @canonical/maas-react-components is linked locally and ships its own
      // nested copies in node_modules. Without this, Vite may resolve an older
      // nested @canonical/react-components (or a duplicate react-router),
      // breaking shared context and missing newer exports.
      dedupe: [
        "@canonical/react-components",
        "react",
        "react-dom",
        "react-router",
      ],
    },
  };
});
