// @ts-ignore
import { CanvasLayer, renderer, Coordinate } from 'maptalks';

import WindCore from 'wind-core';

export const Field = WindCore.Field;

export class WindLayerRenderer extends renderer.CanvasLayerRenderer {
  private _drawContext: CanvasRenderingContext2D;
  public canvas: HTMLCanvasElement | undefined;
  public layer: any;
  private context: CanvasRenderingContext2D;
  private wind: any;
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
    if (this._drawContext) {
      if (!this.wind && map) {
        const layer = this.layer;
        const data = layer.getData();

        this.wind = new WindCore(this.context, {}, data);

        this.wind.project = this.project.bind(this);
      }

      this.wind.prerender();

      this.wind.render();
    }
    this.completeRender();
  }

  project(coordinate: [number, number]) {
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

  getMap() {
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

class MaptalksWind extends CanvasLayer {
  private field: any;
  private _map: any;

  constructor(id: string | number, data: any, options: any) {
    super(id, options);

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
   * @returns {MaptalksWind}
   */
  public setData (data: any) {
    // @ts-ignore
    if (data && data instanceof Field) {
      this.field = data;
    } else {
      console.error('inValid');
    }
    return this;
  }

  public draw() {
    if (this._getRenderer()) {
      this._getRenderer()._redraw();
    }
    return this;
  }

  prepareToDraw() {
    return [];
  }

  drawOnInteracting() {
    this.draw();
  }

  private _getRenderer() {
    return super._getRenderer();
  }
}

// @ts-ignore
MaptalksWind.registerRenderer('canvas', WindLayerRenderer);

export default MaptalksWind;
