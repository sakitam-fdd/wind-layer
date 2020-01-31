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

import { WindLayer, Field } from 'ol-wind';

function initMap() {
  const layer = new TileLayer({
    source: new OSM({
      // projection: 'EPSG:3857',
      url: 'http://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
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

      let uComp: any = null;
      let vComp: any = null;

      console.time('start');

      res.forEach(function (record: { header: { parameterCategory: string; parameterNumber: string; }; }) {
        switch (record.header.parameterCategory + "," + record.header.parameterNumber) {
          case "1,2":
          case "2,2":
            uComp = record;
            break;
          case "1,3":
          case "2,3":
            vComp = record;
            break;
        }
      });

      const header: any = uComp.header;

      // @ts-ignore
      const vectorField = new Field({
        xmin: header.lo1, // 一般格点数据是按照矩形范围来切割，所以定义其经纬度范围
        ymin: header.la2,
        xmax: 360,
        ymax: header.la1,
        deltaX: 1, // x（经度）增量
        deltaY: 1, // y（维度）增量
        cols: 360, // 列（可由 `(xmax - xmin) / deltaX` 得到）
        rows: 181, // 行
        us: uComp.data, // U分量
        vs: vComp.data, // V分量
      });

      console.timeEnd('start');

      console.log(res, vectorField);

      const windLayer = new WindLayer(vectorField, {
        colorScale: () => {
          // console.log(m);
          return '#fff';
        },
        velocityScale: 1 / 20,
        paths: 5000,
      });

      console.log(map, windLayer);

      map.addLayer(windLayer);
    });
}

if (document.getElementById('map')) {
  initMap();
}
