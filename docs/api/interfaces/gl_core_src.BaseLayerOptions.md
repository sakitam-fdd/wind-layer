---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [gl-core/src](../modules/gl_core_src.md) / BaseLayerOptions

# Interface: BaseLayerOptions

[gl-core/src](../modules/gl_core_src.md).BaseLayerOptions

## Hierarchy

- [`UserOptions`](gl_core_src.UserOptions.md)

  ↳ **`BaseLayerOptions`**

## Properties

### displayRange

• `Optional` **displayRange**: [`number`, `number`]

#### Inherited from

[UserOptions](gl_core_src.UserOptions.md).[displayRange](gl_core_src.UserOptions.md#displayrange)

#### Defined in

[packages/gl-core/src/renderer/index.ts:65](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L65)

___

### flipY

• `Optional` **flipY**: `boolean`

#### Overrides

[UserOptions](gl_core_src.UserOptions.md).[flipY](gl_core_src.UserOptions.md#flipy)

#### Defined in

[packages/gl-core/src/renderer/index.ts:116](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L116)

___

### getExtent

• `Optional` **getExtent**: () => `number`[]

#### Type declaration

▸ (): `number`[]

##### Returns

`number`[]

#### Defined in

[packages/gl-core/src/renderer/index.ts:114](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L114)

___

### getGridTiles

• **getGridTiles**: (`source`: [`SourceType`](../modules/gl_core_src.md#sourcetype)) => [`TileID`](../classes/gl_core_src.TileID.md)[]

#### Type declaration

▸ (`source`): [`TileID`](../classes/gl_core_src.TileID.md)[]

这里我们 Mock 一个瓦片图层，用于获取视野内的所有可渲染瓦片，与getViewTiles不同的是
此方法不会限制层级，方便我们在大层级时也能合理采样

##### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`SourceType`](../modules/gl_core_src.md#sourcetype) |

##### Returns

[`TileID`](../classes/gl_core_src.TileID.md)[]

#### Defined in

[packages/gl-core/src/renderer/index.ts:95](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L95)

___

### getPixelsToProjUnit

• **getPixelsToProjUnit**: () => [`number`, `number`]

#### Type declaration

▸ (): [`number`, `number`]

像素到投影坐标的转换关系

##### Returns

[`number`, `number`]

#### Defined in

[packages/gl-core/src/renderer/index.ts:111](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L111)

___

### getPixelsToUnits

• **getPixelsToUnits**: () => [`number`, `number`]

#### Type declaration

▸ (): [`number`, `number`]

获取当前视图下像素和投影的转换关系

##### Returns

[`number`, `number`]

#### Defined in

[packages/gl-core/src/renderer/index.ts:106](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L106)

___

### getTileProjSize

• **getTileProjSize**: (`z`: `number`, `tiles`: [`TileID`](../classes/gl_core_src.TileID.md)[]) => [`number`, `number`]

#### Type declaration

▸ (`z`, `tiles`): [`number`, `number`]

获取某层级下瓦片的投影宽高

##### Parameters

| Name | Type |
| :------ | :------ |
| `z` | `number` |
| `tiles` | [`TileID`](../classes/gl_core_src.TileID.md)[] |

##### Returns

[`number`, `number`]

#### Defined in

[packages/gl-core/src/renderer/index.ts:101](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L101)

___

### getViewTiles

• **getViewTiles**: (`data`: `any`, `renderType`: [`RenderType`](../enums/gl_core_src.RenderType.md)) => [`TileID`](../classes/gl_core_src.TileID.md)[]

#### Type declaration

▸ (`data`, `renderType`): [`TileID`](../classes/gl_core_src.TileID.md)[]

获取当前视野内的瓦片

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `renderType` | [`RenderType`](../enums/gl_core_src.RenderType.md) |

##### Returns

[`TileID`](../classes/gl_core_src.TileID.md)[]

#### Defined in

[packages/gl-core/src/renderer/index.ts:89](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L89)

___

### getZoom

• `Optional` **getZoom**: () => `number`

#### Type declaration

▸ (): `number`

##### Returns

`number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:113](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L113)

___

### glScale

• `Optional` **glScale**: () => `number`

#### Type declaration

▸ (): `number`

##### Returns

`number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:118](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L118)

___

### heightSegments

• `Optional` **heightSegments**: `number`

#### Inherited from

[UserOptions](gl_core_src.UserOptions.md).[heightSegments](gl_core_src.UserOptions.md#heightsegments)

#### Defined in

[packages/gl-core/src/renderer/index.ts:67](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L67)

___

### mask

• `Optional` **mask**: `Object`

可以为任意 GeoJSON 数据

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `Attributes`[] |
| `type` | [`MaskType`](../enums/gl_core_src.MaskType.md) |

#### Inherited from

[UserOptions](gl_core_src.UserOptions.md).[mask](gl_core_src.UserOptions.md#mask)

#### Defined in

[packages/gl-core/src/renderer/index.ts:79](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L79)

___

### onInit

• `Optional` **onInit**: (`error`: `any`, `data`: `any`) => `void`

#### Type declaration

▸ (`error`, `data`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `any` |
| `data` | `any` |

##### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:120](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L120)

___

### picking

• `Optional` **picking**: `boolean`

是否开启拾取

#### Inherited from

[UserOptions](gl_core_src.UserOptions.md).[picking](gl_core_src.UserOptions.md#picking)

#### Defined in

[packages/gl-core/src/renderer/index.ts:75](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L75)

___

### renderFrom

• `Optional` **renderFrom**: [`RenderFrom`](../enums/gl_core_src.RenderFrom.md)

指定渲染通道

#### Inherited from

[UserOptions](gl_core_src.UserOptions.md).[renderFrom](gl_core_src.UserOptions.md#renderfrom)

#### Defined in

[packages/gl-core/src/renderer/index.ts:44](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L44)

___

### renderType

• **renderType**: [`RenderType`](../enums/gl_core_src.RenderType.md)

渲染类型
目前支持三种类型：
0：普通 raster 瓦片渲染
1：气象数据的色斑图渲染
2：风等 vector 数据的粒子渲染

#### Inherited from

[UserOptions](gl_core_src.UserOptions.md).[renderType](gl_core_src.UserOptions.md#rendertype)

#### Defined in

[packages/gl-core/src/renderer/index.ts:40](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L40)

___

### styleSpec

• `Optional` **styleSpec**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `dropRate?` | `number` \| `any`[] | - |
| `dropRateBump?` | `number` \| `any`[] | - |
| `fadeOpacity?` | `number` \| `any`[] | - |
| `fill-color?` | `any`[] | - |
| `numParticles?` | `number` \| `any`[] | - |
| `opacity?` | `number` \| `any`[] | - |
| `size?` | [`number`, `number`] | arrow size |
| `space?` | `number` \| `any`[] | arrow space |
| `speedFactor?` | `number` \| `any`[] | - |

#### Inherited from

[UserOptions](gl_core_src.UserOptions.md).[styleSpec](gl_core_src.UserOptions.md#stylespec)

#### Defined in

[packages/gl-core/src/renderer/index.ts:45](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L45)

___

### triggerRepaint

• `Optional` **triggerRepaint**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:115](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L115)

___

### widthSegments

• `Optional` **widthSegments**: `number`

#### Inherited from

[UserOptions](gl_core_src.UserOptions.md).[widthSegments](gl_core_src.UserOptions.md#widthsegments)

#### Defined in

[packages/gl-core/src/renderer/index.ts:66](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L66)

___

### wireframe

• `Optional` **wireframe**: `boolean`

#### Inherited from

[UserOptions](gl_core_src.UserOptions.md).[wireframe](gl_core_src.UserOptions.md#wireframe)

#### Defined in

[packages/gl-core/src/renderer/index.ts:68](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L68)

___

### zoomScale

• `Optional` **zoomScale**: () => `number`

#### Type declaration

▸ (): `number`

##### Returns

`number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:119](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L119)
