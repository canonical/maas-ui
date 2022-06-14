import { defineConfig } from "cypress";

export default defineConfig({
  defaultCommandTimeout: 10000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      on("task", {
        log(args) {
          console.log(args);

          return null;
        },
        table(message) {
          console.table(message);

          return null;
        },
      });
      return config;
    },
    baseUrl: "http://0.0.0.0:8400",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    viewportHeight: 1300,
    viewportWidth: 1440,
  },
  env: {
    BASENAME: "/MAAS",
    REACT_BASENAME: "/r",
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
