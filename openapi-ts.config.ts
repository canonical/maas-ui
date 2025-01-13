import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-fetch",
  input: "http://maas-ui-demo.internal:5240/MAAS/a/openapi.json",
  output: {
    path: "src/app/apiclient",
    format: "prettier",
    lint: "eslint",
  },
  experimentalParser: true,
});
