# wind-layer

a [maptalks](https://maptalks.org/) | [mapbox-gl](https://github.com/mapbox/mapbox-gl-js) | [openlayers](http://openlayers.org) | [leaflet](https://leafletjs.com/) | [bmap](https://map.baidu.com/) | [amap](https://ditu.amap.com/)
extension to show wind field。

## 介绍

[wind-layer](./) 是一个专注于气象格点数据可视的插件，设计之处是参考了 [earth](http://earth.nullschool.net) [cambecc](https://github.com/cambecc/earth) 的一个气象数据的展示，他使用了流体场的方式去展示了全球的风速和风向，富有很强的
表现力, 这个插件的早期的很多核心代码也是来源于此。当然现在塔不仅仅是做风场的展示，常规的气象数据都可以依赖此插件进行可视化。

## 特性 (相对于原始 [windy.js](https://github.com/Esri/wind-js))

* 易于配置粒子数量，原始 windy.js 只能给定一个系数，会根据地图元素的大小进行计算粒子数量；现在可以支持系数方式和固定粒子数量以及回调函数的的三种方式。
* 颜色配置支持三种方式：
  String：固定颜色值
  Function: 通过回调函数的风速值设定颜色（但是会有一定的性能损失）
  String[]: 按照风速值范围等间隔渲染，无法做到精确匹配对应值的颜色。
* 线条宽度支持动态设置。
* 抽离了核心渲染库，便于扩展到其他地图渲染库。

## 关于webgl

其中的大部分代码来自于 [webgl-wind](https://github.com/mapbox/webgl-wind) 和 [windgl](https://github.com/astrosat/windgl),
并且色斑图目前只针对 `mapbox` 和 `maptalks` 做了相关适配。

目前计划支持的图层如下：

- [x] 常规 raster 图层，为了解决多时次瓦片序列播放问题。
- [x] 常规 Image 图层，单张 raster 图层。
- [x] 色斑图渲染，支持瓦片和单张。
- [x] 多数据源支持（geotiff、灰度图-可解析带 exif 信息、png-多通道浮点数压缩）。
- [x] TimelineSource（时序数据源）支持。
- [ ] 粒子渲染，支持瓦片和单张。

![fill](https://sakitam-fdd.github.io/wind-layer/wind-animation.mp4)

![particles](https://sakitam-fdd.github.io/wind-layer/particles.mp4)

## 示例图片

![wind](https://sakitam-fdd.github.io/wind-layer/wind.png)

## 扩展

| Project | Version | Npm | CDN | Description |
|---------|---------|-----|------|-------------|
| [wind-core](https://github.com/sakitam-fdd/wind-layer/tree/master/packages/core) | [![Npm package](https://img.shields.io/npm/v/wind-core.svg)](https://www.npmjs.org/package/wind-core) | [![NPM downloads](https://img.shields.io/npm/dm/wind-core.svg)](https://npmjs.org/package/wind-core) | [![](https://data.jsdelivr.com/v1/package/npm/wind-core/badge)](https://www.jsdelivr.com/package/npm/wind-core) | 风场核心渲染，可扩展不可以直接使用 |
| [wind-gl-core](https://github.com/sakitam-fdd/wind-layer/tree/master/packages/gl-core) | [![Npm package](https://img.shields.io/npm/v/wind-gl-core.svg)](https://www.npmjs.org/package/wind-gl-core) | [![NPM downloads](https://img.shields.io/npm/dm/wind-gl-core.svg)](https://npmjs.org/package/wind-gl-core) | [![](https://data.jsdelivr.com/v1/package/npm/wind-gl-core/badge)](https://www.jsdelivr.com/package/npm/wind-gl-core) | 色斑图核心渲染，可扩展不可以直接使用 |
| [ol-wind](https://github.com/sakitam-fdd/wind-layer/tree/master/packages/ol) | [![Npm package](https://img.shields.io/npm/v/ol-wind.svg)](https://www.npmjs.org/package/ol-wind) | [![NPM downloads](https://img.shields.io/npm/dm/ol-wind.svg)](https://npmjs.org/package/ol-wind) | [![](https://data.jsdelivr.com/v1/package/npm/ol-wind/badge)](https://www.jsdelivr.com/package/npm/ol-wind) | `openlayers 6+` 风场扩展插件 |
| [ol5-wind](https://github.com/sakitam-fdd/wind-layer/tree/master/packages/ol5) | [![Npm package](https://img.shields.io/npm/v/ol5-wind.svg)](https://www.npmjs.org/package/ol5-wind) | [![NPM downloads](https://img.shields.io/npm/dm/ol5-wind.svg)](https://npmjs.org/package/ol5-wind) | [![](https://data.jsdelivr.com/v1/package/npm/ol5-wind/badge)](https://www.jsdelivr.com/package/npm/ol5-wind) | `openlayers 5` 风场扩展插件 |
| [openlayers-wind](https://github.com/sakitam-fdd/wind-layer/tree/master/packages/openlayers) | [![Npm package](https://img.shields.io/npm/v/openlayers-wind.svg)](https://www.npmjs.org/package/openlayers-wind) | [![NPM downloads](https://img.shields.io/npm/dm/openlayers-wind.svg)](https://npmjs.org/package/openlayers-wind) | [![](https://data.jsdelivr.com/v1/package/npm/openlayers-wind/badge)](https://www.jsdelivr.com/package/npm/openlayers-wind) | `openlayers 3/4` 风场扩展插件 |
| [@sakitam-gis/maptalks-wind](https://github.com/sakitam-fdd/wind-layer/tree/master/packages/maptalks) | [![Npm package](https://img.shields.io/npm/v/@sakitam-gis/maptalks-wind.svg)](https://www.npmjs.org/package/@sakitam-gis/maptalks-wind) | [![NPM downloads](https://img.shields.io/npm/dm/@sakitam-gis/maptalks-wind.svg)](https://npmjs.org/package/@sakitam-gis/maptalks-wind) | [![](https://data.jsdelivr.com/v1/package/npm/@sakitam-gis/maptalks-wind/badge)](https://www.jsdelivr.com/package/npm/@sakitam-gis/maptalks-wind) | `maptalks` 风场扩展插件 |
| [amap-wind](https://github.com/sakitam-fdd/wind-layer/tree/master/packages/amap) | [![Npm package](https://img.shields.io/npm/v/amap-wind.svg)](https://www.npmjs.org/package/amap-wind) | [![NPM downloads](https://img.shields.io/npm/dm/amap-wind.svg)](https://npmjs.org/package/amap-wind) | [![](https://data.jsdelivr.com/v1/package/npm/amap-wind/badge)](https://www.jsdelivr.com/package/npm/amap-wind) | 高德地图风场扩展插件 |
| [bmap-wind](https://github.com/sakitam-fdd/wind-layer/tree/master/packages/bmap) | [![Npm package](https://img.shields.io/npm/v/bmap-wind.svg)](https://www.npmjs.org/package/bmap-wind) | [![NPM downloads](https://img.shields.io/npm/dm/bmap-wind.svg)](https://npmjs.org/package/bmap-wind) | [![](https://data.jsdelivr.com/v1/package/npm/bmap-wind/badge)](https://www.jsdelivr.com/package/npm/bmap-wind) | 百度地图风场扩展插件 |
| [mapbox-wind](https://github.com/sakitam-fdd/wind-layer/tree/master/packages/mapbox-gl) | [![Npm package](https://img.shields.io/npm/v/@sakitam-gis/mapbox-wind.svg)](https://www.npmjs.org/package/@sakitam-gis/mapbox-wind) | [![NPM downloads](https://img.shields.io/npm/dm/@sakitam-gis/mapbox-wind.svg)](https://npmjs.org/package/@sakitam-gis/mapbox-wind) | [![](https://data.jsdelivr.com/v1/package/npm/@sakitam-gis/mapbox-wind/badge)](https://www.jsdelivr.com/package/npm/@sakitam-gis/mapbox-wind) | mapbox-gl 风场扩展插件 |
| [leaflet-wind](https://github.com/sakitam-fdd/wind-layer/tree/master/packages/leaflet) | [![Npm package](https://img.shields.io/npm/v/leaflet-wind.svg)](https://www.npmjs.org/package/leaflet-wind) | [![NPM downloads](https://img.shields.io/npm/dm/leaflet-wind.svg)](https://npmjs.org/package/leaflet-wind) | [![](https://data.jsdelivr.com/v1/package/npm/leaflet-wind/badge)](https://www.jsdelivr.com/package/npm/leaflet-wind) | Leaflet风场扩展插件 |

### 特殊说明

cesium 相关集成请查看 [cesium-wind](https://github.com/QJvic/cesium-wind)

## 安装

### 使用 pnpm 或 yarn 安装

**我们推荐使用 pnpm 或 yarn 的方式进行开发**，
不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，
享受整个生态圈和工具链带来的诸多好处。

相关插件：

```bash
# pnpm
pnpm install wind-core
pnpm install wind-gl-core
pnpm install src-wind
pnpm install ol5-wind
pnpm install openlayers-wind
pnpm install @sakitam-gis/maptalks-wind
pnpm install amap-wind
pnpm install bmap-wind
pnpm install leaflet-wind
pnpm install @sakitam-gis/mapbox-wind

# yarn
yarn add wind-core
yarn add wind-gl-core
yarn add src-wind
yarn add ol5-wind
yarn add openlayers-wind
yarn add @sakitam-gis/maptalks-wind
yarn add amap-wind
yarn add bmap-wind
yarn add leaflet-wind
yarn add @sakitam-gis/mapbox-wind
```

### 部分插件亦可以通过浏览器引入

在浏览器中使用 `script` 标签直接引入文件，并使用全局变量。

我们在仓库发布包内的 `dist` 目录下提供了 `xxx.js` 以及 `xxx.min.js`；

| Project | unpkg | jsdelivr |
|---------|---------|-------------|
| [wind-core](https://cdn.jsdelivr.net/npm/wind-core/dist/) | https://unpkg.com/wind-core/dist/wind-core.js | https://cdn.jsdelivr.net/npm/wind-core/dist/wind-core.js |
| [wind-gl-core](https://cdn.jsdelivr.net/npm/wind-gl-core/dist/) | https://unpkg.com/wind-gl-core/dist/wind-gl-core.js | https://cdn.jsdelivr.net/npm/wind-gl-core/dist/wind-gl-core.js |
| [ol-wind](https://cdn.jsdelivr.net/npm/ol-wind/dist/) 因 `ol6` 重构原因，无法直接使用，你可以自行构建<https://cdn.jsdelivr.net/npm/@sakitam-gis/ol6@6.3.3/dist/> | https://unpkg.com/ol-wind/dist/ol-wind.js | https://cdn.jsdelivr.net/npm/ol-wind/dist/ol-wind.js |
| [ol5-wind](https://cdn.jsdelivr.net/npm/ol5-wind/dist/) | https://unpkg.com/ol5-wind/dist/ol-wind.js | https://cdn.jsdelivr.net/npm/ol5-wind/dist/ol-wind.js |
| [openlayers-wind](https://cdn.jsdelivr.net/npm/openlayers-wind/dist/) | https://unpkg.com/openlayers-wind/dist/ol-wind.js | https://cdn.jsdelivr.net/npm/openlayers-wind/dist/ol-wind.js |
| [@sakitam-gis/maptalks-wind](https://cdn.jsdelivr.net/npm/@sakitam-gis/maptalks-wind/dist/) | https://unpkg.com/@sakitam-gis/maptalks-wind/dist/maptalks-wind.js | https://cdn.jsdelivr.net/npm/@sakitam-gis/maptalks-wind/dist/maptalks-wind.js |
| [amap-wind](https://cdn.jsdelivr.net/npm/amap-wind/dist/) | https://unpkg.com/amap-wind/dist/amap-wind.js | https://cdn.jsdelivr.net/npm/amap-wind/dist/amap-wind.js |
| [bmap-wind](https://cdn.jsdelivr.net/npm/bmap-wind/dist/) | https://unpkg.com/bmap-wind/dist/bmap-wind.js | https://cdn.jsdelivr.net/npm/bmap-wind/dist/bmap-wind.js |
| [leaflet-wind](https://cdn.jsdelivr.net/npm/leaflet-wind/dist/) | https://unpkg.com/leaflet-wind/dist/leaflet-wind.js | https://cdn.jsdelivr.net/npm/leaflet-wind/dist/leaflet-wind.js |
| [@sakitam-gis/mapbox-wind](https://cdn.jsdelivr.net/npm/@sakitam-gis/mapbox-wind/dist/) | https://unpkg.com/@sakitam-gis/mapbox-wind/dist/mapbox-wind.js | https://cdn.jsdelivr.net/npm/@sakitam-gis/mapbox-wind/dist/mapbox-wind.js |

## 基础

基础使用可以分为三步：

1. 引入相应的 `WebGIS` 地图类库，引入对应的可视化图层扩展插件。
2. 正常初始化一个地图。
3. 创建一个 `WindLayer`，设置风场格点的 `U V` 数据和图层参数 并添加到地图上。

## 示例

以下以 maptalks 为例：

### npm + es6

``` html
<template>
  <div class="demo-content">
    <div class="demo-content-datgui"></div>
    <div class="map-warp" ref="map"></div>
  </div>
</template>
<script>
  import 'maptalks/dist/maptalks.css';
  import {
    Map,
    TileLayer,
  } from 'maptalks';

  import { WindLayer } from 'maptalks-wind';

  export default {
    name: 'maptalks-wind-base',
    data() {
      return {};
    },
    watch: {},
    methods: {
      initMap() {
        const map = new Map(this.$refs.map, {
          center: [113.53450137499999, 34.44104525],
          zoom: 3,
          baseLayer: new TileLayer('base', {
            urlTemplate: '//{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            // urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            subdomains: ['a', 'b', 'c', 'd'],
          })
        });

        fetch('/data/wind.json')
          .then(res => res.json())
          .then(res => {
            const windLayer = new WindLayer('wind', res, {
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

### cdn

``` html
<!DOCTYPE html>
<html>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Map - Display a map</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/maptalks/dist/maptalks.css">
<style type="text/css">
  html, body {
    margin: 0;
    height: 100%;
    width: 100%
  }
  .container {
    width: 100%;
    height: 100%
  }
</style>
<body>

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

  fetch('data.json')
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
</body>
</html>

```

## [文档请移步](//sakitam-fdd.github.io/wind-layer/) 正在完善中......

## 如何获取数据

天气数据由[全球预报系统](http://en.wikipedia.org/wiki/Global_Forecast_System)（GFS）生成，
由美国国家气象局管理。 预测每天产生四次，并可用于
从[NOMADS](http://nomads.ncep.noaa.gov/)下载。 这些文件位于[GRIB2](http://en.wikipedia.org/wiki/GRIB)
格式并包含超过[300条记录](http://www.nco.ncep.noaa.gov/pmb/products/gfs/gfs.t00z.pgrbf00.grib2.shtml)。
我们只需要这些记录中的一小部分就可以在特定的等压线上可视化风资料。 下面的命令下载
1000 hPa风向量，并使用[grib2json](https://github.com/cambecc/grib2json)将它们转换为JSON格式。

```bash
YYYYMMDD=<a date, for example: 20140101>
curl "http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs.pl?file=gfs.t00z.pgrb2.1p00.f000&lev_10_m_above_ground=on&var_UGRD=on&var_VGRD=on&dir=%2Fgfs.${YYYYMMDD}00" -o gfs.t00z.pgrb2.1p00.f000
grib2json -d -n -o current-wind-surface-level-gfs-1.0.json gfs.t00z.pgrb2.1p00.f000
cp current-wind-surface-level-gfs-1.0.json <earth-git-repository>/public/data/weather/current
```

## 使用node服务获取数据

> 默认运行在3000端口, 使用koa2构建。
目前仅抓取少量数据, 全部数据数据量过大会造成抓取时间过长和转换失败。

```bash
npm run start // 调试环境启动服务
npm run prd:server // 部署环境启动服务
```

### 目前共暴露7个接口

| url | params | desc |
| :--- | :--- | :---------- |
| `autofetch` | `null` | 无需参数，开启自动抓取程序，默认30分钟抓取一次数据源 |
| `stopautofetch` | `null` | 停止自动抓取程序 |
| `getdata` | `Object` (目前只支持`time` 参数，时间戳) | 获取json数据，存在转换过的直接返回，若只存在元数据则转换后返回，若元数据也不存在则抓取转换后再响应 |
| `gribdata` | `Object` (目前只支持`time` 参数，时间戳) | 获取grib2数据（强制抓取数据） |
| `getSourceTree` | `null` | 无需参数，获取抓取的数据源 `grib2` 源数据。返回一个list，包含文件名和服务器地址。 |
| `getParseTree` | `null` | 无需参数，获取转换后的 `json` 数据。返回一个list，包含文件名和服务器地址。 |
| `getDataByFileName` | `{ filename }` | 通过文件名请求 `json` 数据，文件名可为源数据文件和json文件名 |

## 使用Docker

### 简单运行

> 如果想简单的运行一下看看，可以执行这个命令：

```bash
docker run -d -p 8080:3333 sakitamclone/wind-server:latest
```

启动后就可以通过主机的 8080 端口看到运行结果了，比如用的是本机 Docker 的话，访问：http://localhost:8080 即可。

测试结束后，彻底清除容器可以用命令：

```bash
docker rm -fv <容器ID>
```

这样可以停止、删除容器，并清除数据。

### 使用 DockerCompose

新建文件 ``docker-compose.yml``, 内容如下：

```yaml
version: '3'

services:
  wind-server:
    image: sakitamclone/wind-server:latest
    build:
      context: ./
      args:
        NODE_ENV: development
    hostname: wind-server
    environment:
      - CORS_ORIGIN=****
    ports:
      - "8080:3333"

volumes:
  yarn:

```

然后使用命令 docker-compose up -d 来启动，停止服务使用 docker-compose down。

## Acknowledgments

* https://github.com/cambecc/earth
* http://earth.nullschool.net
* https://github.com/Esri/wind-js
* https://github.com/danwild/wind-js-leaflet
* https://github.com/IHCantabria/Leaflet.CanvasLayer.Field
* https://github.com/mapbox/webgl-wind
* https://github.com/astrosat/windgl

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsakitam-fdd%2Fwind-layer.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsakitam-fdd%2Fwind-layer?ref=badge_large)
