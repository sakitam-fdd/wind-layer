# `leaflet-wind`

> [leaflet](https://leafletjs.com/) wind layer adapter

## Usage

### Install

```bash
pnpm i leaflet-wind -S
```

### Example

```vue
<template>
  <div class="demo-content">
    <div class="map-warp" ref="map"></div>
  </div>
</template>
<script setup>
import {ref, onMounted} from 'vue'

const map = ref(null)

const initMap = async (dom) => {
  const L = await import('leaflet');
  const { WindLayer } = await import('leaflet-wind');

  const map = new L.map(dom, {
    // center: [113.53450137499999, 34.44104525],
    zoom: 5,
    center: [113.53450137499999, 34.44104525].reverse(),
    // zoom: 4
  });

  const layer = L.tileLayer('//{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    subdomains: ['a', 'b', 'c', 'd'],
  });

  map.addLayer(layer);

  fetch('https://sakitam.oss-cn-beijing.aliyuncs.com/codepen/wind-layer/json/wind.json')
      .then(res => res.json())
      .then(res => {
        const velocityScale = [0.1, 0.2, 0.3, 0.4, 0.5];

        const windLayer = new WindLayer('wind', res, {
          windOptions: {
            // colorScale: (m) => {
            //   // console.log(m);
            //   return '#fff';
            // },
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
            // velocityScale: 1 / 20,
            // paths: 5000,
            frameRate: 16,
            maxAge: 60,
            globalAlpha: 0.9,
            velocityScale: () => {
              return velocityScale[map.getZoom() - 5] * 0.1 || 0.1;
            },
            // paths: 10000,
            paths: 1000,
          },
        });

        console.log(map, windLayer);

        map.addLayer(windLayer);
      });
}

onMounted(() => {
  initMap(map.value);
});
</script>

<style lang="less">
.demo-content {
  width: 100%;
  height: 100vh;
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
