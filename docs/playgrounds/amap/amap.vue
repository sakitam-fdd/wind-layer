<template>
  <div class="playground-content" id="amap" ref="mapRef"></div>
</template>
<script setup lang="ts">
  import { onMounted } from 'vue';

  const emits = defineEmits(['mount']);

  const initMap = async () => {
    const AMapLoader = await import('@amap/amap-jsapi-loader');
    AMapLoader.load({
      key: '6cb85da518029607d421917b7ddeb94a', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    }).then(() => {
      const map = new globalThis.AMap.Map('amap', {
        // viewMode: '3D',
        resizeEnable: true,
        zoom: 0,
        center: [113.53450137499999, 34.44104525],
        // mapStyle: 'amap://styles/dark',
        zooms: [0, 18],
      });

      import('amap-wind').then(({ WindLayer }) => {
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

            windLayer.appendTo(map);

            emits('mount');
          });
      });
    });
  };

  onMounted(() => {
    initMap();
  });

  defineExpose({
    pause: () => {},
    resume: () => {},
  });
</script>

<style>
  .playground-content {
    width: 100%;
    height: 450px;
  }
</style>
