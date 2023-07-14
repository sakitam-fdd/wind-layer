import { Geometry, Plane, Program, Renderer, Texture } from '@sakitam-gis/vis-engine';
import TileMesh from './TileMesh';
import { ParseOptionsType, ProjTileBounds, RenderFrom, TileBounds, TileState } from '../type';
import { isImageBitmap, parseRange } from '../utils/common';
import TileID from './TileID';

export interface TileOptions {
  tileBounds?: TileBounds;
  tileSize: number;
}

/**
 * 这里是一个内部的瓦片实现，他主要是为了统各地图类库的瓦片相关操作
 * 我们常规需要的是在某个地图类库下某个瓦片的 xyz 以及其对应投影下
 * 的瓦片范围（常规情况使用世界坐标，部分类库可能直接使用像素位置并且在每一帧更新），
 * 并且在此我们需要维护瓦片的状态。
 */
export default class Tile {
  /**
   * 瓦片 是否取消请求
   */
  public aborted: boolean;

  /**
   * 瓦片重加载回调
   */
  public reloadCallback: any;

  /**
   * worker 执行器
   */
  public actor: any;

  /**
   * 瓦片 ID
   */
  public tileID: TileID;

  /**
   * 瓦片数据加载状态
   */
  public state: TileState;

  /**
   * 瓦片加载失败的次数
   */
  public errorCount = 0;

  /**
   * 允许的瓦片最大失败次数
   */
  public maxErrorCount = 3;

  /**
   * 瓦片的世界范围
   */
  public tileBounds: ProjTileBounds;

  /**
   * 瓦片尺寸
   */
  public tileSize: number;

  /**
   * 瓦片使用次数（在多个 render 共享 source 时，瓦片只能在为被任何渲染器使用时才能被销毁）
   */
  public uses = 0;

  public tileMeshs: Map<string, TileMesh> = new Map();

  public geometry: Plane;

  request: Map<string, any>;

  #textures: Map<number, Texture> = new Map();

  /**
   * @param tileID
   * @param options
   */
  constructor(tileID: TileID, options: TileOptions = {} as TileOptions) {
    this.tileID = tileID;

    this.tileSize = options.tileSize;

    this.request = new Map();

    this.state = TileState.loading;
  }

  /**
   * 瓦片是否已经加载到数据
   */
  hasData() {
    return this.state === TileState.loaded || this.state === TileState.reloading;
  }

  /**
   * 瓦片是否已经请求过
   */
  wasRequested(): boolean {
    return this.state === TileState.errored || this.state === TileState.loaded;
  }

  /**
   * 瓦片是否加载完成
   */
  isLoaded() {
    return (
      this.state === TileState.loaded ||
      this.state === TileState.reloading ||
      this.state === TileState.errored
    );
  }

  getMesh(passId) {
    return this.tileMeshs.get(passId);
  }

  get textures() {
    return this.#textures;
  }

  get tileCenter() {
    return [
      (this.tileBounds.left + this.tileBounds.right) / 2,
      (this.tileBounds.top + this.tileBounds.bottom) / 2,
      0,
    ];
  }

