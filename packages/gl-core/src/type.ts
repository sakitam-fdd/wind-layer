export enum RenderFrom {
  // 标量值
  r = 'r',
  // 矢量值
  rg = 'rg',
  // 一般用于浮点值（精度最高）
  rgba = 'rgba',
}

export enum LayerDataType {
  image = 'image',
  tile = 'tile',
  jsonArray = 'jsonArray',
}

interface ImageData {
  type: LayerDataType.image;
  url: string | string[];
  /**
   * top left, top right, bottom right, bottom left
   */
  extent: number[][];
  width?: number;
  height?: number;
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
  tileSize: number;
  url: string | string[];
  subdomains?: (number | string)[];
}

export type LayerData = ImageData | JsonArrayData | TileData;
