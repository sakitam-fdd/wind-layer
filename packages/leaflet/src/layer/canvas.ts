import type { Field, IField, IOptions } from 'wind-core';
import { assign, defaultOptions, formatData, isArray, WindCore } from 'wind-core';

import { BaseLayer } from './Base';

export class WindLayer extends BaseLayer {
  field: Field | undefined;
  wind: WindCore | null;

  initialize(id: string | number, data: any, options: any) {
    super.initialize(id, data, options);

    this.field = undefined;

    this.pickWindOptions();
    if (data) {
      this.setData(data, options.fieldOptions);
    }
  }

  _render() {
    this._reset();

    const opt = this.getWindOptions();
    if (!this.wind && this._map) {
      const ctx = this.canvas!.getContext('2d');
      const data = this.getData();

      this.wind = new WindCore(ctx!, opt, data);

      this.wind.project = this.project.bind(this);
      this.wind.unproject = this.unproject.bind(this);
      this.wind.intersectsCoordinate = this.intersectsCoordinate.bind(this);
      this.wind.postrender = () => {
        // @ts-ignore
        // this.setCanvasUpdated();
      };
    }

    this.wind!.prerender();

    this.wind!.render();
  }

  onRemove(): this {
    if (this.wind) {
      this.wind.stop();
      this.wind = null;
    }
    return super.onRemove();
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
   * @param options
   * @returns {WindLayer}
   */
  setData(data: any, options: Partial<IField> = {}) {
    if (data && data.checkFields && data.checkFields()) {
      this.field = data;
    } else if (isArray(data)) {
      this.field = formatData(data, options);
    } else {
      console.error('Illegal data');
    }

    if (this.field) {
      this?.wind?.updateData(this.field);
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
      this.wind.prerender();
    }
  }

  getWindOptions() {
    return this.options.windOptions || {};
  }
}
