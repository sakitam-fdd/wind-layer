<template>
  <div class="playground-content" id="bmap" ref="mapRef"></div>
</template>
<script setup lang="ts">
  import { onMounted } from 'vue';

  function loadBMapScript(key = 'bxFuXXDt1oKdlgu6mXCCnK51cDgDGBLp') {
    return new Promise((resolve, reject) => {
      if (typeof globalThis.BMapGL !== 'undefined') {
        resolve(globalThis.BMapGL);
        return;
      }
      globalThis.onCallback = function () {
        resolve(globalThis.BMapGL);
      };
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://api.map.baidu.com/api?&v=3.0&ak=${key}&callback=onCallback`;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  const emits = defineEmits(['mount']);

  const initMap = () => {
    loadBMapScript().then(() => {
        const map = new globalThis.BMap.Map("bmap"); // eslint-disable-line
        map.centerAndZoom(new globalThis.BMap.Point(116.3964, 39.9093), 2); // eslint-disable-line
      map.enableScrollWheelZoom();
      // 地图自定义样式
      map.setMapStyle({
        styleJson: [
          {
            featureType: 'water',
            elementType: 'all',
            stylers: {
              color: '#044161',
            },
          },
          {
            featureType: 'land',
            elementType: 'all',
            stylers: {
              color: '#091934',
            },
          },
          {
            featureType: 'boundary',
            elementType: 'geometry',
            stylers: {
              color: '#064f85',
            },
          },
          {
            featureType: 'railway',
            elementType: 'all',
            stylers: {
              visibility: 'off',
            },
          },
          {
            featureType: 'highway',
            elementType: 'geometry',
            stylers: {
              color: '#004981',
            },
          },
          {
            featureType: 'highway',
            elementType: 'geometry.fill',
            stylers: {
              color: '#005b96',
              lightness: 1,
            },
          },
          {
            featureType: 'highway',
            elementType: 'labels',
            stylers: {
              visibility: 'on',
            },
          },
          {
            featureType: 'arterial',
            elementType: 'geometry',
            stylers: {
              color: '#004981',
              lightness: -39,
            },
          },
          {
            featureType: 'arterial',
            elementType: 'geometry.fill',
            stylers: {
              color: '#00508b',
            },
          },
          {
            featureType: 'poi',
            elementType: 'all',
            stylers: {
              visibility: 'off',
            },
          },
          {
            featureType: 'green',
            elementType: 'all',
            stylers: {
              color: '#056197',
              visibility: 'off',
            },
          },
          {
            featureType: 'subway',
            elementType: 'all',
            stylers: {
              visibility: 'off',
            },
          },
          {
            featureType: 'manmade',
            elementType: 'all',
            stylers: {
              visibility: 'off',
            },
          },
          {
            featureType: 'local',
            elementType: 'all',
            stylers: {
              visibility: 'off',
            },
          },
          {
            featureType: 'arterial',
            elementType: 'labels',
            stylers: {
              visibility: 'off',
            },
          },
          {
            featureType: 'boundary',
            elementType: 'geometry.fill',
            stylers: {
              color: '#029fd4',
            },
          },
          {
            featureType: 'building',
            elementType: 'all',
            stylers: {
              color: '#1a5787',
            },
          },
          {
            featureType: 'label',
            elementType: 'all',
            stylers: {
              visibility: 'off',
            },
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: {
              color: '#ffffff',
            },
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.stroke',
            stylers: {
              color: '#1e1c1c',
            },
          },
          {
            featureType: 'administrative',
            elementType: 'labels',
            stylers: {
              visibility: 'off',
            },
          },
          {
            featureType: 'road',
            elementType: 'labels',
            stylers: {
              visibility: 'off',
            },
          },
        ],
      });
      import('bmap-wind').then(({ WindLayer }) => {
        fetch('https://sakitam.oss-cn-beijing.aliyuncs.com/codepen/wind-layer/json/wind.json')
          .then((res) => res.json())
          .then((res) => {
            const windLayer = new WindLayer(res, {
              windOptions: {
                // colorScale: scale,
                velocityScale: 1 / 20,
                paths: 5000,
                // eslint-disable-next-line no-unused-vars
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
                lineWidth: 2,
                // colorScale: scale,
                generateParticleOption: false,
              },
              zIndex: 20,
              // map: map,
              // projection: 'EPSG:4326'
            });

            map.addOverlay(windLayer);

            emits('mount');
          });
      });
    });
  };

  onMounted(() => {
    initMap();
  });
</script>
<style>
  .playground-content {
    width: 100%;
    height: 450px;
  }
</style>
