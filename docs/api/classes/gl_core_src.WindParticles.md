---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [gl-core/src](../modules/gl_core_src.md) / WindParticles

# Class: WindParticles

[gl-core/src](../modules/gl_core_src.md).WindParticles

## Constructors

### constructor

• **new WindParticles**(`gl`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `options` | [`IWindOptions`](../interfaces/gl_core_src.IWindOptions.md) |

#### Defined in

packages/gl-core/src/WindParticles.ts:135

## Properties

### alpha

• `Private` **alpha**: `number`

#### Defined in

packages/gl-core/src/WindParticles.ts:130

___

### backgroundTexture

• `Private` **backgroundTexture**: ``null`` \| `WebGLTexture`

#### Defined in

packages/gl-core/src/WindParticles.ts:113

___

### colorRampTexture

• `Private` **colorRampTexture**: ``null`` \| `WebGLTexture`

#### Defined in

packages/gl-core/src/WindParticles.ts:122

___

### colorRange

• `Private` **colorRange**: [`number`, `number`]

#### Defined in

packages/gl-core/src/WindParticles.ts:126

___

### currentParticleStateTexture

• `Private` **currentParticleStateTexture**: ``null`` \| `WebGLTexture`

#### Defined in

packages/gl-core/src/WindParticles.ts:107

___

### data

• **data**: `IData`

#### Defined in

packages/gl-core/src/WindParticles.ts:101

___

### drawCommand

• `Private` **drawCommand**: `default`

#### Defined in

packages/gl-core/src/WindParticles.ts:117

___

### fbo

• `Private` **fbo**: ``null`` \| `WebGLFramebuffer`

#### Defined in

packages/gl-core/src/WindParticles.ts:121

___

### frameTime

• `Private` **frameTime**: `number`

#### Defined in

packages/gl-core/src/WindParticles.ts:132

___

### gl

• **gl**: `WebGLRenderingContext`

#### Defined in

packages/gl-core/src/WindParticles.ts:99

___

### lastTime

• `Private` **lastTime**: `number`

#### Defined in

packages/gl-core/src/WindParticles.ts:133

___

### nextParticleStateTexture

• `Private` **nextParticleStateTexture**: ``null`` \| `WebGLTexture`

#### Defined in

packages/gl-core/src/WindParticles.ts:109

___

### opacity

• `Private` **opacity**: `number`

#### Defined in

packages/gl-core/src/WindParticles.ts:125

___

### options

• `Private` **options**: [`IWindOptions`](../interfaces/gl_core_src.IWindOptions.md)

#### Defined in

packages/gl-core/src/WindParticles.ts:124

___

### particleIndexBuffer

• `Private` **particleIndexBuffer**: ``null`` \| `WebGLBuffer`

#### Defined in

packages/gl-core/src/WindParticles.ts:111

___

### particleStateResolution

• `Private` **particleStateResolution**: `number`

#### Defined in

packages/gl-core/src/WindParticles.ts:105

___

### privateNumParticles

• `Private` **privateNumParticles**: `number`

#### Defined in

packages/gl-core/src/WindParticles.ts:103

___

### raf

• `Private` **raf**: `Raf`

#### Defined in

packages/gl-core/src/WindParticles.ts:120

___

### renderExtent

• `Private` **renderExtent**: `number`[]

#### Defined in

packages/gl-core/src/WindParticles.ts:128

___

### screenCommand

• `Private` **screenCommand**: `default`

#### Defined in

packages/gl-core/src/WindParticles.ts:119

___

### screenTexture

• `Private` **screenTexture**: ``null`` \| `WebGLTexture`

#### Defined in

packages/gl-core/src/WindParticles.ts:115

___

### size

• `Private` **size**: `number`[]

#### Defined in

packages/gl-core/src/WindParticles.ts:127

___

### uid

• `Private` `Readonly` **uid**: `string`

#### Defined in

packages/gl-core/src/WindParticles.ts:134

___

### updateCommand

• `Private` **updateCommand**: `default`

#### Defined in

packages/gl-core/src/WindParticles.ts:118

___

### visible

• `Private` **visible**: `boolean`

#### Defined in

packages/gl-core/src/WindParticles.ts:129

## Accessors

### numParticles

• `get` **numParticles**(): `number`

#### Returns

`number`

#### Defined in

packages/gl-core/src/WindParticles.ts:270

• `set` **numParticles**(`numParticles`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `numParticles` | `number` |

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:208

## Methods

### buildColorRamp

▸ **buildColorRamp**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:340

___

### destroyData

▸ **destroyData**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:746

___

### destroyed

▸ **destroyed**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:780

___

### drawParticles

▸ **drawParticles**(`matrix`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `matrix` | `number`[] |

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:500

___

### drawScreen

▸ **drawScreen**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:407

___

### drawTexture

▸ **drawTexture**(`matrix`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `matrix` | `number`[] |

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:361

___

### getData

▸ **getData**(): `IData`

#### Returns

`IData`

#### Defined in

packages/gl-core/src/WindParticles.ts:738

___

### getMercatorCoordinate

▸ **getMercatorCoordinate**(`__namedParameters`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`number`, `number`] |

#### Returns

[`number`, `number`]

#### Defined in

packages/gl-core/src/WindParticles.ts:742

___

### getOpacity

▸ **getOpacity**(): `number`

#### Returns

`number`

#### Defined in

packages/gl-core/src/WindParticles.ts:311

___

### getTextureData

▸ **getTextureData**(`data`): `Promise`<`IData`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `IImageData` |

#### Returns

`Promise`<`IData`\>

#### Defined in

packages/gl-core/src/WindParticles.ts:687

___

### handleMoveend

▸ **handleMoveend**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:315

___

### handleMovestart

▸ **handleMovestart**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:320

___

### handleZoom

▸ **handleZoom**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:324

___

### initialize

▸ **initialize**(`gl`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:163

___

### initializeVertex

▸ **initializeVertex**(`coordinates`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinates` | `number`[][] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `backgroundBuffer` | ``null`` \| `WebGLBuffer` |
| `backgroundTexCoordBuffer` | ``null`` \| `WebGLBuffer` |
| `buffer` | ``null`` \| `WebGLBuffer` |
| `quadBuffer` | ``null`` \| `WebGLBuffer` |
| `texCoordBuffer` | ``null`` \| `WebGLBuffer` |

#### Defined in

packages/gl-core/src/WindParticles.ts:655

___

### prerender

▸ **prerender**(`matrix`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `matrix` | `number`[] |

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:628

___

### render

▸ **render**(): [`WindParticles`](gl_core_src.WindParticles.md)

#### Returns

[`WindParticles`](gl_core_src.WindParticles.md)

#### Defined in

packages/gl-core/src/WindParticles.ts:639

___

### resize

▸ **resize**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:562

___

### setData

▸ **setData**(`data`, `cb?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `IImageData` |
| `cb?` | (`args?`: `boolean`) => `void` |

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:718

___

### setOpacity

▸ **setOpacity**(`opacity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `opacity` | `number` |

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:307

___

### start

▸ **start**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:613

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:620

___

### updateOptions

▸ **updateOptions**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<[`IWindOptions`](../interfaces/gl_core_src.IWindOptions.md)\> |

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:274

___

### updateParticles

▸ **updateParticles**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:442

___

### updateRenderState

▸ **updateRenderState**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/WindParticles.ts:558
