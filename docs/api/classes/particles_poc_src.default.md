---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [particles-poc/src](../modules/particles_poc_src.md) / default

# Class: default

[particles-poc/src](../modules/particles_poc_src.md).default

## Constructors

### constructor

• **new default**(`id`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `options` | `Partial`<`ParticlesLayerOptions`\> |

#### Defined in

[packages/particles-poc/src/index.ts:181](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L181)

## Properties

### #numParticles

• `Private` **#numParticles**: `number`

#### Defined in

[packages/particles-poc/src/index.ts:179](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L179)

___

### backgroundBuffer

• `Private` **backgroundBuffer**: `Float32Array`

#### Defined in

[packages/particles-poc/src/index.ts:169](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L169)

___

### backgroundTexture

• `Private` **backgroundTexture**: `Texture2D`

#### Defined in

[packages/particles-poc/src/index.ts:164](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L164)

___

### commonfbo

• `Private` **commonfbo**: `Framebuffer2D`

#### Defined in

[packages/particles-poc/src/index.ts:173](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L173)

___

### drawCommand

• `Private` **drawCommand**: `DrawCommand`<`DefaultContext`, {}\>

#### Defined in

[packages/particles-poc/src/index.ts:175](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L175)

___

### gl

• `Private` **gl**: `WithUndef`<`WebGLRenderingContext`\>

#### Defined in

[packages/particles-poc/src/index.ts:170](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L170)

___

### globalDrawCommand

• `Private` **globalDrawCommand**: `DrawCommand`<`DefaultContext`, {}\>

#### Defined in

[packages/particles-poc/src/index.ts:176](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L176)

___

### id

• **id**: `string`

#### Defined in

[packages/particles-poc/src/index.ts:150](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L150)

___

### indexCount

• `Private` **indexCount**: `number`

#### Defined in

[packages/particles-poc/src/index.ts:159](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L159)

___

### initialized

• `Private` **initialized**: `boolean`

#### Defined in

[packages/particles-poc/src/index.ts:171](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L171)

___

### map

• **map**: `any`

#### Defined in

[packages/particles-poc/src/index.ts:154](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L154)

___

### options

• **options**: `ParticlesLayerOptions`

#### Defined in

[packages/particles-poc/src/index.ts:153](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L153)

___

### particleIndexBuffer

• `Private` **particleIndexBuffer**: `Float32Array`

#### Defined in

[packages/particles-poc/src/index.ts:166](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L166)

___

### particleReferences

• `Private` **particleReferences**: `Float32Array`

#### Defined in

[packages/particles-poc/src/index.ts:167](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L167)

___

### particleStateResolution

• `Private` **particleStateResolution**: `number`

#### Defined in

[packages/particles-poc/src/index.ts:158](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L158)

___

### particleStateTexture0

• `Private` **particleStateTexture0**: `Texture2D`

#### Defined in

[packages/particles-poc/src/index.ts:161](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L161)

___

### particleStateTexture1

• `Private` **particleStateTexture1**: `Texture2D`

#### Defined in

[packages/particles-poc/src/index.ts:162](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L162)

___

### pointing

• `Private` **pointing**: `boolean`

#### Defined in

[packages/particles-poc/src/index.ts:156](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L156)

___

### quadBuffer

• `Private` **quadBuffer**: `Float32Array`

#### Defined in

[packages/particles-poc/src/index.ts:168](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L168)

___

### regl

• `Private` **regl**: `Regl`

#### Defined in

[packages/particles-poc/src/index.ts:160](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L160)

___

### renderingMode

• **renderingMode**: ``"2d"`` \| ``"3d"`` = `'2d'`

#### Defined in

[packages/particles-poc/src/index.ts:152](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L152)

___

### screenTexture

• `Private` **screenTexture**: `Texture2D`

#### Defined in

[packages/particles-poc/src/index.ts:165](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L165)

___

### textureCommand

• `Private` **textureCommand**: `DrawCommand`<`DefaultContext`, {}\>

#### Defined in

[packages/particles-poc/src/index.ts:177](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L177)

___

### type

• **type**: `string` = `'custom'`

#### Defined in

[packages/particles-poc/src/index.ts:151](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L151)

___

### updateCommand

• `Private` **updateCommand**: `DrawCommand`<`DefaultContext`, {}\>

#### Defined in

[packages/particles-poc/src/index.ts:174](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L174)

___

### updatefbo

• `Private` **updatefbo**: `Framebuffer2D`

#### Defined in

[packages/particles-poc/src/index.ts:172](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L172)

___

### windData

• **windData**: `any`

#### Defined in

[packages/particles-poc/src/index.ts:155](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L155)

___

### windTexture

• `Private` **windTexture**: `Texture2D`

#### Defined in

[packages/particles-poc/src/index.ts:163](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L163)

## Methods

### drawParticles

▸ **drawParticles**(`matrix`, `dateLineOffset`, `isGlobal`, `params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `matrix` | `any` |
| `dateLineOffset` | `any` |
| `isGlobal` | `any` |
| `params` | `any` |

#### Returns

`void`

#### Defined in

[packages/particles-poc/src/index.ts:677](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L677)

___

### drawScreen

▸ **drawScreen**(): `void`

#### Returns

`void`

#### Defined in

[packages/particles-poc/src/index.ts:668](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L668)

___

### drawTexture

▸ **drawTexture**(`matrix`, `dateLineOffset`, `isGlobal`, `params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `matrix` | `any` |
| `dateLineOffset` | `any` |
| `isGlobal` | `any` |
| `params` | `any` |

#### Returns

`void`

#### Defined in

[packages/particles-poc/src/index.ts:646](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L646)

___

### getExtent

▸ **getExtent**(): `any`[]

#### Returns

`any`[]

#### Defined in

[packages/particles-poc/src/index.ts:537](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L537)

___

### getSize

▸ **getSize**(): `number`[]

#### Returns

`number`[]

#### Defined in

[packages/particles-poc/src/index.ts:556](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L556)

___

### initialize

▸ **initialize**(): `void`

#### Returns

`void`

#### Defined in

[packages/particles-poc/src/index.ts:271](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L271)

___

### initializeParticles

▸ **initializeParticles**(`count`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `count` | `any` |

#### Returns

`void`

#### Defined in

[packages/particles-poc/src/index.ts:204](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L204)

___

### moveEnd

▸ **moveEnd**(): `void`

#### Returns

`void`

#### Defined in

[packages/particles-poc/src/index.ts:533](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L533)

___

### moveStart

▸ **moveStart**(): `void`

#### Returns

`void`

#### Defined in

[packages/particles-poc/src/index.ts:522](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L522)

___

### onAdd

▸ **onAdd**(`map`, `gl`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `any` |
| `gl` | `WebGLRenderingContext` |

#### Returns

`void`

#### Defined in

[packages/particles-poc/src/index.ts:255](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L255)

___

### onRemove

▸ **onRemove**(`map`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `any` |

#### Returns

`void`

#### Defined in

[packages/particles-poc/src/index.ts:608](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L608)

___

### prerender

▸ **prerender**(`gl`, `projectionMatrix`, `projection`, `globeToMercMatrix`, `transition`, `centerInMercator`, `pixelsPerMeterRatio`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `any` |
| `projectionMatrix` | `any` |
| `projection` | `any` |
| `globeToMercMatrix` | `any` |
| `transition` | `any` |
| `centerInMercator` | `any` |
| `pixelsPerMeterRatio` | `any` |

#### Returns

`void`

#### Defined in

[packages/particles-poc/src/index.ts:722](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L722)

___

### render

▸ **render**(`gl`, `projectionMatrix`, `projection`, `globeToMercMatrix`, `transition`, `centerInMercator`, `pixelsPerMeterRatio`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `any` |
| `projectionMatrix` | `any` |
| `projection` | `any` |
| `globeToMercMatrix` | `any` |
| `transition` | `any` |
| `centerInMercator` | `any` |
| `pixelsPerMeterRatio` | `any` |

#### Returns

`void`

#### Defined in

[packages/particles-poc/src/index.ts:745](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L745)

___

### reset

▸ **reset**(`flag?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `flag?` | `boolean` |

#### Returns

`void`

#### Defined in

[packages/particles-poc/src/index.ts:564](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L564)

___

### resize

▸ **resize**(): `void`

#### Returns

`void`

#### Defined in

[packages/particles-poc/src/index.ts:595](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L595)

___

### setWind

▸ **setWind**(`windData`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `windData` | `any` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[packages/particles-poc/src/index.ts:239](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L239)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Defined in

[packages/particles-poc/src/index.ts:614](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L614)

___

### updateOptions

▸ **updateOptions**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`ParticlesLayerOptions`\> |

#### Returns

`void`

#### Defined in

[packages/particles-poc/src/index.ts:195](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L195)

___

### zoom

▸ **zoom**(): `void`

#### Returns

`void`

#### Defined in

[packages/particles-poc/src/index.ts:560](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/particles-poc/src/index.ts#L560)
