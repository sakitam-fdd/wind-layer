import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat, transform } from 'ol/proj';
import OSM from 'ol/source/OSM';

import OlWindy from './index';

const istanbul = fromLonLat([113.53450137499999, 34.44104525]);

const view = new View({
  center: istanbul,
  // center: [113.53450137499999, 34.44104525],
  zoom: 4
  // projection: 'EPSG:4326'
});

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      preload: 4,
      source: new OSM({
        // url: '//{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
        url: '//mt{1-3}.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G'
      })
    })
  ],
  view: view
});

fetch('./out.json')
  .then(res => res.json())
  .then(res => {
    const config = {
      minVelocity: 0, // 粒子强度最小的速度 (m/s)
      maxVelocity: 10, // 粒子强度最大的速度 (m/s)
      velocityScale: 0.05, // 风速的比例
      particleAge: 90, // 重绘之前生成的离子数量的最大帧数
      lineWidth: 1, // 绘制粒子的线宽
      particleMultiplier: 0.01 // 离子数量
    };

    const layer = new OlWindy(res, {
      layerName: 'data',
      projection: 'EPSG:4326',
      devicePixelRatio: window.devicePixelRatio,
      // map: map,
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
        'rgb(180,0,35)'
      ],
      ...config
    });

    map.addLayer(layer);

    map.on('click', function (event) {
      const data = layer.getPointData(transform(event.coordinate, map.getView().getProjection(), 'EPSG:4326'));
      console.log(data);
    });
  });
