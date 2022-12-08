import { Program, Renderer, Plane, utils } from '@sakitam-gis/vis-engine';
import TileMesh from './TileMesh';

export enum TileState {
  loading = '0',
  loaded = '1',
  errored = '2',
}

/**
 * 瓦片尺寸
 */
export interface TileSize {
  /**
   * 瓦片宽度
   */
  width: number;
  /**
   * 瓦片高度
   */
  height: number;
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

export interface TileOptions {
  /**
   * 针对单个瓦片可能存在多个数据
   */
  url: string | string[];
  tileBounds: TileBounds;
  tileSize: TileSize;
  tileZoom: number;
}

/**
 * 这里是一个内部的瓦片实现，他主要是为了统各地图类库的瓦片相关操作
 * 我们常规需要的是在某个地图类库下某个瓦片的 xyz 以及其对应投影下
 * 的瓦片范围（常规情况使用世界坐标，部分类库可能直接使用像素位置并且在每一帧更新），
 * 并且在此我们需要维护瓦片的状态。
 */
export default class Tile {
  /**
   * 瓦片 x
   */
  public x: number;

  /**
   * 瓦片 y
   */
  public y: number;

  /**
   * 瓦片 z
   */
  public z: number;

  /**
   * 瓦片 id
   */
  public id: string;
  public tileKey: string;

  /**
   * 瓦片数据加载状态
   */
  public state: TileState;

  /**
   * 瓦片尺寸
   */
  public tileSize: TileSize;

  /**
   * 瓦片的世界范围
   */
  public tileBounds: TileBounds;

  public mesh: TileMesh;

  public geometry: Plane;

  /**
   * @param x 默认为 0
   * @param y 默认为 0
   * @param z 默认为 0
   * @param options
   */
  constructor(x = 0, y = 0, z = 0, options: TileOptions) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.tileKey = `${x}_${y}_${z}`;

    this.id = utils.uid(`${this.tileKey}_tile`);

    this.tileSize = options.tileSize;
    this.tileBounds = options.tileBounds;

    this.state = TileState.loading;
  }

  isLoaded() {
    return this.state === TileState.loaded || this.state === TileState.errored;
  }

  textures() {

  }

  load() {
    // 在这里我们需要实现 webworker 加载
  }

  abort() {
    // 支持取消
  }

  // eslint-disable-next-line
  parent() {
    // TODO: 需要实现预加载吗？
  }

  // eslint-disable-next-line
  children() {
    // TODO: 需要实现子集加载失败使用父级瓦片吗？
  }

  /**
   * 获取瓦片世界坐标系下的范围
   */
  getBounds() {
    return this.tileBounds;
  }

  /**
   * 获取瓦片世界坐标系下的中心点
   */
  getCenter() {
    return [
      (this.tileBounds.left + this.tileBounds.right) / 2,
      (this.tileBounds.top + this.tileBounds.bottom) / 2,
    ];
  }

  /**
   * 更新瓦片顶点信息
   * @param renderer
   */
  updateGeometry(renderer: Renderer) {
    if (!this.geometry) {
      this.geometry = new Plane(renderer);
    }
  }

  /**
   * 创建 `TileMesh`
   * @param renderer
   * @param program
   * @param force
   */
  createMesh(renderer: Renderer, program: Program, force?: boolean) {
    if (!this.mesh || force) {
      this.mesh = new TileMesh(this.id, renderer, program, this.geometry);
    }

    return this.mesh;
  }
}
