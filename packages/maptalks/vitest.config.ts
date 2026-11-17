import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    testTimeout: 50000,
    coverage: {
      reporter: ['lcov', 'html'],
    },
  },
});
