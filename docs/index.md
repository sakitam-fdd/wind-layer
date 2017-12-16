### npm安装

```bash
npm install wind-layer --save
import WindLayer from 'wind-layer'

// 指定版本安装
npm install wind-layer@0.0.1 --save
import WindLayer from 'wind-layer'

```
### cdn

目前可通过 [unpkg.com](https://unpkg.com/wind-layer/dist/windLayer.js) 获取最新版本的资源。

```bash
https://unpkg.com/wind-layer/dist/windLayer.js
https://unpkg.com/wind-layer/dist/windLayer.min.js

// 指定版本安装
https://unpkg.com/wind-layer@0.0.1/dist/windLayer.js
https://unpkg.com/wind-layer@0.0.1/dist/windLayer.min.js
```


### 如何使用

#### 初始化windLayer图层并添加到地图

```javascript
var wind = new WindLayer(res.data, {
  layerName: '',
  minResolution: undefined,
  maxResolution: undefined,
  zIndex: 0,
  projection: 'EPSG:3857',
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
| projection | 投影 | `String` | 现在默认支持且仅支持 `EPSG:3857` |
| ratio | 画布和地图窗口的比值 | `Number` | 现在默认 `1.5` |

<iframe width="100%" height="430" src="//jsfiddle.net/sakitamfdd/pjz8cuxw/embedded/result,html,js/?bodyColor=fff" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
