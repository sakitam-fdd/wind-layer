export type RenderType = 0 | 1 | 2 | 3; // 对应以下四种数据类型，用于在着色器中标识使用何种数据解码方式

export enum RenderFrom {
  /**
   * 标量值
   * 一般需要配合数据配置中的 dataRange 字段解析原始值；
   * 当然也可以从图像的 `Exif` 信息中提取
   */
  r = 'r',
  /**
   * 矢量值，常见于气象要素的风速和风向等描述大小和方向的数据
   * 一般需要配合数据配置中的 dataRange 字段解析原始值；
   * 当然也可以从图像的 `Exif` 信息中提取
   */
  rg = 'rg',
  /**
   * 一般用于浮点值（需要在 glsl 中做 rgba2float 转换）
   */
  rgba = 'rgba',
  /**
   * 浮点值，一般存储在 r 通道或者使用 `LUMINANCE` 通道（精度最高）
   */
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
  /**
   * 以 `ImageBitmap` 图像解析
   */
  image = 0,

  /**
   * 解析为 `Uint8Array`
   */
  unit8 = 1,

  /**
   * 使用 `GeoTIFF` 作为解析器
   */
  tiff = 2,

  /**
   * 解析带有 `Exif` 的图像，一般我们使用单通道 `RenderFrom.r` 或者 `RenderFrom.rg`
   * 可能从 Exif 信息中提取原始值范围。
   */
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
export type TileSize = number;

/**
 * 数据范围
 */
export type DataRange = [number, number];

export type Coordinates = [[number, number], [number, number], [number, number], [number, number]];

export interface ImageSourceOptions {
  type: LayerDataType.image;
  url: string | [string, string];
  /**
   * top left, top right, bottom right, bottom left
   */
  coordinates: Coordinates;
  dataRange?: DataRange | [DataRange, DataRange];
  /**
   * 指定数据解析类型
   */
  decodeType?: DecodeType;
  maxTileCacheSize?: number;

  /**
   * 是否使用内存缓存，这在我们使用 `TimelineSource`
   */
  useMemoryCache?: number;
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

export type Bounds = [number, number, number, number];

export interface TileSourceOptions {
  type: LayerDataType.tile;
  url: string | [string, string];
  minZoom?: number;
  maxZoom?: number;
  tileSize?: TileSize;
  dataRange?: DataRange | [DataRange, DataRange];
  scheme?: 'xyz' | 'tms';
  subdomains?: (string | number)[];
  roundZoom?: number;
  /**
   * 指定数据解析类型
   */
  decodeType?: DecodeType;
  maxTileCacheSize?: number;
  tileBounds?: Bounds;
}

export type LayerData = ImageSourceOptions | JsonArrayData | TileSourceOptions;

export enum TileState {
  loading = '0',
  loaded = '1',
  errored = '2',
  unloaded = '3',
  reloading = '4',
}

/**
 * 瓦片范围
 */
export interface TileBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
  lngLatBounds: Bounds;
}

export type ParseOptionsType = {
  renderFrom: RenderFrom;
};
