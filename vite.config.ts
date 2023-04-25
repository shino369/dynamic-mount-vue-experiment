import { fileURLToPath, URL } from "node:url"
import { resolve } from 'path'
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

/**
 * No static asset available. Project share a same webroot with the base php.
 * e.g. in '/hqdemo/eng/tms/booking/main/1' calling asset './asset.jpg' will become '/hqdemo/eng/tms/booking/main/1/asset.jpg', which is not webroot.
 * the resource cannot be referenced automatically, need to use absolute path. so for something like icon, use vue svg component instead.
 */

/**
 * always production, no production/developmemnt config is needed.
 * page auth is done by php side.
 * for further runtime variable, add .env
 */

// https://vitejs.dev/config/
export default defineConfig({
  mode: 'production',
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
    // target: ['modules'],           
    // minify: 'esbuild',             // default use esbuild. approx 40x faster than terser
    // assetsDir: '../webroot/img', 
    outDir: '../webroot/js/vuejs/src/',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: "entry",
      fileName: "entry",
      formats: ["umd"], // umd or iife bundle all components into a single file
    },
    rollupOptions: {
      // external: ['vue', 'lodash', 'moment', 'localforage'] // any external library you do not want to include add to here
    }
  },
  define: {
    'process.env': {}
  }
})
