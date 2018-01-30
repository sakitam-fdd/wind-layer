#### npm安装

```bash
npm install wind-layer --save
import WindLayer from 'wind-layer'

// 指定版本安装
npm install wind-layer@0.0.2 --save
import WindLayer from 'wind-layer'
```

目前可通过 [unpkg.com](https://unpkg.com/wind-layer/dist/windLayer.js) / [jsdelivr](https://cdn.jsdelivr.net/npm/wind-layer@0.0.1/dist/windLayer.js) 获取最新版本的资源。

```bash
// jsdelivr (jsdelivr由于缓存原因最好锁定版本号，否则可能会出现意料之外的问题)
https://cdn.jsdelivr.net/npm/wind-layer@0.0.2/dist/windLayer.js
https://cdn.jsdelivr.net/npm/wind-layer@0.0.2/dist/windLayer.min.js
// npm
https://unpkg.com/wind-layer/dist/windLayer.js
https://unpkg.com/wind-layer/dist/windLayer.min.js
```


### 如何使用

#### 初始化windLayer图层并添加到地图

```javascript
var wind = new WindLayer(res.data, {
  layerName: '',
  minResolution: undefined,
  maxResolution: undefined,
  zIndex: 0,
  projection: 'EPSG:3857', // EPSG:4326
  ratio: 1
})
wind.appendTo(Maps)
```

配置项说明

| 配置项 | 简介 | 类型 | 备注 |
| --- | --- | --- | --- |
| layerName | 图层名 | `String` |  |
| minResolution | 最小分辨率 | `Number` | 默认为 `undefined` |
| maxResolution | 最大分辨率 | `Number` | 默认为 `undefined` |
| zIndex | 图层index | `Number` | 默认为 `0` |
| projection | 投影 | `String` | 现在默认支持 `EPSG:3857`, `EPSG:4326`測試中 |
| ratio | 画布和地图窗口的比值 | `Number` | 现在默认 `1.5` |

#### methods

##### setData(data)

> 重新设置气象图层数据，会触发重新渲染

##### getData(data)

> 获取当前图层的气象数据

##### clearWind()

> 清除windy图层

<iframe width="100%" height="430" src="//jsfiddle.net/sakitamfdd/hgvdu76j/embedded/" allowpaymentrequest allowfullscreen="allowfullscreen" frameborder="0"></iframe>
