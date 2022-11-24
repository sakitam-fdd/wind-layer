---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / gl-core/src

# Module: gl-core/src

## Classes

- [ScalarFill](../classes/gl_core_src.ScalarFill.md)
- [WindParticles](../classes/gl_core_src.WindParticles.md)

## Interfaces

- [IGFSItem](../interfaces/gl_core_src.IGFSItem.md)
- [IJsonArrayData](../interfaces/gl_core_src.IJsonArrayData.md)
- [IOptions](../interfaces/gl_core_src.IOptions.md)
- [IPlaneBuffer](../interfaces/gl_core_src.IPlaneBuffer.md)
- [IWindOptions](../interfaces/gl_core_src.IWindOptions.md)

## Variables

### defaultOptions

• `Const` **defaultOptions**: [`IOptions`](../interfaces/gl_core_src.IOptions.md)

#### Defined in

[packages/gl-core/src/ScalarFill.ts:91](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L91)

## Functions

### bindAttribute

▸ **bindAttribute**(`gl`, `buffer`, `attribute`, `numComponents`): `void`

bind attribute

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `buffer` | `WebGLBuffer` |
| `attribute` | `number` |
| `numComponents` | `number` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:300](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L300)

___

### bindFramebuffer

▸ **bindFramebuffer**(`gl`, `framebuffer`, `texture?`): `void`

bind framebuffer

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `framebuffer` | ``null`` \| `WebGLFramebuffer` |
| `texture?` | `WebGLTexture` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:317](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L317)

___

### bindTexture

▸ **bindTexture**(`gl`, `texture`, `unit`): `void`

bind texture

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `texture` | `WebGLTexture` |
| `unit` | `number` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:243](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L243)

___

### calcMinMax

▸ **calcMinMax**(`array`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `array` | `number`[] |

#### Returns

[`number`, `number`]

#### Defined in

[packages/gl-core/src/utils/common.ts:1](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/common.ts#L1)

___

### clearScene

▸ **clearScene**(`gl`, `color`, `depth?`, `stencil?`, `fbo?`): `void`

clear scene

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `gl` | `WebGLRenderingContext` | `undefined` |
| `color` | `number`[] | `undefined` |
| `depth` | `number` | `1` |
| `stencil` | `number` | `0` |
| `fbo?` | `WebGLFramebuffer` | `undefined` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:362](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L362)

___

### createBuffer

▸ **createBuffer**(`gl`, `data`): ``null`` \| `WebGLBuffer`

create data buffer

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `data` | `any` |

#### Returns

``null`` \| `WebGLBuffer`

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:270](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L270)

___

### createProgram

▸ **createProgram**(`gl`, `vertexShaderSource`, `fragmentShaderSource`): `WebGLProgram` \| ``null``

create program from vertex and frag

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `vertexShaderSource` | `string` |
| `fragmentShaderSource` | `string` |

#### Returns

`WebGLProgram` \| ``null``

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:137](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L137)

___

### createShader

▸ **createShader**(`gl`, `type`, `source`): `WebGLShader`

create shader and compile shader

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `type` | `number` |
| `source` | `string` |

#### Returns

`WebGLShader`

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:114](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L114)

___

### createTexture

▸ **createTexture**(`gl`, `filter`, `data`, `width`, `height`): `WebGLTexture` \| ``null``

create 2d texture

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `filter` | `number` |
| `data` | `TexImageSource` \| `Uint8Array` |
| `width` | `number` |
| `height` | `number` |

#### Returns

`WebGLTexture` \| ``null``

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:174](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L174)

___

### defineShader

▸ **defineShader**(`shader`, `defines`): `string`

defines

#### Parameters

| Name | Type |
| :------ | :------ |
| `shader` | `string` |
| `defines` | `any` |

#### Returns

`string`

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:87](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L87)

___

### destroyTexture

▸ **destroyTexture**(`gl`, `texture`): `void`

delete texture

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `texture` | `WebGLTexture` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:257](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L257)

___

### findStopLessThanOrEqualTo

