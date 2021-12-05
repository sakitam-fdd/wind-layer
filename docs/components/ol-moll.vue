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
  const Map = await import('ol/Map').then(res => res.default);
  const View = await import('ol/View').then(res => res.default);
  const TileLayer = await import('ol/layer/Tile').then(res => res.default);
  const Projection = await import('ol/proj/Projection').then(res => res.default);
  const OSM = await import('ol/source/OSM').then(res => res.default);
  // const { get: getProjection } = await import('src/proj');
  const { register } = await import('ol/proj/proj4');
  const GeoJSON = await import('ol/format/GeoJSON').then(res => res.default);
  const VectorLayer = await import('ol/layer/Vector').then(res => res.default);
  const VectorSource = await import('ol/source/Vector').then(res => res.default);
  const { WindLayer } = await import('ol-wind');

  proj4.defs('ESRI:53009', '+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=6371000 ' +
      '+b=6371000 +units=m +no_defs');

  register(proj4);

  // Configure the Sphere Mollweide projection object with an extent,
  // and a world extent. These are required for the Graticule.
  const sphereMollweideProjection = new Projection({
    code: 'ESRI:53009',
    extent: [-9009954.605703328, -9009954.605703328,
      9009954.605703328, 9009954.605703328],
    worldExtent: [-179, -89.99, 179, 89.99]
  });

  const layer = new TileLayer({
    source: new OSM({
      // projection: 'EPSG:3857',
      // url: '//{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      url: '//{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    }),
  });

  const map = new Map({
    layers: [
      layer,
      new VectorLayer({
        source: new VectorSource({
          url: '/data/countries-110m.geojson',
          format: new GeoJSON()
        })
      }),
    ],
    target: dom,
    view: new View({
      center: [0, 0],
      projection: sphereMollweideProjection,
      resolutions: [65536, 32768, 16384, 8192, 4096, 2048],
      zoom: 1
    }),
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
        });

        map.addLayer(windLayer);
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
