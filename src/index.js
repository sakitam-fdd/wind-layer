import ol from 'openlayers'
import Windy from './windy'

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
  }

  getData () {
    return this.$data
  }

  setData (data) {
    this.$data = data
    this.getCanvasLayer()
    return this
  }

  getCanvasLayer () {
    if (!this.$canvas) {
      const layers = this.$Map.getLayers().getArray()
      const layer = layers.find(element => {
        return element.get('layerName') === this.$options.layerName
      })
      if (layer) {
        this.layer_ = layer
        this.layer_.once('postcompose', (event) => {
          let ctx = event.context
          this.$canvas = ctx
          this.render()
          ctx.restore()
        }, this)
      }
    }
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

  render () {
    if (!this.$canvas) this.getCanvasLayer()
    if (this.$canvas && !this.$Windy) {
      this.$Windy = new Windy({
        canvas: this.$canvas['canvas'],
        data: this.getData(),
        onDraw: () => {
        }
      })
      if (this._timer) window.clearTimeout(this._timer)
      this._timer = window.setTimeout(() => {
        const extent = this.getExtent()
        this.$Windy.start(extent[0], extent[1], extent[2], extent[3])
      }, 750)
    } else if (this.$canvas && this.$Windy) {
      const extent = this.getExtent()
      this.$Windy.start(extent[0], extent[1], extent[2], extent[3])
    }
    return this
  }

  /**
   * append layer to map
   * @param map
   */
  appendTo (map) {
    if (map && map instanceof ol.Map) {
      this.$Map = map
      this.getCanvasLayer()
      this._unRegisterEvents()
      this._registerEvents()
    } else {
      throw new Error('not map object')
    }
  }

  /**
   * register events
   * @private
   */
  _registerEvents () {
    const Map = this.$Map
    const view = Map.getView()
    Map.on('change:size', this.render, this)
    Map.on('precompose', this.render, this)
    view.on('change:center', this.render, this)
    view.on('change:rotation', this.render, this)
    Map.on('movestart', this.render, this)
    Map.on('moveend', this.render, this)
  }

  /**
   * un register events
   * @private
   */
  _unRegisterEvents () {
    const Map = this.$Map
    const view = Map.getView()
    Map.un('change:size', this.render, this)
    Map.un('precompose', this.render, this)
    view.un('change:center', this.render, this)
    view.un('change:rotation', this.render, this)
    Map.un('movestart', this.render, this)
    Map.un('moveend', this.render, this)
  }

  _clearWind () {
    if (this._timer) window.clearTimeout(this._timer)
    if (this.$Windy) this.$Windy.stop()
  }
}

export default WindyLayer
