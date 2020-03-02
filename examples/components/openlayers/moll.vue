<template>
  <div class="demo-content">
    <div class="map-warp" ref="map"></div>
  </div>
</template>
<script>
  import '@sakitam-gis/ol5/ol.css';
  import { loadScript } from '../../utils';

  export default {
    name: 'openlayers-wind-moll',
    data() {
      return {};
    },
    watch: {},
    methods: {
      async initMap() {
        proj4.defs('ESRI:53009', '+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=6371000 ' +
          '+b=6371000 +units=m +no_defs');

        loadScript('https://cdn.jsdelivr.net/npm/openlayers-wind/dist/ol-wind.js', 'cdn.jsdelivr.net/npm/openlayers-wind')
          .then(flag => {
            if (flag) {

              // Configure the Sphere Mollweide projection object with an extent,
              // and a world extent. These are required for the Graticule.
              const sphereMollweideProjection = new ol.proj.Projection({
                code: 'ESRI:53009',
                extent: [-9009954.605703328, -9009954.605703328,
                  9009954.605703328, 9009954.605703328],
                worldExtent: [-179, -89.99, 179, 89.99]
              });

              const layer = new ol.layer.Tile({
                source: new ol.source.OSM({
                  projection: 'EPSG:3857',
                  url: '//{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                }),
              });

              const map = new ol.Map({
                layers: [
                  layer,
                  new ol.layer.Vector({
                    source: new ol.source.Vector({
                      url: '/data/countries-110m.geojson',
                      format: new ol.format.GeoJSON()
                    })
                  }),
                ],
                target: this.$refs.map,
                view: new ol.View({
                  center: [0, 0],
                  projection: sphereMollweideProjection,
                  resolutions: [65536, 32768, 16384, 8192, 4096, 2048],
                  zoom: 1
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

                  console.log(map, windLayer);
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
