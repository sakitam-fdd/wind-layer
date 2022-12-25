import Tile from './Tile';

export interface TileManagerOptions {
  maxSize: number;
  dispatcher: any;
}

export default class TileManager {
  public tiles: Map<string, Tile>;
  public renderableTiles: Map<string, Tile>;

  private options: Partial<TileManagerOptions>;

  private maxSize: number;

  constructor(renderer, scene, options: Partial<TileManagerOptions>) {
    this.tiles = new Map();
    this.renderableTiles = new Map();

    this.options = options;

    this.maxSize = options.maxSize || 100;

    this.reset();
  }

  setData(data) {
    console.log(data);
  }

  getData() {

  }

  reset() {
    this.tiles.clear();
    this.renderableTiles.clear();
    return this;
  }

  getTile(key) {
    return this.tiles.get(key);
  }

  addTile(tile: Tile) {
    if (!this.hasTile(tile)) {
      this.tiles.set(tile.id, tile);
    }
  }

  hasTile(tile: Tile) {
    return this.tiles.has(tile.id);
  }

  removeTile(tile: Tile) {
    if (this.hasTile(tile)) {
      this.tiles.delete(tile.id);
    }
  }

  setMaxSize(max: number): TileManager {
    this.maxSize = max;

    while (this.tiles.size > this.maxSize) {
      this.#getAndRemoveTile(this.tiles.entries().next());
    }

    return this;
  }

  update() {

  }

  #getAndRemoveTile(v: IteratorResult<[string, Tile], any>) {
    console.log(v);
  }
}
