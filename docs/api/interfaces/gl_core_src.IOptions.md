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

packages/gl-core/src/ScalarFill.ts:41

___

### displayRange

• `Optional` **displayRange**: [`number`, `number`]

#### Defined in

packages/gl-core/src/ScalarFill.ts:49

___

### getZoom

• `Optional` **getZoom**: () => `number`

#### Type declaration

▸ (): `number`

##### Returns

`number`

#### Defined in

packages/gl-core/src/ScalarFill.ts:38

___

### heightSegments

• `Optional` **heightSegments**: `number`

#### Defined in

packages/gl-core/src/ScalarFill.ts:52

___

### injectShaderModules

• **injectShaderModules**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

packages/gl-core/src/ScalarFill.ts:46

___

### mappingRange

• `Optional` **mappingRange**: [`number`, `number`]

#### Defined in

packages/gl-core/src/ScalarFill.ts:50

___

### opacity

• `Optional` **opacity**: `number`

#### Defined in

packages/gl-core/src/ScalarFill.ts:39

___

### renderForm

• `Optional` **renderForm**: ``"r"`` \| ``"rg"``

#### Defined in

packages/gl-core/src/ScalarFill.ts:33

___

### styleSpec

• `Optional` **styleSpec**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fill-color` | `any`[] |
| `opacity` | `number` \| `any`[] |

#### Defined in

packages/gl-core/src/ScalarFill.ts:34

___

### triggerRepaint

• `Optional` **triggerRepaint**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

packages/gl-core/src/ScalarFill.ts:40

___

### widthSegments

• `Optional` **widthSegments**: `number`

#### Defined in

packages/gl-core/src/ScalarFill.ts:51

___

### wireframe

• `Optional` **wireframe**: `boolean`

#### Defined in

packages/gl-core/src/ScalarFill.ts:53
