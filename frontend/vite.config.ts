import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import compression from "vite-plugin-compression2";

export default defineConfig({
    plugins: [
        react(),
        splitVendorChunkPlugin(),
        compression({
            algorithm: "gzip",
            deleteOriginalAssets: false,
            exclude: [/\.(png)$/, /\.(jpg)$/],
        }),
    ],
    server: {
        host: "0.0.0.0",
        port: 8000,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@models": path.resolve(__dirname, "../backend/src/models"),
            "@common": path.resolve(__dirname, "../common")
        },
    },
    build: {
        chunkSizeWarningLimit: 1024,
        outDir: '../_build/frontend'
    },
    define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
});
