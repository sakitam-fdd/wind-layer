---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / [gl-core/src](../modules/gl_core_src.md) / UserOptions

# Interface: UserOptions

[gl-core/src](../modules/gl_core_src.md).UserOptions

## Hierarchy

- **`UserOptions`**

  ↳ [`BaseLayerOptions`](gl_core_src.BaseLayerOptions.md)

## Properties

### displayRange

• `Optional` **displayRange**: [`number`, `number`]

#### Defined in

[packages/gl-core/src/renderer/index.ts:65](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L65)

___

### flipY

• `Optional` **flipY**: `boolean`

#### Defined in

[packages/gl-core/src/renderer/index.ts:70](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L70)

___

### heightSegments

• `Optional` **heightSegments**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:67](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L67)

___

### mask

• `Optional` **mask**: `Object`

可以为任意 GeoJSON 数据

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `Attributes`[] |
| `type` | [`MaskType`](../enums/gl_core_src.MaskType.md) |

#### Defined in

[packages/gl-core/src/renderer/index.ts:79](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L79)

___

### picking

• `Optional` **picking**: `boolean`

是否开启拾取

#### Defined in

[packages/gl-core/src/renderer/index.ts:75](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L75)

___

### renderFrom

• `Optional` **renderFrom**: [`RenderFrom`](../enums/gl_core_src.RenderFrom.md)

指定渲染通道

#### Defined in

[packages/gl-core/src/renderer/index.ts:44](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L44)

___

### renderType

• **renderType**: [`RenderType`](../enums/gl_core_src.RenderType.md)

渲染类型
目前支持三种类型：
0：普通 raster 瓦片渲染
1：气象数据的色斑图渲染
2：风等 vector 数据的粒子渲染

#### Defined in

[packages/gl-core/src/renderer/index.ts:40](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L40)

___

### styleSpec

• `Optional` **styleSpec**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `dropRate?` | `number` \| `any`[] | - |
| `dropRateBump?` | `number` \| `any`[] | - |
| `fadeOpacity?` | `number` \| `any`[] | - |
| `fill-color?` | `any`[] | - |
| `numParticles?` | `number` \| `any`[] | - |
| `opacity?` | `number` \| `any`[] | - |
| `size?` | [`number`, `number`] | arrow size |
| `space?` | `number` \| `any`[] | arrow space |
| `speedFactor?` | `number` \| `any`[] | - |

#### Defined in

[packages/gl-core/src/renderer/index.ts:45](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L45)

___

### widthSegments

• `Optional` **widthSegments**: `number`

#### Defined in

[packages/gl-core/src/renderer/index.ts:66](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L66)

___

### wireframe

• `Optional` **wireframe**: `boolean`

#### Defined in

[packages/gl-core/src/renderer/index.ts:68](https://github.com/sakitam-fdd/wind-layer/blob/fa9bdd2/packages/gl-core/src/renderer/index.ts#L68)
