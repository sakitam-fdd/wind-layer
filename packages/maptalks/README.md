# `maptalks-wind`

> [maptalks](https://maptalks.com) wind layer adapter

## Usage

### Install

```bash
pnpm i @sakitam-gis/maptalks-wind -S
```

### WindLayer Example

```vue
<template>
  <div class="demo-content">
    <div class="demo-content-datgui"></div>
    <div class="map-warp" ref="map"></div>
  </div>
</template>
<script>
import 'maptalks/dist/maptalks.css';
import {
  Map,
  TileLayer,
} from 'maptalks';

import { WindLayer } from 'maptalks-wind';

export default {
  name: 'maptalks-wind-base',
  data() {
    return {};
  },
  watch: {},
  methods: {
    initMap() {
      const map = new Map(this.$refs.map, {
        center: [113.53450137499999, 34.44104525],
        zoom: 3,
        baseLayer: new TileLayer('base', {
          urlTemplate: '//{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          // urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          subdomains: ['a', 'b', 'c', 'd'],
        })
      });

      fetch('/data/wind.json')
          .then(res => res.json())
          .then(res => {
            const windLayer = new WindLayer('wind', res, {
              windOptions: {
                // colorScale: scale,
                velocityScale: 1 / 20,
                paths: 5000,
                // eslint-disable-next-line no-unused-vars
                colorScale: [
                  "rgb(36,104, 180)",
                  "rgb(60,157, 194)",
                  "rgb(128,205,193 )",
                  "rgb(151,218,168 )",
                  "rgb(198,231,181)",
                  "rgb(238,247,217)",
                  "rgb(255,238,159)",
                  "rgb(252,217,125)",
                  "rgb(255,182,100)",
                  "rgb(252,150,75)",
                  "rgb(250,112,52)",
                  "rgb(245,64,32)",
                  "rgb(237,45,28)",
                  "rgb(220,24,32)",
                  "rgb(180,0,35)"
                ],
                // colorScale: scale,
              },
              // map: map,
              // projection: 'EPSG:4326'
            });

            console.log(map, windLayer);

            map.addLayer(windLayer);
          });
    }
  },
  mounted() {
    this.initMap();
  },
};
</script>

<style lang="less">
.demo-content {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #cbe0ff;
  &-datgui {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
    pointer-events: auto;
  }

  .map-warp {
    width: 100%;
    height: 100%;
  }
}
</style>

```

## gl layer Example

### raster

```js
const source = new mtkWind.TileSource('carto', {
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

const layer = new mtkWind.Layer('carto', source, {
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
    renderType: mtkWind.RenderType.image,
});

map.addLayer(layer);
```

### colorize

```js
const tileSource = new mtkWind.TileSource('wind', {
  tileSize: 256,
  minZoom: 0,
  maxZoom: 4,
  roundZoom: true,
  decodeType: mtkWind.DecodeType.imageWithExif,
  wrapX: true,
  // tileBounds: [-78.120282611, -75.191804486, 132.453327310, 68.846393966],
  url: 'http://localhost:5000/2023111700/2023111703/{z}/{x}/{y}/wind-surface.jpeg',
});

const layer = new mtkWind.Layer('wind', tileSource, {
  styleSpec: {
    'fill-color': [
      'interpolate',
      ['step', 1],
      ['get', 'value'],
      ...interpolateColor
    ],
    'opacity': 1,
  },
  renderFrom: mtkWind.RenderFrom.rg,
  widthSegments: 1,
  heightSegments: 1,
  displayRange: [0, 104],
  renderType: mtkWind.RenderType.colorize,
  picking: true,
  // mask: {
  //   data: clip,
  //   // type: mapboxWind.MaskType.outside,
  //   type: mapboxWind.MaskType.inside, // 默认是 inside，即只显示范围内的
  // }
});

map.addLayer(layer);
```

### particles

```js
const tileSource = new mtkWind.TileSource('wind', {
  tileSize: 256,
  minZoom: 0,
  maxZoom: 4,
  roundZoom: true,
  decodeType: mtkWind.DecodeType.imageWithExif,
  wrapX: true,
  // tileBounds: [-78.120282611, -75.191804486, 132.453327310, 68.846393966],
  url: 'http://localhost:5000/2023111700/2023111703/{z}/{x}/{y}/wind-surface.jpeg',
});

const layer = new mtkWind.Layer('wind', tileSource, {
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
  renderFrom: mtkWind.RenderFrom.rg,
  displayRange: [0, 104],
  renderType: mtkWind.RenderType.particles,
  // mask: {
  //   data: clip,
  //   // type: mapboxWind.MaskType.outside,
  //   type: mapboxWind.MaskType.inside, // 默认是 inside，即只显示范围内的
  // }
});

map.addLayer(layer);
```


### arrow

```js
const tileSource = new mtkWind.TileSource('wind', {
  tileSize: 256,
  minZoom: 0,
  maxZoom: 4,
  roundZoom: true,
  decodeType: mtkWind.DecodeType.imageWithExif,
  wrapX: true,
  // tileBounds: [-78.120282611, -75.191804486, 132.453327310, 68.846393966],
  url: 'http://localhost:5000/2023111700/2023111703/{z}/{x}/{y}/wind-surface.jpeg',
});

const layer = new mtkWind.Layer('wind', tileSource, {
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
  renderFrom: mtkWind.RenderFrom.rg,
  displayRange: [0, 104],
  renderType: mtkWind.RenderType.arrow,
  // mask: {
  //   data: clip,
  //   // type: mapboxWind.MaskType.outside,
  //   type: mapboxWind.MaskType.inside, // 默认是 inside，即只显示范围内的
  // }
});

map.addLayer(layer);
```
