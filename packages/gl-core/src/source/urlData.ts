/**
 * Generate WMS GepMap BBOX parameter
 * @param data - tile url data
 * @returns
 */
export function bboxEpsg3857({ x, y, z }: { x: number; y: number; z: number; [key: string]: any }) {
  const gridSize = Math.pow(2, z); // Total world grid at zoom level
  const mercatorSize = 2 * 20037508.34; // Half the world's circumference in EPSG:3857 in meters
  const cellSize = mercatorSize / gridSize; // TMS cell size in meters

  // Convert tile coordinates to EPSG:3857
  const minX = (x / gridSize) * mercatorSize - mercatorSize / 2;
  const maxX = minX + cellSize;
  const maxY = mercatorSize / 2 - (y / gridSize) * mercatorSize;
  const minY = maxY - cellSize;

  return [minX.toFixed(2), minY.toFixed(2), maxX.toFixed(2), maxY.toFixed(2)].join(',');
}

/**
 * Url Data available for all requests
 */
export const DEFAULT_URL_DATA = {
  'bbox-epsg-3857': bboxEpsg3857,
};
