---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / core/src

# Module: core/src

## Classes

- [Field](../classes/core_src.Field.md)
- [Vector](../classes/core_src.Vector.md)
- [WindCore](../classes/core_src.WindCore.md)

## Interfaces

- [IField](../interfaces/core_src.IField.md)
- [IGFSItem](../interfaces/core_src.IGFSItem.md)
- [IOptions](../interfaces/core_src.IOptions.md)

## Variables

### defaultOptions

• `Const` **defaultOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `colorScale` | `string` |
| `frameRate` | `number` |
| `globalAlpha` | `number` |
| `gpet` | `boolean` |
| `lineWidth` | `number` |
| `maxAge` | `number` |
| `paths` | `number` |
| `useCoordsDraw` | `boolean` |
| `velocityScale` | `number` |

#### Defined in

packages/core/src/index.ts:6

## Functions

### TypeOf

▸ **TypeOf**(`value`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`any`

#### Defined in

packages/core/src/utils.ts:34

___

### assign

▸ **assign**(`target`, ...`sources`): `any`

assign object

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `object` |
| `...sources` | `any`[] |

#### Returns

`any`

#### Defined in

packages/core/src/utils.ts:148

___

### createCanvas

▸ **createCanvas**(`width`, `height`, `retina`, `Canvas?`): `HTMLCanvasElement`

create canvas

#### Parameters

| Name | Type |
| :------ | :------ |
| `width` | `number` |
| `height` | `number` |
| `retina` | `number` |
| `Canvas?` | `any` |

#### Returns

`HTMLCanvasElement`

#### Defined in

packages/core/src/utils.ts:277

___

### floorMod

▸ **floorMod**(`a`, `n`): `number`

Get floored division

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `number` |
| `n` | `number` |

#### Returns

`number`

returns remainder of floored division,
i.e., floor(a / n). Useful for consistent modulo of negative numbers.
See http://en.wikipedia.org/wiki/Modulo_operation.

#### Defined in

packages/core/src/utils.ts:183

___

### formatData

▸ **formatData**(`data`, `options?`): `undefined` \| [`Field`](../classes/core_src.Field.md)

format gfs json to vector

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IGFSItem`](../interfaces/core_src.IGFSItem.md)[] |
| `options` | `Partial`<[`IField`](../interfaces/core_src.IField.md)\> |

#### Returns

`undefined` \| [`Field`](../classes/core_src.Field.md)

#### Defined in

packages/core/src/utils.ts:218

___

### getColor

▸ **getColor**(`string`): ``null`` \| `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `string` | `string` |

#### Returns

``null`` \| `any`[]

#### Defined in

packages/core/src/utils.ts:467

___

### isArray

▸ **isArray**(`arr`): `boolean`

判断是否是数组

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | `any` |

#### Returns

`boolean`

#### Defined in

packages/core/src/utils.ts:139

___

### isArrayBuffer

▸ **isArrayBuffer**(`val`): `boolean`

is array buffer

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

`boolean`

#### Defined in

packages/core/src/utils.ts:83

___

### isDate

▸ **isDate**(`val`): `boolean`

is date value

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

`boolean`

#### Defined in

packages/core/src/utils.ts:74

___

### isEmpty

▸ **isEmpty**(`object`): `boolean`

判断对象是否为空

#### Parameters

| Name | Type |
| :------ | :------ |
| `object` | `Object` |

#### Returns

`boolean`

#### Defined in

packages/core/src/utils.ts:118

___

### isFunction

▸ **isFunction**(`value`): `boolean`

判断是否为函数

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`boolean`

#### Defined in

packages/core/src/utils.ts:46

___

### isNull

▸ **isNull**(`obj`): `boolean`

判断是否为 `null`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `any` |

#### Returns

`boolean`

#### Defined in

packages/core/src/utils.ts:131

___

### isNumber

▸ **isNumber**(`value`): `boolean`

判断是否为数字

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`boolean`

#### Defined in

packages/core/src/utils.ts:107

___

### isObject

▸ **isObject**(`value`): `boolean`

判断是否为对象

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`boolean`

#### Defined in

packages/core/src/utils.ts:64

___

### isString

▸ **isString**(`value`): `boolean`

判断是否为合法字符串

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`boolean`

#### Defined in

packages/core/src/utils.ts:92

___

### isValide

▸ **isValide**(`val`): `boolean`

检查值是否合法

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

`boolean`

#### Defined in

packages/core/src/utils.ts:192

___

### removeDomNode

▸ **removeDomNode**(`node`): ``null`` \| `HTMLElement`

移除 dom

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `HTMLElement` \| `HTMLCanvasElement` |

#### Returns

``null`` \| `HTMLElement`

#### Defined in

packages/core/src/utils.ts:300

___

### warnLog

▸ **warnLog**(`msg`, `n?`): `void`

打印⚠️信息

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `string` |
| `n?` | `string` |

#### Returns

`void`

#### Defined in

packages/core/src/utils.ts:157

___

### warnOnce

▸ **warnOnce**(`namespaces`, `msg`): `void`

在程序运行时只打印同类型警告一次

#### Parameters

| Name | Type |
| :------ | :------ |
| `namespaces` | `string` |
| `msg` | `string` |

#### Returns

`void`

#### Defined in

packages/core/src/utils.ts:168
