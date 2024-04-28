import { test, expect, describe, beforeAll, afterAll } from 'vitest';

// vi.stubGlobal('L', vi.mocked({
//   Layer: class {
//     static extend = vi.fn();
//   }
// }));

beforeAll(async () => {
  console.log(`[leaflet-wind]: start testing...`);
});

afterAll(async () => {
  console.log(`[leaflet-wind]: test end`);
});

describe('leaflet', async () => {
  test('instance', async () => {
    expect(1).toEqual(1);
  });
});
