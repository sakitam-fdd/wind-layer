---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / gl-core/src

# Module: gl-core/src

## Enumerations

- [DecodeType](../enums/gl_core_src.DecodeType.md)
- [LayerSourceType](../enums/gl_core_src.LayerSourceType.md)
- [MaskType](../enums/gl_core_src.MaskType.md)
- [RenderFrom](../enums/gl_core_src.RenderFrom.md)
- [RenderType](../enums/gl_core_src.RenderType.md)
- [TileState](../enums/gl_core_src.TileState.md)

## Classes

- [BaseLayer](../classes/gl_core_src.BaseLayer.md)
- [ImageSource](../classes/gl_core_src.ImageSource.md)
- [Tile](../classes/gl_core_src.Tile.md)
- [TileID](../classes/gl_core_src.TileID.md)
- [TileSource](../classes/gl_core_src.TileSource.md)
- [TimelineSource](../classes/gl_core_src.TimelineSource.md)

## Interfaces

- [BaseLayerOptions](../interfaces/gl_core_src.BaseLayerOptions.md)
- [ImageSourceOptions](../interfaces/gl_core_src.ImageSourceOptions.md)
- [ProjTileBounds](../interfaces/gl_core_src.ProjTileBounds.md)
- [TileSourceOptions](../interfaces/gl_core_src.TileSourceOptions.md)

## Type Aliases

### BandType

Ƭ **BandType**: ``0`` \| ``1`` \| ``2`` \| ``3``

#### Defined in

