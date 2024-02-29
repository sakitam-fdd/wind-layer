---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [gl-core/src](../modules/gl_core_src.md) / BaseLayerOptions

# Interface: BaseLayerOptions

[gl-core/src](../modules/gl_core_src.md).BaseLayerOptions

## Properties

### displayRange

• `Optional` **displayRange**: [`number`, `number`]

#### Defined in

[packages/gl-core/src/renderer/index.ts:86](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L86)

___

### flipY

• `Optional` **flipY**: `boolean`

#### Defined in

[packages/gl-core/src/renderer/index.ts:91](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L91)

___

### getExtent

• `Optional` **getExtent**: () => `number`[]

#### Type declaration

▸ (): `number`[]

##### Returns

`number`[]

#### Defined in

[packages/gl-core/src/renderer/index.ts:83](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L83)

___

### getGridTiles

• **getGridTiles**: (`tileSize`: `number`) => [`TileID`](../classes/gl_core_src.TileID.md)[]

#### Type declaration

▸ (`tileSize`): [`TileID`](../classes/gl_core_src.TileID.md)[]

这里我们 Mock 一个瓦片图层，用于获取视野内的所有可渲染瓦片，与getViewTiles不同的是
此方法不会限制层级，方便我们在大层级时也能合理采样

##### Parameters

| Name | Type |
| :------ | :------ |
| `tileSize` | `number` |

##### Returns

[`TileID`](../classes/gl_core_src.TileID.md)[]

#### Defined in

[packages/gl-core/src/renderer/index.ts:33](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L33)

___

### getPixelsToProjUnit

• **getPixelsToProjUnit**: () => [`number`, `number`]

#### Type declaration

▸ (): [`number`, `number`]

像素到投影坐标的转换关系

##### Returns

[`number`, `number`]

#### Defined in

[packages/gl-core/src/renderer/index.ts:49](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L49)

___

### getPixelsToUnits

• **getPixelsToUnits**: () => [`number`, `number`]

#### Type declaration

▸ (): [`number`, `number`]

获取当前视图下像素和投影的转换关系

##### Returns

[`number`, `number`]

#### Defined in

[packages/gl-core/src/renderer/index.ts:44](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L44)

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

[packages/gl-core/src/renderer/index.ts:39](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L39)

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

[packages/gl-core/src/renderer/index.ts:27](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L27)

___

### getZoom

• `Optional` **getZoom**: () => `number`

#### Type declaration

▸ (): `number`

##### Returns

`number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:82](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L82)

___

### glScale

• `Optional` **glScale**: () => `number`

#### Type declaration

▸ (): `number`

##### Returns

`number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:93](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L93)

___

### heightSegments

• `Optional` **heightSegments**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:88](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L88)

___

### mask

• `Optional` **mask**: `Object`

可以为任意 GeoJSON 数据

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `Attributes`[] |
| `type` | [`MaskType`](../enums/gl_core_src.MaskType.md) |

#### Defined in

[packages/gl-core/src/renderer/index.ts:102](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L102)

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

[packages/gl-core/src/renderer/index.ts:106](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L106)

___

### opacity

• `Optional` **opacity**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:84](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L84)

___

### picking

• `Optional` **picking**: `boolean`

是否开启拾取

#### Defined in

[packages/gl-core/src/renderer/index.ts:98](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L98)

___

### renderFrom

• `Optional` **renderFrom**: [`RenderFrom`](../enums/gl_core_src.RenderFrom.md)

指定渲染通道

#### Defined in

[packages/gl-core/src/renderer/index.ts:62](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L62)

___

### renderType

• **renderType**: [`RenderType`](../enums/gl_core_src.RenderType.md)

渲染类型
目前支持三种类型：
0：普通 raster 瓦片渲染
1：气象数据的色斑图渲染
2：风等 vector 数据的粒子渲染

#### Defined in

[packages/gl-core/src/renderer/index.ts:58](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L58)

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

#### Defined in

[packages/gl-core/src/renderer/index.ts:63](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L63)

___

### triggerRepaint

• `Optional` **triggerRepaint**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:85](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L85)

___

### widthSegments

• `Optional` **widthSegments**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:87](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L87)

___

### wireframe

• `Optional` **wireframe**: `boolean`

#### Defined in

[packages/gl-core/src/renderer/index.ts:89](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L89)
