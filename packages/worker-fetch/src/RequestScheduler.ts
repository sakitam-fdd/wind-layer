type Request = Promise<any> & {
  cancel: () => void;
};

interface IScheduleRequest {
  ref: () => Request;
  cancelled: boolean;
  completed: boolean;
  request: WithNull<Request>;
  cancel: () => void;
}

interface RequestSchedulerOptions {
  maxRequests: number;
}

const defaultOptions: RequestSchedulerOptions = {
  maxRequests: 6,
};

export default class RequestScheduler {
  public options: RequestSchedulerOptions;
  public requestQueue: IScheduleRequest[];
  public executing: Set<IScheduleRequest>;

  constructor(options: Partial<RequestSchedulerOptions>) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
    this.requestQueue = [];
    this.executing = new Set();
  }

  remove(p) {
    this.executing.delete(p);
    if (!p.cancelled) {
      p.completed = true;
      this.enqueue();
    }
  }

  enqueue() {
    for (
      let numImageRequests = this.executing.size;
      numImageRequests < this.options.maxRequests && this.requestQueue.length > 0;
      numImageRequests++
    ) {
      const q = this.requestQueue.shift() as IScheduleRequest;
      if (q.cancelled) {
        this.remove(q);
        continue;
      }

      const p = Promise.resolve().then(() => {
        const request = q.ref();
        q.request = request;
        return request;
      });
      this.executing.add(q);
      p.then(() => {
        this.remove(q);
      }).catch(() => {
        this.remove(q);
      });
    }
  }

  scheduleRequest(fn) {
    const request: IScheduleRequest = {
      ref: fn,
      cancelled: false,
      completed: false,
      request: null,
      cancel: () => {
        if (!request.completed && !request.cancelled) {
          request.cancelled = true;

          if (request.request) {
            request.request.cancel();
          }
          this.enqueue();
        }
      },
    };

    this.requestQueue.push(request);

    this.enqueue();

    return request;
  }
}
