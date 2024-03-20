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

[packages/gl-core/src/renderer/index.ts:205](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L205)

## Properties

### #colorRampTexture

• `Private` **#colorRampTexture**: `DataTexture`

#### Defined in

[packages/gl-core/src/renderer/index.ts:201](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L201)

___

### #colorRange

• `Private` **#colorRange**: `Vector2`

#### Defined in

[packages/gl-core/src/renderer/index.ts:200](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L200)

___

### #dropRate

• `Private` **#dropRate**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:196](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L196)

___

### #dropRateBump

• `Private` **#dropRateBump**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:197](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L197)

___

### #fadeOpacity

• `Private` **#fadeOpacity**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:195](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L195)

___

### #maskPass

• `Private` **#maskPass**: `default`

#### Defined in

[packages/gl-core/src/renderer/index.ts:203](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L203)

___

### #nextStencilID

• `Private` **#nextStencilID**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:202](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L202)

___

### #numParticles

• `Private` **#numParticles**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:193](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L193)

___

### #opacity

• `Private` **#opacity**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:192](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L192)

___

### #size

• `Private` **#size**: [`number`, `number`]

#### Defined in

[packages/gl-core/src/renderer/index.ts:199](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L199)

___

### #space

• `Private` **#space**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:198](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L198)

___

### #speedFactor

• `Private` **#speedFactor**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:194](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L194)

___

### dispatcher

• `Private` `Readonly` **dispatcher**: `any`

#### Defined in

[packages/gl-core/src/renderer/index.ts:183](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L183)

___

### options

• `Private` **options**: [`BaseLayerOptions`](../interfaces/gl_core_src.BaseLayerOptions.md)

#### Defined in

[packages/gl-core/src/renderer/index.ts:178](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L178)

___

### raf

• `Private` **raf**: `Raf`

#### Defined in

[packages/gl-core/src/renderer/index.ts:185](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L185)

___

### renderPipeline

• `Private` **renderPipeline**: `WithNull`<`default`\>

#### Defined in

[packages/gl-core/src/renderer/index.ts:180](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L180)

___

### renderer

• `Private` `Readonly` **renderer**: `Renderer`

#### Defined in

[packages/gl-core/src/renderer/index.ts:182](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L182)

___

### scene

• `Private` `Readonly` **scene**: `Scene`

#### Defined in

[packages/gl-core/src/renderer/index.ts:181](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L181)

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

[packages/gl-core/src/renderer/index.ts:186](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L186)

___

### source

• `Private` `Readonly` **source**: [`SourceType`](../modules/gl_core_src.md#sourcetype)

#### Defined in

[packages/gl-core/src/renderer/index.ts:184](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L184)

___

### uid

• `Private` `Readonly` **uid**: `string`

#### Defined in

[packages/gl-core/src/renderer/index.ts:179](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L179)

## Methods

### buildColorRamp

▸ **buildColorRamp**(): `void`

构建渲染所需色带

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:557](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L557)

___

### clearStencil

▸ **clearStencil**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:580](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L580)

___

### destroy

▸ **destroy**(): `void`

销毁此 Renderer

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:805](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L805)

___

### handleZoom

▸ **handleZoom**(): `void`

处理地图缩放事件

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:550](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L550)

___

### initialize

▸ **initialize**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:274](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L274)

___

### moveEnd

▸ **moveEnd**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:653](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L653)

___

### moveStart

▸ **moveStart**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:634](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L634)

___

### onTileLoaded

▸ **onTileLoaded**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:689](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L689)

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

[packages/gl-core/src/renderer/index.ts:520](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L520)

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

[packages/gl-core/src/renderer/index.ts:729](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L729)

___

### prerender

▸ **prerender**(`cameras`, `renderTarget?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cameras` | `any` |
| `renderTarget?` | `any` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:736](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L736)

___

### render

▸ **render**(`cameras`, `renderTarget?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cameras` | `any` |
| `renderTarget?` | `any` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:767](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L767)

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

[packages/gl-core/src/renderer/index.ts:439](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L439)

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

[packages/gl-core/src/renderer/index.ts:488](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L488)

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

[packages/gl-core/src/renderer/index.ts:496](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L496)

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

[packages/gl-core/src/renderer/index.ts:480](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L480)

___

### setFillColor

▸ **setFillColor**(): `void`

设置填色色阶

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:448](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L448)

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

[packages/gl-core/src/renderer/index.ts:695](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L695)

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

[packages/gl-core/src/renderer/index.ts:464](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L464)

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

[packages/gl-core/src/renderer/index.ts:456](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L456)

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

[packages/gl-core/src/renderer/index.ts:472](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L472)

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

[packages/gl-core/src/renderer/index.ts:512](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L512)

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

[packages/gl-core/src/renderer/index.ts:504](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L504)

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

[packages/gl-core/src/renderer/index.ts:584](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L584)

___

### update

▸ **update**(): `void`

更新视野内的瓦片

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:678](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L678)

___

### updateOptions

▸ **updateOptions**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<[`UserOptions`](../interfaces/gl_core_src.UserOptions.md)\> |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/renderer/index.ts:425](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L425)
