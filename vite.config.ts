/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import eslint from "vite-plugin-eslint";

const manualChunks = [
  "@canonical/react-components",
  "@canonical/maas-react-components",
  "@/app/store/machine/slice",
];

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

// Prebuilt dependency CSS (e.g. @canonical/maas-react-components) can contain
// Vanilla @font-face rules pointing at assets.ubuntu.com, which override our
// local fonts and trigger external requests in air-gapped environments.
const REMOTE_ASSETS_HOST = "assets.ubuntu.com";
const stripRemoteFontFaces = {
  postcssPlugin: "strip-remote-font-faces",
  AtRule: {
    "font-face": (atRule: { toString(): string; remove(): void }) => {
      if (atRule.toString().includes(REMOTE_ASSETS_HOST)) {
        atRule.remove();
      }
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "./");

  return {
    envDir: "./",
    base: "/",
    css: {
      postcss: { plugins: [stripRemoteFontFaces] },
      preprocessorOptions: {
        scss: {
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
      rolldownOptions: {
        output: {
          sanitizeFileName: false,
          // One chunk per module, named after the sanitized camel-cased module name.
          // e.g.: "canonicalReactComponents" for "@canonical/react-components".
          codeSplitting: {
            groups: manualChunks.map((module) => ({
              name: module
                .replace(/(^|[-\/])(.)/g, (_, _separator, letter) =>
                  letter.toUpperCase()
                )
                .replace(/[^a-zA-Z0-9]/g, "")
                .replace(/^./, (firstChar) => firstChar.toLowerCase()),
              test: new RegExp(
                module.startsWith("@/")
                  ? `/src/${escapeRegExp(module.slice(2))}\\.`
                  : `/node_modules/${escapeRegExp(module)}/`
              ),
            })),
          },
        },
      },
      sourcemap: true,
    },
    plugins: [react(), eslint()],
    server: { port: 8401, hmr: process.env.CI ? false : { port: 8402 } },
    resolve: {
      alias: { "@": path.resolve(import.meta.dirname, "src") },
      // Symlink-only dedupe
      dedupe: [
        "@canonical/react-components",
        "react",
        "react-dom",
        "react-router",
        "react-redux",
        "@reduxjs/toolkit",
        "@tanstack/react-query",
        "@tanstack/react-table",
        "@testing-library/react",
        "@testing-library/dom",
        "@testing-library/user-event",
        "msw",
      ],
    },
  };
});
