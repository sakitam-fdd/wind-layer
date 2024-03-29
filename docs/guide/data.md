---
title: 数据说明
---

# 关于数据来源

[[toc]]

## 1.x 数据说明

对应数据来源可以是gfs或者ecmwf，无论数据来源是哪个地方，最终此插件目前只支持`json`数据格式输入。

关于如何将数据文件转换为 `json` ，你可以查阅 [grib2json](https://github.com/cambecc/grib2json), 或者
[ecmwf](https://software.ecmwf.int/wiki/display/GRIB/Releases) 的数据处理库，当然，你也可以自行处理格点数据；

另外在解析数据时需要注意数据是否翻转了，默认对于地图展示来说我们知道经度默认从左向右递增，纬度从上向下依次递减（不一定完全正确），
所以在处理数据时我们需要注意数据的范围和方向，避免展示出错，相关有一个讨论可以在 [44](https://github.com/sakitam-fdd/wind-layer/issues/44)
看到。

### 数据详解

返回 `json` 数据为一个数组类型，两个元素分别为 U和V对应数据，数据中应该至少包含以下字段：

```bash
dx: Increment in X direction, cannot be negative(x方向增量)
dy: Increment in Y direction, cannot be negative（Y方向增量）
nx: cols 数据行数
ny: rows 数据列数
# 以下四个为数据矩形范围
lo1: xmin 
lo2: xmax
la1: ymin
la2: ymax
# u/v 主要由以下参数区分
parameterCategory: data type
parameterNumber: data type
```

一般情况下由 `grib2json` 转出的数据`parameterCategory`参数为`1`，当`parameterNumber` 为 `2` 时为`u` 分量，
当`parameterNumber` 为 `3` 时为`v` 分量。

并且还需要注意的是 `dy`（纬度）增量 (默认我们采用的数据和格点原始数据方向保持一致，数据从左上到右下) 但是需要注意的是此时 `dy` 为 -(ymax - ymin) / ny
有些情况下我们格点数据组织形式可能 Y 轴是上下翻转的，此时我们可以配置 `options.fieldOptions.flipY = true`，来主动翻转数据（默认情况下我们检测到数据配置中的
`deltaY > 0` 时并且未配置`flipY`参数项默认去翻转数据）。

## 2.x 数据说明

在 2.0 版本之后（目前包括 `mapbox`、`maplibre`、`maptalks`）做了多数据源支持（`geotiff`、灰度图-可解析带 [exif](https://en.wikipedia.org/wiki/Exif) 信息、png-多通道浮点数压缩），其中 `geotiff` 的支持需要配置 `configDeps`, `exif` 默认支持，因为在 `safari` 浏览器下 `configDeps` 有兼容性问题，所以默认打包了 exif 的解析库。
```ts
mapboxWind.configDeps(['https://unpkg.com/geotiff/dist-browser/geotiff.js']);
```

对于 2.x 版本的数据格式我们可以使用 https://github.com/sakitam-gis/raster-process 来生成所需要的瓦片和单张图片。
