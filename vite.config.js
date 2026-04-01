import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/Filmes/",
  build: {
    sourcemap: true, // 👈 isso permite ver o erro na linha original
  },
});
