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
    name: 'LeafletParticles',
  });

  const mapRef = ref<HTMLDivElement>();
  const tpRef = ref<HTMLDivElement>();
  const emits = defineEmits(['mount']);

  let map;

  async function initMap() {
    const L: any = await import('leaflet');
    const { WindLayer } = await import('leaflet-wind');

    map = new L.map(mapRef.value, {
      zoom: 5,
      center: [113.53450137499999, 34.44104525].reverse(),
      // zoom: 4
    });

    const layer = L.tileLayer('//{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
      subdomains: ['a', 'b', 'c', 'd'],
    });

    map.addLayer(layer);
    const data = await fetch('https://blog.sakitam.com/wind-layer/data/wind.json').then((res) => res.json());

    const velocityScale = [0.1, 0.2, 0.3, 0.4, 0.5];

    const panelOptions = {
      add: true,
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
      frameRate: 16,
      maxAge: 60,
      globalAlpha: 0.9,
      velocityScale: 0.1,
      paths: 1000,
    };

    const windLayer = new WindLayer('wind', data, {
      windOptions: {
        // colorScale: (m) => {
        //   // console.log(m);
        //   return '#fff';
        // },
        ...panelOptions,
        velocityScale: () => velocityScale[map.getZoom() - 5] * 0.1 || 0.1,
      },
    });

    console.log(map, windLayer);

    map.addLayer(windLayer);

    const f = new Pane({
      container: tpRef.value,
    });

    const panel = f.addFolder({
      title: 'leaflet',
      expanded: true,
    });

    panel.addBinding(panelOptions, 'add').on('change', (ev) => {
      if (!ev.value) {
        map.removeLayer(windLayer);
      } else {
        map.addLayer(windLayer);
      }
    });

    panel
      .addBinding(panelOptions, 'paths', {
        min: 0,
        max: 5000,
        step: 1,
      })
      .on('change', (ev) => {
        windLayer.setWindOptions({
          paths: ev.value,
        });
      });

    panel
      .addBinding(panelOptions, 'globalAlpha', {
        min: 0,
        max: 1,
        step: 0.01,
      })
      .on('change', (ev) => {
        windLayer.setWindOptions({
          globalAlpha: ev.value,
        });
      });

    panel
      .addBinding(panelOptions, 'velocityScale', {
        min: 0,
        max: 0.5,
        step: 0.01,
      })
      .on('change', (ev) => {
        windLayer.setWindOptions({
          velocityScale: ev.value,
        });
      });

    panel
      .addBinding(panelOptions, 'maxAge', {
        min: 0,
        max: 100,
        step: 1,
      })
      .on('change', (ev) => {
        windLayer.setWindOptions({
          maxAge: ev.value,
        });
      });

    panel
      .addBinding(panelOptions, 'frameRate', {
        min: 0,
        max: 100,
        step: 1,
      })
      .on('change', (ev) => {
        windLayer.setWindOptions({
          frameRate: ev.value,
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
