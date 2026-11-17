<template>
  <div class="playground-content" ref="mapRef"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import maplibregl from 'maplibre-gl';
  import { Layer, ImageSource, RenderType, DecodeType, RenderFrom } from '@sakitam-gis/maplibre-wind';

  defineOptions({
    name: 'MaplibreColorizeImage',
  });

  const mapRef = ref<HTMLDivElement>();
  const emits = defineEmits(['mount']);

  let map;

  function initMap() {
    map = new maplibregl.Map({
      container: mapRef.value,
      center: { lng: 105.70150033978689, lat: 22.76021405309811 }, // starting position [lng, lat]
      zoom: 0,
      antialias: true,
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
            minzoom: 1,
            maxzoom: 18,
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
              'raster-resampling': 'linear',
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
    });

    if (!import.meta.env.SSR) {
      map.on('load', () => {
        const source = new ImageSource('wind', {
          url: 'https://blog.sakitam.com/wind-layer/data/tiles/2023111700/2023111703/0/0/0/wind-surface.jpeg',
          coordinates: [
            [-180, 85.051129],
            [180, 85.051129],
            [180, -85.051129],
            [-180, -85.051129],
          ],
          decodeType: DecodeType.imageWithExif,
          wrapX: true,
        });

        const windColor = [
          [0, [98, 113, 183, 1]],
          [1, [57, 97, 159, 1]],
          [3, [74, 148, 169, 1]],
          [5, [77, 141, 123, 1]],
          [7, [83, 165, 83, 1]],
          [9, [53, 159, 53, 1]],
          [11, [167, 157, 81, 1]],
          [13, [159, 127, 58, 1]],
          [15, [161, 108, 92, 1]],
          [17, [129, 58, 78, 1]],
          [19, [175, 80, 136, 1]],
          [21, [117, 74, 147, 1]],
          [24, [109, 97, 163, 1]],
          [27, [68, 105, 141, 1]],
          [29, [92, 144, 152, 1]],
          [36, [125, 68, 165, 1]],
          [46, [231, 215, 215, 1]],
          [51, [219, 212, 135, 1]],
          [77, [205, 202, 112, 1]],
          [104, [128, 128, 128, 1]],
        ];

        const interpolateColor = windColor.reduce(
          (result: any[], item: any[], key) => result.concat(item[0], `rgba(${item[1].join(',')})`),
          [],
        );

        const layer = new Layer('wind', source, {
          styleSpec: {
            'fill-color': ['interpolate', ['linear'], ['get', 'value'], ...interpolateColor],
            opacity: 1,
          },
          renderFrom: RenderFrom.rg,
          displayRange: [0, 104],
          renderType: RenderType.colorize,
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
