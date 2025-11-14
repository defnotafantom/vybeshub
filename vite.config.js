import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/vybeshub/", // deve corrispondere al nome del repo GitHub
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});





