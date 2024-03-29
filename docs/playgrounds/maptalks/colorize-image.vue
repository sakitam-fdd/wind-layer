<template>
  <div class="playground-content" ref="mapRef"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  // import maptalks from 'maptalks';
  // import { Layer, TileSource, RenderType, DecodeType, RenderFrom } from '@sakitam-gis/maplibre-wind';

  defineOptions({
    name: 'MaptalksColorizeImage',
  });

  const mapRef = ref<HTMLDivElement>();
  const emits = defineEmits(['mount']);

  let map;

  async function initMap() {
    const maptalks: any = await import('maptalks');
    const { Layer, ImageSource, RenderType, DecodeType, RenderFrom } = await import('@sakitam-gis/maptalks-wind');

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
      [0, [98, 113, 183, 255]],
      [1, [57, 97, 159, 255]],
      [3, [74, 148, 169, 255]],
      [5, [77, 141, 123, 255]],
      [7, [83, 165, 83, 255]],
      [9, [53, 159, 53, 255]],
      [11, [167, 157, 81, 255]],
      [13, [159, 127, 58, 255]],
      [15, [161, 108, 92, 255]],
      [17, [129, 58, 78, 255]],
      [19, [175, 80, 136, 255]],
      [21, [117, 74, 147, 255]],
      [24, [109, 97, 163, 255]],
      [27, [68, 105, 141, 255]],
      [29, [92, 144, 152, 255]],
      [36, [125, 68, 165, 255]],
      [46, [231, 215, 215, 256]],
      [51, [219, 212, 135, 256]],
      [77, [205, 202, 112, 256]],
      [104, [128, 128, 128, 255]],
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
