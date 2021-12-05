<template>
  <div class="demo-content">
    <div class="map-warp" ref="map"></div>
  </div>
</template>
<script>
  import '@sakitam-gis/ol5/src.css';
  import { loadScript } from '../../utils';

  export default {
    name: 'openlayers-wind-base',
    data() {
      return {};
    },
    watch: {},
    methods: {
      async initMap() {
        loadScript('https://cdn.jsdelivr.net/npm/openlayers-wind/dist/ol-wind.js', 'cdn.jsdelivr.net/npm/openlayers-wind')
          .then(flag => {
            if (flag) {
              const layer = new ol.layer.Tile({
                source: new ol.source.OSM({
                  // projection: 'EPSG:3857',
                  // url: '//{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                  url: '//{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                }),
              });

              const map = new ol.Map({
                layers: [layer],
                target: this.$refs.map,
                view: new ol.View({
                  // projection: 'EPSG:4326',
                  center: ol.proj.fromLonLat([113.53450137499999, 34.44104525]),
                  // center: [113.53450137499999, 34.44104525],
                  zoom: 2,
                }),
                // pixelRatio: 2,
              });

              fetch(this.$withBase('/data/wind.json'))
                .then(res => res.json())
                .then(res => {
                  const windLayer = new OlWind.WindLayer(res, {
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
                    map: map,
                    // projection: 'EPSG:4326'
                  });
                });
            }
          })
          .catch(error => console.log(error));
      }
    },
    mounted() {
      this.initMap();
    },
  };
</script>

<style lang="less">
  .demo-content {
    width: 100%;
    height: 100%;
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
