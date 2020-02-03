// @ts-ignore
import Map from 'ol/Map';
// @ts-ignore
import View from 'ol/View';
// @ts-ignore
import TileLayer from 'ol/layer/Tile';
// @ts-ignore
import { fromLonLat } from 'ol/proj';
// @ts-ignore
import OSM from 'ol/source/OSM';

import { WindLayer } from 'ol-wind';

function initMap() {
  const layer = new TileLayer({
    source: new OSM({
      // projection: 'EPSG:3857',
      url: 'https://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    }),
  });

  const map = new Map({
    layers: [layer],
    target: 'map',
    view: new View({
      projection: 'EPSG:3857',
      center: fromLonLat([113.53450137499999, 34.44104525]),
      // center: [113.53450137499999, 34.44104525],
      zoom: 2,
    }),
  });

  fetch('https://sakitam-fdd.github.io/wind-layer/examples/out.json')
    .then(res => res.json())
    .then(res => {
      const windLayer = new WindLayer(res, {
        colorScale: () => {
          // console.log(m);
          return '#fff';
        },
        velocityScale: 1 / 20,
        paths: 800,
        map,
      });

      console.log(map, windLayer);

      map.addLayer(windLayer);
    });
}

if (document.getElementById('map')) {
  initMap();
}
