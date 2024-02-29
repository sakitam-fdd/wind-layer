---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [gl-core/src](../modules/gl_core_src.md) / BaseLayer

# Class: BaseLayer

[gl-core/src](../modules/gl_core_src.md).BaseLayer

## Constructors

### constructor

• **new BaseLayer**(`source`, `rs`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`SourceType`](../modules/gl_core_src.md#sourcetype) |
| `rs` | `Object` |
| `rs.renderer` | `Renderer` |
| `rs.scene` | `Scene` |
| `options?` | `Partial`<[`BaseLayerOptions`](../interfaces/gl_core_src.BaseLayerOptions.md)\> |

#### Defined in

[packages/gl-core/src/renderer/index.ts:190](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L190)

## Properties

### #colorRampTexture

• `Private` **#colorRampTexture**: `DataTexture`

#### Defined in

[packages/gl-core/src/renderer/index.ts:186](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L186)

___

### #colorRange

• `Private` **#colorRange**: `Vector2`

#### Defined in

[packages/gl-core/src/renderer/index.ts:185](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L185)

___

### #dropRate

• `Private` **#dropRate**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:181](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L181)

___

### #dropRateBump

• `Private` **#dropRateBump**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:182](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L182)

___

### #fadeOpacity

• `Private` **#fadeOpacity**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:180](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L180)

___

### #maskPass

• `Private` **#maskPass**: `default`

#### Defined in

[packages/gl-core/src/renderer/index.ts:188](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L188)

___

### #nextStencilID

• `Private` **#nextStencilID**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:187](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L187)

___

### #numParticles

• `Private` **#numParticles**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:178](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L178)

___

### #opacity

• `Private` **#opacity**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:177](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L177)

___

### #size

• `Private` **#size**: [`number`, `number`]

#### Defined in

[packages/gl-core/src/renderer/index.ts:184](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L184)

___

### #space

• `Private` **#space**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:183](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L183)

___

### #speedFactor

• `Private` **#speedFactor**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:179](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L179)

___

### dispatcher

• `Private` `Readonly` **dispatcher**: `any`

#### Defined in

[packages/gl-core/src/renderer/index.ts:168](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L168)

___

### options

• `Private` **options**: [`BaseLayerOptions`](../interfaces/gl_core_src.BaseLayerOptions.md)

#### Defined in

[packages/gl-core/src/renderer/index.ts:163](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L163)

___

### raf

• `Private` **raf**: `Raf`

#### Defined in

[packages/gl-core/src/renderer/index.ts:170](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L170)

___

### renderPipeline

• `Private` **renderPipeline**: `WithNull`<`default`\>

#### Defined in

[packages/gl-core/src/renderer/index.ts:165](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L165)

___

### renderer

• `Private` `Readonly` **renderer**: `Renderer`

#### Defined in

[packages/gl-core/src/renderer/index.ts:167](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L167)

___

### scene

• `Private` `Readonly` **scene**: `Scene`

#### Defined in

[packages/gl-core/src/renderer/index.ts:166](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L166)

___

### sharedState

• `Private` **sharedState**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `u_bbox` | [`number`, `number`, `number`, `number`] |
| `u_data_bbox` | [`number`, `number`, `number`, `number`] |
| `u_scale` | [`number`, `number`] |

#### Defined in

[packages/gl-core/src/renderer/index.ts:171](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L171)

___

### source

• `Private` `Readonly` **source**: [`SourceType`](../modules/gl_core_src.md#sourcetype)

#### Defined in

[packages/gl-core/src/renderer/index.ts:169](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L169)

___

### uid

• `Private` `Readonly` **uid**: `string`

#### Defined in

[packages/gl-core/src/renderer/index.ts:164](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L164)

## Methods

### buildColorRamp

▸ **buildColorRamp**(): `void`

构建渲染所需色带

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:541](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L541)

___

### clearStencil

▸ **clearStencil**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:564](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L564)

___

### destroy

▸ **destroy**(): `void`

