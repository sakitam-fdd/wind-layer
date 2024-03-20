---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [maptalks/src](../modules/maptalks_src.md) / TileSource

# Class: TileSource

[maptalks/src](../modules/maptalks_src.md).TileSource

## Hierarchy

- `EventEmitter`

  ↳ **`TileSource`**

## Constructors

### constructor

• **new TileSource**(`id`, `options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `options` | `TileSourceOptions` |

#### Overrides

EventEmitter.constructor

#### Defined in

packages/gl-core/dist/index.d.ts:653

## Properties

### #private

• `Private` **#private**: `any`

#### Defined in

packages/gl-core/dist/index.d.ts:610

___

### dispatcher

• **dispatcher**: `any`

#### Defined in

packages/gl-core/dist/index.d.ts:646

___

### id

• **id**: `string`

数据源 id

#### Defined in

packages/gl-core/dist/index.d.ts:614

___

### layer

• **layer**: `WithNull`<`BaseLayer`\>

#### Defined in

packages/gl-core/dist/index.d.ts:647

___

### maxZoom

• **maxZoom**: `number`

支持的最大层级

#### Defined in

packages/gl-core/dist/index.d.ts:626

___

### minZoom

• **minZoom**: `number`

支持的最小层级

#### Defined in

packages/gl-core/dist/index.d.ts:622

___

### options

• **options**: `TileSourceOptions`

配置项

#### Defined in

packages/gl-core/dist/index.d.ts:644

___

### parseOptions

• **parseOptions**: `ParseOptionsType`

#### Defined in

packages/gl-core/dist/index.d.ts:652

___

### renderer

• **renderer**: `Renderer`

#### Defined in

packages/gl-core/dist/index.d.ts:645

___

### roundZoom

• **roundZoom**: `boolean`

生成瓦片时的配置

#### Defined in

packages/gl-core/dist/index.d.ts:630

___

### scheme

• **scheme**: ``"xyz"`` \| ``"tms"``

瓦片规范

#### Defined in

packages/gl-core/dist/index.d.ts:634

___

### tileBounds

• **tileBounds**: `undefined` \| `Bounds`

#### Defined in

packages/gl-core/dist/index.d.ts:640

___

### tileSize

• **tileSize**: `number`

瓦片大小

#### Defined in

packages/gl-core/dist/index.d.ts:639

___

### type

• **type**: [`tile`](../enums/maptalks_src.LayerSourceType.md#tile)

数据源类型

#### Defined in

packages/gl-core/dist/index.d.ts:618

___

### url

• **url**: `string` \| `string`[]

#### Defined in

packages/gl-core/dist/index.d.ts:635

___

### wrapX

• **wrapX**: `boolean`

是否跨世界渲染

#### Defined in

packages/gl-core/dist/index.d.ts:651

## Accessors

### sourceCache

• `get` **sourceCache**(): `SourceCache`

#### Returns

`SourceCache`

#### Defined in

packages/gl-core/dist/index.d.ts:654

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

packages/gl-core/dist/index.d.ts:671

___

### asyncActor

▸ **asyncActor**(`tile`, `url`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tile` | `Tile` |
| `url` | `string` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

packages/gl-core/dist/index.d.ts:668

___

### clear

▸ **clear**(): [`TileSource`](maptalks_src.TileSource.md)

清空所有的订阅者

#### Returns

[`TileSource`](maptalks_src.TileSource.md)

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

packages/gl-core/dist/index.d.ts:673

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

packages/gl-core/dist/index.d.ts:666

___

### getTileUrl

▸ **getTileUrl**(`tileID`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `tileID` | [`TileID`](maptalks_src.TileID.md) |

#### Returns

`string`[]

#### Defined in

packages/gl-core/dist/index.d.ts:669

___

### getUrl

▸ **getUrl**(`x`, `y`, `z`): `string` \| `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Returns

`string` \| `string`[]

#### Defined in

packages/gl-core/dist/index.d.ts:667

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
| `coord` | [`TileID`](maptalks_src.TileID.md) |

#### Returns

`boolean`

#### Defined in

packages/gl-core/dist/index.d.ts:665

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

packages/gl-core/dist/index.d.ts:662

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

packages/gl-core/dist/index.d.ts:670

___

### loaded

▸ **loaded**(): `boolean`

#### Returns

`boolean`

#### Defined in

packages/gl-core/dist/index.d.ts:663

___

### off

▸ **off**(`type`, `handler?`, `context?`): [`TileSource`](maptalks_src.TileSource.md)

取消监听

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `any` |
| `handler?` | `any` |
| `context?` | `any` |

#### Returns

[`TileSource`](maptalks_src.TileSource.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:154

___

### on

▸ **on**(`type`, `handler`, `context?`): [`TileSource`](maptalks_src.TileSource.md)

添加订阅者

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `any` | 事件类型 |
| `handler` | `any` | 回调函数 |
| `context?` | `any` | 上下文 |

#### Returns

[`TileSource`](maptalks_src.TileSource.md)

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

packages/gl-core/dist/index.d.ts:655

___

### once

▸ **once**(`type`, `handler`, `context?`): [`TileSource`](maptalks_src.TileSource.md)

添加一次性订阅者

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `any` |
| `handler` | `any` |
| `context?` | `any` |

#### Returns

[`TileSource`](maptalks_src.TileSource.md)

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
| `parseOptions` | `any` |

#### Returns

`void`

#### Defined in

packages/gl-core/dist/index.d.ts:657

___

### reload

▸ **reload**(`clear`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `clear` | `boolean` |

#### Returns

`void`

#### Defined in

packages/gl-core/dist/index.d.ts:664

___

### unloadTile

▸ **unloadTile**(`tile`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tile` | `Tile` |
| `callback` | `any` |

#### Returns

`void`

#### Defined in

packages/gl-core/dist/index.d.ts:672

___

### update

▸ **update**(`data`, `clear?`): [`TileSource`](maptalks_src.TileSource.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `TileSourceInterval` |
| `clear?` | `boolean` |

#### Returns

[`TileSource`](maptalks_src.TileSource.md)

#### Defined in

packages/gl-core/dist/index.d.ts:656
