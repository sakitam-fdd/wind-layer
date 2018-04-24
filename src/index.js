import './polyfill/assign';
import './polyfill/requestAnimFrame';
import ol from 'openlayers';
import rbush from 'rbush';
import { isMobile } from './helper';

/**
 * create canvas
 * @param width
 * @param height
 * @param Canvas
 * @returns {HTMLCanvasElement}
 */
const createCanvas = (width, height, Canvas) => {
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
  } else {
    // create a new canvas instance in node.js
    // the canvas class needs to have a default constructor without any parameter
    return new Canvas(width, height)
  }
};

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
  frameDuration: 50 // ms
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
     * windy 数据
     */
    this.data = data;

    /**
     * btree
     * @type {rbush|Object}
     * @private
     */
    this._tree = rbush();

    /**
     * columns
     * @type {Array}
     * @private
     */
    this._columns = [];

    this._idSeq = 0;
    this._dataPoints = {};
    this._dirty = true;
    this._builtExtent = [];

    /**
     * is clear
     * @type {boolean}
     */
    this.isClear = false;
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
    this.data = data;
    this.isClear = false;
    if (!this.$Windy && this._canvas) {
      this.render(this._canvas)
      _map.renderSync()
    } else if (this.$Windy && this._canvas) {
      if (this._cloneLayer) {
        _map.addLayer(this._cloneLayer)
        delete this._cloneLayer
      }
      const extent = this._getExtent()
      this.$Windy.update(this.getData(), extent[0], extent[1], extent[2], extent[3])
    } else {
      console.warn('please create new instance')
    }
    return this
  }

  /**
   * render windy layer
   * @returns {WindyLayer}
   */
  render (canvas) {
    const extent = this._getExtent();
    if (this.isClear || !this.getData() || !extent) return this
    if (canvas) {
      this.start(extent[0], extent[1], extent[2], extent[3])
    } else if (canvas && this.$Windy) {
      const extent = this._getExtent()
      this.start(extent[0], extent[1], extent[2], extent[3])
    }
    return this
  }

  /**
   * re-draw
   */
  redraw () {
    if (this.isClear) return;
    const _extent = this._options.extent || this._getMapExtent();
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
    const _extent = this._options.extent || this._getMapExtent();
    const dim = Math.max(_size[0], _size[1]);
    let gridDivs = Math.min(dim / this._options.gridPixels, this._options.gridMaxDivs);
    if (isMobile()) {
      gridDivs /= this._options.gridReduceFactor;
    }
    const gridSize = this._gridSize = Math.max(_extent[2] - _extent[0], _extent[3] - _extent[1]) / gridDivs;
    // 采样范围
    const searches = this._tree.search(_extent);
    const count = searches && searches.length;
    const divCount = Math.sqrt(count) || 1;
    const expand = Math.max((_extent[2] - _extent[0]), (_extent[3] - _extent[1])) / divCount;
    var tryExpand, tryCount;
    // 构建格网
    this._gridColCount = Math.ceil((_extent[2] - _extent[0]) / gridSize);
    this._gridRowCount = Math.ceil((_extent[3] - _extent[1]) / gridSize);
    const grid = [];
    for (let j = 0, jLen = this._gridRowCount + 1; j < jLen; j++) {
      let y = _extent[1] + j * gridSize;
      if (y >= _extent[1] && y <= _extent[3]) {
        const row = [];
        for (let i = 0, iLen = this._gridColCount + 1; i < iLen; i++) {
          let x = _extent[0] + i * gridSize;
          row[i] = this._interpolate(x, y, [x - expand, y - expand, x + expand, y + expand]);
          tryCount = 1;
          while (row[i][2] === null && tryCount <= this._options.searchSteps) {
            tryCount *= 2;
            tryExpand = tryCount * expand;
            row[i] = this._interpolate(x, y, [x - tryExpand, y - tryExpand, x + tryExpand, y + tryExpand]);
          }
        }
        grid[j] = row;
      }
    }
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
    if (!this.getMap()) return
    return this.getMap().getSize()
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
    const _map = this.getMap()
    if (!_map) return
    if (this.$Windy) this.$Windy.stop()
    this.isClear = true
    this._cloneLayer = this
    _map.removeLayer(this)
    this.changed()
    this.getMap().renderSync()
  }

  /**
   * remove layer this instance will be destroyed after remove
   */
  removeLayer () {
    const _map = this.getMap()
    if (!_map) return
    if (this.$Windy) this.$Windy.stop()
    this.un('precompose', this.redraw, this)
    _map.removeLayer(this)
    delete this._canvas
    delete this.$Windy
    delete this._cloneLayer
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

  start () {
    this._buildGrid();
    this._startAnim();
    return this
  }

  stop () {
    clearTimeout(this._timer);
    this._playing = false;
    return this
  }

  isPlaying () {
    return this._playing;
  }

  _startAnim () {}

  addDataPoint (x, y, u, v, redrawNow) {}

  removeDataPoint (id, redrawNow) {}

  /**
   * clear layer
   * @param forbidRedraw
   * @returns {WindyLayer}
   */
  clear (forbidRedraw) {
    this._tree.clear();
    this.particles = null;
    this._clearContext();
    this._dirty = true;
    // if (!forbidRedraw && map) {
    //   map._requestRedraw();
    // }
    return this;
  }

  /**
   * get field from pixel
   * @param pixel
   * @returns {*}
   */
  calcField (pixel) {
    const map = this.getMap();
    const extent = this._getExtent();
    const all = this._tree.all();
    const count = all && all.length;
    const divCount = Math.sqrt(count) || 1;
    const expand = Math.max((extent[2] - extent[0]), (extent[3] - extent[1])) / divCount;
    const coordinate = map.getCoordinateFromPixel(pixel);
    if (count > 0) {
      let i = 1;
      let searched, searchedExtent;
      do {
        searchedExtent = [coordinate[0] - i * expand, coordinate[1] - i * expand, coordinate[0] + i * expand, coordinate[1] + i * expand];
        searched = this._tree.search(searchedExtent);
        i *= 2;
      } while (!searched || searched.length === 0)
      return this._interpolate(coordinate[0], coordinate[1], searchedExtent);
    } else {
      return NULL_WIND_VECTOR;
    }
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
          this._startAnim();
        }, this._options.frameDuration); // 耗时，防止阻塞绘制
      }
    }
    if (this._playing) {
      this._particles = this._getParticles();
      this._evolve();
      if (!this._batches) {
        return;
      }
      // Fade existing particle trails.
      context.save();
      context.globalAlpha = this.getOpacity() || 0.75;
      context.globalCompositeOperation = 'destination-out';
      context.fillStyle = '#000';
      context.fillRect(0, 0, this._canvas.width, this._canvas.height);
      context.restore();
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = this._options.lineWidth;
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
   * randomize
   * @param o
   * @returns {*}
   * @private
   */
  _randomize (o) { // UNDONE: this method is terrible
    let [x, y, safetyNet] = [void (0), void (0), 0];
    do {
      x = Math.round(Math.floor(Math.random() * bounds.width) + bounds.x);
      y = Math.round(Math.floor(Math.random() * bounds.height) + bounds.y)
    } while (this._getField(x, y)[2] === null && safetyNet++ < 30);
    o.x = x;
    o.y = y;
    return o;
  }

  /**
   * get particles
   * @param particleCount
   */
  _getParticles (particleCount) {
    let particles = this._particles || [];
    if (particles.length > particleCount) particles = particles.slice(0, particleCount);
    for (let i = particles.length; i < particleCount; i++) {
      particles.push(this._randomize({ age: ~~(Math.random() * this._options.maxParticleAge) + 0 }));
    }
    return particles;
  }

  /**
   * get field
   * @param x
   * @param y
   * @returns {*}
   * @private
   */
  _getField (x, y) {
    if (!this._columns) return NULL_WIND_VECTOR;
    const column = this._columns[Math.round(x)];
    /* eslint-disable-next-line */
    return (column && column[Math.round(y)] || NULL_WIND_VECTOR);
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
        particle = particles[i] = this._getParticles(0);
      }
      let [x, y] = [particle.x, particle.y];
      let v = this._getField(x, y)
      if (!v[2]) {
        particle = particles[i] = this._getParticles(0);
      } else {
        particle.xt = x + v[0] * fieldScale;
        particle.yt = y + v[1] * fieldScale;
        batches[this._colorIndex(v[2])].push(particle);
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
    const searches = this._tree.search(searchExtent);
    if (!searches) {
      return this._nullVector;
    }
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
    return this._nullVector;
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
