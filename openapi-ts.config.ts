import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://maas-ui-demo.internal:5240/MAAS/a/openapi.json",
  output: {
    path: "src/app/apiclient",
    format: "prettier",
    lint: "eslint",
  },
  experimentalParser: true,
  plugins: [
    {
      name: "@hey-api/client-fetch",
      runtimeConfigPath: "./src/hey-api.ts",
    },
    "@hey-api/client-fetch",
    "@hey-api/typescript",
    "@hey-api/sdk",
    "@tanstack/react-query",
  ],
});
