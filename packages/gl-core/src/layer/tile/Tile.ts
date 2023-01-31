import { Geometry, Plane, Program, Renderer, Texture } from '@sakitam-gis/vis-engine';
import TileMesh from './TileMesh';
import { DecodeType, TileState, TileSize, TileBounds, LayerData, DataRange } from '../../type';
import { isImageBitmap, resolveURL, parseRange } from '../../utils/common';

export interface TileOptions {
  /**
   * 针对单个瓦片可能存在多个数据
   */
  url: string | string[];
  actor: any;
  userData: LayerData;
  tileBounds: TileBounds;
  tileSize: TileSize;
  onLoad: (ctx: Tile) => void;
  wrap?: number;
  tileZoom?: number;
  tileKey?: string;
  decodeType?: DecodeType;
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
   * 哪个世界
   */
  public wrap: number;

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
   * 瓦片路径
   */
  public url: string | string[];

  /**
   * 瓦片的世界范围
   */
  public tileBounds: TileBounds;

  /**
   * 数据解析类型
   */
  public decodeType: DecodeType;

  public userData: LayerData;

  public actor: any;

  public tileCenter: [number, number, number];

  public renderer: Renderer;

  public tileMesh: TileMesh;

  public geometry: Plane;

  #onLoad: any;

  #dataRange: DataRange | DataRange[];

  #request: Map<string, any>;

  #textures: Map<number, Texture> = new Map();

  /**
   * @param renderer
   * @param x 默认为 0
   * @param y 默认为 0
   * @param z 默认为 0
   * @param options
   */
  constructor(renderer: Renderer, x = 0, y = 0, z = 0, options: TileOptions = {} as TileOptions) {
    this.renderer = renderer;
    this.x = x;
    this.y = y;
    this.z = z;
    this.wrap = options.wrap || 0;
    this.actor = options.actor;

    this.tileKey = options.tileKey || `${x}_${y}_${z}_${this.wrap}`;

    this.url = options.url;
    this.tileSize = options.tileSize;
    this.tileBounds = options.tileBounds;
    this.tileCenter = this.getCenter();
    this.decodeType = options.decodeType ?? DecodeType.image;
    this.userData = options.userData;

    this.#onLoad = options.onLoad;
    this.#request = new Map();
    this.#dataRange = [];

    this.state = TileState.loading;
    this.updateGeometry(true);
  }

  hasData() {
    return this.state === TileState.loaded;
  }

  isLoaded() {
    return this.state === TileState.loaded || this.state === TileState.errored;
  }

  getMesh() {
    return this.tileMesh.getMesh();
  }

  get textures() {
    return this.#textures;
  }

  /**
   * 针对需要从元数据解析的数据范围从此处获取
   * 一般我们会从 Exif 信息中读取
   */
  getDataRange() {
    return this.#dataRange;
  }

  #loadData(url) {
    return new Promise((resolve, reject) => {
      this.actor.send(
        'loadData',
        {
          url: resolveURL(url),
          cancelId: url,
          type: 'arrayBuffer',
          decodeType: this.decodeType,
        },
        (e, data) => {
          if (e) {
            return reject(e);
          }
          resolve(data);
        },
      );
      this.#request.set(url, url);
    });
  }

  #removeRequest() {
    if (Array.isArray(this.url)) {
      for (let i = 0; i < this.url.length; i++) {
        this.#request.delete(this.url[i]);
      }
    } else {
      this.#request.delete(this.url);
    }
  }

  /**
   * 更新瓦片顶点信息
   * @param force
   */
  updateGeometry(force?: boolean) {
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
      this.geometry = new Geometry(this.renderer, {
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
   * @param program
   * @param force
   */
  createMesh(program: Program, force?: boolean) {
    if (!this.tileMesh || force) {
      this.tileMesh = new TileMesh(this.tileKey, this.renderer, program, this.geometry);
      this.tileMesh.setCenter(this.tileCenter);
    }

    return this.tileMesh;
  }

  createTextures(index: number, image) {
    const texture = this.#textures.get(index);
    const iib = isImageBitmap(image) || image instanceof Image;
    if (texture) {
      texture.setData(iib ? image : image?.isTiff ? image.rasters[0] : image.data);
    } else {
      this.#textures.set(
        index,
        new Texture(this.renderer, {
          image: iib ? image : image?.isTiff ? image.rasters[0] : image.data,
          width: image.width,
          height: image.height,
          minFilter: this.renderer.gl.LINEAR,
          magFilter: this.renderer.gl.LINEAR,
          wrapS: this.renderer.gl.CLAMP_TO_EDGE,
          wrapT: this.renderer.gl.CLAMP_TO_EDGE,
          flipY: true, // 注意，对 ImageBitmap 无效
          premultiplyAlpha: false, // 禁用 `Alpha` 预乘
          type: image?.isTiff ? this.renderer.gl.FLOAT : this.renderer.gl.UNSIGNED_BYTE,
          format: image?.isTiff ? this.renderer.gl.LUMINANCE : this.renderer.gl.RGBA,
        }),
      );
    }
  }

  /**
   * 执行数据加载
   */
  async load() {
    // 在这里我们需要实现 webworker 加载
    try {
      this.state = TileState.loading;
      if (Array.isArray(this.url)) {
        const p: Promise<any>[] = [];
        for (let i = 0; i < this.url.length; i++) {
          p.push(this.#loadData(this.url[i]));
        }
        const data = await Promise.all(p);
        data.forEach((d, index) => {
          if (d.withExif) {
            this.#dataRange.push(parseRange(d.exif as string));
          }
          this.createTextures(index, data);
        });
      } else {
        const data: any = await this.#loadData(this.url);
        if (data.withExif) {
          this.#dataRange = parseRange(data.exif as string);
        }
        this.createTextures(0, data);
      }

      this.#removeRequest();

      this.state = TileState.loaded;

      if (this.#onLoad) {
        this.#onLoad(this);
      }
    } catch (e) {
      this.state = TileState.errored;
      this.#removeRequest();
      console.error(e);
    }

    return this;
  }

  /**
   * 如果存在进行中的请求，那么执行 cancel
   * 如果已经加载完成，执行资源释放
   */
  unload() {
    // 支持取消
    if (this.#request.size > 0 && this.state === TileState.loading) {
      const iterator = this.#request.entries();
      for (let i = 0; i < this.#request.size; i++) {
        const [url] = iterator.next().value;
        if (url) {
          this.actor.send('cancel', {
            url,
            cancelId: url,
          });
        }
      }
    }
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
  getCenter(): [number, number, number] {
    return [
      (this.tileBounds.left + this.tileBounds.right) / 2,
      (this.tileBounds.top + this.tileBounds.bottom) / 2,
      0,
    ];
  }

  destroy() {
    this.unload();
    for (const [, value] of this.#textures) {
      if (value) {
        value?.destroy();
      }
    }
    this.#textures.clear();
    if (this.geometry) {
      this.geometry.destroy();
    }
  }
}