▸ **findStopLessThanOrEqualTo**(`stops`, `input`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stops` | `number`[] |
| `input` | `number` |

#### Returns

`number`

#### Defined in

[packages/gl-core/src/utils/common.ts:34](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/common.ts#L34)

___

### fp64LowPart

▸ **fp64LowPart**(`x`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |

#### Returns

`number`

#### Defined in

[packages/gl-core/src/utils/common.ts:64](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/common.ts#L64)

___

### getDevicePixelRatio

▸ **getDevicePixelRatio**(): `number`

#### Returns

`number`

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:4](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L4)

___

### getEye

▸ **getEye**(`matrix`): `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `matrix` | `number`[] |

#### Returns

`number`[]

#### Defined in

[packages/gl-core/src/utils/common.ts:140](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/common.ts#L140)

___

### getGlContext

▸ **getGlContext**(`canvas`, `glOptions?`): ``null`` \| `WebGLRenderingContext`

get gl context

#### Parameters

| Name | Type |
| :------ | :------ |
| `canvas` | `HTMLCanvasElement` |
| `glOptions` | `Object` |

#### Returns

``null`` \| `WebGLRenderingContext`

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:45](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L45)

___

### getPlaneBuffer

▸ **getPlaneBuffer**(`startX`, `endX`, `startY`, `endY`, `widthSegments`, `heightSegments`): [`IPlaneBuffer`](../interfaces/gl_core_src.IPlaneBuffer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `startX` | `number` |
| `endX` | `number` |
| `startY` | `number` |
| `endY` | `number` |
| `widthSegments` | `number` |
| `heightSegments` | `number` |

#### Returns

[`IPlaneBuffer`](../interfaces/gl_core_src.IPlaneBuffer.md)

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:439](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L439)

___

### injectShaderModule

▸ **injectShaderModule**(`shader`, `modules?`): `string`

inject shader module

#### Parameters

| Name | Type |
| :------ | :------ |
| `shader` | `string` |
| `modules` | `any` |

#### Returns

`string`

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:98](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L98)

___

### isNumber

▸ **isNumber**(`val`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

`boolean`

#### Defined in

[packages/gl-core/src/utils/common.ts:26](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/common.ts#L26)

___

### isValide

▸ **isValide**(`val`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

`boolean`

#### Defined in

[packages/gl-core/src/utils/common.ts:30](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/common.ts#L30)

___

### loadImage

▸ **loadImage**(`src`): `Promise`<`HTMLImageElement`\>

load image by url

#### Parameters

| Name | Type |
| :------ | :------ |
| `src` | `string` |

#### Returns

`Promise`<`HTMLImageElement`\>

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:396](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L396)

___

### mat4Invert

▸ **mat4Invert**(`out`, `a`): ``null`` \| `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `out` | `number`[] |
| `a` | `number`[] |

#### Returns

``null`` \| `number`[]

#### Defined in

[packages/gl-core/src/utils/common.ts:68](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/common.ts#L68)

___

### resizeCanvasSize

▸ **resizeCanvasSize**(`canvas`, `pixelRatio?`): `boolean`

resize gl context

**`Link`**

https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html

**`Link`**

https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-anti-patterns.html

#### Parameters

| Name | Type |
| :------ | :------ |
| `canvas` | `HTMLCanvasElement` |
| `pixelRatio?` | `number` |

#### Returns

`boolean`

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:16](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L16)

___

### resizeFramebuffer

▸ **resizeFramebuffer**(`gl`, `framebuffer`, `width`, `height`, `texture?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `framebuffer` | ``null`` \| `WebGLFramebuffer` |
| `width` | `number` |
| `height` | `number` |
| `texture?` | `WebGLTexture` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:336](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L336)

___

### resizeTexture

▸ **resizeTexture**(`gl`, `texture`, `width`, `height`, `data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `texture` | `WebGLTexture` |
| `width` | `number` |
| `height` | `number` |
| `data` | `TexImageSource` \| `Uint8Array` |

#### Returns

`void`

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:211](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L211)

___

### transformMat4

▸ **transformMat4**(`out`, `a`, `m`): `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `out` | `number`[] |
| `a` | `number`[] |
| `m` | `number`[] |

#### Returns

`number`[]

#### Defined in

[packages/gl-core/src/utils/common.ts:128](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/common.ts#L128)

___

### updateBufferData

▸ **updateBufferData**(`gl`, `buffer`, `data`): `WebGLBuffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGLRenderingContext` |
| `buffer` | `WebGLBuffer` |
| `data` | `any` |

#### Returns

`WebGLBuffer`

#### Defined in

[packages/gl-core/src/utils/gl-utils.ts:281](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/utils/gl-utils.ts#L281)
