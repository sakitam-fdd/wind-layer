import { Renderer, utils } from '@sakitam-gis/vis-engine';
import SourceCache from './cahce';
import Layer from '../renderer';
import { ImageSource, TileSource } from './';
import {
  Bounds,
  Coordinates,
  DataRange,
  DecodeType,
  ParseOptionsType,
  TileSize,
  TileSourceOptions,
  TileState,
} from '../type';
import Tile from '../tile/Tile';
import Track, { defaultTrackOptions, TrackOptions } from '../utils/Track';

const sourceImpl = {
  TileSource,
  ImageSource,
};

function generateKey(url: string | string[]) {
  let urls: string[] = [];
  if (utils.isString(url)) {
    urls = [url];
  }

  return urls.join(',');
}

interface TimelineSourceOptions extends TrackOptions {
  sourceType: 'TileSource' | 'ImageSource';
  intervals: {
    url: string;
  }[];
  type?: 'timeline';
  coordinates?: Coordinates;
  subdomains?: (string | number)[];
  minZoom?: number;
  maxZoom?: number;
  tileSize?: TileSize;
  dataRange?: DataRange | [DataRange, DataRange];
  scheme?: 'xyz' | 'tms';
  roundZoom?: number;
  /**
   * 指定数据解析类型
   */
  decodeType?: DecodeType;

  /**
   * 是否跨世界渲染
   */
  wrapX?: boolean;

  maxTileCacheSize?: number;
  tileBounds?: Bounds;
}

class TimelineSource {
  /**
   * 数据源 id
   */
  public id: string;

  /**
   * 数据源类型
   */
  public type: 'timeline';

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
   * 瓦片大小
   */
  public tileSize: number;

  /**
   * 影像坐标
   */
  public coordinates: WithUndef<Coordinates>;

  /**
   * 配置项
   */
  public options: TimelineSourceOptions;

  /**
   * 是否跨世界渲染
   */
  public wrapX: boolean;

  public renderer: Renderer;

  public dispatcher: any;

  public layer: WithNull<Layer>;

  public parseOptions: ParseOptionsType;

  public tileBounds: TileSourceOptions['tileBounds'];

  public intervals: TimelineSourceOptions['intervals'];

  #loaded = false;
  #sourceCache: SourceCache[];

  #current: TileSource | ImageSource;
  #next: TileSource | ImageSource;

  #index: number;
  #fadeTime = 0;

  #track: Track;

  #cache: Map<string, any> = new Map();

