import { parse } from 'exifr/dist/lite.esm';
import RequestScheduler from './RequestScheduler';
import { arrayBufferToImageBitmap, getReferrer, isWorker, warnOnce, parseMetedata, isImageBitmap } from './util';
import { decode, toRGBA8 } from './UPNG';

export interface RequestParameters {
  url: string;
  headers?: any;
  method?: 'GET' | 'POST' | 'PUT';
  body?: string;
  type?: 'string' | 'json' | 'arrayBuffer';
  credentials?: 'same-origin' | 'include';
  collectResourceTiming?: boolean;
}

export type ResponseCallback<T> = (
  error?: Error | null,
  data?: T | null,
  cacheControl?: string | null,
  expires?: string | null,
) => void;

/**
 * An error thrown when a HTTP request results in an error response.
 * @extends Error
 * @param {number} status The response's HTTP status code.
 * @param {string} statusText The response's HTTP status text.
 * @param {string} url The request's URL.
 * @param {Blob} body The response's body.
 */
export class AJAXError extends Error {
  /**
   * The response's HTTP status code.
   */
  status: number;

  /**
   * The response's HTTP status text.
   */
  statusText: string;

  /**
   * The request's URL.
   */
  url: string;

  /**
   * The response's body.
   */
  body: Blob;

  constructor(status: number, statusText: string, url: string, body: Blob) {
    super(`AJAXError: ${statusText} (${status}): ${url}`);
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    this.body = body;
  }
}

const isFileURL = (url) => /^file:/.test(url) || (/^file:/.test(getReferrer()) && !/^\w+:/.test(url));

function makeFetchRequest(requestParameters: RequestParameters, callback: ResponseCallback<any>): Cancelable {
  const controller = new AbortController();
  const request = new Request(requestParameters.url, {
    method: requestParameters.method || 'GET',
    body: requestParameters.body,
    credentials: requestParameters.credentials,
    headers: requestParameters.headers,
    referrer: getReferrer(),
    signal: controller.signal,
  });
  let complete = false;
  let aborted = false;

  if (requestParameters.type === 'json') {
    request.headers.set('Accept', 'application/json');
  }

  const validateOrFetch = (err, cachedResponse?, responseIsFresh?) => {
    if (aborted) return;

    if (err) {
      // Do fetch in case of cache error.
      // HTTP pages in Edge trigger a security error that can be ignored.
      if (err.message !== 'SecurityError') {
        warnOnce(err);
      }
    }

    if (cachedResponse && responseIsFresh) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return finishRequest(cachedResponse);
    }

    if (cachedResponse) {
      // We can't do revalidation with 'If-None-Match' because then the
      // request doesn't have simple cors headers.
    }

    fetch(request)
      .then((response) => {
        if (response.ok) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          return finishRequest(response);
        } else {
          return response
            .blob()
            .then((body) => callback(new AJAXError(response.status, response.statusText, requestParameters.url, body)));
        }
      })
      .catch((error) => {
        if (error.code === 20) {
          // silence expected AbortError
          // return;
        }
        callback(new Error(error.message));
      });
  };

  const finishRequest = (response) => {
    (requestParameters.type === 'arrayBuffer'
      ? response.arrayBuffer()
      : requestParameters.type === 'json'
        ? response.json()
        : response.text()
    )
      .then((result) => {
        if (aborted) return;
        complete = true;
        callback(null, result, response.headers.get('Cache-Control'), response.headers.get('Expires'));
      })
      .catch((err) => {
        if (!aborted) callback(new Error(err.message));
      });
  };

  validateOrFetch(null, null);

  return {
    cancel: () => {
      aborted = true;
      if (!complete) controller.abort();
    },
  };
}

