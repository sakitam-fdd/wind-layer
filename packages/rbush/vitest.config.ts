import { UserConfig } from 'vitest';

const config: { test: UserConfig } = {
  test: {
    environment: 'jsdom',
    testTimeout: 50000,
    coverage: {
      reporter: ['lcov', 'html'],
    },
  },
}

export default config;
