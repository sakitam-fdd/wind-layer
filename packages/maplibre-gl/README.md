# `maplibre-wind`

> [maplibre-gl](https://maplibre.org/) wind layer adapter

## Usage

### Install

```bash
pnpm i @sakitam-gis/maplibre-wind -S
```

## Example

### raster

```js
const source = new maplibreWind.TileSource('carto', {
    tileSize: 256,
    minZoom: 0,
    maxZoom: 22,
    roundZoom: true,
    subdomains: ['a', 'b', 'c', 'd'],
    // coordinates: [
    //   [-180, 85.051129],
    //   [180, 85.051129],
    //   [180, -85.051129],
    //   [-180, -85.051129],
    // ],
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    wrapX: true,
});

const layer = new maplibreWind.Layer('carto', source, {
    styleSpec: {
      'opacity': [
        'interpolate',
        ['exponential', 0.5],
        ['zoom'],
        1,
        1,
        2,
        1
      ],
    },
    renderType: maplibreWind.RenderType.image,
});

map.addLayer(layer);
```

### colorize

```js
const tileSource = new maplibreWind.TileSource('wind', {
  tileSize: 256,
  minZoom: 0,
  maxZoom: 4,
  roundZoom: true,
  decodeType: maplibreWind.DecodeType.imageWithExif,
  wrapX: true,
  // tileBounds: [-78.120282611, -75.191804486, 132.453327310, 68.846393966],
  url: 'http://localhost:5000/2023111700/2023111703/{z}/{x}/{y}/wind-surface.jpeg',
});

const layer = new maplibreWind.Layer('wind', tileSource, {
  styleSpec: {
    'fill-color': [
      'interpolate',
      ['step', 1],
      ['get', 'value'],
      ...interpolateColor
    ],
    'opacity': 1,
  },
  renderFrom: maplibreWind.RenderFrom.rg,
  widthSegments: 1,
  heightSegments: 1,
  displayRange: [0, 104],
  renderType: maplibreWind.RenderType.colorize,
  picking: true,
  // mask: {
  //   data: clip,
  //   // type: maplibreWind.MaskType.outside,
  //   type: maplibreWind.MaskType.inside, // 默认是 inside，即只显示范围内的
  // }
});

map.addLayer(layer);
```

### particles

```js
const tileSource = new maplibreWind.TileSource('wind', {
  tileSize: 256,
  minZoom: 0,
  maxZoom: 4,
  roundZoom: true,
  decodeType: maplibreWind.DecodeType.imageWithExif,
  wrapX: true,
  // tileBounds: [-78.120282611, -75.191804486, 132.453327310, 68.846393966],
  url: 'http://localhost:5000/2023111700/2023111703/{z}/{x}/{y}/wind-surface.jpeg',
});

const layer = new maplibreWind.Layer('wind', tileSource, {
  styleSpec: {
    'fill-color': [
      'interpolate',
      ['step', 1],
      ['get', 'value'],
      0, '#fff',
      104, '#fff',
    ],
    'opacity': [
      'interpolate',
      ['exponential', 0.5],
      ['zoom'],
      1,
      1,
      2,
      1
    ],
    numParticles: [
      'interpolate',
      ['exponential', 0.5],
      ['zoom'],
      0, // zoom
      65535 / 8, // numParticles
      8, // zoom
      65535 / 16 // numParticles
    ],
    ...particlesConfig,
  },
  renderFrom: maplibreWind.RenderFrom.rg,
  displayRange: [0, 104],
  renderType: maplibreWind.RenderType.particles,
  // mask: {
  //   data: clip,
  //   // type: maplibreWind.MaskType.outside,
  //   type: maplibreWind.MaskType.inside, // 默认是 inside，即只显示范围内的
  // }
});

map.addLayer(layer);
```

### arrow

```js
const tileSource = new maplibreWind.TileSource('wind', {
  tileSize: 256,
  minZoom: 0,
  maxZoom: 4,
  roundZoom: true,
  decodeType: maplibreWind.DecodeType.imageWithExif,
  wrapX: true,
  // tileBounds: [-78.120282611, -75.191804486, 132.453327310, 68.846393966],
  url: 'http://localhost:5000/2023111700/2023111703/{z}/{x}/{y}/wind-surface.jpeg',
});

const layer = new maplibreWind.Layer('wind', tileSource, {
  styleSpec: {
    'fill-color': [
      'interpolate',
      ['step', 1],
      ['get', 'value'],
      ...interpolateColor
      // 0, '#fff',
      // 104, '#fff',
    ],
    'opacity': 1,
    space: 20,
    size: [12, 10],
  },
  renderFrom: maplibreWind.RenderFrom.rg,
  displayRange: [0, 104],
  renderType: maplibreWind.RenderType.arrow,
  // mask: {
  //   data: clip,
  //   // type: maplibreWind.MaskType.outside,
  //   type: maplibreWind.MaskType.inside, // 默认是 inside，即只显示范围内的
  // }
});

map.addLayer(layer);
```

## 数据源

数据源支持 3 类

1. TileSource：瓦片数据源（墨卡托）
2. ImageSource：单张图片（墨卡托）
3. TimelineSource：时序数据源

以上三类仅仅是数据源不同，图层使用方式是一致的
