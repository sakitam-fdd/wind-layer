---
home: true
title: wind-layer
description: 风场插件.
actionText: 开始使用
actionLink: /start/
footer: sakitam-fdd
---

## wind-layer

a [openlayers](http://openlayers.org) | [bmap](https://map.baidu.com/) | [amap](https://ditu.amap.com/) | [maptalks](https://maptalks.org/) extension to show wind field。

### 介绍

  [wind-layer](./) 设计之初是来源于 [earth](http://earth.nullschool.net) [cambecc](https://github.com/cambecc/earth) 的一个气象数据的展示，他使用了流体场的方式去展示了全球的风速和风向富有很强的
表现力, 这个插件的很多核心代码也是来源于此。

  目前最新版本为`v1.0.0`体验版，在`1.0`版本之前，在设计之初考虑的只有 [`openlayers`](http://openlayers.org)
一个地图引擎的支持，所以统一使用的是一个`package` 进行管理；这在后续去添加其他地图扩展库存在很多不便，所以在 `1.0`
版本之后对仓库进行了拆分，抽离了核心支持库和其他扩展库。

### 特性 (相对于原始 [windy.js](https://github.com/Esri/wind-js))

* 抽离了粒子`Field`和向量 `Vector` 计算代码，便于进行扩展计算, 例如使用 webworker 或者 gpu.js 加速。
* 易于配置粒子数量，原始 windy.js 只能给定一个系数，会根据地图元素的大小进行计算粒子数量；现在可以支持系数方式和固定粒子数量以及回调函数的的三种方式。
* 颜色配置支持三种方式：
    String：固定颜色值
    Function: 通过回调函数的风速值设定颜色（但是会有一定的性能损失）
    String[]: 按照风速值范围等间隔渲染，无法做到精确匹配对应值的颜色。
* 线条宽度支持动态设置。
* 抽离了核心渲染库，便于扩展到其他地图渲染库。

### 扩展包

| Project | Version | Npm | CDN | Description |
|---------|---------|-----|------|-------------|
| [wind-core](https://github.com/sakitam-fdd/wind-layer/tree/master/packages/core) | [![Npm package](https://img.shields.io/npm/v/wind-core.svg)](https://www.npmjs.org/package/wind-core) | [![NPM downloads](https://img.shields.io/npm/dm/wind-core.svg)](https://npmjs.org/package/wind-core) | [![](https://data.jsdelivr.com/v1/package/npm/wind-core/badge)](https://www.jsdelivr.com/package/npm/wind-core) | 风场核心渲染，可扩展不可以直接使用 |
| [ol-wind](https://github.com/sakitam-fdd/wind-layer/tree/master/packages/ol) | [![Npm package](https://img.shields.io/npm/v/ol-wind.svg)](https://www.npmjs.org/package/ol-wind) | [![NPM downloads](https://img.shields.io/npm/dm/ol-wind.svg)](https://npmjs.org/package/ol-wind) | [![](https://data.jsdelivr.com/v1/package/npm/ol-wind/badge)](https://www.jsdelivr.com/package/npm/ol-wind) | `openlayers 6+` 风场扩展插件 |
| [ol5-wind](https://github.com/sakitam-fdd/wind-layer/tree/master/packages/ol5) | [![Npm package](https://img.shields.io/npm/v/ol5-wind.svg)](https://www.npmjs.org/package/ol5-wind) | [![NPM downloads](https://img.shields.io/npm/dm/ol5-wind.svg)](https://npmjs.org/package/ol5-wind) | [![](https://data.jsdelivr.com/v1/package/npm/ol5-wind/badge)](https://www.jsdelivr.com/package/npm/ol5-wind) | `openlayers 5` 风场扩展插件 |
| [openlayers-wind](https://github.com/sakitam-fdd/wind-layer/tree/master/packages/openlayers) | [![Npm package](https://img.shields.io/npm/v/openlayers-wind.svg)](https://www.npmjs.org/package/openlayers-wind) | [![NPM downloads](https://img.shields.io/npm/dm/openlayers-wind.svg)](https://npmjs.org/package/openlayers-wind) | [![](https://data.jsdelivr.com/v1/package/npm/openlayers-wind/badge)](https://www.jsdelivr.com/package/npm/openlayers-wind) | `openlayers 3/4` 风场扩展插件 |
| [@sakitam-gis/maptalks-wind](https://github.com/sakitam-fdd/wind-layer/tree/master/packages/maptalks) | [![Npm package](https://img.shields.io/npm/v/@sakitam-gis/maptalks-wind.svg)](https://www.npmjs.org/package/@sakitam-gis/maptalks-wind) | [![NPM downloads](https://img.shields.io/npm/dm/@sakitam-gis/maptalks-wind.svg)](https://npmjs.org/package/@sakitam-gis/maptalks-wind) | [![](https://data.jsdelivr.com/v1/package/npm/@sakitam-gis/maptalks-wind/badge)](https://www.jsdelivr.com/package/npm/@sakitam-gis/maptalks-wind) | `maptalks` 风场扩展插件 |
| [amap-wind](https://github.com/sakitam-fdd/wind-layer/tree/master/packages/amap) | [![Npm package](https://img.shields.io/npm/v/amap-wind.svg)](https://www.npmjs.org/package/amap-wind) | [![NPM downloads](https://img.shields.io/npm/dm/amap-wind.svg)](https://npmjs.org/package/amap-wind) | [![](https://data.jsdelivr.com/v1/package/npm/amap-wind/badge)](https://www.jsdelivr.com/package/npm/amap-wind) | 高德地图风场扩展插件 |
| [bmap-wind](https://github.com/sakitam-fdd/wind-layer/tree/master/packages/bmap) | [![Npm package](https://img.shields.io/npm/v/bmap-wind.svg)](https://www.npmjs.org/package/bmap-wind) | [![NPM downloads](https://img.shields.io/npm/dm/bmap-wind.svg)](https://npmjs.org/package/bmap-wind) | [![](https://data.jsdelivr.com/v1/package/npm/bmap-wind/badge)](https://www.jsdelivr.com/package/npm/bmap-wind) | 百度地图风场扩展插件 |

### 安装

#### 使用 npm 或 yarn 安装

::: tip
**我们推荐使用 npm 或 yarn 的方式进行开发**，
不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，
享受整个生态圈和工具链带来的诸多好处。
:::

相关插件：

```bash
# npm
npm install wind-core
npm install ol-wind
npm install ol5-wind
npm install openlayers-wind
npm install @sakitam-gis/maptalks-wind
npm install amap-wind
npm install bmap-wind

# yarn
yarn add wind-core
yarn add ol-wind
yarn add ol5-wind
yarn add openlayers-wind
yarn add @sakitam-gis/maptalks-wind
yarn add amap-wind
yarn add bmap-wind
```

#### 部分插件亦可以通过浏览器引入

在浏览器中使用 `script` 标签直接引入文件，并使用全局变量。

我们在仓库发布包内的 `dist` 目录下提供了 `xxx.js` 以及 `xxx.min.js`；

| Project | unpkg | jsdelivr |
|---------|---------|-------------|
| [wind-core](https://cdn.jsdelivr.net/npm/wind-core/dist/) | https://unpkg.com/wind-core/dist/wind-core.js | https://cdn.jsdelivr.net/npm/wind-core/dist/wind-core.js |
| [ol-wind](https://cdn.jsdelivr.net/npm/ol-wind/dist/) 因 `ol6` 重构原因，无法直接使用，你可以自行构建 | https://unpkg.com/ol-wind/dist/ol-wind.js | https://cdn.jsdelivr.net/npm/ol-wind/dist/ol-wind.js |
| [ol5-wind](https://cdn.jsdelivr.net/npm/ol5-wind/dist/) | https://unpkg.com/ol5-wind/dist/ol-wind.js | https://cdn.jsdelivr.net/npm/ol5-wind/dist/ol-wind.js |
| [openlayers-wind](https://cdn.jsdelivr.net/npm/openlayers-wind/dist/) | https://unpkg.com/openlayers-wind/dist/ol-wind.js | https://cdn.jsdelivr.net/npm/openlayers-wind/dist/ol-wind.js |
| [@sakitam-gis/maptalks-wind](https://cdn.jsdelivr.net/npm/@sakitam-gis/maptalks-wind/dist/) | https://unpkg.com/@sakitam-gis/maptalks-wind/dist/maptalks-wind.js | https://cdn.jsdelivr.net/npm/@sakitam-gis/maptalks-wind/dist/maptalks-wind.js |
| [amap-wind](https://cdn.jsdelivr.net/npm/amap-wind/dist/) | https://unpkg.com/amap-wind/dist/amap-wind.js | https://cdn.jsdelivr.net/npm/amap-wind/dist/amap-wind.js |
| [bmap-wind](https://cdn.jsdelivr.net/npm/bmap-wind/dist/) | https://unpkg.com/bmap-wind/dist/bmap-wind.js | https://cdn.jsdelivr.net/npm/bmap-wind/dist/bmap-wind.js |

### 示例

``` html
<div id="map" class="container"></div>
<script src="https://cdn.jsdelivr.net/npm/maptalks/dist/maptalks.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@sakitam-gis/maptalks-wind/dist/maptalks-wind.js"></script>
<script>
  const map = new maptalks.Map('map', {
    center: [113.53450137499999, 34.44104525],
    zoom: 5,
    baseLayer: new maptalks.TileLayer('base', {
      // urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      subdomains: ['a', 'b', 'c', 'd'],
    })
  });

  fetch('./out.json')
    .then(res => res.json())
    .then(res => {
      // const range = vectorField.range || [0.02, 28.21618329965979];
      // const scale = chroma.scale('OrRd').domain(range);

      const windLayer = new MaptalksWind.WindLayer('wind', res, {
        windOptions: {
          // colorScale: (m) => {
          //   // console.log(m);
          //   return '#fff';
          // },
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
          // velocityScale: 1 / 20,
          // paths: 5000,
          frameRate: 16,
          maxAge: 60,
          globalAlpha: 0.9,
          velocityScale: 1 / 30,
          // paths: 10000,
          paths: () => { // can be number or function
            const zoom = map.getZoom();
            return zoom * 1000;
          },
        },
      });

      console.log(map, windLayer);

      map.addLayer(windLayer);
    });
</script>
```

``` html
<template>
  <div class="demo-content">
    <div class="map-warp" ref="map"></div>
  </div>
</template>
<script>
  import 'ol/ol.css';
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import { fromLonLat } from 'ol/proj';
  import OSM from 'ol/source/OSM';
  import { WindLayer } from 'ol-wind';

  export default {
    name: 'ol-wind-base',
    data() {
      return {
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        zoom: 3,
      };
    },
    watch: {},
    methods: {
      initMap() {
        const layer = new TileLayer({
          source: new OSM({
            // projection: 'EPSG:3857',
            url: '//{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          }),
        });

        const map = new Map({
          layers: [layer],
          target: this.$refs.map,
          view: new View({
            // projection: 'EPSG:4326',
            center: fromLonLat([113.53450137499999, 34.44104525]),
            // center: [113.53450137499999, 34.44104525],
            zoom: 2,
          }),
          // pixelRatio: 2,
        });

        fetch('/data/wind.json')
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
                width: 3,
                // colorScale: scale,
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
```
