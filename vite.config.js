import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Filmes/",
  plugins: [react()],
  build: {
    sourcemap: true, // 👈 isso permite ver o erro na linha original
  },
});

