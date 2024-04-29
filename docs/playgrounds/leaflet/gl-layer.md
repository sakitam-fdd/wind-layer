---
aside: false
importMap: {
  "leaflet": "https://esm.sh/leaflet",
  "leaflet-wind": "https://esm.sh/leaflet-wind",
  "tweakpane": "https://esm.sh/tweakpane"
}
---

## 基于 leaflet 的 webgl 图层

### 常规瓦片图层

可替代 leaflet 内部的 TileLayer dom 实现的图层

<sfc-playground src="./gl-raster.vue" language="vue" title="gl-raster" desc="栅格瓦片图层"></sfc-playground>

### 常规图片图层

可替代 leaflet 内部的 ImageOverlay 实现的图层

<sfc-playground src="./gl-image.vue" language="vue" title="gl-image" desc="图片图层"></sfc-playground>

### 气象数据图层

1. 色斑图瓦片

<sfc-playground src="./gl-colorize.vue" language="vue" title="gl-colorize" desc="色斑图"></sfc-playground>

2. 色斑图单张图片

<sfc-playground src="./gl-colorize-image.vue" language="vue" title="gl-colorize-image" desc="色斑图-单张图片"></sfc-playground>

3. 粒子图层-单张

<sfc-playground src="./gl-particles-image.vue" language="vue" title="gl-particles-image" desc="粒子图层-单张图片数据"></sfc-playground>

4. 粒子图层-瓦片

<sfc-playground src="./gl-particles-tile.vue" language="vue" title="gl-particles-tile" desc="粒子图层-瓦片"></sfc-playground>

5. Arrow图层-瓦片

<sfc-playground src="./gl-arrow-tile.vue" language="vue" title="gl-arrow-tile" desc="箭头图层-瓦片"></sfc-playground>
