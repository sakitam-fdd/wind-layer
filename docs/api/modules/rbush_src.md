---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / rbush/src

# Module: rbush/src

## Classes

- [default](../classes/rbush_src.default.md)

## Interfaces

- [BBoxLike](../interfaces/rbush_src.BBoxLike.md)
- [ICOptions](../interfaces/rbush_src.ICOptions.md)
- [NodeItem](../interfaces/rbush_src.NodeItem.md)

## Type Aliases

### ICompare

Ƭ **ICompare**: (`a`: [`NodeItem`](../interfaces/rbush_src.NodeItem.md), `b`: [`NodeItem`](../interfaces/rbush_src.NodeItem.md)) => `number`

#### Type declaration

▸ (`a`, `b`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |
| `b` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |

##### Returns

`number`

#### Defined in

[packages/rbush/src/index.ts:25](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L25)

___

### IContainsFn

Ƭ **IContainsFn**: (`a`: [`BBoxLike`](../interfaces/rbush_src.BBoxLike.md), `b`: [`BBoxLike`](../interfaces/rbush_src.BBoxLike.md)) => `boolean`

#### Type declaration

▸ (`a`, `b`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`BBoxLike`](../interfaces/rbush_src.BBoxLike.md) |
| `b` | [`BBoxLike`](../interfaces/rbush_src.BBoxLike.md) |

##### Returns

`boolean`

#### Defined in

[packages/rbush/src/index.ts:23](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L23)

___

### IEqualsFn

Ƭ **IEqualsFn**: (`a`: [`NodeItem`](../interfaces/rbush_src.NodeItem.md), `b`: [`NodeItem`](../interfaces/rbush_src.NodeItem.md)) => `boolean`

#### Type declaration

▸ (`a`, `b`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |
| `b` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |

##### Returns

`boolean`

#### Defined in

[packages/rbush/src/index.ts:22](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L22)

___

### IIntersectsFn

Ƭ **IIntersectsFn**: (`a`: [`BBoxLike`](../interfaces/rbush_src.BBoxLike.md), `b`: [`BBoxLike`](../interfaces/rbush_src.BBoxLike.md)) => `boolean`

#### Type declaration

▸ (`a`, `b`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`BBoxLike`](../interfaces/rbush_src.BBoxLike.md) |
| `b` | [`BBoxLike`](../interfaces/rbush_src.BBoxLike.md) |

##### Returns

`boolean`

#### Defined in

[packages/rbush/src/index.ts:24](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L24)

___

### IToBBox

Ƭ **IToBBox**: (`item`: [`NodeItem`](../interfaces/rbush_src.NodeItem.md)) => [`BBoxLike`](../interfaces/rbush_src.BBoxLike.md)

#### Type declaration

▸ (`item`): [`BBoxLike`](../interfaces/rbush_src.BBoxLike.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`NodeItem`](../interfaces/rbush_src.NodeItem.md) |

##### Returns

[`BBoxLike`](../interfaces/rbush_src.BBoxLike.md)

#### Defined in

[packages/rbush/src/index.ts:26](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/rbush/src/index.ts#L26)
