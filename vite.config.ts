import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'

/**
 * always production
 * page auth is done by php side cookie.
 * for further runtime variable, add var in .env
 */

export default ({ mode = 'production' }) => {
    process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

    return defineConfig({
        // mode: 'production',
        plugins: [
            vue(),
            checker({
                vueTsc: true,
                eslint: {
                    lintCommand: 'eslint ./src --ext .vue,.js,.jsx,.cjs,.ts',
                },
            }),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        base: `/${process.env.VITE_BASE}/tms/vuejs/${process.env.VITE_FORMAT}/`, // base url for asset
        build: {
            // target: ['modules'],
            // minify: 'esbuild',             // default use esbuild. approx 40x faster than terser
            outDir: `../Plugin/Tms/webroot/vuejs/${process.env.VITE_FORMAT}/`,
            emptyOutDir: true,
            sourcemap: true, // please add source map to svn ignore
            cssCodeSplit: process.env.VITE_FORMAT === 'umd', // wether include in js file or use a single css file. format 'umd' default to include in js file when cssCodeSplit set to true or not set
            manifest: true,
            rollupOptions: {
                // external: ['vue'], // any external library you do not want to include add to here
                input: resolve(
                    __dirname,
                    `src/main_${process.env.VITE_FORMAT}.ts`,
                ),
                output: {
                    // entryFileNames: 'entry.umd.js',
                    // assetFileNames: 'style.css',
                    format:
                        (process.env.VITE_FORMAT as
                            | 'amd'
                            | 'cjs'
                            | 'es'
                            | 'iife'
                            | 'system'
                            | 'umd'
                            | 'commonjs'
                            | 'esm'
                            | 'module'
                            | 'systemjs') || 'umd',
                },
            },
        },
        // define: {
        //     'process.env': {},
        // },
        // server: { // only use for development server
        //     host: '0.0.0.0',
        // },
        // esbuild: {   // use to filter console
        //     // drop: ['console', 'debugger'],
        //     // pure: ['console.log'],
        // },

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
    })
}
