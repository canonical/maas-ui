import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "./");
  
  return {
    envDir: "./",
    base: '/',
    define: {
      "process.env": env,
    },
    plugins: [react()],
    server: { port: 8401, hmr: { port: 8402 } },
    resolve: {
      alias: { "@": path.resolve(__dirname, "src") },
    },
  };
});
