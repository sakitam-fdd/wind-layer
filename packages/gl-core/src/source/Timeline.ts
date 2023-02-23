import SourceCache from './cahce';
import { Renderer, Raf, utils } from '@sakitam-gis/vis-engine';
import Layer from '../renderer';
import { TileSource, ImageSource } from './';
import {
  Bounds,
  DataRange,
  DecodeType,
  ImageSourceOptions,
  ParseOptionsType,
  TileSize,
  Coordinates,
  TileSourceOptions,
} from '../type';
import Tile from '../tile/Tile';

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

interface TimelineSourceOptions {
  sourceType: 'TileSource' | 'ImageSource';
  intervals: {
    url: string;
    subdomains?: (string | number)[];
  }[];
  type?: 'timeline';
  coordinates?: Coordinates;
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
  maxTileCacheSize?: number;
  tileBounds?: Bounds;

  /**
   * 每帧瓦片的过渡时间
   */
  duration?: number; // ms

  /**
   * 在所有帧瓦片播放完成后是否延迟
   */
  endDelay?: number; // ms

  /**
   * 是否轮播
   */
  repeat?: boolean;

  /**
   * 是否默认启动播放
   */
  autoplay?: boolean;
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
  public coordinates: ImageSourceOptions['coordinates'];

  /**
   * 配置项
   */
  public options: TimelineSourceOptions;

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
  #lastTime = 0;
  #fadeTime = 0;

  #paused: boolean;
  #raf: Raf;

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
    this.intervals = options.intervals;

    const decodeType = options.decodeType || DecodeType.image;
    const maxTileCacheSize = options.maxTileCacheSize;

    this.options = {
      ...options,
      decodeType,
      maxTileCacheSize,
      type: this.type,
    };

    const current = this.intervals[0];
    this.#index = 0;

    this.animate = this.animate.bind(this);
    this.tilesLoadEnd = this.tilesLoadEnd.bind(this);

    this.#current = new (sourceImpl[options.sourceType] as any)(`${this.id}_current`, {
      url: current.url,
      subdomains: current.subdomains,
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
      subdomains: current.subdomains,
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

    const wrapCurrentLoadTile = (tile: Tile, callback) => {
      const key = `${tile.tileID.tileKey}-${generateKey(this.#current.options.url)}`;
      const cacheTile = this.#cache.get(key);
      if (cacheTile) {
        tile.copy(cacheTile);
        callback(null, true);
      } else {
        currentLoadTile.call(this.#current, tile, (err, data) => {
          if (!this.#cache.has(key)) {
            this.#cache.set(key, tile);
          }
          callback(err, data);
        });
      }
    };
    const wrapNextLoadTile = (tile: Tile, callback) => {
      const key = `${tile.tileID.tileKey}-${generateKey(this.#next.options.url)}`;
      const cacheTile = this.#cache.get(key);
      if (cacheTile) {
        tile.copy(cacheTile);
        callback(null, true);
      } else {
        nextLoadTile.call(this.#next, tile, (err, data) => {
          if (!this.#cache.has(key)) {
            this.#cache.set(key, tile);
          }
          callback(err, data);
        });
      }
    };

    this.#current.loadTile = wrapCurrentLoadTile;
    this.#next.loadTile = wrapNextLoadTile;
    this.#current.sourceCache.on('tilesLoadEnd', this.tilesLoadEnd);
    this.#next.sourceCache.on('tilesLoadEnd', this.tilesLoadEnd);
  }

  get privateType() {
    return this.options.sourceType === 'TileSource' ? 'tile' : 'image';
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

  animate(time) {
    const duration = this.options.duration || 0;
    const len = this.intervals.length;
    const lastIndex = this.#index;
    // 当 index 大于数据列表长度时，重置 index
    if (this.#index > len) {
      this.#lastTime = time;
      this.#index = 0;
    } else {
      this.#index = ((time - this.#lastTime) * 1000) / duration;
    }

    if (Math.floor(this.#index) - Math.floor(lastIndex) > 0) {
      // 如果 swap source 有任意一个数据未加载完成，停止动画等待加载完成后再执行动画
      if (!this.#current?.sourceCache.loaded() || !this.#next?.sourceCache.loaded()) {
        this.pause();
      } else {
        this.#fadeTime = 0;
        // swap source
        [this.#current, this.#next] = [this.#next, this.#current];
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
    this.#raf = new Raf(this.animate);
  }

  pause() {
    this.#paused = true;
    this.#raf.stop();
  }

  resume() {
    if (!this.#paused) return;
    this.#paused = false;
    this.#raf.start();
  }

  load(cb?: any) {
    this.#loaded = true;
    if (this.options.autoplay) {
      this.play();
    }
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
    if (this.#sourceCache && Array.isArray(this.#sourceCache)) {
      this.#sourceCache.forEach((s) => {
        s.clear();
      });
    }
  }
}

export default TimelineSource;
