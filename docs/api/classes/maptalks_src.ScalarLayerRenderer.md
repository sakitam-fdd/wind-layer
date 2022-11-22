---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [maptalks/src](../modules/maptalks_src.md) / ScalarLayerRenderer

# Class: ScalarLayerRenderer

[maptalks/src](../modules/maptalks_src.md).ScalarLayerRenderer

## Hierarchy

- `unknown`

  ↳ **`ScalarLayerRenderer`**

## Constructors

### constructor

• **new ScalarLayerRenderer**()

#### Inherited from

renderer.CanvasLayerRenderer.constructor

## Properties

### \_drawContext

• `Private` **\_drawContext**: `CanvasRenderingContext2D`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:60

___

### canvas

• **canvas**: `undefined` \| `HTMLCanvasElement`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:58

___

### gl

• `Private` **gl**: ``null`` \| `WebGLRenderingContext`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:61

___

### layer

• **layer**: `any`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:59

___

### scalarRender

• **scalarRender**: `ScalarFill`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:57

## Methods

### \_redraw

▸ **_redraw**(): `void`

#### Returns

`void`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:81

___

### checkResources

▸ **checkResources**(): `never`[]

#### Returns

`never`[]

#### Defined in

packages/maptalks/src/ScalarLayer.ts:63

___

### clearCanvas

▸ **clearCanvas**(): `void`

#### Returns

`void`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:86

___

### completeRender

▸ **completeRender**(): `any`

#### Returns

`any`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:311

___

### createContext

▸ **createContext**(): `void`

#### Returns

`void`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:92

___

### draw

▸ **draw**(): `void`

#### Returns

`void`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:75

___

### drawOnInteracting

▸ **drawOnInteracting**(): `void`

#### Returns

`void`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:271

___

### drawWind

▸ **drawWind**(): `void`

#### Returns

`void`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:130

___

### getDrawParams

▸ **getDrawParams**(): `never`[]

#### Returns

`never`[]

#### Defined in

packages/maptalks/src/ScalarLayer.ts:67

___

### getMap

▸ **getMap**(): `any`

#### Returns

`any`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:307

___

### getMatrix

▸ **getMatrix**(): `number`[]

#### Returns

`number`[]

#### Defined in

packages/maptalks/src/ScalarLayer.ts:114

___

### getWrappedWorlds

▸ **getWrappedWorlds**(): `number`[]

#### Returns

`number`[]

#### Defined in

packages/maptalks/src/ScalarLayer.ts:207

___

### handleZoom

▸ **handleZoom**(): `void`

#### Returns

`void`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:124

___

### hitDetect

▸ **hitDetect**(): `boolean`

#### Returns

`boolean`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:71

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

packages/maptalks/src/ScalarLayer.ts:287

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

packages/maptalks/src/ScalarLayer.ts:283

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

packages/maptalks/src/ScalarLayer.ts:295

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

packages/maptalks/src/ScalarLayer.ts:291

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

packages/maptalks/src/ScalarLayer.ts:279

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

packages/maptalks/src/ScalarLayer.ts:275

___

### prepareCanvas

▸ `Private` **prepareCanvas**(): `any`

#### Returns

`any`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:315

___

### prepareDrawContext

▸ `Private` **prepareDrawContext**(): `void`

#### Returns

`void`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:319

___

### prepareRender

▸ `Private` **prepareRender**(): `any`

#### Returns

`any`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:323

___

### remove

▸ **remove**(): `void`

#### Returns

`void`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:301

___

### resizeCanvas

▸ **resizeCanvas**(`canvasSize?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `canvasSize?` | `any` |

#### Returns

`void`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:101
