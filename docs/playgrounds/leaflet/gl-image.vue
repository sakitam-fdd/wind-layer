<template>
  <div class="playground-content">
    <div class="map" ref="mapRef"></div>
    <div ref="tpRef" class="tp-panel"></div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { Pane } from 'tweakpane';
  // 这里由于依赖库在 ssg 模式下构建会有问题，只能允许类库异步加载
  // import L from 'leaflet';
  // import { WindLayer } from 'leaflet-wind';

  defineOptions({
    name: 'LeafletGlRasterImage',
  });

  const mapRef = ref<HTMLDivElement>();
  const tpRef = ref<HTMLDivElement>();
  const emits = defineEmits(['mount']);

  let map;

  async function initMap() {
    const L: any = await import('leaflet');
    const { WebglLayer, ImageSource, RenderFrom, RenderType } = await import('leaflet-wind');

    map = new L.map(mapRef.value, {
      zoom: 1,
      center: [113.53450137499999, 34.44104525].reverse(),
      // zoom: 4
    });

    const layer = L.tileLayer('//{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
      subdomains: ['a', 'b', 'c', 'd'],
    });

    map.addLayer(layer);

    const source = new ImageSource('raster', {
      url: 'https://a.basemaps.cartocdn.com/light_all/0/0/0.png',
      coordinates: [
        [-180, 85.051129],
        [180, 85.051129],
        [180, -85.051129],
        [-180, -85.051129],
      ],
      wrapX: true,
    });

    const raster = new WebglLayer('raster', source, {
      styleSpec: {
        opacity: 1,
      },
      renderFrom: RenderFrom.r,
      renderType: RenderType.image,
    });

    map.addLayer(raster);

    const f = new Pane({
      container: tpRef.value,
    });

    const panelOptions = {
      add: true,
      opacity: 1,
    };

    const panel = f.addFolder({
      title: 'leaflet',
      expanded: true,
    });

    panel.addBinding(panelOptions, 'add').on('change', (ev) => {
      if (!ev.value) {
        map.removeLayer(raster);
      } else {
        map.addLayer(raster);
      }
    });

    panel
      .addBinding(panelOptions, 'opacity', {
        min: 0,
        max: 1,
        step: 0.01,
      })
      .on('change', (ev) => {
        raster.updateOptions({
          styleSpec: {
            opacity: ev.value,
          },
        });
      });

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

<style scoped>
  @import 'https://esm.sh/leaflet/dist/leaflet.css';

  .playground-content {
    width: 100%;
    height: 450px;
    position: relative;
  }

  .map {
    width: 100%;
    height: 100%;
  }

  .tp-panel {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 9999;
  }
</style>
