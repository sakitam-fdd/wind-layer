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

[packages/maptalks/src/layer.ts:270](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L270)

## Properties

### \_coordCache

• **\_coordCache**: `Object` = `{}`

#### Defined in

[packages/maptalks/src/layer.ts:265](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L265)

___

### \_needsUpdate

• **\_needsUpdate**: `boolean` = `true`

#### Defined in

[packages/maptalks/src/layer.ts:264](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L264)

___

### layer

• **layer**: `WithNull`<`BaseLayer`\>

#### Defined in

[packages/maptalks/src/layer.ts:266](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L266)

___

### projWorldWidth

• `Private` **projWorldWidth**: `number`

#### Defined in

[packages/maptalks/src/layer.ts:268](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L268)

___

### source

• `Private` **source**: `SourceType`

#### Defined in

[packages/maptalks/src/layer.ts:267](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L267)

___

### type

• **type**: `string`

#### Defined in

[packages/maptalks/src/layer.ts:263](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L263)

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

[packages/maptalks/src/layer.ts:427](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L427)

___

### clear

▸ **clear**(): [`Layer`](maptalks_src.Layer.md)

#### Returns

[`Layer`](maptalks_src.Layer.md)

#### Defined in

[packages/maptalks/src/layer.ts:765](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L765)

___

### clearObject

▸ **clearObject**(): [`Layer`](maptalks_src.Layer.md)

#### Returns

[`Layer`](maptalks_src.Layer.md)

#### Defined in

[packages/maptalks/src/layer.ts:769](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L769)

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

[packages/maptalks/src/layer.ts:742](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L742)

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

[packages/maptalks/src/layer.ts:746](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L746)

___

### getCamera

▸ **getCamera**(): `WithNull`<`PerspectiveCamera` \| `OrthographicCamera`\>

#### Returns

`WithNull`<`PerspectiveCamera` \| `OrthographicCamera`\>

#### Defined in

[packages/maptalks/src/layer.ts:783](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L783)

___

### getClipMask

▸ **getClipMask**(): `any`

#### Returns

`any`

#### Defined in

[packages/maptalks/src/layer.ts:445](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L445)

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

[packages/maptalks/src/layer.ts:838](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L838)

___

### getObjects

▸ **getObjects**(): `any`[]

#### Returns

`any`[]

#### Defined in

[packages/maptalks/src/layer.ts:750](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L750)

___

### getScene

▸ **getScene**(): `WithNull`<`Scene`\>

#### Returns

`WithNull`<`Scene`\>

#### Defined in

[packages/maptalks/src/layer.ts:791](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L791)

___

### getWorlds

▸ **getWorlds**(): { `offset`: `number` ; `world`: `number` ; `xmax`: `number` ; `xmin`: `number`  }[]

#### Returns

{ `offset`: `number` ; `world`: `number` ; `xmax`: `number` ; `xmin`: `number`  }[]

#### Defined in

[packages/maptalks/src/layer.ts:365](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L365)

___

### isRendering

▸ **isRendering**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/maptalks/src/layer.ts:734](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L734)

___

### onAdd

▸ **onAdd**(): [`Layer`](maptalks_src.Layer.md)

#### Returns

[`Layer`](maptalks_src.Layer.md)

#### Defined in

[packages/maptalks/src/layer.ts:812](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L812)

___

### onDragRotateEnd

▸ **onDragRotateEnd**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:334](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L334)

___

### onDragRotateStart

▸ **onDragRotateStart**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:328](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L328)

___

### onMoveEnd

▸ **onMoveEnd**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:321](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L321)

___

### onMoveStart

▸ **onMoveStart**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:310](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L310)

___

### onMoving

▸ **onMoving**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:317](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L317)

___

### onRemove

▸ **onRemove**(): [`Layer`](maptalks_src.Layer.md)

#### Returns

[`Layer`](maptalks_src.Layer.md)

#### Defined in

[packages/maptalks/src/layer.ts:824](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L824)

___

### onResize

▸ **onResize**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:340](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L340)

___

### onZoomEnd

▸ **onZoomEnd**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:355](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L355)

___

### onZoomStart

▸ **onZoomStart**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:344](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L344)

___

### onZooming

▸ **onZooming**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:348](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L348)

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

[packages/maptalks/src/layer.ts:527](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L527)

___

### processMask

▸ `Private` **processMask**(): `undefined` \| { `data`: `Attributes`[] ; `type`: `any` = mask.type }

#### Returns

`undefined` \| { `data`: `Attributes`[] ; `type`: `any` = mask.type }

#### Defined in

[packages/maptalks/src/layer.ts:449](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L449)

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

[packages/maptalks/src/layer.ts:799](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L799)

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

[packages/maptalks/src/layer.ts:518](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L518)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/layer.ts:359](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/maptalks/src/layer.ts#L359)
