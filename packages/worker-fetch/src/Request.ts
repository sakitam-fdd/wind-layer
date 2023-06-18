import RequestScheduler from './RequestScheduler';
import { arrayBufferToImageBitmap, getReferrer, isWorker, warnOnce } from './util';

export type RequestParameters = {
  url: string;
  headers?: any;
  method?: 'GET' | 'POST' | 'PUT';
  body?: string;
  type?: 'string' | 'json' | 'arrayBuffer';
  credentials?: 'same-origin' | 'include';
  collectResourceTiming?: boolean;
};

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

const isFileURL = (url) =>
  /^file:/.test(url) || (/^file:/.test(getReferrer()) && !/^\w+:/.test(url));

function makeFetchRequest(
  requestParameters: RequestParameters,
  callback: ResponseCallback<any>,
): Cancelable {
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
            .then((body) =>
              callback(
                new AJAXError(response.status, response.statusText, requestParameters.url, body),
              ),
            );
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
        callback(
          null,
          result,
          response.headers.get('Cache-Control'),
          response.headers.get('Expires'),
        );
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

function makeXMLHttpRequest(
  requestParameters: RequestParameters,
  callback: ResponseCallback<any>,
): Cancelable {
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
      callback(
        null,
        data,
        xhr.getResponseHeader('Cache-Control'),
        xhr.getResponseHeader('Expires'),
      );
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
      return (self as any).worker.actor.send(
        'getResource',
        requestParameters,
        callback,
        undefined,
        queueOnMainThread,
      );
    }
  }
  return makeXMLHttpRequest(requestParameters, callback);
};

export class RequestAdapter {
  public requestScheduler: RequestScheduler;

  constructor(options) {
    this.requestScheduler = new RequestScheduler(options);
  }

  getResource(
    mapId: string,
    params: RequestParameters,
    callback: ResponseCallback<any>,
  ): Cancelable {
    return makeRequest(params, callback);
  }

  /**
   * arrayBuffer 转 Unit8
   * @param data
   * @param callback
   */
  arrayBuffer2float(data: ArrayBuffer, callback: any) {
    const d = new Float32Array(data);
    const w = Math.sqrt(d.length);
    callback(null, {
      data: d,
      width: w,
      height: w,
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
      this.arrayBuffer2float(data, callback);
    }
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
