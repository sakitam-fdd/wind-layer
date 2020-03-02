---
title: openlayers 6
lang: en-US
description: 
order: 0
---

## 示例

### 基础地图展示

:::demo 基础使用，地图投影默认为 `EPSG:3857` 墨卡托投影。

```demo
<ClientOnly>
  <demo-ol-wind-base />
</ClientOnly>
```

<<<@/examples/components/ol/base.vue

:::

### 投影变换

此处用于展示各类投影下的风场效果。

#### epsg:4326

:::demo 投影变换，地图投影默认为 `EPSG:4326`, 可以看到地图两极有明显变形;

```demo
<ClientOnly>
  <demo-ol-wind-epsg4326 />
</ClientOnly>
```

<<<@/examples/components/ol/epsg4326.vue

:::

#### epsg:3413 极投影

:::demo 投影变换，地图投影默认为 `EPSG:3413` 极投影;

```demo
<ClientOnly>
  <demo-ol-wind-epsg3413 />
</ClientOnly>
```

<<<@/examples/components/ol/epsg3413.vue

:::

#### ESRI:53009 moll

:::demo 投影变换，地图投影默认为 `ESRI:53009`;

```demo
<ClientOnly>
  <demo-ol-wind-moll />
</ClientOnly>
```

<<<@/examples/components/ol/moll.vue

:::
