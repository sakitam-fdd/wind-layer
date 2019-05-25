import Windy from '../windy/windy';
import { getDirection, getSpeed } from '../helper';

const global = typeof window === 'undefined' ? {} : window;

if (!global.BMap) global.BMap = {};

if (!global.BMap.Overlay) global.BMap.Overlay = class Overlay {};

class BaiduWind extends global.BMap.Overlay {
  constructor (data, options = {}) {
    super(options);
    this.options = options;
    this.paneName = this.options.paneName || 'mapPane';
    this.context = this.options.context || '2d';
    this.zIndex = this.options.zIndex || 0;
    this.mixBlendMode = this.options.mixBlendMode || null;
    this.enableMassClear = this.options.enableMassClear;
    this._map = options.map;
    this._lastDrawTime = null;

    /**
     * 矢量图层
     * @type {null}
     */
    this.canvas = null;

    /**
     * windy 数据
     */
    this.data = data;

    /**
     * windy layer
     * @type {null}
     */
    this._windy = null;
    this.show();
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
    if (this._map && this.data) {
      this._draw();
    }
  }

  /**
   * bounds, width, height, extent
   * @returns {*}
   * @private
   */
  _getExtent () {
    const size = this._map.getSize();
    const _ne = this._map.getBounds().getNorthEast();
    const _sw = this._map.getBounds().getSouthWest();
    return [
      [
        [0, 0], [size.width, size.height]
      ],
      size.width,
      size.height,
      [
        // [_ne.lng, _ne.lat], [_sw.lng, _sw.lat]
        [_sw.lng, _sw.lat], [_ne.lng, _ne.lat] // [xmin, ymin, xmax, ymax]: 西南 和 东北
      ]
    ]
  }

  /**
   * append layer to map
   * @param map
   */
  appendTo (map) {
    if (map) {
      map.addOverlay(this);
    } else {
      throw new Error('not map object');
    }
  }

  initialize (map) {
    this._map = map;
    const canvas = this.canvas = document.createElement('canvas');
    canvas.style.cssText = `position:absolute; left:0; top:0; z-index: ${this.zIndex} ;user-select:none;`;
    canvas.style.mixBlendMode = this.mixBlendMode;
    this.adjustSize();
    map.getPanes()[this.paneName].appendChild(canvas);
    map.addEventListener('resize', () => {
      this.adjustSize();
      this._draw();
    });
    return this.canvas
  }

  adjustSize () {
    const size = this._map.getSize();
    const canvas = this.canvas;
    const devicePixelRatio = this.devicePixelRatio = global.devicePixelRatio || 1;
    canvas.width = size.width * devicePixelRatio;
    canvas.height = size.height * devicePixelRatio;
    if (this.context === '2d') {
      canvas.getContext(this.context).scale(devicePixelRatio, devicePixelRatio)
    }
    canvas.style.width = size.width + 'px';
    canvas.style.height = size.height + 'px';
  }

  draw () {
    const self = this;
    clearTimeout(self.timeoutID);
    self.timeoutID = setTimeout(function () {
      self._draw()
    }, 15);
  }

  _draw () {
    const map = this._map;
    const size = map.getSize();
    const center = map.getCenter();
    if (center) {
      const pixel = map.pointToOverlayPixel(center);
      this.canvas.style.left = pixel.x - size.width / 2 + 'px';
      this.canvas.style.top = pixel.y - size.height / 2 + 'px';
      this.dispatchEvent('draw');
      this.options.update && this.options.update.call(this);
      this.render(this.canvas);
    }
  }

  /**
   * render windy layer
   * @param canvas
   * @returns {BaiduWind}
   */
  render (canvas) {
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
    return this;
  }

  getContainer () {
    return this.canvas;
  }

  setZIndex (zIndex) {
    this.zIndex = zIndex;
    this.canvas.style.zIndex = this.zIndex;
  }

  getZIndex () {
    return this.zIndex;
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
   * @returns {BaiduWind}
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
        if (this._map && this.canvas && this.data) {
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

export default BaiduWind;
