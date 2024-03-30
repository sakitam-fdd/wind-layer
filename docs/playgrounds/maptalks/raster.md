---
aside: false
importMap: {
  "maptalks": "https://esm.sh/maptalks",
  "@sakitam-gis/maptalks-wind": "https://esm.sh/@sakitam-gis/maptalks-wind"
}
---

## 添加栅格数据 - 单张

这里我们使用 maptalks 配合 ``wind-layer`` 的 `ImageSource` 创建栅格展示数据。

<sfc-playground src="./image.vue" language="vue" title="栅格数据" desc="添加栅格数据 - 单张"></sfc-playground>

如示例代码所示 `ImageSource` 对应 maptalks 的 `ImageLayer`。

## 添加栅格数据 - 瓦片

这里我们使用 maptalks 配合 ``wind-layer`` 的 `TileSource` 创建栅格展示数据。

<sfc-playground src="./tile.vue" language="vue" title="栅格数据" desc="添加栅格数据 - 瓦片"></sfc-playground>

如示例代码所示 `ImageSource` 对应 maptalks 的 `TileLayer`。
