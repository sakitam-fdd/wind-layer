import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Circle from 'ol/geom/Circle';
import { Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

import { WindLayer } from 'ol-wind';

const image = new CircleStyle({
  radius: 5,
  fill: undefined,
  stroke: new Stroke({color: 'red', width: 1})
});

const styles = {
  'Point': new Style({
    image: image
  }),
  'LineString': new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1
    })
  }),
  'MultiLineString': new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1
    })
  }),
  'MultiPoint': new Style({
    image: image
  }),
  'MultiPolygon': new Style({
    stroke: new Stroke({
      color: 'yellow',
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 0, 0.1)'
    })
  }),
  'Polygon': new Style({
    stroke: new Stroke({
      color: 'blue',
      lineDash: [4],
      width: 3
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  }),
  'GeometryCollection': new Style({
    stroke: new Stroke({
      color: 'magenta',
      width: 2
    }),
    fill: new Fill({
      color: 'magenta'
    }),
    image: new CircleStyle({
      radius: 10,
      fill: undefined,
      stroke: new Stroke({
        color: 'magenta'
      })
    })
  }),
  'Circle': new Style({
    stroke: new Stroke({
      color: 'red',
      width: 2
    }),
    fill: new Fill({
      color: 'rgba(255,0,0,0.2)'
    })
  })
};

const styleFunction = function(feature: Feature) {
  // @ts-ignore
  return styles[feature.getGeometry().getType()];
};

function initMap() {
  const layer = new TileLayer({
    source: new OSM({
      // projection: 'EPSG:3857',
      url: '//{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    }),
  });

  const vectorSource = new VectorSource({
    features: (new GeoJSON()).readFeatures({
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:3857'
        }
      },
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [0, 0]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [[4e6, -2e6], [8e6, 2e6]]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [[4e6, 2e6], [8e6, -2e6]]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [[[-5e6, -1e6], [-4e6, 1e6], [-3e6, -1e6]]]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'MultiLineString',
          'coordinates': [
            [[-1e6, -7.5e5], [-1e6, 7.5e5]],
            [[1e6, -7.5e5], [1e6, 7.5e5]],
            [[-7.5e5, -1e6], [7.5e5, -1e6]],
            [[-7.5e5, 1e6], [7.5e5, 1e6]]
          ]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'MultiPolygon',
          'coordinates': [
            [[[-5e6, 6e6], [-5e6, 8e6], [-3e6, 8e6], [-3e6, 6e6]]],
            [[[-2e6, 6e6], [-2e6, 8e6], [0, 8e6], [0, 6e6]]],
            [[[1e6, 6e6], [1e6, 8e6], [3e6, 8e6], [3e6, 6e6]]]
          ]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'GeometryCollection',
          'geometries': [{
            'type': 'LineString',
            'coordinates': [[-5e6, -5e6], [0, -5e6]]
          }, {
            'type': 'Point',
            'coordinates': [4e6, -5e6]
          }, {
            'type': 'Polygon',
            'coordinates': [[[1e6, -6e6], [2e6, -4e6], [3e6, -6e6]]]
          }]
        }
      }]
    })
  });

  vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));

  // @ts-ignore
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    // @ts-ignore
    style: styleFunction
  });

  const map = new Map({
    layers: [layer, vectorLayer],
    target: 'map',
    view: new View({
      // projection: 'EPSG:4326',
      center: fromLonLat([113.53450137499999, 34.44104525]),
      // center: [113.53450137499999, 34.44104525],
      zoom: 2,
    }),
    // pixelRatio: 2,
  });

  // @ts-ignore
  window.map = map;

  // fetch('https://sakitam-fdd.github.io/wind-layer/data/wind.json')
  fetch('https://sakitam-1255686840.cos.ap-beijing.myqcloud.com/public/codepen/json/out.json')
    .then(res => res.json())
    .then(res => {
      const windLayer = new WindLayer(res, {
        wrapX: true,
        forceRender: false,
        windOptions: {
          // colorScale: scale,
          velocityScale: 0.005,
          paths: 2000,
          // eslint-disable-next-line no-unused-vars
          colorScale: () => {
            // console.log(m);
            return '#ff473c';
          },
          width: 3,
          // colorScale: scale,
        },
        // map: map,
        // projection: 'EPSG:4326'
      });

      console.log(map, windLayer);

      // @ts-ignore
      map.addLayer(windLayer);
    });
}

if (document.getElementById('map')) {
  initMap();
}
