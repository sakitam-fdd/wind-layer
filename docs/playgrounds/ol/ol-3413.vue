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
  // import { register } from 'ol/proj/proj4';
  // import OSM from 'ol/source/OSM';
  // import { WindLayer } from 'ol-wind';

  defineOptions({
    name: 'OlParticles3413',
  });

  const mapRef = ref<HTMLDivElement>();
  const emits = defineEmits(['mount']);

  let map;

  async function initMap() {
    const Map = await import('ol/Map').then((res) => res.default);

    const View = await import('ol/View').then((res) => res.default);
    const TileLayer = await import('ol/layer/Tile').then((res) => res.default);
    const { get: getProjection } = await import('ol/proj');
    const { register } = await import('ol/proj/proj4');
    const OSM = await import('ol/source/OSM').then((res) => res.default);
    const { WindLayer } = await import('ol-wind');

    proj4.defs(
      'EPSG:3413',
      '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
    );

    register(proj4);

    const extent = [-190, 90, 180, 60];
    const bounds = [-6894746.0420226175, -6894746.0420226175, 6894746.0420226175, 6894746.0420226175];

    const projection = getProjection('EPSG:3413');
    projection.setWorldExtent(extent);
    projection.setExtent(bounds.map((n) => 3 * n));

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
        projection,
        center: [-47527.08583899386, 534308.4103305723],
      }),
      // pixelRatio: 2,
    });

    map.getView().fit(bounds, map.getSize());

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
