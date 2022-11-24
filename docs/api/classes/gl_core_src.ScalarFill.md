---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [gl-core/src](../modules/gl_core_src.md) / ScalarFill

# Class: ScalarFill

[gl-core/src](../modules/gl_core_src.md).ScalarFill

## Implements

- `IScalarFill`<`any`\>

## Indexable

▪ [index: `string`]: `any`

## Constructors

### constructor

• **new ScalarFill**(`gl`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `options?` | `Partial`<[`IOptions`](../interfaces/gl_core_src.IOptions.md)\> |

#### Defined in

[packages/gl-core/src/ScalarFill.ts:192](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L192)

## Properties

### colorRampTexture

• **colorRampTexture**: ``null`` \| `WebGLTexture`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:179](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L179)

___

### colorRange

• `Private` **colorRange**: [`number`, `number`]

#### Defined in

[packages/gl-core/src/ScalarFill.ts:186](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L186)

___

### data

• **data**: `IData`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:178](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L178)

___

### drawCommand

• `Private` **drawCommand**: `Fill` \| `WindFill`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:190](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L190)

___

### gl

• `Readonly` **gl**: `WebGLRenderingContext`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:177](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L177)

___

### opacity

• `Private` **opacity**: `number`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:184](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L184)

___

### options

• `Private` **options**: [`IOptions`](../interfaces/gl_core_src.IOptions.md)

#### Defined in

[packages/gl-core/src/ScalarFill.ts:182](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L182)

___

### uid

• `Private` **uid**: `string`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:181](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L181)

___

### worker

• `Private` **worker**: `Worker`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:188](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L188)

## Methods

### buildColorRamp

▸ **buildColorRamp**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:255](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L255)

___

### destroyData

▸ **destroyData**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:624](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L624)

___

### destroyed

▸ **destroyed**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:650](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L650)

___

### getData

▸ **getData**(): `IData`

#### Returns

`IData`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:503](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L503)

___

### getMercatorCoordinate

▸ **getMercatorCoordinate**(`__namedParameters`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`number`, `number`] |

#### Returns

[`number`, `number`]

#### Defined in

[packages/gl-core/src/ScalarFill.ts:507](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L507)

___

### getTextureData

▸ **getTextureData**(`data`): `Promise`<`IData`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IJsonArrayData`](../interfaces/gl_core_src.IJsonArrayData.md) \| `IImageData` |

#### Returns

`Promise`<`IData`\>

#### Defined in

[packages/gl-core/src/ScalarFill.ts:345](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L345)

___

### handleZoom

▸ **handleZoom**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:242](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L242)

___

### initialize

▸ **initialize**(`gl`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:276](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L276)

___

### initializeVertex

▸ **initializeVertex**(`coordinates`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinates` | `number`[][] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `indexes` | `number`[] |
| `quad64LowBuffer` | ``null`` \| `WebGLBuffer` |
| `quadBuffer` | ``null`` \| `WebGLBuffer` |
| `texCoordBuffer` | ``null`` \| `WebGLBuffer` |
| `wireframeIndexes` | `number`[] |

#### Defined in

[packages/gl-core/src/ScalarFill.ts:311](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L311)

___

### postrender

▸ **postrender**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:622](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L622)

___

### prerender

▸ **prerender**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:511](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L511)

___

### render

▸ **render**(`matrix`, `offsetX?`, `cameraParams?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `matrix` | `number`[] |
| `offsetX?` | `number` |
| `cameraParams?` | `Object` |
| `cameraParams.cameraEye` | `number`[] |
| `cameraParams.cameraEye64Low` | `number`[] |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:513](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L513)

___

### setData

▸ **setData**(`data`, `cb?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IJsonArrayData`](../interfaces/gl_core_src.IJsonArrayData.md) \| `IImageData` |
| `cb?` | (`args?`: `boolean`) => `void` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:475](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L475)

___

### setFillColor

▸ **setFillColor**(): `void`

#### Returns

`void`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:234](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L234)

___

### setOpacity

▸ **setOpacity**(`opacity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `opacity` | `number` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:238](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L238)

___

### updateOptions

▸ **updateOptions**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<[`IOptions`](../interfaces/gl_core_src.IOptions.md)\> |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:213](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L213)
