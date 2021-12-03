---
title: ol
description: 
order: 0
---

# ol

## 示例

### 基础地图展示

::: tip
基础使用，地图投影默认为 `EPSG:3857` 墨卡托投影。
:::

<<<@/components/ol.vue

### 投影变换

此处用于展示各类投影下的风场效果。

#### epsg:4326

::: tip
投影变换，地图投影默认为 `EPSG:4326`, 可以看到地图两极有明显变形;
:::

<<<@/components/ol-4326.vue

#### epsg:3413 极投影

::: tip
投影变换，地图投影默认为 `EPSG:3413` 极投影;
:::

<<<@/components/ol-3413.vue

#### ESRI:53009 moll

::: tip
投影变换，地图投影默认为 `ESRI:53009`;
:::

<<<@/components/ol-moll.vue
