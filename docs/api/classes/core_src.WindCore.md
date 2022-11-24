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

[packages/core/src/index.ts:62](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L62)

## Properties

### animationLoop

• `Private` **animationLoop**: `number`

#### Defined in

[packages/core/src/index.ts:57](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L57)

___

### ctx

• `Private` **ctx**: `CanvasRenderingContext2D`

#### Defined in

[packages/core/src/index.ts:53](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L53)

___

### field

• `Private` **field**: [`Field`](core_src.Field.md)

#### Defined in

[packages/core/src/index.ts:55](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L55)

___

### forceStop

• **forceStop**: `boolean`

#### Defined in

[packages/core/src/index.ts:52](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L52)

___

### generated

• `Private` **generated**: `boolean` = `false`

#### Defined in

[packages/core/src/index.ts:60](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L60)

___

### options

• `Private` **options**: [`IOptions`](../interfaces/core_src.IOptions.md)

#### Defined in

[packages/core/src/index.ts:54](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L54)

___

### particles

• `Private` **particles**: `any`[] = `[]`

#### Defined in

[packages/core/src/index.ts:56](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L56)

___

### starting

• `Private` **starting**: `boolean`

#### Defined in

[packages/core/src/index.ts:59](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L59)

___

### then

• `Private` **then**: `number`

#### Defined in

[packages/core/src/index.ts:58](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L58)

___

### Field

▪ `Static` **Field**: typeof [`Field`](core_src.Field.md) = `Field`

#### Defined in

[packages/core/src/index.ts:50](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L50)

## Methods

### animate

▸ **animate**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:178](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L178)

___

### clearCanvas

▸ **clearCanvas**(): `void`

清空当前画布

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:153](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L153)

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

[packages/core/src/index.ts:373](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L373)

___

### drawParticles

▸ `Private` **drawParticles**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:277](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L277)

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

[packages/core/src/index.ts:322](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L322)

___

### fadeIn

▸ `Private` **fadeIn**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:270](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L270)

___

### getOptions

▸ **getOptions**(): [`IOptions`](../interfaces/core_src.IOptions.md)

获取配置项

#### Returns

[`IOptions`](../interfaces/core_src.IOptions.md)

#### Defined in

[packages/core/src/index.ts:116](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L116)

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

[packages/core/src/index.ts:146](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L146)

___

### moveParticles

▸ `Private` **moveParticles**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:223](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L223)

___

### postrender

▸ **postrender**(): `void`

each frame render end

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:221](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L221)

___

### prepareParticlePaths

▸ `Private` **prepareParticlePaths**(): `any`[]

#### Returns

`any`[]

#### Defined in

[packages/core/src/index.ts:423](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L423)

___

### prerender

▸ **prerender**(): `void`

渲染前处理

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:194](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L194)

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

[packages/core/src/index.ts:133](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L133)

___

### randomize

▸ `Private` **randomize**(): `number`

#### Returns

`number`

#### Defined in

[packages/core/src/index.ts:450](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L450)

___

### render

▸ **render**(): `void`

开始渲染

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:212](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L212)

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

[packages/core/src/index.ts:86](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L86)

___

### start

▸ **start**(): `void`

启动粒子动画

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:162](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L162)

___

### stop

▸ **stop**(): `void`

停止粒子动画

#### Returns

`void`

#### Defined in

[packages/core/src/index.ts:172](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L172)

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

[packages/core/src/index.ts:138](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L138)

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

[packages/core/src/index.ts:124](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/core/src/index.ts#L124)
