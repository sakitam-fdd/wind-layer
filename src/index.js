import './polyfill/assign';
import './polyfill/requestAnimFrame';
import ol from 'openlayers';
import rbush from 'rbush';
import uuid from 'uuid';
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
    this._dirty = true;

    /**
     * is playing
     * @type {boolean}
     * @private
     */
    this._playing = false;

    /**
     * animate
     * @type {null}
     * @private
     */
    this._animationLoop = null;

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
    let [us, vs] = [this.data[0], this.data[1]];
    let [cols, rows] = [us.header.nx, us.header.ny];
    const _projection = this.get('projection')
    for (let j = 0; j < rows; j++) {
      const lat = 90 - 180 * j / rows;
      if (Math.abs(lat) > 85.1) {
        continue;
      }
      for (let i = 0; i < cols; i++) {
        const lon = -180 + 360 * i / cols;
        const point = ol.proj.transform([lon, lat], _projection, 'EPSG:4326');
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
    const extent = [x, y, x, y];
    const data = {
      x: x,
      y: y,
      u: uid,
      v: value,
      bbox: extent,
      id: uuid()
    };
    this._tree.insert(extent, data);
    return data.id;
  }

  /**
   * render windy layer
   * @returns {WindyLayer}
   */
  render (canvas) {
    const extent = this._getExtent();
    if (this.isClear || !this.getData() || !extent) return this
    if (!this.getData()) return this
    if (canvas && !this._playing) {
      this.start()
    } else if (canvas && this._playing) {
    }
    return this
  }

  /**
   * re-draw
   */
  redraw () {
    if (this.isClear) return;
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
    this._columns = grid;
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
    const _map = this.getMap();
    if (!_map) return;
    this.isClear = true;
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
      const now = Date.now()
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
    this._tree.clear();
    this.particles = null;
    this._clearContext();
    this._dirty = true;
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
        }, 1000 / this._options.frameRate); // 耗时，防止阻塞绘制
      }
    }
    if (this._playing) {
      this._particles = this._getParticles(this._gridColCount * this._gridRowCount * this._options.particleCountFactor);
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
   * @param age
   * @returns {*}
   * @private
   */
  _randomize (age) { // UNDONE: this method is terrible
    return {
      x: Math.round(Math.random() * this._gridColCount),
      y: Math.round(Math.random() * this._gridRowCount),
      age: age === undefined ? Math.floor(Math.random() * this._options.maxParticleAge) : age
    };
  }

  /**
   * get particles
   * @param particleCount
   */
  _getParticles (particleCount) {
    let particles = this._particles || [];
    if (particles.length > particleCount) particles = particles.slice(0, particleCount);
    for (let i = particles.length; i < particleCount; i++) {
      particles.push(this._randomize(~~(Math.random() * this._options.maxParticleAge) + 0));
    }
    this._particles = particles;
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
        particle = particles[i] = this._randomize(0);
      }
      let [x, y] = [particle.x, particle.y];
      let v = this._getField(x, y)
      if (!v[2]) {
        particle = particles[i] = this._randomize(0);
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
      return NULL_WIND_VECTOR;
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
