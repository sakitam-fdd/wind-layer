/* eslint-disable no-restricted-globals */

/*
 * Call an asynchronous function on an array of arguments,
 * calling `callback` with the completed results of all calls.
 *
 * @param array input to each call of the async function.
 * @param fn an async function with signature (data, callback)
 * @param callback a callback run after all async work is done.
 * called with an array, containing the results of each async call.
 * @private
 */
export function asyncAll<Item, Result>(
  array: Array<Item>,
  fn: (item: Item, fnCallback: Callback<Result>) => void,
  callback: Callback<Array<Result>>,
) {
  if (!array.length) {
    return callback(null, []);
  }
  let remaining = array.length;
  const results = new Array(array.length);
  let error = null;
  array.forEach((item, i) => {
    fn(item, (err, result) => {
      if (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        error = err;
      }
      results[i] = result as any as Result; // https://github.com/facebook/flow/issues/2123
      if (--remaining === 0) callback(error, results);
    });
  });
}

/**
 *  Returns true if the when run in the web-worker context.
 *
 * @private
 * @returns {boolean}
 */
export function isWorker(): boolean {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    typeof self !== 'undefined' &&
    self instanceof WorkerGlobalScope
  );
}

/**
 * Print a warning message to the console and ensure duplicate warning messages
 * are not printed.
 * @private
 */
const warnOnceHistory: { [key: string]: boolean } = {};

export function warnOnce(message: string): void {
  if (!warnOnceHistory[message]) {
    // console isn't defined in some WebWorkers, see #2558
    if (typeof console !== 'undefined') console.warn(message);
    warnOnceHistory[message] = true;
  }
}

export function isImageBitmap(image: any): image is ImageBitmap {
  return typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap;
}

export function isArrayBuffer(value: any): value is ArrayBuffer {
  return (
    value &&
    typeof ArrayBuffer !== 'undefined' &&
    (value instanceof ArrayBuffer ||
      (value.constructor && value.constructor.name === 'ArrayBuffer'))
  );
}

let _isSafari: WithNull<boolean> = null;

/**
 * Returns true when run in WebKit derived browsers.
 * This is used as a workaround for a memory leak in Safari caused by using Transferable objects to
 * transfer data between WebWorkers and the main thread.
 * https://github.com/mapbox/mapbox-gl-js/issues/8771
 *
 * This should be removed once the underlying Safari issue is fixed.
 *
 * @private
 * @param scope {WindowOrWorkerGlobalScope} Since this function is used both on the main thread and WebWorker context,
 *      let the calling scope pass in the global scope object.
 * @returns {boolean}
 */
export function isSafari(scope: any): boolean {
  if (_isSafari == null) {
    const userAgent = scope.navigator ? scope.navigator.userAgent : null;
    _isSafari =
      !!scope.safari ||
      !!(
        userAgent &&
        (/\b(iPad|iPhone|iPod)\b/.test(userAgent) ||
          (!!userAgent.match('Safari') && !userAgent.match('Chrome')))
      );
  }
  return _isSafari;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function nullFunction() {}

const uidCounters: Record<string, number> = {};

/**
 * 获取 uid
 * @param id= - Identifier base name
 * @param id
 * @return uid
 * */
export function uid(id = 'id'): string {
  uidCounters[id] = uidCounters[id] ?? 0;
  const count = uidCounters[id]++;
  return `${id}-${count}`;
}

export function typeOf(value: any): string {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(v: any): v is Function {
  return typeOf(v) === 'function';
}

// Ensure that we're sending the correct referrer from blob URL worker bundles.
// For files loaded from the local file system, `location.origin` will be set
// to the string(!) "null" (Firefox), or "file://" (Chrome, Safari, Edge, IE),
// and we will set an empty referrer. Otherwise, we're using the document's URL.
export const getReferrer = isWorker()
  ? () => (self as any).worker && (self as any).worker.referrer
  : () => (window.location.protocol === 'blob:' ? window.parent : window).location.href;

/**
 * 将 ArrayBuffer 转换为 ImageBitmap
 * @param data
 * @param callback
 */
export function arrayBufferToImageBitmap(
  data: ArrayBuffer,
  callback: (err?: Error | null, image?: ImageBitmap | null) => void,
) {
  const blob: Blob = new Blob([new Uint8Array(data)], { type: 'image/png' });
  createImageBitmap(blob, {
    imageOrientation: 'flipY',
  })
    .then((imgBitmap) => {
      callback(null, imgBitmap);
    })
    .catch((e) => {
      callback(
        new Error(
          `Could not load image because of ${e.message}. Please make sure to use a supported image type such as PNG or JPEG. Note that SVGs are not supported.`,
        ),
      );
    });
}

const transparentPngUrl =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=';

/**
 * 将 ArrayBuffer 转换为 Image
 * @param data
 * @param callback
 */
export function arrayBufferToImage(
  data: ArrayBuffer,
  callback: (err?: Error | null, image?: HTMLImageElement | null) => void,
) {
  const img: HTMLImageElement = new Image();
  img.onload = () => {
    callback(null, img);
    URL.revokeObjectURL(img.src);
    // prevent image dataURI memory leak in Safari;
    // but don't free the image immediately because it might be uploaded in the next frame
    // https://github.com/mapbox/mapbox-gl-js/issues/10226
    img.onload = null;
    window.requestAnimationFrame(() => {
      img.src = transparentPngUrl;
    });
  };
  img.onerror = () =>
    callback(
      new Error(
        'Could not load image. Please make sure to use a supported image type such as PNG or JPEG. Note that SVGs are not supported.',
      ),
    );
  const blob: Blob = new Blob([new Uint8Array(data)], { type: 'image/png' });
  img.src = data.byteLength ? URL.createObjectURL(blob) : transparentPngUrl;
}