销毁此 Renderer

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:785](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L785)

___

### handleZoom

▸ **handleZoom**(): `void`

处理地图缩放事件

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:534](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L534)

___

### initialize

▸ **initialize**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:259](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L259)

___

### moveEnd

▸ **moveEnd**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:637](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L637)

___

### moveStart

▸ **moveStart**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:618](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L618)

___

### onTileLoaded

▸ **onTileLoaded**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:673](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L673)

___

### parseStyleSpec

▸ **parseStyleSpec**(`clear`): `void`

解析样式配置

#### Parameters

| Name | Type |
| :------ | :------ |
| `clear` | `any` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:504](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L504)

___

### picker

▸ **picker**(`pixel?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pixel` | `number`[] |

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/gl-core/src/renderer/index.ts:713](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L713)

___

### prerender

▸ **prerender**(`cameras`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cameras` | `any` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:720](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L720)

___

### render

▸ **render**(`cameras`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cameras` | `any` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:749](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L749)

___

### resize

▸ **resize**(`width`, `height`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `width` | `number` |
| `height` | `number` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:423](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L423)

___

### setDropRate

▸ **setDropRate**(`dropRate`): `void`

设置粒子图层的粒子数量

#### Parameters

| Name | Type |
| :------ | :------ |
| `dropRate` | `number` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:472](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L472)

___

### setDropRateBump

▸ **setDropRateBump**(`dropRateBump`): `void`

设置粒子图层的粒子数量

#### Parameters

| Name | Type |
| :------ | :------ |
| `dropRateBump` | `number` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:480](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L480)

___

### setFadeOpacity

▸ **setFadeOpacity**(`fadeOpacity`): `void`

设置粒子图层的粒子数量

#### Parameters

| Name | Type |
| :------ | :------ |
| `fadeOpacity` | `number` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:464](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L464)

___

### setFillColor

▸ **setFillColor**(): `void`

设置填色色阶

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:432](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L432)

___

### setMask

▸ **setMask**(`mask`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mask` | `undefined` \| { `data`: `Attributes`[] ; `type`: [`MaskType`](../enums/gl_core_src.MaskType.md)  } |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:679](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L679)

___

### setNumParticles

▸ **setNumParticles**(`numParticles`): `void`

设置粒子图层的粒子数量

#### Parameters

| Name | Type |
| :------ | :------ |
| `numParticles` | `number` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:448](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L448)

___

### setOpacity

▸ **setOpacity**(`opacity`): `void`

设置图层透明度

#### Parameters

| Name | Type |
| :------ | :------ |
| `opacity` | `number` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:440](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L440)

___

### setSpeedFactor

▸ **setSpeedFactor**(`speedFactor`): `void`

设置粒子图层的粒子数量

#### Parameters

| Name | Type |
| :------ | :------ |
| `speedFactor` | `number` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:456](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L456)

___

### setSymbolSize

▸ **setSymbolSize**(`size`): `void`

设置 symbol 的大小

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `any` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:496](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L496)

___

### setSymbolSpace

▸ **setSymbolSpace**(`space`): `void`

设置 symbol 的间距

#### Parameters

| Name | Type |
| :------ | :------ |
| `space` | `any` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:488](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L488)

___

### stencilConfigForOverlap

▸ **stencilConfigForOverlap**(`tiles`): [{ `[_: number]`: `any`;  }, [`Tile`](gl_core_src.Tile.md)[]]

#### Parameters

| Name | Type |
| :------ | :------ |
| `tiles` | `any`[] |

#### Returns

[{ `[_: number]`: `any`;  }, [`Tile`](gl_core_src.Tile.md)[]]

#### Defined in

[packages/gl-core/src/renderer/index.ts:568](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L568)

___

### update

▸ **update**(): `void`

更新视野内的瓦片

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:662](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L662)

___

### updateOptions

▸ **updateOptions**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<[`BaseLayerOptions`](../interfaces/gl_core_src.BaseLayerOptions.md)\> |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:409](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/renderer/index.ts#L409)
