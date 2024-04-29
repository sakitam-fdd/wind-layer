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
    name: 'LeafletGlParticlesImage',
  });

  const mapRef = ref<HTMLDivElement>();
  const tpRef = ref<HTMLDivElement>();
  const emits = defineEmits(['mount']);

  let map;

  async function initMap() {
    const L: any = await import('leaflet');
    const { WebglLayer, ImageSource, DecodeType, RenderFrom, RenderType } = await import('leaflet-wind');

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
      [] as any[],
    );

    const particlesConfig = {
      speedFactor: ['interpolate', ['exponential', 0.5], ['zoom'], 0, 1, 15, 0.01],
      fadeOpacity: 0.93,
      dropRate: 0.003,
      dropRateBump: 0.002,
    };

    const wind = new WebglLayer('leaflet-wind-particles', source, {
      styleSpec: {
        'fill-color': ['interpolate', ['step', 1], ['get', 'value'], 0, '#fff', 104, '#fff'],
        opacity: ['interpolate', ['exponential', 0.5], ['zoom'], 1, 1, 2, 1],
        numParticles: [
          'interpolate',
          ['exponential', 0.5],
          ['zoom'],
          0, // zoom
          65535 / 8, // numParticles
          8, // zoom
          65535 / 16, // numParticles
        ],
        ...particlesConfig,
      },
      renderFrom: RenderFrom.rg,
      displayRange: [0, 104],
      renderType: RenderType.particles,
      // mask: {
      //   data: clip,
      //   // type: mapboxWind.MaskType.outside,
      //   type: mapboxWind.MaskType.inside, // 默认是 inside，即只显示范围内的
      // }
    });

    const f = new Pane({
      container: tpRef.value,
    });

    const particlesPanel = f.addFolder({
      title: 'LeafletGlParticles',
      expanded: true,
    });

    particlesPanel.addBinding({ add: true }, 'add').on('change', (ev) => {
      if (!ev.value) {
        map.removeLayer(wind);
      } else {
        map.addLayer(wind);
      }
    });

    particlesPanel
      .addBinding(particlesConfig, 'fadeOpacity', {
        min: 0,
        max: 1,
        step: 0.01,
      })
      .on('change', (ev) => {
        wind.updateOptions({
          styleSpec: {
            fadeOpacity: ev.value,
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
