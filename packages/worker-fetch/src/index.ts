import WorkerPool, { PRELOAD_POOL_ID } from './WorkerPool';
import Dispatcher from './Dispatcher';
import Actor from './Actor';
import request from './Request';
import RequestScheduler from './RequestScheduler';
import ThrottledInvoker from './ThrottledInvoker';
import { getReferrer } from './util';
import { setWorkerUrl } from './config';
import { register } from './webWorkerTransfer';
import * as utils from './util';

let globalWorkerPool;

function getGlobalWorkerPool() {
  if (!globalWorkerPool) {
    globalWorkerPool = new WorkerPool();
  }
  return globalWorkerPool;
}

function prewarm() {
  const workerPool = getGlobalWorkerPool();
  workerPool.acquire(PRELOAD_POOL_ID);
}

const exported = {
  utils,
  request,
  register,
  prewarm,
  getReferrer,
  setWorkerUrl,
  getGlobalWorkerPool,
  Actor,
  WorkerPool,
  Dispatcher,
  RequestScheduler,
  ThrottledInvoker,
};

export default exported;
