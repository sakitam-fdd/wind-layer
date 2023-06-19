import mapboxgl from 'mapbox-gl';
import { vec2 } from 'gl-matrix';
import { TileID } from 'wind-gl-core';
import { Aabb, Frustum } from './Aabb';

// const tile2WSG84 = (c, z) => c / Math.pow(2, z);

// const TILE_SIZE = 512;

// function getScale(z: number, tileSize: number): number {
//   return (Math.pow(2, z) * TILE_SIZE) / tileSize;
// }

// function tile2lngLat(x: number, y: number, z: number): [number, number] {
//   const scale = getScale(z, TILE_SIZE);
//   const lng = (x / scale) * 360 - 180;
//   const n = Math.PI - (2 * Math.PI * y) / scale;
//   const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
//   return [lng, lat];
// }

// class TileID1 {
//   public z: number;
//   public x: number;
//   public y: number;
//   public wrap: number;
//
//   constructor(z: number, x: number, y: number, wrap = 0) {
//     this.z = z;
//     this.x = x;
//     this.y = y;
//     this.wrap = wrap;
//   }
//
//   toString() {
//     return `${this.z}/${this.x}/${this.y}`;
//   }
//
//   parent() {
//     if (this.z > 0) return new TileID(this.z - 1, this.x >> 1, this.y >> 1, this.wrap);
//     else return new TileID(this.z, this.x, this.y, this.wrap);
//   }
//   children() {
//     return [
//       new TileID(this.z + 1, this.x * 2, this.y * 2, this.wrap),
//       new TileID(this.z + 1, this.x * 2 + 1, this.y * 2, this.wrap),
//       new TileID(this.z + 1, this.x * 2 + 1, this.y * 2 + 1, this.wrap),
//       new TileID(this.z + 1, this.x * 2, this.y * 2 + 1, this.wrap),
//     ];
//   }
//   siblings() {
//     return this.z === 0
//       ? []
//       : this.parent()
//           .children()
//           .filter((t) => !this.isEqual(t));
//   }
//   isEqual(tile: TileID) {
//     return tile.x === this.x && tile.y === this.y && tile.z === this.z && tile.wrap === this.wrap;
//   }
//
//   getBounds() {
//     const xy = tile2lngLat(this.x, this.y, this.z);
//     const xy1 = tile2lngLat(this.x + 1, this.y + 1, this.z);
//     return [...xy, ...xy1];
//   }
//
//   /**
//    * 判断是否是根节点
//    * @returns {boolean}
//    */
//   isRoot() {
//     return this.z === 0;
//   }
//   neighbor(hor, ver) {
//     if (this.z === 0) {
//       return new TileID(0, 0, 0, this.wrap + hor);
//     }
//     const max = Math.pow(2, this.z);
//     return new TileID(
//       this.z,
//       (this.x + hor + max) % max,
//       (this.y + ver + max) % max,
//       this.x + hor < 0 ? this.wrap - 1 : this.x + hor > max ? this.wrap + 1 : this.wrap,
//     );
//   }
//   quadrant() {
//     return [this.x % 2, this.y % 2];
//   }
// }

export function coveringTiles1(map, { maxzoom, minzoom }) {
  const zoom = map.getZoom();

  const practicalZoom = Math.max(Math.min(maxzoom, Math.floor(zoom)), minzoom);

  const bounds = map.getBounds();

  const tileCount = 2 ** practicalZoom;

  const top = Math.floor(((85.051129 - bounds.getNorth()) / 180) * tileCount);
  const bottom = Math.ceil(((85.051129 - bounds.getSouth()) / 180) * tileCount);
  const left = Math.floor(((bounds.getWest() + 180) / 360) * tileCount);
  const right = Math.ceil(((bounds.getEast() + 180) / 360) * tileCount);

  const tiles: TileID[] = [];
  for (let y = top; y < bottom; y++) {
    for (let x = left; x < right; x++) {
      let properX = x % tileCount;
      if (properX < 0) {
        properX += tileCount;
      }
      tiles.push(new TileID(practicalZoom, properX, y, Math.floor(x / tileCount)));
    }
  }
  return tiles;
}

function scaleZoom(scale: number) {
  return Math.log(scale) / Math.LN2;
}

function coveringZoomLevel(
  view: { zoom: number; tileSize: number },
  options: { roundZoom?: boolean; tileSize: number },
): number {
  const z = (options.roundZoom ? Math.round : Math.floor)(
    view.zoom + scaleZoom(view.tileSize / options.tileSize),
  );
  // At negative zoom levels load tiles from z0 because negative tile zoom levels don't exist.
  return Math.max(0, z);
}

