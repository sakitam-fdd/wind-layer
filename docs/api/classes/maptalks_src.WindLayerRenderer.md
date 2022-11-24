---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [maptalks/src](../modules/maptalks_src.md) / WindLayerRenderer

# Class: WindLayerRenderer

[maptalks/src](../modules/maptalks_src.md).WindLayerRenderer

## Hierarchy

- `unknown`

  ↳ **`WindLayerRenderer`**

## Implements

- [`IWindLayerRenderer`](../interfaces/maptalks_src.IWindLayerRenderer.md)

## Constructors

### constructor

• **new WindLayerRenderer**()

#### Inherited from

renderer.CanvasLayerRenderer.constructor

## Properties

### \_drawContext

• `Private` **\_drawContext**: `CanvasRenderingContext2D`

#### Defined in

[packages/maptalks/src/index.ts:32](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L32)

___

### canvas

• **canvas**: `undefined` \| `HTMLCanvasElement`

#### Defined in

[packages/maptalks/src/index.ts:33](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L33)

___

### context

• **context**: `CanvasRenderingContext2D`

#### Defined in

[packages/maptalks/src/index.ts:35](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L35)

___

### layer

• **layer**: `any`

#### Defined in

[packages/maptalks/src/index.ts:34](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L34)

___

### wind

• `Private` **wind**: `WindCore`

#### Defined in

[packages/maptalks/src/index.ts:36](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L36)

## Methods

### \_redraw

▸ **_redraw**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/index.ts:55](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L55)

___

### checkResources

▸ **checkResources**(): `never`[]

#### Returns

`never`[]

#### Defined in

[packages/maptalks/src/index.ts:37](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L37)

___

### completeRender

▸ **completeRender**(): `any`

#### Returns

`any`

#### Defined in

[packages/maptalks/src/index.ts:194](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L194)

___

### draw

▸ **draw**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/index.ts:49](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L49)

___

### drawOnInteracting

▸ **drawOnInteracting**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/index.ts:120](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L120)

___

### drawWind

▸ **drawWind**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/index.ts:60](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L60)

___

### getDrawParams

▸ **getDrawParams**(): `never`[]

#### Returns

`never`[]

#### Defined in

[packages/maptalks/src/index.ts:41](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L41)

___

### getMap

▸ **getMap**(): `any`

#### Returns

`any`

#### Defined in

[packages/maptalks/src/index.ts:177](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L177)

___

### hitDetect

▸ **hitDetect**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/maptalks/src/index.ts:45](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L45)

___

### intersectsCoordinate

▸ **intersectsCoordinate**(`coordinate`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinate` | [`number`, `number`] |

#### Returns

`boolean`

#### Defined in

[packages/maptalks/src/index.ts:105](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L105)

___

### onDragRotateEnd

▸ **onDragRotateEnd**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[packages/maptalks/src/index.ts:145](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L145)

___

### onDragRotateStart

▸ **onDragRotateStart**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[packages/maptalks/src/index.ts:138](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L138)

___

### onMoveEnd

▸ **onMoveEnd**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[packages/maptalks/src/index.ts:159](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L159)

___

### onMoveStart

▸ **onMoveStart**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[packages/maptalks/src/index.ts:152](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L152)

___

### onZoomEnd

▸ **onZoomEnd**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[packages/maptalks/src/index.ts:131](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L131)

___

### onZoomStart

▸ **onZoomStart**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[packages/maptalks/src/index.ts:124](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L124)

___

### prepareCanvas

▸ `Private` **prepareCanvas**(): `any`

#### Returns

`any`

#### Defined in

[packages/maptalks/src/index.ts:181](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L181)

___

### prepareDrawContext

▸ `Private` **prepareDrawContext**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/index.ts:186](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L186)

___

### prepareRender

▸ `Private` **prepareRender**(): `any`

#### Returns

`any`

#### Defined in

[packages/maptalks/src/index.ts:190](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L190)

___

### project

▸ **project**(`coordinate`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinate` | [`number`, `number`] |

#### Returns

[`number`, `number`]

#### Defined in

[packages/maptalks/src/index.ts:90](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L90)

___

### remove

▸ **remove**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/index.ts:168](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L168)

___

### unproject

▸ **unproject**(`pixel`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `pixel` | [`number`, `number`] |

#### Returns

[`number`, `number`]

#### Defined in

[packages/maptalks/src/index.ts:99](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/index.ts#L99)
