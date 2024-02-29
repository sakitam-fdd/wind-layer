---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [maptalks/src](../modules/maptalks_src.md) / TileID

# Class: TileID

[maptalks/src](../modules/maptalks_src.md).TileID

## Constructors

### constructor

• **new TileID**(`overscaledZ`, `wrap`, `z`, `x`, `y`, `options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `overscaledZ` | `number` | 扩大的 z 值 |
| `wrap` | `undefined` \| `number` | 所处世界 |
| `z` | `number` | 层级 |
| `x` | `number` | 列 |
| `y` | `number` | 行 |
| `options?` | `TileIDOptions` | 瓦片其他配置 |

#### Defined in

packages/gl-core/dist/index.d.ts:279

## Properties

### dep

• **dep**: `any`

挂载的其他数据

#### Defined in

packages/gl-core/dist/index.d.ts:270

___

### options

• **options**: `TileIDOptions`

#### Defined in

packages/gl-core/dist/index.d.ts:266

___

### overscaledZ

• **overscaledZ**: `number`

放大后的 zoom 值

#### Defined in

packages/gl-core/dist/index.d.ts:249

___

### projTileBounds

• **projTileBounds**: `ProjTileBounds`

投影后的瓦片范围

#### Defined in

packages/gl-core/dist/index.d.ts:265

___

### tileBounds

• **tileBounds**: `Bounds`

瓦片范围（每次获取时计算）

#### Defined in

packages/gl-core/dist/index.d.ts:261

___

### tileKey

• **tileKey**: `string`

瓦片唯一标识

#### Defined in

packages/gl-core/dist/index.d.ts:253

___

### unWrappedTileKey

• **unWrappedTileKey**: `string`

不包含跨世界的瓦片标识（因为多个世界的瓦片如果仅仅是 `wrap` 不同，他们对应的数据资源是完全相同的）

#### Defined in

packages/gl-core/dist/index.d.ts:257

___

### wrap

• **wrap**: `number`

所在世界（如果是多世界的话）

#### Defined in

packages/gl-core/dist/index.d.ts:245

___

### wrapedX

• **wrapedX**: `number`

跨世界后的瓦片列

#### Defined in

packages/gl-core/dist/index.d.ts:229

___

### wrapedY

• **wrapedY**: `number`

跨世界后的瓦片行（目前仅 maptalks 支持）

#### Defined in

packages/gl-core/dist/index.d.ts:237

___

### x

• **x**: `number`

瓦片列

#### Defined in

packages/gl-core/dist/index.d.ts:225

___

### y

• **y**: `number`

瓦片行

#### Defined in

packages/gl-core/dist/index.d.ts:233

___

### z

• **z**: `number`

瓦片层级

#### Defined in

packages/gl-core/dist/index.d.ts:241

## Methods

### children

▸ **children**(`sourceMaxZoom`): [`TileID`](maptalks_src.TileID.md)[]

查找当前瓦片的子瓦片

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceMaxZoom` | `number` |

#### Returns

[`TileID`](maptalks_src.TileID.md)[]

#### Defined in

packages/gl-core/dist/index.d.ts:302

___

### getTileBounds

▸ **getTileBounds**(`tileID?`): `Bounds`

获取瓦片范围

#### Parameters

| Name | Type |
| :------ | :------ |
| `tileID?` | [`TileID`](maptalks_src.TileID.md) |

#### Returns

`Bounds`

#### Defined in

packages/gl-core/dist/index.d.ts:283

___

### getTileProjBounds

▸ **getTileProjBounds**(`tileID?`, `force?`): `ProjTileBounds`

获取瓦片投影后的范围

#### Parameters

| Name | Type |
| :------ | :------ |
| `tileID?` | [`TileID`](maptalks_src.TileID.md) |
| `force?` | `boolean` |

#### Returns

`ProjTileBounds`

#### Defined in

packages/gl-core/dist/index.d.ts:287

___

### isEqual

▸ **isEqual**(`tile`): `boolean`

判断瓦片是否相同
一般我们认为只要 xyz 和所处世界 wrap 相同就确认相同（即 tileKey 相同）

#### Parameters

| Name | Type |
| :------ | :------ |
| `tile` | [`TileID`](maptalks_src.TileID.md) |

#### Returns

`boolean`

#### Defined in

packages/gl-core/dist/index.d.ts:318

___

### isRoot

▸ **isRoot**(): `boolean`

判断是否是根节点

#### Returns

`boolean`

#### Defined in

packages/gl-core/dist/index.d.ts:323

___

### neighbor

▸ **neighbor**(`hor`, `ver?`): [`TileID`](maptalks_src.TileID.md)

查找相临瓦片

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hor` | `number` | 横向偏移 |
| `ver?` | `number` | 纵向偏移 |

#### Returns

[`TileID`](maptalks_src.TileID.md)

#### Defined in

packages/gl-core/dist/index.d.ts:312

___

### overscaleFactor

▸ **overscaleFactor**(): `number`

#### Returns

`number`

#### Defined in

packages/gl-core/dist/index.d.ts:288

___

### parent

▸ **parent**(): [`TileID`](maptalks_src.TileID.md)

获取父级瓦片

#### Returns

[`TileID`](maptalks_src.TileID.md)

#### Defined in

packages/gl-core/dist/index.d.ts:297

___

### scaledTo

▸ **scaledTo**(`targetZ`): [`TileID`](maptalks_src.TileID.md)

缩放到目标层级

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetZ` | `number` |

#### Returns

[`TileID`](maptalks_src.TileID.md)

#### Defined in

packages/gl-core/dist/index.d.ts:293

___

### siblings

▸ **siblings**(): [`TileID`](maptalks_src.TileID.md)[]

查找兄弟瓦片

#### Returns

[`TileID`](maptalks_src.TileID.md)[]

#### Defined in

packages/gl-core/dist/index.d.ts:306
