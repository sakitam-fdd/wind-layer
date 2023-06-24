import TileID from './TileID';
import type { TileBounds } from '../type';

/**
 * 计算经度
 * @param x 0-1
 * @param wrap
 * @returns {number}
 */
function lngFromMercatorX(x: number, wrap = 0): number {
  return x * 360 - 180 + wrap * 360;
}

function latFromMercatorY(y: number) {
  const y2 = 180 - y * 360;
  return (360 / Math.PI) * Math.atan(Math.exp((y2 * Math.PI) / 180)) - 90;
}

export function getBoundFromTileID(tileID: TileID): TileBounds {
  const { z, x, y } = tileID;
  const wrap = tileID.wrap;
  const numTiles = 1 << z;
  const leftLng = lngFromMercatorX(x / numTiles, wrap);
  const rightLng = lngFromMercatorX((x + 1) / numTiles, wrap);
  const topLat = latFromMercatorY(y / numTiles);
  const bottomLat = latFromMercatorY((y + 1) / numTiles);

  return [leftLng, bottomLat, rightLng, topLat];
}
