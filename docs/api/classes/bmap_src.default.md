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

packages/bmap/src/index.ts:49

## Properties

### canvas

• `Private` **canvas**: ``null`` \| `HTMLCanvasElement`

#### Defined in

packages/bmap/src/index.ts:39

___

### context

• `Private` **context**: ``"2d"``

#### Defined in

packages/bmap/src/index.ts:41

___

### enableMassClear

• **enableMassClear**: `boolean`

#### Defined in

packages/bmap/src/index.ts:47

___

### field

• `Private` **field**: `undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

packages/bmap/src/index.ts:42

___

### map

• `Private` **map**: `any`

#### Defined in

packages/bmap/src/index.ts:43

___

### mixBlendMode

• `Private` **mixBlendMode**: `any`

#### Defined in

packages/bmap/src/index.ts:46

___

### options

• `Private` **options**: [`IWindOptions`](../interfaces/bmap_src.IWindOptions.md)

#### Defined in

packages/bmap/src/index.ts:38

___

### paneName

• `Private` **paneName**: `string`

#### Defined in

packages/bmap/src/index.ts:44

___

### wind

• `Private` **wind**: ``null`` \| `WindCore`

#### Defined in

packages/bmap/src/index.ts:40

___

### zIndex

• `Private` **zIndex**: `number`

#### Defined in

packages/bmap/src/index.ts:45

## Methods

### \_draw

▸ `Private` **_draw**(): `void`

#### Returns

`void`

#### Defined in

packages/bmap/src/index.ts:169

___

### adjustSize

▸ `Private` **adjustSize**(): `void`

#### Returns

`void`

#### Defined in

packages/bmap/src/index.ts:149

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

packages/bmap/src/index.ts:86

___

### bindEvent

▸ **bindEvent**(): `void`

#### Returns

`void`

#### Defined in

packages/bmap/src/index.ts:111

___

### draw

▸ **draw**(): `void`

#### Returns

`void`

#### Defined in

packages/bmap/src/index.ts:165

___

### getContainer

▸ **getContainer**(): ``null`` \| `HTMLCanvasElement`

#### Returns

``null`` \| `HTMLCanvasElement`

#### Defined in

packages/bmap/src/index.ts:227

___

### getContext

▸ `Private` **getContext**(): `undefined` \| ``null`` \| `CanvasRenderingContext2D`

get canvas context

#### Returns

`undefined` \| ``null`` \| `CanvasRenderingContext2D`

#### Defined in

packages/bmap/src/index.ts:222

___

### getData

▸ **getData**(): `undefined` \| [`Field`](maptalks_src.Field.md)

get wind layer data

#### Returns

`undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

packages/bmap/src/index.ts:336

___

### getParams

▸ **getParams**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

packages/bmap/src/index.ts:368

___

### getProjection

▸ `Private` **getProjection**(): `any`

#### Returns

`any`

#### Defined in

packages/bmap/src/index.ts:231

___

### getWindOptions

▸ **getWindOptions**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

packages/bmap/src/index.ts:385

___

### getZIndex

▸ **getZIndex**(): `number`

#### Returns

`number`

#### Defined in

packages/bmap/src/index.ts:410

___

### handleResize

▸ `Private` **handleResize**(): `void`

#### Returns

`void`

#### Defined in

packages/bmap/src/index.ts:106

___

### hide

▸ **hide**(): `void`

#### Returns

`void`

#### Defined in

packages/bmap/src/index.ts:397

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

packages/bmap/src/index.ts:94

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

packages/bmap/src/index.ts:316

___

### pickWindOptions

▸ `Private` **pickWindOptions**(): `void`

#### Returns

`void`

#### Defined in

packages/bmap/src/index.ts:321

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

packages/bmap/src/index.ts:303

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

packages/bmap/src/index.ts:271

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

packages/bmap/src/index.ts:189

___

### setData

▸ **setData**(`data`): [`default`](bmap_src.default.md)

set layer data

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

[`default`](bmap_src.default.md)

#### Defined in

packages/bmap/src/index.ts:345

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

packages/bmap/src/index.ts:373

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

packages/bmap/src/index.ts:403

___

### show

▸ **show**(): `void`

#### Returns

`void`

#### Defined in

packages/bmap/src/index.ts:389

___

### start

▸ **start**(): `void`

#### Returns

`void`

#### Defined in

packages/bmap/src/index.ts:137

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

packages/bmap/src/index.ts:143

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

packages/bmap/src/index.ts:257

___

### unbindEvent

▸ **unbindEvent**(): `void`

#### Returns

`void`

#### Defined in

packages/bmap/src/index.ts:124

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

packages/bmap/src/index.ts:310

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

packages/bmap/src/index.ts:362