function makeXMLHttpRequest(requestParameters: RequestParameters, callback: ResponseCallback<any>): Cancelable {
  const xhr: XMLHttpRequest = new XMLHttpRequest();

  xhr.open(requestParameters.method || 'GET', requestParameters.url, true);
  if (requestParameters.type === 'arrayBuffer') {
    xhr.responseType = 'arraybuffer';
  }
  for (const k in requestParameters.headers) {
    xhr.setRequestHeader(k, requestParameters.headers[k]);
  }
  if (requestParameters.type === 'json') {
    xhr.responseType = 'text';
    xhr.setRequestHeader('Accept', 'application/json');
  }
  xhr.withCredentials = requestParameters.credentials === 'include';
  xhr.onerror = () => {
    callback(new Error(xhr.statusText));
  };
  xhr.onload = () => {
    if (((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) && xhr.response !== null) {
      let data: unknown = xhr.response;
      if (requestParameters.type === 'json') {
        // We're manually parsing JSON here to get better error messages.
        try {
          data = JSON.parse(xhr.response);
        } catch (err) {
          return callback(err);
        }
      }
      callback(null, data, xhr.getResponseHeader('Cache-Control'), xhr.getResponseHeader('Expires'));
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const body = new Blob([xhr.response], { type: xhr.getResponseHeader('Content-Type') });
      callback(new AJAXError(xhr.status, xhr.statusText, requestParameters.url, body));
    }
  };
  xhr.send(requestParameters.body);
  return { cancel: () => xhr.abort() };
}

export const makeRequest = function (
  requestParameters: RequestParameters,
  callback: ResponseCallback<any>,
): Cancelable {
  // We're trying to use the Fetch API if possible. However, in some situations we can't use it:
  // - IE11 doesn't support it at all. In this case, we dispatch the request to the main thread so
  //   that we can get an accruate referrer header.
  // - Safari exposes window.AbortController, but it doesn't work actually abort any requests in
  //   some versions (see https://bugs.webkit.org/show_bug.cgi?id=174980#c2)
  // - Requests for resources with the file:// URI scheme don't work with the Fetch API either. In
  //   this case we unconditionally use XHR on the current thread since referrers don't matter.
  if (/:\/\//.test(requestParameters.url) && !/^https?:|^file:/.test(requestParameters.url)) {
    if (isWorker() && (self as any).worker && (self as any).worker.actor) {
      return (self as any).worker.actor.send('getResource', requestParameters, callback);
    }
    if (!isWorker()) {
      return makeFetchRequest(requestParameters, callback);
    }
  }
  if (!isFileURL(requestParameters.url)) {
    if (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fetch &&
      Request &&
      AbortController &&
      Object.prototype.hasOwnProperty.call(Request.prototype, 'signal')
    ) {
      return makeFetchRequest(requestParameters, callback);
    }
    if (isWorker() && (self as any).worker && (self as any).worker.actor) {
      const queueOnMainThread = true;
      return (self as any).worker.actor.send('getResource', requestParameters, callback, undefined, queueOnMainThread);
    }
  }
  return makeXMLHttpRequest(requestParameters, callback);
};

let pool;

export function getPool() {
  if (!pool) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    pool = new self.GeoTIFF.Pool();
  }

  return pool;
}

export class RequestAdapter {
  public requestScheduler: RequestScheduler;

  constructor(options) {
    this.requestScheduler = new RequestScheduler(options);
  }

  getResource(mapId: string, params: RequestParameters, callback: ResponseCallback<any>): Cancelable {
    return makeRequest(params, callback);
  }

  /**
   * arrayBuffer 转 Unit8
   * @param data
   * @param callback
   */
  arrayBuffer2unit8(data: ArrayBuffer, callback: any) {
    const pngImage = decode(data);

    const pixels = toRGBA8(pngImage);
    callback(null, {
      data: new Uint8Array(pixels[0]),
      width: pngImage.width,
      height: pngImage.height,
    });
  }

  /**
   * arrayBuffer 转图像
   * 1. 如果支持 ImageBitmap 则生成 `ImageBitmap` 除了极少数浏览器不支持外兼容性尚可
   * 2. 在 safari 和移动浏览器下配合 rgba2float 有精度问题，不建议使用
   * @param data
   * @param callback
   */
  arrayBuffer2Image(data: ArrayBuffer, callback: any) {
    const imageBitmapSupported = typeof createImageBitmap === 'function';
    if (imageBitmapSupported) {
      arrayBufferToImageBitmap(data, callback);
    } else {
      this.arrayBuffer2unit8(data, callback);
    }
  }

