---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [maplibre-gl/src](../modules/maplibre_gl_src.md) / Layer

# Class: Layer

[maplibre-gl/src](../modules/maplibre_gl_src.md).Layer

## Constructors

### constructor

• **new Layer**(`id`, `source`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `source` | `SourceType` |
| `options?` | `LayerOptions` |

#### Defined in

[packages/maplibre-gl/src/layer.ts:31](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L31)

## Properties

### gl

• **gl**: ``null`` \| `WebGLRenderingContext` \| `WebGL2RenderingContext`

#### Defined in

[packages/maplibre-gl/src/layer.ts:18](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L18)

___

### id

• **id**: `string`

#### Defined in

[packages/maplibre-gl/src/layer.ts:20](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L20)

___

### layer

• `Private` **layer**: `WithNull`<`BaseLayer`\>

#### Defined in

[packages/maplibre-gl/src/layer.ts:29](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L29)

___

### map

• **map**: `WithNull`<`Map`\>

#### Defined in

[packages/maplibre-gl/src/layer.ts:19](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L19)

___

### options

• `Private` **options**: `any`

#### Defined in

[packages/maplibre-gl/src/layer.ts:27](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L27)

___

### planeCamera

• **planeCamera**: `OrthographicCamera`

#### Defined in

[packages/maplibre-gl/src/layer.ts:25](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L25)

___

### renderer

• **renderer**: `Renderer`

#### Defined in

[packages/maplibre-gl/src/layer.ts:26](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L26)

___

### renderingMode

• **renderingMode**: ``"2d"`` \| ``"3d"``

#### Defined in

[packages/maplibre-gl/src/layer.ts:22](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L22)

___

### scene

• **scene**: `Scene`

#### Defined in

[packages/maplibre-gl/src/layer.ts:24](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L24)

___

### source

• `Private` **source**: `SourceType`

#### Defined in

[packages/maplibre-gl/src/layer.ts:28](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L28)

___

### sync

• **sync**: `default`

#### Defined in

[packages/maplibre-gl/src/layer.ts:23](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L23)

___

### type

• **type**: `string`

#### Defined in

[packages/maplibre-gl/src/layer.ts:21](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L21)

## Accessors

### camera

• `get` **camera**(): `PerspectiveCamera` \| `OrthographicCamera`

#### Returns

`PerspectiveCamera` \| `OrthographicCamera`

#### Defined in

[packages/maplibre-gl/src/layer.ts:48](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L48)

## Methods

### calcWrappedWorlds

▸ **calcWrappedWorlds**(): `number`[]

#### Returns

`number`[]

#### Defined in

[packages/maplibre-gl/src/layer.ts:407](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L407)

___

### getMask

▸ **getMask**(): `any`

#### Returns

`any`

#### Defined in

[packages/maplibre-gl/src/layer.ts:99](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L99)

___

### handleResize

▸ **handleResize**(): `void`

#### Returns

`void`

#### Defined in

[packages/maplibre-gl/src/layer.ts:71](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L71)

___

### handleZoom

▸ **handleZoom**(): `void`

#### Returns

`void`

#### Defined in

[packages/maplibre-gl/src/layer.ts:83](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L83)

___

### moveEnd

▸ **moveEnd**(): `void`

#### Returns

`void`

#### Defined in

[packages/maplibre-gl/src/layer.ts:65](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L65)

___

### moveStart

▸ **moveStart**(): `void`

#### Returns

`void`

#### Defined in

[packages/maplibre-gl/src/layer.ts:59](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L59)

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

[packages/maplibre-gl/src/layer.ts:178](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L178)

___

### onRemove

▸ **onRemove**(): `void`

#### Returns

`void`

#### Defined in

[packages/maplibre-gl/src/layer.ts:436](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L436)

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

[packages/maplibre-gl/src/layer.ts:463](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L463)

___

### prerender

▸ **prerender**(): `void`

#### Returns

`void`

#### Defined in

[packages/maplibre-gl/src/layer.ts:451](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L451)

___

### processMask

▸ `Private` **processMask**(): `undefined` \| { `data`: `Attributes`[] ; `type`: `any` = mask.type }

#### Returns

`undefined` \| { `data`: `Attributes`[] ; `type`: `any` = mask.type }

#### Defined in

[packages/maplibre-gl/src/layer.ts:103](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L103)

___

### render

▸ **render**(): `void`

#### Returns

`void`

#### Defined in

[packages/maplibre-gl/src/layer.ts:476](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L476)

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

[packages/maplibre-gl/src/layer.ts:170](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L170)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Defined in

[packages/maplibre-gl/src/layer.ts:52](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L52)

___

### updateOptions

▸ **updateOptions**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`LayerOptions`\> |

#### Returns

`void`

#### Defined in

[packages/maplibre-gl/src/layer.ts:89](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maplibre-gl/src/layer.ts#L89)
