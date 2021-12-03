# wind-layer 各包参数说明

## `WindCore` 参数说明

:::tip
此类库主要用于外部扩展，不可以直接使用，相关参数也需要通过扩展图层传入。
:::

| 参数 | 说明 | 类型 | 默认值 |
|---------|---------|-----|------|
| `globalAlpha` | 全局透明度，主要影响粒子路径拖尾效果 | `number` | `0.9` |
| `lineWidth` | 粒子路径宽度 | `number\|function` | `1`, 当为回调函数时，参数`function(m:对应点风速值) => number` |
| `colorScale` | 粒子颜色配置 | `string\|function\|string[]` | `#fff`，当为回调函数时，参数`function(m:对应点风速值) => string` |
| `minVelocity` | 粒子最小风速 | `number` | 配置此值主要影响当`colorScale`为颜色数组时的颜色索引，非必填 |
| `maxVelocity` | 粒子最大风速 | `number` | 配置此值主要影响当`colorScale`为颜色数组时的颜色索引，必填 |
| `velocityScale` | 对于粒子路径步长的乘积基数 | `number` | `1 / 25` |
| `maxAge \| particleAge(不推荐使用) ` | 粒子路径能够生成的最大帧数 | `number` | `90` |
| `paths ` | 生成的粒子路径数量 | `number\|function` | `800`, 当为回调函数时，参数`function(m:对应点风速值) => number` |
| `particleMultiplier` | 粒子路径数量的系数，不推荐使用（视野宽度 * 高度 * 系数） | `number` | `1 / 300` |
| `frameRate` | 帧率（ms） | `number` | `20` |

## `ol-wind` 参数说明

:::tip
对应于 `openlayers 6` 相关参数，风场默认参数最好最好放到参数的 `windOptions`，也可以直接配置在参数中
:::

### 图层参数

| 参数 | 说明 | 类型 | 默认值 |
|---------|---------|-----|------|
| `windOptions` | 风场参数，具体配置如下 | `object` | `--` |
| `zIndex` | 图层层级 | `number` | `--` |
其他参数遵循 `ol` 基础图层参数。

### windOptions

| 参数 | 说明 | 类型 | 默认值 |
|---------|---------|-----|------|
| `globalAlpha` | 全局透明度，主要影响粒子路径拖尾效果 | `number` | `0.9` |
| `lineWidth` | 粒子路径宽度 | `number\|function` | `1`, 当为回调函数时，参数`function(m:对应点风速值) => number` |
| `colorScale` | 粒子颜色配置 | `string\|function\|string[]` | `#fff`，当为回调函数时，参数`function(m:对应点风速值) => string` |
| `velocityScale` | 对于粒子路径步长的乘积基数 | `number` | `1 / 25` |
| `maxAge \| particleAge(不推荐使用) ` | 粒子路径能够生成的最大帧数 | `number` | `90` |
| `paths ` | 生成的粒子路径数量 | `number\|function` | `800`, 当为回调函数时，参数`function(m:对应点风速值) => number` |
| `particleMultiplier` | 粒子路径数量的系数，不推荐使用（视野宽度 * 高度 * 系数） | `number` | `1 / 300` |
| `frameRate` | 帧率（ms） | `number` | `20` |

## `ol5-wind` 参数说明

:::tip
对应于 `openlayers 5` 相关参数，`ol5` 对应两种使用方式，一种是基于`ImageCanvas`，一种直接基于`ImageLayer`扩展 `renderer`。
对应暴露 `WindLayer` 和 `PerfWindLayer`
:::

### 图层参数

| 参数 | 说明 | 类型 | 默认值 |
|---------|---------|-----|------|
| `windOptions` | 风场参数，具体配置如下 | `object` | `--` |
| `map` | 地图对象, 在使用 `WindLayer` 必须配置，不需要调用 `addLayer`，在使用 `PerfWindLayer`，可选，具体可以参考 `openlayer` 官方文档 | `ol.Map` | `--` |
| `zIndex` | 图层层级 | `number` | `--` |
其他参数遵循 `ol` 基础图层参数。

### windOptions

