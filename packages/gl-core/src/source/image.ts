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
  #actor: any;
  #request: Map<string, any> = new Map();
  #data: any;

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
    this.#actor = this.dispatcher.getActor();
    this.parseOptions = parseOptions;
  }

  setUrl(url, clear = true) {
    this.options.url = url;
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
      const id = url;
      this.#actor.send(
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
      this.#request.set(id, url);
    });
  }

  /**
   * 请求所需数据
   * @param cb
   * @param loaded
   */
  load(cb?: any, loaded?: boolean) {
    this.#loaded = loaded ?? false;
    try {
      const urls = this.getTileUrl();
      const p: Promise<any>[] = [];
      for (let i = 0; i < urls.length; i++) {
        p.push(this.asyncActor(null, urls[i]));
      }
      Promise.all(p).then((data) => {
        this.#request.clear();
        this.#loaded = true;

        this.#data = data;

        if (cb) {
          cb(null);
        }
      });
    } catch (e) {
      this.#loaded = true;
      if (cb) {
        cb(e);
      }
    }
  }

  loaded() {
    return this.#loaded;
  }

  reload(clear, useCache = false) {
    this.load(() => {
      if (clear) {
        this.#sourceCache.clearTiles();
      } else {
        this.#sourceCache.reload();
      }
      this.layer?.update();
    });
  }

  getTileUrl() {
    let urls: string[] = this.options.url as string[];
    if (utils.isString(this.options.url)) {
      urls = [this.options.url];
    }
    return urls;
  }

  loadTile(tile: Tile, callback) {
    if (!this.#data) {
      console.log(tile, this.#data);
      callback(null);
      // requestAnimationFrame(() => {
      //
      // });
      return;
    }

    this.#data.forEach((d, index) => {
      tile.setTextures(this.renderer, index, d, this.parseOptions, this.options);
    });

    tile.state = TileState.loaded;

    callback(null);
  }

  hasTile(coord) {
    return true;
  }

  getFadeTime() {
    return 0;
  }

  // eslint-disable-next-line
  abortTile(tile: Tile, callback) {}

  // eslint-disable-next-line
  unloadTile(tile: Tile, cb) {}

  destroy() {
    this.layer = null;
    this.#loaded = false;
    this.#sourceCache.clear();
    this.#cancelRequest();
  }

  #cancelRequest() {
    if (this.#request.size > 0 && this.#actor) {
      const iterator = this.#request.entries();
      for (let i = 0; i < this.#request.size; i++) {
        const [id, url] = iterator.next().value;
        if (id) {
          this.#actor.send('cancel', {
            url,
            cancelId: id,
          });
        }
      }
    }
    this.#request.clear();
  }
}
