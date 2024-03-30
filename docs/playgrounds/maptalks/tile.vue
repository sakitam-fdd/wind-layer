<template>
  <div class="playground-content" ref="mapRef"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  // 这里由于依赖库在 ssg 模式下构建会有问题，只能允许类库异步加载
  // import { Layer, TileSource, RenderType } from '@sakitam-gis/maptalks-wind';

  defineOptions({
    name: 'SampleTileRaster',
  });

  const mapRef = ref<HTMLDivElement>();
  const emits = defineEmits(['mount']);

  let map;

  async function initMap() {
    const maptalks: any = await import('maptalks');
    const { Layer, TileSource, RenderType } = await import('@sakitam-gis/maptalks-wind');

    map = new maptalks.Map(mapRef.value, {
      zoom: 2,
      center: [34.371, 131.287].reverse(),
      // baseLayer: new maptalks.TileLayer('base', {
      //   urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      //   // urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      //   subdomains: ['a', 'b', 'c', 'd'],
      //   repeatWorld: 'x',
      // })
    });

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
