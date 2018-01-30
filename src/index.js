import ol from 'openlayers'
import Windy from './windy'
// import $Map from 'ol/map'
// import $LayerImage from 'ol/layer/image'
// import $ImageCanvasSource from 'ol/source/imagecanvas'
// import $Proj from 'ol/proj'
const $Map = ol.Map
const $LayerImage = ol.layer.Image
const $ImageCanvasSource = ol.source.ImageCanvas
const $Proj = ol.proj

/**
 * create canvas
 * @param width
 * @param height
 * @returns {HTMLCanvasElement}
 */
const createCanvas = (width, height) => {
  let canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

class WindyLayer {
  constructor (data, options = {}) {
    this.$options = options

    /**
     * 矢量图层
     * @type {null}
     */
    this.$canvas = null

    /**
     * windy 数据
     */
    this.$data = data

    /**
     * timer
     * @type {null}
     * @private
     */
    this._timer = null

    /**
     * 需要渲染的canvas图层
     * @type {null}
     * @private
     */
    this.layer_ = null
  }

  /**
   * get layer data
   * @returns {*}
   */
  getData () {
    return this.$data
  }

  /**
   * set layer data
   * @param data
   * @returns {WindyLayer}
   */
  setData (data) {
    if (!this.$Map) return this
    this.$data = data
    if (!this.$Windy && this.$canvas) {
      this.render(this.$canvas)
      this.$Map.renderSync()
    } else {
      const extent = this.getExtent()
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
      if (this._timer) window.clearTimeout(this._timer)
      this._timer = window.setTimeout(() => {
        this.$Windy = new Windy({
          canvas: canvas,
          projection: (this.$options.hasOwnProperty('projection') ? this.$options.projection : 'EPSG:3857'),
          data: this.getData()
        })
        const extent = this.getExtent()
        this.$Windy.start(extent[0], extent[1], extent[2], extent[3])
        this.onEvents()
      }, 0)
    } else if (canvas && this.$Windy) {
      const extent = this.getExtent()
      this.$Windy.start(extent[0], extent[1], extent[2], extent[3])
    }
    return this
  }

  /**
   * get canvas layer
   */
  getCanvasLayer () {
    if (!this.$canvas && !this.layer_) {
      const extent = this.getMapExtent()
      this.layer_ = new $LayerImage({
        layerName: this.$options.layerName,
        minResolution: this.$options.minResolution,
        maxResolution: this.$options.maxResolution,
        zIndex: this.$options.zIndex,
        extent: extent,
        source: new $ImageCanvasSource({
          canvasFunction: this.canvasFunction.bind(this),
          projection: (this.$options.hasOwnProperty('projection') ? this.$options.projection : 'EPSG:3857'),
          ratio: (this.$options.hasOwnProperty('ratio') ? this.$options.ratio : 1.5)
        })
      })
      this.$Map.addLayer(this.layer_)
      this.$Map.un('precompose', this.reRender, this)
      this.$Map.on('precompose', this.reRender, this)
    }
  }

  /**
   * re render
   */
  reRender () {
    if (!this.layer_) return
    const extent = this.getMapExtent()
    this.layer_.setExtent(extent)
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
    if (!this.$canvas) {
      this.$canvas = createCanvas(size[0], size[1])
    }
    this.render(this.$canvas)
    return this.$canvas
  }

  /**
   * bounds, width, height, extent
   * @returns {*[]}
   */
  getExtent () {
    const size = this.$Map.getSize()
    const _extent = this.$Map.getView().calculateExtent(size)
    const _projection = (this.$options.hasOwnProperty('projection') ? this.$options.projection : 'EPSG:3857')
    const extent = $Proj.transformExtent(_extent, _projection, 'EPSG:4326')
    return [[[0, 0], [size[0], size[1]]], size[0], size[1], [[extent[0], extent[1]], [extent[2], extent[3]]]]
  }

  /**
   * get map current extent
   * @returns {Array}
   */
  getMapExtent () {
    const size = this.$Map.getSize()
    return this.$Map.getView().calculateExtent(size)
  }

  /**
   * append layer to map
   * @param map
   */
  appendTo (map) {
    if (map && map instanceof $Map) {
      this.$Map = map
      this.getCanvasLayer()
    } else {
      throw new Error('not map object')
    }
  }

  /**
   * clear windy layer
   * @private
   */
  clearWind () {
    if (!this.$Map) return
    if (this._timer) window.clearTimeout(this._timer)
    if (this.$Windy) this.$Windy.stop()
    this.$Map.un('precompose', this.reRender, this)
    this.$Map.un('change:size', this.onChangeSize, this)
    this.$Map.removeLayer(this.layer_)
    delete this.$Map
    delete this._timer
    delete this.$Windy
    delete this.layer_
    delete this.$canvas
  }

  /**
   * handle map size change
   */
  onChangeSize () {
    if (!this.$Windy) return
    const extent = this.getExtent()
    this.$Windy.start(extent[0], extent[1], extent[2], extent[3])
  }

  onEvents () {
    const map = this.$Map
    this.unEvents()
    map.on('change:size', this.onChangeSize, this)
  }

  unEvents () {
    const map = this.$Map
    map.un('change:size', this.onChangeSize, this)
  }
}

export default WindyLayer
