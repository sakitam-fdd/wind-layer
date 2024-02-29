---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [gl-core/src](../modules/gl_core_src.md) / TileSource

# Class: TileSource

[gl-core/src](../modules/gl_core_src.md).TileSource

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
| `options` | [`TileSourceOptions`](../interfaces/gl_core_src.TileSourceOptions.md) |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/gl-core/src/source/tile.ts:96](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L96)

## Properties

### #loaded

• `Private` **#loaded**: `boolean` = `false`

#### Defined in

[packages/gl-core/src/source/tile.ts:92](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L92)

___

### #sourceCache

• `Private` **#sourceCache**: `default`

#### Defined in

[packages/gl-core/src/source/tile.ts:93](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L93)

___

### #tileWorkers

• `Private` **#tileWorkers**: `Map`<`string`, `any`\>

#### Defined in

[packages/gl-core/src/source/tile.ts:94](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L94)

___

### dispatcher

• **dispatcher**: `any`

#### Defined in

[packages/gl-core/src/source/tile.ts:81](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L81)

___

### id

• **id**: `string`

数据源 id

#### Defined in

[packages/gl-core/src/source/tile.ts:38](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L38)

___

### layer

• **layer**: `WithNull`<[`BaseLayer`](gl_core_src.BaseLayer.md)\>

#### Defined in

[packages/gl-core/src/source/tile.ts:83](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L83)

___

### maxZoom

• **maxZoom**: `number`

支持的最大层级

#### Defined in

[packages/gl-core/src/source/tile.ts:53](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L53)

___

### minZoom

• **minZoom**: `number`

支持的最小层级

#### Defined in

[packages/gl-core/src/source/tile.ts:48](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L48)

___

### options

• **options**: [`TileSourceOptions`](../interfaces/gl_core_src.TileSourceOptions.md)

配置项

#### Defined in

[packages/gl-core/src/source/tile.ts:77](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L77)

___

### parseOptions

• **parseOptions**: [`ParseOptionsType`](../modules/gl_core_src.md#parseoptionstype)

#### Defined in

[packages/gl-core/src/source/tile.ts:90](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L90)

___

### renderer

• **renderer**: `Renderer`

#### Defined in

[packages/gl-core/src/source/tile.ts:79](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L79)

___

### roundZoom

• **roundZoom**: `boolean` = `false`

生成瓦片时的配置

#### Defined in

[packages/gl-core/src/source/tile.ts:58](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L58)

___

### scheme

• **scheme**: ``"xyz"`` \| ``"tms"``

瓦片规范

#### Defined in

[packages/gl-core/src/source/tile.ts:63](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L63)

___

### tileBounds

• **tileBounds**: `undefined` \| [`Bounds`](../modules/gl_core_src.md#bounds)

#### Defined in

[packages/gl-core/src/source/tile.ts:72](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L72)

___

### tileSize

• **tileSize**: `number`

瓦片大小

#### Defined in

[packages/gl-core/src/source/tile.ts:70](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L70)

___

### type

• **type**: [`tile`](../enums/gl_core_src.LayerSourceType.md#tile)

数据源类型

#### Defined in

[packages/gl-core/src/source/tile.ts:43](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L43)

___

### url

• **url**: `string` \| `string`[]

#### Defined in

[packages/gl-core/src/source/tile.ts:65](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L65)

___

### wrapX

• **wrapX**: `boolean`

是否跨世界渲染

#### Defined in

[packages/gl-core/src/source/tile.ts:88](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L88)

## Accessors

### sourceCache

• `get` **sourceCache**(): `default`

#### Returns

`default`

#### Defined in

[packages/gl-core/src/source/tile.ts:122](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L122)

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

[packages/gl-core/src/source/tile.ts:294](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L294)

___

### asyncActor

▸ **asyncActor**(`tile`, `url`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tile` | [`Tile`](gl_core_src.Tile.md) |
| `url` | `string` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[packages/gl-core/src/source/tile.ts:211](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L211)

___

### clear

▸ **clear**(): [`TileSource`](gl_core_src.TileSource.md)

清空所有的订阅者

#### Returns

[`TileSource`](gl_core_src.TileSource.md)

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

[packages/gl-core/src/source/tile.ts:329](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L329)

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

[packages/gl-core/src/source/tile.ts:176](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L176)

___

### getTileUrl

▸ **getTileUrl**(`tileID`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `tileID` | [`TileID`](gl_core_src.TileID.md) |

#### Returns

`string`[]

#### Defined in

[packages/gl-core/src/source/tile.ts:233](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L233)

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

[packages/gl-core/src/source/tile.ts:180](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L180)

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
| `coord` | [`TileID`](gl_core_src.TileID.md) |

#### Returns

`boolean`

#### Defined in

[packages/gl-core/src/source/tile.ts:172](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L172)

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

[packages/gl-core/src/source/tile.ts:148](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L148)

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

[packages/gl-core/src/source/tile.ts:248](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L248)

___

### loaded

▸ **loaded**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/gl-core/src/source/tile.ts:156](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L156)

___

### off

▸ **off**(`type`, `handler?`, `context?`): [`TileSource`](gl_core_src.TileSource.md)

取消监听

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `any` |
| `handler?` | `any` |
| `context?` | `any` |

#### Returns

[`TileSource`](gl_core_src.TileSource.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:154

___

### on

▸ **on**(`type`, `handler`, `context?`): [`TileSource`](gl_core_src.TileSource.md)

添加订阅者

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `any` | 事件类型 |
| `handler` | `any` | 回调函数 |
| `context?` | `any` | 上下文 |

#### Returns

[`TileSource`](gl_core_src.TileSource.md)

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

[packages/gl-core/src/source/tile.ts:126](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L126)

___

### once

▸ **once**(`type`, `handler`, `context?`): [`TileSource`](gl_core_src.TileSource.md)

添加一次性订阅者

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `any` |
| `handler` | `any` |
| `context?` | `any` |

#### Returns

[`TileSource`](gl_core_src.TileSource.md)

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

[packages/gl-core/src/source/tile.ts:138](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L138)

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

[packages/gl-core/src/source/tile.ts:160](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L160)

___

### unloadTile

▸ **unloadTile**(`tile`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tile` | [`Tile`](gl_core_src.Tile.md) |
| `callback` | `any` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/source/tile.ts:323](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L323)

___

### update

▸ **update**(`data`, `clear?`): [`TileSource`](gl_core_src.TileSource.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `TileSourceInterval` | `undefined` |
| `clear` | `boolean` | `true` |

#### Returns

[`TileSource`](gl_core_src.TileSource.md)

#### Defined in

[packages/gl-core/src/source/tile.ts:131](https://github.com/sakitam-fdd/wind-layer/blob/a0de2bd/packages/gl-core/src/source/tile.ts#L131)
