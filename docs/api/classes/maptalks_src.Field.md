---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [maptalks/src](../modules/maptalks_src.md) / Field

# Class: Field

[maptalks/src](../modules/maptalks_src.md).Field

## Constructors

### constructor

• **new Field**(`params`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `IField` |

#### Defined in

packages/core/dist/index.d.ts:68

## Properties

### bilinearInterpolateVector

• `Private` **bilinearInterpolateVector**: `any`

Bilinear interpolation for Vector
针对向量进行双线性插值
https://en.wikipedia.org/wiki/Bilinear_interpolation

**`Param`**

**`Param`**

**`Param`**

**`Param`**

**`Param`**

**`Param`**

#### Defined in

packages/core/dist/index.d.ts:88

___

### clampColumnIndex

• `Private` **clampColumnIndex**: `any`

Check the column index is inside the field,
adjusting to min or max when needed

**`Param`**

index

#### Defined in

packages/core/dist/index.d.ts:135

___

### clampRowIndex

• `Private` **clampRowIndex**: `any`

Check the row index is inside the field,
adjusting to min or max when needed

**`Param`**

index

#### Defined in

packages/core/dist/index.d.ts:143

___

### cols

• `Private` `Readonly` **cols**: `any`

#### Defined in

packages/core/dist/index.d.ts:56

___

### deltaX

• `Private` `Readonly` **deltaX**: `any`

#### Defined in

packages/core/dist/index.d.ts:62

___

### deltaY

• `Private` `Readonly` **deltaY**: `any`

#### Defined in

packages/core/dist/index.d.ts:61

___

### getFourSurroundingIndexes

• `Private` **getFourSurroundingIndexes**: `any`

计算索引位置周围的数据

**`Param`**

decimal index

**`Param`**

decimal index

#### Defined in

packages/core/dist/index.d.ts:151

___

### getFourSurroundingValues

• `Private` **getFourSurroundingValues**: `any`

Get four surrounding values or null if not available,
from 4 integer indexes

**`Param`**

**`Param`**

**`Param`**

**`Param`**

#### Defined in

packages/core/dist/index.d.ts:162

___

### getWrappedLongitudes

• `Private` **getWrappedLongitudes**: `any`

#### Defined in

packages/core/dist/index.d.ts:99

___

### grid

• **grid**: (``null`` \| `Vector`)[][]

#### Defined in

packages/core/dist/index.d.ts:65

___

### interpolatePoint

• `Private` **interpolatePoint**: `any`

基于向量的双线性插值

**`Param`**

**`Param`**

#### Defined in

packages/core/dist/index.d.ts:127

___

### isContinuous

• `Private` `Readonly` **isContinuous**: `any`

#### Defined in

packages/core/dist/index.d.ts:60

___

### isFields

• `Private` `Readonly` **isFields**: `any`

#### Defined in

packages/core/dist/index.d.ts:64

___

### latitudeAtY

• `Private` **latitudeAtY**: `any`

Latitude for grid-index

**`Param`**

row index (integer)

#### Defined in

packages/core/dist/index.d.ts:188

___

### longitudeAtX

• `Private` **longitudeAtX**: `any`

Longitude for grid-index

**`Param`**

column index (integer)

#### Defined in

packages/core/dist/index.d.ts:182

___

### range

• **range**: `undefined` \| (`undefined` \| `number`)[]

#### Defined in

packages/core/dist/index.d.ts:66

___

### rows

• `Private` `Readonly` **rows**: `any`

#### Defined in

packages/core/dist/index.d.ts:57

___

### translateX

• `Private` `Readonly` **translateX**: `any`

#### Defined in

packages/core/dist/index.d.ts:63

___

### us

• `Private` `Readonly` **us**: `any`

#### Defined in

packages/core/dist/index.d.ts:58

___

### vs

• `Private` `Readonly` **vs**: `any`

#### Defined in

packages/core/dist/index.d.ts:59

___

### wrapX

• `Private` **wrapX**: `any`

#### Defined in

packages/core/dist/index.d.ts:67

___

### xmax

• `Private` `Readonly` **xmax**: `any`

#### Defined in

packages/core/dist/index.d.ts:53

___

### xmin

• `Private` `Readonly` **xmin**: `any`

#### Defined in

packages/core/dist/index.d.ts:52

___

### ymax

• `Private` `Readonly` **ymax**: `any`

#### Defined in

packages/core/dist/index.d.ts:55

___

### ymin

• `Private` `Readonly` **ymin**: `any`

#### Defined in

packages/core/dist/index.d.ts:54

## Methods

### buildGrid

▸ **buildGrid**(): (``null`` \| `Vector`)[][]

#### Returns

(``null`` \| `Vector`)[][]

#### Defined in

packages/core/dist/index.d.ts:69

___

### calculateRange

▸ **calculateRange**(): `undefined` \| `any`[]

calculate vector value range

#### Returns

`undefined` \| `any`[]

#### Defined in

packages/core/dist/index.d.ts:92

___

### checkFields

▸ **checkFields**(): `boolean`

判断是否是 `Field` 的实例

#### Returns

`boolean`

boolean

#### Defined in

packages/core/dist/index.d.ts:202

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

packages/core/dist/index.d.ts:100

___

### extent

▸ **extent**(): `number`[]

grib data extent
格点数据范围

#### Returns

`number`[]

#### Defined in

packages/core/dist/index.d.ts:75

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

packages/core/dist/index.d.ts:106

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

packages/core/dist/index.d.ts:121

___

### interpolatedValueAt

▸ **interpolatedValueAt**(`lon`, `lat`): ``null`` \| `Vector`

Get interpolated grid value lon-lat coordinates
双线性插值

#### Parameters

| Name | Type |
| :------ | :------ |
| `lon` | `number` |
| `lat` | `number` |

#### Returns

``null`` \| `Vector`

#### Defined in

packages/core/dist/index.d.ts:120

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

packages/core/dist/index.d.ts:98

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

packages/core/dist/index.d.ts:176

___

### randomize

▸ **randomize**(`o`, `width`, `height`, `unproject`): `IPosition`

生成粒子位置

#### Parameters

| Name | Type |
| :------ | :------ |
| `o` | `undefined` \| `IPosition` |
| `width` | `number` |
| `height` | `number` |
| `unproject` | (`a`: `number`[]) => ``null`` \| [`number`, `number`] |

#### Returns

`IPosition`

IPosition

#### Defined in

packages/core/dist/index.d.ts:197

___

### release

▸ **release**(): `void`

#### Returns

`void`

#### Defined in

packages/core/dist/index.d.ts:70

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

packages/core/dist/index.d.ts:203

___

### valueAt

▸ **valueAt**(`lon`, `lat`): ``null`` \| `Vector`

Nearest value at lon-lat coordinates
线性插值

#### Parameters

| Name | Type |
| :------ | :------ |
| `lon` | `number` |
| `lat` | `number` |

#### Returns

``null`` \| `Vector`

#### Defined in

packages/core/dist/index.d.ts:113

___

### valueAtIndexes

▸ **valueAtIndexes**(`i`, `j`): ``null`` \| `Vector`

Value for grid indexes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `i` | `number` | column index (integer) |
| `j` | `number` | row index (integer) |

#### Returns

``null`` \| `Vector`

#### Defined in

packages/core/dist/index.d.ts:169
