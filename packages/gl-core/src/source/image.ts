import { EventEmitter, Renderer, utils } from '@sakitam-gis/vis-engine';
import SourceCache from './cahce';
import {
  DecodeType,
  ImageSourceOptions,
  LayerSourceType,
  ParseOptionsType,
  TileState,
} from '../type';
import { resolveURL } from '../utils/common';
import Tile from '../tile/Tile';
import Layer from '../renderer';

export interface ImageSourceInterval {
  url: ImageSourceOptions['url'];
}

export default class ImageSource extends EventEmitter {
  /**
   * 数据源 id
   */
  public id: string;

  /**
   * 数据源类型
   */
  public type: LayerSourceType.image;

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
  public options: ImageSourceOptions;

  public url: ImageSourceOptions['url'];

  public renderer: Renderer;

  public dispatcher: any;

  public layer: WithNull<Layer>;

  public parseOptions: ParseOptionsType;

  /**
   * 影像坐标
   */
  public coordinates: ImageSourceOptions['coordinates'];

  /**
   * 是否跨世界渲染
   */
  public wrapX: boolean;

  #loaded = false;
  #sourceCache: SourceCache;
  #tileWorkers: Map<string, any> = new Map();

  constructor(id, options: ImageSourceOptions) {
    super();
    this.id = id;

    this.type = LayerSourceType.image;
    this.minZoom = 0;
    this.maxZoom = 22;
    this.roundZoom = false;
    this.tileSize = 512;
    this.coordinates = options.coordinates;
    this.wrapX = Boolean(options.wrapX);
    this.url = options.url;

    const decodeType = options.decodeType || DecodeType.image;

    this.options = {
      ...options,
      decodeType,
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

  prepare(renderer: Renderer, dispatcher, parseOptions: ParseOptionsType) {
    this.renderer = renderer;
    this.dispatcher = dispatcher;
    this.parseOptions = parseOptions;
  }

  update(data: ImageSourceInterval, clear = true) {
    this.options.url = data.url;
    this.reload(clear);
  }

  updateImage(options: Pick<ImageSourceOptions, 'url' | 'coordinates'>, clear = true) {
    this.options = {
      ...this.options,
      ...options,
    };
    this.reload(clear);
  }

  setCoordinates(coordinates: ImageSourceOptions['coordinates']) {
    this.coordinates = coordinates;
    this.reload(false);
  }

  asyncActor(tile, url) {
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

  reload(clear) {
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

  getTileUrl(tileID) { // eslint-disable-line
    let urls: string[] = this.url as string[];
    if (utils.isString(this.url)) {
      urls = [this.url];
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
      } else {
        // tile.request = tile.actor.send('reloadTile', params, done.bind(this));
      }
    } catch (e) {
      tile.state = TileState.errored;
      return callback(e);
    }
  }

  hasTile(coord) { // eslint-disable-line
    return true;
  }

  getFadeTime() {
    return 0;
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

  // eslint-disable-next-line
  unloadTile(tile, cb) {}

  destroy() {
    this.layer = null;
    this.#loaded = false;
    this.#tileWorkers.clear();
    this.#sourceCache.clear();
  }
}
