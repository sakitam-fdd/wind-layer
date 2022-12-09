type IServer = {
  [key: string]: number;
};

export interface IOptions {
  debug: boolean;
  throttleRequests: boolean;
  maxRequests: number;
  maxRequestsPerServer: number;
  requestsByServer: IServer;
}

type DoneFunction = () => any;
type ResolveFunction = {
  done: DoneFunction;
} | null;

type IHandle = any;

export interface IRequest {
  handle: IHandle;
  resolve?: (cb: ResolveFunction) => void;
  priority?: number;
  getPriority?: (handle: IHandle) => number;
}

const defaultOptions = {
  debug: false,
  throttleRequests: true, // 指定是否手动限制请求，如设置为 false 则使用浏览器的请求队列限制
  maxRequests: 6,
  maxRequestsPerServer: 6,
  requestsByServer: {},
};

function sortRequests(a: IRequest, b: IRequest) {
  if (a.priority !== undefined && b.priority !== undefined) {
    return a.priority - b.priority;
  }

  return 1;
}

/**
 * 一个简单得问请求队列维护
 */
class RequestScheduler {
  public activeRequestCount: number;
  private options: IOptions;
  private requestMap: Map<any, any>;
  private readonly requestQueue: any[];
  private deferredUpdate: number | null;

  constructor(props?: Partial<IOptions>) {
    this.options = {
      ...defaultOptions,
      ...props,
    };

    this.requestQueue = [];
    this.activeRequestCount = 0;
    this.requestMap = new Map();

    this.deferredUpdate = null;
  }

  issueRequest(request: IRequest) {
    const {handle, resolve} = request;
    let isDone = false;

    const done = () => {
      // can only be called once
      if (!isDone) {
        isDone = true;

        // Stop tracking a request - it has completed, failed, cancelled etc
        this.requestMap.delete(handle);
        this.activeRequestCount--;
        // A slot just freed up, see if any queued requests are waiting
        this.issueNewRequests();
      }
    };

    // Track this request
    this.activeRequestCount++;

    return resolve ? resolve({
      done
    }) : Promise.resolve({
      done
    });
  }

  issueNewRequests() {
    if (!this.deferredUpdate) {
      // @ts-ignore
      this.deferredUpdate = setTimeout(() => this.issueNewRequestsAsync(), 0);
    }
  }

  issueNewRequestsAsync() {
    this.deferredUpdate = null;

    const freeSlots = Math.max(this.options.maxRequests - this.activeRequestCount, 0);

    if (freeSlots === 0) {
      return;
    }

    this.updateAllRequests();

    // Resolve pending promises for the top-priority requests
    for (let i = 0; i < freeSlots; ++i) {
      if (this.requestQueue.length > 0) {
        const request = this.requestQueue.shift();
        this.issueRequest(request);
      }
    }
  }

  updateAllRequests() {
    const requestQueue = this.requestQueue;
    for (let i = 0; i < requestQueue.length; ++i) {
      const request = requestQueue[i];
      if (!this.updateRequest(request)) {
        // Remove the element and make sure to adjust the counter to account for shortened array
        requestQueue.splice(i, 1);
        this.requestMap.delete(request.handle);
        i--;
      }
    }

    // Sort the remaining requests based on priority
    requestQueue.sort(sortRequests);
  }

  updateRequest(request: IRequest) {
    if (request.getPriority && request.handle) {
      request.priority = request.getPriority(request.handle);
    }

    // by returning a negative priority, the callback cancels the request
    if (request.priority !== undefined && request.priority < 0 && request.resolve) {
      request.resolve(null);
      return false;
    }
    return true;
  }

  scheduleRequest(handle: IHandle, getPriority = () => 0) {
    // Allows throttling to be disabled
    if (!this.options.throttleRequests) {
      return Promise.resolve({done: () => {}});
    }

    // dedupe
    if (this.requestMap.has(handle)) {
      return this.requestMap.get(handle);
    }

    const request: IRequest = {
      handle,
      getPriority,
    };
    const promise = new Promise(resolve => {
      request.resolve = resolve;
      return request;
    });

    this.requestQueue.push(request);
    this.requestMap.set(handle, promise);
    this.issueNewRequests();
    return promise;
  }
}

export default RequestScheduler;
