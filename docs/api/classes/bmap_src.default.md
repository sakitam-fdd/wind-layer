---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [bmap/src](../modules/bmap_src.md) / default

# Class: default

[bmap/src](../modules/bmap_src.md).default

## Hierarchy

- `any`

  ↳ **`default`**

## Constructors

### constructor

• **new default**(`data`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `options` | `Partial`<[`IWindOptions`](../interfaces/bmap_src.IWindOptions.md)\> |

#### Overrides

BMap.Overlay.constructor

#### Defined in

[packages/bmap/src/index.ts:50](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L50)

## Properties

### canvas

• `Private` **canvas**: ``null`` \| `HTMLCanvasElement`

#### Defined in

[packages/bmap/src/index.ts:40](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L40)

___

### context

• `Private` **context**: ``"2d"``

#### Defined in

[packages/bmap/src/index.ts:42](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L42)

___

### enableMassClear

• **enableMassClear**: `boolean`

#### Defined in

[packages/bmap/src/index.ts:48](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L48)

___

### field

• `Private` **field**: `undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

[packages/bmap/src/index.ts:43](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L43)

___

### map

• `Private` **map**: `any`

#### Defined in

[packages/bmap/src/index.ts:44](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L44)

___

### mixBlendMode

• `Private` **mixBlendMode**: `any`

#### Defined in

[packages/bmap/src/index.ts:47](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L47)

___

### options

• `Private` **options**: [`IWindOptions`](../interfaces/bmap_src.IWindOptions.md)

#### Defined in

[packages/bmap/src/index.ts:39](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L39)

___

### paneName

• `Private` **paneName**: `string`

#### Defined in

[packages/bmap/src/index.ts:45](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L45)

___

### wind

• `Private` **wind**: ``null`` \| [`WindCore`](maptalks_src.WindCore.md)

#### Defined in

[packages/bmap/src/index.ts:41](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L41)

___

### zIndex

• `Private` **zIndex**: `number`

#### Defined in

[packages/bmap/src/index.ts:46](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L46)

## Methods

### \_draw

▸ `Private` **_draw**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:170](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L170)

___

### adjustSize

▸ `Private` **adjustSize**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:150](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L150)

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

[packages/bmap/src/index.ts:87](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L87)

___

### bindEvent

▸ **bindEvent**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:112](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L112)

___

### draw

▸ **draw**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:166](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L166)

___

### getContainer

▸ **getContainer**(): ``null`` \| `HTMLCanvasElement`

#### Returns

``null`` \| `HTMLCanvasElement`

#### Defined in

[packages/bmap/src/index.ts:228](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L228)

___

### getContext

▸ `Private` **getContext**(): `undefined` \| ``null`` \| `CanvasRenderingContext2D`

get canvas context

#### Returns

`undefined` \| ``null`` \| `CanvasRenderingContext2D`

#### Defined in

[packages/bmap/src/index.ts:223](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L223)

___

### getData

▸ **getData**(): `undefined` \| [`Field`](maptalks_src.Field.md)

get wind layer data

#### Returns

`undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

[packages/bmap/src/index.ts:337](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L337)

___

### getParams

▸ **getParams**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

[packages/bmap/src/index.ts:370](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L370)

___

### getProjection

▸ `Private` **getProjection**(): `any`

#### Returns

`any`

#### Defined in

[packages/bmap/src/index.ts:232](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L232)

___

### getWindOptions

▸ **getWindOptions**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

[packages/bmap/src/index.ts:387](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L387)

___

### getZIndex

▸ **getZIndex**(): `number`

#### Returns

`number`

#### Defined in

[packages/bmap/src/index.ts:412](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L412)

___

### handleResize

▸ `Private` **handleResize**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:107](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L107)

___

### hide

▸ **hide**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:399](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L399)

___

### initialize

▸ **initialize**(`map`): `HTMLCanvasElement`

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `any` |

#### Returns

`HTMLCanvasElement`

#### Defined in

[packages/bmap/src/index.ts:95](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L95)

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

[packages/bmap/src/index.ts:317](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L317)

___

### pickWindOptions

▸ `Private` **pickWindOptions**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:322](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L322)

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

[packages/bmap/src/index.ts:304](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L304)

___

### projectInner

▸ `Private` **projectInner**(`coordinate`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinate` | [`number`, `number`] |

#### Returns

[`number`, `number`]

#### Defined in

[packages/bmap/src/index.ts:272](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L272)

___

### render

▸ **render**(`canvas`): [`default`](bmap_src.default.md)

render windy layer

#### Parameters

| Name | Type |
| :------ | :------ |
| `canvas` | `HTMLCanvasElement` |

#### Returns

[`default`](bmap_src.default.md)

#### Defined in

[packages/bmap/src/index.ts:190](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L190)

___

### setData

▸ **setData**(`data`, `options?`): [`default`](bmap_src.default.md)

set layer data

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `options` | `Partial`<`IField`\> |

#### Returns

[`default`](bmap_src.default.md)

#### Defined in

[packages/bmap/src/index.ts:347](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L347)

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

[packages/bmap/src/index.ts:375](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L375)

___

### setZIndex

▸ **setZIndex**(`zIndex`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `zIndex` | `number` |

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:405](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L405)

___

### show

▸ **show**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:391](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L391)

___

### start

▸ **start**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:138](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L138)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:144](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L144)

___

### transferToMercator

▸ **transferToMercator**(`coordinates`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinates` | [`number`, `number`] |

#### Returns

[`number`, `number`]

#### Defined in

[packages/bmap/src/index.ts:258](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L258)

___

### unbindEvent

▸ **unbindEvent**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:125](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L125)

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

[packages/bmap/src/index.ts:311](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L311)

___

### updateParams

▸ **updateParams**(`options?`): [`default`](bmap_src.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`IOptions`\> |

#### Returns

[`default`](bmap_src.default.md)

#### Defined in

[packages/bmap/src/index.ts:364](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/bmap/src/index.ts#L364)
