import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      "next/navigation": fileURLToPath(
        new URL("./src/test/next-navigation-mock.ts", import.meta.url)
      ),
    },
  },
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    server: {
      deps: {
        inline: ["next-intl"],
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["src/components/ui/**", "src/app/**", "**/*.test.{ts,tsx}"],
    },
  },
});
