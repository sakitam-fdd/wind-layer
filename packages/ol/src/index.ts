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
  forceRender: true,
  windOptions: {},
};

export { Field } from 'wind-core';

export interface IWindOptions extends IOptions {
  forceRender: boolean;
  windOptions: Partial<IOptions>;
  [key: string]: any;
}

interface Interface {

}

export class WindLayer extends Layer implements Interface {
  private field: any;
  public _map: any;
  private options: IWindOptions;
  private renderer_: WindLayerRender;

  // protected createRenderer(): LayerRenderer<Layer<Source>>;

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

  public getWrapX(): boolean | undefined {
    return this.get('wrapX');
  }

  public hasRenderer() {
    return !!this.renderer_;
  }

  protected createRenderer() {
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
    if (data && data.checkFields && data.checkFields()) {
      this.field = data;
    } else if (isArray(data)) {
      this.field = formatData(data);
    } else {
      console.error('Illegal data');
    }

    const renderer = this.getRenderer();
    if (renderer && renderer.oRender) {
      renderer.oRender.setData(this.field);
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
    if (renderer && renderer.oRender) {
      const windOptions = this.options.windOptions;
      renderer.oRender.setOptions(windOptions);
    }
  }

  public getWindOptions() {
    return this.options.windOptions || {};
  }
}