[packages/gl-core/src/type.ts:1](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/type.ts#L1)

___

### Bounds

Ƭ **Bounds**: [`number`, `number`, `number`, `number`]

#### Defined in

[packages/gl-core/src/type.ts:154](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/type.ts#L154)

___

### Coordinates

Ƭ **Coordinates**: [[`number`, `number`], [`number`, `number`], [`number`, `number`], [`number`, `number`]]

#### Defined in

[packages/gl-core/src/type.ts:114](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/type.ts#L114)

___

### DataRange

Ƭ **DataRange**: [`number`, `number`]

数据范围

#### Defined in

[packages/gl-core/src/type.ts:112](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/type.ts#L112)

___

### LayerData

Ƭ **LayerData**: [`ImageSourceOptions`](../interfaces/gl_core_src.ImageSourceOptions.md) \| `JsonArrayData` \| [`TileSourceOptions`](../interfaces/gl_core_src.TileSourceOptions.md)

#### Defined in

[packages/gl-core/src/type.ts:178](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/type.ts#L178)

___

### ParseOptionsType

Ƭ **ParseOptionsType**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `renderFrom` | [`RenderFrom`](../enums/gl_core_src.RenderFrom.md) |

#### Defined in

[packages/gl-core/src/type.ts:225](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/type.ts#L225)

___

### SourceType

Ƭ **SourceType**: [`TileSource`](../classes/gl_core_src.TileSource.md) \| [`ImageSource`](../classes/gl_core_src.ImageSource.md) \| [`TimelineSource`](../classes/gl_core_src.TimelineSource.md)

#### Defined in

[packages/gl-core/src/source/index.ts:5](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/index.ts#L5)

___

### TileBounds

Ƭ **TileBounds**: [`Bounds`](gl_core_src.md#bounds)

瓦片范围 (经纬度) [xmin, ymin, xmax, ymax]

#### Defined in

[packages/gl-core/src/type.ts:213](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/type.ts#L213)

___

### TileSize

Ƭ **TileSize**: `number`

瓦片尺寸

#### Defined in

[packages/gl-core/src/type.ts:107](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/type.ts#L107)

## Variables

### configDeps

• `Const` **configDeps**: `any` = `wgw.configDeps`

#### Defined in

[packages/gl-core/src/index.ts:7](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/index.ts#L7)

___

### defaultOptions

• `Const` **defaultOptions**: [`BaseLayerOptions`](../interfaces/gl_core_src.BaseLayerOptions.md)

#### Defined in

[packages/gl-core/src/renderer/index.ts:109](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L109)

___

### littleEndian

• `Const` **littleEndian**: `boolean`

判断大小端

#### Defined in

[packages/gl-core/src/utils/common.ts:81](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/utils/common.ts#L81)

## Functions

### calcMinMax

▸ **calcMinMax**(`array`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `array` | `number`[] |

#### Returns

[`number`, `number`]

#### Defined in

[packages/gl-core/src/utils/common.ts:5](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/utils/common.ts#L5)

___

### containTile

▸ **containTile**(`a`, `b`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Bounds`](gl_core_src.md#bounds) |
| `b` | [`Bounds`](gl_core_src.md#bounds) |

#### Returns

`boolean`

#### Defined in

[packages/gl-core/src/utils/common.ts:195](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/utils/common.ts#L195)

___

### containsExtent

▸ **containsExtent**(`extent1`, `extent2`): `boolean`

extent1 是否包含 extent2
          extent1[3]
          |--------|
          |        |
extent1[0]|        |extent1[2]
          |--------|
          extent1[1]

           extent2[3]
          |--------|
          |        |
extent2[0]|        |extent2[2]
          |--------|
          extent2[1]

#### Parameters

| Name | Type |
| :------ | :------ |
| `extent1` | [`Bounds`](gl_core_src.md#bounds) |
| `extent2` | [`Bounds`](gl_core_src.md#bounds) |

#### Returns

`boolean`

#### Defined in

[packages/gl-core/src/utils/common.ts:166](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/utils/common.ts#L166)

___

### containsXY

▸ **containsXY**(`extent`, `x`, `y`): `boolean`

判断坐标是否在矩形范围内

**`Api`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `extent` | `any` | Extent. |
| `x` | `any` | X coordinate. |
| `y` | `any` | Y coordinate. |

#### Returns

`boolean`

The x, y values are contained in the extent.

#### Defined in

[packages/gl-core/src/utils/common.ts:183](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/utils/common.ts#L183)

___

### findStopLessThanOrEqualTo

▸ **findStopLessThanOrEqualTo**(`stops`, `input`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stops` | `number`[] |
| `input` | `number` |

#### Returns

`number`

#### Defined in

[packages/gl-core/src/utils/common.ts:35](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/utils/common.ts#L35)

___

### flattenForPolygons

▸ **flattenForPolygons**(`features`): `any`[]

将多面转换为单面

#### Parameters

| Name | Type |
| :------ | :------ |
| `features` | `any` |

#### Returns

`any`[]

#### Defined in

[packages/gl-core/src/utils/common.ts:203](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/utils/common.ts#L203)

___

### getBandType

▸ **getBandType**(`renderFrom`): ``1`` \| ``0`` \| ``2`` \| ``3``

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderFrom` | [`RenderFrom`](../enums/gl_core_src.RenderFrom.md) |

#### Returns

``1`` \| ``0`` \| ``2`` \| ``3``

#### Defined in

[packages/gl-core/src/type.ts:57](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/type.ts#L57)

___

### inRange

▸ **inRange**(`value`, `start`, `end`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |
| `start` | `number` |
| `end` | `number` |

#### Returns

`boolean`

#### Defined in

[packages/gl-core/src/utils/common.ts:187](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/utils/common.ts#L187)

___

### intersects

▸ **intersects**(`extent1`, `extent2`): `boolean`

extent1 是否包含 extent2
          extent1[3]
          |--------|
          |        |
extent1[0]|        |extent1[2]
          |--------|
          extent1[1]

           extent2[3]
          |--------|
          |        |
extent2[0]|        |extent2[2]
          |--------|
          extent2[1]

#### Parameters

| Name | Type |
| :------ | :------ |
| `extent1` | [`Bounds`](gl_core_src.md#bounds) |
| `extent2` | [`Bounds`](gl_core_src.md#bounds) |

#### Returns

`boolean`

#### Defined in

[packages/gl-core/src/utils/common.ts:139](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/utils/common.ts#L139)

___

### isFunction

▸ **isFunction**(`val`): val is Function

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

val is Function

#### Defined in

[packages/gl-core/src/utils/common.ts:31](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/utils/common.ts#L31)

___

### isImageBitmap

▸ **isImageBitmap**(`image`): image is ImageBitmap

判断数据是否是 `ImageBitmap`

#### Parameters

| Name | Type |
| :------ | :------ |
| `image` | `any` |

#### Returns

image is ImageBitmap

#### Defined in

[packages/gl-core/src/utils/common.ts:91](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/utils/common.ts#L91)

___

### keysDifference

▸ **keysDifference**(`obj`, `other`): (`string` \| `number`)[]

获取两个对象中不同的 key

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `any` |
| `other` | `any` |

#### Returns

(`string` \| `number`)[]

#### Defined in

[packages/gl-core/src/utils/common.ts:111](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/utils/common.ts#L111)

___

### mod

▸ **mod**(`x`, `y`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `any` |
| `y` | `any` |

#### Returns

`number`

#### Defined in

[packages/gl-core/src/utils/common.ts:191](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/utils/common.ts#L191)

___

### parseRange

▸ **parseRange**(`exif`): `any`

从 exif 解析数据范围

#### Parameters

| Name | Type |
| :------ | :------ |
| `exif` | `any` |

#### Returns

`any`

#### Defined in

[packages/gl-core/src/utils/common.ts:99](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/utils/common.ts#L99)

___

### polygon2buffer

▸ **polygon2buffer**(`features`): `Attributes`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `features` | `any`[] |

#### Returns

`Attributes`[]

#### Defined in

[packages/gl-core/src/utils/common.ts:235](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/utils/common.ts#L235)

___

### resolveURL

▸ **resolveURL**(`path`): `string`

使用相对地址时使用 `a.href` 和 `image.src` 可以获取完整的 url
但是不同的是 `image.src` 会直接请求资源。

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`string`

#### Defined in

[packages/gl-core/src/utils/common.ts:72](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/utils/common.ts#L72)
