import Field from './Field';

if (!Array.isArray) {
  // @ts-ignore
  Array.isArray = function(arg: any) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target: any, varArgs: any) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      let to = Object(target);

      for (let index = 1; index < arguments.length; index++) {
        const nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (let nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
const symToStringTag = typeof Symbol !== 'undefined' ? Symbol.toStringTag : undefined;

function baseGetTag (value: any) {
  if (value === null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  if (!(symToStringTag && symToStringTag in Object(value))) {
    return toString.call(value)
  }
  const isOwn = hasOwnProperty.call(value, symToStringTag);
  const tag = value[symToStringTag];
  let unmasked = false;
  try {
    value[symToStringTag] = undefined;
    unmasked = true
  } catch (e) {
  }

  const result = Object.prototype.toString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

export function TypeOf(value: any) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

/**
 * 判断是否为函数
 * @param value
 * @returns {boolean}
 */
export function isFunction (value: any): boolean {
  if (!isObject(value)) {
    return false
  }
  const tag = baseGetTag(value);
  return tag === '[object Function]' || tag === '[object AsyncFunction]' ||
    tag === '[object GeneratorFunction]' || tag === '[object Proxy]';
}

/**
 * 判断是否为对象
 * @param value
 * @returns {boolean}
 */
export function isObject(value: any) {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function')
}

/**
 * is date value
 * @param val
 * @returns {boolean}
 */
export function isDate (val: any) {
  return Object.prototype.toString.call(val) === '[object Date]';
}

/**
 * is array buffer
 * @param val
 * @returns {boolean}
 */
export function isArrayBuffer(val: any) {
  return Object.prototype.toString.call(val) === '[object ArrayBuffer]';
}

/**
 * 判断是否为合法字符串
 * @param value
 * @returns {boolean}
 */
export function isString (value: any): boolean {
  if (value == null) {
    return false;
  }
  return typeof value === 'string' || (value.constructor !== null && value.constructor === String);
}

/**
 * 判断是否为数字
 * @param value
 * @returns {boolean}
 */
export function isNumber (value: any) {
  return Object.prototype.toString.call(value) === '[object Number]' && !isNaN(value);
}

/**
 * check isEmpty object
 * @param object
 * @returns {boolean}
 */
export function isEmpty (object: {}) {
  let property;
  for (property in object) {
    return false;
  }
  return !property;
}

/**
 * check is null
 * @param obj
 * @returns {boolean}
 */
export function isNull (obj: any) {
  return obj == null;
}

/**
 * check is array
 * @param arr
 */
export function isArray(arr: any): boolean {
  return Array.isArray(arr);
}

/**
 * assign object
 * @param target
 * @param sources
 */
export function assign(target: object, ...sources: any[]) {
  return Object.assign(target, ...sources);
}

export function warnLog(msg: string) {
  console.warn(`wind-layer: ${msg}`);
}

/**
 * Get floored division
 * @param a
 * @param n
 * @returns {Number} returns remainder of floored division,
 * i.e., floor(a / n). Useful for consistent modulo of negative numbers.
 * See http://en.wikipedia.org/wiki/Modulo_operation.
 */
export function floorMod (a: number, n: number) {
  return a - n * Math.floor(a / n);
}

export interface IGFSItem {
  header: {
    parameterCategory: number | string;
    parameterNumber: number | string;
    dx: number;
    dy: number;
    nx: number;
    ny: number;
    lo1: number;
    lo2: number;
    la1: number;
    la2: number;
    [key: string]: any;
  };
  data: number[];
}

/**
 * format gfs json to vector
 * @param data
 */
export function formatData(data: IGFSItem[]) {
  let uComp: IGFSItem;
  let vComp: IGFSItem;

  if ((process.env.NODE_ENV as string) === ('development' as string)) {
    console.time('format-data');
  }

  data.forEach(function (record: IGFSItem) {
    switch (record.header.parameterCategory + "," + record.header.parameterNumber) {
      case "1,2":
      case "2,2":
        uComp = record;
        break;
      case "1,3":
      case "2,3":
        vComp = record;
        break;
    }
  });

  // @ts-ignore
  if (!vComp || !uComp) return;

  const header = uComp.header;
  const vectorField = new Field({
    xmin: header.lo1, // 一般格点数据是按照矩形范围来切割，所以定义其经纬度范围
    ymin: header.la2,
    xmax: 360,
    ymax: header.la1,
    deltaX: 1, // x（经度）增量
    deltaY: 1, // y（维度）增量
    cols: 360, // 列（可由 `(xmax - xmin) / deltaX` 得到）
    rows: 181, // 行
    us: uComp.data, // U分量
    vs: vComp.data, // V分量
    wrappedX: false,
  });

  if ((process.env.NODE_ENV as string) === ('development' as string)) {
    console.timeEnd('format-data');
  }

  return vectorField;
}

/**
 * create canvas
 * @param width
 * @param height
 * @param retina
 * @param Canvas
 * @returns {HTMLCanvasElement}
 */
export function createCanvas(width: number, height: number, retina: number, Canvas: any): HTMLCanvasElement {
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = width * retina;
    canvas.height = height * retina;
    return canvas
  } else {
    // create a new canvas instance in node.js
    // the canvas class needs to have a default constructor without any parameter
    return new Canvas(width * retina, height * retina);
  }
}
