import { Renderer, utils } from '@sakitam-gis/vis-engine';
import SourceCache from './cahce';
import { DecodeType, LayerDataType, ParseOptionsType, TileSourceOptions, TileState } from '../type';
import { resolveURL } from '../utils/common';
import Tile from '../tile/Tile';
import Layer from '../renderer';

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

export default class TileSource {
  /**
   * 数据源 id
   */
  public id: string;

  /**
   * 数据源类型
   */
  public type: LayerDataType.tile;

  /**
   * 支持的最小层级
   */
  public minZoom: number;

  /**
   * 支持的最大层级
   */
  public maxZoom: number;

  /**
   * 生成瓦片时的配置
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

  public layer: WithNull<Layer>;

  public parseOptions: ParseOptionsType;

  #loaded = false;
  #sourceCache: SourceCache;
  #tileWorkers: Map<string, any> = new Map();

  constructor(id, options: TileSourceOptions) {
    this.id = id;

    this.type = LayerDataType.tile;
    this.minZoom = options.minZoom || 0;
    this.maxZoom = options.maxZoom || 22;
    this.roundZoom = Boolean(options.roundZoom);
    this.scheme = options.scheme || 'xyz';
    this.tileSize = options.tileSize || 256;

    const decodeType = options.decodeType || DecodeType.image;
    const maxTileCacheSize = options.maxTileCacheSize;

    this.options = {
      ...options,
      decodeType,
      maxTileCacheSize,
      type: this.type,
    };

    this.#sourceCache = new SourceCache(this.id, this);
  }

  get sourceCache() {
    return this.#sourceCache;
  }

  onAdd(layer) {
    this.layer = layer;
    this.load();
  }

  setUrl(url: TileSourceOptions['url']): this {
    this.options.url = url;
    this.reload();

    return this;
  }

  prepare(renderer: Renderer, dispatcher, parseOptions) {
    this.renderer = renderer;
    this.dispatcher = dispatcher;
    this.parseOptions = parseOptions;
  }

  /**
   * 兼容 TileJSON 加载，需要具体实现
   * @param cb
   */
  load(cb?: any) {
    this.#loaded = true;
    if (cb) {
      cb(null);
    }
  }

  loaded() {
    return this.#loaded;
  }

  reload() {
    this.load(() => {
      this.#sourceCache.clearTiles();
      this.layer?.update();
    });
  }

  hasTile(coord) {
    return true;
  }

  getUrl(x, y, z) {
    const { url, subdomains } = this.options;
    let domain: string | number = '';
    if (subdomains && Array.isArray(subdomains) && subdomains.length > 0) {
      const { length } = subdomains;
      let s = (x + y) % length;
      if (s < 0) {
        s = 0;
      }
      domain = subdomains[s];
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

  asyncActor(tile, url) {
    return new Promise((resolve, reject) => {
      tile.actor.send(
        'loadData',
        {
          url: resolveURL(url),
          cancelId: url,
          type: 'arrayBuffer',
          decodeType: this.options.decodeType,
        },
        (e, data) => {
          if (e) {
            return reject(e);
          }
          resolve(data);
        },
      );
      tile.request.set(url, url);
    });
  }

  loadTile(tile: Tile, callback) {
    const tileID = tile.tileID;
    const z = tileID.z;
    const x = tileID.x;
    const y = this.scheme === 'tms' ? Math.pow(2, tileID.z) - tileID.y - 1 : tileID.y;

    const url = this.getUrl(x, y, z);

    try {
      if (!tile.actor) {
        let urls: string[] = url as string[];
        if (utils.isString(url)) {
          urls = [url];
        }

        const key = urls.join(',');
        this.#tileWorkers.set(key, this.#tileWorkers.get(key) || this.dispatcher.getActor());
        tile.actor = this.#tileWorkers.get(key);

        const p: Promise<any>[] = [];
        for (let i = 0; i < urls.length; i++) {
          p.push(this.asyncActor(tile, urls[i]));
        }

        Promise.all(p).then((data) => {
          tile.request.clear();

          if (tile.aborted) {
            tile.state = TileState.unloaded;
            return callback(null);
          }

          if (!data) return callback(null);

          data.forEach((d, index) => {
            tile.setTextures(this.renderer, index, d, this.parseOptions, this.options);
          });

          tile.state = TileState.loaded;
          callback(null);
        });
      } else if (tile.state === TileState.loading) {
        // schedule tile reloading after it has been loaded
        tile.reloadCallback = callback;
      } else {
        // tile.request = tile.actor.send('reloadTile', params, done.bind(this));
      }
    } catch (e) {
      tile.state = TileState.errored;
      return callback(e);
    }
  }

  abortTile(tile, callback) {
    if (tile.request) {
      if (tile.request.size > 0 && tile.actor) {
        const iterator = tile.request.entries();
        for (let i = 0; i < tile.request.size; i++) {
          const [url] = iterator.next().value;
          if (url) {
            tile.actor.send('cancel', {
              url,
              cancelId: url,
            });
          }
        }
      }
      tile.request.clear();
    }
    callback();
  }

  unloadTile(tile, callback) {
    if (tile.actor) {
      // tile.actor.send('removeTile', {uid: tile.uid, type: this.type, source: this.id});
    }
  }

  destroy() {
    this.layer = null;
    this.#loaded = false;
    this.#tileWorkers.clear();
    this.#sourceCache.clear();
  }
}
