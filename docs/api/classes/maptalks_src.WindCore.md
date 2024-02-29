---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [maptalks/src](../modules/maptalks_src.md) / WindCore

# Class: WindCore

[maptalks/src](../modules/maptalks_src.md).WindCore

## Constructors

### constructor

• **new WindCore**(`ctx`, `options`, `field?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | `CanvasRenderingContext2D` |
| `options` | `Partial`<`IOptions`\> |
| `field?` | [`Field`](maptalks_src.Field.md) |

#### Defined in

packages/core/dist/index.d.ts:375

## Properties

### animationLoop

• `Private` **animationLoop**: `any`

#### Defined in

packages/core/dist/index.d.ts:371

___

### ctx

• `Private` **ctx**: `any`

#### Defined in

packages/core/dist/index.d.ts:367

___

### drawCoordsParticle

• `Private` **drawCoordsParticle**: `any`

用于绘制坐标粒子

**`Param`**

**`Param`**

**`Param`**

#### Defined in

packages/core/dist/index.d.ts:439

___

### drawParticles

• `Private` **drawParticles**: `any`

#### Defined in

packages/core/dist/index.d.ts:425

___

### drawPixelParticle

• `Private` **drawPixelParticle**: `any`

用于绘制像素粒子

**`Param`**

**`Param`**

**`Param`**

#### Defined in

packages/core/dist/index.d.ts:432

___

### fadeIn

• `Private` **fadeIn**: `any`

#### Defined in

packages/core/dist/index.d.ts:424

___

### field

• `Private` **field**: `any`

#### Defined in

packages/core/dist/index.d.ts:369

___

### forceStop

• **forceStop**: `boolean`

#### Defined in

packages/core/dist/index.d.ts:366

___

### generated

• `Private` **generated**: `any`

#### Defined in

packages/core/dist/index.d.ts:373

___

### moveParticles

• `Private` **moveParticles**: `any`

#### Defined in

packages/core/dist/index.d.ts:423

___

### options

• `Private` **options**: `any`

#### Defined in

packages/core/dist/index.d.ts:368

___

### particles

• `Private` **particles**: `any`

#### Defined in

packages/core/dist/index.d.ts:370

___

### prepareParticlePaths

• `Private` **prepareParticlePaths**: `any`

#### Defined in

packages/core/dist/index.d.ts:440

___

### randomize

• `Private` **randomize**: `any`

#### Defined in

packages/core/dist/index.d.ts:441

___

### starting

• `Private` **starting**: `any`

#### Defined in

packages/core/dist/index.d.ts:374

___

### then

• `Private` **then**: `any`

#### Defined in

packages/core/dist/index.d.ts:372

___

### Field

▪ `Static` **Field**: typeof [`Field`](maptalks_src.Field.md)

#### Defined in

packages/core/dist/index.d.ts:365

## Methods

### animate

▸ **animate**(): `void`

#### Returns

`void`

#### Defined in

packages/core/dist/index.d.ts:410

___

### clearCanvas

▸ **clearCanvas**(): `void`

清空当前画布

#### Returns

`void`

#### Defined in

packages/core/dist/index.d.ts:400

___

### getOptions

▸ **getOptions**(): `IOptions`

获取配置项

#### Returns

`IOptions`

#### Defined in

packages/core/dist/index.d.ts:384

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

packages/core/dist/index.d.ts:396

___

### isStop

▸ **isStop**(): `boolean`

#### Returns

`boolean`

#### Defined in

packages/core/dist/index.d.ts:401

___

### postrender

▸ **postrender**(): `void`

each frame render end

#### Returns

`void`

#### Defined in

packages/core/dist/index.d.ts:422

___

### prerender

▸ **prerender**(): `void`

渲染前处理

#### Returns

`void`

#### Defined in

packages/core/dist/index.d.ts:414

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

packages/core/dist/index.d.ts:390

___

### render

▸ **render**(): `void`

开始渲染

#### Returns

`void`

#### Defined in

packages/core/dist/index.d.ts:418

___

### setOptions

▸ **setOptions**(`options`): `void`

设置配置项

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`IOptions`\> |

#### Returns

`void`

#### Defined in

packages/core/dist/index.d.ts:380

___

### start

▸ **start**(): `void`

启动粒子动画

#### Returns

`void`

#### Defined in

packages/core/dist/index.d.ts:405

___

### stop

▸ **stop**(): `void`

停止粒子动画

#### Returns

`void`

#### Defined in

packages/core/dist/index.d.ts:409

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

packages/core/dist/index.d.ts:391

___

### updateData

▸ **updateData**(`field`): `void`

更新数据

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | [`Field`](maptalks_src.Field.md) |

#### Returns

`void`

#### Defined in

packages/core/dist/index.d.ts:389
