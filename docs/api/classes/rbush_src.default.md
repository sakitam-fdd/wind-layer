---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [rbush/src](../modules/rbush_src.md) / default

# Class: default

[rbush/src](../modules/rbush_src.md).default

## Constructors

### constructor

• **new default**(`maxEntries?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `maxEntries` | `number` | `9` |

#### Defined in

[packages/rbush/src/index.ts:156](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L156)

## Properties

### \_maxEntries

• `Private` `Readonly` **\_maxEntries**: `number`

#### Defined in

[packages/rbush/src/index.ts:151](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L151)

___

### \_minEntries

• `Private` `Readonly` **\_minEntries**: `number`

#### Defined in

[packages/rbush/src/index.ts:152](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L152)

___

### data

• **data**: [`NodeItem`](../interfaces/rbush_src.NodeItem.md)

#### Defined in

[packages/rbush/src/index.ts:154](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L154)

## Methods

### \_adjustParentBBoxes

▸ **_adjustParentBBoxes**(`bbox`, `path`, `level`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bbox` | [`BBoxLike`](../interfaces/rbush_src.BBoxLike.md) |
| `path` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md)[] |
| `level` | `number` |

#### Returns

`void`

#### Defined in

[packages/rbush/src/index.ts:551](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L551)

___

### \_all

▸ **_all**(`node`, `result?`): [`NodeItem`](../interfaces/rbush_src.NodeItem.md)[]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `node` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) | `undefined` |
| `result` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md)[] | `[]` |

#### Returns

[`NodeItem`](../interfaces/rbush_src.NodeItem.md)[]

#### Defined in

[packages/rbush/src/index.ts:333](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L333)

___

### \_allDistMargin

▸ **_allDistMargin**(`node`, `m`, `M`, `compare`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |
| `m` | `number` |
| `M` | `number` |
| `compare` | [`ICompare`](../modules/rbush_src.md#icompare) |

#### Returns

`number`

#### Defined in

[packages/rbush/src/index.ts:528](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L528)

___

### \_build

▸ **_build**(`items`, `left`, `right`, `h`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `items` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md)[] |
| `left` | `number` |
| `right` | `number` |
| `h` | `number` |

#### Returns

`any`

#### Defined in

[packages/rbush/src/index.ts:345](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L345)

___

### \_chooseSplitAxis

▸ **_chooseSplitAxis**(`node`, `m`, `M`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |
| `m` | `number` |
| `M` | `number` |

#### Returns

`void`

#### Defined in

[packages/rbush/src/index.ts:516](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L516)

___

### \_chooseSplitIndex

▸ **_chooseSplitIndex**(`node`, `m`, `M`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |
| `m` | `number` |
| `M` | `number` |

#### Returns

`any`

#### Defined in

[packages/rbush/src/index.ts:485](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L485)

___

### \_chooseSubtree

▸ **_chooseSubtree**(`bbox`, `n`, `level`, `path`): [`NodeItem`](../interfaces/rbush_src.NodeItem.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `bbox` | [`BBoxLike`](../interfaces/rbush_src.BBoxLike.md) |
| `n` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |
| `level` | `number` |
| `path` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md)[] |

#### Returns

[`NodeItem`](../interfaces/rbush_src.NodeItem.md)

#### Defined in

[packages/rbush/src/index.ts:395](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L395)

___

### \_condense

▸ **_condense**(`path`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md)[] |

#### Returns

`void`

#### Defined in

[packages/rbush/src/index.ts:558](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L558)

___

### \_insert

▸ **_insert**(`item`, `level`, `isNode?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |
| `level` | `number` |
| `isNode?` | `boolean` |

#### Returns

`void`

#### Defined in

[packages/rbush/src/index.ts:432](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L432)

___

### \_split

▸ **_split**(`insertPath`, `level`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `insertPath` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md)[] |
| `level` | `number` |

#### Returns

`void`

#### Defined in

[packages/rbush/src/index.ts:457](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L457)

___

### \_splitRoot

▸ **_splitRoot**(`node`, `newNode`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |
| `newNode` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |

#### Returns

`void`

#### Defined in

[packages/rbush/src/index.ts:477](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L477)

___

### all

▸ **all**(): [`NodeItem`](../interfaces/rbush_src.NodeItem.md)[]

#### Returns

[`NodeItem`](../interfaces/rbush_src.NodeItem.md)[]

#### Defined in

[packages/rbush/src/index.ts:163](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L163)

___

### clear

▸ **clear**(): [`default`](rbush_src.default.md)

#### Returns

[`default`](rbush_src.default.md)

#### Defined in

[packages/rbush/src/index.ts:258](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L258)

___

### collides

▸ **collides**(`bbox`, `options?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bbox` | [`BBoxLike`](../interfaces/rbush_src.BBoxLike.md) |
| `options?` | [`ICOptions`](../interfaces/rbush_src.ICOptions.md) |

#### Returns

`boolean`

#### Defined in

[packages/rbush/src/index.ts:195](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L195)

___

### compareMinX

▸ **compareMinX**(`a`, `b`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |
| `b` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |

#### Returns

`number`

#### Defined in

[packages/rbush/src/index.ts:317](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L317)

___

### compareMinY

▸ **compareMinY**(`a`, `b`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |
| `b` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |

#### Returns

`number`

#### Defined in

[packages/rbush/src/index.ts:320](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L320)

___

### fromJSON

▸ **fromJSON**(`data`): [`default`](rbush_src.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |

#### Returns

[`default`](rbush_src.default.md)

#### Defined in

[packages/rbush/src/index.ts:328](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L328)

___

### insert

▸ **insert**(`item?`): [`default`](rbush_src.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `item?` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |

#### Returns

[`default`](rbush_src.default.md)

#### Defined in

[packages/rbush/src/index.ts:253](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L253)

___

### load

▸ **load**(`data`): [`default`](rbush_src.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any`[] |

#### Returns

[`default`](rbush_src.default.md)

#### Defined in

[packages/rbush/src/index.ts:219](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L219)

___

### remove

▸ **remove**(`item?`, `equalsFn?`): [`default`](rbush_src.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `item?` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |
| `equalsFn?` | [`IEqualsFn`](../modules/rbush_src.md#iequalsfn) |

#### Returns

[`default`](rbush_src.default.md)

#### Defined in

[packages/rbush/src/index.ts:263](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L263)

___

### search

▸ **search**(`bbox`, `options?`): [`NodeItem`](../interfaces/rbush_src.NodeItem.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `bbox` | [`BBoxLike`](../interfaces/rbush_src.BBoxLike.md) |
| `options?` | [`ICOptions`](../interfaces/rbush_src.ICOptions.md) |

#### Returns

[`NodeItem`](../interfaces/rbush_src.NodeItem.md)[]

#### Defined in

[packages/rbush/src/index.ts:167](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L167)

___

### toBBox

▸ **toBBox**(`item`): [`BBoxLike`](../interfaces/rbush_src.BBoxLike.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |

#### Returns

[`BBoxLike`](../interfaces/rbush_src.BBoxLike.md)

#### Defined in

[packages/rbush/src/index.ts:313](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L313)

___

### toJSON

▸ **toJSON**(): [`NodeItem`](../interfaces/rbush_src.NodeItem.md)

#### Returns

[`NodeItem`](../interfaces/rbush_src.NodeItem.md)

#### Defined in

[packages/rbush/src/index.ts:324](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L324)
