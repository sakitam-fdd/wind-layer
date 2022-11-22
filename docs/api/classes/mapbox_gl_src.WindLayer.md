---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [mapbox-gl/src](../modules/mapbox_gl_src.md) / WindLayer

# Class: WindLayer

[mapbox-gl/src](../modules/mapbox_gl_src.md).WindLayer

## Hierarchy

- `default`

  ↳ **`WindLayer`**

## Constructors

### constructor

• **new WindLayer**(`id`, `data`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` \| `number` |
| `data` | `any` |
| `options` | `any` |

#### Overrides

Overlay.constructor

#### Defined in

packages/mapbox-gl/src/index.ts:37

## Properties

### canvas

• `Protected` **canvas**: ``null`` \| `HTMLCanvasElement`

#### Inherited from

Overlay.canvas

#### Defined in

packages/mapbox-gl/src/Overlay.ts:25

___

### field

• `Private` **field**: `undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

packages/mapbox-gl/src/index.ts:34

___

### id

• **id**: `string` \| `number`

#### Inherited from

Overlay.id

#### Defined in

packages/mapbox-gl/src/Overlay.ts:30

___

### map

• **map**: `Map`

#### Inherited from

Overlay.map

#### Defined in

packages/mapbox-gl/src/Overlay.ts:23

___

### options

• **options**: [`IWindOptions`](../interfaces/mapbox_gl_src.IWindOptions.md)

#### Overrides

Overlay.options

#### Defined in

packages/mapbox-gl/src/index.ts:33

___

### renderingMode

• **renderingMode**: `string`

#### Inherited from

Overlay.renderingMode

#### Defined in

packages/mapbox-gl/src/Overlay.ts:29

___

### type

• **type**: `string`

#### Inherited from

Overlay.type

#### Defined in

packages/mapbox-gl/src/Overlay.ts:28

___

### wind

• `Private` **wind**: `WindCore`

#### Defined in

packages/mapbox-gl/src/index.ts:35

## Methods

### addTo

▸ **addTo**(`map`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map` |

#### Returns

`void`

#### Inherited from

Overlay.addTo

#### Defined in

packages/mapbox-gl/src/Overlay.ts:151

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Inherited from

Overlay.clear

#### Defined in

packages/mapbox-gl/src/Overlay.ts:130

___

### getData

▸ **getData**(): `undefined` \| [`Field`](maptalks_src.Field.md)

get wind layer data

#### Returns

`undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

packages/mapbox-gl/src/index.ts:160

___

### getMap

▸ **getMap**(): `Map`

#### Returns

`Map`

#### Inherited from

Overlay.getMap

#### Defined in

packages/mapbox-gl/src/Overlay.ts:147

___

### getWindOptions

▸ **getWindOptions**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

packages/mapbox-gl/src/index.ts:199

___

### handleResize

▸ **handleResize**(): `void`

#### Returns

`void`

#### Defined in

packages/mapbox-gl/src/index.ts:66

___

### initialize

▸ **initialize**(): `HTMLCanvasElement`

#### Returns

`HTMLCanvasElement`

#### Inherited from

Overlay.initialize

#### Defined in

packages/mapbox-gl/src/Overlay.ts:74

___

### intersectsCoordinate

▸ **intersectsCoordinate**(`coordinate`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinate` | [`number`, `number`] |

#### Returns

`boolean`

#### Inherited from

Overlay.intersectsCoordinate

#### Defined in

packages/mapbox-gl/src/Overlay.ts:119

___

### onAdd

▸ **onAdd**(`map`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map` |

#### Returns

`void`

#### Overrides

Overlay.onAdd

#### Defined in

packages/mapbox-gl/src/index.ts:50

___

### pickWindOptions

▸ **pickWindOptions**(): `void`

#### Returns

`void`

#### Defined in

packages/mapbox-gl/src/index.ts:145

___

### project

▸ **project**(`coordinates`): `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinates` | [`number`, `number`] |

#### Returns

`number`[]

#### Inherited from

Overlay.project

#### Defined in

packages/mapbox-gl/src/Overlay.ts:98

___

### registerEvents

▸ **registerEvents**(): `void`

#### Returns

`void`

#### Defined in

packages/mapbox-gl/src/index.ts:73

___

### remove

▸ **remove**(): `void`

#### Returns

`void`

#### Overrides

Overlay.remove

#### Defined in

packages/mapbox-gl/src/index.ts:135

___

### render

▸ **render**(): `void`

#### Returns

`void`

#### Overrides

Overlay.render

#### Defined in

packages/mapbox-gl/src/index.ts:103

___

### resizeCanvas

▸ **resizeCanvas**(`canvas`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `canvas` | `HTMLCanvasElement` |

#### Returns

`void`

#### Inherited from

Overlay.resizeCanvas

#### Defined in

packages/mapbox-gl/src/Overlay.ts:60

___

### setData

▸ **setData**(`data`, `options?`): [`WindLayer`](mapbox_gl_src.WindLayer.md)

set layer data

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `options` | `Partial`<`IField`\> |

#### Returns

[`WindLayer`](mapbox_gl_src.WindLayer.md)

#### Defined in

packages/mapbox-gl/src/index.ts:170

___

### setMap

▸ **setMap**(`map`): [`WindLayer`](mapbox_gl_src.WindLayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map` |

#### Returns

[`WindLayer`](mapbox_gl_src.WindLayer.md)

#### Inherited from

Overlay.setMap

#### Defined in

packages/mapbox-gl/src/Overlay.ts:142

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

packages/mapbox-gl/src/index.ts:186

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

packages/mapbox-gl/src/index.ts:97

___

### unproject

▸ **unproject**(`pixel`): `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `pixel` | [`number`, `number`] |

#### Returns

`number`[]

#### Inherited from

Overlay.unproject

#### Defined in

packages/mapbox-gl/src/Overlay.ts:111

___

### unregisterEvents

▸ **unregisterEvents**(): `void`

#### Returns

`void`

#### Defined in

packages/mapbox-gl/src/index.ts:85
