<template>
  <div class="playground-content">
    <div class="map" ref="mapRef"></div>
    <div ref="tpRef" class="tp-panel"></div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue';
  import { Pane } from 'tweakpane';
  import mapboxgl from 'mapbox-gl';
  import { Layer, ImageSource, RenderType, DecodeType, RenderFrom, MaskType } from '@sakitam-gis/mapbox-wind';

  defineOptions({
    name: 'MapboxParticlesImage',
  });

  const mapRef = ref<HTMLDivElement>();
  const tpRef = ref<HTMLDivElement>();
  const emits = defineEmits(['mount']);

  let map;
  let f;

  async function initMap() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoibWFwYm94LWdsLWpzIiwiYSI6ImNram9ybGI1ajExYjQyeGxlemppb2pwYjIifQ.LGy5UGNIsXUZdYMvfYRiAQ';
    map = new mapboxgl.Map({
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

    const clip = await fetch('https://blog.sakitam.com/wind-layer/data/countries-110m.geojson').then((res) =>
      res.json(),
    );

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

        const layer = new Layer('wind', source, {
          styleSpec: {
            'fill-color': ['interpolate', ['linear'], ['get', 'value'], ...interpolateColor],
            opacity: 1,
          },
          renderFrom: RenderFrom.rg,
          displayRange: [0, 104],
          renderType: RenderType.colorize,
          picking: true,
          mask: {
            data: clip,
            // type: mapboxWind.MaskType.outside,
            type: MaskType.inside, // 默认是 inside，即只显示范围内的
          },
        });

        const particlesConfig = {
          speedFactor: ['interpolate', ['exponential', 0.5], ['zoom'], 0, 1, 15, 0.01],
          fadeOpacity: 0.93,
          dropRate: 0.003,
          dropRateBump: 0.002,
        };

        const wind = new Layer('wind-particles', source, {
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

        f = new Pane({
          container: tpRef.value,
        });

        const panel = f.addFolder({
          title: 'mapbox-gl-colorize',
          expanded: true,
        });

        const particlesPanel = f.addFolder({
          title: 'mapbox-gl-particles',
          expanded: true,
        });

        panel.addBinding({ add: true }, 'add').on('change', (ev) => {
          if (!ev.value) {
            map.removeLayer(layer.id);
          } else {
            map.addLayer(layer);
          }
        });

        particlesPanel.addBinding({ add: true }, 'add').on('change', (ev) => {
          if (!ev.value) {
            map.removeLayer(wind.id);
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

        map.addLayer(layer);
        map.addLayer(wind);
      });
    }

    emits('mount');
  }

  onMounted(() => {
    initMap();
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
  }
</style>
