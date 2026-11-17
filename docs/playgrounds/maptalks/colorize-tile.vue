<template>
  <div class="playground-content" ref="mapRef"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  // import maptalks from 'maptalks';
  // import { Layer, TileSource, RenderType, DecodeType, RenderFrom } from '@sakitam-gis/maplibre-wind';

  defineOptions({
    name: 'MaptalksColorizeTile',
  });

  const mapRef = ref<HTMLDivElement>();
  const emits = defineEmits(['mount']);

  let map;

  async function initMap() {
    const maptalks: any = await import('maptalks');
    const { Layer, TileSource, RenderType, DecodeType, RenderFrom } = await import('@sakitam-gis/maptalks-wind');

    map = new maptalks.Map(mapRef.value, {
      zoom: 2,
      center: [34.371, 131.287].reverse(),
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        // urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c', 'd'],
        repeatWorld: 'x',
      }),
    });

    const source = new TileSource('wind', {
      url: 'https://blog.sakitam.com/wind-layer/data/tiles/2023111700/2023111703/{z}/{x}/{y}/wind-surface.jpeg',
      tileSize: 256,
      minZoom: 0,
      maxZoom: 3,
      roundZoom: true,
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
      widthSegments: 1,
      heightSegments: 1,
      displayRange: [0, 104],
      renderType: RenderType.colorize,
    });

    map.addLayer(layer);

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
  @import 'https://esm.sh/maptalks/dist/maptalks.css';

  .playground-content {
    width: 100%;
    height: 450px;
  }
</style>
