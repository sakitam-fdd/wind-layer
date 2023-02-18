import { Renderer } from '@sakitam-gis/vis-engine';
import SourceCache from './cahce';

const URL_PATTERN = /\{ *([\w_]+) *\}/g;

function formatUrl(url: string, data: any) {
  return url.replace(URL_PATTERN, (str, key) => {
    let value = data[key];

    if (value === undefined) {
      throw new Error(`No value provided for variable ${str}`);
    } else if (typeof value === 'function') {
      value = value(data);
    }
    return value;
  });
}

export interface TileSourceOptions {
  type: 'tile';
  url: string;
  bounds?: [number, number, number, number];
  minZoom?: number;
  maxZoom?: number;
  tileSize?: number;
  scheme?: 'xyz' | 'tms';
  subdomains?: string[];
}

export default class TileSource {
  /**
   * 数据源 id
   */
  public id: string;

  /**
   * 数据源类型
   */
  public type: 'tile';

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
   * 瓦片规范
   */
  public scheme: 'xyz' | 'tms';

  /**
   * 瓦片大小
   */
  public tileSize: number;

  /**
   * 配置项
   */
  public options: TileSourceOptions;

  public renderer: Renderer;

  public dispatcher: any;

  public parseOptions: any;

  #loaded = false;
  #sourceCache: SourceCache;

  constructor(id, options: TileSourceOptions) {
    this.id = id;

    this.type = 'tile';
    this.minZoom = options.minZoom || 0;
    this.maxZoom = options.maxZoom || 22;
    this.roundZoom = false;
    this.scheme = options.scheme || 'xyz';
    this.tileSize = options.tileSize || 256;

    this.options = {
      ...options,
      type: 'tile',
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

  hasTile() {
    return true;
  }

  getUrl(x, y, z) {
    const { url, subdomains } = this.options;
    let domain: string | number = '';
    if (subdomains) {
      if (Array.isArray(subdomains) && subdomains.length > 0) {
        const { length } = subdomains;
        let s = (x + y) % length;
        if (s < 0) {
          s = 0;
        }
        domain = subdomains[s];
      }
    }

    const data = {
      x,
      y,
      z,
      s: domain,
    };

    if (Array.isArray(url)) {
      if (url.length > 2) {
        console.warn(
          `[TileSource]: Only supports up to two urls, Now there are more than two urls-${url.toString()}, and only the first two are selected by default`,
        );
      }
      return url.filter((item, index) => index < 2).map((u) => formatUrl(u, data));
    }

    return formatUrl(url, data);
  }

  loadTile(tile, callback) {
    const z = tile.z;
    const x = tile.x;
    const y = this.scheme === 'tms' ? Math.pow(2, tile.z) - tile.y - 1 : tile.y;

    const url = this.getUrl(x, y, z);
    console.log(url);
  }

  abortTile(tile, callback) {
    if (tile.request) {
      tile.request.cancel();
      delete tile.request;
    }
    callback();
  }

  unloadTile(tile, callback) {
    callback();
  }
}