| 参数 | 说明 | 类型 | 默认值 |
|---------|---------|-----|------|
| `globalAlpha` | 全局透明度，主要影响粒子路径拖尾效果 | `number` | `0.9` |
| `lineWidth` | 粒子路径宽度 | `number\|function` | `1`, 当为回调函数时，参数`function(m:对应点风速值) => number` |
| `colorScale` | 粒子颜色配置 | `string\|function\|string[]` | `#fff`，当为回调函数时，参数`function(m:对应点风速值) => string` |
| `velocityScale` | 对于粒子路径步长的乘积基数 | `number` | `1 / 25` |
| `maxAge \| particleAge(不推荐使用) ` | 粒子路径能够生成的最大帧数 | `number` | `90` |
| `paths ` | 生成的粒子路径数量 | `number\|function` | `800`, 当为回调函数时，参数`function(m:对应点风速值) => number` |
| `particleMultiplier` | 粒子路径数量的系数，不推荐使用（视野宽度 * 高度 * 系数） | `number` | `1 / 300` |
| `frameRate` | 帧率（ms） | `number` | `20` |

## `openlayers-wind` 参数说明

:::tip
对应于 `openlayers 3-4` 相关参数
:::

### 图层参数

| 参数 | 说明 | 类型 | 默认值 |
|---------|---------|-----|------|
| `windOptions` | 风场参数，具体配置如下 | `object` | `--` |
| `map` | 地图对象，必须配置，不需要调用 `addLayer`，具体可以参考 `openlayer` 官方文档 | `ol.Map` | `--` |
| `zIndex` | 图层层级 | `number` | `--` |
其他参数遵循 `ol` 基础图层参数。

### windOptions

| 参数 | 说明 | 类型 | 默认值 |
|---------|---------|-----|------|
| `globalAlpha` | 全局透明度，主要影响粒子路径拖尾效果 | `number` | `0.9` |
| `lineWidth` | 粒子路径宽度 | `number\|function` | `1`, 当为回调函数时，参数`function(m:对应点风速值) => number` |
| `colorScale` | 粒子颜色配置 | `string\|function\|string[]` | `#fff`，当为回调函数时，参数`function(m:对应点风速值) => string` |
| `velocityScale` | 对于粒子路径步长的乘积基数 | `number` | `1 / 25` |
| `maxAge \| particleAge(不推荐使用) ` | 粒子路径能够生成的最大帧数 | `number` | `90` |
| `paths ` | 生成的粒子路径数量 | `number\|function` | `800`, 当为回调函数时，参数`function(m:对应点风速值) => number` |
| `particleMultiplier` | 粒子路径数量的系数，不推荐使用（视野宽度 * 高度 * 系数） | `number` | `1 / 300` |
| `frameRate` | 帧率（ms） | `number` | `20` |

## `@sakitam-gis/maptalks-wind` 参数说明

:::tip
默认只有 `canvas` renderer
:::

### 图层参数

| 参数 | 说明 | 类型 | 默认值 |
|---------|---------|-----|------|
| `windOptions` | 风场参数，具体配置如下 | `object` | `--` |
| `zIndex` | 图层层级 | `number` | `--` |
其他参数遵循 `maptalks` 的 `CanvasLayer` 基础图层参数。

### windOptions

| 参数 | 说明 | 类型 | 默认值 |
|---------|---------|-----|------|
| `globalAlpha` | 全局透明度，主要影响粒子路径拖尾效果 | `number` | `0.9` |
| `lineWidth` | 粒子路径宽度 | `number\|function` | `1`, 当为回调函数时，参数`function(m:对应点风速值) => number` |
| `colorScale` | 粒子颜色配置 | `string\|function\|string[]` | `#fff`，当为回调函数时，参数`function(m:对应点风速值) => string` |
| `velocityScale` | 对于粒子路径步长的乘积基数 | `number` | `1 / 25` |
| `maxAge \| particleAge(不推荐使用) ` | 粒子路径能够生成的最大帧数 | `number` | `90` |
| `paths ` | 生成的粒子路径数量 | `number\|function` | `800`, 当为回调函数时，参数`function(m:对应点风速值) => number` |
| `particleMultiplier` | 粒子路径数量的系数，不推荐使用（视野宽度 * 高度 * 系数） | `number` | `1 / 300` |
| `frameRate` | 帧率（ms） | `number` | `20` |

## `amap-wind` 参数说明

:::tip
注意地图 `viewMode` 最好不要设置为 `3D` 模式，目前性能有一定问题
:::

### 图层参数

| 参数 | 说明 | 类型 | 默认值 |
|---------|---------|-----|------|
| `windOptions` | 风场参数，具体配置如下 | `object` | `--` |
| `zIndex` | 图层层级 | `number` | `--` |
其他参数遵循 `高德地图` 的 `CanvasLayer` 基础图层参数，请自行查阅对应文档。

