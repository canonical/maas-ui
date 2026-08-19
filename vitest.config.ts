import { configDefaults, defineConfig } from "vitest/config";
import * as path from "path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
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
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    exclude: [...configDefaults.exclude, "**/tests/**"],
    clearMocks: true,
    server: {
      deps: {
        // Symlink-only
        inline: [/maas-react-components\/node_modules\//],
      },
    },
    coverage: {
      // use instrumented coverage via istanbul instead of v8
      provider: "istanbul",
      reporter: [
        ["text"],
        ["html"],
        ["lcov"],
        ["cobertura", { file: "../.coverage/cobertura-coverage.xml" }],
      ],
    },
  },
});
