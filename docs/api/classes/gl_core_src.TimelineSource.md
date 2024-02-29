---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [gl-core/src](../modules/gl_core_src.md) / TimelineSource

# Class: TimelineSource

[gl-core/src](../modules/gl_core_src.md).TimelineSource

## Hierarchy

- `EventEmitter`

  ↳ **`TimelineSource`**

## Constructors

### constructor

• **new TimelineSource**(`id`, `options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `options` | `TimelineSourceOptions` |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/gl-core/src/source/Timeline.ts:139](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L139)

## Properties

### #cache

• `Private` **#cache**: `Map`<`string`, `any`\>

#### Defined in

[packages/gl-core/src/source/Timeline.ts:137](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L137)

___

### #current

• `Private` **#current**: [`ImageSource`](gl_core_src.ImageSource.md) \| [`TileSource`](gl_core_src.TileSource.md)

#### Defined in

[packages/gl-core/src/source/Timeline.ts:129](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L129)

___

### #fadeTime

• `Private` **#fadeTime**: `number` = `0`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:133](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L133)

___

### #index

• `Private` **#index**: `number`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:132](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L132)

___

### #loaded

• `Private` **#loaded**: `boolean` = `false`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:126](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L126)

___

### #next

• `Private` **#next**: [`ImageSource`](gl_core_src.ImageSource.md) \| [`TileSource`](gl_core_src.TileSource.md)

#### Defined in

[packages/gl-core/src/source/Timeline.ts:130](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L130)

___

### #sourceCache

• `Private` **#sourceCache**: `default`[]

#### Defined in

[packages/gl-core/src/source/Timeline.ts:127](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L127)

___

### #track

• `Private` **#track**: `default`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:135](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L135)

___

### coordinates

• **coordinates**: `WithUndef`<[`Coordinates`](../modules/gl_core_src.md#coordinates)\>

影像坐标

#### Defined in

[packages/gl-core/src/source/Timeline.ts:102](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L102)

___

### dispatcher

• **dispatcher**: `any`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:116](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L116)

___

### id

• **id**: `string`

数据源 id

#### Defined in

[packages/gl-core/src/source/Timeline.ts:72](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L72)

___

### intervals

• **intervals**: (`ImageSourceInterval` \| `TileSourceInterval`)[]

#### Defined in

[packages/gl-core/src/source/Timeline.ts:124](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L124)

___

### layer

• **layer**: `WithNull`<[`BaseLayer`](gl_core_src.BaseLayer.md)\>

#### Defined in

[packages/gl-core/src/source/Timeline.ts:118](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L118)

___

### maxZoom

• **maxZoom**: `number`

支持的最大层级

#### Defined in

[packages/gl-core/src/source/Timeline.ts:87](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L87)

___

### minZoom

• **minZoom**: `number`

支持的最小层级

#### Defined in

[packages/gl-core/src/source/Timeline.ts:82](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L82)

___

### options

• **options**: `TimelineSourceOptions`

配置项

#### Defined in

[packages/gl-core/src/source/Timeline.ts:107](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L107)

___

### parseOptions

• **parseOptions**: [`ParseOptionsType`](../modules/gl_core_src.md#parseoptionstype)

#### Defined in

[packages/gl-core/src/source/Timeline.ts:120](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L120)

___

### renderer

• **renderer**: `Renderer`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:114](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L114)

___

### roundZoom

• **roundZoom**: `boolean` = `false`

生成瓦片时的配置

#### Defined in

[packages/gl-core/src/source/Timeline.ts:92](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L92)

___

### tileBounds

• **tileBounds**: `undefined` \| [`Bounds`](../modules/gl_core_src.md#bounds)

#### Defined in

[packages/gl-core/src/source/Timeline.ts:122](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L122)

___

### tileSize

• **tileSize**: `number`

瓦片大小

#### Defined in

[packages/gl-core/src/source/Timeline.ts:97](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L97)

___

### type

• **type**: [`timeline`](../enums/gl_core_src.LayerSourceType.md#timeline)

数据源类型

#### Defined in

[packages/gl-core/src/source/Timeline.ts:77](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L77)

___

### wrapX

• **wrapX**: `boolean`

是否跨世界渲染

#### Defined in

[packages/gl-core/src/source/Timeline.ts:112](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L112)

## Accessors

### cache

• `get` **cache**(): `Map`<`string`, `any`\>

#### Returns

`Map`<`string`, `any`\>

#### Defined in

[packages/gl-core/src/source/Timeline.ts:255](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L255)

___

### privateType

• `get` **privateType**(): [`LayerSourceType`](../enums/gl_core_src.LayerSourceType.md)

#### Returns

[`LayerSourceType`](../enums/gl_core_src.LayerSourceType.md)

#### Defined in

[packages/gl-core/src/source/Timeline.ts:251](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L251)

___

### source

• `get` **source**(): ([`ImageSource`](gl_core_src.ImageSource.md) \| [`TileSource`](gl_core_src.TileSource.md))[]

#### Returns

([`ImageSource`](gl_core_src.ImageSource.md) \| [`TileSource`](gl_core_src.TileSource.md))[]

#### Defined in

[packages/gl-core/src/source/Timeline.ts:259](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L259)

___

### sourceCache

• `get` **sourceCache**(): `default`[]

#### Returns

`default`[]

#### Defined in

[packages/gl-core/src/source/Timeline.ts:263](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L263)

___

### track

• `get` **track**(): `default`

#### Returns

`default`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:247](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L247)

## Methods

### animate

▸ **animate**(`__namedParameters`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:304](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L304)

___

### clear

▸ **clear**(): [`TimelineSource`](gl_core_src.TimelineSource.md)

清空所有的订阅者

#### Returns

[`TimelineSource`](gl_core_src.TimelineSource.md)

#### Inherited from

EventEmitter.clear

#### Defined in

node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:165

___

### destroy

▸ **destroy**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:387](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L387)

___

### emit

▸ **emit**(`type`, `args?`): `any`

触发事件

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `any` |
| `args?` | `any` |

#### Returns

`any`

#### Inherited from

EventEmitter.emit

#### Defined in

node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:160

___

### getFadeTime

▸ **getFadeTime**(): `number`

#### Returns

`number`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:296](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L296)

___

### has

▸ **has**(`type`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `any` |

#### Returns

`any`

#### Inherited from

EventEmitter.has

#### Defined in

node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:161

___

### load

▸ **load**(`cb?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | `any` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:363](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L363)