### windOptions

| 参数 | 说明 | 类型 | 默认值 |
|---------|---------|-----|------|
| `globalAlpha` | 全局透明度，主要影响粒子路径拖尾效果 | `number` | `0.9` |
| `lineWidth` | 粒子路径宽度 | `number\|function` | `1`, 当为回调函数时，参数`function(m:对应点风速值) => number` |
| `colorScale` | 粒子颜色配置 | `string\|function\|string[]` | `#fff`，当为回调函数时，参数`function(m:对应点风速值) => string` |
| `velocityScale` | 对于粒子路径步长的乘积基数 | `number` | `1 / 25` |
| `maxAge \| particleAge(不推荐使用) ` | 粒子路径能够生成的最大帧数 | `number` | `90` |
| `paths ` | 生成的粒子路径数量 | `number\|function` | `800`, 当为回调函数时，参数`function(m:对应点风速值) => number` |
| `particleMultiplier` | 粒子路径数量的系数，不推荐使用（视野宽度 * 高度 * 系数） | `number` | `1 / 300` |
| `frameRate` | 帧率（ms） | `number` | `20` |

## `bmap-wind` 参数说明

:::tip
百度地图风场图层主要实现是基于官方  `Overlay` 图层来实现的，基础参数请查阅对应文档，使用 `addOverlay` 添加图层。
:::

### 图层参数

| 参数 | 说明 | 类型 | 默认值 |
|---------|---------|-----|------|
| `windOptions` | 风场参数，具体配置如下 | `object` | `--` |
| `zIndex` | 图层层级 | `number` | `--` |

### windOptions

| 参数 | 说明 | 类型 | 默认值 |
|---------|---------|-----|------|
| `globalAlpha` | 全局透明度，主要影响粒子路径拖尾效果 | `number` | `0.9` |
| `lineWidth` | 粒子路径宽度 | `number\|function` | `1`, 当为回调函数时，参数`function(m:对应点风速值) => number` |
| `colorScale` | 粒子颜色配置 | `string\|function\|string[]` | `#fff`，当为回调函数时，参数`function(m:对应点风速值) => string` |
| `velocityScale` | 对于粒子路径步长的乘积基数 | `number` | `1 / 25` |
| `maxAge \| particleAge(不推荐使用) ` | 粒子路径能够生成的最大帧数 | `number` | `90` |
| `paths ` | 生成的粒子路径数量 | `number\|function` | `800`, 当为回调函数时，参数`function(m:对应点风速值) => number` |
| `particleMultiplier` | 粒子路径数量的系数，不推荐使用（视野宽度 * 高度 * 系数） | `number` | `1 / 300` |
| `frameRate` | 帧率（ms） | `number` | `20` |


## mapbox ScalarFill layer

```js
const fillLayer = new mapboxWind.ScalarFill('wind', {
          // "type": "jsonArray",
          // "data": data,
          "type": "image",
          "url": "./data/var_tmp.png",
          // 'extent': [
          //   [data[0]['header'].lo1, data[0]['header'].la1],
          //   [data[0]['header'].lo1, data[0]['header'].la2],
          //   [data[0]['header'].lo2, data[0]['header'].la1],
          //   [data[0]['header'].lo2, data[0]['header'].la2],
          // ],
          "extent": [
            [-180, 85.051129],
            [-180, -85.051129],
            [180, 85.051129],
            [180, -85.051129],
          ],
          "width": 1440,
          "height": 720,
          // "width": data[0]['header']['nx'],
          // "height": data[0]['header']['ny'] - 1,
          "min": -50.84996643066404,
          // "min": -63.83,
          "max": 42.25002441406252,
          // "max": 36.86,
        }, {
          wrapX: true,
          styleSpec: {
            'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'value'],
              ...tempInterpolateColor
            ],
            'opacity': [
              'interpolate',
              ['exponential', 0.5],
              ['zoom'],
              1,
              1,
              2,
              1
            ],
          },
          renderForm: 'r',
          widthSegments: 720,
          heightSegments: 360,
          // widthSegments: 1,
          // heightSegments: 1,
          // displayRange: [0, 80],
          mappingRange: [0, 5000000],
          // mappingRange: [0, 0],
        });

        map.addLayer(fillLayer);
```

### 参数说明

#### data

