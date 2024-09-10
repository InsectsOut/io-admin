import purgeCssPlugin from "vite-plugin-purgecss-updated-v5";
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: "IO_",
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "./src") },
    ]
  },
  plugins: [purgeCssPlugin({ variables: true }), react()],
  build: {
    outDir: 'dist'
  }
})
