import { Layer } from 'ol/layer';
import { FrameState } from 'ol/PluggableMap';
import WindLayerRender from './renderer';

import {
  Field,
  isArray,
  formatData,
  warnLog,
  assign,
  defaultOptions,
  IOptions,
} from 'wind-core';

const _options = {
  windOptions: {},
};

export { Field } from 'wind-core';

export interface IWindOptions extends IOptions {
  windOptions: Partial<IOptions>;
  [key: string]: any;
}

export class WindLayer extends Layer {
  private field: any;
  public _map: any;
  private options: IWindOptions;
  private renderer_: WindLayerRender;

  constructor(data: any, options: any) {
    const opt = assign({}, _options, options);
    super(opt);

    this.field = null;

    this.options = opt;

    this.pickWindOptions();

    this._map = opt.map || null;

    if (data) {
      this.setData(data);
    }
  }

  // @ts-ignore
  public render(frameState: FrameState, target: HTMLDivElement) {
    const layerRenderer = this.getRenderer();

    if (layerRenderer.prepareFrame(frameState)) {
      return layerRenderer.renderFrame(frameState, target);
    }
  }

  public getRenderer() {
    if (!this.renderer_) {
      this.renderer_ = this.createRenderer();
    }
    return this.renderer_;
  }

  hasRenderer() {
    return !!this.renderer_;
  }

  private createRenderer() {
    return new WindLayerRender(this);
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
    if (data && data instanceof Field) {
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

    const renderer = this.getRenderer();
    if (renderer && renderer.wind) {
      const windOptions = this.options.windOptions;
      renderer.wind.setOptions(windOptions);
    }
  }

  public getWindOptions() {
    return this.options.windOptions || {};
  }
}
