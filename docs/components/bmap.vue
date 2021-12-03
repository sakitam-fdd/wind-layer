<template>
  <div class="demo-content">
    <div class="map-warp" ref="map" id="bmap"></div>
  </div>
</template>
<script setup>
import {ref, onMounted} from 'vue'

const map = ref(null)

const initMap = (dom) => {
  const map = new BMap.Map("bmap"); // eslint-disable-line
  map.centerAndZoom(new BMap.Point(116.3964, 39.9093), 2); // eslint-disable-line
  map.enableScrollWheelZoom();
  // 地图自定义样式
  map.setMapStyle({
    styleJson: [{
      "featureType": "water",
      "elementType": "all",
      "stylers": {
        "color": "#044161"
      }
    }, {
      "featureType": "land",
      "elementType": "all",
      "stylers": {
        "color": "#091934"
      }
    }, {
      "featureType": "boundary",
      "elementType": "geometry",
      "stylers": {
        "color": "#064f85"
      }
    }, {
      "featureType": "railway",
      "elementType": "all",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "highway",
      "elementType": "geometry",
      "stylers": {
        "color": "#004981"
      }
    }, {
      "featureType": "highway",
      "elementType": "geometry.fill",
      "stylers": {
        "color": "#005b96",
        "lightness": 1
      }
    }, {
      "featureType": "highway",
      "elementType": "labels",
      "stylers": {
        "visibility": "on"
      }
    }, {
      "featureType": "arterial",
      "elementType": "geometry",
      "stylers": {
        "color": "#004981",
        "lightness": -39
      }
    }, {
      "featureType": "arterial",
      "elementType": "geometry.fill",
      "stylers": {
        "color": "#00508b"
      }
    }, {
      "featureType": "poi",
      "elementType": "all",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "green",
      "elementType": "all",
      "stylers": {
        "color": "#056197",
        "visibility": "off"
      }
    }, {
      "featureType": "subway",
      "elementType": "all",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "manmade",
      "elementType": "all",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "local",
      "elementType": "all",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "arterial",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "boundary",
      "elementType": "geometry.fill",
      "stylers": {
        "color": "#029fd4"
      }
    }, {
      "featureType": "building",
      "elementType": "all",
      "stylers": {
        "color": "#1a5787"
      }
    }, {
      "featureType": "label",
      "elementType": "all",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": {
        "color": "#ffffff"
      }
    }, {
      "featureType": "poi",
      "elementType": "labels.text.stroke",
      "stylers": {
        "color": "#1e1c1c"
      }
    }, {
      "featureType": "administrative",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }, {
      "featureType": "road",
      "elementType": "labels",
      "stylers": {
        "visibility": "off"
      }
    }]
  });

  // const { WindLayer } = require('bmap-wind');

  import('bmap-wind').then(({WindLayer}) => {
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

        map.addOverlay(windLayer);
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
