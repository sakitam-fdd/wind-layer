import { UserConfig } from 'vitest';

const config: { test: UserConfig } = {
  test: {
    testTimeout: 50000,
    // setupFiles: '../../vitest/setupTest.ts',
    coverage: {
      reporter: ['lcov', 'html'],
    } as any,
  },
}

export default config;