| 参数 | 说明 | 类型 | 默认值 |
|---------|---------|-----|------|
| `type` | 数据类型 | `string` | 默认可传 `jsonArray，image` |
| `data` | 类型为jsonArray的数据 | `--` | 查看示例数据 |
| `url` | 类型为image的数据 | `string` | 灰度图路径，需要开启跨域资源 |
| `extent` | 数据范围 | `number[][]` | -- |
| `width` | 数据宽度（或者说灰度图宽度） | `number` | `--` 查看示例 |
| `height` | 数据高度（或者说灰度图高度） | `number` | `--` 查看示例 |
| `min ` | 数据最小值，只针对单通道（r） | `number` | 必传 |
| `max` | 数据最大值，只针对单通道（r） | `number` | 必传 |
| `uMin` | u 分量最小值，只针对双通道（rg） | `number` | `必传` |
| `uMax` | u 分量最大值，只针对双通道（rg） | `number` | `必传` |
| `vMin` | v 分量最小值，只针对双通道（rg） | `number` | `必传` |
| `vMax` | v 分量最大值，只针对双通道（rg） | `number` | `必传` |

#### options

| 参数 | 说明 | 类型 | 默认值 |
|---------|---------|-----|------|
| `wrapX` | 是否开启重复世界渲染 | `Boolean` | `false` |
| `styleSpec` | 样式映射 | `object` | 现在支持 `fill-color` 和 `opacity` 配置，具体定义可参考示例，暂时未完全兼容 mapbox style spec |
| `renderForm` | 渲染通道 | `string` | 默认支持 `r` 和 `rg` |
| `widthSegments` | 生成 plane buffer 渲染网格的宽度步长 | `number` | `1` 不需 3d 渲染时默认给 1，可以提高渲染效率 |
| `heightSegments` | 生成 plane buffer 渲染网格的高度步长 | `number` | `1` 不需 3d 渲染时默认给 1，可以提高渲染效率 |
| `displayRange ` | 渲染数据范围 | `number[]` | 默认为传入的数据前后进行了微小的 buffer，可认为是全量渲染 |
| `mappingRange` | 映射高度 | `number[]` | `[0, 0]`, 3d 渲染时，拔高的映射高度 |

## maptalks ScalarFill layer


#### data

| 参数 | 说明 | 类型 | 默认值 |
|---------|---------|-----|------|
| `type` | 数据类型 | `string` | 默认可传 `jsonArray，image` |
| `data` | 类型为jsonArray的数据 | `--` | 查看示例数据 |
| `url` | 类型为image的数据 | `string` | 灰度图路径，需要开启跨域资源 |
| `extent` | 数据范围 | `number[][]` | -- |
| `width` | 数据宽度（或者说灰度图宽度） | `number` | `--` 查看示例 |
| `height` | 数据高度（或者说灰度图高度） | `number` | `--` 查看示例 |
| `min ` | 数据最小值，只针对单通道（r） | `number` | 必传 |
| `max` | 数据最大值，只针对单通道（r） | `number` | 必传 |
| `uMin` | u 分量最小值，只针对双通道（rg） | `number` | `必传` |
| `uMax` | u 分量最大值，只针对双通道（rg） | `number` | `必传` |
| `vMin` | v 分量最小值，只针对双通道（rg） | `number` | `必传` |
| `vMax` | v 分量最大值，只针对双通道（rg） | `number` | `必传` |

#### options

| 参数 | 说明 | 类型 | 默认值 |
|---------|---------|-----|------|
| `wrapX` | 是否开启重复世界渲染 | `Boolean` | `false` |
| `styleSpec` | 样式映射 | `object` | 现在支持 `fill-color` 和 `opacity` 配置，具体定义可参考示例，暂时未完全兼容 mapbox style spec |
| `renderForm` | 渲染通道 | `string` | 默认支持 `r` 和 `rg` |
| `widthSegments` | 生成 plane buffer 渲染网格的宽度步长 | `number` | `1` 不需 3d 渲染时默认给 1，可以提高渲染效率 |
| `heightSegments` | 生成 plane buffer 渲染网格的高度步长 | `number` | `1` 不需 3d 渲染时默认给 1，可以提高渲染效率 |
| `displayRange ` | 渲染数据范围 | `number[]` | 默认为传入的数据前后进行了微小的 buffer，可认为是全量渲染 |
| `mappingRange` | 映射高度 | `number[]` | `[0, 0]`, 3d 渲染时，拔高的映射高度 |
