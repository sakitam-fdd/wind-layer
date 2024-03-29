---
title: maplibre-gl
description:
importMap: {
  "maplibre-gl": "https://esm.sh/maplibre-gl",
  "@sakitam-gis/maplibre-wind": "https://esm.sh/@sakitam-gis/maplibre-wind"
}
---

[[toc]]

## 安装插件

::: code-group

```sh [npm]
$ npm add @sakitam-gis/maplibre-wind
```

```sh [pnpm]
$ pnpm add @sakitam-gis/maplibre-wind
```

```sh [yarn]
$ yarn add @sakitam-gis/maplibre-wind
```

```html [script]
<script src="https://unpkg.com/@sakitam-gis/maplibre-wind/dist/maplibre-wind.js"></script>
```

:::

## 创建地图实例

当我们准备好相关依赖后就可以进行地图和图层的创建了

::: code-group

```ts
import maplibregl from 'maplibre-gl';

const map = new maplibregl.Map({
    container: mapRef.value,
    center: { lng: 105.70150033978689, lat: 22.76021405309811 }, // starting position [lng, lat]
    zoom: 0,
    antialias: true,
    style: {
        version: 8,
        sources: {
            carto: {
                type: 'raster',
                tiles: [
                    '//a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                    '//b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                    '//c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                    '//d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                ],
                tileSize: 256,
                minzoom: 1,
                maxzoom: 18,
            },
        },
        layers: [
            {
                id: 'carto',
                type: 'raster',
                source: 'carto',
                // minzoom: 1,
                // maxzoom: 22,
                paint: {
                    'raster-resampling': 'linear',
                },
            },
            {
                id: 'background',
                type: 'background',
                layout: {
                    visibility: 'none',
                },
            },
        ],
    },
});
```
:::

## 创建数据源

注意这里，数据源和图层是分开的。这是为了方便后续去扩展其他数据源类型，图层仅负责渲染，数据加载相关逻辑都由对应的数据源负责处理，目前支持的数据
源主要由三种 瓦片图层 `TileSource`、单张图片图层 `ImageSource`、时序数据源 `TimelineSource`。

它们直接区别顾名思义，`TileSource` 瓦片图层用于加载标准墨卡托投影的切片数据，这在我们对展示数据精度要求高的场景中比较适用，数据瓦片编码类型有以下三种：

1. geotiff: 标准墨卡托投影的 geotiff 单通道或者双通道数据，这种方式需要我们预先配置 geotiff 解析类库 (地址是一个 cdn 地址，不打包进去的原因是为了减少包相关的体积)

```ts
mapboxWind.configDeps(['https://unpkg.com/geotiff/dist-browser/geotiff.js']);
```

2. 灰度图-可解析带 exif 信息中的 `ImageDescription` 字段，这个字段是一个字符串内容为 `r 通道最小值,r通道最大值;g 通道最小值,g 通道最大值`， 也可以我们我们直接在数据源中指定数据值域范围

```ts
const source = new TileSource('wind', {
    ...,
    dataRange: [r 通道最小值,r通道最大值, g 通道最小值,g 通道最大值]
});
```

::: tip
不管是 exif 信息还是用户手动配置的 `dataRange` 它们最少要为一组值域，最多允许两组
:::

![Float image](/data/tiles/2023111700/2023111703/0/0/0/wind-surface.jpeg)

3. png-多通道浮点数压缩

这类数据目前来说不属于稳定功能，这个原因是由于数据纹理的自动采样造成的。我们知道一个 float32 数据可以压缩
到 4 个 uint8 数据中，我们在 js 中我们一般通过以下代码处理, 调用 `encodeFloat` 将一个浮点数压到 4 个 u8
中，所以我们一般需要 4 通道图片才可以存放：

```ts
export const littleEndian = (function machineIsLittleEndian() {
    const uint8Array = new Uint8Array([0xAA, 0xBB]);
    const uint16array = new Uint16Array(uint8Array.buffer);
    return uint16array[0] === 0xBBAA;
})();

const UINT8_VIEW = new Uint8Array(4);
const FLOAT_VIEW = new Float32Array(UINT8_VIEW.buffer);
const FLOAT_VIEW_D = new Float32Array(1);
const UINT8_VIEW_D = new Uint8Array(FLOAT_VIEW_D.buffer);

export function decodeFloat(x, y, z, w) {
    UINT8_VIEW[0] = w;
    UINT8_VIEW[1] = z;
    UINT8_VIEW[2] = y;
    UINT8_VIEW[3] = x;
    return FLOAT_VIEW[0];
}

export function encodeFloat(v) {
    FLOAT_VIEW_D[0] = v;
    const rgba = [UINT8_VIEW_D[0], UINT8_VIEW_D[1], UINT8_VIEW_D[2], UINT8_VIEW_D[3]];
    return littleEndian ? rgba.reverse() : rgba;
}
```

![Float image](/data/float.png)

以下是一个简单的创建数据源的代码片段

```ts
import { Layer, TileSource, RenderType, DecodeType, RenderFrom } from '@sakitam-gis/maplibre-wind';

const source = new TileSource('wind', {
    url: 'https://blog.sakitam.com/wind-layer/data/tiles/2023111700/2023111703/{z}/{x}/{y}/wind-surface.jpeg',
    tileSize: 256,
    minZoom: 0,
    maxZoom: 3,
    roundZoom: true,
    decodeType: DecodeType.imageWithExif,
    wrapX: true,
});
```

## 创建图层

这里我们创建了一个新图层，第一个参数为图层 id，第二个参数为数据源实例，第三个为配置项，配置项我们一般需要指定 `styleSpec` 样式配置
`renderFrom` 指定数据纹理所用的通道数，一般为 `RenderFrom.r` 或者 `RenderFrom.rg`；`displayRange` 指定我们真实要素数据可显示的范围
，这个参数也可以不指定，不进行限制，但是在需要数据过滤的场景比较有用。`renderType` 指定图层渲染类型，一般为 `RenderType.image` 非数据
纹理，`RenderType.colorize` 色斑图渲染，`RenderType.particles` 粒子图层，`RenderType.arrow` 箭头图层。注意后面两种渲染类型仅支持
Vector 数据。

```ts
import { Layer, TileSource, RenderType, DecodeType, RenderFrom } from '@sakitam-gis/maplibre-wind';

const layer = new Layer('wind', source, {
    styleSpec: {
        'fill-color': ['interpolate', ['linear'], ['get', 'value'], ...interpolateColor],
        opacity: 1,
    },
    renderFrom: RenderFrom.rg,
    displayRange: [0, 104],
    renderType: RenderType.colorize,
});

map.addLayer(layer);
```

## 示例

::: tip
灰度图瓦片数据
:::

<sfc-playground src="../playgrounds/maplibre-gl/colorize-tile.vue" language="vue" title="灰度图数据" desc="添加灰度图数据 - 瓦片"></sfc-playground>
