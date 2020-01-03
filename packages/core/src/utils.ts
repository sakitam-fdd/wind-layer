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

export function floorMod (a: number, n: number) {
  return a - n * Math.floor(a / n);
}
