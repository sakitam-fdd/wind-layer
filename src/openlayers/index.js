import Windy from '../windy/windy';
import { createCanvas, getDirection, getSpeed } from '../helper';

const global = typeof window === 'undefined' ? {} : window;
const ol = global.ol || {};

if (!ol.layer) ol.layer = {};
if (!ol.layer.Image) ol.layer.Image = class {};

class OlWind extends ol.layer.Image {
  constructor (data, options = {}) {
    super(options);

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
     * windy layer
     * @type {null}
     */
    this.$Windy = null;

    /**
     * is clear
     * @type {boolean}
     */
    this.isClear = false;

    /**
     * options
     * @type {{}}
     */
    this.options = options;
    this.setSource(new ol.source.ImageCanvas({
      logo: options.logo,
      state: options.state,
      attributions: options.attributions,
      resolutions: options.resolutions,
      canvasFunction: this.canvasFunction.bind(this),
      // projection: (options.hasOwnProperty('projection') ? options.projection : 'EPSG:3857'),
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
   * @returns {OlWind}
   */
  setData (data) {
    const _map = this.getMap();
    if (!_map) return this;
    this.data = data;
    this.isClear = false;
    if (!this.$Windy && this._canvas) {
      this.render(this._canvas);
      _map.renderSync();
    } else if (this.$Windy && this._canvas) {
      if (this._cloneLayer) {
        _map.addLayer(this._cloneLayer);
        delete this._cloneLayer;
      }
      const extent = this._getExtent();
      this.$Windy.update(this.getData(), extent[0], extent[1], extent[2], extent[3]);
    } else {
      console.warn('please create new instance');
    }
    return this;
  }

  /**
   * render windy layer
   * @returns {OlWind}
   */
  render (canvas) {
    const extent = this._getExtent();
    if (this.isClear || !this.getData() || !extent) return this;
    if (canvas && !this.$Windy) {
      const {
        minVelocity,
        maxVelocity,
        velocityScale,
        particleAge,
        lineWidth,
        particleMultiplier,
        colorScale
      } = this.options;
      this.$Windy = new Windy({
        canvas: canvas,
        projection: this._getProjectionCode(),
        data: this.getData(),
        minVelocity,
        maxVelocity,
        velocityScale,
        particleAge,
        lineWidth,
        particleMultiplier,
        colorScale
      });
      this.$Windy.start(extent[0], extent[1], extent[2], extent[3]);
    } else if (canvas && this.$Windy) {
      const extent = this._getExtent();
      this.$Windy.start(extent[0], extent[1], extent[2], extent[3]);
    }
    return this
  }

  /**
   * re-draw
   */
  redraw () {
    if (this.isClear) return;
    const _extent = this.options.extent || this._getMapExtent();
    this.setExtent(_extent);
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
      this._canvas = createCanvas(size[0], size[1]);
    } else {
      this._canvas.width = size[0];
      this._canvas.height = size[1];
    }
    if (resolution <= this.get('maxResolution')) {
      this.render(this._canvas);
    } else {
      // console.warn('超出所设置最大分辨率！')
    }
    return this._canvas;
  }

  /**
   * bounds, width, height, extent
   * @returns {*}
   * @private
   */
  _getExtent () {
    const size = this._getMapSize();
    const _extent = this._getMapExtent();
    if (size && _extent) {
      const _projection = this._getProjectionCode();
      const extent = ol.proj.transformExtent(_extent, _projection, 'EPSG:4326');
      return [[[0, 0], [size[0], size[1]]], size[0], size[1], [[extent[0], extent[1]], [extent[2], extent[3]]]];
    } else {
      return false;
    }
  }

  /**
   * get map current extent
   * @returns {ol.View|*|Array<number>}
   * @private
   */
  _getMapExtent () {
    if (!this.getMap()) return;
    const size = this._getMapSize();
    const _view = this.getMap().getView();
    return _view && _view.calculateExtent(size);
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
      this.set('originMap', map);
      this.getSource().projection_ = this._getProjectionCode();
      map.addLayer(this);
    } else {
      throw new Error('not map object');
    }
  }

  /**
   * get mouse point data
   * @param coordinates
   * @returns {null|{speed: (*|number), direction}}
   */
  getPointData (coordinates) {
    if (!this.$Windy) return null;
    const gridValue = this.$Windy.interpolatePoint(coordinates[0], coordinates[1]);
    if (gridValue && !isNaN(gridValue[0]) && !isNaN(gridValue[1]) && gridValue[2]) {
      return {
        direction: getDirection(gridValue[0], gridValue[1], this.options.angleConvention || 'bearingCCW'),
        speed: getSpeed(gridValue[0], gridValue[1], this.options.speedUnit)
      }
    }
  }

  /**
   * clearWind method will retain the instance
   * @private
   */
  clearWind () {
    const _map = this.getMap();
    if (!_map) return;
    if (this.$Windy) this.$Windy.stop();
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
    if (this.$Windy) this.$Windy.stop();
    this.un('precompose', this.redraw, this);
    _map.removeLayer(this);
    delete this._canvas;
    delete this.$Windy;
    delete this._cloneLayer;
  }

  /**
   * set map
   * @param map
   */
  setMap (map) {
    this.set('originMap', map);
    // ol.layer.Image.prototype.setMap.call(this, map)
  }

  /**
   * get map
   */
  getMap () {
    return this.get('originMap');
  }

  _getProjectionCode () {
    let code = '';
    const map = this.getMap();
    if (map) {
      code =
        map.getView() &&
        map
          .getView()
          .getProjection()
          .getCode();
    } else {
      code = 'EPSG:3857';
    }
    return code;
  }

  /**
   * update windy config
   * @param params
   * @returns {OlWind}
   */
  updateParams (params) {
    this.options = Object.assign(this.options, params);
    if (this.$Windy) {
      const {
        minVelocity, // 粒子强度最小的速度 (m/s)
        maxVelocity, // 粒子强度最大的速度 (m/s)
        velocityScale, // 风速的比例
        particleAge, // 重绘之前生成的离子数量的最大帧数
        lineWidth, // 绘制粒子的线宽
        particleMultiplier, // 离子数量
        colorScale
      } = this.options;
      if (this.$Windy) {
        this.$Windy.updateParams({
          minVelocity,
          maxVelocity,
          velocityScale,
          particleAge,
          lineWidth,
          particleMultiplier,
          colorScale
        });
        if (this.getMap() && this._canvas && this.data) {
          this.render(this._canvas);
        }
      }
    }
    return this;
  }

  /**
   * get windy config
   * @returns {null|*|Windy.params|{velocityScale, minVelocity, maxVelocity, colorScale, particleAge, lineWidth, particleMultiplier}}
   */
  getParams () {
    return this.$Windy && this.$Windy.getParams();
  }
}

export default OlWind;
