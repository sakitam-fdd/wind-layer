import { Layer } from 'ol/layer';
import type { PluggableMap} from 'ol';
import { FrameState } from 'ol/PluggableMap';
import WindLayerRender from './renderer';

import { isArray, formatData, assign, defaultOptions } from 'wind-core';

import type { IOptions, IField, Field } from 'wind-core';

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

export class WindLayer extends Layer {
  private field: Field | undefined;
  public _map: any;
  private options: IWindOptions;

  constructor(data: any, options: any) {
    const opt = assign({}, _options, options);

    super(opt);

    this.options = opt;

    // @ts-ignore @tip overwrite for layer className and disable containerReused
    this.className_ = options.className !== undefined ? options.className : 'wind-layer';

    this.pickWindOptions();

    this._map = opt.map || null;

    if (data) {
      this.setData(data, options.fieldOptions);
    }
  }

  /**
   * 兼容旧版调用方式
   * @param map
   */
  public appendTo(map: any) {
    map.addLayer(this);
  }

  private onAdd() {
    const renderer = this.getRenderer();
    if (renderer) {
      renderer.wind?.start();
    }
  }

  private onRemove() {
    const renderer = this.getRenderer();
    if (renderer) {
      renderer.wind.stop();
    }
  }

  protected createRenderer(): any {
    // @ts-ignore need resolve
    return new WindLayerRender(this);
  }

  protected getRenderer() {
    return super.getRenderer() as WindLayerRender;
  }

  private pickWindOptions() {
    Object.keys(defaultOptions).forEach((key: string) => {
      if (key in this.options) {
        if (this.options.windOptions === undefined) {
          this.options.windOptions = {};
        }
        this.options.windOptions[key] = this.options[key];
      }
    });
  }

  /**
   * 获取图层现有数据
   * get wind layer data
   */
  // @ts-ignore overwrite base layer
  public getData() {
    return this.field;
  }

  /**
   * 设置图层数据
   * set layer data
   * @param data
   * @param options
   * @returns {WindLayer}
   */
  public setData(data: any, options: Partial<IField> = {}) {
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

    this.changed();

    return this;
  }

  /**
   * 设置风场图层的配置项
   * @param options
   */
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

    this.changed();
  }

  /**
   * 获取风场图层渲染的配置项
   */
  public getWindOptions() {
    return this.options.windOptions || {};
  }

  render(frameState: FrameState, target: HTMLElement): any {
    const layerRenderer = this.getRenderer();

    if (layerRenderer && layerRenderer.prepareFrame(frameState)) {
      this.rendered = true;
      return layerRenderer.renderFrame(frameState, target);
    }
    return null;
  }

  // since v6
  setMapInternal(map: PluggableMap) {
    super.setMapInternal(map);

    if (!map) {
      this.onRemove();
    } else {
      this.onAdd()
    }
  }

  /**
   * 支持以 setMap 方式添加图层
   * @param map
   */
  public setMap(map: PluggableMap) {
    super.setMap(map);
    if (!map) {
      this.onRemove();
    } else {
      this.onAdd()
    }
  }
}