export function coveringTiles(
  view: {
    center: [number, number];
    zoom: number;
    pitch: number;
    tileSize: number;
    worldSize: number;
    invProjMatrix: any;
  },
  options: {
    tileSize: number;
    minzoom?: number;
    maxzoom?: number;
    roundZoom?: boolean;
    reparseOverscaled?: boolean;
    renderWorldCopies?: boolean;
  },
): Array<TileID> {
  let z = coveringZoomLevel(view, options);
  const actualZ = z;

  if (options.minzoom !== undefined && z < options.minzoom) return [];
  if (options.maxzoom !== undefined && z > options.maxzoom) z = options.maxzoom;

  const centerCoord = mapboxgl.MercatorCoordinate.fromLngLat(view.center);
  const numTiles = Math.pow(2, z);
  const centerPoint = [numTiles * centerCoord.x, numTiles * centerCoord.y, 0];
  const cameraFrustum = Frustum.fromInvProjectionMatrix(view.invProjMatrix, view.worldSize, z);

  // No change of LOD behavior for pitch lower than 60 and when there is no top padding: return only tile ids from the requested zoom level
  let minZoom = options.minzoom || 0;
  // Use 0.1 as an epsilon to avoid for explicit == 0.0 floating point checks
  if (view.pitch <= 60.0) minZoom = z;

  const radiusOfMaxLvlLodInTiles = 3;

  const newRootTile = (wrap: number): any => ({
    aabb: new Aabb([wrap * numTiles, 0, 0], [(wrap + 1) * numTiles, numTiles, 0]),
    zoom: 0,
    x: 0,
    y: 0,
    wrap,
    fullyVisible: false,
  });

  // Do a depth-first traversal to find visible tiles and proper levels of detail
  const stack: any[] = [];
  const result: any[] = [];
  const maxZoom = z;
  const overscaledZ = options.reparseOverscaled ? actualZ : z;

  if (options.renderWorldCopies) {
    // Render copy of the globe thrice on both sides
    for (let i = 1; i <= 3; i++) {
      stack.push(newRootTile(-i));
      stack.push(newRootTile(i));
    }
  }

  stack.push(newRootTile(0));

  while (stack.length > 0) {
    const it = stack.pop();
    const x = it.x;
    const y = it.y;
    let fullyVisible = it.fullyVisible;

    // Visibility of a tile is not required if any of its ancestor if fully inside the frustum
    if (!fullyVisible) {
      const intersectResult = it.aabb.intersects(cameraFrustum);

      if (intersectResult === 0) continue;

      fullyVisible = intersectResult === 2;
    }

    const refPoint = centerPoint;
    const distanceX = it.aabb.distanceX(refPoint);
    const distanceY = it.aabb.distanceY(refPoint);
    const longestDim = Math.max(Math.abs(distanceX), Math.abs(distanceY));

    // We're using distance based heuristics to determine if a tile should be split into quadrants or not.
    // radiusOfMaxLvlLodInTiles defines that there's always a certain number of maxLevel tiles next to the map center.
    // Using the fact that a parent node in quadtree is twice the size of its children (per dimension)
    // we can define distance thresholds for each relative level:
    // f(k) = offset + 2 + 4 + 8 + 16 + ... + 2^k. This is the same as "offset+2^(k+1)-2"
    const distToSplit = radiusOfMaxLvlLodInTiles + (1 << (maxZoom - it.zoom)) - 2;

    // Have we reached the target depth or is the tile too far away to be any split further?
    if (it.zoom === maxZoom || (longestDim > distToSplit && it.zoom >= minZoom)) {
      result.push({
        tileID: new TileID(it.zoom === maxZoom ? overscaledZ : it.zoom, x, y, it.zoom, it.wrap),
        distanceSq: vec2.sqrLen([centerPoint[0] - 0.5 - x, centerPoint[1] - 0.5 - y]),
      });
      continue;
    }

    for (let i = 0; i < 4; i++) {
      const childX = (x << 1) + (i % 2);
      const childY = (y << 1) + (i >> 1);
      const childZ = it.zoom + 1;
      const quadrant = it.aabb.quadrant(i);
      stack.push({
        aabb: quadrant,
        zoom: childZ,
        x: childX,
        y: childY,
        wrap: it.wrap,
        fullyVisible,
      });
    }
  }

  return result.sort((a, b) => a.distanceSq - b.distanceSq).map((a) => a.tileID);
}
