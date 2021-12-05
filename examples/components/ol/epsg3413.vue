<template>
  <div class="demo-content">
    <div class="map-warp" ref="map"></div>
  </div>
</template>
<script>
  import 'ol/ol.css';
  // import Map from 'src/Map';
  // import View from 'src/View';
  // import TileLayer from 'src/layer/Tile';
  // import { get as getProjection } from 'src/proj';
  // import OSM from 'src/source/OSM';
  // import { register } from 'src/proj/proj4';
  // import { WindLayer } from 'src-wind';

  export default {
    name: 'ol-wind-epsg3413',
    data() {
      return {};
    },
    watch: {},
    methods: {
      async initMap() {
        const Map = await import('ol/Map').then(res => res.default);
        const View = await import('ol/View').then(res => res.default);
        const TileLayer = await import('ol/layer/Tile').then(res => res.default);
        const { fromLonLat } = await import('ol/proj');
        const OSM = await import('ol/source/OSM').then(res => res.default);
        const { get: getProjection } = await import('ol/proj');
        const { register } = await import('ol/proj/proj4');
        const { WindLayer } = await import('src-wind');

        proj4.defs("EPSG:3413","+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");

        register(proj4);
        const extent  = [-190, 90, 180, 60];
        const bounds = [
          -6894746.0420226175, -6894746.0420226175,
          6894746.0420226175, 6894746.0420226175
        ];

        const projection = getProjection('EPSG:3413');
        projection.setWorldExtent(extent);
        projection.setExtent(bounds.map(n => 3 * n));

        const layer = new TileLayer({
          source: new OSM({
            projection: 'EPSG:3857',
            url: '//{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          }),
        });

        const map = new Map({
          layers: [layer],
          target: this.$refs.map,
          view: new View({
            projection: projection,
            center: [-47527.08583899386, 534308.4103305723]
          }),
          // pixelRatio: 2,
        });

        map.getView().fit(bounds, map.getSize());

        fetch(this.$withBase('/data/wind.json'))
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
              // map: map,
              // projection: 'EPSG:4326'
            });

            console.log(map, windLayer);

            map.addLayer(windLayer);
          });
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
