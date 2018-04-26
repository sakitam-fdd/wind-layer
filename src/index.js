import './polyfill/assign';
import './polyfill/requestAnimFrame';
import ol from 'openlayers';
import rbush from 'rbush';
import { isMobile, createCanvas } from './helper';

const _options = {
  gridPixels: 4, // 用于插值的网格像素边长
  gridMaxDivs: 200, // 最大网格边划分数量
  gridReduceFactor: 2, // 在移动设备上适当减少网格数量的比例
  fieldFactor: 0.8,
  fieldMaxIntensity: 50, // 可视化时限制的流体场最大强度，比如风速最大值
  maxParticleAge: 100,
  particleCountFactor: 0.05,
  lineWidth: 1.2,
  opacity: 1.0,
  colors: ['#fff', '#fff', '#fff', '#fff', '#fff'],
  searchSteps: 3, // 插值检索的尝试次数
  interpolateCount: 4, // 插值使用的数据数量
  frameRate: 15
};

const NULL_WIND_VECTOR = [NaN, NaN, null];

class WindyLayer extends ol.layer.Image {
  constructor (data, options = {}) {
    super(options);

    this._options = Object.assign({}, _options, options);

    /**
     * 矢量图层
     * @type {null}
     */
    this._canvas = null;

    /**
     * columns
     * @type {Array}
     * @private
     */
    this._grid = [];
    this._dirty = true;

    /**
     * color
     * @type {Array}
     * @private
     */
    this._batches = [];

    /**
     * is playing
     * @type {boolean}
     * @private
     */
    this._playing = false;

    /**
     * btree
     * @type {rbush|Object}
     * @private
     */
    this._tree = rbush();

    /**
     * windy 数据
     */
    this.data = [];
    if (data) {
      this.setData(data)
    }

    /**
     * animate
     * @type {null}
     * @private
     */
    this._animationLoop = null;

    this.setSource(new ol.source.ImageCanvas({
      logo: options.logo,
      state: options.state,
      attributions: options.attributions,
      resolutions: options.resolutions,
      canvasFunction: this.canvasFunction.bind(this),
      projection: (options.hasOwnProperty('projection') ? options.projection : 'EPSG:3857'),
      ratio: (options.hasOwnProperty('ratio') ? options.ratio : 1)
    }));
    this.on('precompose', this.redraw, this);
  }

  /**
   * get layer data
   * @returns {*}
   */
  getData () {
    return this.data;
  }

  /**
   * set layer data
   * @param data
   * @returns {WindyLayer}
   */
  setData (data) {
    const _map = this.getMap();
    if (!_map) return this;
    let [us, vs] = [data[0], data[1]];
    let [cols, rows] = [us.header.nx, us.header.ny];
    for (let j = 0; j < rows; j++) {
      const lat = 90 - 180 * j / rows;
      if (Math.abs(lat) > 85.1) {
        continue;
      }
      for (let i = 0; i < cols; i++) {
        const lon = -180 + 360 * i / cols;
        const point = ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
        const idx = cols * j + i;
        const u = us.data[idx];
        const v = vs.data[idx];
        this.addDataPoint(point[0], point[1], u, v);
      }
    }
    return this
  }

  /**
   * add point
   * @param x
   * @param y
   * @param uid
   * @param value
   * @param feature
   */
  addDataPoint (x, y, uid, value, feature) {
    uid = uid || 0;
    value = value || 0;
    this._tree.insert({
      minX: x,
      minY: y,
      maxX: x,
      maxY: y,
      x: x,
      y: y,
      u: uid,
      v: value
    })
  }

  /**
   * render windy layer
   * @returns {WindyLayer}
   */
  render (canvas) {
    const extent = this._getExtent();
    if (!this.getData() || !extent) return this;
    if (!this.getData()) return this;
    if (canvas && !this._playing) {
      this.start();
    } else if (canvas && this._playing) {
      this.update();
    }
    return this
  }

  /**
   * re-draw
   */
  redraw () {
    if (!this._playing) return;
    const _extent = this._options.extent || this._getExtent();
    this.setExtent(_extent)
  }

