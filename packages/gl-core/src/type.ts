export type RenderType = 0 | 1 | 2 | 3; // 对应以下四种数据类型，用于在着色器中标识使用何种数据解码方式

export enum RenderFrom {
  // 标量值
  r = 'r',
  // 矢量值 (暂不可用)
  rg = 'rg',
  // 一般用于浮点值（需要在 glsl 中做 rgba2float 转换）
  rgba = 'rgba',
  // 浮点值（精度最高）
  float = 'float',
}

export function getRenderType(renderFrom: RenderFrom) {
  if (renderFrom === RenderFrom.rg) {
    return 1;
  }
  if (renderFrom === RenderFrom.rgba) {
    return 2;
  }
  if (renderFrom === RenderFrom.float) {
    return 3;
  }

  return 0;
}

/**
 * 解析类型
 */
export enum DecodeType {
  image = 0,
  unit8 = 1,
  tiff = 2,
  imageWithExif = 3,
}

export enum LayerDataType {
  image = 'image',
  tile = 'tile',
  jsonArray = 'jsonArray',
}

/**
 * 瓦片尺寸
 */
export type TileSize = [number, number];

/**
 * 数据范围
 */
export type DataRange = [number, number] | [number, number, number, number];

interface ImageData {
  type: LayerDataType.image;
  url: string | string[];
  /**
   * top left, top right, bottom right, bottom left
   */
  extent: number[][];
  tileSize?: TileSize;
  dataRange?: DataRange;
}

interface JsonArrayData {
  type: LayerDataType.jsonArray;
  header: {
    parameterCategory: number | string;
    parameterNumber: number | string;
    dx: number;
    dy: number;
    nx: number;
    ny: number;
    lo1: number;
    lo2: number;
    la1: number;
    la2: number;
    [key: string]: any;
  };
  data: number[];
}

interface TileData {
  type: LayerDataType.tile;
  tileSize: TileSize;
  url: string | string[];
  subdomains?: (number | string)[];
}

export type LayerData = ImageData | JsonArrayData | TileData;

export enum TileState {
  loading = '0',
  loaded = '1',
  errored = '2',
}

/**
 * 瓦片范围
 */
export interface TileBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export type TileLike = {
  x: number;
  y: number;
  z: number;
  wrap: number;
  tileKey: string;
  bounds: TileBounds;
  size: TileSize;
};
