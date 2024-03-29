---
aside: false
importMap: {
  "maplibre-gl": "https://esm.sh/maplibre-gl",
  "@sakitam-gis/maplibre-wind": "https://esm.sh/@sakitam-gis/maplibre-wind"
}
---

这里是栅格相关的实例，虽然他们的效果与 maplibre 的 ImageSource 和 RasterSource 展示效果相同，但是提供了如时序播放和图层掩膜的能力。

## 添加栅格数据 - 单张

::: tip 
可以视作 maplibre-gl 中的 ImageSource
:::

<sfc-playground src="./index.vue" language="vue" title="栅格数据" desc="添加栅格数据 - 单张"></sfc-playground>

## 添加栅格数据 - 瓦片

::: tip
等同于 maplibre-gl 中的 RasterSource
:::

<sfc-playground src="./raster.vue" language="vue" title="栅格数据" desc="添加栅格数据 - 瓦片"></sfc-playground>
