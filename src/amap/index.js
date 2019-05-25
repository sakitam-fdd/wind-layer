import Windy from '../windy/windy';
import { createCanvas, getDirection, getSpeed, getExtent } from '../helper';

const global = typeof window === 'undefined' ? {} : window;
const AMap = global.AMap || {};

class AMapWind {
  constructor (data, options = {}) {
    this.options = options;

    /**
     * internal
     * @type {null}
     */
    this.canvas = null;

    /**
     * windy 数据
     */
    this.data = data;

    /**
     * canvas layer
     * @type {null}
     * @private
     */
    this.layer_ = null;

    /**
     * windy layer
     * @type {null}
     */
    this._windy = null;

    if (options.map) {
      this.appendTo(options.map)
    }

    /**
     * bind context
     * @type {{new(...args: any[][]): any} | ((...args: any[][]) => any) | ((...args: any[]) => any) | any | {new(...args: any[]): any}}
     */
    this.init = this.init.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.canvasFunction = this.canvasFunction.bind(this);
    this._addReFreshHandle = this._addReFreshHandle.bind(this);
  }

  /**
   * append layer to map
   * @param map
   */
  appendTo (map) {
    if (map) {
      this.init(map)
    } else {
      throw new Error('not map object');
    }
  }

  /**
   * get layer data
   * @returns {*}
   */
  getData () {
    return this.data;
  }

  /**
   * set data
   * @param data
   */
  setData (data) {
    this.data = data;
    if (this.map && this.canvas && this.data) {
      this.render(this.canvas);
    }
  }

  /**
   * init windy layer
   * @param map
   * @param options
   */
  init (map, options) {
    if (map) {
      this.map = map;
      this.context = this.options.context || '2d';
      this.getCanvasLayer();
      this.map.on('resize', this.handleResize, this)
    } else {
      throw new Error('not map object')
    }
  }

  handleResize () {
    if (this.canvas) {
      this.canvasFunction()
    }
  }

  /**
   *  render layer
   * @param canvas
   * @returns {*}
   */
  render (canvas) {
    if (!canvas) return;
    const extent = this._getExtent();
    if (!this.getData() || !extent) return this;
    if (canvas && !this._windy) {
      const {
        minVelocity,
        maxVelocity,
        velocityScale,
        particleAge,
        lineWidth,
        particleMultiplier,
        colorScale
      } = this.options;
      this._windy = new Windy({
        canvas: canvas,
        data: this.getData(),
        'onDraw': () => {
        },
        minVelocity,
        maxVelocity,
        velocityScale,
        particleAge,
        lineWidth,
        particleMultiplier,
        colorScale
      });
      this._windy.start(extent[0], extent[1], extent[2], extent[3]);
    } else if (canvas && this._windy) {
      this._windy.start(extent[0], extent[1], extent[2], extent[3]);
    }
    // 2D视图时可以省略
    this._addReFreshHandle();
    return this;
  }

  /**
   * 3D模式下手动刷新
   * @private
   */
  _addReFreshHandle () {
    if (!this.map) return;
    const type = this.map.getViewMode_();
    if (type.toLowerCase() === '3d') {
      this.layer_ && this.layer_.reFresh();
      AMap.Util.requestAnimFrame(this._addReFreshHandle);
    }
  }

  /**
   * get canvas layer
   */
  getCanvasLayer () {
    if (!this.canvas && !this.layer_) {
      const canvas = this.canvasFunction();
      const bounds = this._getBounds();
      this.layer_ = new AMap.CanvasLayer({
        canvas: canvas,
        bounds: this.options.bounds || bounds,
        zooms: this.options.zooms || [0, 22],
        zIndex: this.options.zIndex || 12,
        opacity: this.options.opacity || 1
      });
      this.map.on('mapmove', this.canvasFunction, this);
      this.map.on('zoomchange', this.canvasFunction, this);
      this.layer_.setMap(this.map);
    }
  }

