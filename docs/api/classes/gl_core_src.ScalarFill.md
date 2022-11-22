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

packages/gl-core/src/ScalarFill.ts:192

## Properties

### colorRampTexture

• **colorRampTexture**: ``null`` \| `WebGLTexture`

#### Defined in

packages/gl-core/src/ScalarFill.ts:179

___

### colorRange

• `Private` **colorRange**: [`number`, `number`]

#### Defined in

packages/gl-core/src/ScalarFill.ts:186

___

### data

• **data**: `IData`

#### Defined in

packages/gl-core/src/ScalarFill.ts:178

___

### drawCommand

• `Private` **drawCommand**: `Fill` \| `WindFill`

#### Defined in

packages/gl-core/src/ScalarFill.ts:190

___

### gl

• `Readonly` **gl**: `WebGLRenderingContext`

#### Defined in

packages/gl-core/src/ScalarFill.ts:177

___

### opacity

• `Private` **opacity**: `number`

#### Defined in

packages/gl-core/src/ScalarFill.ts:184

___

### options

• `Private` **options**: [`IOptions`](../interfaces/gl_core_src.IOptions.md)

#### Defined in

packages/gl-core/src/ScalarFill.ts:182

___

### uid

• `Private` **uid**: `string`

#### Defined in

packages/gl-core/src/ScalarFill.ts:181

___

### worker

• `Private` **worker**: `Worker`

#### Defined in

packages/gl-core/src/ScalarFill.ts:188

## Methods

### buildColorRamp

▸ **buildColorRamp**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/ScalarFill.ts:255

___

### destroyData

▸ **destroyData**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/ScalarFill.ts:624

___

### destroyed

▸ **destroyed**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/ScalarFill.ts:650

___

### getData

▸ **getData**(): `IData`

#### Returns

`IData`

#### Defined in

packages/gl-core/src/ScalarFill.ts:503

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

packages/gl-core/src/ScalarFill.ts:507

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

packages/gl-core/src/ScalarFill.ts:345

___

### handleZoom

▸ **handleZoom**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/ScalarFill.ts:242

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

packages/gl-core/src/ScalarFill.ts:276

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

packages/gl-core/src/ScalarFill.ts:311

___

### postrender

▸ **postrender**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/ScalarFill.ts:622

___

### prerender

▸ **prerender**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/ScalarFill.ts:511

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

packages/gl-core/src/ScalarFill.ts:513

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

packages/gl-core/src/ScalarFill.ts:475

___

### setFillColor

▸ **setFillColor**(): `void`

#### Returns

`void`

#### Defined in

packages/gl-core/src/ScalarFill.ts:234

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

packages/gl-core/src/ScalarFill.ts:238

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

packages/gl-core/src/ScalarFill.ts:213
