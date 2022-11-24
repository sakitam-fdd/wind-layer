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

[packages/gl-core/src/WindParticles.ts:135](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L135)

## Properties

### alpha

• `Private` **alpha**: `number`

#### Defined in

[packages/gl-core/src/WindParticles.ts:130](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L130)

___

### backgroundTexture

• `Private` **backgroundTexture**: ``null`` \| `WebGLTexture`

#### Defined in

[packages/gl-core/src/WindParticles.ts:113](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L113)

___

### colorRampTexture

• `Private` **colorRampTexture**: ``null`` \| `WebGLTexture`

#### Defined in

[packages/gl-core/src/WindParticles.ts:122](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L122)

___

### colorRange

• `Private` **colorRange**: [`number`, `number`]

#### Defined in

[packages/gl-core/src/WindParticles.ts:126](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L126)

___

### currentParticleStateTexture

• `Private` **currentParticleStateTexture**: ``null`` \| `WebGLTexture`

#### Defined in

[packages/gl-core/src/WindParticles.ts:107](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L107)

___

### data

• **data**: `IData`

#### Defined in

[packages/gl-core/src/WindParticles.ts:101](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L101)

___

### drawCommand

• `Private` **drawCommand**: `default`

#### Defined in

[packages/gl-core/src/WindParticles.ts:117](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L117)

___

### fbo

• `Private` **fbo**: ``null`` \| `WebGLFramebuffer`

#### Defined in

[packages/gl-core/src/WindParticles.ts:121](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L121)

___

### frameTime

• `Private` **frameTime**: `number`

#### Defined in

[packages/gl-core/src/WindParticles.ts:132](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L132)

___

### gl

• **gl**: `WebGLRenderingContext`

#### Defined in

[packages/gl-core/src/WindParticles.ts:99](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L99)

___

### lastTime

• `Private` **lastTime**: `number`

#### Defined in

[packages/gl-core/src/WindParticles.ts:133](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L133)

___

### nextParticleStateTexture

• `Private` **nextParticleStateTexture**: ``null`` \| `WebGLTexture`

#### Defined in

[packages/gl-core/src/WindParticles.ts:109](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L109)

___

### opacity

• `Private` **opacity**: `number`

#### Defined in

[packages/gl-core/src/WindParticles.ts:125](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L125)

___

### options

• `Private` **options**: [`IWindOptions`](../interfaces/gl_core_src.IWindOptions.md)

#### Defined in

[packages/gl-core/src/WindParticles.ts:124](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L124)

___

### particleIndexBuffer

• `Private` **particleIndexBuffer**: ``null`` \| `WebGLBuffer`

#### Defined in

[packages/gl-core/src/WindParticles.ts:111](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L111)

___

### particleStateResolution

• `Private` **particleStateResolution**: `number`

#### Defined in

[packages/gl-core/src/WindParticles.ts:105](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L105)

___

### privateNumParticles

• `Private` **privateNumParticles**: `number`

#### Defined in

[packages/gl-core/src/WindParticles.ts:103](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L103)

___

### raf

• `Private` **raf**: `Raf`

#### Defined in

[packages/gl-core/src/WindParticles.ts:120](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L120)

___

### renderExtent

• `Private` **renderExtent**: `number`[]

#### Defined in

[packages/gl-core/src/WindParticles.ts:128](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L128)

___

### screenCommand

• `Private` **screenCommand**: `default`

#### Defined in

[packages/gl-core/src/WindParticles.ts:119](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L119)

___

### screenTexture

• `Private` **screenTexture**: ``null`` \| `WebGLTexture`

#### Defined in

[packages/gl-core/src/WindParticles.ts:115](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L115)

___

### size

• `Private` **size**: `number`[]

#### Defined in

[packages/gl-core/src/WindParticles.ts:127](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L127)

___

### uid

• `Private` `Readonly` **uid**: `string`

#### Defined in

[packages/gl-core/src/WindParticles.ts:134](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L134)

___

### updateCommand

• `Private` **updateCommand**: `default`

#### Defined in

[packages/gl-core/src/WindParticles.ts:118](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L118)

___

### visible

• `Private` **visible**: `boolean`

#### Defined in

[packages/gl-core/src/WindParticles.ts:129](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L129)

## Accessors

### numParticles

• `get` **numParticles**(): `number`

#### Returns

`number`

#### Defined in

[packages/gl-core/src/WindParticles.ts:270](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L270)

• `set` **numParticles**(`numParticles`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `numParticles` | `number` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/WindParticles.ts:208](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L208)

## Methods

### buildColorRamp

▸ **buildColorRamp**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/WindParticles.ts:340](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L340)

___

### destroyData

▸ **destroyData**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/WindParticles.ts:746](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L746)

___

### destroyed

▸ **destroyed**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/WindParticles.ts:780](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L780)

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

[packages/gl-core/src/WindParticles.ts:500](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L500)

___

### drawScreen

▸ **drawScreen**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/WindParticles.ts:407](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L407)

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

[packages/gl-core/src/WindParticles.ts:361](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L361)

___

### getData

▸ **getData**(): `IData`

#### Returns

`IData`

#### Defined in

[packages/gl-core/src/WindParticles.ts:738](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L738)

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

[packages/gl-core/src/WindParticles.ts:742](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L742)

___

### getOpacity

▸ **getOpacity**(): `number`

#### Returns

`number`

#### Defined in

[packages/gl-core/src/WindParticles.ts:311](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L311)

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

[packages/gl-core/src/WindParticles.ts:687](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L687)

___

### handleMoveend

▸ **handleMoveend**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/WindParticles.ts:315](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L315)

___

### handleMovestart

▸ **handleMovestart**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/WindParticles.ts:320](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L320)

___

### handleZoom

▸ **handleZoom**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/WindParticles.ts:324](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L324)

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

[packages/gl-core/src/WindParticles.ts:163](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L163)

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

[packages/gl-core/src/WindParticles.ts:655](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L655)

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

[packages/gl-core/src/WindParticles.ts:628](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L628)

___

### render

▸ **render**(): [`WindParticles`](gl_core_src.WindParticles.md)

#### Returns

[`WindParticles`](gl_core_src.WindParticles.md)

#### Defined in

[packages/gl-core/src/WindParticles.ts:639](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L639)

___

### resize

▸ **resize**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/WindParticles.ts:562](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L562)

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

[packages/gl-core/src/WindParticles.ts:718](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L718)

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

[packages/gl-core/src/WindParticles.ts:307](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L307)

___

### start

▸ **start**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/WindParticles.ts:613](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L613)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/WindParticles.ts:620](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L620)

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

[packages/gl-core/src/WindParticles.ts:274](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L274)

___

### updateParticles

▸ **updateParticles**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/WindParticles.ts:442](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L442)

___

### updateRenderState

▸ **updateRenderState**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/WindParticles.ts:558](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/WindParticles.ts#L558)
