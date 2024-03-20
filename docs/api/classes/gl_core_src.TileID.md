---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [gl-core/src](../modules/gl_core_src.md) / TileID

# Class: TileID

[gl-core/src](../modules/gl_core_src.md).TileID

## Constructors

### constructor

• **new TileID**(`overscaledZ`, `wrap?`, `z`, `x`, `y`, `options?`)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `overscaledZ` | `number` | `undefined` | 扩大的 z 值 |
| `wrap` | `number` | `0` | 所处世界 |
| `z` | `number` | `undefined` | 层级 |
| `x` | `number` | `undefined` | 列 |
| `y` | `number` | `undefined` | 行 |
| `options` | `TileIDOptions` | `undefined` | 瓦片其他配置 |

#### Defined in

[packages/gl-core/src/tile/TileID.ts:76](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L76)

## Properties

### dep

• **dep**: `any`

挂载的其他数据

#### Defined in

[packages/gl-core/src/tile/TileID.ts:66](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L66)

___

### options

• **options**: `TileIDOptions`

#### Defined in

[packages/gl-core/src/tile/TileID.ts:61](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L61)

___

### overscaledZ

• **overscaledZ**: `number`

放大后的 zoom 值

#### Defined in

[packages/gl-core/src/tile/TileID.ts:41](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L41)

___

### projTileBounds

• **projTileBounds**: [`ProjTileBounds`](../interfaces/gl_core_src.ProjTileBounds.md)

投影后的瓦片范围

#### Defined in

[packages/gl-core/src/tile/TileID.ts:59](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L59)

___

### tileBounds

• **tileBounds**: [`Bounds`](../modules/gl_core_src.md#bounds)

瓦片范围（每次获取时计算）

#### Defined in

[packages/gl-core/src/tile/TileID.ts:54](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L54)

___

### tileKey

• **tileKey**: `string`

瓦片唯一标识

#### Defined in

[packages/gl-core/src/tile/TileID.ts:45](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L45)

___

### unWrappedTileKey

• **unWrappedTileKey**: `string`

不包含跨世界的瓦片标识（因为多个世界的瓦片如果仅仅是 `wrap` 不同，他们对应的数据资源是完全相同的）

#### Defined in

[packages/gl-core/src/tile/TileID.ts:49](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L49)

___

### wrap

• **wrap**: `number`

所在世界（如果是多世界的话）

#### Defined in

[packages/gl-core/src/tile/TileID.ts:36](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L36)

___

### wrapedX

• **wrapedX**: `number`

跨世界后的瓦片列

#### Defined in

[packages/gl-core/src/tile/TileID.ts:18](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L18)

___

### wrapedY

• **wrapedY**: `number`

跨世界后的瓦片行（目前仅 maptalks 支持）

#### Defined in

[packages/gl-core/src/tile/TileID.ts:27](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L27)

___

### x

• **x**: `number`

瓦片列

#### Defined in

[packages/gl-core/src/tile/TileID.ts:13](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L13)

___

### y

• **y**: `number`

瓦片行

#### Defined in

[packages/gl-core/src/tile/TileID.ts:22](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L22)

___

### z

• **z**: `number`

瓦片层级

#### Defined in

[packages/gl-core/src/tile/TileID.ts:32](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L32)

## Methods

### children

▸ **children**(`sourceMaxZoom`): [`TileID`](gl_core_src.TileID.md)[]

查找当前瓦片的子瓦片

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceMaxZoom` | `number` |

#### Returns

[`TileID`](gl_core_src.TileID.md)[]

#### Defined in

[packages/gl-core/src/tile/TileID.ts:161](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L161)

___

### getTileBounds

▸ **getTileBounds**(`tileID?`): [`Bounds`](../modules/gl_core_src.md#bounds)

获取瓦片范围

#### Parameters

| Name | Type |
| :------ | :------ |
| `tileID` | [`TileID`](gl_core_src.TileID.md) |

#### Returns

[`Bounds`](../modules/gl_core_src.md#bounds)

#### Defined in

[packages/gl-core/src/tile/TileID.ts:104](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L104)

___

### getTileProjBounds

▸ **getTileProjBounds**(`tileID?`, `force?`): [`ProjTileBounds`](../interfaces/gl_core_src.ProjTileBounds.md)

获取瓦片投影后的范围

#### Parameters

| Name | Type |
| :------ | :------ |
| `tileID` | [`TileID`](gl_core_src.TileID.md) |
| `force?` | `boolean` |

#### Returns

[`ProjTileBounds`](../interfaces/gl_core_src.ProjTileBounds.md)

#### Defined in

[packages/gl-core/src/tile/TileID.ts:116](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L116)

___

### isEqual

▸ **isEqual**(`tile`): `boolean`

判断瓦片是否相同
一般我们认为只要 xyz 和所处世界 wrap 相同就确认相同（即 tileKey 相同）

#### Parameters

| Name | Type |
| :------ | :------ |
| `tile` | [`TileID`](gl_core_src.TileID.md) |

#### Returns

`boolean`

#### Defined in

[packages/gl-core/src/tile/TileID.ts:219](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L219)

___

### isRoot

▸ **isRoot**(): `boolean`

判断是否是根节点

#### Returns

`boolean`

#### Defined in

[packages/gl-core/src/tile/TileID.ts:227](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L227)

___

### neighbor

▸ **neighbor**(`hor`, `ver?`): [`TileID`](gl_core_src.TileID.md)

查找相临瓦片

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `hor` | `number` | `undefined` | 横向偏移 |
| `ver` | `number` | `0` | 纵向偏移 |

#### Returns

[`TileID`](gl_core_src.TileID.md)

#### Defined in

[packages/gl-core/src/tile/TileID.ts:194](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L194)

___

### overscaleFactor

▸ **overscaleFactor**(): `number`

#### Returns

`number`

#### Defined in

[packages/gl-core/src/tile/TileID.ts:124](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L124)

___

### parent

▸ **parent**(): [`TileID`](gl_core_src.TileID.md)

获取父级瓦片

#### Returns

[`TileID`](gl_core_src.TileID.md)

#### Defined in

[packages/gl-core/src/tile/TileID.ts:151](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L151)

___

### scaledTo

▸ **scaledTo**(`targetZ`): [`TileID`](gl_core_src.TileID.md)

缩放到目标层级

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetZ` | `number` |

#### Returns

[`TileID`](gl_core_src.TileID.md)

#### Defined in

[packages/gl-core/src/tile/TileID.ts:132](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L132)

___

### siblings

▸ **siblings**(): [`TileID`](gl_core_src.TileID.md)[]

查找兄弟瓦片

#### Returns

[`TileID`](gl_core_src.TileID.md)[]

#### Defined in

[packages/gl-core/src/tile/TileID.ts:181](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/TileID.ts#L181)
