---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [ol5/src](../modules/ol5_src.md) / default

# Class: default

[ol5/src](../modules/ol5_src.md).default

## Hierarchy

- `default`

  ↳ **`default`**

## Constructors

### constructor

• **new default**(`data`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `options` | `Partial`<[`IWindOptions`](../interfaces/ol5_src.IWindOptions.md)\> |

#### Overrides

ImageLayer.constructor

#### Defined in

[packages/ol5/src/index.ts:48](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L48)

## Properties

### canvas

• `Private` **canvas**: `HTMLCanvasElement`

#### Defined in

[packages/ol5/src/index.ts:42](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L42)

___

### field

• `Private` **field**: `undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

[packages/ol5/src/index.ts:44](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L44)

___

### options

• `Private` **options**: [`IWindOptions`](../interfaces/ol5_src.IWindOptions.md)

#### Defined in

[packages/ol5/src/index.ts:41](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L41)

___

### pixelRatio

• `Private` **pixelRatio**: `number`

#### Defined in

[packages/ol5/src/index.ts:45](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L45)

___

### type

• `Protected` **type**: `LayerType`

#### Inherited from

ImageLayer.type

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:24

___

### viewProjection

• `Private` **viewProjection**: `ProjectionLike`

#### Defined in

[packages/ol5/src/index.ts:46](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L46)

___

### wind

• `Private` **wind**: ``null`` \| `WindCore`

#### Defined in

[packages/ol5/src/index.ts:43](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L43)

## Methods

### addEventListener

▸ **addEventListener**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `listener` | `ListenerFunction` |

#### Returns

`void`

#### Inherited from

ImageLayer.addEventListener

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/events/Target.d.ts:8

___

### appendTo

▸ **appendTo**(`map`): `void`

append layer to map

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `default` |

#### Returns

`void`

#### Defined in

[packages/ol5/src/index.ts:88](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L88)

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
| `proj` | `ProjectionLike` |

#### Returns

`HTMLCanvasElement`

#### Defined in

[packages/ol5/src/index.ts:108](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L108)

___

### changed

▸ **changed**(): `void`

#### Returns

`void`

#### Inherited from

ImageLayer.changed

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/Observable.d.ts:7

___

### dispatchEvent

▸ **dispatchEvent**(`event`): `undefined` \| `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `object` \| `default` |

#### Returns

`undefined` \| `boolean`

#### Inherited from

ImageLayer.dispatchEvent

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/events/Target.d.ts:9

___

### dispose

▸ **dispose**(): `void`

#### Returns

`void`

#### Inherited from

ImageLayer.dispose

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/Disposable.d.ts:4

___

### disposeInternal

▸ `Protected` **disposeInternal**(): `void`

#### Returns

`void`

#### Inherited from

ImageLayer.disposeInternal

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/Disposable.d.ts:3

___

### get

▸ **get**(`key`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`any`

#### Inherited from

ImageLayer.get

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/Object.d.ts:7

___

### getContext

▸ `Private` **getContext**(): `undefined` \| ``null`` \| `CanvasRenderingContext2D`

#### Returns

`undefined` \| ``null`` \| `CanvasRenderingContext2D`

#### Defined in

[packages/ol5/src/index.ts:130](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L130)

___

### getData

▸ **getData**(): `undefined` \| [`Field`](maptalks_src.Field.md)

get wind layer data

#### Returns

`undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

[packages/ol5/src/index.ts:214](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L214)

___

### getExtent

▸ **getExtent**(): `undefined` \| `Extent`

#### Returns

`undefined` \| `Extent`

#### Inherited from

ImageLayer.getExtent

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Base.d.ts:19

___

### getKeys

▸ **getKeys**(): `string`[]

#### Returns

`string`[]

#### Inherited from

ImageLayer.getKeys

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/Object.d.ts:8

___

### getLayerState

▸ **getLayerState**(): `State`

#### Returns

`State`

#### Inherited from

ImageLayer.getLayerState

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Base.d.ts:21

___

### getLayerStatesArray

▸ **getLayerStatesArray**(`opt_states?`): `State`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `opt_states?` | `State`[] |

#### Returns

`State`[]

#### Inherited from

ImageLayer.getLayerStatesArray

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Base.d.ts:22

___

### getLayersArray

▸ **getLayersArray**(`opt_array?`): `default`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `opt_array?` | `default`[] |

#### Returns

`default`[]

#### Inherited from

ImageLayer.getLayersArray

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Base.d.ts:20

___

### getListeners

▸ **getListeners**(`type`): `ListenerFunction`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |

#### Returns

`ListenerFunction`[]

#### Inherited from

ImageLayer.getListeners

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/events/Target.d.ts:10

___

### getMap

▸ **getMap**(): `any`

get map

#### Returns

`any`

#### Defined in

[packages/ol5/src/index.ts:298](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L298)

___

### getMaxResolution

▸ **getMaxResolution**(): `number`

#### Returns

`number`

#### Inherited from

ImageLayer.getMaxResolution

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Base.d.ts:23

___

### getMinResolution

▸ **getMinResolution**(): `number`

#### Returns

`number`

#### Inherited from

ImageLayer.getMinResolution

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Base.d.ts:24

___

### getOpacity

▸ **getOpacity**(): `number`

#### Returns

`number`

#### Inherited from

ImageLayer.getOpacity

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Base.d.ts:25

___

### getParams

▸ **getParams**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

[packages/ol5/src/index.ts:249](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L249)

___

### getProjection

▸ `Private` **getProjection**(): `any`

#### Returns

`any`

#### Defined in

[packages/ol5/src/index.ts:270](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L270)

___

### getProperties

▸ **getProperties**(): `Object`

#### Returns

`Object`

#### Inherited from

ImageLayer.getProperties

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/Object.d.ts:9

___

### getRevision

▸ **getRevision**(): `number`

#### Returns

`number`

#### Inherited from

ImageLayer.getRevision

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/Observable.d.ts:8

___

### getSource

▸ **getSource**(): `default`

#### Returns

`default`

#### Inherited from

ImageLayer.getSource

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:25

___

### getSourceState

▸ **getSourceState**(): `State`

#### Returns

`State`

#### Inherited from

ImageLayer.getSourceState

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Base.d.ts:26

___

### getType

▸ **getType**(): `LayerType`

#### Returns

`LayerType`

#### Overrides

ImageLayer.getType

#### Defined in

[packages/ol5/src/index.ts:302](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L302)

___

### getVisible

▸ **getVisible**(): `boolean`

#### Returns

`boolean`

#### Inherited from

ImageLayer.getVisible

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Base.d.ts:28

___

### getWindOptions

▸ **getWindOptions**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

[packages/ol5/src/index.ts:266](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L266)

___

### getZIndex

▸ **getZIndex**(): `number`

#### Returns

`number`

#### Inherited from

ImageLayer.getZIndex

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Base.d.ts:29

___

### hasListener

▸ **hasListener**(`opt_type?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `opt_type?` | `string` |

#### Returns

`boolean`

#### Inherited from

ImageLayer.hasListener

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/events/Target.d.ts:11

___

### intersectsCoordinate

▸ **intersectsCoordinate**(`coordinate`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinate` | `Coordinate` |

#### Returns

`boolean`

#### Defined in

[packages/ol5/src/index.ts:184](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L184)

___

### notify

▸ **notify**(`key`, `oldValue`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `oldValue` | `any` |

#### Returns

`void`

#### Inherited from

ImageLayer.notify

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/Object.d.ts:10

___

### on

▸ **on**(`type`, `listener`): `EventsKey` \| `EventsKey`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` \| `string`[] |
| `listener` | (`p0`: `any`) => `void` |

#### Returns

`EventsKey` \| `EventsKey`[]

#### Inherited from

ImageLayer.on

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:26

▸ **on**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change"`` |
| `listener` | (`evt`: `default`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.on

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:29

▸ **on**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:extent"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.on

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:32

▸ **on**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:maxResolution"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.on

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:35

▸ **on**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:minResolution"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.on

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:38

▸ **on**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:opacity"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.on

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:41

▸ **on**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:source"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.on

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:44

▸ **on**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:visible"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.on

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:47

▸ **on**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:zIndex"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.on

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:50

▸ **on**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"postcompose"`` |
| `listener` | (`evt`: `default`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.on

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:53

▸ **on**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"precompose"`` |
| `listener` | (`evt`: `default`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.on

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:56

▸ **on**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"propertychange"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.on

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:59

▸ **on**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"render"`` |
| `listener` | (`evt`: `default`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.on

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:62

▸ **on**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"rendercomplete"`` |
| `listener` | (`evt`: `default`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.on

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:65

___

### once

▸ **once**(`type`, `listener`): `EventsKey` \| `EventsKey`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` \| `string`[] |
| `listener` | (`p0`: `any`) => `void` |

#### Returns

`EventsKey` \| `EventsKey`[]

#### Inherited from

ImageLayer.once

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:27

▸ **once**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change"`` |
| `listener` | (`evt`: `default`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.once

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:30

▸ **once**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:extent"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.once

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:33

▸ **once**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:maxResolution"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.once

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:36

▸ **once**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:minResolution"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.once

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:39

▸ **once**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:opacity"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.once

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:42

▸ **once**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:source"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.once

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:45

▸ **once**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:visible"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.once

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:48

▸ **once**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:zIndex"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.once

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:51

▸ **once**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"postcompose"`` |
| `listener` | (`evt`: `default`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.once

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:54

▸ **once**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"precompose"`` |
| `listener` | (`evt`: `default`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.once

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:57

▸ **once**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"propertychange"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.once

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:60

▸ **once**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"render"`` |
| `listener` | (`evt`: `default`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.once

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:63

▸ **once**(`type`, `listener`): `EventsKey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"rendercomplete"`` |
| `listener` | (`evt`: `default`) => `void` |

#### Returns

`EventsKey`

#### Inherited from

ImageLayer.once

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:66

___

### pickWindOptions

▸ `Private` **pickWindOptions**(): `void`

#### Returns

`void`

#### Defined in

[packages/ol5/src/index.ts:199](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L199)

___

### project

▸ **project**(`coordinate`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinate` | `Coordinate` |

#### Returns

[`number`, `number`]

#### Defined in

[packages/ol5/src/index.ts:169](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L169)

___

### removeEventListener

▸ **removeEventListener**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `listener` | `ListenerFunction` |

#### Returns

`void`

#### Inherited from

ImageLayer.removeEventListener

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/events/Target.d.ts:12

___

### render

▸ `Private` **render**(`canvas`): [`default`](ol5_src.default.md)

render windy layer

#### Parameters

| Name | Type |
| :------ | :------ |
| `canvas` | `HTMLCanvasElement` |

#### Returns

[`default`](ol5_src.default.md)

#### Defined in

[packages/ol5/src/index.ts:140](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L140)

___

### set

▸ **set**(`key`, `value`, `opt_silent?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `any` |
| `opt_silent?` | `boolean` |

#### Returns

`void`

#### Inherited from

ImageLayer.set

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/Object.d.ts:11

___

### setData

▸ **setData**(`data`, `options?`): [`default`](ol5_src.default.md)

set layer data

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `options` | `Partial`<`IField`\> |

#### Returns

[`default`](ol5_src.default.md)

#### Defined in

[packages/ol5/src/index.ts:224](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L224)

___

### setExtent

▸ **setExtent**(`extent`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `extent` | `undefined` \| `Extent` |

#### Returns

`void`

#### Inherited from

ImageLayer.setExtent

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Base.d.ts:30

___

### setMap

▸ **setMap**(`map`): `void`

set map

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `any` |

#### Returns

`void`

#### Overrides

ImageLayer.setMap

#### Defined in

[packages/ol5/src/index.ts:286](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L286)

___

### setMaxResolution

▸ **setMaxResolution**(`maxResolution`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `maxResolution` | `number` |

#### Returns

`void`

#### Inherited from

ImageLayer.setMaxResolution

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Base.d.ts:31

___

### setMinResolution

▸ **setMinResolution**(`minResolution`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `minResolution` | `number` |

#### Returns

`void`

#### Inherited from

ImageLayer.setMinResolution

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Base.d.ts:32

___

### setOpacity

▸ **setOpacity**(`opacity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `opacity` | `number` |

#### Returns

`void`

#### Inherited from

ImageLayer.setOpacity

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Base.d.ts:33

___

### setProperties

▸ **setProperties**(`values`, `opt_silent?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `Object` |
| `opt_silent?` | `boolean` |

#### Returns

`void`

#### Inherited from

ImageLayer.setProperties

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/Object.d.ts:12

___

### setSource

▸ **setSource**(`source`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `default` |

#### Returns

`void`

#### Inherited from

ImageLayer.setSource

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Layer.d.ts:36

___

### setVisible

▸ **setVisible**(`visible`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `visible` | `boolean` |

#### Returns

`void`

#### Inherited from

ImageLayer.setVisible

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Base.d.ts:34

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

[packages/ol5/src/index.ts:254](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L254)

___

### setZIndex

▸ **setZIndex**(`zindex`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `zindex` | `number` |

#### Returns

`void`

#### Inherited from

ImageLayer.setZIndex

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Base.d.ts:35

___

### start

▸ **start**(): `void`

#### Returns

`void`

#### Defined in

[packages/ol5/src/index.ts:96](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L96)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[packages/ol5/src/index.ts:102](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L102)

___

### un

▸ **un**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` \| `string`[] |
| `listener` | (`p0`: `any`) => `void` |

#### Returns

`void`

#### Inherited from

ImageLayer.un

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:28

▸ **un**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change"`` |
| `listener` | (`evt`: `default`) => `void` |

#### Returns

`void`

#### Inherited from

ImageLayer.un

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:31

▸ **un**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:extent"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`void`

#### Inherited from

ImageLayer.un

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:34

▸ **un**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:maxResolution"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`void`

#### Inherited from

ImageLayer.un

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:37

▸ **un**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:minResolution"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`void`

#### Inherited from

ImageLayer.un

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:40

▸ **un**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:opacity"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`void`

#### Inherited from

ImageLayer.un

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:43

▸ **un**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:source"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`void`

#### Inherited from

ImageLayer.un

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:46

▸ **un**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:visible"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`void`

#### Inherited from

ImageLayer.un

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:49

▸ **un**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"change:zIndex"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`void`

#### Inherited from

ImageLayer.un

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:52

▸ **un**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"postcompose"`` |
| `listener` | (`evt`: `default`) => `void` |

#### Returns

`void`

#### Inherited from

ImageLayer.un

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:55

▸ **un**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"precompose"`` |
| `listener` | (`evt`: `default`) => `void` |

#### Returns

`void`

#### Inherited from

ImageLayer.un

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:58

▸ **un**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"propertychange"`` |
| `listener` | (`evt`: `ObjectEvent`) => `void` |

#### Returns

`void`

#### Inherited from

ImageLayer.un

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:61

▸ **un**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"render"`` |
| `listener` | (`evt`: `default`) => `void` |

#### Returns

`void`

#### Inherited from

ImageLayer.un

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:64

▸ **un**(`type`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"rendercomplete"`` |
| `listener` | (`evt`: `default`) => `void` |

#### Returns

`void`

#### Inherited from

ImageLayer.un

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/layer/Image.d.ts:67

___

### unproject

▸ **unproject**(`pixel`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `pixel` | `Pixel` |

#### Returns

[`number`, `number`]

#### Defined in

[packages/ol5/src/index.ts:178](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L178)

___

### unset

▸ **unset**(`key`, `opt_silent?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `opt_silent?` | `boolean` |

#### Returns

`void`

#### Inherited from

ImageLayer.unset

#### Defined in

node_modules/.pnpm/@types+ol@5.3.7/node_modules/@types/ol/Object.d.ts:13

___

### updateParams

▸ **updateParams**(`options?`): [`default`](ol5_src.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`IOptions`\> |

#### Returns

[`default`](ol5_src.default.md)

#### Defined in

[packages/ol5/src/index.ts:243](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/ol5/src/index.ts#L243)
