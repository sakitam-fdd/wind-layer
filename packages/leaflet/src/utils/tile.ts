import type { TileBounds, Bounds, TileID } from 'wind-gl-core';
import { mod } from 'wind-gl-core';
import { fromLngLat, latFromMercatorY, lngFromMercatorX, MAX_MERCATOR_LATITUDE } from './mercatorCoordinate';

export function getTileProjBounds(tileID: TileID) {
  const numTiles = 1 << tileID.z;
  return {
    left: tileID.wrapedX / numTiles,
    top: tileID.wrapedY / numTiles,
    right: (tileID.wrapedX + 1) / numTiles,
    bottom: (tileID.wrapedY + 1) / numTiles,
  };
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

export function getExtent(map: any) {
  const bounds: any = map?.getBounds();
  const southWest = bounds.getSouthWest();
  const northEast = bounds.getNorthEast();

  const [xmin, ymin, xmax, ymax] = [southWest.lng, southWest.lat, northEast.lng, northEast.lat];

  const minY = Math.max(ymin, MAX_MERCATOR_LATITUDE);
  const maxY = Math.min(ymax, -MAX_MERCATOR_LATITUDE);
  const p0 = fromLngLat({ lng: xmin, lat: maxY });
  const p1 = fromLngLat({ lng: xmax, lat: minY });
  return [p0.x, p0.y, p1.x, p1.y];
}

export function getClampZoom(options) {
  const z = options.zoom;
  if (undefined !== options.minzoom && z < options.minzoom) {
    return options.minzoom;
  }

  if (undefined !== options.maxzoom && options.maxzoom < z) {
    return options.maxzoom;
  }

  return z;
}

export function coveringTiles(config: any): any {
  const { bounds, zoom: z } = config;
  const clampZoom = getClampZoom(config);
  const x1 = Math.floor((bounds[0] + 180) / (360 / Math.pow(2, z)));
  const y1 = Math.ceil((90 - bounds[1]) / (180 / Math.pow(2, z - 1)));
  const x2 = Math.ceil((bounds[2] + 180) / (360 / Math.pow(2, z)));
  const y2 = Math.floor((90 - bounds[3]) / (180 / Math.pow(2, z - 1)));

  const grids = [x1, y1, x2, y2];

  const tileIds: { x: number; y: number; z: number }[] = [];
  for (let i = grids[0]; i < grids[2]; i++) {
    for (let j = grids[3]; j <= grids[1]; j++) {
      const gridData = { x: i, y: j, z: z, clampZoom };
      tileIds.push(gridData);
    }
  }
  return tileIds;
}
