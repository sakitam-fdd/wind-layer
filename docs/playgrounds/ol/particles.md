---
aside: false
importMap: {
  "ol": "https://esm.sh/ol",
  "@sakitam-gis/ol5": "https://esm.sh/@sakitam-gis/ol5",
  "ol-wind": "https://esm.sh/ol-wind",
  "ol5-wind": "https://esm.sh/ol5-wind",
  "proj4": "https://esm.sh/proj4@2.6.0"
}
---

## ol

### 基础地图展示

::: tip
基础使用，地图投影默认为 `EPSG:3857` 墨卡托投影。
:::

<sfc-playground src="./ol.vue" language="vue" title="ol-wind" desc="添加风场图层"></sfc-playground>

### 投影变换

此处用于展示各类投影下的风场效果。

#### epsg:4326

::: tip
投影变换，地图投影默认为 `EPSG:4326`, 可以看到地图两极有明显变形;
:::

<sfc-playground src="./ol-4326.vue" language="vue" title="ol-wind-4326" desc="添加EPSG:4326风场图层"></sfc-playground>

#### epsg:3413 极投影

::: tip
投影变换，地图投影默认为 `EPSG:3413` 极投影;
:::

<sfc-playground src="./ol-3413.vue" language="vue" title="ol-wind-3413" desc="添加EPSG:3413风场图层"></sfc-playground>

#### ESRI:53009 moll

::: tip
投影变换，地图投影默认为 `ESRI:53009`;
:::

<sfc-playground src="./ol-moll.vue" language="vue" title="ol-wind-moll" desc="添加ESRI:53009风场图层"></sfc-playground>

## ol5

ol5 的相关支持

### 基础地图展示

::: tip
基础使用，地图投影默认为 `EPSG:3857` 墨卡托投影。
:::

<sfc-playground src="./ol5.vue" language="vue" title="ol5-wind" desc="添加风场图层"></sfc-playground>
