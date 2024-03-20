---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [gl-core/src](../modules/gl_core_src.md) / ImageSource

# Class: ImageSource

[gl-core/src](../modules/gl_core_src.md).ImageSource

## Hierarchy

- `EventEmitter`

  ↳ **`ImageSource`**

## Constructors

### constructor

• **new ImageSource**(`id`, `options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `options` | [`ImageSourceOptions`](../interfaces/gl_core_src.ImageSourceOptions.md) |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/gl-core/src/source/image.ts:78](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L78)

## Properties

### #loaded

• `Private` **#loaded**: `boolean` = `false`

#### Defined in

[packages/gl-core/src/source/image.ts:74](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L74)

___

### #sourceCache

• `Private` **#sourceCache**: `default`

#### Defined in

[packages/gl-core/src/source/image.ts:75](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L75)

___

### #tileWorkers

• `Private` **#tileWorkers**: `Map`<`string`, `any`\>

#### Defined in

[packages/gl-core/src/source/image.ts:76](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L76)

___

### coordinates

• **coordinates**: [`Coordinates`](../modules/gl_core_src.md#coordinates)

影像坐标

#### Defined in

[packages/gl-core/src/source/image.ts:67](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L67)

___

### dispatcher

• **dispatcher**: `any`

#### Defined in

[packages/gl-core/src/source/image.ts:58](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L58)

___

### id

• **id**: `string`

数据源 id

#### Defined in

[packages/gl-core/src/source/image.ts:22](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L22)

___

### layer

• **layer**: `WithNull`<[`BaseLayer`](gl_core_src.BaseLayer.md)\>

#### Defined in

[packages/gl-core/src/source/image.ts:60](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L60)

___

### maxZoom

• **maxZoom**: `number`

支持的最大层级

#### Defined in

[packages/gl-core/src/source/image.ts:37](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L37)

___

### minZoom

• **minZoom**: `number`

支持的最小层级

#### Defined in

[packages/gl-core/src/source/image.ts:32](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L32)

___

### options

• **options**: [`ImageSourceOptions`](../interfaces/gl_core_src.ImageSourceOptions.md)

配置项

#### Defined in

[packages/gl-core/src/source/image.ts:52](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L52)

___

### parseOptions

• **parseOptions**: [`ParseOptionsType`](../modules/gl_core_src.md#parseoptionstype)

#### Defined in

[packages/gl-core/src/source/image.ts:62](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L62)

___

### renderer

• **renderer**: `Renderer`

#### Defined in

[packages/gl-core/src/source/image.ts:56](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L56)

___

### roundZoom

• **roundZoom**: `boolean` = `false`

是否对层级进行四舍五入

#### Defined in

[packages/gl-core/src/source/image.ts:42](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L42)

___

### tileSize

• **tileSize**: `number`

瓦片大小

#### Defined in

[packages/gl-core/src/source/image.ts:47](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L47)

___

### type

• **type**: [`image`](../enums/gl_core_src.LayerSourceType.md#image)

数据源类型

#### Defined in

[packages/gl-core/src/source/image.ts:27](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L27)

___

### url

• **url**: `string` \| [`string`, `string`]

#### Defined in

[packages/gl-core/src/source/image.ts:54](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L54)

___

### wrapX

• **wrapX**: `boolean`

是否跨世界渲染

#### Defined in

[packages/gl-core/src/source/image.ts:72](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L72)

## Accessors

### sourceCache

• `get` **sourceCache**(): `default`

#### Returns

`default`

#### Defined in

[packages/gl-core/src/source/image.ts:102](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L102)

## Methods

### abortTile

▸ **abortTile**(`tile`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tile` | [`Tile`](gl_core_src.Tile.md) |
| `callback` | `any` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/image.ts:249](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L249)

___

### asyncActor

▸ **asyncActor**(`tile`, `url`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tile` | `any` |
| `url` | `any` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[packages/gl-core/src/source/image.ts:135](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L135)

___

### clear

▸ **clear**(): [`ImageSource`](gl_core_src.ImageSource.md)

清空所有的订阅者

#### Returns

[`ImageSource`](gl_core_src.ImageSource.md)

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

[packages/gl-core/src/source/image.ts:281](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L281)

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

[packages/gl-core/src/source/image.ts:245](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L245)

___

### getTileUrl

▸ **getTileUrl**(`tileID`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `tileID` | `any` |

#### Returns

`string`[]

#### Defined in

[packages/gl-core/src/source/image.ts:185](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L185)

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

### hasTile

▸ **hasTile**(`coord`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `coord` | `any` |

#### Returns

`boolean`

#### Defined in

[packages/gl-core/src/source/image.ts:241](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L241)

___

### load

▸ **load**(`cb?`): `void`

兼容 TileJSON 加载，需要具体实现

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | `any` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/image.ts:161](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L161)

___

### loadTile

▸ **loadTile**(`tile`, `callback`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tile` | [`Tile`](gl_core_src.Tile.md) |
| `callback` | `any` |

#### Returns

`any`

#### Defined in

[packages/gl-core/src/source/image.ts:193](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L193)

___

### loaded

▸ **loaded**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/gl-core/src/source/image.ts:169](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L169)

___

### off

▸ **off**(`type`, `handler?`, `context?`): [`ImageSource`](gl_core_src.ImageSource.md)

取消监听

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `any` |
| `handler?` | `any` |
| `context?` | `any` |

#### Returns

[`ImageSource`](gl_core_src.ImageSource.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:154

___

### on

▸ **on**(`type`, `handler`, `context?`): [`ImageSource`](gl_core_src.ImageSource.md)

添加订阅者

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `any` | 事件类型 |
| `handler` | `any` | 回调函数 |
| `context?` | `any` | 上下文 |

#### Returns

[`ImageSource`](gl_core_src.ImageSource.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:140

___

### onAdd

▸ **onAdd**(`layer`, `cb?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `layer` | `any` |
| `cb?` | `any` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/image.ts:106](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L106)

___

### once

▸ **once**(`type`, `handler`, `context?`): [`ImageSource`](gl_core_src.ImageSource.md)

添加一次性订阅者

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `any` |
| `handler` | `any` |
| `context?` | `any` |

#### Returns

[`ImageSource`](gl_core_src.ImageSource.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:147

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

[packages/gl-core/src/source/image.ts:111](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L111)

___

### reload

▸ **reload**(`clear`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `clear` | `any` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/image.ts:173](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L173)

___

### setCoordinates

▸ **setCoordinates**(`coordinates`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinates` | [`Coordinates`](../modules/gl_core_src.md#coordinates) |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/image.ts:130](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L130)

___

### unloadTile

▸ **unloadTile**(`tile`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tile` | `any` |
| `cb` | `any` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/image.ts:279](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L279)

___

### update

▸ **update**(`data`, `clear?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `ImageSourceInterval` | `undefined` |
| `clear` | `boolean` | `true` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/image.ts:117](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L117)

___

### updateImage

▸ **updateImage**(`options`, `clear?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | `Pick`<[`ImageSourceOptions`](../interfaces/gl_core_src.ImageSourceOptions.md), ``"url"`` \| ``"coordinates"``\> | `undefined` |
| `clear` | `boolean` | `true` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/image.ts:122](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/source/image.ts#L122)
