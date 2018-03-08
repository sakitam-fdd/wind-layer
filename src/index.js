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
    if (!this.getMap()) return this
    this.data = data
    if (!this.$Windy && this._canvas) {
      this.render(this.$canvas)
      this.getMap().renderSync()
    } else {
      const extent = this._getExtent()
      this.$Windy.update(this.getData(), extent[0], extent[1], extent[2], extent[3])
    }
    return this
  }

  /**
   * render windy layer
   * @returns {WindyLayer}
   */
  render (canvas) {
    if (!this.getData()) return this
    if (canvas && !this.$Windy) {
      this.$Windy = new Windy({
        canvas: canvas,
        projection: this.get('projection'),
        data: this.getData()
      })
      const extent = this._getExtent()
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
   * @returns {*[]}
   */
  _getExtent () {
    const size = this._getMapSize()
    const _extent = this._getMapExtent()
    const _projection = this.get('projection')
    const extent = ol.proj.transformExtent(_extent, _projection, 'EPSG:4326')
    return [[[0, 0], [size[0], size[1]]], size[0], size[1], [[extent[0], extent[1]], [extent[2], extent[3]]]]
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
      this.setMap(map)
      map.addLayer(this)
    } else {
      throw new Error('not map object')
    }
  }

  /**
   * clear windy layer
   * @private
   */
  clearWind () {
    const _map = this.getMap()
    if (!_map) return
    if (this.$Windy) this.$Windy.stop()
    _map.un('precompose', this.render, this)
    _map.removeLayer(this)
    delete this._canvas
    delete this.$Windy
  }

  /**
   * set map
   * @param map
   */
  setMap (map) {
    ol.layer.Image.prototype.setMap.call(this, map)
  }

  /**
   * get map
   */
  getMap () {
    return this.get('map')
  }
}

export default WindyLayer
