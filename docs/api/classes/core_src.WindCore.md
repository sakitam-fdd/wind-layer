---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [core/src](../modules/core_src.md) / WindCore

# Class: WindCore

[core/src](../modules/core_src.md).WindCore

## Constructors

### constructor

• **new WindCore**(`ctx`, `options`, `field?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | `CanvasRenderingContext2D` |
| `options` | `Partial`<[`IOptions`](../interfaces/core_src.IOptions.md)\> |
| `field?` | [`Field`](core_src.Field.md) |

#### Defined in

packages/core/src/index.ts:62

## Properties

### animationLoop

• `Private` **animationLoop**: `number`

#### Defined in

packages/core/src/index.ts:57

___

### ctx

• `Private` **ctx**: `CanvasRenderingContext2D`

#### Defined in

packages/core/src/index.ts:53

___

### field

• `Private` **field**: [`Field`](core_src.Field.md)

#### Defined in

packages/core/src/index.ts:55

___

### forceStop

• **forceStop**: `boolean`

#### Defined in

packages/core/src/index.ts:52

___

### generated

• `Private` **generated**: `boolean` = `false`

#### Defined in

packages/core/src/index.ts:60

___

### options

• `Private` **options**: [`IOptions`](../interfaces/core_src.IOptions.md)

#### Defined in

packages/core/src/index.ts:54

___

### particles

• `Private` **particles**: `any`[] = `[]`

#### Defined in

packages/core/src/index.ts:56

___

### starting

• `Private` **starting**: `boolean`

#### Defined in

packages/core/src/index.ts:59

___

### then

• `Private` **then**: `number`

#### Defined in

packages/core/src/index.ts:58

___

### Field

▪ `Static` **Field**: typeof [`Field`](core_src.Field.md) = `Field`

#### Defined in

packages/core/src/index.ts:50

## Methods

### animate

▸ **animate**(): `void`

#### Returns

`void`

#### Defined in

packages/core/src/index.ts:154

___

### clearCanvas

▸ **clearCanvas**(): `void`

#### Returns

`void`

#### Defined in

packages/core/src/index.ts:135

___

### drawCoordsParticle

▸ `Private` **drawCoordsParticle**(`particle`, `min`, `max`): `void`

用于绘制坐标粒子

#### Parameters

| Name | Type |
| :------ | :------ |
| `particle` | `any` |
| `min` | `number` |
| `max` | `number` |

#### Returns

`void`

#### Defined in

packages/core/src/index.ts:349

___

### drawParticles

▸ `Private` **drawParticles**(): `void`

#### Returns

`void`

#### Defined in

packages/core/src/index.ts:253

___

### drawPixelParticle

▸ `Private` **drawPixelParticle**(`particle`, `min`, `max`): `void`

用于绘制像素粒子

#### Parameters

| Name | Type |
| :------ | :------ |
| `particle` | `any` |
| `min` | `number` |
| `max` | `number` |

#### Returns

`void`

#### Defined in

packages/core/src/index.ts:298

___

### fadeIn

▸ `Private` **fadeIn**(): `void`

#### Returns

`void`

#### Defined in

packages/core/src/index.ts:246

___

### getOptions

▸ **getOptions**(): [`IOptions`](../interfaces/core_src.IOptions.md)

#### Returns

[`IOptions`](../interfaces/core_src.IOptions.md)

#### Defined in

packages/core/src/index.ts:109

___

### intersectsCoordinate

▸ **intersectsCoordinate**(`coordinates`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinates` | [`number`, `number`] |

#### Returns

`boolean`

#### Defined in

packages/core/src/index.ts:131

___

### moveParticles

▸ `Private` **moveParticles**(): `void`

#### Returns

`void`

#### Defined in

packages/core/src/index.ts:199

___

### postrender

▸ **postrender**(): `void`

each frame render end

#### Returns

`void`

#### Defined in

packages/core/src/index.ts:197

___

### prepareParticlePaths

▸ `Private` **prepareParticlePaths**(): `any`[]

#### Returns

`any`[]

#### Defined in

packages/core/src/index.ts:399

___

### prerender

▸ **prerender**(): `void`

渲染前处理

#### Returns

`void`

#### Defined in

packages/core/src/index.ts:170

___

### project

▸ **project**(...`args`): ``null`` \| [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

``null`` \| [`number`, `number`]

#### Defined in

packages/core/src/index.ts:122

___

### randomize

▸ `Private` **randomize**(): `number`

#### Returns

`number`

#### Defined in

packages/core/src/index.ts:429

___

### render

▸ **render**(): `void`

开始渲染

#### Returns

`void`

#### Defined in

packages/core/src/index.ts:188

___

### setOptions

▸ **setOptions**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<[`IOptions`](../interfaces/core_src.IOptions.md)\> |

#### Returns

`void`

#### Defined in

packages/core/src/index.ts:82

___

### start

▸ **start**(): `void`

#### Returns

`void`

#### Defined in

packages/core/src/index.ts:141

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

packages/core/src/index.ts:148

___

### unproject

▸ **unproject**(...`args`): ``null`` \| [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

``null`` \| [`number`, `number`]

#### Defined in

packages/core/src/index.ts:127

___

### updateData

▸ **updateData**(`field`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | [`Field`](core_src.Field.md) |

#### Returns

`void`

#### Defined in

packages/core/src/index.ts:113
