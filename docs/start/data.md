---
title: data introduce
order: 1
---

## 关于数据来源

对应数据来源可以是gfs或者ecmwf，无论数据来源是哪个地方，最终此插件目前只支持`json`数据格式输入。

关于如何将数据文件转换为 `json` ，你可以查阅 `[grib2json](https://github.com/cambecc/grib2json)`, 或者
[ecmwf](https://software.ecmwf.int/wiki/display/GRIB/Releases) 的数据处理库，当然，你也可以自行处理格点数据；
本仓库中的`node` 处理程序主要依赖了 `grib2json` 的一个jar包；

另外在解析数据时需要注意数据是否翻转了，默认对于地图展示来说我们知道经度默认从左向右递增，纬度从上向下依次递减（不一定完全正确），
所以在处理数据时我们需要注意数据的范围和方向，避免展示出错，相关有一个讨论可以在 [44](https://github.com/sakitam-fdd/wind-layer/issues/44)
看到。

## 数据详解

返回 `json` 数据为一个数组类型，两个元素分别为 U和V对应数据，数据中应该至少包含以下字段：

```json
dx: Increment in X direction, cannot be negative(x方向增量)
dy: Increment in Y direction, cannot be negative（Y方向增量）
nx: cols 数据行数
ny: rows 数据列数
# 以下四个为数据矩形范围
lo1: xmin 
lo2: xmax
la1: ymin
la2: ymax
# U/V主要由以下参数区分
parameterCategory: data type
parameterNumber: data type
```

