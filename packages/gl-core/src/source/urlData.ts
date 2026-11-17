/**
 * 瓦片 url 模板变量的上下文
 * - `x` / `y` / `z`：最终写入 url 的瓦片行列号（`scheme: 'tms'` 时 `y` 已经翻转）
 * - `s`：子域名
 * - `scheme`：瓦片规范，用于在需要时还原 XYZ 行号
 */
export interface UrlTemplateData {
  x: number;
  y: number;
  z: number;
  s: string | number;
  scheme: 'xyz' | 'tms';
  [key: string]: any;
}

export type UrlDataValue = string | number | ((data: UrlTemplateData) => string | number);

/**
 * 与 mapbox-gl 的 getMercCoords 保持一致
 * @link https://github.com/mapbox/mapbox-gl-js/blob/main/src/source/tile_id.ts
 */
function getMercCoords(x: number, y: number, z: number): [number, number] {
  const resolution = (2 * Math.PI * 6378137) / 256 / Math.pow(2, z);
  const mercX = x * resolution - (2 * Math.PI * 6378137) / 2.0;
  const mercY = y * resolution - (2 * Math.PI * 6378137) / 2.0;
  return [mercX, mercY];
}

/**
 * 计算瓦片在 EPSG:3857 下的 bbox（`minX,minY,maxX,maxY`），用于 WMS GetMap 的 BBOX 参数。
 * 计算方式与 mapbox-gl / maplibre-gl 的 `{bbox-epsg-3857}` 完全一致（使用原始精度，不做截断），
 * 且不受 `scheme` 影响：始终基于 XYZ 行列号计算真实地理范围。
 * @param data url 模板上下文
 */
export function bboxEpsg3857({ x, y, z, scheme }: UrlTemplateData): string {
  // url 中的 y 在 tms 下已经被翻转过，这里先还原为 XYZ 行号
  const xyzY = scheme === 'tms' ? Math.pow(2, z) - y - 1 : y;
  // EPSG:3857 的 y 轴向上，因此再翻转为自下而上的行号
  const tmsY = Math.pow(2, z) - xyzY - 1;
  const min = getMercCoords(x * 256, tmsY * 256, z);
  const max = getMercCoords((x + 1) * 256, (tmsY + 1) * 256, z);
  return `${min[0]},${min[1]},${max[0]},${max[1]}`;
}

/**
 * 所有瓦片请求默认可用的 url 模板变量（命名与 mapbox-gl / maplibre-gl 保持一致）
 */
export const DEFAULT_URL_DATA: Record<string, UrlDataValue> = {
  'bbox-epsg-3857': bboxEpsg3857,
};
