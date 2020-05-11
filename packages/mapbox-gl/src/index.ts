import * as mapboxgl from 'mapbox-gl';

import WindCore, {
  Field,
  isArray,
  formatData,
  assign,
  defaultOptions,
  IOptions,
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
  }

  onAdd(map: mapboxgl.Map) {
    console.log('addTo', map);

    super.onAdd(map);

    if (!this.map) {
      console.log(this.map);
      return;
    }

    if (this.canvas !== null) {
      // this._retina = window.devicePixelRatio >= 2;

      this.render();
    }
  }

  clearWind() {
  }

  render() {
    if (!this.map) return;
    console.log('render');

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
      this.wind.project = this.unproject.bind(this);
      this.wind.intersectsCoordinate = this.intersectsCoordinate.bind(this);
      this.wind.postrender = () => {
        // @ts-ignore
        // this.setCanvasUpdated();
      };

      this.wind.prerender();
    }
    this.wind.render();
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

export default WindLayer;
