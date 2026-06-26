import { configDefaults, defineConfig } from "vitest/config";
import * as path from "path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
    // Ensure a single copy of these packages is used, even when
    // @canonical/maas-react-components is linked locally and ships its own
    // nested copies in node_modules. Mirrors the dedupe in vite.config.ts so
    // that shared context (e.g. the side panel provider) works in tests.
    dedupe: [
      "@canonical/react-components",
      "react",
      "react-dom",
      "react-router",
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
