---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [core/src](../modules/core_src.md) / Field

# Class: Field

[core/src](../modules/core_src.md).Field

## Constructors

### constructor

• **new Field**(`params`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`IField`](../interfaces/core_src.IField.md) |

#### Defined in

packages/core/src/Field.ts:51

## Properties

### cols

• `Private` `Readonly` **cols**: `number`

#### Defined in

packages/core/src/Field.ts:38

___

### deltaX

• `Private` `Readonly` **deltaX**: `number`

#### Defined in

packages/core/src/Field.ts:44

___

### deltaY

• `Private` `Readonly` **deltaY**: `number`

#### Defined in

packages/core/src/Field.ts:43

___

### grid

• **grid**: (``null`` \| [`Vector`](core_src.Vector.md))[][]

#### Defined in

packages/core/src/Field.ts:47

___

### isContinuous

• `Private` `Readonly` **isContinuous**: `boolean`

#### Defined in

packages/core/src/Field.ts:42

___

### isFields

• `Private` `Readonly` **isFields**: `boolean`

#### Defined in

packages/core/src/Field.ts:46

___

### range

• **range**: `undefined` \| (`undefined` \| `number`)[]

#### Defined in

packages/core/src/Field.ts:48

___

### rows

• `Private` `Readonly` **rows**: `number`

#### Defined in

packages/core/src/Field.ts:39

___

### translateX

• `Private` `Readonly` **translateX**: `undefined` \| `boolean`

#### Defined in

packages/core/src/Field.ts:45

___

### us

• `Private` `Readonly` **us**: `number`[]

#### Defined in

packages/core/src/Field.ts:40

___

### vs

• `Private` `Readonly` **vs**: `number`[]

#### Defined in

packages/core/src/Field.ts:41

___

### wrapX

• `Private` **wrapX**: `boolean`

#### Defined in

packages/core/src/Field.ts:49

___

### xmax

• `Private` `Readonly` **xmax**: `number`

#### Defined in

packages/core/src/Field.ts:35

___

### xmin

• `Private` `Readonly` **xmin**: `number`

#### Defined in

packages/core/src/Field.ts:34

___

### ymax

• `Private` `Readonly` **ymax**: `number`

#### Defined in

packages/core/src/Field.ts:37

___

### ymin

• `Private` `Readonly` **ymin**: `number`

#### Defined in

packages/core/src/Field.ts:36

## Methods

### bilinearInterpolateVector

▸ `Private` **bilinearInterpolateVector**(`x`, `y`, `g00`, `g10`, `g01`, `g11`): [`Vector`](core_src.Vector.md)

Bilinear interpolation for Vector
针对向量进行双线性插值
https://en.wikipedia.org/wiki/Bilinear_interpolation

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |
| `g00` | `Object` |
| `g00.u` | `number` |
| `g00.v` | `number` |
| `g10` | `Object` |
| `g10.u` | `number` |
| `g10.v` | `number` |
| `g01` | `Object` |
| `g01.u` | `number` |
| `g01.v` | `number` |
| `g11` | `Object` |
| `g11.u` | `number` |
| `g11.v` | `number` |

#### Returns

[`Vector`](core_src.Vector.md)

#### Defined in

packages/core/src/Field.ts:157

___

### buildGrid

▸ **buildGrid**(): (``null`` \| [`Vector`](core_src.Vector.md))[][]

#### Returns

(``null`` \| [`Vector`](core_src.Vector.md))[][]

#### Defined in

packages/core/src/Field.ts:104

___

### calculateRange

▸ **calculateRange**(): `undefined` \| `any`[]

calculate vector value range

#### Returns

`undefined` \| `any`[]

#### Defined in

packages/core/src/Field.ts:179

___

### checkFields

▸ **checkFields**(): `boolean`

判断是否是 `Field` 的实例

#### Returns

`boolean`

boolean

#### Defined in

packages/core/src/Field.ts:509

___

### clampColumnIndex

▸ `Private` **clampColumnIndex**(`ii`): `number`

Check the column index is inside the field,
adjusting to min or max when needed

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ii` | `number` | index |

#### Returns

`number`

i - inside the allowed indexes

#### Defined in

packages/core/src/Field.ts:350

___

### clampRowIndex

▸ `Private` **clampRowIndex**(`jj`): `number`

Check the row index is inside the field,
adjusting to min or max when needed

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jj` | `number` | index |

#### Returns

`number`

j - inside the allowed indexes

#### Defined in

packages/core/src/Field.ts:369

___

### contains

