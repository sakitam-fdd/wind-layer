import EventEmit from 'eventemitter3';
import isString from 'lodash/isString';

class BaseLayer extends EventEmit {
  private ctx: CanvasRenderingContext2D;
  private options: {
    globalAlpha?: number; // 全局透明度
    lineWidth?: number; // 线条宽度
    colorScale?: string[] | ((v: any) => number) | string;
    paths?: number;
  };

  constructor() {
    super();

    this.ctx;

    this.options = {};
  }

  private moveParticles() {
    // 清空组
    // buckets.forEach(function (bucket) {
    //   bucket.length = 0;
    // });
    particles.forEach(function (particle) {
      if (particle.age > that.MAX_PARTICLE_AGE) {
        field.randomize(particle).age = 0;
      }
      var x = particle.x;
      var y = particle.y;
      var v = field(x, y);  // vector at current position
      var m = v[2];
      if (m === null) {
        particle.age = that.MAX_PARTICLE_AGE;  // particle has escaped the grid, never to return...
      }
      else {
        var xt = x + v[0];
        var yt = y + v[1];
        if (field(xt, yt)[2] !== null) {
          // Path from (x,y) to (xt,yt) is visible, so add this particle to the appropriate draw bucket.
          particle.xt = xt;
          particle.yt = yt;
          buckets[colorStyles.indexFor(m)].push(particle);
        } else {
          // Particle isn't visible, but it still moves through the field.
          particle.x = xt;
          particle.y = yt;
        }
      }
      particle.age += 1;
    });
  }

  private drawParticles(paths: any) {
    const prev = this.ctx.globalCompositeOperation; // lighter
    this.ctx.globalCompositeOperation = 'destination-in';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.globalCompositeOperation = prev;
    // this.ctx.globalAlpha = 0.9;

    // fading paths...
    this.ctx.fillStyle = `rgba(0, 0, 0, ${this.options.globalAlpha})`;
    this.ctx.lineWidth = this.options.lineWidth as number;
    // New paths
    let i = 0;
    let len = paths.length;
    for (; i < len; i++) {
      let color = '#fff';
      if (isString(this.options.colorScale)) {
        color = this.options.colorScale;
      } else if (isArray(this.options.colorScale)) {
        color = this.options[i] || '#fff';
      } else if (isFunction(this.options.colorScale)) {
        color = this.options.colorScale(paths[i], i);
      }
      this.drawParticle(paths[i], color);
    }
  }

  private drawParticle(particle: any, color: string) {
    let i = 0;
    let len = particle.length;

    this.ctx.beginPath();
    this.ctx.strokeStyle = color;

    for (; i < len; i++) {
      this.ctx.moveTo(particle.x, particle.y);
      this.ctx.lineTo(particle.xt, particle.yt);
      particle.x = particle.xt;
      particle.y = particle.yt;
    }

    this.ctx.stroke();
  }

  private prepareParticlePaths() {
    const paths = [];
    for (var i = 0; i < this.options.paths; i++) {
      let p = this._field.randomPosition();
      p.age = this._randomAge();
      paths.push(p);
    }
    return paths;
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
