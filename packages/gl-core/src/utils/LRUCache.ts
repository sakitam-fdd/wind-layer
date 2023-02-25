/* eslint-disable no-param-reassign */

// eslint-disable-next-line max-classes-per-file
type Key = string | number;

class DoubleQueueNode<T> {
  key: Key;
  val: any;
  pre: DoubleQueueNode<T>;
  next: DoubleQueueNode<T>;
  constructor(key: Key, val: T) {
    this.key = key;
    this.val = val;
  }
}

export default class LRUCache<T> {
  private max: number; // 限制大小
  private map: Map<Key, DoubleQueueNode<T>>; // 数据和链表中节点的映射
  private head: DoubleQueueNode<T>; // 头结点
  private tail: DoubleQueueNode<T>; // 尾结点
  private onRemove: (element: T) => void;

  constructor(max, onRemove: (element: T) => void) {
    this.max = max;
    this.onRemove = onRemove;
    this.reset();
  }

  /**
   * 当前容量
   */
  get size() {
    return this.map.size;
  }

  public reset() {
    if (this.map) {
      const iterator = this.map.entries();
      for (let i = 0; i < this.map.size; i++) {
        const [, value] = iterator.next().value;
        this.onRemove(value.val);
      }
    }

    this.map = new Map();
    this.head = new DoubleQueueNode(0, 0);
    this.tail = new DoubleQueueNode(0, 0);
    this.head.next = this.tail;

    return this;
  }

  public clear() {
    this.reset();
    this.onRemove = () => undefined;
  }

  public has(key: Key) {
    const node: WithUndef<DoubleQueueNode<T>> = this.map.get(key);
    return node !== undefined;
  }

  public get(key: Key) {
    const node: WithUndef<DoubleQueueNode<T>> = this.map.get(key);
    if (node === undefined) {
      return null;
    }

    // 数据在链表中，则移至链表头部
    this.moveToHead(node);

    return node.val;
  }

  public getAndRemove(key: Key) {
    if (!this.has(key)) {
      return null;
    }
    return this.remove(key);
  }

  public add(key: Key, value: any) {
    let oldValue;
    const node: WithUndef<DoubleQueueNode<T>> = this.map.get(key);
    if (node === undefined) {
      // 淘汰数据
      this.eliminate();
      // 数据不在链表中，插入数据至头部
      const newNode: DoubleQueueNode<T> = new DoubleQueueNode(key, value);
      const temp: DoubleQueueNode<T> = this.head.next;
      this.head.next = newNode;
      newNode.next = temp;
      newNode.pre = this.head;
      temp.pre = newNode;
      this.map.set(key, newNode);
      oldValue = null;
    } else {
      // 数据在链表中，则移至链表头部
      this.moveToHead(node);
      oldValue = node.val;
      node.val = value;
    }
    return oldValue;
  }

  public remove(key: Key) {
    const deletedNode: WithUndef<DoubleQueueNode<T>> = this.map.get(key);
    if (deletedNode === undefined) {
      return null;
    }
    deletedNode.pre.next = deletedNode.next;
    deletedNode.next.pre = deletedNode.pre;
    this.onRemove(deletedNode.val);
    this.map.delete(key);
    return deletedNode.val;
  }

  /**
   * 设置最大缓存大小
   * @param max
   */
  public setMaxSize(max: number) {
    this.max = max;

    // 当前缓存的数量大于重新设置的最大缓存值时进行缓存淘汰
    while (this.size > this.max) {
      this.eliminate();
    }
  }

  // 将节点插入至头部节点
  private moveToHead(node: DoubleQueueNode<T>) {
    node.pre.next = node.next;
    node.next.pre = node.pre;
    const temp: DoubleQueueNode<T> = this.head.next;
    this.head.next = node;
    node.next = temp;
    node.pre = this.head;
    temp.pre = node;
  }

  /**
   * 如果超出缓存限制，那么移除未使用的数据
   * @private
   */
  private eliminate() {
    if (this.size < this.max) {
      return;
    }

    // 将链表中最后一个节点去除
    const last: DoubleQueueNode<T> = this.tail.pre;
    this.onRemove(last.val);
    this.map.delete(last.key);
    last.pre.next = this.tail;
    this.tail.pre = last.pre;
  }
}
