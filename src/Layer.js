import './polyfill/assign';
import './polyfill/requestAnimFrame';
import { isMobile, createCanvas } from './helper';

const _options = {
  fieldFactor: 0.8,
  minIntensity: 261.15, // step size of particle intensity color scale
  maxIntensity: 317.15, // wind velocity at which particle intensity is maximum (m/s)
  maxParticleAge: 100,
  particleCountFactor: 0.05,
  lineWidth: 1.2,
  opacity: 1.0,
  colors: ['#000', '#300', '#600', '#900', '#c00', '#f00'],
  frameRate: 15
};

const NULL_WIND_VECTOR = [NaN, NaN, null];

class Layer {
  constructor (data, options = {}) {

    /**
     * options
     * @type {*}
     * @private
     */
    this._options = Object.assign({}, _options, options);

    /**
     * canvas
     * @type {null}
     * @private
     */
    this._canvas = null;

    /**
     * layer is playing
     * @type {boolean}
     * @private
     */
    this._playing = false;

    /**
     * current animate
     * @type {null}
     * @private
     */
    this._animationLoop = null;

    /**
     * 粒子数组
     * @type {null}
     * @private
     */
    this._particles = null;

    /**
     * grid
     * @type {Array}
     * @private
     */
    this._grid = [];

    /**
     * buckets
     * @type {Array}
     */
    this.buckets = [];
  }

  /**
   * start animate
   * @returns {Layer}
   */
  start () {
    const that = this;
    let then = Date.now();
    that._playing = true;
    (function frame () {
      that._animationLoop = window.requestAnimFrame(frame);
      const now = Date.now();
      const delta = now - then;
      if (delta > 1000 / that._options.frameRate) {
        then = now - (delta % 1000 / that._options.frameRate);
        that._evolve();
        that._draw();
      }
    })();
    return this;
  }

  /**
   * stop animate
   * @returns {Layer}
   */
  stop () {
    this._playing = true;
    if (this._animationLoop) window.cancelAnimFrame(this._animationLoop);
    return this;
  }

  /**
   * evolve
   * @private
   */
  _evolve () {
    const particles = this._particles;
    if (!particles) return;
    this.buckets.forEach(function (bucket) { bucket.length = 0; });
    const fieldScale = this._options.fieldFactor / this._options.fieldMaxIntensity;
    for (let i = 0; i < particles.length; i++) {
      if (particles[i].age > this._options.maxParticleAge) {
        particles[i] = this._getParticle(0);
      }
      let [x, y] = [particles[i].x, particles[i].y];
      let v = this._getField(x, y);
      if (!v[2]) {
        particles[i] = this._getParticle(0);
      } else if (this._getField(x, y)[0] !== null) {
        particles[i].xt = x + v[0] * fieldScale;
        particles[i].yt = y + v[1] * fieldScale;
        this.buckets[this._colorIndex(v[2])].push(particles[i]);
      } else {
        particles[i].x = x + v[0] * fieldScale;
        particles[i].y = y + v[1] * fieldScale;
      }
      particles[i].age++;
    }
  }

  /**
   * get particle
   * @param age
   */
  _getParticle (age) {
    return {
      x: Math.round(Math.random() * this._gridColCount),
      y: Math.round(Math.random() * this._gridRowCount),
      age: age === undefined ? Math.floor(Math.random() * this._options.maxParticleAge) : age
    }
  }

  /**
   * get field
   * @param x
   * @param y
   * @returns {*}
   * @private
   */
  _getField (x, y) {
    if (!this._grid) return NULL_WIND_VECTOR;
    const rows = this._grid[Math.round(y)];
    /* eslint-disable-next-line */
    return (rows && rows[Math.round(x)] || NULL_WIND_VECTOR);
  }

  /**
   * get color index
   * @param m
   * @returns {number}
   * @private
   */
  _colorIndex (m) {
    const _colors = this._options.colors;
    return Math.max(0, Math.min((_colors.length - 1),
      Math.round((m - this._options.minIntensity) / (this._options.maxIntensity - this._options.minIntensity) * (_colors.length - 1))));
  }

  /**
   * get interpolate
   * @param x
   * @param y
   * @param extent
   * @returns {*[]}
   */
  interpolate (x, y, extent) {
    if (!this._grid) return NULL_WIND_VECTOR;
    const searches = this.data;
    let [Σux, Σvx, Σweight] = [0, 0, 0];
    var dx, dy, dd, weight;
    var dataPoint, u, v;
    for (let i = 0, iLen = Math.min(this._options.interpolateCount, searches.length); i < iLen; i++) {
      dataPoint = searches[i];
      dx = dataPoint.x - x;
      dy = dataPoint.y - y;
      if (dx === 0 && dy === 0) {
        u = dataPoint.u;
        v = dataPoint.v;
        return [u, v, Math.sqrt(u * u + v * v)];
      }
      dd = dx * dx + dy * dy;
      weight = Math.sqrt(1 / dd);
      Σux += dataPoint.u * weight;
      Σvx += dataPoint.v * weight;
      Σweight += weight;
    }
    if (Σweight > 0) {
      u = Σux / Σweight;
      v = Σvx / Σweight;
      return [u, v, Math.sqrt(u * u + v * v)];
    }
    return NULL_WIND_VECTOR;
  }

  /**
   * get context
   * @returns {*}
   */
  getContext () {
    return this._canvas && this._canvas.getContext('2d');
  }

  /**
   * clear context
   * @private
   */
  _clearContext () {
    const context = this.getContext();
    context.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }
}

export default Layer
