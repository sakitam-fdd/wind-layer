import ol from 'openlayers'
import Windy from './windy'

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
    this.$data = data
    this.getCanvasLayer()
    return this
  }

  /**
   * render windy layer
   * @returns {WindyLayer}
   */
  render (canvas) {
    if (canvas && !this.$Windy) {
      if (this._timer) window.clearTimeout(this._timer)
      this._timer = window.setTimeout(() => {
        this.$Windy = new Windy({
          canvas: canvas,
          data: this.getData(),
          onDraw: () => {
          }
        })
        const extent = this.getExtent()
        this.$Windy.start(extent[0], extent[1], extent[2], extent[3])
      }, 750)
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
      this.layer_ = new ol.layer.Image({
        minResolution: this.$options.minResolution,
        maxResolution: this.$options.maxResolution,
        zIndex: this.$options.zIndex,
        extent: extent,
        source: new ol.source.ImageCanvas({
          canvasFunction: this.canvasFunction.bind(this),
          projection: 'EPSG:4326'
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
      const canvas = createCanvas(size[0], size[1])
      this.$canvas = canvas
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
    const extent = this.$Map.getView().calculateExtent(size)
    return [[[0, 0], [size[0], size[1]]], size[0], size[1], [[extent[0], extent[1]], [extent[2], extent[3]]]]
  }

  /**
   * get map current extent
   * @returns {ol.Extent}
   */
  getMapExtent () {
    const size = this.$Map.getSize()
    const extent = this.$Map.getView().calculateExtent(size)
    return extent
  }

  /**
   * append layer to map
   * @param map
   */
  appendTo (map) {
    if (map && map instanceof ol.Map) {
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
  _clearWind () {
    if (this._timer) window.clearTimeout(this._timer)
    if (this.$Windy) this.$Windy.stop()
  }
}

export default WindyLayer
