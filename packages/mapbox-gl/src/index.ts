import * as mapboxgl from 'mapbox-gl';

import WindCore, {
  assign,
  defaultOptions,
  Field,
  formatData,
  IOptions,
  isArray,
} from 'wind-core';

import Overlay from './Overlay';

export interface IWindOptions extends IOptions {
  windOptions: Partial<IOptions>;
  [key: string]: any;
}

const defaultConfig = {
  doubleBuffer: false,
  windOptions: defaultOptions,
};

class WindLayer extends Overlay {
  private field: any;
  private wind: WindCore;
  public options: IWindOptions;

  constructor(id: string | number, data: any, options = {}) {
    super(id, Object.assign({}, defaultConfig, options));

    this.field = null;

    this.pickWindOptions();

    if (data) {
      this.setData(data);
    }

    this.stop = this.stop.bind(this);
    this.render = this.render.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  onAdd(map: mapboxgl.Map) {
    super.onAdd(map);

    if (!this.map) {
      throw new Error('map is null');
      return;
    }

    if (this.canvas !== null) {
      // this._retina = window.devicePixelRatio >= 2;

      this.render();
      this.registerEvents();
    }
  }

  handleResize() {
    if (this.canvas) {
      this.resizeCanvas(this.canvas);
    }
    this.render();
  }

  registerEvents() {
    this.map.on('resize', this.handleResize);
    this.map.on('movestart', this.stop);
    this.map.on('moveend', this.render);
    this.map.on('zoomstart', this.stop);
    this.map.on('zoomend', this.render);
    this.map.on('rotatestart', this.stop);
    this.map.on('rotateend', this.render);
    this.map.on('pitchstart', this.stop);
    this.map.on('pitchend', this.render);
  }

  unregisterEvents() {
    this.map.off('resize', this.handleResize);
    this.map.off('movestart', this.stop);
    this.map.off('moveend', this.render);
    this.map.off('zoomstart', this.stop);
    this.map.off('zoomend', this.render);
    this.map.off('rotatestart', this.stop);
    this.map.off('rotateend', this.render);
    this.map.off('pitchstart', this.stop);
    this.map.off('pitchend', this.render);
  }

  stop() {
    if (this.wind) {
      this.wind.clearCanvas();
    }
  }

  render() {
    if (!this.map) return;

    const opt = this.getWindOptions();
    if (!this.wind && this.map && this.canvas !== null) {
      const ctx = this.canvas.getContext('2d');
      if (!ctx) {
        console.error('create canvas context failed');
        return;
      }
      const data = this.getData();

      // @ts-ignore
      this.wind = new WindCore(ctx, opt, data);

      // @ts-ignore
      this.wind.project = this.project.bind(this);
      // @ts-ignore
      this.wind.unproject = this.unproject.bind(this);
      this.wind.intersectsCoordinate = this.intersectsCoordinate.bind(this);
      this.wind.postrender = () => {
        // @ts-ignore
        // this.setCanvasUpdated();
      };
    }

    this.wind.prerender();
    this.wind.render();
  }

  remove() {
    super.remove();

    if (this.wind) {
      this.wind.stop();
    }

    this.unregisterEvents();
  }

  pickWindOptions() {
    Object.keys(defaultOptions).forEach((key: string) => {
      if (key in this.options) {
        if (this.options.windOptions === undefined) {
          this.options.windOptions = {};
        }
        // @ts-ignore
        this.options.windOptions[key] = this.options[key];
      }
    });
  }

  /**
   * get wind layer data
   */
  getData() {
    return this.field;
  }

  /**
   * set layer data
   * @param data
   * @returns {WindLayer}
   */
  setData(data: any) {
    if (data && data.checkFields && data.checkFields()) {
      this.field = data;
    } else if (isArray(data)) {
      this.field = formatData(data);
    } else {
      console.error('Illegal data');
    }

    this?.wind?.updateData(this.field);

    return this;
  }

  setWindOptions(options: Partial<IOptions>) {
    const beforeOptions = this.options.windOptions || {};
    this.options = assign(this.options, {
      windOptions: assign(beforeOptions, options || {}),
    });

    if (this.wind) {
      const windOptions = this.options.windOptions;
      this.wind.setOptions(windOptions);
      this.wind.prerender();
    }
  }

  getWindOptions() {
    return this.options.windOptions || {};
  }
}

export {
  Field,
  WindLayer,
}

export { default as ScalarFill } from './ScalarFill';
export { default as Particles } from './Particles';

export default WindLayer;
