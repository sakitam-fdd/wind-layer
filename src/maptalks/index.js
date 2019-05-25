import { Layer, renderer, SpatialReference } from 'maptalks';
import Windy from '../windy/windy';

const defaultConfig = {
  minVelocity: 0, // 粒子强度最小的速度 (m/s)
  maxVelocity: 10, // 粒子强度最大的速度 (m/s)
  velocityScale: 0.05, // 风速的比例
  particleAge: 90, // 重绘之前生成的离子数量的最大帧数
  lineWidth: 1, // 绘制粒子的线宽
  particleMultiplier: 1 / 300, // 离子数量
  colorScale: undefined,
  animate: true
};

class Renderer extends renderer.CanvasRenderer {
  _initialize () {
    const map = this.getMap();
    const params = this.layer.getParams();
    let sr = this.layer.getSpatialReference();
    if (!sr) {
      sr = map.getSpatialReference();
    }
    const proj = sr.getProjection();
    this._windy = new Windy({
      canvas: this.canvas,
      data: this.layer.getData(),
      projection: proj.code || 'EPSG:4326',
      onDraw: () => {
        this.setCanvasUpdated();
      },
      ...params
    });
  }

  draw () {
    const extent = this._getWindExtents();
    this.prepareCanvas();
    if (!this._windy) {
      this._initialize();
    }
    this._windy && this._windy.start(...extent);
  }

  _redraw () {
    this.prepareRender();
    this.draw();
  }

  drawOnInteracting () {
    // nothing to draw when interacting
  }

  _getWindExtents () {
    const map = this.getMap();
    if (!map) return null;
    const extent = map.getExtent();
    const xmin = extent.xmin;
    const xmax = extent.xmax > 0 ? extent.xmax : 360 + extent.xmax;
    const ymin = extent.ymin;
    const ymax = extent.ymax;
    return [
      [[0, 0], [map.width, map.height]],
      map.width,
      map.height,
      [[
        xmin,
        ymin
      ], [
        xmax,
        ymax
      ]]
    ];
  }

  _updateParams () {
    if (this._windy) {
      const params = this.layer.getParams();
      this._windy.updateParams(params);
      this.draw();
    }
  }

  /**
   * tell layer redraw
   * @returns {*}
   */
  needToRedraw () {
    const map = this.getMap();
    if (map.isZooming() && !map.getPitch()) {
      return false;
    }
    return super.needToRedraw();
  }

  onZoomStart () {
    // this._windy && this._windy.stop();
    // eslint-disable-next-line prefer-rest-params
    super.onZoomStart.apply(this, arguments);
  }

  onZoomEnd () {
    // eslint-disable-next-line prefer-rest-params
    super.onZoomEnd.apply(this, arguments);
  }

  onDragRotateStart () {
    // this._windy && this._windy.stop();
  }

  onMoveStart () {
    // this._windy && this._windy.stop();
  }

  remove () {
    if (this._windy) {
      this._windy.stop();
      delete this._windy;
    }
    super.remove();
  }
}

class MaptalksWindy extends Layer {
  constructor (id, data, options) {
    super(id, Object.assign(defaultConfig, options));
    this._data = data;
  }

  getData () {
    return this._data;
  }

  setData (data) {
    this._data = data;
    this.redraw();
    return this;
  }

  updateParams (params) {
    const renderer = this._getRenderer();
    this.options = Object.assign(this.options, params);
    if (renderer) {
      const {
        minVelocity, // 粒子强度最小的速度 (m/s)
        maxVelocity, // 粒子强度最大的速度 (m/s)
        velocityScale, // 风速的比例
        particleAge, // 重绘之前生成的离子数量的最大帧数
        lineWidth, // 绘制粒子的线宽
        particleMultiplier, // 离子数量
        colorScale
      } = this.options;
      renderer._updateParams({
        minVelocity, // 粒子强度最小的速度 (m/s)
        maxVelocity, // 粒子强度最大的速度 (m/s)
        velocityScale, // 风速的比例
        particleAge, // 重绘之前生成的离子数量的最大帧数
        lineWidth, // 绘制粒子的线宽
        particleMultiplier, // 离子数量
        colorScale
      });
    }
    return this;
  }

  getParams () {
    const {
      minVelocity,
      maxVelocity,
      velocityScale,
      particleAge,
      lineWidth,
      particleMultiplier,
      colorScale
    } = this.options;
    return {
      minVelocity,
      maxVelocity,
      velocityScale,
      particleAge,
      lineWidth,
      particleMultiplier,
      colorScale
    };
  }

  onResize () {}

  onZoomStart () {}

  onZooming () {}

  onZoomEnd () {}

  onMoveStart () {}

  onMoving () {}

  onMoveEnd () {}

  redraw () {
    const renderer = this._getRenderer();
    if (renderer) {
      renderer._redraw();
    }
    return this;
  }

  toJSON () {
    return {
      type: 'MaptalksWindy',
      id: this.getId(),
      options: this.config(),
      data: this.getData()
    };
  }

  getSpatialReference () {
    const map = this.getMap();
    if (map && (!this.options.spatialReference || SpatialReference.equals(this.options.spatialReference, map.options.spatialReference))) {
      return map.getSpatialReference();
    }
    this._sr = this._sr || new SpatialReference(this.options.spatialReference);
    return this._sr;
  }

  static fromJSON (json) {
    if (!json || json.type !== 'MaptalksWindy') { return null; }
    // eslint-disable-next-line new-cap
    const layer = new MaptalksWindy(json.id, json.data, json.options);
    return layer;
  }
}

MaptalksWindy.registerRenderer('canvas', Renderer);

export default MaptalksWindy;