  /**
   * canvas constructor
   * @returns {*}
   */
  canvasFunction () {
    const [width, height] = [this.map.getSize().width, this.map.getSize().height];
    if (!this.canvas) {
      this.canvas = createCanvas(width, height, null);
    } else {
      this.canvas.width = width;
      this.canvas.height = height;
      const bounds = this._getBounds();
      if (this.layer_) {
        this.layer_.setBounds(this.options.bounds || bounds);
      }
    }
    this.render(this.canvas);
    return this.canvas;
  }

  /**
   * fixed viewMode
   * @private
   */
  _getBounds () {
    const type = this.map.getViewMode_();
    let [southWest, northEast] = [];
    const bounds = this.map.getBounds()
    if (type.toLowerCase() === '2d') {
      northEast = bounds.getNorthEast(); // xmax ymax
      southWest = bounds.getSouthWest(); // xmin ymin
    } else {
      const arrays = bounds.bounds.map(item => {
        return [item.getLng(), item.getLat()];
      });
      const extent = getExtent(arrays);
      southWest = new AMap.LngLat(extent[0], extent[1]);
      northEast = new AMap.LngLat(extent[2], extent[3]);
    }
    return new AMap.Bounds(southWest, northEast);
  }

  /**
   * bounds, width, height, extent
   * @returns {*}
   * @private
   */
  _getExtent () {
    const [width, height] = [this.map.getSize().width, this.map.getSize().height];
    const _ne = this._getBounds().getNorthEast();
    const _sw = this._getBounds().getSouthWest();
    return [
      [
        [0, 0], [width, height]
      ],
      width,
      height,
      [
        [_sw.lng, _sw.lat], [_ne.lng, _ne.lat] // [xmin, ymin, xmax, ymax]: 西南 和 东北
      ]
    ]
  }

  /**
   * remove layer
   */
  removeLayer () {
    if (!this.map) return;
    this.layer_.setMap(null);
    this.map.off('resize', this.handleResize, this);
    this.map.off('mapmove', this.canvasFunction, this);
    this.map.off('zoomchange', this.canvasFunction, this);
    delete this.map;
    delete this.layer_;
    delete this.canvas;
  }

  /**
   * get canvas context
   * @returns {*}
   */
  getContext () {
    return this.canvas.getContext(this.context);
  }

  /**
   * get mouse point data
   * @param coordinates
   * @returns {{direction: number, speed: *}}
   */
  getPointData (coordinates) {
    const gridValue = this._windy.interpolatePoint(coordinates[0], coordinates[1]);
    if (gridValue && !isNaN(gridValue[0]) && !isNaN(gridValue[1]) && gridValue[2]) {
      return {
        direction: getDirection(gridValue[0], gridValue[1], this.options.angleConvention || 'bearingCCW'),
        speed: getSpeed(gridValue[0], gridValue[1], this.options.speedUnit)
      }
    }
  }

  /**
   * clear wind
   */
  clearWind () {
    if (this._windy) this._windy.stop();
  }

  /**
   * update windy config
   * @param params
   * @returns {AMapWind}
   */
  updateParams (params) {
    this.options = Object.assign(this.options, params);
    if (this._windy) {
      const {
        minVelocity, // 粒子强度最小的速度 (m/s)
        maxVelocity, // 粒子强度最大的速度 (m/s)
        velocityScale, // 风速的比例
        particleAge, // 重绘之前生成的离子数量的最大帧数
        lineWidth, // 绘制粒子的线宽
        particleMultiplier, // 离子数量
        colorScale
      } = this.options;
      if (this._windy) {
        // this._windy.stop();
        this._windy.updateParams({
          minVelocity,
          maxVelocity,
          velocityScale,
          particleAge,
          lineWidth,
          particleMultiplier,
          colorScale
        });
        if (this.map && this.canvas && this.data) {
          this.render(this.canvas);
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
    return this._windy && this._windy.getParams();
  }
}

export default AMapWind
