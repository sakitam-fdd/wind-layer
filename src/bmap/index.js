import Windy from '../windy/windy';

const global = typeof window === 'undefined' ? {} : window;

class BaiduWindy extends global.BMap.Overlay {
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
   * bounds, width, height, extent
   * @returns {*}
   * @private
   */
  _getExtent () {
    const size = this._map.getSize();
    const _ne = this._map.getBounds().getNorthEast();
    const _sw = this._map.getBounds().getSouthWest();
    return [
      [[0, 0], [size.width, size.height]],
      size.width,
      size.height,
      [[_ne.lng, _ne.lat], [_sw.lng, _sw.lat]]
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
   * @returns {BaiduWindy}
   */
  render (canvas) {
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
}

export default BaiduWindy;
