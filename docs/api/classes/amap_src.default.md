---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [amap/src](../modules/amap_src.md) / default

# Class: default

[amap/src](../modules/amap_src.md).default

## Constructors

### constructor

• **new default**(`data`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `options` | `Partial`<[`IWindOptions`](../interfaces/amap_src.IWindOptions.md)\> |

#### Defined in

packages/amap/src/index.ts:49

## Properties

### canvas

• `Private` **canvas**: ``null`` \| `HTMLCanvasElement`

#### Defined in

packages/amap/src/index.ts:43

___

### context

• `Private` **context**: ``"2d"``

#### Defined in

packages/amap/src/index.ts:45

___

### field

• `Private` **field**: `undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

packages/amap/src/index.ts:46

___

### map

• `Private` **map**: `any`

#### Defined in

packages/amap/src/index.ts:47

___

### options

• `Private` **options**: [`IWindOptions`](../interfaces/amap_src.IWindOptions.md)

#### Defined in

packages/amap/src/index.ts:42

___

### wind

• `Private` **wind**: ``null`` \| `WindCore`

#### Defined in

packages/amap/src/index.ts:44

## Methods

### \_getBounds

▸ `Private` **_getBounds**(): `any`

fixed viewMode

#### Returns

`any`

#### Defined in

packages/amap/src/index.ts:225

___

### appendTo

▸ **appendTo**(`map`): `void`

append layer to map

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `any` |

#### Returns

`void`

#### Defined in

packages/amap/src/index.ts:83

___

### canvasFunction

▸ **canvasFunction**(): `HTMLCanvasElement`

canvas constructor

#### Returns

`HTMLCanvasElement`

#### Defined in

packages/amap/src/index.ts:196

___

### getCanvasLayer

▸ **getCanvasLayer**(): `void`

get canvas layer

#### Returns

`void`

#### Defined in

packages/amap/src/index.ts:148

___

### getContext

▸ `Private` **getContext**(): `undefined` \| ``null`` \| `CanvasRenderingContext2D`

get canvas context

#### Returns

`undefined` \| ``null`` \| `CanvasRenderingContext2D`

#### Defined in

packages/amap/src/index.ts:298

___

### getData

▸ **getData**(): `undefined` \| [`Field`](maptalks_src.Field.md)

get wind layer data

#### Returns

`undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

packages/amap/src/index.ts:318

___

### getParams

▸ **getParams**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

packages/amap/src/index.ts:350

___

### getWindOptions

▸ **getWindOptions**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

packages/amap/src/index.ts:367

___

### handleResize

▸ **handleResize**(): `void`

#### Returns

`void`

#### Defined in

packages/amap/src/index.ts:106

___

### init

▸ **init**(`map`): `void`

init windy layer

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `any` |

#### Returns

`void`

#### Defined in

packages/amap/src/index.ts:95

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

packages/amap/src/index.ts:288

___

### pickWindOptions

▸ `Private` **pickWindOptions**(): `void`

#### Returns

`void`

#### Defined in

packages/amap/src/index.ts:303

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

packages/amap/src/index.ts:267

___

### remove

▸ **remove**(): `void`

#### Returns

`void`

#### Defined in

packages/amap/src/index.ts:263

___

### removeLayer

▸ **removeLayer**(): `void`

remove layer

#### Returns

`void`

#### Defined in

packages/amap/src/index.ts:247

___

### render

▸ **render**(`canvas`): [`default`](amap_src.default.md)

render layer

#### Parameters

| Name | Type |
| :------ | :------ |
| `canvas` | `HTMLCanvasElement` |

#### Returns

[`default`](amap_src.default.md)

#### Defined in

packages/amap/src/index.ts:117

___

### setData

▸ **setData**(`data`): [`default`](amap_src.default.md)

set layer data

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

[`default`](amap_src.default.md)

#### Defined in

packages/amap/src/index.ts:327

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

packages/amap/src/index.ts:355

___

### unproject

▸ **unproject**(`pixel`): ``null`` \| [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `pixel` | [`number`, `number`] |

#### Returns

``null`` \| [`number`, `number`]

#### Defined in

packages/amap/src/index.ts:276

___

### updateParams

▸ **updateParams**(`options?`): [`default`](amap_src.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`IOptions`\> |

#### Returns

[`default`](amap_src.default.md)

#### Defined in

packages/amap/src/index.ts:344