  constructor(id: string, options: TimelineSourceOptions) {
    this.id = id;
    this.type = 'timeline';

    this.minZoom = options.minZoom || 0;
    this.maxZoom = options.maxZoom || 22;
    this.roundZoom = Boolean(options.roundZoom);
    const scheme = options.scheme || 'xyz';
    this.tileSize = options.tileSize || 512;
    this.tileBounds = options.tileBounds;
    this.wrapX = Boolean(options.wrapX);
    if (options.sourceType === 'ImageSource' && !options.coordinates) {
      throw new Error('ImageSource must provide `coordinates`');
    }
    this.coordinates = options.coordinates;
    this.intervals = options.intervals;

    const decodeType = options.decodeType || DecodeType.image;
    const maxTileCacheSize = options.maxTileCacheSize;

    this.options = {
      ...defaultTrackOptions,
      ...options,
      decodeType,
      maxTileCacheSize,
      wrapX: this.wrapX,
      type: this.type,
    };

    const current = this.intervals[0];
    this.#index = 0;

    this.animate = this.animate.bind(this);
    this.tilesLoadEnd = this.tilesLoadEnd.bind(this);

    this.#current = new (sourceImpl[options.sourceType] as any)(`${this.id}_current`, {
      url: current.url,
      subdomains: this.options.subdomains,
      minZoom: this.minZoom,
      maxZoom: this.minZoom,
      tileSize: this.tileSize,
      roundZoom: this.roundZoom,
      tileBounds: this.tileBounds,
      decodeType,
      scheme,
    });
    this.#next = new (sourceImpl[options.sourceType] as any)(`${this.id}_next`, {
      url: current.url,
      subdomains: this.options.subdomains,
      minZoom: this.minZoom,
      maxZoom: this.minZoom,
      tileSize: this.tileSize,
      roundZoom: this.roundZoom,
      tileBounds: this.tileBounds,
      decodeType,
      scheme,
    });
    const currentLoadTile = this.#current.loadTile;
    const nextLoadTile = this.#next.loadTile;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    function wrapCurrentLoadTile(tile: Tile, callback) {
      const key = `${tile.tileID.tileKey}-${generateKey(this.options.url)}`;
      const cacheTile = that.#cache.get(key);
      if (cacheTile) {
        tile.copy(cacheTile);
        callback(null, true);
      } else {
        currentLoadTile.call(this, tile, (err, data) => {
          if (!err && !that.#cache.has(key) && tile.state === TileState.loaded) {
            that.#cache.set(key, tile);
          }
          callback(err, data);
        });
      }
    }
    function wrapNextLoadTile(tile: Tile, callback) {
      const key = `${tile.tileID.tileKey}-${generateKey(this.options.url)}`;
      const cacheTile = that.#cache.get(key);
      if (cacheTile) {
        tile.copy(cacheTile);
        callback(null, true);
      } else {
        nextLoadTile.call(this, tile, (err, data) => {
          if (!err && !that.#cache.has(key) && tile.state === TileState.loaded) {
            that.#cache.set(key, tile);
          }
          callback(err, data);
        });
      }
    }

    this.#current.loadTile = wrapCurrentLoadTile;
    this.#next.loadTile = wrapNextLoadTile;
    this.#current.sourceCache.on('tilesLoadEnd', this.tilesLoadEnd);
    this.#next.sourceCache.on('tilesLoadEnd', this.tilesLoadEnd);
  }

  get privateType() {
    return this.options.sourceType === 'TileSource' ? 'tile' : 'image';
  }

  get cache() {
    return this.#cache;
  }

  get source() {
    return [this.#current, this.#next];
  }

  get sourceCache() {
    return [this.#current?.sourceCache, this.#next?.sourceCache].filter(Boolean);
  }

  onAdd(layer) {
    this.layer = layer;
    if (this.#current) {
      this.#current.onAdd(this.layer);
    }
    if (this.#next) {
      this.#next.onAdd(this.layer);
    }
    this.load();
  }

  prepare(renderer: Renderer, dispatcher, parseOptions: ParseOptionsType) {
    this.renderer = renderer;
    this.dispatcher = dispatcher;
    this.parseOptions = parseOptions;
    if (this.#current) {
      this.#current.prepare(renderer, dispatcher, parseOptions);
    }
    if (this.#next) {
      this.#next.prepare(renderer, dispatcher, parseOptions);
    }
  }

  getFadeTime() {
    return this.#fadeTime;
  }

  tilesLoadEnd() {
    this.resume();
  }

  animate({ position }) {
    const len = this.intervals.length;
    const lastIndex = this.#index;
    this.#index = position * utils.clamp(len - 1, 0, Infinity);

    const diff = Math.floor(this.#index) - Math.floor(lastIndex);

    if (diff > 0 || diff < 0) {
      // 如果 swap source 有任意一个数据未加载完成，停止动画等待加载完成后再执行动画
      if (!this.#current?.sourceCache.loaded() || !this.#next?.sourceCache.loaded()) {
        this.pause();
      } else {
        this.#fadeTime = 0;
        // swap source
        [this.#current, this.#next] = [this.#next, this.#current];
        this.pause();
        this.#next.setUrl(
          this.intervals[utils.clamp(Math.floor(this.#index), 0, len - 1)].url,
          true,
        );
      }
    } else {
      this.#fadeTime = this.#index % 1;
    }

    if (this.layer) {
      this.layer.onTileLoaded();
    }
  }

  play() {
    this.#track.play();
  }

  pause() {
    this.#track.pause();
  }

  resume() {
    this.#track.resume();
  }

  stop() {
    this.#track.stop();
  }

  restart() {
    this.#track.restart();
  }

  load(cb?: any) {
    this.#loaded = true;
    this.#track = new Track({
      duration:
        (this.options.duration as number) * utils.clamp(this.intervals.length - 1, 0, Infinity),
      endDelay: this.options.endDelay,
      repeat: this.options.repeat,
      autoplay: this.options.autoplay,
    });
    this.#track.on('track', this.animate);
    if (cb) {
      cb(null);
    }
  }

  loaded() {
    return this.#loaded;
  }

  destroy() {
    this.layer = null;
    this.#loaded = false;
    this.#track.off('track', this.animate);
    if (this.#sourceCache && Array.isArray(this.#sourceCache)) {
      this.#sourceCache.forEach((s) => {
        s.clear();
      });
    }
  }
}

export default TimelineSource;
