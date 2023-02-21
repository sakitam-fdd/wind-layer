import { Renderer, utils } from '@sakitam-gis/vis-engine';
import SourceCache from './cahce';
import {
  DecodeType,
  ImageSourceOptions,
  LayerDataType,
  ParseOptionsType,
  TileState,
} from '../type';
import { resolveURL } from '../utils/common';
import Tile from '../tile/Tile';
import Layer from '../renderer';

export default class ImageSource {
  /**
   * 数据源 id
   */
  public id: string;

  /**
   * 数据源类型
   */
  public type: LayerDataType.image;

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

  public renderer: Renderer;

  public dispatcher: any;

  public layer: WithNull<Layer>;

  public parseOptions: ParseOptionsType;

  /**
   * 影像坐标
   */
  public coordinates: ImageSourceOptions['coordinates'];

  #loaded = false;
  #sourceCache: SourceCache;
  #tileWorkers: Map<string, any> = new Map();

  constructor(id, options: ImageSourceOptions) {
    this.id = id;

    this.type = LayerDataType.image;
    this.minZoom = 0;
    this.maxZoom = 22;
    this.roundZoom = false;
    this.tileSize = 512;
    this.coordinates = options.coordinates;

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

  onAdd(layer) {
    this.layer = layer;
    this.load();
  }

  prepare(renderer: Renderer, dispatcher, parseOptions: ParseOptionsType) {
    this.renderer = renderer;
    this.dispatcher = dispatcher;
    this.parseOptions = parseOptions;
  }

  setUrl(url) {
    this.options.url = url;
    this.reload();
  }

  updateImage(options: Pick<ImageSourceOptions, 'url' | 'coordinates'>) {
    this.options = {
      ...this.options,
      ...options,
    };
    this.reload();
  }

  setCoordinates(coordinates: ImageSourceOptions['coordinates']) {
    this.coordinates = coordinates;
    this.reload();
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

  loadTile(tile: Tile, callback) {
    try {
      if (!tile.actor) {
        let urls: string[] = this.options.url as string[];
        if (utils.isString(this.options.url)) {
          urls = [this.options.url];
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

  hasTile(coord) {
    return true;
  }

  abortTile(tile: Tile, callback) {
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

  // eslint-disable-next-line
  unloadTile(tile, cb) {}

  destroy() {
    this.layer = null;
    this.#loaded = false;
    this.#tileWorkers.clear();
    this.#sourceCache.clear();
  }
}
