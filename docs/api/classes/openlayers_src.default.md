---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [openlayers/src](../modules/openlayers_src.md) / default

# Class: default

[openlayers/src](../modules/openlayers_src.md).default

## Hierarchy

- `Image`

  ↳ **`default`**

## Constructors

### constructor

• **new default**(`data`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `options` | `Partial`<[`IWindOptions`](../interfaces/openlayers_src.IWindOptions.md)\> |

#### Overrides

ol.layer.Image.constructor

#### Defined in

[packages/openlayers/src/index.ts:43](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L43)

## Properties

### canvas

• `Private` **canvas**: `HTMLCanvasElement`

#### Defined in

[packages/openlayers/src/index.ts:36](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L36)

___

### field

• `Private` **field**: `undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

[packages/openlayers/src/index.ts:38](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L38)

___

### options

• `Private` **options**: [`IWindOptions`](../interfaces/openlayers_src.IWindOptions.md)

#### Defined in

[packages/openlayers/src/index.ts:35](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L35)

___

### pixelRatio

• **pixelRatio**: `number`

#### Defined in

[packages/openlayers/src/index.ts:40](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L40)

___

### type

• `Private` **type**: `string`

#### Defined in

[packages/openlayers/src/index.ts:41](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L41)

___

### viewProjection

• **viewProjection**: `ProjectionLike`

#### Defined in

[packages/openlayers/src/index.ts:39](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L39)

___

### wind

• `Private` **wind**: ``null`` \| `WindCore`

#### Defined in

[packages/openlayers/src/index.ts:37](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L37)

## Methods

### appendTo

▸ **appendTo**(`map`): `void`

append layer to map

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map` |

#### Returns

`void`

#### Defined in

[packages/openlayers/src/index.ts:91](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L91)

___

### canvasFunction

▸ **canvasFunction**(`extent`, `resolution`, `pixelRatio`, `size`, `proj`): `HTMLCanvasElement`

#### Parameters

| Name | Type |
| :------ | :------ |
| `extent` | `Extent` |
| `resolution` | `number` |
| `pixelRatio` | `number` |
| `size` | `Size` |
| `proj` | `Projection` |

#### Returns

`HTMLCanvasElement`

#### Defined in

[packages/openlayers/src/index.ts:111](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L111)

___

### changed

▸ **changed**(): `void`

Increases the revision counter and dispatches a 'change' event.

**`Api`**

#### Returns

`void`

#### Inherited from

ol.layer.Image.changed

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:7347

___

### dispatchEvent

▸ **dispatchEvent**(`event`): `void`

Dispatches an event and calls all listeners listening for events
of this type. The event parameter can either be a string or an
Object with a `type` property.

**`Api`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` \| `GlobalObject` \| `Event` | Event object. |

#### Returns

`void`

#### Inherited from

ol.layer.Image.dispatchEvent

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:7357

___

### get

▸ **get**(`key`): `any`

Gets a value.

**`Api`**

stable

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | Key name. |

#### Returns

`any`

Value.

#### Inherited from

ol.layer.Image.get

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:7265

___

### getContext

▸ `Private` **getContext**(): `undefined` \| ``null`` \| `CanvasRenderingContext2D`

#### Returns

`undefined` \| ``null`` \| `CanvasRenderingContext2D`

#### Defined in

[packages/openlayers/src/index.ts:133](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L133)

___

### getData

▸ **getData**(): `undefined` \| [`Field`](maptalks_src.Field.md)

get wind layer data

#### Returns

`undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

[packages/openlayers/src/index.ts:223](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L223)

___

### getExtent

▸ **getExtent**(): `Extent`

Return the ol.Extent extent of the layer or `undefined` if it
will be visible regardless of extent.

**`Observable`**

**`Api`**

stable

#### Returns

`Extent`

The layer extent.

#### Inherited from

ol.layer.Image.getExtent

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:6069

___

### getKeys

▸ **getKeys**(): `string`[]

Get a list of object property names.

**`Api`**

stable

#### Returns

`string`[]

List of property names.

#### Inherited from

ol.layer.Image.getKeys

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:7272

___

### getMap

▸ **getMap**(): `any`

get map

#### Returns

`any`

#### Defined in

[packages/openlayers/src/index.ts:307](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L307)

___

### getMaxResolution

▸ **getMaxResolution**(): `number`

Return the maximum resolution of the layer.

**`Observable`**

**`Api`**

stable

#### Returns

`number`

The maximum resolution of the layer.

#### Inherited from

ol.layer.Image.getMaxResolution

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:6077

___

### getMinResolution

▸ **getMinResolution**(): `number`

Return the minimum resolution of the layer.

**`Observable`**

**`Api`**

stable

#### Returns

`number`

The minimum resolution of the layer.

#### Inherited from

ol.layer.Image.getMinResolution

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:6085

___

### getOpacity

▸ **getOpacity**(): `number`

Return the opacity of the layer (between 0 and 1).

**`Observable`**

**`Api`**

stable

#### Returns

`number`

The opacity of the layer.

#### Inherited from

ol.layer.Image.getOpacity

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:6093

___

### getParams

▸ **getParams**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

[packages/openlayers/src/index.ts:258](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L258)

___

### getProjection

▸ `Private` **getProjection**(): `any`

#### Returns

`any`

#### Defined in

[packages/openlayers/src/index.ts:279](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L279)

___

### getProperties

▸ **getProperties**(): `Object`

Get an object of all property names and values.

**`Api`**

stable

#### Returns

`Object`

Object.

#### Inherited from

ol.layer.Image.getProperties

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:7279

___

### getRevision

▸ **getRevision**(): `number`

Get the version number for this object.  Each time the object is modified,
its version number will be incremented.

**`Api`**

#### Returns

`number`

Revision.

#### Inherited from

ol.layer.Image.getRevision

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:7365

___

### getSource

▸ **getSource**(): `Source`

Get the layer source.

**`Observable`**

**`Api`**

stable

#### Returns

`Source`

The layer source (or `null` if not yet set).

#### Inherited from

ol.layer.Image.getSource

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:6354

___

### getType

▸ **getType**(): `string`

#### Returns

`string`

#### Defined in

[packages/openlayers/src/index.ts:311](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L311)

___

### getVisible

▸ **getVisible**(): `boolean`

Return the visibility of the layer (`true` or `false`).

**`Observable`**

**`Api`**

stable

#### Returns

`boolean`

The visibility of the layer.

#### Inherited from

ol.layer.Image.getVisible

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:6101

___

### getWindOptions

▸ **getWindOptions**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

[packages/openlayers/src/index.ts:275](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L275)

___

### getZIndex

▸ **getZIndex**(): `number`

Return the Z-index of the layer, which is used to order layers before
rendering. The default Z-index is 0.

**`Observable`**

**`Api`**

#### Returns

`number`

The Z-index of the layer.

#### Inherited from

ol.layer.Image.getZIndex

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:6110

___

### intersectsCoordinate

▸ **intersectsCoordinate**(`coordinate`): `boolean`

TODO: 空间判断出错，需要修复

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinate` | [`number`, `number`] |

#### Returns

`boolean`

#### Defined in

[packages/openlayers/src/index.ts:193](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L193)

___

### on

▸ **on**(`type`, `listener`, `opt_this?`): `GlobalObject` \| `GlobalObject`[]

Listen for a certain type of event.

**`Api`**

stable

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` \| `string`[] | The event type or array of event types. |
| `listener` | `EventsListenerFunctionType` | The listener function. |
| `opt_this?` | `GlobalObject` | The object to use as `this` in `listener`. |

#### Returns

`GlobalObject` \| `GlobalObject`[]

Unique key for the listener. If
    called with an array of event types as the first argument, the return
    will be an array of keys.

#### Inherited from

ol.layer.Image.on

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:7377

___

### once

▸ **once**(`type`, `listener`, `opt_this?`): `GlobalObject` \| `GlobalObject`[]

Listen once for a certain type of event.

**`Api`**

stable

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` \| `string`[] | The event type or array of event types. |
| `listener` | `EventsListenerFunctionType` | The listener function. |
| `opt_this?` | `GlobalObject` | The object to use as `this` in `listener`. |

#### Returns

`GlobalObject` \| `GlobalObject`[]

Unique key for the listener. If
    called with an array of event types as the first argument, the return
    will be an array of keys.

#### Inherited from

ol.layer.Image.once

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:7389

___

### pickWindOptions

▸ `Private` **pickWindOptions**(): `void`

#### Returns

`void`

#### Defined in

[packages/openlayers/src/index.ts:208](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L208)

___

### project

▸ **project**(`coordinate`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinate` | [`number`, `number`] |

#### Returns

[`number`, `number`]

#### Defined in

[packages/openlayers/src/index.ts:174](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L174)

___

### render

▸ `Private` **render**(`canvas`): [`default`](openlayers_src.default.md)

render windy layer

#### Parameters

| Name | Type |
| :------ | :------ |
| `canvas` | `HTMLCanvasElement` |

#### Returns

[`default`](openlayers_src.default.md)

#### Defined in

[packages/openlayers/src/index.ts:143](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L143)

___

### set

▸ **set**(`key`, `value`, `opt_silent?`): `void`

Sets a value.

**`Api`**

stable

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | Key name. |
| `value` | `any` | Value. |
| `opt_silent?` | `boolean` | Update without triggering an event. |

#### Returns

`void`

#### Inherited from

ol.layer.Image.set

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:7288

___

### setData

▸ **setData**(`data`, `options?`): [`default`](openlayers_src.default.md)

set layer data

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `options` | `Partial`<`IField`\> |

#### Returns

[`default`](openlayers_src.default.md)

#### Defined in

[packages/openlayers/src/index.ts:233](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L233)

___

### setExtent

▸ **setExtent**(`extent`): `void`

Set the extent at which the layer is visible.  If `undefined`, the layer
will be visible at all extents.

**`Observable`**

**`Api`**

stable

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `extent` | `Extent` | The extent of the layer. |

#### Returns

`void`

#### Inherited from

ol.layer.Image.setExtent

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:6119

___

### setMap

▸ **setMap**(`map`): `void`

set map

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map` |

#### Returns

`void`

#### Overrides

ol.layer.Image.setMap

#### Defined in

[packages/openlayers/src/index.ts:295](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L295)

___

### setMaxResolution

▸ **setMaxResolution**(`maxResolution`): `void`

Set the maximum resolution at which the layer is visible.

**`Observable`**

**`Api`**

stable

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maxResolution` | `number` | The maximum resolution of the layer. |

#### Returns

`void`

#### Inherited from

ol.layer.Image.setMaxResolution

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:6127

___

### setMinResolution

▸ **setMinResolution**(`minResolution`): `void`

Set the minimum resolution at which the layer is visible.

**`Observable`**

**`Api`**

stable

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `minResolution` | `number` | The minimum resolution of the layer. |

#### Returns

`void`

#### Inherited from

ol.layer.Image.setMinResolution

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:6135

___

### setOpacity

▸ **setOpacity**(`opacity`): `void`

Set the opacity of the layer, allowed values range from 0 to 1.

**`Observable`**

**`Api`**

stable

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opacity` | `number` | The opacity of the layer. |

#### Returns

`void`

#### Inherited from

ol.layer.Image.setOpacity

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:6143

___

### setProperties

▸ **setProperties**(`values`, `opt_silent?`): `void`

Sets a collection of key-value pairs.  Note that this changes any existing
properties and adds new ones (it does not remove any existing properties).

**`Api`**

stable

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `Object` | Values. |
| `opt_silent?` | `boolean` | Update without triggering an event. |

#### Returns

`void`

#### Inherited from

ol.layer.Image.setProperties

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:7297

___

### setSource

▸ **setSource**(`source`): `void`

Set the layer source.

**`Observable`**

**`Api`**

stable

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `Source` | The layer source. |

#### Returns

`void`

#### Inherited from

ol.layer.Image.setSource

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:6376

___

### setVisible

▸ **setVisible**(`visible`): `void`

Set the visibility of the layer (`true` or `false`).

**`Observable`**

**`Api`**

stable

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `visible` | `boolean` | The visibility of the layer. |

#### Returns

`void`

#### Inherited from

ol.layer.Image.setVisible

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:6151

___

### setWindOptions

▸ **setWindOptions**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`IOptions`\> |

#### Returns

`void`

#### Defined in

[packages/openlayers/src/index.ts:263](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L263)

___

### setZIndex

▸ **setZIndex**(`zindex`): `void`

Set Z-index of the layer, which is used to order layers before rendering.
The default Z-index is 0.

**`Observable`**

**`Api`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `zindex` | `number` | The z-index of the layer. |

#### Returns

`void`

#### Inherited from

ol.layer.Image.setZIndex

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:6160

___

### start

▸ **start**(): `void`

#### Returns

`void`

#### Defined in

[packages/openlayers/src/index.ts:99](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L99)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[packages/openlayers/src/index.ts:105](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L105)

___

### un

▸ **un**(`type`, `listener`, `opt_this?`): `void`

Unlisten for a certain type of event.

**`Api`**

stable

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` \| `string`[] | The event type or array of event types. |
| `listener` | `EventsListenerFunctionType` | The listener function. |
| `opt_this?` | `GlobalObject` | The object which was used as `this` by the `listener`. |

#### Returns

`void`

#### Inherited from

ol.layer.Image.un

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:7399

___

### unproject

▸ **unproject**(`pixel`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `pixel` | [`number`, `number`] |

#### Returns

[`number`, `number`]

#### Defined in

[packages/openlayers/src/index.ts:183](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L183)

___

### unset

▸ **unset**(`key`, `opt_silent?`): `void`

Unsets a property.

**`Api`**

stable

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | Key name. |
| `opt_silent?` | `boolean` | Unset without triggering an event. |

#### Returns

`void`

#### Inherited from

ol.layer.Image.unset

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:7305

___

### updateParams

▸ **updateParams**(`options?`): [`default`](openlayers_src.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`IOptions`\> |

#### Returns

[`default`](openlayers_src.default.md)

#### Defined in

[packages/openlayers/src/index.ts:252](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/openlayers/src/index.ts#L252)

___

### unByKey

▸ `Static` **unByKey**(`key`): `void`

Removes an event listener using the key returned by `on()` or `once()`.

**`Api`**

stable

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `GlobalObject` \| `GlobalObject`[] | The key returned by `on()`     or `once()` (or an array of keys). |

#### Returns

`void`

#### Inherited from

ol.layer.Image.unByKey

#### Defined in

node_modules/.pnpm/@types+openlayers@4.6.18/node_modules/@types/openlayers/index.d.ts:7341
