import { test, expect, describe, beforeAll, afterAll, vi } from 'vitest';

vi.stubGlobal(
  'URL',
  vi.mocked({
    createObjectURL: vi.fn(),
  }),
);

beforeAll(async () => {
  console.log(`[maplibre-wind]: start testing...`);
});

afterAll(async () => {
  console.log(`[maplibre-wind]: test end`);
});

describe('maplibre-gl', async () => {
  test('instance', async () => {
    expect(1).toEqual(1);
  });
});
