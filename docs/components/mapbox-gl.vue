<template>
  <div class="demo-content">
    <div class="demo-content-datgui" ref="gui"></div>
    <div class="map-warp" ref="map"></div>
  </div>
</template>
<script setup>
import {ref, onMounted} from 'vue';
import 'mapbox-gl/dist/mapbox-gl.css';
const map = ref(null)
const gui = ref(null)

const initMap = async (dom, gui) => {
  const mapboxgl = await import('mapbox-gl').then(res => res.default);

  const { WindLayer, ScalarFill } = await import('@sakitam-gis/mapbox-wind');

  mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

  const map = new mapboxgl.Map({
    container: dom,
    style: {
      version: 8,
      sources: {
        carto: {
          type: 'raster',
          tiles: [
            '//a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            '//b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            '//c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            '//d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
          // minzoom: 1,
          // maxzoom: 18,
        },
      },
      layers: [
        {
          id: 'carto',
          type: 'raster',
          source: 'carto',
          // minzoom: 1,
          // maxzoom: 22,
          paint: {
            'raster-resampling': 'nearest',
            'raster-fade-duration': 0,
          },
        },
        {
          id: 'background',
          type: 'background',
          layout: {
            visibility: 'none',
          },
        },
      ],
    },
    center: [113.53450137499999, 34.44104525],
    zoom: 4
  });

  const color = {
    temp: [[203,[115,70,105,255]],
      [218,[202,172,195,255]],
      [233,[162,70,145,255]],
      [248,[143,89,169,255]],
      [258,[157,219,217,255]],
      [265,[106,191,181,255]],
      [269,[100,166,189,255]],
      [273.15,[93,133,198,255]],
      [274,[68,125,99,255]],
      [283,[128,147,24,255]],
      [294,[243,183,4,255]],
      [303,[232,83,25,255]],
      [320,[71,14,0,255]]],
    wind: [
      [0,[98,113,183,255]],
      [1,[57,97,159,255]],
      [3,[74,148,169,255]],
      [5,[77,141,123,255]],
      [7,[83,165,83,255]],
      [9,[53,159,53,255]],
      [11,[167,157,81,255]],
      [13,[159,127,58,255]],
      [15,[161,108,92,255]],
      [17,[129,58,78,255]],
      [19,[175,80,136,255]],
      [21,[117,74,147,255]],
      [24,[109,97,163,255]],
      [27,[68,105,141,255]],
      [29,[92,144,152,255]],
      [36,[125,68,165,255]],
      [46,[231,215,215,255]],
      [51,[219,212,135,255]],
      [77,[205,202,112,255]],
      [104,[128,128,128,255]]
    ],
  };

  map.on('load', () => {
    fetch('https://sakitam.oss-cn-beijing.aliyuncs.com/codepen/wind-layer/json/wind.json')
        .then(res => res.json())
        .then(data => {
          console.log(data);

          // data = data.map((item, idx) => {
          //   item.header = Object.assign(item.header, {
          //     parameterCategory: 1,
          //     parameterNumber: idx === 0 ? 2 : 3,
          //   });
          //   return item;
          // });

          const windInterpolateColor = color.wind.reduce((result, item, key) => result.concat(item[0], 'rgba(' + item[1].join(',') + ')'), []);

          const fillLayer = new ScalarFill('wind-fill', {
            // "type": "jsonArray",
            // "data": data,
            "type": "image",
            "url": 'https://sakitam.oss-cn-beijing.aliyuncs.com/codepen/wind-layer/image/var_ugrd-var_vgrd.png',
            "extent": [
              [-180, 85.051129],
              [-180, -85.051129],
              [180, 85.051129],
              [180, -85.051129],
            ],
            "width": 1440,
            "height": 720,
            "uMin": -21.34380340576172,
            "uMax": 30.7261962890625,
            "vMin": -23.916271209716797,
            "vMax": 24.693727493286133,
          }, {
            styleSpec: {
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'value'],
                ...windInterpolateColor
              ],
              'opacity': [
                'interpolate',
                ['exponential', 0.5],
                ['zoom'],
                5,
                1,
                8,
                1
              ],
            },
            renderForm: 'rg',
            widthSegments: 720,
            heightSegments: 360,
            // widthSegments: 1,
            // heightSegments: 1,
            displayRange: [0, 150],
            mappingRange: [0, 100000],
          });

          map.addLayer(fillLayer);

          window.windLayer = new WindLayer('wind', data, {
            windOptions: {
              // colorScale: (m) => {
              //   // console.log(m);
              //   return '#fff';
              // },
              // colorScale: [
              //   "rgb(36,104, 180)",
              //   "rgb(60,157, 194)",
              //   "rgb(128,205,193 )",
              //   "rgb(151,218,168 )",
              //   "rgb(198,231,181)",
              //   "rgb(238,247,217)",
              //   "rgb(255,238,159)",
              //   "rgb(252,217,125)",
              //   "rgb(255,182,100)",
              //   "rgb(252,150,75)",
              //   "rgb(250,112,52)",
              //   "rgb(245,64,32)",
              //   "rgb(237,45,28)",
              //   "rgb(220,24,32)",
              //   "rgb(180,0,35)"
              // ],
              // velocityScale: 1 / 20,
              // paths: 5000,
              frameRate: 16,
              maxAge: 60,
              globalAlpha: 0.9,
              velocityScale: 0.01,
              // paths: 10000,
              paths: 3782,
            },
          });

          console.log(map, window.windLayer);

          // map.addLayer(window.windLayer);
          window.windLayer.addTo(map);
        });
  });
}

onMounted(() => {
  initMap(map.value, gui.value);
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
