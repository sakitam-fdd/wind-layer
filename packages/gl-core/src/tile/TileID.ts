import { TileBounds } from '../type';

export default class TileID {
  /**
   * 瓦片列
   */
  public x: number;
  /**
   * 瓦片行
   */
  public y: number;
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

  public options: any;

  /**
   * @param overscaledZ 扩大的 z 值
   * @param x 列
   * @param y 行
   * @param z 层级
   * @param wrap 所处世界
   * @param options 瓦片其他配置
   */
  constructor(overscaledZ: number, x: number, y: number, z: number, wrap = 0, options: any = {}) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.wrap = wrap;
    this.tileKey = `${z}_${x}_${y}-${wrap}`;
    this.unWrappedTileKey = `${z}_${x}_${y}`;
    this.overscaledZ = overscaledZ;
    this.options = options;
  }

  /**
   * 获取瓦片范围
   */
  getTileBounds(tileID = this) {
    return this.options.getTileBounds(tileID.x, tileID.y, tileID.z, tileID.wrap);
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
      return new TileID(targetZ, this.x, this.y, this.z, this.wrap, this.options);
    } else {
      return new TileID(
        targetZ,
        this.x >> zDifference,
        this.y >> zDifference,
        targetZ,
        this.wrap,
        this.options,
      );
    }
  }

  /**
   * 获取父级瓦片
   */
  parent() {
    if (this.z > 0) return new TileID(this.z - 1, this.x >> 1, this.y >> 1, this.wrap);
    else return new TileID(this.z, this.x, this.y, this.wrap);
  }

  /**
   * 查找当前瓦片的子瓦片
   * @param sourceMaxZoom
   */
  children(sourceMaxZoom: number): TileID[] {
    // 如果所需层级大于了数据的最大层级，那么不需要寻找子集瓦片
    if (this.overscaledZ >= sourceMaxZoom) {
      return [new TileID(this.overscaledZ + 1, this.x, this.y, this.z, this.wrap, this.options)];
    }

    const z = this.z + 1;
    const x = this.x * 2;
    const y = this.y * 2;
    return [
      new TileID(z, x, y, z, this.wrap, this.options),
      new TileID(z, x + 1, y, z, this.wrap, this.options),
      new TileID(z, x, y + 1, z, this.wrap, this.options),
      new TileID(z, x + 1, y + 1, z, this.wrap, this.options),
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
  neighbor(hor, ver) {
    if (this.z === 0) {
      return new TileID(0, 0, 0, this.wrap + hor);
    }
    const max = Math.pow(2, this.z);
    return new TileID(
      this.z,
      (this.x + hor + max) % max,
      (this.y + ver + max) % max,
      this.x + hor < 0 ? this.wrap - 1 : this.x + hor > max ? this.wrap + 1 : this.wrap,
    );
  }

  isEqual(tile: TileID) {
    return tile.x === this.x && tile.y === this.y && tile.z === this.z && tile.wrap === this.wrap;
  }

  /**
   * 判断是否是根节点
   * @returns {boolean}
   */
  isRoot() {
    return this.z === 0;
  }
}
