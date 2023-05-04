import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'

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
    plugins: [
        vue(),
        checker({
            vueTsc: true, // vue typescript type check
            eslint: {
                lintCommand: 'eslint ./src --ext .vue,.js,.jsx,.cjs,.ts',
            },
        }),
    ],
    // server: { // only use for development server
    //     host: '0.0.0.0',
    // },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    // esbuild: {   // use to filter console
    //     // drop: ['console', 'debugger'],
    //     // pure: ['console.log'],
    // },
    build: {
        // target: ['modules'],
        // minify: 'esbuild',             // default use esbuild. approx 40x faster than terser
        // assetsDir: '../webroot/img',
        assetsInlineLimit: 4096,
        outDir: '[your path]',
        emptyOutDir: true,
        sourcemap: true, // please add source map to svn ignore
        // cssCodeSplit: false, // wether include in js file or use a single css file. format 'umd' default to include in js file when cssCodeSplit set to true or not set
        /**
         *  lib mode aim to create js library. may create larger file.
         * */
        // lib: {
        //   entry: resolve(__dirname, 'src/main.ts'),
        //   name: "entry",
        //   fileName: "entry",
        //    /**
        //     * umd or iife bundle all components into a single file, but for smaller project it will have smaller size.
        //     * es module will split async component to chunk, but the main file will be larger. suitable for larger project
        //     *
        //     * set type: "module" to let the build extension be '.js' instead of '.cjs' if using es build
        //     * */
        //   formats: [ /*"es",*/  "umd"],
        // },
        manifest: true,
        rollupOptions: {
            // external: ['pinia'], // any external library you do not want to include add to here
            input: resolve(__dirname, 'src/main.ts'),
            output: {
                // entryFileNames: 'entry.umd.js',
                // assetFileNames: 'style.css',
                format: 'umd',
            },
        },
    },
    define: {
        'process.env': {},
    },
})
