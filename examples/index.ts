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

import OlWindy from 'ol-wind';

function initMap() {
  const layer = new TileLayer({
    source: new OSM({
      url: 'http://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    }),
  });

  const map = new Map({
    layers: [layer],
    target: 'map',
    view: new View({
      projection: 'EPSG:3857',
      center: fromLonLat([113.53450137499999, 34.44104525]),
      zoom: 2,
    }),
  });

  const windLayer = new OlWindy({});

  console.log(map, windLayer);

  map.addLayer(windLayer);
}

if (document.getElementById('map')) {
  initMap();
}
