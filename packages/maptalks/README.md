# `maptalks-wind`

> [maptalks](https://maptalks.com) wind layer adapter

## Usage

### Install

```bash
pnpm i @sakitam-gis/maptalks-wind -S
```

### Example

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
