/// <reference types="vitest" />
import { cpSync, createReadStream, existsSync } from "node:fs";
import * as path from "path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv, type Plugin } from "vite";
import eslint from "vite-plugin-eslint";

const dsIconsRoot = path.resolve("node_modules/@canonical/ds-assets/icons");

// Pragma Icon and Spinner load glyphs at runtime from /icons/*.svg.
const serveDsIcons = (): Plugin => ({
  name: "ds-icons",
  configureServer(server) {
    const prefix = `${server.config.base.replace(/\/$/, "")}/icons/`;
    server.middlewares.use((req, res, next) => {
      const pathname = req.url?.split("?")[0] ?? "";
      if (!pathname.startsWith(prefix) || !pathname.endsWith(".svg")) {
        next();
        return;
      }

      let relative = "";
      try {
        relative = path
          .normalize(decodeURIComponent(pathname.slice(prefix.length)))
          .replace(/^(\.\.(\/|\\|$))+/, "");
      } catch {
        next();
        return;
      }

      const file = path.join(dsIconsRoot, relative);
      if (!file.startsWith(`${dsIconsRoot}${path.sep}`) || !existsSync(file)) {
        next();
        return;
      }

      res.setHeader("Content-Type", "image/svg+xml");
      createReadStream(file).pipe(res);
    });
  },
  writeBundle(options) {
    const outDir = path.resolve(options.dir ?? "build");
    cpSync(dsIconsRoot, path.join(outDir, "icons"), { recursive: true });
  },
});

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
    plugins: [react(), eslint(), serveDsIcons()],
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
