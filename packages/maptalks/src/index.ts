// @ts-ignore
import { CanvasLayer, renderer, Coordinate } from 'maptalks';

import WindCore from 'wind-core';

const _options = {
  renderer: 'canvas',
  doubleBuffer: false,
  animation: false,
  windOptions: {},
};

export const Field = WindCore.Field;

export interface IWindLayerRenderer {}

export class WindLayerRenderer extends renderer.CanvasLayerRenderer implements IWindLayerRenderer {
  private _drawContext: CanvasRenderingContext2D;
  public canvas: HTMLCanvasElement | undefined;
  public layer: any;
  private context: CanvasRenderingContext2D;
  private wind: WindCore;
  checkResources() {
    return [];
  }

  getDrawParams() {
    return [];
  }

  hitDetect() {
    return false;
  }

  draw() {
    this.prepareCanvas();
    this.prepareDrawContext();
    this.drawWind();
  }

  _redraw() {
    this.prepareRender();
    this.draw();
  }

  drawWind() {
    const map = this.getMap();
    if (this.context) {
      if (!this.wind && map) {
        const layer = this.layer;
        const opt = layer.getWindOptions();
        const data = layer.getData();

        this.wind = new WindCore(this.context, opt, data);

        this.wind.project = this.project.bind(this);
        this.wind.postrender = () => {
          // @ts-ignore
          this.setCanvasUpdated();
        };
      }

      this.wind.prerender();

      this.wind.render();
    }
    this.completeRender();
  }

  project(coordinate: [number, number]): [number, number] {
    const map = this.getMap();
    const pixel = map.coordinateToContainerPoint(new Coordinate(...coordinate));
    return [
      pixel.x,
      pixel.y,
    ];
  }

  drawOnInteracting() {
    this.draw();
  }

  onZoomStart(...args: any[]) {
    super.onZoomStart.apply(this, args);
  }

  onZoomEnd(...args: any[]) {
    super.onZoomEnd.apply(this, args);
  }

  remove() {
    delete this._drawContext;
    super.remove();
  }

  public getMap() {
    return super.getMap();
  }

  private prepareCanvas() {
    return super.prepareCanvas();
  }


  private prepareDrawContext() {
    super.prepareDrawContext();
  }

  private prepareRender() {
    return super.prepareRender();
  }

  private completeRender() {
    return super.completeRender();
  }
}

class WindLayer extends CanvasLayer {
  private field: any;
  private _map: any;
  private options: any;

  constructor(id: string | number, data: any, options: any) {
    super(id, Object.assign({}, _options, options));

    this.field = null;

    this._map = null;

    if (data) {
      this.setData(data);
    }
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
    // @ts-ignore
    if (data) {
      this.field = data;
    } else {
      console.error('inValid');
    }
    return this;
  }

  public updateParams(options = {}) {
    console.warn('will move to setWindOptions');
    this.setWindOptions(options);
    return this;
  }

  public getParams() {
    console.warn('will move to getWindOptions');
    return this.getWindOptions();
  }

  public setWindOptions(options: any) {
    this.options = Object.assign(this.options, {
      windOptions: options || {},
    });

    const renderer = this._getRenderer();
    if (renderer && renderer.wind) {
      const windOptions = this.options.windOptions;
      renderer.wind.setOptions(windOptions);
    }
  }

  public getWindOptions() {
    return this.options.windOptions || {};
  }

  public draw() {
    if (this._getRenderer()) {
      this._getRenderer()._redraw();
    }
    return this;
  }

  private prepareToDraw() {
    return [];
  }

  private drawOnInteracting() {
    this.draw();
  }

  private _getRenderer() {
    return super._getRenderer();
  }
}

// @ts-ignore
WindLayer.registerRenderer('canvas', WindLayerRenderer);

export {
  WindLayer,
};
