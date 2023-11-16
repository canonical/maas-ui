/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import eslint from "vite-plugin-eslint";

// There is currently an issue in Vite where the
// dev server will return a 404 if the request doesn't
// contain an "Accept" header. This workaround is required
// for our scripts using "wait-on" to work correctly.
// https://github.com/vitejs/vite/issues/9520
function fixAcceptHeader404() {
  return {
    name: "fix-accept-header-404",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.headers.accept === "application/json, text/plain, */*") {
          req.headers.accept = "*/*";
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "./");

  return {
    envDir: "./",
    base: "/",
    define: {
      "process.env": env,
    },
    plugins: [react(), eslint(), fixAcceptHeader404()],
    server: { port: 8401, hmr: { port: 8402 } },
    resolve: {
      alias: { "@": path.resolve(__dirname, "src") },
    },
  };
});
