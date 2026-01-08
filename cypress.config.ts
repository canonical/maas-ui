import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { defineConfig } from "cypress";

export default defineConfig({
  defaultCommandTimeout: 10000,
  e2e: {
    // block analytics
    blockHosts: [
      "www.googletagmanager.com",
      "www.google-analytics.com",
      "sentry.is.canonical.com",
    ],
    // In file they are used any types, as either we don't know correct types or because of cypress updates the more strict types
    // either cause errors or incorporate much more complex and not readable solutions
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async setupNodeEvents(on: any, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on("task", {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        log(args: any) {
          console.log(args);

          return null;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        table(message: any) {
          console.table(message);

          return null;
        },
      });
      const jsBundler = createBundler({});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      on("file:preprocessor", (file: any) => {
        if (file.filePath.endsWith(".feature")) {
          return createBundler({
            plugins: [createEsbuildPlugin(config)],
          })(file);
        }

        if (
          file.filePath.match(/\.(js|ts|jsx|tsx)$/) &&
          !file.filePath.endsWith(".steps.ts")
        ) {
          return jsBundler(file);
        }

        return undefined;
      });
      return config;
    },
    baseUrl: "http://0.0.0.0:8400",
    specPattern: [
      "cypress/e2e/**/*.{js,jsx,ts,tsx}",
      "cypress/e2e/**/*.feature",
    ],
    viewportHeight: 1300,
    viewportWidth: 1440,
  },
  env: {
    BASENAME: "/MAAS",
    VITE_BASENAME: "/r",
    nonAdminPassword: "test",
    nonAdminUsername: "user",
    password: "test",
    skipA11yFailures: false,
    username: "admin",
  },
  projectId: "gp2cox",
  retries: {
    runMode: 2,
    openMode: 0,
  },
  video: false,
});
