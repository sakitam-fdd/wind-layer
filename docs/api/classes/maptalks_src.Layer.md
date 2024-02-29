---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [maptalks/src](../modules/maptalks_src.md) / Layer

# Class: Layer

[maptalks/src](../modules/maptalks_src.md).Layer

## Hierarchy

- `any`

  ↳ **`Layer`**

## Constructors

### constructor

• **new Layer**(`id`, `source`, `opts`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `source` | `SourceType` |
| `opts` | `BaseLayerOptionType` |

#### Overrides

maptalks.TileLayer.constructor

#### Defined in

[packages/maptalks/src/layer.ts:261](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L261)

## Properties

### \_coordCache

• **\_coordCache**: `Object` = `{}`

#### Defined in

[packages/maptalks/src/layer.ts:256](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L256)

___

### \_needsUpdate

• **\_needsUpdate**: `boolean` = `true`

#### Defined in

[packages/maptalks/src/layer.ts:255](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L255)

___

### layer

• **layer**: `WithNull`<`BaseLayer`\>

#### Defined in

[packages/maptalks/src/layer.ts:257](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L257)

___

### projWorldWidth

• `Private` **projWorldWidth**: `number`

#### Defined in

[packages/maptalks/src/layer.ts:259](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L259)

___

### source

• `Private` **source**: `SourceType`

#### Defined in

[packages/maptalks/src/layer.ts:258](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L258)

___

### type

• **type**: `string`

#### Defined in

[packages/maptalks/src/layer.ts:254](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L254)

## Methods

### calcWitchWorld

▸ **calcWitchWorld**(`center`, `worlds`): `undefined` \| `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `center` | `number`[] |
| `worlds` | { `offset`: `number` ; `world`: `number` ; `xmax`: `number` ; `xmin`: `number`  }[] |

#### Returns

`undefined` \| `number`

#### Defined in

[packages/maptalks/src/layer.ts:389](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L389)

___

### clear

▸ **clear**(): [`Layer`](maptalks_src.Layer.md)

#### Returns

[`Layer`](maptalks_src.Layer.md)

#### Defined in

[packages/maptalks/src/layer.ts:678](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L678)

___

### clearObject

▸ **clearObject**(): [`Layer`](maptalks_src.Layer.md)

#### Returns

[`Layer`](maptalks_src.Layer.md)

#### Defined in

[packages/maptalks/src/layer.ts:682](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L682)

___

### draw

▸ **draw**(`gl`, `view`, `scene`, `camera`, `timeStamp`, `context`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `any` |
| `view` | `any` |
| `scene` | `any` |
| `camera` | `any` |
| `timeStamp` | `any` |
| `context` | `any` |

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:655](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L655)

___

### drawOnInteracting

▸ **drawOnInteracting**(`gl`, `view`, `scene`, `camera`, `event`, `timeStamp`, `context`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `any` |
| `view` | `any` |
| `scene` | `any` |
| `camera` | `any` |
| `event` | `any` |
| `timeStamp` | `any` |
| `context` | `any` |

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:659](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L659)

___

### getCamera

▸ **getCamera**(): `WithNull`<`PerspectiveCamera` \| `OrthographicCamera`\>

#### Returns

`WithNull`<`PerspectiveCamera` \| `OrthographicCamera`\>

#### Defined in

[packages/maptalks/src/layer.ts:696](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L696)

___

### getClipMask

▸ **getClipMask**(): `any`

#### Returns

`any`

#### Defined in

[packages/maptalks/src/layer.ts:407](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L407)

___

### getEvents

▸ **getEvents**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `_dragrotateend` | () => `void` |
| `_dragrotatestart` | () => `void` |
| `_moveend` | () => `void` |
| `_movestart` | () => `void` |
| `_moving` | () => `void` |
| `_resize` | () => `void` |
| `_zoomend` | () => `void` |
| `_zooming` | () => `void` |
| `_zoomstart` | () => `void` |

#### Defined in

[packages/maptalks/src/layer.ts:749](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L749)

___

### getObjects

▸ **getObjects**(): `any`[]

#### Returns

`any`[]

#### Defined in

[packages/maptalks/src/layer.ts:663](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L663)

___

### getScene

▸ **getScene**(): `WithNull`<`Scene`\>

#### Returns

`WithNull`<`Scene`\>

#### Defined in

[packages/maptalks/src/layer.ts:704](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L704)

___

### getWorlds

▸ **getWorlds**(): { `offset`: `number` ; `world`: `number` ; `xmax`: `number` ; `xmin`: `number`  }[]

#### Returns

{ `offset`: `number` ; `world`: `number` ; `xmax`: `number` ; `xmin`: `number`  }[]

#### Defined in

[packages/maptalks/src/layer.ts:327](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L327)

___

### isRendering

▸ **isRendering**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/maptalks/src/layer.ts:647](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L647)

___

### onAdd

▸ **onAdd**(): [`Layer`](maptalks_src.Layer.md)

#### Returns

[`Layer`](maptalks_src.Layer.md)

#### Defined in

[packages/maptalks/src/layer.ts:725](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L725)

___

### onDragRotateEnd

▸ **onDragRotateEnd**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:296](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L296)

___

### onDragRotateStart

▸ **onDragRotateStart**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:290](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L290)

___

### onMoveEnd

▸ **onMoveEnd**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:283](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L283)

___

### onMoveStart

▸ **onMoveStart**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:272](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L272)

___

### onMoving

▸ **onMoving**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:279](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L279)

___

### onRemove

▸ **onRemove**(): [`Layer`](maptalks_src.Layer.md)

#### Returns

[`Layer`](maptalks_src.Layer.md)

#### Defined in

[packages/maptalks/src/layer.ts:735](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L735)

___

### onResize

▸ **onResize**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:302](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L302)

___

### onZoomEnd

▸ **onZoomEnd**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:317](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L317)

___

### onZoomStart

▸ **onZoomStart**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:306](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L306)

___

### onZooming

▸ **onZooming**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:310](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L310)

___

### prepareToDraw

▸ **prepareToDraw**(`gl`, `scene`): `undefined` \| ``false``

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `any` |
| `scene` | `any` |

#### Returns

`undefined` \| ``false``

#### Defined in

[packages/maptalks/src/layer.ts:488](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L488)

___

### processMask

▸ `Private` **processMask**(): `undefined` \| { `data`: `Attributes`[] ; `type`: `any` = mask.type }

#### Returns

`undefined` \| { `data`: `Attributes`[] ; `type`: `any` = mask.type }

#### Defined in

[packages/maptalks/src/layer.ts:411](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L411)

___

### renderScene

▸ **renderScene**(`context?`, `layer?`): [`Layer`](maptalks_src.Layer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `context?` | `any` |
| `layer?` | `any` |

#### Returns

[`Layer`](maptalks_src.Layer.md)

#### Defined in

[packages/maptalks/src/layer.ts:712](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L712)

___

### setClipMask

▸ **setClipMask**(`mask`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mask` | `any` |

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:480](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L480)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:321](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/layer.ts#L321)
