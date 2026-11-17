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

### Tile WMS

`url` 中可以使用内置模板变量 `{bbox-epsg-3857}`（与 maplibre-gl 原生 raster source 的写法一致），会按瓦片行列号计算出 EPSG:3857 下的 `minX,minY,maxX,maxY`，可直接作为 WMS `GetMap` 请求的 `BBOX` 参数；
也可以通过 `urlData` 注入自定义模板变量（值支持字符串、数字或函数）。

```js
const tileSource = new maplibreWind.TileSource('wind', {
  tileSize: 256,
  minZoom: 0,
  maxZoom: 4,
  roundZoom: true,
  decodeType: maplibreWind.DecodeType.image,
  dataRange: [
    [-21.381948471069336, 23.992563247680664],
    [-20.644954681396484, 21.251964569091797],
  ],
  wrapX: true,
  url: 'https://my-wms-server/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&TRANSPARENT=true&LAYERS=myWindLayer&STYLES=default&WIDTH=256&HEIGHT=256&FORMAT=image/png&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&TIME={time}',
  urlData: {
    // 自定义模板变量，函数形式会接收 { x, y, z, s, scheme }
    time: '2024-01-01T00:00:00Z',
  },
});

const layer = new maplibreWind.Layer('wind', tileSource, {
  styleSpec: {
    // 粒子颜色同样由 fill-color 色带控制
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'value'],
      0, '#fff',
      104, '#fff',
    ],
    numParticles: 65535 / 8,
  },
  renderFrom: maplibreWind.RenderFrom.rg,
  displayRange: [0, 104],
  renderType: maplibreWind.RenderType.particles,
});

map.addLayer(layer);
```

> 注意：WMS 请求的 `WIDTH` / `HEIGHT` 需要与 `tileSize` 保持一致；`{bbox-epsg-3857}` 仅适用于 `CRS=EPSG:3857`（WMS 1.1.1 对应 `SRS=EPSG:3857`）。

## 数据源

数据源支持 3 类

1. TileSource：瓦片数据源（墨卡托）
2. ImageSource：单张图片（墨卡托）
3. TimelineSource：时序数据源

以上三类仅仅是数据源不同，图层使用方式是一致的
