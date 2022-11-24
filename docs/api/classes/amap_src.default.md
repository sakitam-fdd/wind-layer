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

[packages/amap/src/index.ts:50](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L50)

## Properties

### canvas

• `Private` **canvas**: ``null`` \| `HTMLCanvasElement`

#### Defined in

[packages/amap/src/index.ts:44](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L44)

___

### context

• `Private` **context**: ``"2d"``

#### Defined in

[packages/amap/src/index.ts:46](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L46)

___

### field

• `Private` **field**: `undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

[packages/amap/src/index.ts:47](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L47)

___

### map

• `Private` **map**: `any`

#### Defined in

[packages/amap/src/index.ts:48](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L48)

___

### options

• `Private` **options**: [`IWindOptions`](../interfaces/amap_src.IWindOptions.md)

#### Defined in

[packages/amap/src/index.ts:43](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L43)

___

### wind

• `Private` **wind**: ``null`` \| `WindCore`

#### Defined in

[packages/amap/src/index.ts:45](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L45)

## Methods

### \_getBounds

▸ `Private` **_getBounds**(): `any`

fixed viewMode

#### Returns

`any`

#### Defined in

[packages/amap/src/index.ts:226](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L226)

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

[packages/amap/src/index.ts:84](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L84)

___

### canvasFunction

▸ **canvasFunction**(): `HTMLCanvasElement`

canvas constructor

#### Returns

`HTMLCanvasElement`

#### Defined in

[packages/amap/src/index.ts:197](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L197)

___

### getCanvasLayer

▸ **getCanvasLayer**(): `void`

get canvas layer

#### Returns

`void`

#### Defined in

[packages/amap/src/index.ts:149](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L149)

___

### getContext

▸ `Private` **getContext**(): `undefined` \| ``null`` \| `CanvasRenderingContext2D`

get canvas context

#### Returns

`undefined` \| ``null`` \| `CanvasRenderingContext2D`

#### Defined in

[packages/amap/src/index.ts:299](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L299)

___

### getData

▸ **getData**(): `undefined` \| [`Field`](maptalks_src.Field.md)

get wind layer data

#### Returns

`undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

[packages/amap/src/index.ts:319](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L319)

___

### getParams

▸ **getParams**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

[packages/amap/src/index.ts:352](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L352)

___

### getWindOptions

▸ **getWindOptions**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

[packages/amap/src/index.ts:369](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L369)

___

### handleResize

▸ **handleResize**(): `void`

#### Returns

`void`

#### Defined in

[packages/amap/src/index.ts:107](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L107)

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

[packages/amap/src/index.ts:96](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L96)

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

[packages/amap/src/index.ts:289](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L289)

___

### pickWindOptions

▸ `Private` **pickWindOptions**(): `void`

#### Returns

`void`

#### Defined in

[packages/amap/src/index.ts:304](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L304)

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

[packages/amap/src/index.ts:268](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L268)

___

### remove

▸ **remove**(): `void`

#### Returns

`void`

#### Defined in

[packages/amap/src/index.ts:264](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L264)

___

### removeLayer

▸ **removeLayer**(): `void`

remove layer

#### Returns

`void`

#### Defined in

[packages/amap/src/index.ts:248](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L248)

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

[packages/amap/src/index.ts:118](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L118)

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

[packages/amap/src/index.ts:329](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L329)

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

[packages/amap/src/index.ts:357](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L357)

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

[packages/amap/src/index.ts:277](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L277)

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

[packages/amap/src/index.ts:346](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/amap/src/index.ts#L346)
