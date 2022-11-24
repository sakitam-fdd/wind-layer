---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [maptalks/src](../modules/maptalks_src.md) / ScalarLayer

# Class: ScalarLayer

[maptalks/src](../modules/maptalks_src.md).ScalarLayer

## Hierarchy

- `unknown`

  ↳ **`ScalarLayer`**

## Constructors

### constructor

• **new ScalarLayer**(`id`, `data`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` \| `number` |
| `data` | `any` |
| `options?` | `Partial`<`IScalarFillOptions`\> |

#### Overrides

CanvasLayer.constructor

#### Defined in

[packages/maptalks/src/ScalarLayer.ts:334](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/ScalarLayer.ts#L334)

## Properties

### \_map

• `Private` **\_map**: `any`

#### Defined in

[packages/maptalks/src/ScalarLayer.ts:331](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/ScalarLayer.ts#L331)

___

### data

• `Private` **data**: `any`

#### Defined in

[packages/maptalks/src/ScalarLayer.ts:329](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/ScalarLayer.ts#L329)

___

### options

• `Private` **options**: `any`

#### Defined in

[packages/maptalks/src/ScalarLayer.ts:332](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/ScalarLayer.ts#L332)

## Methods

### \_getRenderer

▸ `Private` **_getRenderer**(): `any`

#### Returns

`any`

#### Defined in

[packages/maptalks/src/ScalarLayer.ts:415](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/ScalarLayer.ts#L415)

___

### draw

▸ **draw**(): [`ScalarLayer`](maptalks_src.ScalarLayer.md)

#### Returns

[`ScalarLayer`](maptalks_src.ScalarLayer.md)

#### Defined in

[packages/maptalks/src/ScalarLayer.ts:400](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/ScalarLayer.ts#L400)

___

### drawOnInteracting

▸ **drawOnInteracting**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/ScalarLayer.ts:411](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/ScalarLayer.ts#L411)

___

### getData

▸ **getData**(): `any`

get wind layer data

#### Returns

`any`

#### Defined in

[packages/maptalks/src/ScalarLayer.ts:356](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/ScalarLayer.ts#L356)

___

### getOptions

▸ **getOptions**(): `any`

#### Returns

`any`

#### Defined in

[packages/maptalks/src/ScalarLayer.ts:396](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/ScalarLayer.ts#L396)

___

### prepareToDraw

▸ **prepareToDraw**(): `never`[]

#### Returns

`never`[]

#### Defined in

[packages/maptalks/src/ScalarLayer.ts:407](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/ScalarLayer.ts#L407)

___

### setData

▸ **setData**(`data`): `Promise`<`unknown`\>

set layer data

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[packages/maptalks/src/ScalarLayer.ts:365](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/ScalarLayer.ts#L365)

___

### setOptions

▸ **setOptions**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `any` |

#### Returns

`void`

#### Defined in

[packages/maptalks/src/ScalarLayer.ts:383](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/maptalks/src/ScalarLayer.ts#L383)
