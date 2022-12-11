import workerFactory from './workerFactory';
import type { WorkerInterface } from './workerFactory';

export const PRELOAD_POOL_ID = '__wind_layer_preloaded_worker_pool__';

/**
 * 创建`webworker` 线程池
 */
export default class WorkerPool {
  static workerCount: number;

  active: {
    [_ in number | string]: boolean;
  };
  workers: WithNull<WorkerInterface[]>;

  constructor() {
    this.active = {};
  }

  /**
   * 获取 `Worker` 实例
   * @param id
   */
  acquire(id: number | string): WorkerInterface[] {
    if (!this.workers) {
      this.workers = [];
      for (let i = 0; i < WorkerPool.workerCount; i++) {
        const worker = workerFactory();
        if (worker) {
          this.workers.push(worker);
        }
      }
    }

    this.active[id] = true;
    return this.workers.slice();
  }

  /**
   * 释放所有 `Worker`
   * @param id
   */
  release(id: number | string) {
    delete this.active[id];
    if (this.numActive() === 0 && this.workers) {
      this.workers.forEach((w) => {
        w.terminate();
      });
      this.workers = null;
    }
  }

  isPreloaded(): boolean {
    return !!this.active[PRELOAD_POOL_ID];
  }

  /**
   * 获取激活的`Worker` 数量
   */
  numActive(): number {
    return Object.keys(this.active).length;
  }
}

const hardwareConcurrency =
  (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 4;
const availableLogicalProcessors = Math.floor(hardwareConcurrency / 2);
WorkerPool.workerCount = Math.max(Math.min(availableLogicalProcessors, 6), 1);
