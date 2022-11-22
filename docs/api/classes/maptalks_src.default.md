---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [maptalks/src](../modules/maptalks_src.md) / default

# Class: default

[maptalks/src](../modules/maptalks_src.md).default

## Hierarchy

- `unknown`

  ↳ **`default`**

## Constructors

### constructor

• **new default**(`id`, `data`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` \| `number` |
| `data` | `any` |
| `options` | `any` |

#### Overrides

CanvasLayer.constructor

#### Defined in

packages/maptalks/src/index.ts:205

## Properties

### \_map

• `Private` **\_map**: `any`

#### Defined in

packages/maptalks/src/index.ts:202

___

### field

• `Private` **field**: `undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

packages/maptalks/src/index.ts:200

___

### options

• `Private` **options**: [`IWindOptions`](../interfaces/maptalks_src.IWindOptions.md)

#### Defined in

packages/maptalks/src/index.ts:203

## Methods

### \_getRenderer

▸ `Private` **_getRenderer**(): `any`

#### Returns

`any`

#### Defined in

packages/maptalks/src/index.ts:294

___

### draw

▸ **draw**(): [`default`](maptalks_src.default.md)

#### Returns

[`default`](maptalks_src.default.md)

#### Defined in

packages/maptalks/src/index.ts:279

___

### drawOnInteracting

▸ **drawOnInteracting**(): `void`

#### Returns

`void`

#### Defined in

packages/maptalks/src/index.ts:290

___

### getData

▸ **getData**(): `undefined` \| [`Field`](maptalks_src.Field.md)

get wind layer data

#### Returns

`undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

packages/maptalks/src/index.ts:235

___

### getWindOptions

▸ **getWindOptions**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

packages/maptalks/src/index.ts:275

___

### pickWindOptions

▸ `Private` **pickWindOptions**(): `void`

#### Returns

`void`

#### Defined in

packages/maptalks/src/index.ts:220

___

### prepareToDraw

▸ **prepareToDraw**(): `never`[]

#### Returns

`never`[]

#### Defined in

packages/maptalks/src/index.ts:286

___

### setData

▸ **setData**(`data`, `options?`): [`default`](maptalks_src.default.md)

set layer data

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `options` | `Partial`<`IField`\> |

#### Returns

[`default`](maptalks_src.default.md)

#### Defined in

packages/maptalks/src/index.ts:245

___

### setWindOptions

▸ **setWindOptions**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`IOptions`\> |

#### Returns

`void`

#### Defined in

packages/maptalks/src/index.ts:262
