import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],
  envPrefix: "CLIENT",
  server: {
    port: 3000,
    host: "0.0.0.0",
    open: true,
  },
});
