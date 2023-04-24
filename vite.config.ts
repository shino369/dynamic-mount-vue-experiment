import { fileURLToPath, URL } from "node:url"
import { resolve } from 'path'
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: '../webroot/js/vuejs/src/',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: "entry",
      fileName: "entry",
      formats: ["umd"], // umd or iife bundle all components into a single file
    },
    rollupOptions: {
      // external: ['vue', 'lodash', 'moment', 'rxjs', 'localforage', 'vue-router'] // any external library you do not want to include add to here
    }
  },
  define: {
    'process.env': {}
  }
})