  /**
   * build grid
   */
  buildGrid () {
    const map = this.getMap();
    if (!map || !this._dirty) {
      return;
    }
    const _size = map.getSize();
    const _extent = this._options.extent || this._getExtent();
    const dim = Math.max(_size[0], _size[1]);
    let gridDivs = Math.min(dim / this._options.gridPixels, this._options.gridMaxDivs);
    if (isMobile()) {
      gridDivs /= this._options.gridReduceFactor;
    }
    const gridSize = this._gridSize = Math.max(_extent[2] - _extent[0], _extent[3] - _extent[1]) / gridDivs;
    const results = this._tree.search({
      minX: _extent[0],
      minY: _extent[1],
      maxX: _extent[2],
      maxY: _extent[3]
    });
    const count = results && results.length;
    const divCount = Math.sqrt(count) || 1;
    const expand = Math.max((_extent[2] - _extent[0]), (_extent[3] - _extent[1])) / divCount;
    // 构建格网
    this._gridColCount = Math.ceil((_extent[2] - _extent[0]) / gridSize);
    this._gridRowCount = Math.ceil((_extent[3] - _extent[1]) / gridSize);
    const grid = [];
    for (let j = 0; j < this._gridRowCount + 1; j++) {
      let y = _extent[1] + j * gridSize;
      if (y >= _extent[1] && y <= _extent[3]) {
        const row = [];
        for (let i = 0; i < this._gridColCount + 1; i++) {
          let x = _extent[0] + i * gridSize;
          row[i] = this._interpolate(x, y, [x - expand, y - expand, x + expand, y + expand]);
          let _count = 1;
          while (row[i][2] === null && _count <= this._options.searchSteps) {
            _count *= 2;
            let _expand = _count * expand;
            row[i] = this._interpolate(x, y, [x - _expand, y - _expand, x + _expand, y + _expand]);
          }
        }
        grid[j] = row;
      }
    }
    this._grid = grid;
    this._dirty = false;
  }

  /**
   * canvas constructor
   * @param extent
   * @param resolution
   * @param pixelRatio
   * @param size
   * @param projection
   * @returns {*}
   */
  canvasFunction (extent, resolution, pixelRatio, size, projection) {
    if (!this._canvas) {
      this._canvas = createCanvas(size[0], size[1])
    } else {
      this._canvas.width = size[0]
      this._canvas.height = size[1]
    }
    if (resolution <= this.get('maxResolution')) {
      this.render(this._canvas)
    } else {
      // console.warn('超出所设置最大分辨率！')
    }
    return this._canvas
  }

  /**
   * get context
   * @returns {*}
   */
  getContext () {
    return this._canvas && this._canvas.getContext('2d');
  }

  /**
   * get map current extent
   * @returns {ol.View|*|Array<number>}
   * @private
   */
  _getExtent () {
    if (!this.getMap()) return
    const size = this._getMapSize()
    const _view = this.getMap().getView()
    return _view && _view.calculateExtent(size)
  }

  /**
   * get size
   * @returns {ol.Size|*}
   * @private
   */
  _getMapSize () {
    if (!this.getMap()) return;
    return this.getMap().getSize();
  }

  /**
   * append layer to map
   * @param map
   */
  appendTo (map) {
    if (map && map instanceof ol.Map) {
      this.set('originMap', map)
      map.addLayer(this)
    } else {
      throw new Error('not map object')
    }
  }

  /**
   * clearWind method will retain the instance
   * @private
   */
  clearWind () {
    const _map = this.getMap();
    if (!_map) return;
    this._cloneLayer = this;
    _map.removeLayer(this);
    this.changed();
    this.getMap().renderSync();
  }

  /**
   * remove layer this instance will be destroyed after remove
   */
  removeLayer () {
    const _map = this.getMap();
    if (!_map) return;
    this.un('precompose', this.redraw, this);
    _map.removeLayer(this);
    delete this._canvas;
    delete this._cloneLayer;
  }

  /**
   * set map
   * @param map
   */
  setMap (map) {
    this.set('originMap', map)
    // ol.layer.Image.prototype.setMap.call(this, map)
  }

  /**
   * get map
   */
  getMap () {
    return this.get('originMap')
  }

  /**
   * start ani
   * @returns {WindyLayer}
   */
  start () {
    const that = this;
    this.buildGrid();
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
    return this
  }

  /**
   * stop ani
   * @returns {WindyLayer}
   */
  stop () {
    this._playing = true
    if (this._animationLoop) window.cancelAnimFrame(this._animationLoop);
    return this
  }

