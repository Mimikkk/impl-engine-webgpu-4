import { defineConfig } from "@rsbuild/core";

export default defineConfig({
  source: {
    entry: {
      index: "./src/mod.ts",
    },
  },
  tools: {
    rspack: {
      module: {
        rules: [
          {
            test: /\.wgsl$/,
            type: "asset/source",
          },
        ],
      },
    },
  },
});
