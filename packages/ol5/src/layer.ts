import { Map } from 'ol';
import { Extent as IExtent } from 'ol/extent';
import { Image as ImageLayer } from 'ol/layer'; // FIXME: should use Layer, but not export, use ImageLayer instead.
import {
  assign,
  defaultOptions,
  formatData,
  IOptions,
  isArray,
  warnLog,
} from 'wind-core';

import WindLayerRender from './renderer';

export interface IWindOptions extends IOptions {
  opacity?: number;
  map?: Map;
  visible?: boolean;
  extent?: IExtent;
  minResolution?: number;
  maxResolution?: number;
  zIndex?: number;
  windOptions: Partial<IOptions>;
  [key: string]: any;
}

declare enum LayerType {
  IMAGE = 'IMAGE',
  TILE = 'TILE',
  VECTOR_TILE = 'VECTOR_TILE',
  VECTOR = 'VECTOR',
  WIND = 'WIND',
}

const _options = {
  windOptions: {},
};

export interface IWindOptions extends IOptions {
  windOptions: Partial<IOptions>;
  // [key: string]: any;
}

class PerfWindLayer extends ImageLayer {
  private field: any;
  public _map: any;
  private options: IWindOptions;
  // @ts-ignore
  private type: LayerType;

  constructor(data: any, options: any) {
    const opt = assign({}, _options, options);
    super(opt);

    this.field = null;

    this.options = opt;

    this.type = 'WIND' as LayerType;

    this.pickWindOptions();

    this._map = opt.map || null;

    if (data) {
      this.setData(data);
    }
  }

  private pickWindOptions() {
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
  public getData () {
    return this.field;
  }

  /**
   * set layer data
   * @param data
   * @returns {WindLayer}
   */
  public setData (data: any) {
    if (data && data.checkFields && data.checkFields()) {
      this.field = data;
    } else if (isArray(data)) {
      this.field = formatData(data);
    } else {
      console.error('Illegal data');
    }
    return this;
  }

  public updateParams(options : Partial<IOptions> = {}) {
    warnLog('will move to setWindOptions');
    this.setWindOptions(options);
    return this;
  }

  public getParams() {
    warnLog('will move to getWindOptions');
    return this.getWindOptions();
  }

  public setWindOptions(options: Partial<IOptions>) {
    const beforeOptions = this.options.windOptions || {};
    this.options = assign(this.options, {
      windOptions: assign(beforeOptions, options || {}),
    });
  }

  public getWindOptions() {
    return this.options.windOptions || {};
  }

  public getSourceState(): any {
    return !!this.field ? 'ready': undefined;
  }

  // @ts-ignore
  public getType(): LayerType {
    return this.type;
  }

  public setMap(map: Map): void {
    super.setMap(map);
  }
}

export {
  PerfWindLayer,
  WindLayerRender,
};
