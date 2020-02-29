const AMapWind = require('..');

describe('amap', () => {
  it('create', () => {
    const layer = new AMapWind();

    expect(layer).toBeDefined();
  });
});
