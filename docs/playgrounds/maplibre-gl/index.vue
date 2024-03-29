<template>
  <div class="playground-content" ref="mapRef"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  // import { Repl, ReplStore } from '@vue/repl';
  import maplibregl from 'maplibre-gl';
  import { Layer, ImageSource, RenderType } from '@sakitam-gis/maplibre-wind';

  defineOptions({
    name: 'MaplibreSampleRaster',
  });

  const mapRef = ref<HTMLDivElement>();
  const emits = defineEmits(['mount']);

  // const store = new ReplStore({
  //   serializedState: window.location.hash.slice(1),
  // });
  //
  // store.state.mainFile = 'src/App.vue'
  //
  // store.setImportMap({
  //   'mapbox-gl': 'https://cdn.jsdelivr.net/npm/mapbox-gl/dist/mapbox-gl.js'
  // })

  let map;

  function initMap() {
    map = new maplibregl.Map({
      container: mapRef.value,
      center: { lng: 105.70150033978689, lat: 22.76021405309811 }, // starting position [lng, lat]
      zoom: 0,
      antialias: true,
      style: {
        version: 8,
        sources: {},
        layers: [
          {
            id: 'background',
            type: 'background',
            layout: {
              visibility: 'none',
            },
          },
        ],
      },
    });

    if (!import.meta.env.SSR) {
      map.on('load', () => {
        const source = new ImageSource('carto', {
          url: 'https://a.basemaps.cartocdn.com/light_all/0/0/0.png',
          coordinates: [
            [-180, 85.051129],
            [180, 85.051129],
            [180, -85.051129],
            [-180, -85.051129],
          ],
          wrapX: true,
        });

        const layer = new Layer('carto', source, {
          styleSpec: {
            opacity: ['interpolate', ['exponential', 0.5], ['zoom'], 1, 1, 2, 1],
          },
          renderType: RenderType.image,
          picking: true,
          // mask: {
          //   data: clip,
          //   // type: mapboxWind.MaskType.outside,
          //   type: MaskType.inside, // 默认是 inside，即只显示范围内的
          // }
        });

        map.addLayer(layer);
      });
    }

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
  @import 'https://esm.sh/maplibre-gl/dist/maplibre-gl.css';

  .playground-content {
    width: 100%;
    height: 450px;
  }
</style>
