import { TileBounds, TileID, mod, Bounds } from 'wind-gl-core';
import { utils } from '@sakitam-gis/vis-engine';
import { mercatorXfromLng, mercatorYfromLat } from './mercatorCoordinate';

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

function wrap(x, minx, min, max) {
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
  const minX = dx < max - min ? wrap(xmin, undefined, min, max) : min;
  const maxX = dx < max - min ? wrap(xmax, minX, min, max) : max;

  const minY = Math.max(ymin, yRange[0]);
  const maxY = Math.min(ymax, yRange[1]);

  return [minX, minY, maxX, maxY];
}
