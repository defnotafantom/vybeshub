import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/vybeshub/", // <-- aggiungi questa riga
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: [
      "mozell-apraxic-pseudobenevolently.ngrok-free.dev", // l’host del tuo tunnel ngrok
      "localhost",
    ],
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});





