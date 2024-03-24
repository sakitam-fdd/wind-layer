import { EventEmitter, utils } from '@sakitam-gis/vis-engine';
import getTrackManger from './TrackManger';

export enum State {
  /**
   * 播放器初始状态
   */
  initial = 0,

  /**
   * 播放状态
   */
  playing = 1,

  /**
   * 暂停状态
   */
  paused = 2,

  /**
   * 停止状态
   */
  stopped = 3,
}

export interface TrackOptions {
  /**
   * 过渡时间
   */
  duration?: number; // s

  /**
   * 延迟时间
   */
  delay?: number; // s

  /**
   * 播放完成后是否延迟
   */
  endDelay?: number; // s

  /**
   * 是否轮播
   */
  repeat?: boolean;

  /**
   * 是否默认启动播放
   */
  autoplay?: boolean;

  /**
   * 回调
   * @param position
   */
  track?: (position: number) => void;
}

export const defaultTrackOptions = {
  duration: 1000,
  autoplay: true,
  repeat: true,
  delay: 0,
  endDelay: 0,
  track: (p: number) => undefined, // eslint-disable-line
};

const trackManger = getTrackManger();

export default class Track extends EventEmitter {
  #playing = false;
  #state = State.initial;
  #elapsedTime = -1;
  #lastTime = -1;
  #options: Required<TrackOptions>;

  constructor(options: TrackOptions) {
    super();
    this.#options = {
      ...defaultTrackOptions,
      ...options,
    };

    if (this.#options.autoplay) {
      this.play();
    }
  }

  /**
   * 获取当前 Track 的状态
   */
  get state() {
    return this.#state;
  }

  /**
   * 获取总的过渡时间
   */
  get totalDuration() {
    return this.#options.delay + this.#options.duration + this.#options.endDelay;
  }

  get elapsedTime() {
    return this.#elapsedTime;
  }

  get totalPosition() {
    return Math.max(0, Math.min(1, this.#elapsedTime / this.totalDuration));
  }

  /**
   * 是否在播放
   */
  get isPlaying() {
    return this.#state === State.playing;
  }

  /**
   * 是否暂停
   */
  get isPaused() {
    return this.#state === State.paused;
  }

  /**
   * 是否处于激活状态
   */
  get isActive() {
    return this.isPlaying || this.isPaused;
  }

  /**
   * 获取当前 Track 的 cursor 位置
   */
  get position() {
    if (this.#elapsedTime < this.#options.delay) {
      return 0;
    }

    if (this.#elapsedTime >= this.#options.delay + this.#options.duration) {
      return 1;
    }

    return Math.max(0, Math.min(1, (this.#elapsedTime - this.#options.delay) / this.#options.duration));
  }

  /**
   * 开始播放
   */
  play() {
    this.#playing = true;
    this.#state = State.playing;
    this.advance(0);
    trackManger.add(this);
  }

  /**
   * 暂停
   */
  pause() {
    if (this.#state === State.playing) {
      this.#state = State.paused;
    }
  }

  /**
   * 继续播放
   */
  resume() {
    if (this.#state === State.paused) {
      this.#state = State.playing;
    }
  }

  /**
   * 停止
   */
  stop() {
    this.#playing = false;
    this.#state = State.stopped;
    // this.advance(0);
    trackManger.remove(this);
  }

  /**
   * 重新开始
   */
  restart() {
    this.#elapsedTime = 0;
    trackManger.add(this);
  }

  /**
   * 重置
   */
  reset() {
    if (this.#state === State.playing) {
      this.stop();
    } else {
      this.advance(0);
    }
  }

  /**
   * 在播放和暂停状态切换
   */
  toggle() {
    if (this.#playing) {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.resume();
      }
    }
  }

  /**
   * 步进
   * @param position
   * @param e
   */
  advance(position, e = true) {
    const p = utils.clamp(position, 0, 1);
    this.#elapsedTime = e ? this.totalDuration * p : this.#options.delay + this.#options.duration * p;
    this.#options?.track?.(this.position);
    this.emit('track', {
      position: this.position,
    });
  }

  tick(time) {
    if (this.#lastTime < 0) {
      this.#lastTime = time;
    }
    const lastTime = this.#lastTime;
    this.#lastTime = time;
    if (this.#state !== State.playing) return;
    const delta = time - lastTime;
    this.#elapsedTime += delta;
    this.#elapsedTime = Math.min(this.#elapsedTime, this.totalDuration);
    if (this.totalPosition === 1) {
      this.advance(this.totalPosition);
      this.#options.repeat ? this.restart() : this.stop();
    } else {
      this.advance(this.totalPosition);
    }
  }
}
