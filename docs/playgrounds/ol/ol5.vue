<template>
  <div class="playground-content" ref="mapRef"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  // 这里由于依赖库在 ssg 模式下构建会有问题，只能允许类库异步加载
  // import Map from '@sakitam-gis/ol5/Map';
  // import View from '@sakitam-gis/ol5/View';
  // import TileLayer from '@sakitam-gis/ol5/layer/Tile';
  // import { fromLonLat } from '@sakitam-gis/ol5/proj';
  // import OSM from '@sakitam-gis/ol5/source/OSM';
  // import { WindLayer } from 'ol5-wind';

  defineOptions({
    name: 'Ol5Particles',
  });

  const mapRef = ref<HTMLDivElement>();
  const emits = defineEmits(['mount']);

  let map;

  async function initMap() {
    const Map = await import('@sakitam-gis/ol5/Map').then((res) => res.default);

    const View = await import('@sakitam-gis/ol5/View').then((res) => res.default);
    const TileLayer = await import('@sakitam-gis/ol5/layer/Tile').then((res) => res.default);
    const { fromLonLat } = await import('@sakitam-gis/ol5/proj');
    const OSM = await import('@sakitam-gis/ol5/source/OSM').then((res) => res.default);
    const { WindLayer } = await import('ol5-wind');

    const layer = new TileLayer({
      source: new OSM({
        // projection: 'EPSG:3857',
        // url: '//{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        url: '//{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      }),
    });

    map = new Map({
      layers: [layer],
      target: mapRef.value,
      view: new View({
        // projection: 'EPSG:4326',
        center: fromLonLat([113.53450137499999, 34.44104525]),
        // center: [113.53450137499999, 34.44104525],
        zoom: 2,
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
        wrapX: false,
        // flipY: true,
      },
    });

    windLayer.appendTo(map);

    console.log(map.getLayers());

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
  @import 'https://esm.sh/@sakitam-gis/ol5/dist/ol.css';

  .playground-content {
    width: 100%;
    height: 450px;
  }
</style>
