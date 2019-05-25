#### npm安装

```bash
npm install wind-layer --save
import windLayer from 'wind-layer'

// 指定版本安装
npm install wind-layer@0.0.7 --save
import windLayer from 'wind-layer'// 分模块
// 分模块
import {
  AMapWind, // amap
  BMapWind, // bmap
  OlWind // openlayers
} from 'wind-layer'

// ol5 & ol6
import OlWindy from 'wind-layer/dist/OlWindy.js'
import OlWindy from 'wind-layer/dist/OlWindy.esm.js'

// maptalks
import MaptalksWindy from 'wind-layer/dist/MaptalksWindy.js'
import MaptalksWindy from 'wind-layer/dist/MaptalksWindy.esm.js'

```

#### cdn

目前可通过 [unpkg.com](https://unpkg.com/wind-layer/dist/windLayer.js) /
 [jsdelivr](https://cdn.jsdelivr.net/npm/wind-layer@0.1.0/dist/windLayer.js) 获取最新版本的资源。

```bash
// jsdelivr (jsdelivr由于缓存原因最好锁定版本号，否则可能会出现意料之外的问题)
https://cdn.jsdelivr.net/npm/wind-layer@0.1.0/dist/windLayer.js
https://cdn.jsdelivr.net/npm/wind-layer@0.1.0/dist/windLayer.min.js
// npm
https://unpkg.com/wind-layer/dist/windLayer.js
https://unpkg.com/wind-layer/dist/windLayer.min.js

// 分模块
https://cdn.jsdelivr.net/npm/wind-layer@0.1.0/dist/AMapWind.js // amap
https://cdn.jsdelivr.net/npm/wind-layer@0.1.0/dist/BMapWind.js // bmap
https://cdn.jsdelivr.net/npm/wind-layer@0.1.0/dist/OlWind.js // openlayers
https://cdn.jsdelivr.net/npm/wind-layer@0.1.0/dist/MaptalksWindy.js // maptalks
```


### 如何使用

#### openlayers 【默认支持 EPSG:4236 和 EPSG:3857投影】

```javascript
var wind = new windLayer.OlWind(res.data, {
  layerName: '',
  ratio: 1
})
wind.appendTo(map)
// or 
map.addLayer(wind) // 此模式下属性必须配置 map 字段
```

配置项说明

| 配置项 | 简介 | 类型 | 备注 |
| --- | --- | --- | --- |
| logo | logo | `	string or olx.LogoOptions or undefined` | logo |
| state | 图层数据源状态 | `	ol.source.State or undefined` | '' |
| attributions | 版权 | `ol.AttributionLike or undefined` | 版权 |
| resolutions | 分辨率 | `Array.<number> or undefined` | 指定每一层级对应的分辨率 |
| layerName | 图层名 | `String` | 图层名称或者其他可观察属性 |
| visible | 是否可见 | `boolean or undefined` | 默认为`true` |
| extent | 视图范围 | `Array` | 默认为`undefined`,每次动态获取 |
| minResolution | 最小分辨率 | `Number` | 默认为 `undefined` |
| maxResolution | 最大分辨率 | `Number` | 默认为 `undefined` |
| zIndex | 图层index | `Number` | 默认为 `0` |
| ratio | 画布和地图窗口的比值 | `Number` | 现在默认 `1.5` |
| map | 地图 | `ol.Map` | 对应的地图实例，调用原生 `addLayer` 时必须配置此字段 |

#### bmap

```javascript
var baiduWindy = new windLayer.BMapWind(res.data, {
  projection: 'EPSG:3857'
})
map.addOverlay(baiduWindy)
```

配置项说明

| 配置项 | 简介 | 类型 | 备注 |
| --- | --- | --- | --- |
| paneName | overlay paneName | `string` | -- |
| context | canvas context type | `string` | eg: 2d |
| zIndex | 图层层级 | `number` | eg: 0 |
| projection | 图层投影 | `String` | 默认：EPSG:4326 |

#### amap

```javascript
var layer = new windLayer.AMapWind(res.data, {
  projection: 'EPSG:4326'
}).appendTo(map);
```

配置项说明

| 配置项 | 简介 | 类型 | 备注 |
| --- | --- | --- | --- |
| bounds | 图层范围 | `bounds` | map.getBounds() |
| zooms | 层级范围 | `Array` | 默认：[0, 22] |
| projection | 图层投影 | `String` | 默认：EPSG:4326 |

#### maptalks

```javascript
var layer = new MaptalksWindy('windy', res.data, {
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
  minVelocity: 0,
  maxVelocity: 10,
  velocityScale: 0.005,
  particleAge: 90,
  lineWidth: 1,
  particleMultiplier: 1 / 300,
});
map.addLayer(layer);
```

配置项说明(其继承的是maptalks.Layer, 其他配置项请查看官方文档)

| 配置项 | 简介 | 类型 | 备注 |
| --- | --- | --- | --- |
| id | 图层id | `String Number` | 必传 |
| data | 风场数据 | `Array` | -- |
| options | 配置项 | `Object` | -- |


#### methods

##### setData(data)

> 重新设置气象图层数据，会触发重新渲染

##### getData(data)

> 获取当前图层的气象数据

##### clearWind()

> 清空windy图层

##### getPointData(coordinates)

根据坐标值获取当前位置的风力和风向

eg: {
      direction: number,
      speed: number
    }

##### getParams()

获取可视化参数

##### updateParams(params)

更新可视化参数

<iframe width="100%" height="430" src="//jsfiddle.net/sakitamfdd/hgvdu76j/embedded/" allowpaymentrequest allowfullscreen="allowfullscreen" frameborder="0"></iframe>
