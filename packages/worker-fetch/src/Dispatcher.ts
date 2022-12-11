import Actor from './Actor';
import type WorkerPool from './WorkerPool';
import { nullFunction, asyncAll, uid } from './util';

class Dispatcher {
  workerPool: WorkerPool;
  actors: Array<Actor>;
  currentActor: number;
  id: string;
  dispatcherId: number;

  constructor(workerPool: WorkerPool, parent: any, dispatcherId: number) {
    this.workerPool = workerPool;
    this.actors = [];
    this.currentActor = 0;
    this.id = uid('dispatcher');
    this.dispatcherId = dispatcherId;
    const workers = this.workerPool.acquire(this.dispatcherId);
    for (let i = 0; i < workers.length; i++) {
      const worker = workers[i];
      const actor = new Actor(worker, parent, this.dispatcherId);
      actor.name = `Worker ${i}`;
      this.actors.push(actor);
    }
    if (!this.actors.length) throw new Error('No actors found');
  }

  /**
   * 广播到所有 Actor
   * @param type
   * @param data
   * @param cb
   */
  broadcast(type: string, data: unknown, cb?: (...args: any[]) => any) {
    // eslint-disable-next-line no-param-reassign
    cb = cb || nullFunction;
    asyncAll(
      this.actors,
      (actor, done) => {
        actor.send(type, data, done);
      },
      cb,
    );
  }

  send(type, data: any, cb?: any, id?: string) {
    const actor = this.getActor(id);
    if (actor) {
      actor.send(type, data, cb);
    }
  }

  /**
   * 获取要发送消息的 `Actor`
   * TIP: 是否需要实现 `Actor` 是否占用判断
   */
  getActor(id?: string): Actor {
    if (id !== undefined) {
      const index = this.actors.findIndex((a) => a.id === id);
      if (index > -1) {
        this.currentActor = index;
      } else {
        this.currentActor = (this.currentActor + 1) % this.actors.length;
      }
    } else {
      this.currentActor = (this.currentActor + 1) % this.actors.length;
    }
    return this.actors[this.currentActor];
  }

  remove(removed = true) {
    this.actors.forEach((actor) => {
      actor.remove();
    });
    this.actors = [];
    if (removed) this.workerPool.release(this.id);
  }
}

export default Dispatcher;
