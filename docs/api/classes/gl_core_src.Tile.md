---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [gl-core/src](../modules/gl_core_src.md) / Tile

# Class: Tile

[gl-core/src](../modules/gl_core_src.md).Tile

这里是一个内部的瓦片实现，他主要是为了统各地图类库的瓦片相关操作
我们常规需要的是在某个地图类库下某个瓦片的 xyz 以及其对应投影下
的瓦片范围（常规情况使用世界坐标，部分类库可能直接使用像素位置并且在每一帧更新），
并且在此我们需要维护瓦片的状态。

## Constructors

### constructor

• **new Tile**(`tileID`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tileID` | [`TileID`](gl_core_src.TileID.md) |
| `options` | `TileOptions` |

#### Defined in

[packages/gl-core/src/tile/Tile.ts:81](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L81)

## Properties

### #textures

• `Private` **#textures**: `Map`<`number`, `Texture`<`TextureOptions`\>\>

#### Defined in

[packages/gl-core/src/tile/Tile.ts:75](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L75)

___

### aborted

• **aborted**: `boolean`

瓦片 是否取消请求

#### Defined in

[packages/gl-core/src/tile/Tile.ts:22](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L22)

___

### actor

• **actor**: `any`

worker 执行器

#### Defined in

[packages/gl-core/src/tile/Tile.ts:32](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L32)

___

### errorCount

• **errorCount**: `number` = `0`

瓦片加载失败的次数

#### Defined in

[packages/gl-core/src/tile/Tile.ts:47](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L47)

___

### geometries

• **geometries**: `Map`<`string`, `Geometry`\>

#### Defined in

[packages/gl-core/src/tile/Tile.ts:71](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L71)

___

### maxErrorCount

• **maxErrorCount**: `number` = `3`

允许的瓦片最大失败次数

#### Defined in

[packages/gl-core/src/tile/Tile.ts:52](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L52)

___

### reloadCallback

• **reloadCallback**: `any`

瓦片重加载回调

#### Defined in

[packages/gl-core/src/tile/Tile.ts:27](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L27)

___

### request

• **request**: `Map`<`string`, `any`\>

#### Defined in

[packages/gl-core/src/tile/Tile.ts:73](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L73)

___

### state

• **state**: [`TileState`](../enums/gl_core_src.TileState.md)

瓦片数据加载状态

#### Defined in

[packages/gl-core/src/tile/Tile.ts:42](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L42)

___

### tileBounds

• **tileBounds**: [`ProjTileBounds`](../interfaces/gl_core_src.ProjTileBounds.md)

瓦片的世界范围

#### Defined in

[packages/gl-core/src/tile/Tile.ts:57](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L57)

___

### tileID

• **tileID**: [`TileID`](gl_core_src.TileID.md)

瓦片 ID

#### Defined in

[packages/gl-core/src/tile/Tile.ts:37](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L37)

___

### tileMeshs

• **tileMeshs**: `Map`<`string`, `default`\>

#### Defined in

[packages/gl-core/src/tile/Tile.ts:69](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L69)

___

### tileSize

• **tileSize**: `number`

瓦片尺寸

#### Defined in

[packages/gl-core/src/tile/Tile.ts:62](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L62)

___

### uses

• **uses**: `number` = `0`

瓦片使用次数（在多个 render 共享 source 时，瓦片只能在为被任何渲染器使用时才能被销毁）

#### Defined in

[packages/gl-core/src/tile/Tile.ts:67](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L67)

## Accessors

### textures

• `get` **textures**(): `Map`<`number`, `Texture`<`TextureOptions`\>\>

#### Returns

`Map`<`number`, `Texture`<`TextureOptions`\>\>

#### Defined in

[packages/gl-core/src/tile/Tile.ts:120](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L120)

___

### tileCenter

• `get` **tileCenter**(): `number`[]

#### Returns

`number`[]

#### Defined in

[packages/gl-core/src/tile/Tile.ts:124](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L124)

## Methods

### copy

▸ **copy**(`tile`): [`Tile`](gl_core_src.Tile.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tile` | [`Tile`](gl_core_src.Tile.md) |

#### Returns

[`Tile`](gl_core_src.Tile.md)

#### Defined in

[packages/gl-core/src/tile/Tile.ts:295](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L295)

___

### createMesh

▸ **createMesh**(`passId`, `bbox`, `renderer`, `program`, `force?`): `undefined` \| `default`

创建 `TileMesh`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `passId` | `string` | 在多个 render pass 共享 tile 时我们可能需要针对多个 pass 创建渲染资源 在 mapbox 这种共享 gl 上下文的一般我们不需要重建，但是对于 maptalks 这种每个图层一个 gl 上下文的我们需要针对每个 gl上下文绑定资源 |
| `bbox` | [`ProjTileBounds`](../interfaces/gl_core_src.ProjTileBounds.md) |  |
| `renderer` | `Renderer` |  |
| `program` | `Program` |  |
| `force?` | `boolean` |  |

#### Returns

`undefined` \| `default`

#### Defined in

[packages/gl-core/src/tile/Tile.ts:199](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L199)

___

### destroy

▸ **destroy**(): `void`

释放瓦片资源

#### Returns

`void`

#### Defined in

[packages/gl-core/src/tile/Tile.ts:307](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L307)

___

### getBounds

▸ **getBounds**(): [`ProjTileBounds`](../interfaces/gl_core_src.ProjTileBounds.md)

获取瓦片世界坐标系下的范围

#### Returns

[`ProjTileBounds`](../interfaces/gl_core_src.ProjTileBounds.md)

#### Defined in

[packages/gl-core/src/tile/Tile.ts:291](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L291)

___

### getMesh

▸ **getMesh**(`passId`): `undefined` \| `default`

#### Parameters

| Name | Type |
| :------ | :------ |
| `passId` | `any` |

#### Returns

`undefined` \| `default`

#### Defined in

[packages/gl-core/src/tile/Tile.ts:116](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L116)

___

### hasData

▸ **hasData**(): `boolean`

瓦片是否已经加载到数据

#### Returns

`boolean`

#### Defined in

[packages/gl-core/src/tile/Tile.ts:94](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L94)

___

### isLoaded

▸ **isLoaded**(): `boolean`

瓦片是否加载完成

#### Returns

`boolean`

#### Defined in

[packages/gl-core/src/tile/Tile.ts:108](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L108)

___

### setTextures

▸ **setTextures**(`renderer`, `index`, `image`, `parseOptions`, `userData?`): `void`

创建纹理

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `Renderer` |
| `index` | `number` |
| `image` | `any` |
| `parseOptions` | [`ParseOptionsType`](../modules/gl_core_src.md#parseoptionstype) |
| `userData?` | `any` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/tile/Tile.ts:226](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L226)

___

### updateGeometry

▸ **updateGeometry**(`passId`, `bbox`, `renderer`, `force?`): `undefined` \| `Geometry`

更新瓦片顶点信息

#### Parameters

| Name | Type |
| :------ | :------ |
| `passId` | `string` |
| `bbox` | [`ProjTileBounds`](../interfaces/gl_core_src.ProjTileBounds.md) |
| `renderer` | `Renderer` |
| `force?` | `boolean` |

#### Returns

`undefined` \| `Geometry`

#### Defined in

[packages/gl-core/src/tile/Tile.ts:139](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L139)

___

### wasRequested

▸ **wasRequested**(): `boolean`

瓦片是否已经请求过

#### Returns

`boolean`

#### Defined in

[packages/gl-core/src/tile/Tile.ts:101](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/tile/Tile.ts#L101)