___

### loaded

▸ **loaded**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:383](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L383)

___

### off

▸ **off**(`type`, `handler?`, `context?`): [`TimelineSource`](gl_core_src.TimelineSource.md)

取消监听

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `any` |
| `handler?` | `any` |
| `context?` | `any` |

#### Returns

[`TimelineSource`](gl_core_src.TimelineSource.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:154

___

### on

▸ **on**(`type`, `handler`, `context?`): [`TimelineSource`](gl_core_src.TimelineSource.md)

添加订阅者

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `any` | 事件类型 |
| `handler` | `any` | 回调函数 |
| `context?` | `any` | 上下文 |

#### Returns

[`TimelineSource`](gl_core_src.TimelineSource.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:140

___

### onAdd

▸ **onAdd**(`layer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `layer` | `any` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:267](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L267)

___

### once

▸ **once**(`type`, `handler`, `context?`): [`TimelineSource`](gl_core_src.TimelineSource.md)

添加一次性订阅者

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `any` |
| `handler` | `any` |
| `context?` | `any` |

#### Returns

[`TimelineSource`](gl_core_src.TimelineSource.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:147

___

### pause

▸ **pause**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:343](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L343)

___

### play

▸ **play**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:338](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L338)

___

### prepare

▸ **prepare**(`renderer`, `dispatcher`, `parseOptions`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `Renderer` |
| `dispatcher` | `any` |
| `parseOptions` | [`ParseOptionsType`](../modules/gl_core_src.md#parseoptionstype) |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:284](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L284)

___

### restart

▸ **restart**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:358](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L358)

___

### resume

▸ **resume**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:348](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L348)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:353](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L353)

___

### tilesLoadEnd

▸ **tilesLoadEnd**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/Timeline.ts:300](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/Timeline.ts#L300)
