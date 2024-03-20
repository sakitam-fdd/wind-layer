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

[packages/bmap/src/index.ts:44](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L44)

## Properties

### canvas

• `Private` **canvas**: ``null`` \| `HTMLCanvasElement`

#### Defined in

[packages/bmap/src/index.ts:34](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L34)

___

### context

• `Private` **context**: ``"2d"``

#### Defined in

[packages/bmap/src/index.ts:36](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L36)

___

### enableMassClear

• **enableMassClear**: `boolean`

#### Defined in

[packages/bmap/src/index.ts:42](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L42)

___

### field

• `Private` **field**: `undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

[packages/bmap/src/index.ts:37](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L37)

___

### map

• `Private` **map**: `any`

#### Defined in

[packages/bmap/src/index.ts:38](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L38)

___

### mixBlendMode

• `Private` **mixBlendMode**: `any`

#### Defined in

[packages/bmap/src/index.ts:41](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L41)

___

### options

• `Private` **options**: [`IWindOptions`](../interfaces/bmap_src.IWindOptions.md)

#### Defined in

[packages/bmap/src/index.ts:33](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L33)

___

### paneName

• `Private` **paneName**: `string`

#### Defined in

[packages/bmap/src/index.ts:39](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L39)

___

### wind

• `Private` **wind**: ``null`` \| [`WindCore`](maptalks_src.WindCore.md)

#### Defined in

[packages/bmap/src/index.ts:35](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L35)

___

### zIndex

• `Private` **zIndex**: `number`

#### Defined in

[packages/bmap/src/index.ts:40](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L40)

## Methods

### \_draw

▸ `Private` **_draw**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:164](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L164)

___

### adjustSize

▸ `Private` **adjustSize**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:144](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L144)

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

[packages/bmap/src/index.ts:81](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L81)

___

### bindEvent

▸ **bindEvent**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:106](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L106)

___

### draw

▸ **draw**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:160](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L160)

___

### getContainer

▸ **getContainer**(): ``null`` \| `HTMLCanvasElement`

#### Returns

``null`` \| `HTMLCanvasElement`

#### Defined in

[packages/bmap/src/index.ts:222](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L222)

___

### getContext

▸ `Private` **getContext**(): `undefined` \| ``null`` \| `CanvasRenderingContext2D`

get canvas context

#### Returns

`undefined` \| ``null`` \| `CanvasRenderingContext2D`

#### Defined in

[packages/bmap/src/index.ts:217](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L217)

___

### getData

▸ **getData**(): `undefined` \| [`Field`](maptalks_src.Field.md)

get wind layer data

#### Returns

`undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

[packages/bmap/src/index.ts:336](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L336)

___

### getParams

▸ **getParams**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

[packages/bmap/src/index.ts:369](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L369)

___

### getProjection

▸ `Private` **getProjection**(): `any`

#### Returns

`any`

#### Defined in

[packages/bmap/src/index.ts:226](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L226)

___

### getWindOptions

▸ **getWindOptions**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

[packages/bmap/src/index.ts:386](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L386)

___

### getZIndex

▸ **getZIndex**(): `number`

#### Returns

`number`

#### Defined in

[packages/bmap/src/index.ts:411](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L411)

___

### handleResize

▸ `Private` **handleResize**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:101](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L101)

___

### hide

▸ **hide**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:398](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L398)

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

[packages/bmap/src/index.ts:89](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L89)

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

[packages/bmap/src/index.ts:316](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L316)

___

### pickWindOptions

▸ `Private` **pickWindOptions**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:321](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L321)

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

[packages/bmap/src/index.ts:303](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L303)

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

[packages/bmap/src/index.ts:268](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L268)

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

[packages/bmap/src/index.ts:184](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L184)

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

[packages/bmap/src/index.ts:346](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L346)

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

[packages/bmap/src/index.ts:374](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L374)

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

[packages/bmap/src/index.ts:404](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L404)

___

### show

▸ **show**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:390](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L390)

___

### start

▸ **start**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:132](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L132)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:138](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L138)

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

[packages/bmap/src/index.ts:249](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L249)

___

### unbindEvent

▸ **unbindEvent**(): `void`

#### Returns

`void`

#### Defined in

[packages/bmap/src/index.ts:119](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L119)

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

[packages/bmap/src/index.ts:310](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L310)

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

[packages/bmap/src/index.ts:363](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/bmap/src/index.ts#L363)