  /**
   * 更新瓦片顶点信息
   * @param bbox
   * @param renderer
   * @param force
   */
  updateGeometry(bbox: ProjTileBounds, renderer: Renderer, force?: boolean) {
    this.tileBounds = bbox;
    if (!this.geometry || force) {
      const position = [
        this.tileBounds.left,
        this.tileBounds.top,
        0,
        this.tileBounds.right,
        this.tileBounds.top,
        0,
        this.tileBounds.left,
        this.tileBounds.bottom,
        0,
        this.tileBounds.right,
        this.tileBounds.bottom,
        0,
      ];
      let i = 0;
      const len = position.length;
      for (; i < len; i += 3) {
        // eslint-disable-next-line operator-assignment
        position[i] = position[i] - this.tileCenter[0];
        position[i + 1] = position[i + 1] - this.tileCenter[1];
        position[i + 2] = position[i + 2] - this.tileCenter[2];
      }
      this.geometry = new Geometry(renderer, {
        position: {
          size: 3,
          data: new Float32Array(position),
        },
        normal: {
          size: 3,
          data: new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]),
        },
        uv: {
          size: 2,
          data: new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]),
        },
        index: {
          data: new Uint16Array([0, 2, 1, 2, 3, 1]),
        },
      });
    }
  }

  /**
   * 创建 `TileMesh`
   * @param passId
   * @param bbox
   * @param renderer
   * @param program
   * @param force
   */
  createMesh(passId: string, bbox: ProjTileBounds, renderer: Renderer, program: Program, force?: boolean) {
    this.updateGeometry(bbox, renderer, force);
    if (!this.tileMeshs.get(passId) || force) {
      const tileMesh = new TileMesh(this.tileID.tileKey, renderer, program, this.geometry);
      tileMesh.setCenter(this.tileCenter);
      this.tileMeshs.set(passId, tileMesh);
    }

    return this.tileMeshs.get(passId);
  }

  /**
   * 创建纹理
   * @param renderer
   * @param index
   * @param image
   * @param parseOptions
   * @param userData
   */
  setTextures(
    renderer: Renderer,
    index: number,
    image: any,
    parseOptions: ParseOptionsType,
    userData?: any,
  ) {
    const texture = this.#textures.get(index);
    const iib = isImageBitmap(image) || image instanceof Image;

    let dataRange;

    if (userData?.dataRange) {
      dataRange = userData?.dataRange;
    } else if (image.withExif) {
      dataRange = parseRange(image.exif as string);
    }

    if (texture) {
      if (texture.userData) {
        texture.userData.dataRange = dataRange;
      }
      texture.setData(iib ? image : image.data);
    } else {
      this.#textures.set(
        index,
        new Texture(renderer, {
          userData: dataRange
            ? {
                dataRange,
              }
            : undefined,
          image: iib ? image : image.data,
          width: image.width,
          height: image.height,
          minFilter: renderer.gl.LINEAR,
          magFilter: renderer.gl.LINEAR,
          wrapS: renderer.gl.CLAMP_TO_EDGE,
          wrapT: renderer.gl.CLAMP_TO_EDGE,
          flipY: false, // 注意，对 ImageBitmap 无效
          premultiplyAlpha: false, // 禁用 `Alpha` 预乘
          type:
            parseOptions.renderFrom === RenderFrom.float
              ? renderer.gl.FLOAT
              : renderer.gl.UNSIGNED_BYTE,
          format:
            parseOptions.renderFrom === RenderFrom.float
              ? renderer.isWebGL2
                ? (renderer.gl as WebGL2RenderingContext).RED
                : renderer.gl.LUMINANCE
              : renderer.gl.RGBA,
          internalFormat:
            parseOptions.renderFrom === RenderFrom.float
              ? renderer.isWebGL2
                ? (renderer.gl as WebGL2RenderingContext).R32F
                : renderer.gl.LUMINANCE
              : renderer.gl.RGBA,
        }),
      );
    }
  }

  /**
   * 获取瓦片世界坐标系下的范围
   */
  getBounds() {
    return this.tileBounds;
  }

  copy(tile: Tile) {
    this.#textures = tile.textures;
    this.actor = tile.actor;
    this.state = tile.state !== TileState.errored ? TileState.loaded : TileState.errored;
    this.request = tile.request;
    this.reloadCallback = tile.reloadCallback;
    return this;
  }

  /**
   * 释放瓦片资源
   */
  destroy() {
    for (const [, value] of this.#textures) {
      if (value) {
        value?.destroy();
      }
    }
    for (const [, value] of this.#textures) {
      if (value) {
        value?.delete();
      }
    }
    this.#textures.clear();
    if (this.geometry) {
      this.geometry.destroy();
    }
    for (const [, value] of this.tileMeshs) {
      if (value) {
        value?.destroy();
      }
    }
    this.tileMeshs.clear();
  }
}
