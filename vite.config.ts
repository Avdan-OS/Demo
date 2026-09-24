import { ViteDevServer, defineConfig } from "vite";
import { IncomingMessage, ServerResponse } from "http";
import { visualizer } from "rollup-plugin-visualizer";
import solidPlugin from "vite-plugin-solid";
import compress from "vite-plugin-compression";
import commonjs from "@rollup/plugin-commonjs";
import path from "path";
import runBeforeBuildPlugin from "./plugins/vite-plugin-run-before-build";
import { fileURLToPath } from "url";
import javascriptObfuscator from "vite-plugin-javascript-obfuscator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ClientSideRouting = {
  name: "dynamic-router",
  configureServer(server: ViteDevServer) {
    server.middlewares.use(
      (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url?.search(/^\/@\d+/) !== -1) {
          req.url = "/";
        }
        next();
      },
    );
  },
};

export default defineConfig({
  plugins: [
    javascriptObfuscator({
      apply: "build",
      exclude: [
        /node_modules/,
        /\.nuxt/,
        /src\/Router\.tsx$/,
        /src\/lib\/i18n\/i18n-context\.tsx$/,
        /src\/lib\/player\/provider\.tsx$/,
        /src\/lib\/assets\/asset-resolver\.ts$/,
        /src\/apps\/music-player\/tracks\.ts$/,
      ],
      options: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        stringArray: true,
        stringArrayEncoding: ["base64"],
        stringArrayThreshold: 0.75,
        renameGlobals: false,
        selfDefending: false,
      },
    }),
    solidPlugin(),
    visualizer({ filename: "dist/bundle-analysis.html" }),
    compress({ algorithm: "gzip" }),
    ClientSideRouting,
    commonjs({}),
    runBeforeBuildPlugin({
      command: "npm",
      args: ["run", "gen:lib"],
    }),
    runBeforeBuildPlugin({
      command: "npm",
      args: ["run", "format"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@lib": path.resolve(__dirname, "src", "lib"),
      "@styles": path.resolve(__dirname, "src", "styles"),
      "@static": path.resolve(__dirname, "src", "static"),
      "@assets": path.resolve(__dirname, "src", "static", "assets"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".css"],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: [
          `@use "@styles/variables.scss" as vars;`,
          `@use "@styles/media.scss" as comp;`,
          `@use "@styles/utils.scss" as utils;`,
          `@use "@styles/prefixes.scss" as prefixes;`,
        ].join("\n"),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
    strictPort: true,
    hmr: true,
  },
  preview: {
    port: 4173,
    open: true,
    strictPort: true,
  },

  optimizeDeps: {},
  root: path.resolve(__dirname),
  publicDir: path.resolve(__dirname, "public"),
  build: {
    target: "esnext",
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: true,
    minify: "terser",
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        entryFileNames: "js/[name].[hash].js",
        chunkFileNames: "js/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
  },
});
