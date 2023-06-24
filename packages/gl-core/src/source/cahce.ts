import { EventEmitter } from '@sakitam-gis/vis-engine';
import LRUCache from '../utils/LRUCache';
import TileSource from './tile';
import ImageSource from './image';
import Tile from '../tile/Tile';
import { keysDifference } from '../utils/common';
import { TileState } from '../type';
import TileID from '../tile/TileID';

function compareTileId(a: TileID, b: TileID) {
  const aWrap = Math.abs(a.wrap * 2) - +(a.wrap < 0);
  const bWrap = Math.abs(b.wrap * 2) - +(b.wrap < 0);
  return a.overscaledZ - b.overscaledZ || bWrap - aWrap || b.y - a.y || b.x - a.x;
}

export default class SourceCache extends EventEmitter {
  public id: string;
  public source: TileSource | ImageSource;
  private readonly cacheTiles: {
    [key: string]: Tile;
  };
  private coveredTiles: {
    [key: string]: WithUndef<boolean>;
  };
  private loadedParentTiles: {
    [key: string]: Tile;
  };

  #cache: LRUCache<Tile>;

  /**
   * 这两个配置是用于控制瓦片数据的最大缩放级别的。
   * 在瓦片地图中，为了避免图像模糊或者失真，通常不会将某个瓦片数据过度缩放，
   * 而是使用它的父级瓦片或者子集瓦片数据进行显示。
   * 这个缩放的范围就是通过 maxOverzooming 和 maxUnderzooming 属性来控制的
   */
  static maxOverzooming = 10;
  static maxUnderzooming = 3;

  constructor(id, source) {
    super();
    this.id = id;
    this.source = source;
    this.cacheTiles = {};
    this.coveredTiles = {};
    this.loadedParentTiles = {};
    this.#cache = new LRUCache(0, this.unloadTile.bind(this));
  }

  /**
   * 判断当前 source 瓦片是否全部加载完毕（成功加载或者加载错误）
   */
  loaded() {
    if (!this.source.loaded()) {
      return false;
    }
    for (const t in this.cacheTiles) {
      const tile = this.cacheTiles[t];
      if (tile.state !== TileState.loaded && tile.state !== TileState.errored) return false;
    }
    return true;
  }

  /**
   * 调用 `Source` 的瓦片加载方法
   * 具体由各个`Source` 实现
   * @param tile
   * @param callback
   */
  loadTile(tile, callback) {
    return this.source.loadTile(tile, callback);
  }

  /**
   * 移除已加载的瓦片
   * @param tile
   */
  unloadTile(tile) {
    if (this.source.unloadTile) {
      return this.source.unloadTile(tile, () => undefined);
    }
  }

  /**
   * 取消正在加载中的瓦片
   * @param tile
   */
  abortTile(tile) {
    if (this.source.abortTile) {
      return this.source.abortTile(tile, () => undefined);
    }
  }

  /**
   * 获取所有的可渲染的瓦片 id 并且排序（从 0 世界向两边排序）
   */
  getRenderableIds() {
    const renderables: any[] = [];
    for (const id in this.cacheTiles) {
      if (this._isIdRenderable(id)) renderables.push(this.cacheTiles[id]);
    }
    return renderables
      .map((tile) => tile.tileID)
      .sort(compareTileId)
      .map((tile) => tile.tileKey);
  }

  _isIdRenderable(id) {
    return this.cacheTiles[id] && this.cacheTiles[id].hasData() && !this.coveredTiles[id];
  }

  /**
   * 获取已经加载的瓦片
   */
  getVisibleCoordinates() {
    return this.getRenderableIds().map((id) => this.cacheTiles[id].tileID);
  }

  /**
   * 瓦片加载完成回调
   * @param tile
   * @param id
   * @param previousState
   * @param err
   * @param disableUpdate
   */
  tileLoaded(tile, id, previousState, err, disableUpdate = false) {
    if (err) {
      tile.state = TileState.errored;
      if (err.status !== 404) {
        // this._source.fire(new ErrorEvent(err, {tile}));
      } else {
        // 如果瓦片不存在，则继续尝试加载父/子瓦片
        this.emit('update');
      }
      return;
    }

    tile.timeAdded = Date.now();
    if (!disableUpdate) {
      this.emit('update');
    }
    this.emit('tileLoaded');
    if (this.loaded()) {
      this.emit('tilesLoadEnd');
    }
  }

