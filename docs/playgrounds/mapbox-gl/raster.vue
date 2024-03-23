<template>
  <div class="playground-content" ref="mapRef"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import mapboxgl from 'mapbox-gl';
  import { Layer, TileSource, RenderType } from '@sakitam-gis/mapbox-wind';

  defineOptions({
    name: 'SampleTileRaster',
  });

  const mapRef = ref<HTMLDivElement>();
  const emits = defineEmits(['mount']);

  let map;

  function initMap() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoibWFwYm94LWdsLWpzIiwiYSI6ImNram9ybGI1ajExYjQyeGxlemppb2pwYjIifQ.LGy5UGNIsXUZdYMvfYRiAQ';
    map = new mapboxgl.Map({
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

    map.on('load', () => {
      const source = new TileSource('carto', {
        tileSize: 256,
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        minZoom: 0,
        maxZoom: 18,
        roundZoom: true,
        subdomains: ['a', 'b', 'c', 'd'],
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

    emits('mount');
  }

  onMounted(() => {
    // initMap();
  });

  defineExpose({
    pause: () => {},
    resume: () => {},
  });
</script>

<style>
  @import 'https://esm.sh/mapbox-gl/dist/mapbox-gl.css';

  .playground-content {
    width: 100%;
    height: 450px;
  }
</style>
