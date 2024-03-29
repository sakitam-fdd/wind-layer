<template>
  <div class="playground-content" ref="mapRef"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import proj4 from 'proj4';
  // 这里由于依赖库在 ssg 模式下构建会有问题，只能允许类库异步加载
  // import Map from 'ol/Map';
  // import View from 'ol/View';
  // import TileLayer from 'ol/layer/Tile';
  // import { fromLonLat } from 'ol/proj';
  // import Projection from 'ol/proj/Projection';
  // import { register } from 'ol/proj/proj4';
  // import OSM from 'ol/source/OSM';
  // import GeoJSON from 'ol/format/GeoJSON';
  // import VectorSource from 'ol/source/Vector';
  // import VectorLayer from 'ol/layer/Vector';
  // import { WindLayer } from 'ol-wind';

  defineOptions({
    name: 'OlParticlesMoll',
  });

  const mapRef = ref<HTMLDivElement>();
  const emits = defineEmits(['mount']);

  let map;

  async function initMap() {
    const Map = await import('ol/Map').then((res) => res.default);
    const View = await import('ol/View').then((res) => res.default);
    const TileLayer = await import('ol/layer/Tile').then((res) => res.default);
    const Projection = await import('ol/proj/Projection').then((res) => res.default);
    const OSM = await import('ol/source/OSM').then((res) => res.default);
    // const { get: getProjection } = await import('src/proj');
    const { register } = await import('ol/proj/proj4');
    const GeoJSON = await import('ol/format/GeoJSON').then((res) => res.default);
    const VectorLayer = await import('ol/layer/Vector').then((res) => res.default);
    const VectorSource = await import('ol/source/Vector').then((res) => res.default);
    const { WindLayer } = await import('ol-wind');

    // eslint-disable-next-line no-useless-concat
    proj4.defs('ESRI:53009', '+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=6371000 ' + '+b=6371000 +units=m +no_defs');

    register(proj4);

    // Configure the Sphere Mollweide projection object with an extent,
    // and a world extent. These are required for the Graticule.
    const sphereMollweideProjection = new Projection({
      code: 'ESRI:53009',
      extent: [-9009954.605703328, -9009954.605703328, 9009954.605703328, 9009954.605703328],
      worldExtent: [-179, -89.99, 179, 89.99],
    });

    const layer = new TileLayer({
      source: new OSM({
        projection: 'EPSG:3857',
        // url: '//{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        url: '//{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      }),
    });

    map = new Map({
      layers: [
        layer,
        new VectorLayer({
          source: new VectorSource({
            url: 'https://blog.sakitam.com/wind-layer/data/countries-110m.geojson',
            format: new GeoJSON(),
          }),
        }),
      ],
      target: mapRef.value,
      view: new View({
        center: [0, 0],
        projection: sphereMollweideProjection,
        resolutions: [65536, 32768, 16384, 8192, 4096, 2048],
        zoom: 1,
      }),
      // pixelRatio: 2,
    });

    const data = await fetch('https://blog.sakitam.com/wind-layer/data/wind.json').then((res) => res.json());

    const windLayer = new WindLayer(data, {
      windOptions: {
        // colorScale: scale,
        velocityScale: 1 / 20,
        paths: 5000,
        // eslint-disable-next-line no-unused-vars
        colorScale: [
          'rgb(36,104, 180)',
          'rgb(60,157, 194)',
          'rgb(128,205,193 )',
          'rgb(151,218,168 )',
          'rgb(198,231,181)',
          'rgb(238,247,217)',
          'rgb(255,238,159)',
          'rgb(252,217,125)',
          'rgb(255,182,100)',
          'rgb(252,150,75)',
          'rgb(250,112,52)',
          'rgb(245,64,32)',
          'rgb(237,45,28)',
          'rgb(220,24,32)',
          'rgb(180,0,35)',
        ],
        lineWidth: 2,
        // colorScale: scale,
        generateParticleOption: false,
      },
      fieldOptions: {
        wrapX: true,
        // flipY: true,
      },
    });

    map.addLayer(windLayer);

    emits('mount');
  }

  onMounted(() => {
    initMap();
  });

  defineExpose({
    pause: () => {},
    resume: () => {},
  });
</script>

<style>
  @import 'https://esm.sh/ol/ol.css';

  .playground-content {
    width: 100%;
    height: 450px;
  }
</style>
