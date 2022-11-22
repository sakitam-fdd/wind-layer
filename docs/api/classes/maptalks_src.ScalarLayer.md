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

packages/maptalks/src/ScalarLayer.ts:334

## Properties

### \_map

• `Private` **\_map**: `any`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:331

___

### data

• `Private` **data**: `any`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:329

___

### options

• `Private` **options**: `any`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:332

## Methods

### \_getRenderer

▸ `Private` **_getRenderer**(): `any`

#### Returns

`any`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:415

___

### draw

▸ **draw**(): [`ScalarLayer`](maptalks_src.ScalarLayer.md)

#### Returns

[`ScalarLayer`](maptalks_src.ScalarLayer.md)

#### Defined in

packages/maptalks/src/ScalarLayer.ts:400

___

### drawOnInteracting

▸ **drawOnInteracting**(): `void`

#### Returns

`void`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:411

___

### getData

▸ **getData**(): `any`

get wind layer data

#### Returns

`any`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:356

___

### getOptions

▸ **getOptions**(): `any`

#### Returns

`any`

#### Defined in

packages/maptalks/src/ScalarLayer.ts:396

___

### prepareToDraw

▸ **prepareToDraw**(): `never`[]

#### Returns

`never`[]

#### Defined in

packages/maptalks/src/ScalarLayer.ts:407

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

packages/maptalks/src/ScalarLayer.ts:365

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

packages/maptalks/src/ScalarLayer.ts:383
