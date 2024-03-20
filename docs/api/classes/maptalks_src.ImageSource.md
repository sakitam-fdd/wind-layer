---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [maptalks/src](../modules/maptalks_src.md) / ImageSource

# Class: ImageSource

[maptalks/src](../modules/maptalks_src.md).ImageSource

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
| `options` | `ImageSourceOptions` |

#### Overrides

EventEmitter.constructor

#### Defined in

packages/gl-core/dist/index.d.ts:468

## Properties

### #private

• `Private` **#private**: `any`

#### Defined in

packages/gl-core/dist/index.d.ts:426

___

### coordinates

• **coordinates**: `Coordinates`

影像坐标

#### Defined in

packages/gl-core/dist/index.d.ts:463

___

### dispatcher

• **dispatcher**: `any`

#### Defined in

packages/gl-core/dist/index.d.ts:457

___

### id

• **id**: `string`

数据源 id

#### Defined in

packages/gl-core/dist/index.d.ts:430

___

### layer

• **layer**: `WithNull`<`BaseLayer`\>

#### Defined in

packages/gl-core/dist/index.d.ts:458

___

### maxZoom

• **maxZoom**: `number`

支持的最大层级

#### Defined in

packages/gl-core/dist/index.d.ts:442

___

### minZoom

• **minZoom**: `number`

支持的最小层级

#### Defined in

packages/gl-core/dist/index.d.ts:438

___

### options

• **options**: `ImageSourceOptions`

配置项

#### Defined in

packages/gl-core/dist/index.d.ts:454

___

### parseOptions

• **parseOptions**: `ParseOptionsType`

#### Defined in

packages/gl-core/dist/index.d.ts:459

___

### renderer

• **renderer**: `Renderer`

#### Defined in

packages/gl-core/dist/index.d.ts:456

___

### roundZoom

• **roundZoom**: `boolean`

是否对层级进行四舍五入

#### Defined in

packages/gl-core/dist/index.d.ts:446

___

### tileSize

• **tileSize**: `number`

瓦片大小

#### Defined in

packages/gl-core/dist/index.d.ts:450

___

### type

• **type**: [`image`](../enums/maptalks_src.LayerSourceType.md#image)

数据源类型

#### Defined in

packages/gl-core/dist/index.d.ts:434

___

### url

• **url**: `string` \| [`string`, `string`]

#### Defined in

packages/gl-core/dist/index.d.ts:455

___

### wrapX

• **wrapX**: `boolean`

是否跨世界渲染

#### Defined in

packages/gl-core/dist/index.d.ts:467

## Accessors

### sourceCache

• `get` **sourceCache**(): `SourceCache`

#### Returns

`SourceCache`

#### Defined in

packages/gl-core/dist/index.d.ts:469

## Methods

### abortTile

▸ **abortTile**(`tile`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tile` | `Tile` |
| `callback` | `any` |

#### Returns

`void`

#### Defined in

packages/gl-core/dist/index.d.ts:487

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

packages/gl-core/dist/index.d.ts:475

___

### clear

▸ **clear**(): [`ImageSource`](maptalks_src.ImageSource.md)

清空所有的订阅者

#### Returns

[`ImageSource`](maptalks_src.ImageSource.md)

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

packages/gl-core/dist/index.d.ts:489

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

packages/gl-core/dist/index.d.ts:486

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

packages/gl-core/dist/index.d.ts:483

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

packages/gl-core/dist/index.d.ts:485

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

packages/gl-core/dist/index.d.ts:480

___

### loadTile

▸ **loadTile**(`tile`, `callback`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tile` | `Tile` |
| `callback` | `any` |

#### Returns

`any`

#### Defined in

packages/gl-core/dist/index.d.ts:484

___

### loaded

▸ **loaded**(): `boolean`

#### Returns

`boolean`

#### Defined in

packages/gl-core/dist/index.d.ts:481

___

### off

▸ **off**(`type`, `handler?`, `context?`): [`ImageSource`](maptalks_src.ImageSource.md)

取消监听

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `any` |
| `handler?` | `any` |
| `context?` | `any` |

#### Returns

[`ImageSource`](maptalks_src.ImageSource.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:154

___

### on

▸ **on**(`type`, `handler`, `context?`): [`ImageSource`](maptalks_src.ImageSource.md)

添加订阅者

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `any` | 事件类型 |
| `handler` | `any` | 回调函数 |
| `context?` | `any` | 上下文 |

#### Returns

[`ImageSource`](maptalks_src.ImageSource.md)

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

packages/gl-core/dist/index.d.ts:470

___

### once

▸ **once**(`type`, `handler`, `context?`): [`ImageSource`](maptalks_src.ImageSource.md)

添加一次性订阅者

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `any` |
| `handler` | `any` |
| `context?` | `any` |

#### Returns

[`ImageSource`](maptalks_src.ImageSource.md)

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
| `parseOptions` | `ParseOptionsType` |

#### Returns

`void`

#### Defined in

packages/gl-core/dist/index.d.ts:471

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

packages/gl-core/dist/index.d.ts:482

___

### setCoordinates

▸ **setCoordinates**(`coordinates`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinates` | `Coordinates` |

#### Returns

`void`

#### Defined in

packages/gl-core/dist/index.d.ts:474

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

packages/gl-core/dist/index.d.ts:488

___

### update

▸ **update**(`data`, `clear?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ImageSourceInterval` |
| `clear?` | `boolean` |

#### Returns

`void`

#### Defined in

packages/gl-core/dist/index.d.ts:472

___

### updateImage

▸ **updateImage**(`options`, `clear?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Pick`<`ImageSourceOptions`, ``"url"`` \| ``"coordinates"``\> |
| `clear?` | `boolean` |

#### Returns

`void`

#### Defined in

packages/gl-core/dist/index.d.ts:473
