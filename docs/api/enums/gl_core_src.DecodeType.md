---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [gl-core/src](../modules/gl_core_src.md) / DecodeType

# Enumeration: DecodeType

[gl-core/src](../modules/gl_core_src.md).DecodeType

解析类型

## Enumeration Members

### image

• **image** = ``0``

以 `ImageBitmap` 图像解析

#### Defined in

[packages/gl-core/src/type.ts:78](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/type.ts#L78)

___

### imageWithExif

• **imageWithExif** = ``3``

解析带有 `Exif` 的图像，一般我们使用单通道 `RenderFrom.r` 或者 `RenderFrom.rg`
可能从 Exif 信息中提取原始值范围。

#### Defined in

[packages/gl-core/src/type.ts:94](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/type.ts#L94)

___

### tiff

• **tiff** = ``2``

使用 `GeoTIFF` 作为解析器

#### Defined in

[packages/gl-core/src/type.ts:88](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/type.ts#L88)

___

### unit8

• **unit8** = ``1``

解析为 `Uint8Array`

#### Defined in

[packages/gl-core/src/type.ts:83](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/type.ts#L83)
