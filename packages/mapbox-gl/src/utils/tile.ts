import { TileBounds, TileID, mod, Bounds } from 'wind-gl-core';
import { utils } from '@sakitam-gis/vis-engine';
import RBush, { type NodeItem } from '@sakitam-gis/rbush';
import {
  mercatorXfromLng,
  mercatorYfromLat,
  latFromMercatorY,
  lngFromMercatorX,
} from './mercatorCoordinate';

export function zoomScale(z) {
  return Math.pow(2, z);
}

export function scaleZoom(scale) {
  return Math.log(scale) / Math.LN2;
}

/**
 * 计算最高层级，这个层级包含了 Tr 边界内的所有瓦片
 * 1. 先不管round还是floor，在计算层级时 mapbox 内部使用的事 512 大小的瓦片，那么在你使用 256 的瓦片时，层级需要加 1
 * 即在当前 zoom 的下一级
 * 2. 当瓦片大小为 1024 时，那么需要的层级应该是 mapbox 当前层级的上一级
 * 3. 当当前 zoom 不为整数时，我们需要考虑是四舍五入还是向下取整，默认情况下
 * 是向下取整（实际应用起来是当地图层级未到 2 时，就算是 1.98 那么默认清情况下计算瓦片的最大
 * 层级也是 1），这样可以减少设业内瓦片加载的数量
 * @param options
 * @returns {number}
 */
function coveringZoomLevel(options) {
  const z = (options.roundZoom ? Math.round : Math.floor)(
    options.zoom + scaleZoom(512 / options.tileSize),
  );
  return Math.max(0, z);
}

/**
 * 判断包含关系
 *                      a - maxY
 * a - minX -------------------------- a - maxX
 *          |          b - maxY         |
 *          |      --------------       |
 *          |     |              |      |
 *          |     |              |      |
 *          |     |              |      |
 *          |minX |              |maxX  |
 *          |     |              |      |
 *          |     |              |      |
 *          |      --------------       |
 *          |          b - minY         |
 *          ---------------------------
 *                     a - minY
 * @param a
 * @param b
 * @returns {boolean}
 */
export function containsStrict(a: TileBounds, b: TileBounds): boolean {
  return a[0] <= b[0] && a[1] <= b[1] && b[2] <= a[2] && b[3] <= a[3];
}

const TILE_SIZE = 512;

function lngLatToTile(lng: number, lat: number, zoom: number) {
  const worldSize = TILE_SIZE * zoomScale(zoom);
  const x = mercatorXfromLng(lng) * worldSize;
  // 注意此处理论 y 方向永远在 0-1，但是由于 js 浮点数精度问题，可能溢出
  const y = utils.clamp(mercatorYfromLat(lat), 0, 1) * worldSize;
  // 还需要注意当 y 为 worldSize 时，计算出的 tileY 可能溢出
  const tileX = Math.floor(x / TILE_SIZE);
  const tileY = Math.floor(y / TILE_SIZE);
  return { x: tileX, y: tileY, z: zoom };
}

export function getTileProjBounds(tileID: TileID) {
  const numTiles = 1 << tileID.z;
  return {
    left: tileID.wrapedX / numTiles,
    top: tileID.wrapedY / numTiles,
    right: (tileID.wrapedX + 1) / numTiles,
    bottom: (tileID.wrapedY + 1) / numTiles,
  };
}

export function createTileID(z, wrapedX, wrapedY, wrap) {
  // wrap = -1 zoom = 1 max 2
  // -2 0 -1-0 | 0-0 1-0 | 2-0 3-0
  // w: -1 -1/2

  const max = Math.pow(2, z);
  // 注意此处 wrapedY 一般在0-max 范围内，我们主要关注 x 方向处理
  return new TileID(z, wrap, z, (wrapedX - max * wrap) % max, (wrapedY + max) % max);
}

/**
 * 获取经纬度范围内的某个层级的瓦片（允许跨世界）
 * @param bounds
 * @param zoom
 * @param options
 */
export function getBoundsTiles(
  bounds: TileBounds,
  zoom: number,
  options: {
    tileSize: number;
    minZoom?: number;
    maxZoom?: number;
    roundZoom?: boolean;
  },
) {
  const topLeft = { lng: bounds[0], lat: bounds[3] };
  const bottomRight = { lng: bounds[2], lat: bounds[1] };

  let z = coveringZoomLevel({
    zoom,
    tileSize: options.tileSize,
    roundZoom: options.roundZoom,
  });

  if (options.minZoom !== undefined && z < options.minZoom) return [];
  if (options.maxZoom !== undefined && z > options.maxZoom) z = options.maxZoom;

  const max = Math.pow(2, z);

  // 此处注意 mapbox 瓦片是从左上到右下递增
  const minTile = lngLatToTile(topLeft.lng, topLeft.lat, z);
  const maxTile = lngLatToTile(bottomRight.lng, bottomRight.lat, z);

  const ts: TileID[] = [];
  const maxX = maxTile.x;
  const maxY = maxTile.y >= 1 && z === 0 ? maxTile.y - 1 : maxTile.y;
  // const maxY = maxTile.y;
  // 注意：在 0 瓦片 xy 方向递增时不可到达边界，如果到达 1 的边界，瓦片计算会多出一行或者一列
  for (let x = minTile.x; x <= maxX; x++) {
    for (let y = minTile.y; y <= maxY; y++) {
      const wrap = Math.floor(x / max);

      const tile = new TileID(z, wrap, z, (x - max * wrap) % max, (y + max) % max, {
        getTileProjBounds,
      });

      ts.push(tile);
    }
  }

  return ts;
}

