import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // port 3000 in ui from 5173
  server: {
    port: 3000,
    proxy: {
      "/api/v1": {
        target: "https://backend-ph-tour-management-system.vercel.app",
        changeOrigin: true,
      },
    },
  },
});
