export type TaskID = number;

type Task = {
  callback: (timeStamp: number) => void;
  id: TaskID;
  cancelled: boolean;
};

/**
 * 这是一个简易的任务队列
 */
export default class Queue {
  private id: TaskID;
  private queue: Task[];
  private cleared: boolean;
  private currentlyRunning: Task[] | boolean;

  constructor() {
    this.queue = [];
    this.id = 0;
    this.cleared = false;
    this.currentlyRunning = false;
  }

  /**
   * add queue
   * 向队列添加一个任务，返回此任务 id
   * @param callback
   * @return TaskID
   */
  add(callback: (timeStamp: number) => void): TaskID {
    const id = ++this.id;
    this.queue.push({
      callback,
      id,
      cancelled: false,
    });
    return id;
  }

  /**
   * remove task by task id
   * @param id
   */
  remove(id: TaskID) {
    const running = this.currentlyRunning;
    const queue = running ? this.queue.concat(running as Task[]) : this.queue;
    for (const task of queue) {
      if (task.id === id) {
        task.cancelled = true;
        return;
      }
    }
  }

  /**
   * run task<执行未取消的任务队列>
   * @param timeStamp
   */
  run(timeStamp = 0) {
    console.assert(!this.currentlyRunning);
    this.currentlyRunning = this.queue;

    // Tasks queued by callbacks in the current queue should be executed
    // on the next run, not the current run.
    this.queue = [];

    for (const task of this.currentlyRunning) {
      if (task.cancelled) continue;
      task.callback(timeStamp);
      if (this.cleared) break;
    }

    this.cleared = false;
    this.currentlyRunning = false;
  }

  /**
   * clear task queue<清空任务队列>
   */
  clear() {
    if (this.currentlyRunning) {
      this.cleared = true;
    }
    this.queue = [];
  }
}
