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

[packages/amap/src/index.ts:53](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L53)

## Properties

### canvas

• `Private` **canvas**: ``null`` \| `HTMLCanvasElement`

#### Defined in

[packages/amap/src/index.ts:47](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L47)

___

### context

• `Private` **context**: ``"2d"``

#### Defined in

[packages/amap/src/index.ts:49](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L49)

___

### field

• `Private` **field**: `undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

[packages/amap/src/index.ts:50](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L50)

___

### map

• `Private` **map**: `any`

#### Defined in

[packages/amap/src/index.ts:51](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L51)

___

### options

• `Private` **options**: [`IWindOptions`](../interfaces/amap_src.IWindOptions.md)

#### Defined in

[packages/amap/src/index.ts:46](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L46)

___

### wind

• `Private` **wind**: ``null`` \| [`WindCore`](maptalks_src.WindCore.md)

#### Defined in

[packages/amap/src/index.ts:48](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L48)

## Methods

### \_getBounds

▸ `Private` **_getBounds**(): `any`

fixed viewMode

#### Returns

`any`

#### Defined in

[packages/amap/src/index.ts:228](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L228)

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

[packages/amap/src/index.ts:87](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L87)

___

### canvasFunction

▸ **canvasFunction**(): `HTMLCanvasElement`

canvas constructor

#### Returns

`HTMLCanvasElement`

#### Defined in

[packages/amap/src/index.ts:199](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L199)

___

### getCanvasLayer

▸ **getCanvasLayer**(): `void`

get canvas layer

#### Returns

`void`

#### Defined in

[packages/amap/src/index.ts:152](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L152)

___

### getContext

▸ `Private` **getContext**(): `undefined` \| ``null`` \| `CanvasRenderingContext2D`

get canvas context

#### Returns

`undefined` \| ``null`` \| `CanvasRenderingContext2D`

#### Defined in

[packages/amap/src/index.ts:298](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L298)

___

### getData

▸ **getData**(): `undefined` \| [`Field`](maptalks_src.Field.md)

get wind layer data

#### Returns

`undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

[packages/amap/src/index.ts:318](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L318)

___

### getParams

▸ **getParams**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

[packages/amap/src/index.ts:351](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L351)

___

### getWindOptions

▸ **getWindOptions**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

[packages/amap/src/index.ts:368](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L368)

___

### handleResize

▸ **handleResize**(): `void`

#### Returns

`void`

#### Defined in

[packages/amap/src/index.ts:110](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L110)

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

[packages/amap/src/index.ts:99](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L99)

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

[packages/amap/src/index.ts:288](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L288)

___

### pickWindOptions

▸ `Private` **pickWindOptions**(): `void`

#### Returns

`void`

#### Defined in

[packages/amap/src/index.ts:303](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L303)

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

[packages/amap/src/index.ts:273](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L273)

___

### remove

▸ **remove**(): `void`

#### Returns

`void`

#### Defined in

[packages/amap/src/index.ts:269](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L269)

___

### removeLayer

▸ **removeLayer**(): `void`

remove layer

#### Returns

`void`

#### Defined in

[packages/amap/src/index.ts:253](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L253)

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

[packages/amap/src/index.ts:121](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L121)

___

### setData

▸ **setData**(`data`, `options?`): [`default`](amap_src.default.md)

set layer data

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `options` | `Partial`<`IField`\> |

#### Returns

[`default`](amap_src.default.md)

#### Defined in

[packages/amap/src/index.ts:328](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L328)

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

[packages/amap/src/index.ts:356](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L356)

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

[packages/amap/src/index.ts:279](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L279)

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

[packages/amap/src/index.ts:345](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/amap/src/index.ts#L345)
