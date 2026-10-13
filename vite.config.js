import { defineConfig } from 'vite';

export default defineConfig({
  root: "./src",
  base: "/repo-name/",
  publicDir: "public",
  plugins: [],
  server: { port: 1234 },
  build: {
    outDir: "dist",
  }
}); 