import { TileBounds, ProjTileBounds } from '../type';
import { getBoundFromTileID } from './utils';
import { isFunction } from '../utils/common';

export interface TileIDOptions {
  getTileBounds?: (tileID: TileID) => TileBounds;
  getTileProjBounds: (tileID: TileID) => ProjTileBounds;
}

export default class TileID {
  /**
   * 瓦片列
   */
  public x: number;

  /**
   * 跨世界后的瓦片列
   */
  public wrapedX: number;
  /**
   * 瓦片行
   */
  public y: number;

  /**
   * 跨世界后的瓦片行（目前仅 maptalks 支持）
   */
  public wrapedY: number;

  /**
   * 瓦片层级
   */
  public z: number;
  /**
   * 所在世界（如果是多世界的话）
   */
  public wrap: number;

  /**
   * 放大后的 zoom 值
   */
  public overscaledZ: number;
  /**
   * 瓦片唯一标识
   */
  public tileKey: string;
  /**
   * 不包含跨世界的瓦片标识（因为多个世界的瓦片如果仅仅是 `wrap` 不同，他们对应的数据资源是完全相同的）
   */
  public unWrappedTileKey: string;

  /**
   * 瓦片范围（每次获取时计算）
   */
  public tileBounds: TileBounds;

  /**
   * 投影后的瓦片范围
   */
  public projTileBounds: ProjTileBounds;

  public options: TileIDOptions;

  /**
   * @param overscaledZ 扩大的 z 值
   * @param wrap 所处世界
   * @param z 层级
   * @param x 列
   * @param y 行
   * @param options 瓦片其他配置
   */
  constructor(
    overscaledZ: number,
    wrap = 0,
    z: number,
    x: number,
    y: number,
    options: TileIDOptions = {} as TileIDOptions,
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.wrap = wrap;
    this.tileKey = `${z}_${x}_${y}-${wrap}`;
    this.unWrappedTileKey = `${z}_${x}_${y}`;

    const max = Math.pow(2, this.z);

    this.wrapedX = max * wrap + this.x;
    this.wrapedY = this.y;
    this.overscaledZ = overscaledZ;
    this.options = options;

    this.getTileBounds();
  }

  /**
   * 获取瓦片范围
   */
  getTileBounds(tileID = this) {
    if (isFunction(this.options.getTileBounds)) {
      this.tileBounds = this.options.getTileBounds(tileID);
    } else {
      this.tileBounds = getBoundFromTileID(tileID);
    }
    return this.tileBounds;
  }

  /**
   * 获取瓦片投影后的范围
   */
  getTileProjBounds(tileID = this, force?: boolean) {
    if (!this.projTileBounds || force) {
      this.projTileBounds = this.options.getTileProjBounds?.(tileID);
    }

    return this.projTileBounds;
  }

  overscaleFactor(): number {
    return Math.pow(2, this.overscaledZ - this.z);
  }

  /**
   * 缩放到目标层级
   * @param targetZ
   */
  scaledTo(targetZ: number): TileID {
    const zDifference = this.z - targetZ;
    if (targetZ > this.z) {
      return new TileID(targetZ, this.wrap, this.z, this.x, this.y, this.options);
    } else {
      return new TileID(
        targetZ,
        this.wrap,
        targetZ,
        this.x >> zDifference,
        this.y >> zDifference,
        this.options,
      );
    }
  }

  /**
   * 获取父级瓦片
   */
  parent() {
    if (this.z > 0)
      return new TileID(this.z - 1, this.wrap, this.z - 1, this.x >> 1, this.y >> 1, this.options);
    else return new TileID(this.z, this.wrap, this.z, this.x, this.y, this.options);
  }

  /**
   * 查找当前瓦片的子瓦片
   * @param sourceMaxZoom
   */
  children(sourceMaxZoom: number): TileID[] {
    // 如果所需层级大于了数据的最大层级，那么不需要寻找子集瓦片
    if (this.overscaledZ >= sourceMaxZoom) {
      return [new TileID(this.overscaledZ + 1, this.wrap, this.z, this.x, this.y, this.options)];
    }

    const z = this.z + 1;
    const x = this.x * 2;
    const y = this.y * 2;
    return [
      new TileID(z, this.wrap, z, x, y, this.options),
      new TileID(z, this.wrap, z, x + 1, y, this.options),
      new TileID(z, this.wrap, z, x, y + 1, this.options),
      new TileID(z, this.wrap, z, x + 1, y + 1, this.options),
    ];
  }

  /**
   * 查找兄弟瓦片
   */
  siblings() {
    return this.z === 0
      ? []
      : this.parent()
          .children(this.overscaledZ)
          .filter((t) => !this.isEqual(t));
  }

  /**
   * 查找相临瓦片
   * @param hor 横向偏移
   * @param ver 纵向偏移
   */
  neighbor(hor: number, ver = 0) {
    if (this.z === 0) {
      return new TileID(this.overscaledZ, this.wrap + hor, this.z, this.x, this.y, this.options);
    }
    const max = Math.pow(2, this.z);

    const w = this.x + hor;
    const dw = Math.floor(w / max);
    const wrap = this.wrap + dw;

    return new TileID(
      this.overscaledZ,
      wrap,
      this.z,
      (this.x + hor - max * dw) % max,
      (this.y + ver + max) % max,
      this.options,
    );
  }

  /**
   * 判断瓦片是否相同
   * 一般我们认为只要 xyz 和所处世界 wrap 相同就确认相同（即 tileKey 相同）
   * @param tile
   */
  isEqual(tile: TileID) {
    return tile.tileKey === this.tileKey;
  }

  /**
   * 判断是否是根节点
   * @returns {boolean}
   */
  isRoot(): boolean {
    return this.z === 0;
  }
}