▸ **contains**(`lon`, `lat`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `lon` | `number` |
| `lat` | `number` |

#### Returns

`any`

#### Defined in

packages/core/src/Field.ts:241

___

### extent

▸ **extent**(): `number`[]

grib data extent
格点数据范围

#### Returns

`number`[]

#### Defined in

packages/core/src/Field.ts:136

___

### getDecimalIndexes

▸ **getDecimalIndexes**(`lon`, `lat`): `number`[]

获取经纬度所在的位置索引

#### Parameters

| Name | Type |
| :------ | :------ |
| `lon` | `number` |
| `lat` | `number` |

#### Returns

`number`[]

#### Defined in

packages/core/src/Field.ts:258

___

### getFourSurroundingIndexes

▸ `Private` **getFourSurroundingIndexes**(`i`, `j`): `number`[]

计算索引位置周围的数据

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `i` | `number` | decimal index |
| `j` | `number` | decimal index |

#### Returns

`number`[]

[fi, ci, fj, cj]

#### Defined in

packages/core/src/Field.ts:388

___

### getFourSurroundingValues

▸ `Private` **getFourSurroundingValues**(`fi`, `ci`, `fj`, `cj`): ``null`` \| `any`[]

Get four surrounding values or null if not available,
from 4 integer indexes

#### Parameters

| Name | Type |
| :------ | :------ |
| `fi` | `number` |
| `ci` | `number` |
| `fj` | `number` |
| `cj` | `number` |

#### Returns

``null`` \| `any`[]

#### Defined in

packages/core/src/Field.ts:413

___

### getWrappedLongitudes

▸ `Private` **getWrappedLongitudes**(): `number`[]

#### Returns

`number`[]

#### Defined in

packages/core/src/Field.ts:224

___

### hasValueAt

▸ **hasValueAt**(`lon`, `lat`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `lon` | `number` |
| `lat` | `number` |

#### Returns

`boolean`

#### Defined in

packages/core/src/Field.ts:312

___

### interpolatePoint

▸ `Private` **interpolatePoint**(`i`, `j`): ``null`` \| [`Vector`](core_src.Vector.md)

基于向量的双线性插值

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `number` |
| `j` | `number` |

#### Returns

``null`` \| [`Vector`](core_src.Vector.md)

#### Defined in

packages/core/src/Field.ts:322

___

### interpolatedValueAt

▸ **interpolatedValueAt**(`lon`, `lat`): ``null`` \| [`Vector`](core_src.Vector.md)

Get interpolated grid value lon-lat coordinates
双线性插值

#### Parameters

| Name | Type |
| :------ | :------ |
| `lon` | `number` |
| `lat` | `number` |

#### Returns

``null`` \| [`Vector`](core_src.Vector.md)

#### Defined in

packages/core/src/Field.ts:297

___

### isValid

▸ `Private` **isValid**(`x`): `boolean`

检查 uv是否合法

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `any` |

#### Returns

`boolean`

#### Defined in

packages/core/src/Field.ts:220

___

### latitudeAtY

▸ `Private` **latitudeAtY**(`j`): `number`

Latitude for grid-index

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `j` | `number` | row index (integer) |

#### Returns

`number`

latitude at the center of the cell

#### Defined in

packages/core/src/Field.ts:476

___

### lonLatAtIndexes

▸ **lonLatAtIndexes**(`i`, `j`): `number`[]

Lon-Lat for grid indexes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `i` | `number` | column index (integer) |
| `j` | `number` | row index (integer) |

#### Returns

`number`[]

[lon, lat]

#### Defined in

packages/core/src/Field.ts:450

___

### longitudeAtX

▸ `Private` **longitudeAtX**(`i`): `number`

Longitude for grid-index

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `i` | `number` | column index (integer) |

#### Returns

`number`

longitude at the center of the cell

#### Defined in

packages/core/src/Field.ts:462

___

### randomize

▸ **randomize**(`o?`, `width`, `height`, `unproject`): `IPosition`

生成粒子位置

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `IPosition` |
| `width` | `number` |
| `height` | `number` |
| `unproject` | (`a`: `number`[]) => ``null`` \| [`number`, `number`] |

#### Returns

`IPosition`

IPosition

#### Defined in

packages/core/src/Field.ts:489

___

### release

▸ **release**(): `void`

#### Returns

`void`

#### Defined in

packages/core/src/Field.ts:128

___

### startBatchInterpolate

▸ **startBatchInterpolate**(`width`, `height`, `unproject`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `width` | `number` |
| `height` | `number` |
| `unproject` | (...`args`: `any`[]) => ``null`` \| [`number`, `number`] |

#### Returns

`void`

#### Defined in

packages/core/src/Field.ts:513

___

### valueAt

▸ **valueAt**(`lon`, `lat`): ``null`` \| [`Vector`](core_src.Vector.md)

Nearest value at lon-lat coordinates
线性插值

#### Parameters

| Name | Type |
| :------ | :------ |
| `lon` | `number` |
| `lat` | `number` |

#### Returns

``null`` \| [`Vector`](core_src.Vector.md)

#### Defined in

packages/core/src/Field.ts:270

___

### valueAtIndexes

▸ **valueAtIndexes**(`i`, `j`): ``null`` \| [`Vector`](core_src.Vector.md)

Value for grid indexes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `i` | `number` | column index (integer) |
| `j` | `number` | row index (integer) |

#### Returns

``null`` \| [`Vector`](core_src.Vector.md)

#### Defined in

packages/core/src/Field.ts:440
