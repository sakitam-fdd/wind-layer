<template>
  <div class="playground-content">
    <div class="map" ref="mapRef"></div>
    <div ref="tpRef" class="tp-panel"></div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue';
  import { Pane } from 'tweakpane';
  // 这里由于依赖库在 ssg 模式下构建会有问题，只能允许类库异步加载
  // import L from 'leaflet';
  // import { WindLayer } from 'leaflet-wind';

  defineOptions({
    name: 'LeafletGlArrowTile',
  });

  const mapRef = ref<HTMLDivElement>();
  const tpRef = ref<HTMLDivElement>();
  const emits = defineEmits(['mount']);

  let map;

  async function initMap() {
    const L: any = await import('leaflet');
    const { WebglLayer, TileSource, DecodeType, RenderFrom, RenderType } = await import('leaflet-wind');

    if (!mapRef.value) return;

    map = new L.map(mapRef.value, {
      zoom: 1,
      center: [113.53450137499999, 34.44104525].reverse(),
      // zoom: 4
    });

    const layer = L.tileLayer('//{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
      subdomains: ['a', 'b', 'c', 'd'],
    });

    map.addLayer(layer);

    const clip = await fetch('https://blog.sakitam.com/wind-layer/data/countries-110m.geojson').then((res) =>
      res.json(),
    );

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
      [] as any[],
    );

    const config = {
      opacity: 1,
      sizeW: 12,
      sizeH: 10,
      space: 20,
    };

    const wind = new WebglLayer('leaflet-wind-arrow', source, {
      styleSpec: {
        'fill-color': [
          'interpolate',
          ['step', 1],
          ['get', 'value'],
          // ...interpolateColor
          0,
          '#fff',
          104,
          '#fff',
        ],
        opacity: config.opacity,
        space: config.space,
        size: [config.sizeW, config.sizeH],
      },
      renderFrom: RenderFrom.rg,
      displayRange: [0, 104],
      renderType: RenderType.arrow,
      picking: true,
    });

    const f = new Pane({
      container: tpRef.value,
    });

    const panel = f.addFolder({
      title: 'LeafletGlArrow',
      expanded: true,
    });

    panel.addBinding({ add: true }, 'add').on('change', (ev) => {
      if (!ev.value) {
        map.removeLayer(wind);
      } else {
        map.addLayer(wind);
      }
    });

    panel
      .addBinding(config, 'opacity', {
        min: 0,
        max: 1,
        step: 0.01,
      })
      .on('change', (ev) => {
        wind.updateOptions({
          styleSpec: {
            opacity: ev.value,
          },
        });
      });

    panel
      .addBinding(config, 'space', {
        min: 0,
        max: 100,
        step: 1,
      })
      .on('change', (ev) => {
        wind.updateOptions({
          styleSpec: {
            space: ev.value,
          },
        });
      });

    panel
      .addBinding(config, 'sizeW', {
        min: 0,
        max: 30,
        step: 1,
      })
      .on('change', (ev) => {
        wind.updateOptions({
          styleSpec: {
            size: [ev.value, config.sizeH],
          },
        });
      });

    panel
      .addBinding(config, 'sizeH', {
        min: 0,
        max: 30,
        step: 1,
      })
      .on('change', (ev) => {
        wind.updateOptions({
          styleSpec: {
            size: [config.sizeW, ev.value],
          },
        });
      });

    map.addLayer(wind);

    emits('mount');
  }

  onMounted(() => {
    setTimeout(() => initMap(), 1000);
  });

  onUnmounted(() => {
    if (map) {
      map.remove();
    }
  });

  defineExpose({
    pause: () => {},
    resume: () => {},
  });
</script>

<style scoped>
  @import 'https://esm.sh/mapbox-gl/dist/mapbox-gl.css';

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
