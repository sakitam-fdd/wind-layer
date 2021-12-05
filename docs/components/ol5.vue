<template>
  <div class="demo-content">
    <div class="demo-content-datgui" ref="gui"></div>
    <div class="map-warp" ref="map"></div>
  </div>
</template>
<script setup>
import {ref, onMounted} from 'vue';
import 'ol/ol.css';
// import Map from 'src/Map';
// import View from 'src/View';
// import TileLayer from 'src/layer/Tile';
// import { fromLonLat } from 'src/proj';
// import OSM from 'src/source/OSM';
// import { WindLayer } from 'src-wind';
const map = ref(null)
const gui = ref(null)

const initMap = async (dom, gui) => {
  const Map = await import('@sakitam-gis/ol5/Map').then(res => res.default);
  const View = await import('@sakitam-gis/ol5/View').then(res => res.default);
  const TileLayer = await import('@sakitam-gis/ol5/layer/Tile').then(res => res.default);
  const { fromLonLat } = await import('@sakitam-gis/ol5/proj');
  const OSM = await import('@sakitam-gis/ol5/source/OSM').then(res => res.default);
  const { WindLayer } = await import('ol5-wind');

  const layer = new TileLayer({
    source: new OSM({
      // projection: 'EPSG:3857',
      // url: '//{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      url: '//{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    }),
  });

  const map = new Map({
    layers: [layer],
    target: dom,
    view: new View({
      center: fromLonLat([113.53450137499999, 34.44104525]),
      zoom: 2,
    }),
    // pixelRatio: 2,
  });

  fetch('https://sakitam.oss-cn-beijing.aliyuncs.com/codepen/wind-layer/json/wind.json')
      .then(res => res.json())
      .then(res => {
        const windLayer = new WindLayer(res, {
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
            lineWidth: 2,
            // colorScale: scale,
            generateParticleOption: false
          },
          fieldOptions: {
            wrapX: true,
            // flipY: true,
          },
          map: map,
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
