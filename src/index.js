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

  render () {
    if (!this.$canvas) this.getCanvasLayer()
    if (this.$canvas && !this.$Windy) {
      const size = this.$Map.getSize()
      this.$Windy = new Windy({
        canvas: this.$canvas['canvas'],
        width: size[0],
        height: size[1],
        data: this.getData(),
        onDraw: () => {
        }
      })
      this.$Windy.start.apply(this.$Windy, this.getExtent())
    } else {
      this.$Windy.start.apply(this.$Windy, this.getExtent())
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
   * bounds, width, height, extent
   * @returns {*[]}
   */
  getExtent () {
    const size = this.$Map.getSize()
    const extent = this.$Map.getView().calculateExtent(size)
    return [[[0, 0], [size[0], size[1]]], size[0], size[1], [[extent[0], extent[1]], [extent[2], extent[3]]]]
  }

  /**
   * handle map resize
   */
  onResize () {
  }

  /**
   * handle zoom end events
   */
  onZoomEnd () {
    if (!this.$options['hideOnZooming']) {
    }
  }

  /**
   * handle rotate end events
   */
  onDragRotateEnd () {
    if (!this.$options['hideOnRotating']) {
    }
  }

  /**
   * handle move start events
   */
  onMoveStart () {
    if (this.$options['hideOnMoving']) {
    }
  }

  /**
   * handle move end events
   */
  onMoveEnd () {
    if (!this.$options['hideOnMoving']) {
    }
  }

  onCenterChange () {
    //
  }

  /**
   * register events
   * @private
   */
  _registerEvents () {
    const Map = this.$Map
    const view = Map.getView()
    Map.on('change:size', this.onResize, this)
    view.on('change:resolution', this.onZoomEnd, this)
    view.on('change:center', this.onCenterChange, this)
    view.on('change:rotation', this.onDragRotateEnd, this)
    Map.on('movestart', this.onMoveStart, this)
    Map.on('moveend', this.onMoveEnd, this)
  }

  /**
   * un register events
   * @private
   */
  _unRegisterEvents () {
    const Map = this.$Map
    const view = Map.getView()
    Map.un('change:size', this.onResize, this)
    view.un('change:resolution', this.onZoomEnd, this)
    view.un('change:center', this.onCenterChange, this)
    view.un('change:rotation', this.onDragRotateEnd, this)
    Map.un('movestart', this.onMoveStart, this)
    Map.un('moveend', this.onMoveEnd, this)
  }

  _clearWind () {
    if (this.$Windy) this.$Windy.stop()
  }
}

export default WindyLayer
