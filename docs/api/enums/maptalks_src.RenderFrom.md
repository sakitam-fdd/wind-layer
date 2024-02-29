---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [maptalks/src](../modules/maptalks_src.md) / RenderFrom

# Enumeration: RenderFrom

[maptalks/src](../modules/maptalks_src.md).RenderFrom

## Enumeration Members

### float

• **float** = ``"float"``

浮点值，一般存储在 r 通道或者使用 `LUMINANCE` 通道（精度最高）

#### Defined in

packages/gl-core/dist/index.d.ts:51

___

### r

• **r** = ``"r"``

标量值
一般需要配合数据配置中的 dataRange 字段解析原始值；
当然也可以从图像的 `Exif` 信息中提取

#### Defined in

packages/gl-core/dist/index.d.ts:37

___

### rg

• **rg** = ``"rg"``

矢量值，常见于气象要素的风速和风向等描述大小和方向的数据
一般需要配合数据配置中的 dataRange 字段解析原始值；
当然也可以从图像的 `Exif` 信息中提取

#### Defined in

packages/gl-core/dist/index.d.ts:43

___

### rgba

• **rgba** = ``"rgba"``

一般用于浮点值（需要在 glsl 中做 rgba2float 转换）

#### Defined in

packages/gl-core/dist/index.d.ts:47
