<template>
  <div class="demo-content">
    <div class="map-warp" ref="map" id="amap"></div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

const map = ref(null)

const initMap = (dom) => {
  const map = new AMap.Map('amap', {
    // viewMode: '3D',
    resizeEnable: true,
    zoom: 0,
    center: [113.53450137499999, 34.44104525],
    // mapStyle: 'amap://styles/dark',
    zooms: [0, 18]
  });

  // const { WindLayer } = require('amap-wind');

  import('amap-wind').then(({ WindLayer }) => {
    fetch('https://sakitam.oss-cn-beijing.aliyuncs.com/codepen/wind-layer/json/wind.json')
        .then(res => res.json())
        .then(res => {
          const windLayer = new WindLayer(res, {
            windOptions: {
              // colorScale: scale,
              velocityScale: 1 / 20,
              paths: 5000,
              // eslint-disable-next-line no-unused-vars
              colorScale: [
                "rgb(36,104, 180)",
                "rgb(60,157, 194)",
                "rgb(128,205,193 )",
                "rgb(151,218,168 )",
                "rgb(198,231,181)",
                "rgb(238,247,217)",
                "rgb(255,238,159)",
                "rgb(252,217,125)",
                "rgb(255,182,100)",
                "rgb(252,150,75)",
                "rgb(250,112,52)",
                "rgb(245,64,32)",
                "rgb(237,45,28)",
                "rgb(220,24,32)",
                "rgb(180,0,35)"
              ],
              lineWidth: 2,
              // colorScale: scale,
              generateParticleOption: false
            },
            zIndex: 20,
            // map: map,
            // projection: 'EPSG:4326'
          });

          console.log(map, windLayer);

          windLayer.appendTo(map);
        });
  });
}

onMounted(() => {
  initMap(map.value);
});
</script>

<style lang="less">
.demo-content {
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: #cbe0ff;
  &-datgui {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
    pointer-events: auto;
  }

  .map-warp {
    width: 100%;
    height: 100%;
  }
}
</style>
