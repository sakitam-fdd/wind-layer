import earcut from 'earcut';
import { utils, type Attributes, type Renderer } from '@sakitam-gis/vis-engine';
import type { Bounds } from '../type';

/**
 * 获取当前设备/浏览器支持的最佳浮点纹理配置，用于 RenderTarget (FBO)。
 *
 * 背景：将浮点纹理作为 FBO 颜色附件需要额外的 WebGL 扩展支持：
 *  - WebGL2：必须调用 getExtension('EXT_color_buffer_float') 才能渲染到 RGBA32F 纹理。
 *    iOS 15+ Safari 的 WebGL2 已支持此扩展，但必须显式启用，否则 FBO 处于
 *    FRAMEBUFFER_INCOMPLETE_ATTACHMENT 状态，所有绘制调用静默失败且无任何 GL 报错。
 *  - WebGL1：需要 OES_texture_float + WEBGL_color_buffer_float 扩展。
 *    iOS Safari WebGL1 通常不支持 WEBGL_color_buffer_float，需要降级到 HALF_FLOAT 或 UNSIGNED_BYTE。
 *
 * 优先级：FLOAT (32-bit) → HALF_FLOAT (16-bit) → UNSIGNED_BYTE (8-bit)
 */
export function getFloatTextureOptions(renderer: Renderer): {
  type: number;
  format: number;
  internalFormat: number;
  supportFloat: boolean;
} {
  const gl = renderer.gl;

  if (renderer.isWebGL2) {
    const gl2 = gl as WebGL2RenderingContext;

    // 尝试启用 32-bit 浮点颜色缓冲（iOS 15+ 支持但需显式调用 getExtension 激活）
    if (gl2.getExtension('EXT_color_buffer_float')) {
      return {
        type: gl2.FLOAT,
        format: gl2.RGBA,
        internalFormat: gl2.RGBA32F,
        supportFloat: true,
      };
    }

    // 降级到 16-bit 半精度浮点
    if (gl2.getExtension('EXT_color_buffer_half_float')) {
      return {
        type: gl2.HALF_FLOAT,
        format: gl2.RGBA,
        internalFormat: gl2.RGBA16F,
        supportFloat: true,
      };
    }
  } else {
    // WebGL1
    const floatExt = gl.getExtension('OES_texture_float');
    const colorBufExt = gl.getExtension('WEBGL_color_buffer_float');
    if (floatExt && colorBufExt) {
      return {
        type: gl.FLOAT,
        format: gl.RGBA,
        internalFormat: gl.RGBA,
        supportFloat: true,
      };
    }

    // 降级到 16-bit 半精度浮点（WebGL1）
    const halfFloatExt = gl.getExtension('OES_texture_half_float');
    const halfColorBufExt = gl.getExtension('EXT_color_buffer_half_float');
    if (halfFloatExt && halfColorBufExt) {
      return {
        type: (halfFloatExt as any).HALF_FLOAT_OES,
        format: gl.RGBA,
        internalFormat: gl.RGBA,
        supportFloat: true,
      };
    }
  }

  // 最终降级：使用 UNSIGNED_BYTE（精度有限，但在所有设备上保证可用）
  return {
    type: gl.UNSIGNED_BYTE,
    format: gl.RGBA,
    internalFormat: gl.RGBA,
    supportFloat: false,
  };
}

