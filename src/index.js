import ol from 'openlayers'
import Windy from './windy'

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
}

class WindyLayer extends ol.layer.Image {
  constructor (data, options = {}) {
    super(options)

    /**
     * 矢量图层
     * @type {null}
     */
    this._canvas = null

    /**
     * windy 数据
     */
    this.data = data

    /**
     * windy layer
     * @type {null}
     */
    this.$Windy = null

    /**
     * is clear
     * @type {boolean}
     */
    this.isClear = false

    /**
     * options
     * @type {{}}
     */
    this.options = options
    this.setSource(new ol.source.ImageCanvas({
      logo: options.logo,
      state: options.state,
      attributions: options.attributions,
      resolutions: options.resolutions,
      canvasFunction: this.canvasFunction.bind(this),
      projection: (options.hasOwnProperty('projection') ? options.projection : 'EPSG:3857'),
      ratio: (options.hasOwnProperty('ratio') ? options.ratio : 1)
    }))
    this.on('precompose', this.redraw, this)
  }

  /**
   * get layer data
   * @returns {*}
   */
  getData () {
    return this.data
  }

  /**
   * set layer data
   * @param data
   * @returns {WindyLayer}
   */
  setData (data) {
    const _map = this.getMap()
    if (!_map) return this
    this.data = data
    this.isClear = false
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
    const extent = this._getExtent()
    if (this.isClear || !this.getData() || !extent) return this
    if (canvas && !this.$Windy) {
      this.$Windy = new Windy({
        canvas: canvas,
        projection: this.get('projection'),
        data: this.getData()
      })
      this.$Windy.start(extent[0], extent[1], extent[2], extent[3])
    } else if (canvas && this.$Windy) {
      const extent = this._getExtent()
      this.$Windy.start(extent[0], extent[1], extent[2], extent[3])
    }
    return this
  }

  /**
   * re-draw
   */
  redraw () {
    if (this.isClear) return
    const _extent = this.options.extent || this._getMapExtent()
    this.setExtent(_extent)
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
   * bounds, width, height, extent
   * @returns {*}
   * @private
   */
  _getExtent () {
    const size = this._getMapSize()
    const _extent = this._getMapExtent()
    if (size && _extent) {
      const _projection = this.get('projection')
      const extent = ol.proj.transformExtent(_extent, _projection, 'EPSG:4326')
      return [[[0, 0], [size[0], size[1]]], size[0], size[1], [[extent[0], extent[1]], [extent[2], extent[3]]]]
    } else {
      return false
    }
  }

  /**
   * get map current extent
   * @returns {ol.View|*|Array<number>}
   * @private
   */
  _getMapExtent () {
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
}

export default WindyLayer
