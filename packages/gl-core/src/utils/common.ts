import { utils } from '@sakitam-gis/vis-engine';

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

export function isValide(val: any): boolean {
  return val !== undefined && val !== null && !isNaN(val);
}

/**
 * pick object keys
 * @param obj
 * @param keys
 */
export function pick<T, K extends keyof T>(obj: T, keys: K[] = []): Omit<T, K> {
  return Object.keys(obj as any)
    .filter((key: any) => keys.indexOf(key) > -1)
    .reduce(
      (newObj: Omit<T, K>, key) =>
        Object.assign(newObj, {
          [key]: obj[key],
        }),
      {} as Omit<T, K>,
    );
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
