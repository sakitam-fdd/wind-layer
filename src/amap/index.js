import Windy from '../windy/windy';
import { createCanvas } from '../helper';

const global = typeof window === 'undefined' ? {} : window;
const AMap = global.AMap || {};

class AMapWindy {
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
  }

  /**
   * append layer to map
   * @param map
   */
  appendTo (map) {
    if (map) {
      map.on('complete', () => {
        this.init(map)
      }, this);
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
   * init windy layer
   * @param map
   * @param options
   */
  init (map, options) {
    if (map) {
      this.map = map;
      this.context = this.options.context || '2d';
      this.getCanvasLayer();
    } else {
      throw new Error('not map object')
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
      this._windy = new Windy({
        canvas: canvas,
        data: this.getData(),
        'onDraw': () => {
        }
      });
      this._windy.start(extent[0], extent[1], extent[2], extent[3]);
    } else if (canvas && this._windy) {
      this._windy.start(extent[0], extent[1], extent[2], extent[3]);
    }
    return this;
  }

  /**
   * get canvas layer
   */
  getCanvasLayer () {
    if (!this.canvas && !this.layer_) {
      const canvas = this.canvasFunction();
      const bounds = this.map.getBounds();
      this.layer_ = new AMap.CanvasLayer({
        canvas: canvas,
        bounds: this.options.bounds || bounds,
        zooms: this.options.zooms || [0, 22]
      });
      this.layer_.setMap(this.map);
      this.map.on('mapmove', this.canvasFunction, this);
      this.map.on('zoomchange', this.canvasFunction, this);
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
      const bounds = this.map.getBounds();
      if (this.layer_) {
        this.layer_.setBounds(this.options.bounds || bounds);
      }
    }
    this.render(this.canvas);
    return this.canvas;
  }

  /**
   * bounds, width, height, extent
   * @returns {*}
   * @private
   */
  _getExtent () {
    const [width, height] = [this.map.getSize().width, this.map.getSize().height];
    const _ne = this.map.getBounds().getNorthEast();
    const _sw = this.map.getBounds().getSouthWest();
    return [
      [[0, 0], [width, height]],
      width,
      height,
      [[_ne.lng, _ne.lat], [_sw.lng, _sw.lat]]
    ]
  }

  /**
   * remove layer
   */
  removeLayer () {
    if (!this.map) return;
    this.map.removeLayer(this.layer_);
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
}

export default AMapWindy
