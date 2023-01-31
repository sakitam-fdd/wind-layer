/* eslint-disable no-restricted-globals */
import { isWorker } from './util';
import Actor from './Actor';
import getRequest, { RequestAdapter } from './Request';

export default class Worker {
  self: any;

  actor: Actor;

  referrer: string;

  request: RequestAdapter;

  cancelMap: Map<any, any> = new Map();

  constructor(self: any) {
    this.self = self;
    this.actor = new Actor(self, this);
    this.request = getRequest();
  }

  setReferrer(dispatcherId: string, referrer: string) {
    this.referrer = referrer;
  }

  configDeps(dispatcherId: string, deps: string[]) {
    if (deps && Array.isArray(deps) && deps.length > 0) {
      self.importScripts(...deps);
    }
  }

  loadData(dispatcherId: string, params: any, callback: any) {
    const cancelId = params?.cancelId;
    const { cancel } = this.request.fetch(params, (err, data) => {
      this.cancelMap.delete(cancelId);
      if (err) {
        callback(err);
      } else {
        if (params?.decodeType === 0) {
          this.request.arrayBuffer2Image(data, callback);
        } else if (params?.decodeType === 1) {
          this.request.arrayBuffer2unit8(data, callback);
        } else if (params?.decodeType === 2) {
          this.request.arrayBuffer2tiff(data, callback);
        } else if (params?.decodeType === 3) {
          this.request.parseExif(data, callback);
        }
      }
    });
    this.cancelMap.set(cancelId, cancel);
  }

  cancel(dispatcherId: string, params: any, callback: any) {
    const cancelId = params?.cancelId;
    const c = this.cancelMap.get(cancelId);
    if (c) {
      c();
      callback(null, true);
    } else {
      callback(new Error('无相关的可取消请求！'));
    }
  }
}

if (isWorker()) {
  (self as any).worker = new Worker(self as any);
}
