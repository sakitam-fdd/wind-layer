---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [mapbox-gl/src](../modules/mapbox_gl_src.md) / ScalarFill

# Class: ScalarFill

[mapbox-gl/src](../modules/mapbox_gl_src.md).ScalarFill

## Constructors

### constructor

• **new ScalarFill**(`id`, `data`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | `any` |
| `options?` | `Partial`<`IScalarFillOptions`\> |

#### Defined in

packages/mapbox-gl/src/ScalarFill.ts:33

## Properties

### data

• `Private` **data**: `any`

#### Defined in

packages/mapbox-gl/src/ScalarFill.ts:30

___

### gl

• **gl**: `WebGLRenderingContext`

#### Defined in

packages/mapbox-gl/src/ScalarFill.ts:24

___

### id

• **id**: `string`

#### Defined in

packages/mapbox-gl/src/ScalarFill.ts:26

___

### map

• **map**: `Map`

#### Defined in

packages/mapbox-gl/src/ScalarFill.ts:25

___

### options

• `Private` **options**: `any`

#### Defined in

packages/mapbox-gl/src/ScalarFill.ts:29

___

### renderingMode

• **renderingMode**: ``"2d"`` \| ``"3d"``

#### Defined in

packages/mapbox-gl/src/ScalarFill.ts:28

___

### scalarFill

• `Private` **scalarFill**: ``null`` \| `ScalarFill`

#### Defined in

packages/mapbox-gl/src/ScalarFill.ts:31

___

### type

• **type**: `string`

#### Defined in

packages/mapbox-gl/src/ScalarFill.ts:27

## Methods

### getWrappedWorlds

▸ **getWrappedWorlds**(): `number`[]

#### Returns

`number`[]

#### Defined in

packages/mapbox-gl/src/ScalarFill.ts:160

___

### handleZoom

▸ **handleZoom**(): `void`

#### Returns

`void`

#### Defined in

packages/mapbox-gl/src/ScalarFill.ts:46

___

### initialize

▸ **initialize**(): `void`

#### Returns

`void`

#### Defined in

packages/mapbox-gl/src/ScalarFill.ts:52

___

### onAdd

▸ **onAdd**(`map`, `gl`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map` |
| `gl` | `WebGLRenderingContext` |

#### Returns

`void`

#### Defined in

packages/mapbox-gl/src/ScalarFill.ts:121

___

### onRemove

▸ **onRemove**(`map`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map` |

#### Returns

`void`

#### Defined in

packages/mapbox-gl/src/ScalarFill.ts:148

___

### render

▸ **render**(`gl`, `matrix`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `matrix` | `number`[] |

#### Returns

`void`

#### Defined in

packages/mapbox-gl/src/ScalarFill.ts:195

___

### setData

▸ **setData**(`data`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

packages/mapbox-gl/src/ScalarFill.ts:130

___

### updateOptions

▸ **updateOptions**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`IScalarFillOptions`\> |

#### Returns

`void`

#### Defined in

packages/mapbox-gl/src/ScalarFill.ts:111
