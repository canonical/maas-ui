import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://10.10.0.21:5240/MAAS/a/openapi.json",
  output: {
    path: "src/app/apiclient",
    format: "prettier",
    lint: "eslint",
  },
  experimentalParser: true,
  plugins: [
    {
      name: "@hey-api/client-fetch",
      runtimeConfigPath: "@/hey-api",
    },
    "@hey-api/client-fetch",
    "@hey-api/typescript",
    "@hey-api/sdk",
    {
      name: "@tanstack/react-query",
      infiniteQueryOptions: { enabled: false },
    },
  ],
});
