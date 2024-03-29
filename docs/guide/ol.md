---
title: ol
description: 
---

# ol

ol 自 5.0 之后更推荐我们我们使用模块化的方式使用（但是也提供 dist 文件供 script 使用），所以本文我们通过两种方式来加载风场图层

## Script 方式使用

### 添加依赖库

包括 `ol-wind` 的相关脚本和 `ol` 相关的类库和样式文件

```html
<!-- 
ol 类库依赖
-->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/ol/ol.css"> // [!code ++]
<script src="//cdn.jsdelivr.net/npm/ol@6.15.1/dist/ol-debug.js"></script> // [!code ++]

<!-- 
ol-wind 风场依赖
-->
<script src="//cdn.jsdelivr.net/npm/ol-wind/dist/ol-wind.js"></script> // [!code ++]
```

### 创建地图

添加完依赖后，我们需要创建地图，或者使用已有的地图对象

```html
<div id="map"></div>

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
</script>
```

### 获取数据

关于数据结构我们需要查看 [数据说明](./data.md)，我们通过以下方式获取数据

```ts
fetch('https://blog.sakitam.com/wind-layer/data/wind.json')
    .then(res => res.json())
    .then(res => {
        console.log(res, 'you wind layer data');
    })
```

### 创建风场图层

拿到风场数据之后我们可以直接创建风场图层，通过以下方式创建图层：

```ts
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
      wrapX: false,
    },
});

// 在 ol 6.x 之后我们也可以直接使用 map.addLayer(windLayer) 来添加图层
windLayer.appendTo(map);
```

### 移除图层

```ts
map.removeLayer(windLayer);
```

### 更新数据

```ts
windLayer.setData(data);
```

### 更新图层配置项

```ts
windLayer.setWindOptions(options);
```


## esmodule 方式使用

### 添加依赖库

在 package.json 中添加可视化库依赖

```json
"dependencies": {
    "ol": "^6.15.1", // [!code ++]
    "ol-wind": "latest" // [!code ++]
}
```

### 创建地图

添加完依赖后，我们需要创建地图，或者使用已有的地图对象

```ts
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import { WindLayer } from 'ol-wind';

const layer = new TileLayer({
    source: new OSM({
        // projection: 'EPSG:3857',
        // url: '//{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        url: '//{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    }),
});

map = new Map({
    layers: [layer],
    target: mapRef.value,
    view: new View({
        // projection: 'EPSG:4326',
        center: fromLonLat([113.53450137499999, 34.44104525]),
        // center: [113.53450137499999, 34.44104525],
        zoom: 2,
    }),
    // pixelRatio: 2,
});
```

### 获取数据

关于数据结构我们需要查看 [数据说明](./data.md)，我们通过以下方式获取数据

```ts
fetch('https://blog.sakitam.com/wind-layer/data/wind.json')
    .then(res => res.json())
    .then(res => {
        console.log(res, 'you wind layer data');
    })
```

### 创建风场图层

拿到风场数据之后我们可以直接创建风场图层，通过以下方式创建图层：

```ts
const windLayer = new WindLayer(res, {
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
      wrapX: false,
    },
});

// 在 ol 6.x 之后我们也可以直接使用 map.addLayer(windLayer) 来添加图层
windLayer.appendTo(map);
```

### 移除图层

```ts
map.removeLayer(windLayer);
```

### 更新数据

```ts
windLayer.setData(data);
```

### 更新图层配置项

```ts
windLayer.setWindOptions(options);
```

## 示例

相关示例请查看 [Playground](../playgrounds/ol/particles.md)
