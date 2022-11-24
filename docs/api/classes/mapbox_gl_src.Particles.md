---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [mapbox-gl/src](../modules/mapbox_gl_src.md) / Particles

# Class: Particles

[mapbox-gl/src](../modules/mapbox_gl_src.md).Particles

## Constructors

### constructor

• **new Particles**(`id`, `data`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | `any` |
| `options?` | `Partial`<`IParticlesOptions`\> |

#### Defined in

[packages/mapbox-gl/src/Particles.ts:27](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L27)

## Properties

### data

• `Private` **data**: `any`

#### Defined in

[packages/mapbox-gl/src/Particles.ts:24](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L24)

___

### gl

• `Private` **gl**: `WebGLRenderingContext`

#### Defined in

[packages/mapbox-gl/src/Particles.ts:18](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L18)

___

### id

• **id**: `string`

#### Defined in

[packages/mapbox-gl/src/Particles.ts:20](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L20)

___

### layer

• `Private` **layer**: `any`

#### Defined in

[packages/mapbox-gl/src/Particles.ts:25](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L25)

___

### map

• **map**: `any`

#### Defined in

[packages/mapbox-gl/src/Particles.ts:19](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L19)

___

### options

• `Private` **options**: `any`

#### Defined in

[packages/mapbox-gl/src/Particles.ts:23](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L23)

___

### renderingMode

• **renderingMode**: ``"2d"`` \| ``"3d"``

#### Defined in

[packages/mapbox-gl/src/Particles.ts:22](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L22)

___

### type

• **type**: `string`

#### Defined in

[packages/mapbox-gl/src/Particles.ts:21](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L21)

## Methods

### getWrappedWorlds

▸ **getWrappedWorlds**(): `number`[]

#### Returns

`number`[]

#### Defined in

[packages/mapbox-gl/src/Particles.ts:185](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L185)

___

### handleMoveend

▸ **handleMoveend**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/Particles.ts:71](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L71)

___

### handleMovestart

▸ **handleMovestart**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/Particles.ts:65](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L65)

___

### handleZoom

▸ **handleZoom**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/Particles.ts:53](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L53)

___

### initialize

▸ **initialize**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/Particles.ts:77](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L77)

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

[packages/mapbox-gl/src/Particles.ts:144](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L144)

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

[packages/mapbox-gl/src/Particles.ts:171](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L171)

___

### prerender

▸ **prerender**(`gl`, `matrix`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `matrix` | `number`[] |

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/Particles.ts:215](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L215)

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

[packages/mapbox-gl/src/Particles.ts:221](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L221)

___

### resize

▸ **resize**(): `void`

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/Particles.ts:59](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L59)

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

[packages/mapbox-gl/src/Particles.ts:153](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L153)

___

### updateOptions

▸ **updateOptions**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`IWindOptions`\> |

#### Returns

`void`

#### Defined in

[packages/mapbox-gl/src/Particles.ts:43](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/mapbox-gl/src/Particles.ts#L43)
