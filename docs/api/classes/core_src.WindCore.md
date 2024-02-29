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

[packages/core/src/index.ts:63](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L63)

## Properties

### animationLoop

• `Private` **animationLoop**: `number`

#### Defined in

[packages/core/src/index.ts:57](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L57)

___

### ctx

• `Private` **ctx**: `CanvasRenderingContext2D`

#### Defined in

[packages/core/src/index.ts:53](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L53)

___

### field

• `Private` **field**: [`Field`](core_src.Field.md)

#### Defined in

[packages/core/src/index.ts:55](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L55)

___

### forceStop

• **forceStop**: `boolean`

#### Defined in

[packages/core/src/index.ts:52](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L52)

___

### generated

• `Private` **generated**: `boolean` = `false`

#### Defined in

[packages/core/src/index.ts:59](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L59)

___

### options

• `Private` **options**: [`IOptions`](../interfaces/core_src.IOptions.md)

#### Defined in

[packages/core/src/index.ts:54](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L54)

___

### particles

• `Private` **particles**: `any`[] = `[]`

#### Defined in

[packages/core/src/index.ts:56](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L56)

___

### starting

• `Private` **starting**: `boolean`

#### Defined in

[packages/core/src/index.ts:61](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L61)

___

### then

• `Private` **then**: `number`

#### Defined in

[packages/core/src/index.ts:58](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L58)

___

### Field

▪ `Static` **Field**: typeof [`Field`](core_src.Field.md) = `Field`

#### Defined in

[packages/core/src/index.ts:50](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L50)

## Methods

### animate

▸ **animate**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:173](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L173)

___

### clearCanvas

▸ **clearCanvas**(): `void`

清空当前画布

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:144](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L144)

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

[packages/core/src/index.ts:359](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L359)

___

### drawParticles

▸ `Private` **drawParticles**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:273](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L273)

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

[packages/core/src/index.ts:313](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L313)

___

### fadeIn

▸ `Private` **fadeIn**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:266](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L266)

___

### getOptions

▸ **getOptions**(): [`IOptions`](../interfaces/core_src.IOptions.md)

获取配置项

#### Returns

[`IOptions`](../interfaces/core_src.IOptions.md)

#### Defined in

[packages/core/src/index.ts:107](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L107)

___

### intersectsCoordinate

▸ **intersectsCoordinate**(`coordinates`): `boolean`

判断位置是否在当前视窗内

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinates` | [`number`, `number`] |

#### Returns

`boolean`

#### Defined in

[packages/core/src/index.ts:137](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L137)

___

### isStop

▸ **isStop**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/core/src/index.ts:150](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L150)

___

### moveParticles

▸ `Private` **moveParticles**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:218](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L218)

___

### postrender

▸ **postrender**(): `void`

each frame render end

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:216](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L216)

___

### prepareParticlePaths

▸ `Private` **prepareParticlePaths**(): `any`[]

#### Returns

`any`[]

#### Defined in

[packages/core/src/index.ts:404](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L404)

___

### prerender

▸ **prerender**(): `void`

渲染前处理

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:189](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L189)

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

[packages/core/src/index.ts:124](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L124)

___

### randomize

▸ `Private` **randomize**(): `number`

#### Returns

`number`

#### Defined in

[packages/core/src/index.ts:429](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L429)

___

### render

▸ **render**(): `void`

开始渲染

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:207](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L207)

___

### setOptions

▸ **setOptions**(`options`): `void`

设置配置项

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<[`IOptions`](../interfaces/core_src.IOptions.md)\> |

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:83](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L83)

___

### start

▸ **start**(): `void`

启动粒子动画

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:157](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L157)

___

### stop

▸ **stop**(): `void`

停止粒子动画

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:167](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L167)

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

[packages/core/src/index.ts:129](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L129)

___

### updateData

▸ **updateData**(`field`): `void`

更新数据

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | [`Field`](core_src.Field.md) |

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:115](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/core/src/index.ts#L115)
