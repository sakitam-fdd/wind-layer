import ol from 'openlayers'
import Windy from './windy'

/**
 * get parent container
 * @param selector
 */
const getTarget = (selector) => {
  let dom = (function () {
    let found
    return (document && /^#([\w-]+)$/.test(selector))
      ? ((found = document.getElementById(RegExp.$1)) ? [found] : [])
      : Array.prototype.slice.call(/^\.([\w-]+)$/.test(selector)
        ? document.getElementsByClassName(RegExp.$1)
        : /^[\w-]+$/.test(selector) ? document.getElementsByTagName(selector)
          : document.querySelectorAll(selector)
      )
  })()
  return dom
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
  }

  getData () {
    return this.$data
  }

  setData (data) {
    this.$data = data
    this.render()
    return this
  }

  initLayer () {
    if (!this.$container) {
      this._createLayerContainer(this.$Map, this.$options)
      this._resizeContainer()
    }
  }

  render () {
    if (!this.$canvas) {
      this.initLayer()
      this.$Windy = new Windy({
        canvas: this.$canvas,
        data: this.getData(),
        onDraw: () => {
          // this.setCanvasUpdated()
        }
      })
      this.$Windy.start.apply(this.$Windy, this.getExtent())
    } else {
      // this.prepareCanvas()
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
      this.$Map.once('postrender', this.render, this)
      this.$Map.renderSync()
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
    this._resizeContainer()
    this.render()
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

  /**
   * creat eclayer container
   * @param map
   * @param options
   * @private
   */
  _createLayerContainer (map, options) {
    const container = this.$canvas = this.$container = document.createElement('canvas')
    container.style.position = 'absolute'
    container.style.top = 0
    container.style.left = 0
    container.style.right = 0
    container.style.bottom = 0
    let _target = getTarget(options['target'])
    if (_target && _target[0] && _target[0] instanceof Element) {
      _target[0].appendChild(container)
    } else {
      let _target = getTarget('.ol-overlaycontainer')
      if (_target && _target[0] && _target[0] instanceof Element) {
        _target[0].appendChild(container)
      } else {
        map.getViewport().appendChild(container)
      }
    }
  }

  /**
   * Reset the container size
   * @private
   */
  _resizeContainer () {
    const size = this.$Map.getSize()
    this.$container.style.height = size[1] + 'px'
    this.$container.style.width = size[0] + 'px'
  }
}

export default WindyLayer
