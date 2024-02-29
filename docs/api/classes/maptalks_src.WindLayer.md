---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [maptalks/src](../modules/maptalks_src.md) / WindLayer

# Class: WindLayer

[maptalks/src](../modules/maptalks_src.md).WindLayer

## Hierarchy

- `"maptalks"`

  ↳ **`WindLayer`**

## Constructors

### constructor

• **new WindLayer**(`id`, `data`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` \| `number` |
| `data` | `any` |
| `options` | `any` |

#### Overrides

CanvasLayer.constructor

#### Defined in

[packages/maptalks/src/Canvas.ts:192](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/Canvas.ts#L192)

## Properties

### \_map

• `Private` **\_map**: `any`

#### Defined in

[packages/maptalks/src/Canvas.ts:189](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/Canvas.ts#L189)

___

### field

• `Private` **field**: `undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

[packages/maptalks/src/Canvas.ts:187](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/Canvas.ts#L187)

___

### options

• `Private` **options**: `IWindOptions`

#### Defined in

[packages/maptalks/src/Canvas.ts:190](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/Canvas.ts#L190)

## Methods

### \_getRenderer

▸ `Private` **_getRenderer**(): `any`

#### Returns

`any`

#### Defined in

[packages/maptalks/src/Canvas.ts:281](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/Canvas.ts#L281)

___

### draw

▸ **draw**(): [`WindLayer`](maptalks_src.WindLayer.md)

#### Returns

[`WindLayer`](maptalks_src.WindLayer.md)

#### Defined in

[packages/maptalks/src/Canvas.ts:266](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/Canvas.ts#L266)

___

### drawOnInteracting

▸ **drawOnInteracting**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/Canvas.ts:277](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/Canvas.ts#L277)

___

### getData

▸ **getData**(): `undefined` \| [`Field`](maptalks_src.Field.md)

get wind layer data

#### Returns

`undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

[packages/maptalks/src/Canvas.ts:222](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/Canvas.ts#L222)

___

### getWindOptions

▸ **getWindOptions**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

[packages/maptalks/src/Canvas.ts:262](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/Canvas.ts#L262)

___

### pickWindOptions

▸ `Private` **pickWindOptions**(): `void`

#### Returns

`void`

#### Defined in

[packages/maptalks/src/Canvas.ts:207](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/Canvas.ts#L207)

___

### prepareToDraw

▸ **prepareToDraw**(): `never`[]

#### Returns

`never`[]

#### Defined in

[packages/maptalks/src/Canvas.ts:273](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/Canvas.ts#L273)

___

### setData

▸ **setData**(`data`, `options?`): [`WindLayer`](maptalks_src.WindLayer.md)

set layer data

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `options` | `Partial`<`IField`\> |

#### Returns

[`WindLayer`](maptalks_src.WindLayer.md)

#### Defined in

[packages/maptalks/src/Canvas.ts:232](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/Canvas.ts#L232)

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

[packages/maptalks/src/Canvas.ts:249](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/maptalks/src/Canvas.ts#L249)
