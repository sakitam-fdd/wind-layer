import { Layer } from 'ol/layer';
import WindLayerRender from './renderer';
import { Map } from 'ol';
import { getDirection, getSpeed } from '../helper';

export default class OlWindy extends Layer {
  constructor (data, options = {}) {
    super(options);

    this.options = options;

    if (data) {
      this.setData(data);
    }
  }

  // public getType(): LayerType {
  //   return 'CUSTOM' as LayerType;
  // };

  render (frameState, target) {
    const layerRenderer = this.getRenderer();

    if (layerRenderer.prepareFrame(frameState)) {
      return layerRenderer.renderFrame(frameState, target);
    }
  }

  getRenderer () {
    if (!this.renderer_) {
      this.renderer_ = this.createRenderer();
    }
    return this.renderer_;
  }

  /**
   * @return {boolean} The layer has a renderer.
   */
  hasRenderer () {
    return !!this.renderer_;
  }

  createRenderer () {
    return new WindLayerRender(this);
  }

  getData () {
    return this.data;
  }

  setData (data) {
    if (data) {
      this.data = data;
    } else {
      // eslint-disable-next-line no-console
      console.error('Illegal data');
    }
    return this;
  }

  /**
   * append layer to map
   * @param map
   */
  appendTo (map) {
    if (map && map instanceof Map) {
      map.addLayer(this);
    } else {
      throw new Error('not map object');
    }
  }

  /**
   * get mouse point data
   * @param coordinates
   * @returns {null|{speed: (*|number), direction}}
   */
  getPointData (coordinates) {
    const layerRenderer = this.getRenderer();
    if (!layerRenderer || !layerRenderer.wind) return null;
    const gridValue = layerRenderer.wind.interpolatePoint(coordinates[0], coordinates[1]);
    if (gridValue && !isNaN(gridValue[0]) && !isNaN(gridValue[1]) && gridValue[2]) {
      return {
        direction: getDirection(gridValue[0], gridValue[1], this.options.angleConvention || 'bearingCCW'),
        speed: getSpeed(gridValue[0], gridValue[1], this.options.speedUnit)
      }
    }
  }

  /**
   * clearWind method will retain the instance
   * @returns {null}
   */
  clearWind () {
    const layerRenderer = this.getRenderer();
    if (!layerRenderer || !layerRenderer.wind) return null;
    layerRenderer.wind.stop();
    this.changed();
  }

  /**
   * remove layer this instance will be destroyed after remove
   */
  removeLayer () {
    const layerRenderer = this.getRenderer();
    if (!layerRenderer || !layerRenderer.wind) return null;
    layerRenderer.wind.stop();
    console.warn('You should use `map.removeLayer()` to remove this layer!');
  }

  /**
   * update windy config
   * @param params
   * @returns {OlWindy}
   */
  updateParams (params = {}) {
    const layerRenderer = this.getRenderer();
    this.options = Object.assign(this.options, params);
    if (this.layerRenderer && layerRenderer.wind) {
      const {
        minVelocity, // 粒子强度最小的速度 (m/s)
        maxVelocity, // 粒子强度最大的速度 (m/s)
        velocityScale, // 风速的比例
        particleAge, // 重绘之前生成的离子数量的最大帧数
        lineWidth, // 绘制粒子的线宽
        particleMultiplier, // 离子数量
        colorScale
      } = this.options;
      this.$Windy.updateParams({
        minVelocity,
        maxVelocity,
        velocityScale,
        particleAge,
        lineWidth,
        particleMultiplier,
        colorScale,
        devicePixelRatio: this.options.devicePixelRatio
      });
    }
    return this;
  }

  /**
   * get windy config
   * @returns {*}
   */
  getParams () {
    const layerRenderer = this.getRenderer();
    if (layerRenderer && layerRenderer.wind) {
      return layerRenderer.wind.getParams();
    }
  }
}
