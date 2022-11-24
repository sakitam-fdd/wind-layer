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

[packages/mapbox-gl/src/index.ts:37](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/index.ts#L37)

## Properties

### canvas

• `Protected` **canvas**: ``null`` \| `HTMLCanvasElement`

#### Inherited from

Overlay.canvas

#### Defined in

[packages/mapbox-gl/src/Overlay.ts:25](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Overlay.ts#L25)

___

### field

• `Private` **field**: `undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

[packages/mapbox-gl/src/index.ts:34](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/index.ts#L34)

___

### id

• **id**: `string` \| `number`

#### Inherited from

Overlay.id

#### Defined in

[packages/mapbox-gl/src/Overlay.ts:30](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Overlay.ts#L30)

___

### map

• **map**: `Map`

#### Inherited from

Overlay.map

#### Defined in

[packages/mapbox-gl/src/Overlay.ts:23](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Overlay.ts#L23)

___

### options

• **options**: [`IWindOptions`](../interfaces/mapbox_gl_src.IWindOptions.md)

#### Overrides

Overlay.options

#### Defined in

[packages/mapbox-gl/src/index.ts:33](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/index.ts#L33)

___

### renderingMode

• **renderingMode**: `string`

#### Inherited from

Overlay.renderingMode

#### Defined in

[packages/mapbox-gl/src/Overlay.ts:29](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Overlay.ts#L29)

___

### type

• **type**: `string`

#### Inherited from

Overlay.type

#### Defined in

[packages/mapbox-gl/src/Overlay.ts:28](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Overlay.ts#L28)

___

### wind

• `Private` **wind**: `WindCore`

#### Defined in

[packages/mapbox-gl/src/index.ts:35](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/index.ts#L35)

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

[packages/mapbox-gl/src/Overlay.ts:151](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Overlay.ts#L151)

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Inherited from

Overlay.clear

#### Defined in

[packages/mapbox-gl/src/Overlay.ts:130](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Overlay.ts#L130)

___

### getData

▸ **getData**(): `undefined` \| [`Field`](maptalks_src.Field.md)

get wind layer data

#### Returns

`undefined` \| [`Field`](maptalks_src.Field.md)

#### Defined in

[packages/mapbox-gl/src/index.ts:160](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/index.ts#L160)

___

### getMap

▸ **getMap**(): `Map`

#### Returns

`Map`

#### Inherited from

Overlay.getMap

#### Defined in

[packages/mapbox-gl/src/Overlay.ts:147](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Overlay.ts#L147)

___

### getWindOptions

▸ **getWindOptions**(): `Partial`<`IOptions`\>

#### Returns

`Partial`<`IOptions`\>

#### Defined in

[packages/mapbox-gl/src/index.ts:199](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/index.ts#L199)

___

### handleResize

▸ **handleResize**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/index.ts:66](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/index.ts#L66)

___

### initialize

▸ **initialize**(): `HTMLCanvasElement`

#### Returns

`HTMLCanvasElement`

#### Inherited from

Overlay.initialize

#### Defined in

[packages/mapbox-gl/src/Overlay.ts:74](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Overlay.ts#L74)

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

[packages/mapbox-gl/src/Overlay.ts:119](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Overlay.ts#L119)

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

[packages/mapbox-gl/src/index.ts:50](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/index.ts#L50)

___

### pickWindOptions

▸ **pickWindOptions**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/index.ts:145](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/index.ts#L145)

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

[packages/mapbox-gl/src/Overlay.ts:98](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Overlay.ts#L98)

___

### registerEvents

▸ **registerEvents**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/index.ts:73](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/index.ts#L73)

___

### remove

▸ **remove**(): `void`

#### Returns

`void`

#### Overrides

Overlay.remove

#### Defined in

[packages/mapbox-gl/src/index.ts:135](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/index.ts#L135)

___

### render

▸ **render**(): `void`

#### Returns

`void`

#### Overrides

Overlay.render

#### Defined in

[packages/mapbox-gl/src/index.ts:103](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/index.ts#L103)

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

[packages/mapbox-gl/src/Overlay.ts:60](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Overlay.ts#L60)

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

[packages/mapbox-gl/src/index.ts:170](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/index.ts#L170)

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

[packages/mapbox-gl/src/Overlay.ts:142](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Overlay.ts#L142)

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

[packages/mapbox-gl/src/index.ts:186](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/index.ts#L186)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/index.ts:97](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/index.ts#L97)

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

[packages/mapbox-gl/src/Overlay.ts:111](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Overlay.ts#L111)

___

### unregisterEvents

▸ **unregisterEvents**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/index.ts:85](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/index.ts#L85)
