import { Renderer } from '@sakitam-gis/vis-engine';
import SourceCache from './cahce';

export default class ImageSource {
  /**
   * 数据源 id
   */
  public id: string;

  /**
   * 数据源类型
   */
  public type: 'image';

  /**
   * 支持的最小层级
   */
  public minZoom: number;

  /**
   * 支持的最大层级
   */
  public maxZoom: number;

  /**
   * 是否对层级进行四舍五入
   */
  public roundZoom = false;

  /**
   * 瓦片大小
   */
  public tileSize: number;

  /**
   * 配置项
   */
  public options: any;

  public renderer: Renderer;

  public dispatcher: any;

  public parseOptions: any;

  #loaded = false;
  #sourceCache: SourceCache;

  constructor(id, options) {
    this.id = id;

    this.type = 'image';
    this.minZoom = options.minZoom || 0;
    this.maxZoom = options.maxZoom || 22;
    this.roundZoom = false;
    this.tileSize = options.tileSize || 256;

    this.options = {
      ...options,
      type: 'image',
    };

    this.#sourceCache = new SourceCache(this.id, this);
  }

  get sourceCache() {
    return this.#sourceCache;
  }

  prepare(renderer: Renderer, dispatcher, parseOptions) {
    this.renderer = renderer;
    this.dispatcher = dispatcher;
    this.parseOptions = parseOptions;
    if (this.#sourceCache.prepare) {
      this.#sourceCache.prepare(this.renderer, dispatcher);
    }
  }

  /**
   * 兼容 TileJSON 加载，需要具体实现
   * @param cb
   */
  load(cb) {
    this.#loaded = true;
    if (cb) {
      cb(null);
    }
  }

  loaded() {
    return this.#loaded;
  }

  reload() {
    // cancel Tile JSON 请求
    this.load(() => {
      console.log('clear');
    });
  }

  loadTile(tile, callback) {
    console.log(tile, callback);
  }

  hasTile(coord) {
    return true;
  }

  // eslint-disable-next-line
  unloadTile(tile, cb) {}

  // eslint-disable-next-line
  abortTile(tile, cb) {}
}
