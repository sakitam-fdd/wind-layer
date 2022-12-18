import RequestScheduler from './RequestScheduler';
import { arrayBufferToImage, arrayBufferToImageBitmap, getReferrer } from './util';

export class RequestAdapter {
  public requestScheduler: RequestScheduler;

  constructor(options) {
    this.requestScheduler = new RequestScheduler(options);
  }

  arrayBuffer2Image(data: ArrayBuffer, callback: any) {
    const imageBitmapSupported = typeof createImageBitmap === 'function';
    if (imageBitmapSupported) {
      arrayBufferToImageBitmap(data, callback);
    } else {
      arrayBufferToImage(data, callback);
    }
  }

  fetch(params, callback) {
    let complete = false;
    let aborted = false;

    const controller = new AbortController();
    const request = new Request(params.url, {
      method: params.method || 'GET',
      body: params.body,
      credentials: params.credentials,
      headers: params.headers,
      referrer: getReferrer(),
      signal: controller.signal,
    });

    if (params.type === 'json') {
      request.headers.set('Accept', 'application/json');
    }
    this.requestScheduler.scheduleRequest(params).then((requestToken) => {
      if (!requestToken) {
        aborted = true;
        return;
      }

      if (aborted) {
        requestToken.done();
        return;
      }

      const finishRequest = (response) => {
        // eslint-disable-next-line no-nested-ternary
        const res =
          params.type === 'arrayBuffer'
            ? response.arrayBuffer()
            : params.type === 'json'
            ? response.json()
            : response.text();
        res
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

      fetch(request)
        .then((response) => {
          if (response.ok) {
            return finishRequest(response);
          }
          return response.blob().then((body) => callback(new Error('blob')));
        })
        .catch((error) => {
          if (error.code === 20) {
            // silence expected AbortError
            return;
          }
          callback(new Error(error.message));
        })
        .finally(() => {
          requestToken.done();
        });
    });

    return {
      cancel: () => {
        aborted = true;
        if (!complete) controller.abort();
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