export function calcMinMax(array: number[]): [number, number] {
  let min = Infinity;
  let max = Infinity;
  // @from: https://stackoverflow.com/questions/13544476/how-to-find-max-and-min-in-array-using-minimum-comparisons
  for (let i = 0; i < array.length; i++) {
    const val = array[i];

    if (min === Infinity) {
      min = val;
    } else if (max === Infinity) {
      max = val;
      // update min max
      // 1. Pick 2 elements(a, b), compare them. (say a > b)
      min = Math.min(min, max);
      max = Math.max(min, max);
    } else {
      // 2. Update min by comparing (min, b)
      // 3. Update max by comparing (max, a)
      min = Math.min(val, min);
      max = Math.max(val, max);
    }
  }
  return [min, max];
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(val: any): val is Function {
  return utils.typeOf(val) === 'function';
}

export function findStopLessThanOrEqualTo(stops: number[], input: number) {
  const lastIndex = stops.length - 1;
  let lowerIndex = 0;
  let upperIndex = lastIndex;
  let currentIndex = 0;
  let currentValue;
  let nextValue;

  while (lowerIndex <= upperIndex) {
    currentIndex = Math.floor((lowerIndex + upperIndex) / 2);
    currentValue = stops[currentIndex];
    nextValue = stops[currentIndex + 1];

    if (currentValue <= input) {
      if (currentIndex === lastIndex || input < nextValue) {
        // Search complete
        return currentIndex;
      }

      lowerIndex = currentIndex + 1;
    } else if (currentValue > input) {
      upperIndex = currentIndex - 1;
    } else {
      throw new Error('Input is not a number.');
    }
  }

  return 0;
}

let linkEl;

/**
 * 使用相对地址时使用 `a.href` 和 `image.src` 可以获取完整的 url
 * 但是不同的是 `image.src` 会直接请求资源。
 * @param path
 */
export function resolveURL(path: string): string {
  if (!linkEl) linkEl = document.createElement('a');
  linkEl.href = path;
  return linkEl.href;
}

/**
 * 判断大小端
 */
export const littleEndian = (function machineIsLittleEndian() {
  const uint8Array = new Uint8Array([0xaa, 0xbb]);
  const uint16array = new Uint16Array(uint8Array.buffer);
  return uint16array[0] === 0xbbaa;
})();

/**
 * 判断数据是否是 `ImageBitmap`
 * @param image
 */
export function isImageBitmap(image: any): image is ImageBitmap {
  return typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap;
}

/**
 * 从 exif 解析数据范围
 * @param exif
 */
export function parseRange(exif) {
  const string = exif?.ImageDescription || '';
  const group = string.split(';');
  const gs = group.filter((item) => item !== '');
  return gs.map((item) => item.split(',').map((v) => parseFloat(v)));
}

/**
 * 获取两个对象中不同的 key
 * @param obj
 * @param other
 */
export function keysDifference(obj, other) {
  const difference: (string | number)[] = [];
  for (const i in obj) {
    if (!(i in other)) {
      difference.push(i);
    }
  }
  return difference;
}

/**
 * extent1 是否包含 extent2
 *           extent1[3]
 *           |--------|
 *           |        |
 * extent1[0]|        |extent1[2]
 *           |--------|
 *           extent1[1]
 *
 *            extent2[3]
 *           |--------|
 *           |        |
 * extent2[0]|        |extent2[2]
 *           |--------|
 *           extent2[1]
 * @param extent1
 * @param extent2
 */
export function intersects(extent1: Bounds, extent2: Bounds) {
  return extent1[0] <= extent2[2] && extent1[2] >= extent2[0] && extent1[1] <= extent2[3] && extent1[3] >= extent2[1];
}

/**
 * extent1 是否包含 extent2
 *           extent1[3]
 *           |--------|
 *           |        |
 * extent1[0]|        |extent1[2]
 *           |--------|
 *           extent1[1]
 *
 *            extent2[3]
 *           |--------|
 *           |        |
 * extent2[0]|        |extent2[2]
 *           |--------|
 *           extent2[1]
 * @param extent1
 * @param extent2
 */
export function containsExtent(extent1: Bounds, extent2: Bounds) {
  return extent1[0] <= extent2[0] && extent2[2] <= extent1[2] && extent1[1] <= extent2[1] && extent2[3] <= extent1[3];
}

/**
 * 判断坐标是否在矩形范围内
 * @param {Array<number>} extent Extent.
 * @param {number} x X coordinate.
 * @param {number} y Y coordinate.
 * @return {boolean} The x, y values are contained in the extent.
 * @api
 */
export function containsXY(extent, x, y) {
  return extent[0] <= x && x <= extent[2] && extent[1] <= y && y <= extent[3];
}

export function inRange(value: number, start: number, end: number) {
  return value >= start && value < end;
}

export function mod(x, y) {
  return ((x % y) + y) % y;
}

export function containTile(a: Bounds, b: Bounds) {
  return containsExtent(a, b) || intersects(a, b);
}

/**
 * 将多面转换为单面
 * @returns {*}
 */
export function flattenForPolygons(features) {
  if (!features || features.length === 0) return [];

  const len = features.length;
  let i = 0;
  const data: any[] = [];

  for (; i < len; i++) {
    const feature = features[i];

    const coordinates = feature.geometry.coordinates;
    const type = feature.geometry.type;

    if (type === 'Polygon') {
      data.push(feature);
    } else if (type === 'MultiPolygon') {
      for (let k = 0; k < coordinates.length; k++) {
        const coordinate = coordinates[k];
        data.push({
          ...feature,
          geometry: {
            type: 'Polygon',
            coordinates: coordinate,
          },
        });
      }
    }
  }

  return data;
}

export function polygon2buffer(features: any[]) {
  const len = features.length;
  let i = 0;
  const geometries: Attributes[] = [];
  for (; i < len; i++) {
    const feature = features[i];

    const coordinates = feature.geometry.coordinates;
    const type = feature.geometry.type;

    if (type === 'Polygon') {
      const polygon = earcut.flatten(feature.geometry.coordinates);

      const positions = new Float32Array(polygon.vertices);
      const indexData = earcut(polygon.vertices, polygon.holes, polygon.dimensions);

      geometries.push({
        index: {
          data: indexData.length < 65536 ? new Uint16Array(indexData) : new Uint32Array(indexData),
        },
        position: {
          data: positions,
          size: 2,
        },
      });
    } else if (type === 'MultiPolygon') {
      for (let k = 0; k < coordinates.length; k++) {
        const coordinate = coordinates[k];
        const polygon = earcut.flatten(coordinate);

        const positions = new Float32Array(polygon.vertices);
        const indexData = earcut(polygon.vertices, polygon.holes, polygon.dimensions);
        geometries.push({
          index: {
            data: indexData.length < 65536 ? new Uint16Array(indexData) : new Uint32Array(indexData),
          },
          position: {
            data: positions,
            size: 2,
          },
        });
      }
    }
  }

  return geometries;
}
