---
title: openlayers 3-4
description: 
---
# openlayers

## 示例

### 基础地图展示

::: tip
基础使用，地图投影默认为 `EPSG:3857` 墨卡托投影。
:::

```html
<!DOCTYPE html>
<html>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>openlayers wind-layer</title>
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/openlayers@3.10.0/dist/ol.css">
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
<script src="//cdn.jsdelivr.net/npm/openlayers@3.10.0/dist/ol-debug.js"></script>
<script src="//cdn.jsdelivr.net/npm/openlayers-wind/dist/ol-wind.js"></script>
<script>
  const map = new ol.Map({
    target: 'map',
    view: new ol.View({
      // center: [113.53450137499999, 34.44104525],
      center: ol.proj.fromLonLat([113.53450137499999, 34.44104525]),
      zoom: 5,
      // projection: 'EPSG:4326',
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM({
          url: '//{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        })
      })
    ],
  });

  let layer;

  fetch('https://sakitam.oss-cn-beijing.aliyuncs.com/codepen/wind-layer/json/wind.json')
    .then(res => res.json())
    .then(res => {

      const velocityScale = [0.1, 0.2, 0.3, 0.4, 0.5];
      const windLayer = new OlWind.WindLayer(res, {
        windOptions: {
          velocityScale: 0.05,
          paths: 3200,
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
          lineWidth: 3,
          // colorScale: scale,
          generateParticleOption: false
          // particleMultiplier: 0.3 * 10,
        },
        fieldOptions: {
          wrapX: true,
        },
      });
      windLayer.appendTo(map);
    });
</script>
</body>
</html>

```