  /**
   * geotiff 解析
   * @param data
   * @param callback
   */
  arrayBuffer2tiff(data: ArrayBuffer, callback: any) {
    // @ts-ignore
    if (!self.GeoTIFF) {
      throw new Error('Must config [geotiff](https://github.com/geotiffjs/geotiff.js) dep use `configDeps`');
    }
    // @ts-ignore
    self.GeoTIFF.fromArrayBuffer(data)
      .then((geotiff) => {
        geotiff
          .getImage()
          .then((image) => {
            const result: any = {};
            const fileDirectory = image.fileDirectory;

            const { GeographicTypeGeoKey, ProjectedCSTypeGeoKey } = image.getGeoKeys();

            result.projection = ProjectedCSTypeGeoKey || GeographicTypeGeoKey;

            const height = image.getHeight();
            result.height = height;
            const width = image.getWidth();
            result.width = width;

            const [resolutionX, resolutionY] = image.getResolution();
            result.pixelHeight = Math.abs(resolutionY);
            result.pixelWidth = Math.abs(resolutionX);

            const [originX, originY] = image.getOrigin();
            result.xmin = originX;
            result.xmax = result.xmin + width * result.pixelWidth;
            result.ymax = originY;
            result.ymin = result.ymax - height * result.pixelHeight;

            result.noDataValue = fileDirectory.GDAL_NODATA ? parseFloat(fileDirectory.GDAL_NODATA) : null;

            result.numberOfRasters = fileDirectory.SamplesPerPixel;

            image
              .readRasters({ pool: getPool() })
              .then((rasters) => {
                result.rasters = rasters;
                const r = rasters[0];
                if (r) {
                  let i = 0;
                  const bands = rasters.length;
                  const d = new r.constructor(r.length * bands);
                  for (; i < r.length; i++) {
                    for (let j = 0; j < bands; j++) {
                      d[i + j] = rasters[j][i];
                    }
                  }
                  result.data = d;
                }
                result.metadata = image.getGDALMetadata();
                const metadata = parseMetedata(fileDirectory.ImageDescription || '');
                result.min = metadata.min;
                result.max = metadata.max;
                result.isTiff = true;
                callback(null, result);
              })
              .catch((err) => {
                callback(err);
              });
          })
          .catch((err) => {
            callback(err);
          });
      })
      .catch((err) => {
        callback(err);
      });
  }

  /**
   * 解析 exif 信息
   * @param data
   * @param callback
   */
  parseExif(data: ArrayBuffer, callback: any) {
    // // @ts-ignore
    // if (!self.exifr) {
    //   throw new Error(
    //     'Must config [exifr](https://github.com/MikeKovarik/exifr) dep use `configDeps`',
    //   );
    // }
    // // @ts-ignore
    // self.exifr
    parse(data)
      .then((res) => {
        this.arrayBuffer2Image(data, (error, image) => {
          if (error) {
            callback(error);
          } else {
            callback(null, {
              data: isImageBitmap(image) ? image : image.data,
              width: image.width,
              height: image.height,
              exif: res,
              withExif: true,
            });
          }
        });
      })
      .catch((err) => {
        callback(err);
      });
  }

  fetch(params, callback) {
    let aborted = false;

    const r = this.requestScheduler.scheduleRequest(() => {
      const p = new Promise((resolve) => {
        const request = makeRequest(params, (...args) => {
          if (aborted) {
            resolve(false);
            return;
          }
          callback(...args);
          resolve(args);
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        p.cancel = () => {
          request.cancel();
        };
      });
      return p;
    });

    return {
      cancel: () => {
        aborted = true;
        r.cancel();
      },
    };
  }
}

let request: WithNull<RequestAdapter> = null;

export default function getRequest(options = {}, force = false): RequestAdapter {
  if (!request || force) {
    request = new RequestAdapter(options);
  }
  return request;
}
