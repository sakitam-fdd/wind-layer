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

packages/core/dist/index.d.ts:70

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

packages/core/dist/index.d.ts:93

___

### clampColumnIndex

• `Private` **clampColumnIndex**: `any`

Check the column index is inside the field,
adjusting to min or max when needed

**`Param`**

index

#### Defined in

packages/core/dist/index.d.ts:140

___

### clampRowIndex

• `Private` **clampRowIndex**: `any`

Check the row index is inside the field,
adjusting to min or max when needed

**`Param`**

index

#### Defined in

packages/core/dist/index.d.ts:148

___

### cols

• `Private` `Readonly` **cols**: `any`

#### Defined in

packages/core/dist/index.d.ts:57

___

### deltaX

• `Private` `Readonly` **deltaX**: `any`

#### Defined in

packages/core/dist/index.d.ts:63

___

### deltaY

• `Private` `Readonly` **deltaY**: `any`

#### Defined in

packages/core/dist/index.d.ts:62

___

### flipY

• `Private` `Readonly` **flipY**: `any`

#### Defined in

packages/core/dist/index.d.ts:66

___

### getFourSurroundingIndexes

• `Private` **getFourSurroundingIndexes**: `any`

计算索引位置周围的数据

**`Param`**

decimal index

**`Param`**

decimal index

#### Defined in

packages/core/dist/index.d.ts:156

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

packages/core/dist/index.d.ts:167

___

### getWrappedLongitudes

• `Private` **getWrappedLongitudes**: `any`

#### Defined in

packages/core/dist/index.d.ts:104

___

### grid

• **grid**: (``null`` \| `Vector`)[][]

#### Defined in

packages/core/dist/index.d.ts:67

___

### interpolatePoint

• `Private` **interpolatePoint**: `any`

基于向量的双线性插值

**`Param`**

**`Param`**

#### Defined in

packages/core/dist/index.d.ts:132

___

### isContinuous

• `Private` `Readonly` **isContinuous**: `any`

#### Defined in

packages/core/dist/index.d.ts:61

___

### isFields

• `Private` `Readonly` **isFields**: `any`

#### Defined in

packages/core/dist/index.d.ts:65

___

### latitudeAtY

• `Private` **latitudeAtY**: `any`

Latitude for grid-index

**`Param`**

row index (integer)

#### Defined in

packages/core/dist/index.d.ts:193

___

### longitudeAtX

• `Private` **longitudeAtX**: `any`

Longitude for grid-index

**`Param`**

column index (integer)

#### Defined in

packages/core/dist/index.d.ts:187

___

### range

• **range**: `undefined` \| (`undefined` \| `number`)[]

#### Defined in

packages/core/dist/index.d.ts:68

___

### rows

• `Private` `Readonly` **rows**: `any`

#### Defined in

packages/core/dist/index.d.ts:58

___

### translateX

• `Private` `Readonly` **translateX**: `any`

#### Defined in

packages/core/dist/index.d.ts:64

___

### us

• `Private` `Readonly` **us**: `any`

#### Defined in

packages/core/dist/index.d.ts:59

___

### vs

• `Private` `Readonly` **vs**: `any`

#### Defined in

packages/core/dist/index.d.ts:60

___

### wrapX

• `Private` **wrapX**: `any`

#### Defined in

packages/core/dist/index.d.ts:69

___

### xmax

• `Private` `Readonly` **xmax**: `any`

#### Defined in

packages/core/dist/index.d.ts:54

___

### xmin

• `Private` `Readonly` **xmin**: `any`

#### Defined in

packages/core/dist/index.d.ts:53

___

### ymax

• `Private` `Readonly` **ymax**: `any`

#### Defined in

packages/core/dist/index.d.ts:56

___

### ymin

• `Private` `Readonly` **ymin**: `any`

#### Defined in

packages/core/dist/index.d.ts:55

## Methods

### buildGrid

▸ **buildGrid**(): (``null`` \| `Vector`)[][]

#### Returns

(``null`` \| `Vector`)[][]

#### Defined in

packages/core/dist/index.d.ts:71

___

### calculateRange

▸ **calculateRange**(): `undefined` \| `any`[]

calculate vector value range

#### Returns

`undefined` \| `any`[]

#### Defined in

packages/core/dist/index.d.ts:97

___

### checkFields

▸ **checkFields**(): `boolean`

判断是否是 `Field` 的实例

#### Returns

`boolean`

boolean

#### Defined in

packages/core/dist/index.d.ts:207

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

packages/core/dist/index.d.ts:105

___

### extent

▸ **extent**(): `number`[]

grib data extent
格点数据范围

#### Returns

`number`[]

#### Defined in

packages/core/dist/index.d.ts:80

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

packages/core/dist/index.d.ts:111

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

packages/core/dist/index.d.ts:126

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

packages/core/dist/index.d.ts:125

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

packages/core/dist/index.d.ts:103

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

packages/core/dist/index.d.ts:181

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

packages/core/dist/index.d.ts:202

___

### release

▸ **release**(): `void`

release data

#### Returns

`void`

#### Defined in

packages/core/dist/index.d.ts:75

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

packages/core/dist/index.d.ts:118

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

packages/core/dist/index.d.ts:174
