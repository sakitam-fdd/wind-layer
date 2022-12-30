import { Renderer, Scene, Program } from '@sakitam-gis/vis-engine';
import Tile from './Tile';
import LRUCache from './LRUCache';
import { LayerData, LayerDataType } from '../../type';

export interface TileManagerOptions {
  maxSize: number;
  dispatcher: any;
  program: Program;
  data: LayerData;
}

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

export default class TileManager {
  public renderer: Renderer;
  public scene: Scene;

  private options: Partial<TileManagerOptions>;

  #tiles: Map<string, Tile>;
  #cache: LRUCache<Tile>;
  #data: LayerData;

  constructor(renderer: Renderer, scene, options: Partial<TileManagerOptions>) {
    this.renderer = renderer;
    this.scene = scene;
    this.#tiles = new Map();

    this.options = options;

    if (this.options.data) {
      this.setData(this.options.data);
    }

    this.#cache = new LRUCache<Tile>(options.maxSize || 500, (tile) => {
      tile?.destroy();
    });

    this.reset();
  }

  get tiles() {
    return this.#tiles;
  }

  reset() {
    this.#tiles.clear();
    this.#cache.reset();

    return this;
  }

  getTile(key) {
    return this.#tiles.get(key);
  }

  addTile(tile: Tile) {
    if (!this.hasTile(tile)) {
      this.#tiles.set(tile.tileKey, tile);
    }
  }

  hasTile(tile: Tile) {
    return this.#tiles.has(tile.tileKey);
  }

  removeTile(tile: Tile) {
    if (this.hasTile(tile)) {
      this.#tiles.delete(tile.tileKey);
    }
  }

  getUrl(x, y, z, d: LayerData) {
    if (d.type === LayerDataType.image) {
      return d.url;
    } else if (d.type === LayerDataType.tile) {
      const { url, subdomains } = d;
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
        return url.map((u) => formatUrl(u, data));
      }

      return formatUrl(url, data);
    } else {
      return '';
    }
  }

  setData(data: LayerData) {
    this.#data = data;
  }

  getData() {
    return this.#data;
  }

  update(tiles: any[]) {
    const iterator = this.#tiles.entries();
    for (let i = 0; i < this.#tiles.size; i++) {
      const [key, tile] = iterator.next().value;
      if (tiles.findIndex((t) => t.tileKey === key) < 0) {
        tile?.unload();
        // 此处删除后不一定需要资源释放，因为在缓存中可能还存在，只有缓存失效的需要释放资源
        this.#tiles.delete(key);
      }
    }
    for (let i = 0; i < tiles.length; i++) {
      const t = tiles[i];
      let tile = this.getTile(t.tileKey);
      if (!tile) {
        tile = this.#cache.get(t.tileKey);
        if (!tile) {
          const actor = this.options.dispatcher.getActor();
          tile = new Tile(this.renderer, t.x, t.y, t.z, {
            actor,
            url: this.getUrl(t.x, t.y, t.z, this.#data),
            wrap: t.wrap,
            tileSize: t.size,
            tileKey: t.tileKey,
            tileBounds: t.bounds,
            onLoad: (ctx) => {
              this.#cache.add(ctx.tileKey, ctx);
            },
          });
          tile.load();
        }
        this.addTile(tile);
      }
    }
  }
}