  _addTile(tileID): WithNull<Tile> {
    let tile = this.cacheTiles[tileID.tileKey];
    if (tile) return tile;

    // 目前问题在于，跨世界的瓦片在执行过一次缓存获取后会被移除，后续瓦片无法再从缓存中
    // 取到，这就造成了需要重复请求的问题
    tile = this.#cache.getAndRemove(tileID.tileKey);
    if (tile) {
      tile.tileID = tileID;
    }

    const cached = Boolean(tile);
    if (!cached) {
      tile = new Tile(tileID, {
        tileSize: this.source.tileSize * tileID.overscaleFactor(),
      });
      this.loadTile(tile, this.tileLoaded.bind(this, tile, tileID.tileKey, tile.state));
    }

    // Impossible, but silence flow.
    if (!tile) return null;

    tile.uses++;
    this.cacheTiles[tileID.tileKey] = tile;

    return tile;
  }

  /**
   * 根据 `tileKey` 移除瓦片
   * @param id
   */
  _removeTile(id) {
    const tile = this.cacheTiles[id];
    if (!tile) return;

    tile.uses--;
    delete this.cacheTiles[id];

    if (tile.uses > 0) return;

    if (tile.hasData() && tile.state !== TileState.reloading) {
      this.#cache.add(tile.tileID.tileKey, tile);
    } else {
      tile.aborted = true;
      this.abortTile(tile);
      this.unloadTile(tile);
    }
  }

  /**
   * 根据 `TileID` 获取瓦片
   * @param tileID
   */
  getTile(tileID) {
    return this.cacheTiles[tileID?.tileKey];
  }

  /**
   * 该策略会在内存中保留当前层级的瓦片的所有子瓦片（children），直到一直保留到最大覆盖缩放级别（maxCoveringZoom）为止。
   * 简单来说，当当前地图缩放等级超过了当前图层的最大缩放级别时，Mapbox GL JS 会自动加载当前瓦片的所有子瓦片来填充当前视图的空白部分。而 retain any loaded children of ideal tiles up to maxCoveringZoom 这个选项会保留这些子瓦片的缓存，以便在缩放到更高层级时直接使用，而不需要重新加载。
   * 举个例子，假设当前地图缩放等级是 10，最大缩放级别是 14，而 maxCoveringZoom 设置为 12。地图将会加载当前缩放级别为 10 的瓦片，并将其所有子瓦片缓存到内存中，包括缩放级别为 11、12、13 的所有瓦片。但是，因为 maxCoveringZoom 设置为 12，所以缩放到 13 级时，只会使用缓存中缩放级别为 11、12 的子瓦片。当缩放到 14 级时，则不再使用缓存，而是重新加载新的瓦片数据。
   * 需要注意的是，这个选项可能会占用大量内存，因此在使用时需要根据实际情况进行设置。如果需要优化内存使用，可以将 maxCoveringZoom 设置为一个较小的值，以减少缓存的瓦片数量。
   * @param idealTiles
   * @param zoom
   * @param maxCoveringZoom
   * @param retain
   */
  retainLoadedChildren(idealTiles, zoom, maxCoveringZoom, retain) {
    for (const id in this.cacheTiles) {
      let tile = this.cacheTiles[id];

      // only consider renderable tiles up to maxCoveringZoom
      if (
        retain[id] ||
        !tile.hasData() ||
        tile.tileID.overscaledZ <= zoom ||
        tile.tileID.overscaledZ > maxCoveringZoom
      )
        continue;

      // loop through parents and retain the topmost loaded one if found
      let topmostLoadedID = tile.tileID;
      while (tile && tile.tileID.overscaledZ > zoom + 1) {
        const parentID = tile.tileID.scaledTo(tile.tileID.overscaledZ - 1);

        tile = this.cacheTiles[parentID.tileKey];

        if (tile && tile.hasData()) {
          topmostLoadedID = parentID;
        }
      }

      // loop through ancestors of the topmost loaded child to see if there's one that needed it
      let tileID = topmostLoadedID;
      while (tileID.overscaledZ > zoom) {
        tileID = tileID.scaledTo(tileID.overscaledZ - 1);

        if (idealTiles[tileID.tileKey]) {
          // found a parent that needed a loaded child; retain that child
          retain[topmostLoadedID.tileKey] = topmostLoadedID;
          break;
        }
      }
    }
  }

