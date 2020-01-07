import { isString, isNumber, isFunction } from './utils';
import Field from './Field';

const defaultOptions = {
  globalAlpha: 0.9, // 全局透明度
  lineWidth: 1, // 线条宽度
  colorScale: '#fff',
  velocityScale: 1 / 5000,
  particleAge: 90, // 粒子在重新生成之前绘制的最大帧数
  maxAge: 90, // alias for particleAge
  particleMultiplier: 1 / 300, // TODO: PATHS = Math.round(width * height * particleMultiplier);
  paths: 800,
  frameRate: 16,
};

export interface IOptions {
  globalAlpha: number; // 全局透明度
  lineWidth: number | ((v: any) => number); // 线条宽度
  colorScale: string[] | ((v: any) => number) | string;
  velocityScale: number | (() => number);
  particleAge?: number; // 粒子在重新生成之前绘制的最大帧数
  maxAge: number; // alias for particleAge
  particleMultiplier?: number; // TODO: PATHS = Math.round(width * height * that.particleMultiplier);
  paths: number;
  frameRate: number;
}

class BaseLayer {
  private ctx: CanvasRenderingContext2D;
  private options: IOptions;
  private field: Field;
  private particles: any;

  static Field = Field;
  private animationLoop: number;
  private _then: number;
  private starting: boolean;

  constructor(ctx: CanvasRenderingContext2D, options: Partial<IOptions>, field?: Field) {
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

    this.animate = this.animate.bind(this);

    if (field) {
      this.updateData(field);
    }
  }

  public updateData(field: Field) {
    this.field = field;
  }

  private moveParticles(particles: any) {
    // 清空组
    const maxAge = this.options.maxAge;
    const optVelocityScale = isFunction(this.options.velocityScale)
      // @ts-ignore
      ? this.options.velocityScale()
      : this.options.velocityScale;
    const velocityScale = optVelocityScale;

    let i = 0;
    let len = particles.length;
    for (; i < len; i++) {
      const particle = particles[i];

      if (particle.age > maxAge || particle.m * Math.random() * 10 < 0.0001) {
        // restart, on a random x,y
        particle.age = 0;

        this.field.randomize(particle);
      }

      const x = particle.x;
      const y = particle.y;

      const vector = this.field.valueAt(x, y);

      if (vector === null) {
        particle.age = maxAge;
      } else {
        const xt = x + vector.u * velocityScale;
        const yt = y + vector.v * velocityScale;

        if (this.field.hasValueAt(xt, yt)) {
          // Path from (x,y) to (xt,yt) is visible, so add this particle to the appropriate draw bucket.
          particle.xt = xt;
          particle.yt = yt;
          particle.m = vector.magnitude();
        } else {
          // Particle isn't visible, but it still moves through the field.
          // particle.x = xt;
          // particle.y = yt;
          particle.age = maxAge;
        }
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
    // TODO 需要判断粒子是否超出视野
    // this.ctx.strokeStyle = color;
    const source = [particle.x, particle.y];
    // when xt isn't exit
    const target = [particle.xt || source[0], particle.yt || source[1]];

    const pointPrev = this.project(source);
    const pointNext = this.project(target);
    this.ctx.beginPath();
    this.ctx.moveTo(pointPrev[0], pointPrev[1]);
    this.ctx.lineTo(pointNext[0], pointNext[1]);
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

  private prepareParticlePaths() { // 由用户自行处理，不再自动修改粒子数
    // var particleCount = Math.round(bounds.width * bounds.height * that.PARTICLE_MULTIPLIER);
    // if (isMobile()) {
    //   particleCount *= that.PARTICLE_REDUCTION;
    // }
    // var particles = [];
    // for (var i = 0; i < particleCount; i++) {
    //   particles.push(field.randomize({age: Math.floor(Math.random() * that.MAX_PARTICLE_AGE) + 0}));
    // }
    const particleCount = this.options.paths;
    const particles = [];
    if (!this.field) return [];
    let i = 0;
    for (; i < particleCount; i++) {
      let p = this.field.randomize();
      p.age = this.randomize();
      particles.push(p);
    }
    return particles;
  }

  private randomize() {
    return Math.floor(Math.random() * this.options.maxAge); // 例如最大生成90帧插值粒子路径
  }

  // @ts-ignore
  project(...args: any[]): [number, number] {}

  animate() {
    this.animationLoop = requestAnimationFrame(this.animate);
    const now = Date.now();
    const delta = now - this._then;
    if (delta > this.options.frameRate) {
      this._then = now - (delta % this.options.frameRate);
      this.render();
    }
  }

  /**
   * 渲染前处理
   */
  prerender() {
    this.particles = this.prepareParticlePaths();
  }

  /**
   * 开始渲染
   */
  render() {
    if (!this.starting) {
      this.starting = true;
      this._then = Date.now();
      this.animate();
    }
    this.moveParticles(this.particles);
    this.drawParticles(this.particles);
  }

  /**
   * 渲染后
   */
  postrender() {

  }
}

export default BaseLayer;