  /**
   * clear layer
   * @param forbidRedraw
   * @returns {WindyLayer}
   */
  clear (forbidRedraw) {
    this.particles = null;
    this._clearContext();
    this._dirty = true;
    return this;
  }

  /**
   * update layer
   */
  update () {
    this._dirty = true;
    this._draw();
  }

  /**
   * clear context
   * @private
   */
  _clearContext () {
    const context = this.getContext();
    context.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  /**
   * draw line
   * @private
   */
  _draw () {
    const map = this.getMap();
    const context = this.getContext();
    if (this._dirty) {
      this._clearContext();
      if (this._playing) {
        setTimeout(() => {
          this.buildGrid();
          this._particles = null;
        }, 1000 / this._options.frameRate);
      }
    }
    if (this._playing) {
      if (!this._particles) {
        this._particles = [];
        const particleCount = this._gridColCount * this._gridRowCount * this._options.particleCountFactor;
        for (let i = 0; i < particleCount; i++) {
          this._particles.push(this._getParticle());
        }
      }
      this._evolve();
      if (!this._batches) {
        return;
      }
      // Fade existing particle trails.
      context.globalAlpha = this.getOpacity() || 0.75;
      context.globalCompositeOperation = 'destination-out';
      context.fillRect(0, 0, this._canvas.width, this._canvas.height);
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = this._options.lineWidth;
      context.globalAlpha = this.getOpacity() || 0.75;
      const extent = this._getExtent();
      const gridSize = this._gridSize;
      let [particle] = [{}];
      for (let i = 0; i < this._batches.length; i++) {
        const batch = this._batches[i];
        context.beginPath();
        context.strokeStyle = this._options.colors[i];
        for (let j = 0; j < batch.length; j++) {
          particle = batch[j] || {};
          const x = extent[0] + gridSize * particle.x;
          const y = extent[1] + gridSize * particle.y;
          const xt = extent[0] + gridSize * particle.xt;
          const yt = extent[1] + gridSize * particle.yt;
          if (extent && (x < extent[0] || x > extent[2])) {
            continue;
          }
          let pixel = map.getPixelFromCoordinate([x, y]);
          context.moveTo(pixel[0], pixel[1]);
          pixel = map.getPixelFromCoordinate([xt, yt]);
          context.lineTo(pixel[0], pixel[1]);
          particle.x = particle.xt;
          particle.y = particle.yt;
        }
        context.stroke();
      }
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
   * evolve
   * @private
   */
  _evolve () {
    const particles = this._particles;
    if (!particles) {
      return;
    }
    const batches = this._options.colors.map(function () {
      return [];
    });
    const fieldScale = this._options.fieldFactor / this._options.fieldMaxIntensity;
    let particle;
    for (let i = 0; i < particles.length; i++) {
      particle = particles[i];
      if (particle.age > this._options.maxParticleAge) {
        particle = this._getParticle(0);
      }
      let [x, y] = [particle.x, particle.y];
      let v = this._getField(x, y);
      if (!v[2]) {
        particle = this._getParticle(0);
      } else if (this._getField(x, y)[0] !== null) {
        particle.xt = x + v[0] * fieldScale;
        particle.yt = y + v[1] * fieldScale;
        batches[this._colorIndex(v[2])].push(particle);
      } else {
        particle.x = x + v[0] * fieldScale;
        particle.y = y + v[1] * fieldScale;
      }
      particle.age++;
    }
    this._batches = batches;
  }

  /**
   * get inter polate
   * @param x
   * @param y
   * @param searchExtent
   * @returns {*}
   * @private
   */
  _interpolate (x, y, searchExtent) {
    const results = this._tree.search({
      minX: searchExtent[0],
      minY: searchExtent[1],
      maxX: searchExtent[2],
      maxY: searchExtent[3]
    });
    let [Σux, Σvx, Σweight] = [0, 0, 0];
    var dx, dy, dd, weight;
    var dataPoint, u, v;
    for (let i = 0, iLen = Math.min(this._options.interpolateCount, results.length); i < iLen; i++) {
      dataPoint = results[i];
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
   * get color index
   * @param m
   * @returns {number}
   * @private
   */
  _colorIndex (m) {
    const fieldMaxIntensity = this._options.fieldMaxIntensity;
    return Math.floor(Math.min(m, fieldMaxIntensity) / fieldMaxIntensity * (this._options.colors.length - 1));
  }
}

export default WindyLayer
