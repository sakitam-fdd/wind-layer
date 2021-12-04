import { Layer } from 'ol/layer';
import { FrameState } from 'ol/PluggableMap';
import WindLayerRender from './renderer';

import {
  isArray,
  formatData,
  warnLog,
  assign,
  defaultOptions,
  Field,
} from 'wind-core';

import type { IOptions, IField } from 'wind-core';

const _options = {
  forceRender: true,
  windOptions: {},
};

export { Field } from 'wind-core';

export interface IWindOptions extends IOptions {
  forceRender: boolean;
  windOptions: Partial<IOptions>;
  fieldOptions: Partial<IField>;
  [key: string]: any;
}

export class WindLayer extends Layer<any, any> {
  private field: Field | undefined;
  public _map: any;
  private options: IWindOptions;
  private renderer_: WindLayerRender;

  // protected createRenderer(): LayerRenderer<Layer<Source>>;

  constructor(data: any, options: any) {
    const opt = assign({}, _options, options);

    super(opt);

    this.options = opt;

    this.pickWindOptions();

    this._map = opt.map || null;

    if (data) {
      this.setData(data, options.fieldOptions);
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

  public hasRenderer() {
    return !!this.renderer_;
  }

  protected createRenderer() {
    // @ts-ignore
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
  // @ts-ignore
  public getData () {
    return this.field;
  }

  /**
   * set layer data
   * @param data
   * @param options
   * @returns {WindLayer}
   */
  public setData (data: any, options: Partial<IField> = {}) {
    if (data && data.checkFields && data.checkFields()) {
      this.field = data;
    } else if (isArray(data)) {
      this.field = formatData(data, options);
    } else {
      console.error('Illegal data');
    }

    const renderer = this.getRenderer();
    if (renderer && this.field) {
      renderer.setData(this.field);
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
    if (renderer) {
      const windOptions = this.options.windOptions;
      renderer.setOptions(windOptions);
    }
  }

  public getWindOptions() {
    return this.options.windOptions || {};
  }
}
