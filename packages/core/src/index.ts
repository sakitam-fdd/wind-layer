import { EventEmitter } from 'eventemitter3';
import { isString, isNumber, isFunction } from './utils';
import Field from "./Field";

const defaultOptions = {
  globalAlpha: 0.9, // 全局透明度
  lineWidth: 1, // 线条宽度
  colorScale: [
    "rgb(36,104, 180)",
    "rgb(60,157, 194)",
    "rgb(128,205,193 )",
    "rgb(151,218,168 )",
    "rgb(198,231,181)",
    "rgb(238,247,217)",
    "rgb(255,238,159)",
    "rgb(252,217,125)",
    "rgb(255,182,100)",
    "rgb(252,150,75)",
    "rgb(250,112,52)",
    "rgb(245,64,32)",
    "rgb(237,45,28)",
    "rgb(220,24,32)",
    "rgb(180,0,35)"
  ],
  particleAge: 90, // 粒子在重新生成之前绘制的最大帧数
  maxAge: 90, // alias for particleAge
  particleMultiplier: 1 / 300, // TODO: PATHS = Math.round(width * height * particleMultiplier);
  paths: 200,
};

export interface IOptions {
  globalAlpha: number; // 全局透明度
  lineWidth: number | ((v: any) => number); // 线条宽度
  colorScale: string[] | ((v: any) => number) | string;
  particleAge?: number; // 粒子在重新生成之前绘制的最大帧数
  maxAge: number; // alias for particleAge
  particleMultiplier?: number; // TODO: PATHS = Math.round(width * height * that.particleMultiplier);
  paths: number;
}

class BaseLayer extends EventEmitter {
  private ctx: CanvasRenderingContext2D;
  private options: IOptions;

  constructor(ctx: CanvasRenderingContext2D, options: Partial<IOptions>) {
    super();

    this.ctx = ctx;

    if (!this.ctx) {
      throw new Error('ctx error');
    }

    const { width, height } = this.ctx.canvas;

    this.options = Object.assign({}, defaultOptions, options);
    if (('particleAge' in options) && !('maxAge' in options) && isNumber(this.options.particleAge)) {
      // @ts-ignore
      this.options.maxAge = this.options.particleAge;
    }

    if (('particleMultiplier' in options) && !('paths' in options) && isNumber(this.options.particleMultiplier)) {
      // @ts-ignore
      this.options.paths = Math.round(width * height * this.options.particleMultiplier);
    }
  }

  private moveParticles(particles: any) {
    // 清空组
    const maxAge = this.options.maxAge;
    // buckets.forEach(function (bucket) {
    //   bucket.length = 0;
    // });
    let i = 0;
    let len = particles.length;
    for (; i < len; i++) {
      const particle = particles[i];

      if (particle.age > maxAge || particle.m * Math.random() * 10 < 0.0001) {
        // restart, on a random x,y
        particle.age = 0;
      }

      const x = particle.x;
      const y = particle.y;

      const vector = new Field(x, y);

      if (vector[2] === null) {
        particle.age = maxAge;
      } else {
        const xt = x + vector[0];
        const yt = y + vector[1];

        if (this._field.hasValueAt(xt, yt)) {
          // Path from (x,y) to (xt,yt) is visible, so add this particle to the appropriate draw bucket.
          particle.xt = xt;
          particle.yt = yt;
        } else {
          // Particle isn't visible, but it still moves through the field.
          particle.x = xt;
          particle.y = yt;
        }
        particle.age = maxAge;
      }

      particle.age += 1;
    }
  }

  private drawParticles(particles: any) {
    const prev = this.ctx.globalCompositeOperation; // lighter
    this.ctx.globalCompositeOperation = 'destination-in';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.globalCompositeOperation = prev;
    // this.ctx.globalAlpha = 0.9;

    this.ctx.fillStyle = `rgba(0, 0, 0, ${this.options.globalAlpha})`;
    this.ctx.lineWidth = this.options.lineWidth as number;
    this.ctx.strokeStyle = (isString(this.options.colorScale) ? this.options.colorScale : '#fff') as string;

    let i = 0;
    let len = particles.length;
    for (; i < len; i++) {
      this.drawParticle(particles[i]);
    }
  }

  private drawParticle(particle: any) {
    this.ctx.beginPath();
    // this.ctx.strokeStyle = color;

    this.ctx.moveTo(particle.x, particle.y);
    this.ctx.lineTo(particle.xt, particle.yt);
    particle.x = particle.xt;
    particle.y = particle.yt;

    if (isFunction(this.options.colorScale)) {
      // @ts-ignore
      this.ctx.strokeStyle = this.options.colorScale(particle.m);
    }

    if (isFunction(this.options.lineWidth)) {
      // @ts-ignore
      this.ctx.lineWidth = this.options.lineWidth(particle.m);
    }

    this.ctx.stroke();
  }

  private prepareParticlePaths() {
    const particles = [];
    let i = 0;
    for (; i < this.options.paths; i++) {
      let p = this._field.randomize();
      p.age = this.randomize();
      particles.push(p);
    }
    return particles;
  }

  private randomize() {
    return Math.floor(Math.random() * this.options.maxAge)
  }

  /**
   * 渲染前处理
   */
  prerender() {

  }

  /**
   * 开始渲染
   */
  render() {

  }

  /**
   * 渲染后
   */
  postrender() {

  }
}

export default BaseLayer;
