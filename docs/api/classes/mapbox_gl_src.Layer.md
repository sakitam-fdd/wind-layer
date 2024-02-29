---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [mapbox-gl/src](../modules/mapbox_gl_src.md) / Layer

# Class: Layer

[mapbox-gl/src](../modules/mapbox_gl_src.md).Layer

## Constructors

### constructor

• **new Layer**(`id`, `source`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `source` | `SourceType` |
| `options?` | `ILayerOptions` |

#### Defined in

[packages/mapbox-gl/src/layer.ts:33](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L33)

## Properties

### gl

• **gl**: ``null`` \| `WebGLRenderingContext` \| `WebGL2RenderingContext`

#### Defined in

[packages/mapbox-gl/src/layer.ts:20](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L20)

___

### id

• **id**: `string`

#### Defined in

[packages/mapbox-gl/src/layer.ts:22](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L22)

___

### layer

• `Private` **layer**: `WithNull`<`BaseLayer`\>

#### Defined in

[packages/mapbox-gl/src/layer.ts:31](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L31)

___

### map

• **map**: `WithNull`<`Map`\>

#### Defined in

[packages/mapbox-gl/src/layer.ts:21](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L21)

___

### options

• `Private` **options**: `any`

#### Defined in

[packages/mapbox-gl/src/layer.ts:29](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L29)

___

### planeCamera

• **planeCamera**: `OrthographicCamera`

#### Defined in

[packages/mapbox-gl/src/layer.ts:27](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L27)

___

### renderer

• **renderer**: `Renderer`

#### Defined in

[packages/mapbox-gl/src/layer.ts:28](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L28)

___

### renderingMode

• **renderingMode**: ``"2d"`` \| ``"3d"``

#### Defined in

[packages/mapbox-gl/src/layer.ts:24](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L24)

___

### scene

• **scene**: `Scene`

#### Defined in

[packages/mapbox-gl/src/layer.ts:26](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L26)

___

### source

• `Private` **source**: `SourceType`

#### Defined in

[packages/mapbox-gl/src/layer.ts:30](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L30)

___

### sync

• **sync**: `default`

#### Defined in

[packages/mapbox-gl/src/layer.ts:25](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L25)

___

### type

• **type**: `string`

#### Defined in

[packages/mapbox-gl/src/layer.ts:23](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L23)

## Accessors

### camera

• `get` **camera**(): `PerspectiveCamera` \| `OrthographicCamera`

#### Returns

`PerspectiveCamera` \| `OrthographicCamera`

#### Defined in

[packages/mapbox-gl/src/layer.ts:50](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L50)

## Methods

### calcWrappedWorlds

▸ **calcWrappedWorlds**(): `number`[]

#### Returns

`number`[]

#### Defined in

[packages/mapbox-gl/src/layer.ts:399](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L399)

___

### getMask

▸ **getMask**(): `any`

#### Returns

`any`

#### Defined in

[packages/mapbox-gl/src/layer.ts:101](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L101)

___

### handleResize

▸ **handleResize**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/layer.ts:73](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L73)

___

### handleZoom

▸ **handleZoom**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/layer.ts:85](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L85)

___

### moveEnd

▸ **moveEnd**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/layer.ts:67](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L67)

___

### moveStart

▸ **moveStart**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/layer.ts:61](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L61)

___

### onAdd

▸ **onAdd**(`m`, `gl`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `m` | `Map` |
| `gl` | `WebGLRenderingContext` |

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/layer.ts:180](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L180)

___

### onRemove

▸ **onRemove**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/layer.ts:428](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L428)

___

### picker

▸ **picker**(`coordinates`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinates` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/mapbox-gl/src/layer.ts:455](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L455)

___

### prerender

▸ **prerender**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/layer.ts:443](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L443)

___

### processMask

▸ `Private` **processMask**(): `undefined` \| { `data`: `Attributes`[] ; `type`: `any` = mask.type }

#### Returns

`undefined` \| { `data`: `Attributes`[] ; `type`: `any` = mask.type }

#### Defined in

[packages/mapbox-gl/src/layer.ts:105](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L105)

___

### render

▸ **render**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/layer.ts:468](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L468)

___

### setMask

▸ **setMask**(`mask`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mask` | `any` |

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/layer.ts:172](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L172)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/layer.ts:54](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L54)

___

### updateOptions

▸ **updateOptions**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`ILayerOptions`\> |

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/layer.ts:91](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/mapbox-gl/src/layer.ts#L91)