function wrapX(x, minx, min, max) {
  let wrappedX = mod(x + max, max - min) + min;
  if (minx !== undefined && minx !== null && wrappedX < minx) {
    wrappedX += max - min;
  }
  return wrappedX;
}

export function calcBounds(bounds: number[][], yRange: [number, number]): Bounds {
  const xmin = bounds[0][0];
  const ymin = bounds[0][1];
  const xmax = bounds[1][0];
  const ymax = bounds[1][1];

  const min = -180;
  const max = 180;

  const dx = xmax - xmin;
  const minX = dx < max - min ? wrapX(xmin, undefined, min, max) : min;
  const maxX = dx < max - min ? wrapX(xmax, minX, min, max) : max;

  const minY = Math.max(ymin, yRange[0]);
  const maxY = Math.min(ymax, yRange[1]);

  return [minX, minY, maxX, maxY];
}

export function getTileBounds(tileID: TileID): TileBounds {
  const { z, x, y } = tileID;
  const wrap = tileID.wrap;
  const numTiles = 1 << z;
  const leftLng = lngFromMercatorX(x / numTiles, wrap);
  const rightLng = lngFromMercatorX((x + 1) / numTiles, wrap);
  const topLat = latFromMercatorY(y / numTiles);
  const bottomLat = latFromMercatorY((y + 1) / numTiles);

  return [leftLng, bottomLat, rightLng, topLat];
}

function intersects(a: NodeItem, b: NodeItem) {
  return b.minX < a.maxX && b.minY < a.maxY && b.maxX > a.minX && b.maxY > a.minY;
}

export function expandTiles(tiles: TileID[]) {
  // 1. 按照从左上角到右下角排序
  // 2. 计算包裹瓦片的包围盒 (经纬度)
  let xmin = Infinity;
  let xmax = -Infinity;
  let ymin = Infinity;
  let ymax = -Infinity;
  let zmin = Infinity;
  let zmax = -Infinity;

  const cacheMap = new Map();
  const tree = new RBush(9);

  for (let i = 0; i < tiles.length; i++) {
    const tileID = tiles[i];

    const { z, wrapedX, wrapedY } = tileID;
    const wrap = tileID.wrap;

    const [left, top, right, bottom] = [wrapedX, wrapedY, wrapedX + 1, wrapedY + 1];
    xmin = Math.min(left, xmin);
    xmax = Math.max(right, xmax);
    ymin = Math.min(top, ymin);
    ymax = Math.max(bottom, ymax);
    zmin = Math.min(z, zmin);
    zmax = Math.max(z, zmax);

    // 对跨世界瓦片进行分组
    const cache = cacheMap.get(wrap);
    if (!cache) {
      //
      cacheMap.set(wrap, [tileID]);
    } else {
      cacheMap.set(wrap, [...cache, tileID]);
    }
  }
  /* eslint-disable @typescript-eslint/no-shadow */
  for (const [, value] of cacheMap) {
    // 对每个世界进行层级分组
    const level = new Map();
    let xmin = Infinity;
    let ymin = Infinity;
    let xmax = -Infinity;
    let ymax = -Infinity;
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const cache = level.get(item.z);
      // 计算每个世界的瓦片包围盒
      if (!cache) {
        level.set(item.z, [item]);
      } else {
        level.set(item.z, [...cache, item]);
      }

      xmin = Math.min(item.wrapedX, xmin);
      xmax = Math.max(item.wrapedX + 1, xmax);
      ymin = Math.min(item.wrapedY - 1, ymin);
      ymax = Math.max(item.wrapedY, ymax);
    }

    const object = {};

    // 计算每层级的最大最小行列号
    for (const [lk, lv] of level) {
      let xmin = Infinity;
      let ymin = Infinity;
      let xmax = -Infinity;
      let ymax = -Infinity;
      for (let j = 0; j < lv.length; j++) {
        const litem = lv[j];
        const item = {
          minX: litem.wrapedX,
          minY: litem.wrapedY - 1,
          maxX: litem.wrapedX + 1,
          maxY: litem.wrapedY,
          tileKey: litem.tileKey,
        };
        tree.insert(item as any);
        xmin = Math.min(item.minX, xmin);
        xmax = Math.max(item.maxX, xmax);
        ymin = Math.min(item.minY, ymin);
        ymax = Math.max(item.maxY, ymax);
      }
      object[lk] = {
        baseTileID: lv.find((t) => t.wrapedX === xmin && t.wrapedY === ymin && t.z === lk),
        config: [xmin, ymin, xmax, ymax],
      };
    }

    /* eslint-enable @typescript-eslint/no-shadow */
    const keys = Object.keys(object).sort().reverse().map(Number); // 按层级排序
    // 查找相邻瓦片进行补齐， 补齐的过程中不同层级瓦片不可重叠：优先补齐高层级瓦片

    const addTiles: TileID[] = [];
    for (let k = 0; k < keys.length; k++) {
      // @fixme: 有可能在某个世界下 x 方向或者 y 方向都缺失，需要全世界计算最大最小参考
      const { config, baseTileID } = object[keys[k]];

      const xd = config[2] - config[0] + 1;
      const yd = config[3] - config[1] + 1;

      for (let x = 0; x < xd; x++) {
        for (let y = 0; y < yd; y++) {
          const tile = (baseTileID as TileID).neighbor(x, y);
          if (!tiles.find((t) => t.tileKey === tile.tileKey)) {
            const result = tree.collides(
              {
                minX: tile.wrapedX,
                minY: tile.wrapedY - 1,
                maxX: tile.wrapedX + 1,
                maxY: tile.wrapedY,
              },
              { intersects },
            );

            if (!result) {
              addTiles.push(tile);
            }
            console.log(tile, result);
          }
        }
      }
    }
    console.log(object, addTiles);
  }
}
