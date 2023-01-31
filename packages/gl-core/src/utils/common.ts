import {utils} from '@sakitam-gis/vis-engine';

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
  const uint8Array = new Uint8Array([0xAA, 0xBB]);
  const uint16array = new Uint16Array(uint8Array.buffer);
  return uint16array[0] === 0xBBAA;
})();

/**
 * 判断数据是否是 `ImageBitmap`
 * @param image
 */
export function isImageBitmap(image: any): image is ImageBitmap {
  return typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap;
}

export function parseRange(exif) {
  const string = exif?.ImageDescription || '';
  const group = string.split(';');
  const gs = group.filter((item) => item !== '');
  return gs.reduce(
    (prev, current) => prev.concat(current.split(',').map((item) => parseFloat(item))),
    [],
  );
}