  updateLoadedParentTileCache() {
    this.loadedParentTiles = {};

    for (const tileKey in this.cacheTiles) {
      const path: any[] = [];
      let parentTile;
      let currentId = this.cacheTiles[tileKey].tileID;

      // Find the closest loaded ancestor by traversing the tile tree towards the root and
      // caching results along the way
      while (currentId.overscaledZ > 0) {
        // Do we have a cached result from previous traversals?
        if (currentId.tileKey in this.loadedParentTiles) {
          parentTile = this.loadedParentTiles[currentId.tileKey];
          break;
        }

        path.push(currentId.tileKey);

        // Is the parent loaded?
        const parentId = currentId.scaledTo(currentId.overscaledZ - 1);
        parentTile = this.getLoadedTile(parentId);
        if (parentTile) {
          break;
        }

        currentId = parentId;
      }

      // Cache the result of this traversal to all newly visited tiles
      for (const key of path) {
        this.loadedParentTiles[key] = parentTile;
      }
    }
  }

  updateRetainedTiles(wrapTiles) {
    const retain = {};
    if (wrapTiles.length === 0) {
      return retain;
    }

    const checked = {};
    const minZoom = wrapTiles.reduce((min, id) => Math.min(min, id.overscaledZ), Infinity);
    const maxZoom = wrapTiles[0].overscaledZ;
    console.assert(minZoom <= maxZoom);
    const minCoveringZoom = Math.max(maxZoom - SourceCache.maxOverzooming, this.source.minZoom);
    const maxCoveringZoom = Math.max(maxZoom + SourceCache.maxUnderzooming, this.source.minZoom);

    const missingTiles = {};
    for (const tileID of wrapTiles) {
      const tile = this._addTile(tileID);

      // retain the tile even if it's not loaded because it's an ideal tile.
      // 即使没有加载也保留瓦片因为这是一个合适的瓦片
      retain[tileID.tileKey] = tileID;

      // 如果已经有数据，跳过，可能从缓存中取
      if (tile?.hasData()) continue;

      if (minZoom < this.source.maxZoom) {
        // save missing tiles that potentially have loaded children
        // 保存已经加载子瓦片的不需要的瓦片
        missingTiles[tileID.tileKey] = tileID;
      }
    }

    // 保留任何已经加载的子瓦片，直到超过 `maxCoveringZoom`
    this.retainLoadedChildren(missingTiles, minZoom, maxCoveringZoom, retain);

    for (const tileID of wrapTiles) {
      let tile: WithNull<Tile> = this.cacheTiles[tileID.tileKey];

      if (tile.hasData()) continue;

      // 需要的瓦片未加载完成或者不存在，查找其子集瓦片
      if (tileID.z >= this.source.maxZoom) {
        // 查找过度缩放的子集瓦片
        const childTileLike = tileID.children(this.source.maxZoom)[0];
        const childTile = this.getTile(childTileLike);
        if (!!childTile && childTile.hasData()) {
          retain[childTileLike.tileKey] = childTileLike;
          continue; // 子集瓦片已经可以完全覆盖
        }
      } else {
        // 检查当前瓦片子瓦片是否加载完成，如果已经加载则可以替代当前瓦片
        const children = tileID.children(this.source.maxZoom);

        if (
          retain[children[0].tileKey] &&
          retain[children[1].tileKey] &&
          retain[children[2].tileKey] &&
          retain[children[3].tileKey]
        )
          continue; // tile is covered by children
      }

      // 当找不到合适的子集瓦片，并且本身也无法找到，那么查找其父集瓦片

      // As we ascend up the tile pyramid of the ideal tile, we check whether the parent
      // tile has been previously requested (and errored because we only loop over tiles with no data)
      // in order to determine if we need to request its parent.
      let parentWasRequested = tile.wasRequested();

      for (
        let overscaledZ = tileID.overscaledZ - 1;
        overscaledZ >= minCoveringZoom;
        --overscaledZ
      ) {
        const parentId = tileID.scaledTo(overscaledZ);

        // Break parent tile ascent if this route has been previously checked by another child.
        if (checked[parentId.tileKey]) break;
        checked[parentId.tileKey] = true;

        tile = this.getTile(parentId);
        if (!tile && parentWasRequested) {
          tile = this._addTile(parentId);
        }
        if (tile) {
          retain[parentId.tileKey] = parentId;
          // Save the current values, since they're the parent of the next iteration
          // of the parent tile ascent loop.
          parentWasRequested = tile.wasRequested();
          if (tile.hasData()) break;
        }
      }
    }

    return retain;
  }

  /**
   * 获取已经加载的缓存瓦片
   * @param tileID
   * @return {*}
   */
  getLoadedTile(tileID) {
    const tile = this.cacheTiles[tileID.tileKey];
    if (tile && tile.hasData()) {
      return tile;
    }
    return this.#cache.get(tileID.tileKey);
  }

