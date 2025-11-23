import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  base: "/vybeshub/", // deve corrispondere al nome del repo GitHub
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: true, // opzionale, se vuoi permettere l’accesso da LAN
    allowedHosts: ['mozell-apraxic-pseudobenevolently.ngrok-free.dev']
  },
});






