---
sidebar: "auto"
editLinks: false
sidebarDepth: 4
---

[Class Docs](../index.md) / maptalks/src

# Module: maptalks/src

## Enumerations

- [DecodeType](../enums/maptalks_src.DecodeType.md)
- [LayerSourceType](../enums/maptalks_src.LayerSourceType.md)
- [MaskType](../enums/maptalks_src.MaskType.md)
- [RenderFrom](../enums/maptalks_src.RenderFrom.md)
- [RenderType](../enums/maptalks_src.RenderType.md)

## Classes

- [Field](../classes/maptalks_src.Field.md)
- [ImageSource](../classes/maptalks_src.ImageSource.md)
- [Layer](../classes/maptalks_src.Layer.md)
- [TileID](../classes/maptalks_src.TileID.md)
- [TileSource](../classes/maptalks_src.TileSource.md)
- [TimelineSource](../classes/maptalks_src.TimelineSource.md)
- [WindCore](../classes/maptalks_src.WindCore.md)
- [WindLayer](../classes/maptalks_src.WindLayer.md)

## Functions

### configDeps

▸ **configDeps**(`d`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `d` | `any` |

#### Returns

`void`

#### Defined in

packages/gl-core/dist/index.d.ts:1146

___

### formatData

▸ **formatData**(`data`, `options?`): [`Field`](../classes/maptalks_src.Field.md) \| `undefined`

format gfs json to vector

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `IGFSItem`[] |
| `options?` | `Partial`<`IField`\> |

#### Returns

[`Field`](../classes/maptalks_src.Field.md) \| `undefined`

#### Defined in

packages/core/dist/index.d.ts:318
