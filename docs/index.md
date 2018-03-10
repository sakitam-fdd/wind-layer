#### npm安装

```bash
npm install wind-layer --save
import WindLayer from 'wind-layer'

// 指定版本安装
npm install wind-layer@0.0.4 --save
import WindLayer from 'wind-layer'
```

目前可通过 [unpkg.com](https://unpkg.com/wind-layer/dist/windLayer.js) / [jsdelivr](https://cdn.jsdelivr.net/npm/wind-layer@0.0.1/dist/windLayer.js) 获取最新版本的资源。

```bash
// jsdelivr (jsdelivr由于缓存原因最好锁定版本号，否则可能会出现意料之外的问题)
https://cdn.jsdelivr.net/npm/wind-layer@0.0.4/dist/windLayer.js
https://cdn.jsdelivr.net/npm/wind-layer@0.0.4/dist/windLayer.min.js
// npm
https://unpkg.com/wind-layer/dist/windLayer.js
https://unpkg.com/wind-layer/dist/windLayer.min.js
```


### 如何使用

#### 初始化windLayer图层并添加到地图

```javascript
var wind = new WindLayer(res.data, {
  layerName: '',
  projection: 'EPSG:3857', // EPSG:4326
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
| projection | 投影 | `String` | 现在默认支持 `EPSG:3857`, `EPSG:4326`測試中 |
| ratio | 画布和地图窗口的比值 | `Number` | 现在默认 `1.5` |
| map | 地图 | `ol.Map` | 对应的地图实例，调用原生 `addLayer` 时必须配置此字段 |

#### methods

##### setData(data)

> 重新设置气象图层数据，会触发重新渲染

##### getData(data)

> 获取当前图层的气象数据

##### clearWind()

> 清除windy图层

<iframe width="100%" height="430" src="//jsfiddle.net/sakitamfdd/hgvdu76j/embedded/" allowpaymentrequest allowfullscreen="allowfullscreen" frameborder="0"></iframe>
