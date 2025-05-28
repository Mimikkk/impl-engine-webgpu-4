import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: "./src/main.tsx",
    },
  },
  tools: {
    postcss: {
      postcssOptions: {
        plugins: [require("@tailwindcss/postcss")],
      },
    },
  },
  resolve: {
    alias: {
      "@nimir/lib-engine": resolve("../../libs/engine/src/mod.ts"),
      "@engine": resolve("../../libs/engine/src"),
    },
  },
  html: {
    template: "./src/index.html",
  },
});
