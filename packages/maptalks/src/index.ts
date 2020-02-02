// @ts-ignore
import { CanvasLayer, renderer, Coordinate } from 'maptalks/dist/maptalks.es.js';

import WindCore, {
  Field,
  isArray,
  formatData,
  warnLog,
  assign,
  defaultOptions,
  IOptions,
} from 'wind-core';

export interface IWindOptions extends IOptions {
  windOptions: Partial<IOptions>;
  [key: string]: any;
}

const _options = {
  renderer: 'canvas',
  doubleBuffer: false,
  animation: false,
  windOptions: {},
};

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
        this.wind.intersectsCoordinate = this.intersectsCoordinate.bind(this);
        this.wind.postrender = () => {
          // @ts-ignore
          this.setCanvasUpdated();
        };

        this.wind.prerender();
      }

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

  intersectsCoordinate(coordinate: [number, number]): boolean {
    // const map = this.getMap();
    // const mapExtent = map.getExtent();
    // return mapExtent.contains(new Coordinate(...coordinate)) as boolean;
    return true;
  }

  drawOnInteracting() {
    this.draw();
  }

  onZoomStart(...args: any[]) {
    if (this.wind) {
      this.wind.stop();
    }
    super.onZoomStart.apply(this, args);
  }

  onZoomEnd(...args: any[]) {
    if (this.wind) {
      this.wind.start();
    }
    super.onZoomEnd.apply(this, args);
  }

  onDragRotateStart(...args: any[]) {
    if (this.wind) {
      this.wind.stop();
    }
    super.onDragRotateStart.apply(this, args);
  }

  onDragRotateEnd(...args: any[]) {
    if (this.wind) {
      this.wind.start();
    }
    super.onDragRotateEnd.apply(this, args);
  }

  onMoveStart(...args: any[]) {
    if (this.wind) {
      this.wind.stop();
    }
    super.onMoveStart.apply(this, args);
  }

  onMoveEnd(...args: any[]) {
    if (this.wind) {
      this.wind.start();
    }
    super.onMoveEnd.apply(this, args);
  }

  // onResize() {}

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
  private options: Partial<IWindOptions>;

  constructor(id: string | number, data: any, options: any) {
    super(id, assign({}, _options, options));

    this.field = null;

    this._map = null;

    this.pickWindOptions();

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
  Field,
  WindLayer,
};
