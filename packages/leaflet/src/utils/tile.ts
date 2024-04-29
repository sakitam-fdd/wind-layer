import type { TileBounds, TileID } from 'wind-gl-core';
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
