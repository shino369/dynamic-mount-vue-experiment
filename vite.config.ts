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
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: "entrypoint",
      // the proper extensions will be added
      fileName: "entrypoint",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      // external: ['vue', 'lodash', 'moment', 'rxjs', 'localforage', 'vue-router']
    }
  },
  define: {
    'process.env': {}
  }
})
