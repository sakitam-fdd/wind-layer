import { Renderer, utils, EventEmitter } from '@sakitam-gis/vis-engine';
import SourceCache from './cahce';
import {
  DecodeType,
  LayerSourceType,
  ParseOptionsType,
  TileSourceOptions,
  TileState,
} from '../type';
import { containTile, resolveURL } from '../utils/common';
import TileID from '../tile/TileID';
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

export interface TileSourceInterval {
  url: TileSourceOptions['url'];
}

export default class TileSource extends EventEmitter {
  /**
   * 数据源 id
   */
  public id: string;

  /**
   * 数据源类型
   */
  public type: LayerSourceType.tile;

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

  public url: string | string[];

  /**
   * 瓦片大小
   */
  public tileSize: number;

  public tileBounds: TileSourceOptions['tileBounds'];

  /**
   * 配置项
   */
  public options: TileSourceOptions;

  public renderer: Renderer;

  public dispatcher: any;

  public layer: WithNull<Layer>;

  /**
   * 是否跨世界渲染
   */
  public wrapX: boolean;

  public parseOptions: ParseOptionsType;

  #loaded = false;
  #sourceCache: SourceCache;
  #tileWorkers: Map<string, any> = new Map();

  constructor(id, options: TileSourceOptions) {
    super();
    this.id = id;

    this.type = LayerSourceType.tile;
    this.minZoom = options.minZoom ?? 0;
    this.maxZoom = options.maxZoom ?? 22;
    this.roundZoom = Boolean(options.roundZoom);
    this.scheme = options.scheme || 'xyz';
    this.tileSize = options.tileSize || 512;
    this.tileBounds = options.tileBounds;
    this.wrapX = Boolean(options.wrapX);

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

  onAdd(layer, cb?: any) {
    this.layer = layer;
    this.load(cb);
  }

  update(data: TileSourceInterval, clear = true): this {
    this.options.url = data.url;
    this.reload(clear);

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
    this.url = this.options.url;
    if (cb) {
      cb(null);
    }
  }

  loaded() {
    return this.#loaded;
  }

  reload(clear: boolean) {
    this.#loaded = false;
    this.load(() => {
      if (clear) {
        this.#sourceCache.clearTiles();
      } else {
        this.#sourceCache.reload();
      }
      this.layer?.update();
    });
  }

  hasTile(coord: TileID) {
    return !this.tileBounds || containTile(this.tileBounds, coord.getTileBounds());
  }

  getFadeTime() {
    return 0;
  }

  getUrl(x: number, y: number, z: number) {
    const { subdomains } = this.options;
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

    if (Array.isArray(this.url)) {
      if (this.url.length > 2) {
        console.warn(
          `[TileSource]: Only supports up to two urls, Now there are more than two urls-${this.url.toString()}, and only the first two are selected by default`,
        );
      }
      return this.url.filter((item, index) => index < 2).map((u) => formatUrl(u, data));
    }

    return formatUrl(this.url, data);
  }

  asyncActor(tile: Tile, url: string) {
    return new Promise((resolve, reject) => {
      const id = `${tile.tileID.tileKey}-${url}`;
      tile.actor.send(
        'loadData',
        {
          url: resolveURL(url),
          cancelId: id,
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
      tile.request.set(id, url);
    });
  }

  getTileUrl(tileID: TileID) {
    const z = tileID.z;
    const x = tileID.x;
    const y = this.scheme === 'tms' ? Math.pow(2, tileID.z) - tileID.y - 1 : tileID.y;

    const url = this.getUrl(x, y, z);

    let urls: string[] = url as string[];
    if (utils.isString(url)) {
      urls = [url];
    }

    return urls;
  }

  loadTile(tile: Tile, callback) {
    try {
      if (!tile.actor || tile.state === TileState.reloading) {
        const urls = this.getTileUrl(tile.tileID);

        const key = urls.join(',');
        this.#tileWorkers.set(key, this.#tileWorkers.get(key) || this.dispatcher.getActor());
        tile.actor = this.#tileWorkers.get(key);

        const p: Promise<any>[] = [];
        for (let i = 0; i < urls.length; i++) {
          p.push(this.asyncActor(tile, urls[i]));
        }

        Promise.all(p)
          .then((data) => {
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
          })
          .catch((e) => {
            tile.state = TileState.errored;
            console.log(e);
          });
      } else if (tile.state === TileState.loading) {
        // schedule tile reloading after it has been loaded
        tile.reloadCallback = callback;
      }
    } catch (e) {
      tile.state = TileState.errored;
      return callback(e);
    }
  }

  abortTile(tile: Tile, callback) {
    if (tile.request) {
      if (tile.request.size > 0 && tile.actor) {
        const iterator = tile.request.entries();
        for (let i = 0; i < tile.request.size; i++) {
          const [id, url] = iterator.next().value;
          if (id) {
            tile.actor.send(
              'cancel',
              {
                url,
                cancelId: id,
              },
              (err) => {
                if (err) {
                  tile.state = TileState.unloaded;
                }
              },
            );
          }
        }
      }
      tile.request.clear();
    } else {
      tile.state = TileState.unloaded;
    }
    callback();
  }

  unloadTile(tile: Tile, callback) {
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
