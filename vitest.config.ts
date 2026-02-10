import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    env: {
      NEXT_PUBLIC_STRIPE_PRICE_KING_TEMPLATE: "price_test_123",
    },
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["src/test/**", "src/**/*.test.*", "src/types/**"],
    },
  },
});