  /**
   * 查找已经加载的父级瓦片
   * @param tileID
   * @param minCoveringZoom
   */
  findLoadedParent(tileID, minCoveringZoom) {
    if (tileID.tileKey in this.loadedParentTiles) {
      const parent = this.loadedParentTiles[tileID.tileKey];
      if (parent && parent.tileID.overscaledZ >= minCoveringZoom) {
        return parent;
      } else {
        return null;
      }
    }
    for (let z = tileID.overscaledZ - 1; z >= minCoveringZoom; z--) {
      const parentTileID = tileID.scaledTo(z);
      const tile = this.getLoadedTile(parentTileID);
      if (tile) {
        return tile;
      }
    }
  }

  /**
   * 更新当前的缓存大小
   */
  updateCacheSize() {
    const tileSize = this.source.tileSize;
    const { width, height } = this.source.renderer.size;
    const widthInTiles = Math.ceil((width || 4 * tileSize) / tileSize) + 1;
    const heightInTiles = Math.ceil((height || 4 * tileSize) / tileSize) + 1;
    const approxTilesInView = widthInTiles * heightInTiles;
    const commonZoomRange = 5;

    const viewDependentMaxSize = Math.floor(approxTilesInView * commonZoomRange);
    const maxSize =
      typeof this.source.options.maxTileCacheSize === 'number'
        ? Math.max(this.source.options.maxTileCacheSize, viewDependentMaxSize)
        : viewDependentMaxSize;

    this.#cache.setMaxSize(maxSize);
  }

  update(wrapTiles) {
    this.coveredTiles = {};
    let tiles = wrapTiles;
    this.updateCacheSize();

    if (this.source.hasTile) {
      tiles = wrapTiles.filter((coord) => this.source.hasTile(coord));
    }

    const retain = this.updateRetainedTiles(tiles);

    if (tiles.length !== 0) {
      const parentsForFading = {};
      const fadingTiles = {};
      const ids = Object.keys(retain);
      for (const id of ids) {
        const tileID = retain[id];

        const tile = this.cacheTiles[id];
        if (!tile) continue;

        // if the tile is loaded but still fading in, find parents to cross-fade with it
        const parentTile = this.findLoadedParent(
          tileID,
          Math.max(tileID.overscaledZ - SourceCache.maxOverzooming, this.source.minZoom),
        );
        if (parentTile) {
          this._addTile(parentTile.tileID);
          parentsForFading[parentTile.tileID.tileKey] = parentTile.tileID;
        }

        fadingTiles[id] = tileID;
      }

      for (const id in parentsForFading) {
        if (!retain[id]) {
          // If a tile is only needed for fading, mark it as covered so that it isn't rendered on it's own.
          this.coveredTiles[id] = true;
          retain[id] = parentsForFading[id];
        }
      }
    }

    this.emit('tilesLoadStart', {
      retain,
    });

    const remove = keysDifference(this.cacheTiles, retain);
    for (const tileKey of remove) {
      this._removeTile(tileKey);
    }

    this.updateLoadedParentTileCache();
    const currentLength = Object.keys(this.cacheTiles).filter((k) =>
      this.cacheTiles[k]?.wasRequested(),
    ).length;
    const retainLength = Object.keys(retain).length;
    if (currentLength < retainLength) {
      this.emit('tilesLoading', {
        progress: currentLength / retainLength,
      });
    }
  }

  /**
   * 重载当前视野内的瓦片（需要移除缓存）
   */
  reload() {
    this.#cache.reset();

    for (const key in this.cacheTiles) {
      this._reloadTile(key, TileState.reloading);
    }
  }

  _reloadTile(id: string, state: TileState) {
    const tile = this.cacheTiles[id];

    if (!tile) return;

    // The difference between "loading" tiles and "reloading" or "expired"
    // tiles is that "reloading"/"expired" tiles are "renderable".
    // Therefore, a "loading" tile cannot become a "reloading" tile without
    // first becoming a "loaded" tile.
    if (tile.state !== TileState.loading) {
      tile.state = state;
    }

    this.loadTile(tile, this.tileLoaded.bind(this, tile, id, state));
  }

  clearTiles() {
    for (const id in this.cacheTiles) {
      this._removeTile(id);
    }

    this.#cache.reset();
  }

  destroy() {
    for (const id in this.cacheTiles) {
      this._removeTile(id);
    }

    this.#cache.reset();
  }
}
