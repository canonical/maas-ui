import { defineConfig } from "@hey-api/openapi-ts";
import { defineConfig as defineCustomPlugin } from "./src/app/apiclient/plugin";

export default defineConfig({
  client: "@hey-api/client-fetch",
  input: "http://maas-ui-demo.internal:5240/MAAS/a/openapi.json",
  output: {
    path: "src/app/apiclient/codegen",
    format: "prettier",
    lint: "eslint",
  },
  experimentalParser: true,
  plugins: [defineCustomPlugin(), "@hey-api/typescript", "@hey-api/sdk"],
});
