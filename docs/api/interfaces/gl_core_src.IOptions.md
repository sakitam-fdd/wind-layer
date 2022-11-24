---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [gl-core/src](../modules/gl_core_src.md) / IOptions

# Interface: IOptions

[gl-core/src](../modules/gl_core_src.md).IOptions

## Properties

### createPlaneBuffer

• `Optional` **createPlaneBuffer**: (`points`: `number`[][], `widthSegments`: `number`, `heightSegments`: `number`) => [`IPlaneBuffer`](gl_core_src.IPlaneBuffer.md)

#### Type declaration

▸ (`points`, `widthSegments`, `heightSegments`): [`IPlaneBuffer`](gl_core_src.IPlaneBuffer.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `points` | `number`[][] |
| `widthSegments` | `number` |
| `heightSegments` | `number` |

##### Returns

[`IPlaneBuffer`](gl_core_src.IPlaneBuffer.md)

#### Defined in

[packages/gl-core/src/ScalarFill.ts:41](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L41)

___

### displayRange

• `Optional` **displayRange**: [`number`, `number`]

#### Defined in

[packages/gl-core/src/ScalarFill.ts:49](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L49)

___

### getZoom

• `Optional` **getZoom**: () => `number`

#### Type declaration

▸ (): `number`

##### Returns

`number`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:38](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L38)

___

### heightSegments

• `Optional` **heightSegments**: `number`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:52](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L52)

___

### injectShaderModules

• **injectShaderModules**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:46](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L46)

___

### mappingRange

• `Optional` **mappingRange**: [`number`, `number`]

#### Defined in

[packages/gl-core/src/ScalarFill.ts:50](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L50)

___

### opacity

• `Optional` **opacity**: `number`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:39](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L39)

___

### renderForm

• `Optional` **renderForm**: ``"r"`` \| ``"rg"``

#### Defined in

[packages/gl-core/src/ScalarFill.ts:33](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L33)

___

### styleSpec

• `Optional` **styleSpec**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fill-color` | `any`[] |
| `opacity` | `number` \| `any`[] |

#### Defined in

[packages/gl-core/src/ScalarFill.ts:34](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L34)

___

### triggerRepaint

• `Optional` **triggerRepaint**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:40](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L40)

___

### widthSegments

• `Optional` **widthSegments**: `number`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:51](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L51)

___

### wireframe

• `Optional` **wireframe**: `boolean`

#### Defined in

[packages/gl-core/src/ScalarFill.ts:53](https://github.com/sakitam-fdd/wind-layer/blob/cc04063/packages/gl-core/src/ScalarFill.ts#L53)
