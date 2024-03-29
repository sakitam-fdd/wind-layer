---
title: maptalks
description: 
importMap: {
  "maptalks": "https://esm.sh/maptalks",
  "@sakitam-gis/maptalks-wind": "https://esm.sh/@sakitam-gis/maptalks-wind"
}
---

# maptalks

[[toc]]

## 安装插件

::: code-group

```sh [npm]
$ npm add @sakitam-gis/maptalks-wind
```

```sh [pnpm]
$ pnpm add @sakitam-gis/maptalks-wind
```

```sh [yarn]
$ yarn add @sakitam-gis/maptalks-wind
```

```html [script]
<script src="https://unpkg.com/@sakitam-gis/maptalks-wind/dist/maptalks-wind.js"></script>
```

:::

## 创建地图实例

当我们准备好相关依赖后就可以进行地图和图层的创建了

::: code-group

```ts
import maptalks from 'maptalks';

const map = new maptalks.Map(mapRef.value, {
    zoom: 2,
    center: [34.371, 131.287].reverse(),
    baseLayer: new maptalks.TileLayer('base', {
      urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      // urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      subdomains: ['a', 'b', 'c', 'd'],
      repeatWorld: 'x',
    })
});
```
:::

## 创建数据源

参考 `mapbox-gl` 的使用，关于数据源和图层的创建这块的 api 基本保持了一致。

## 创建图层

参考 `mapbox-gl` 的使用，关于数据源和图层的创建这块的 api 基本保持了一致。
 
## 示例

::: tip
灰度图瓦片数据
:::

<sfc-playground src="../playgrounds/maptalks/colorize-tile.vue" language="vue" title="灰度图数据" desc="添加灰度图数据 - 瓦片"></sfc-playground>

