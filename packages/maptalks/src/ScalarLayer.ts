// @ts-ignore
import { CanvasLayer, renderer, Coordinate } from 'maptalks/dist/maptalks.es.js';
import { ScalarFill as ScalarCore, getGlContext, clearScene } from 'wind-gl-core';
import { getWidth, Extent } from './utils';

const _options = {
  renderer: 'gl',
  doubleBuffer: false,
  animation: false,
  glOptions: {
    antialias: false,
    depth: false,
    stencil: false,
    alpha: true,
    premultipliedAlpha: true,
    preserveDrawingBuffer: true,
  },
};

export class ScalarLayerRenderer extends renderer.CanvasLayerRenderer {
  public scalarRender: ScalarCore;
  private _drawContext: CanvasRenderingContext2D;
  public canvas: HTMLCanvasElement | undefined;
  public layer: any;
  private gl: WebGLRenderingContext | null;

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

  clearCanvas() {
    if (this.gl) {
      clearScene(this.gl, [0, 0, 0, 0]);
    }
  }

  createContext() {
    if (this.gl && this.gl.canvas === this.canvas) {
      return;
    }

    // @ts-ignore
    this.gl = getGlContext(this.canvas, this.layer.options.glOptions);
  }

  resizeCanvas(canvasSize?: any) {
    if (this.canvas && this.gl) {
      const map = this.getMap();
      const retina = map.getDevicePixelRatio();
      const size = canvasSize || map.getSize();
      this.canvas.height = retina * size.height;
      this.canvas.width = retina * size.width;
      if (this.gl) {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  getMatrix(): number[] {
    const map = this.getMap();
    // const extent = map._get2DExtent(map.getGLZoom());
    // const uMatrix = mat4.identity(new Float32Array(16));
    // mat4.translate(uMatrix, uMatrix, [extent.xmin, extent.ymax, 0]);
    // mat4.scale(uMatrix, uMatrix, [1, 1, 1]);
    // mat4.multiply(uMatrix, map.projViewMatrix, uMatrix);
    return map.projViewMatrix;
  }

  handleZoom() {
    if (this.scalarRender) {
      this.scalarRender.handleZoom();
    }
  }

  drawWind() {
    const map = this.getMap();
    if (this.gl !== null) {
      const layer = this.layer;
      const opt = layer.getOptions();
      const data = layer.getData();
      if (!this.scalarRender && map) {
        this.scalarRender = new ScalarCore(this.gl, {
          opacity: opt.opacity,
          renderForm: opt.renderForm,
          styleSpec: opt.styleSpec,
          getZoom: () => this.getMap().getZoom(),
          triggerRepaint: () => {
            this._redraw();
          }
        });

        this.scalarRender.getMercatorCoordinate = ([lng, lat]: [number, number]) => {
          const coords = map.coordToPoint(new Coordinate(lng, lat), map.getGLZoom());
          return [
            coords.x,
            coords.y,
          ];
        };

        this.getMap().on('zoom', this.handleZoom, this);

        this.scalarRender.setData(data);
      }

      if (this.scalarRender) {
        const projObject = map.getProjection().fullExtent;
        const projectionExtent = [projObject.left, projObject.bottom, projObject.right, projObject.top] as Extent;
        const projExtent = map.getProjExtent();
        const extent = [projExtent.xmin, projExtent.ymin, projExtent.xmax, projExtent.ymax];
        let startX = extent[0];
        const worldWidth = getWidth(projectionExtent);
        let world = 0;
        let offsetX;
        this.scalarRender.render(this.getMatrix(), 0);
        while (startX < projectionExtent[0]) {
          --world;
          offsetX = worldWidth * world;
          this.scalarRender.render(this.getMatrix(), world);
          startX += worldWidth;
        }
        world = 0;
        startX = extent[2];
        while (startX > projectionExtent[2]) {
          ++world;
          offsetX = worldWidth * world;
          this.scalarRender.render(this.getMatrix(), world);
          startX -= worldWidth;
        }
      }
    }
    this.completeRender();
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

  onDragRotateStart(...args: any[]) {
    super.onDragRotateStart.apply(this, args);
  }

  onDragRotateEnd(...args: any[]) {
    super.onDragRotateEnd.apply(this, args);
  }

  onMoveStart(...args: any[]) {
    super.onMoveStart.apply(this, args);
  }

  onMoveEnd(...args: any[]) {
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

  public completeRender() {
    return super.completeRender();
  }
}

export class ScalarLayer extends CanvasLayer {
  private data: any;
  private _map: any;
  private options: any;

  constructor(id: string | number, data: any, options: any) {
    super(id, Object.assign({}, _options, options));

    this.data = null;

    this._map = null;

    if (data) {
      this.setData(data);
    }
  }

  /**
   * get wind layer data
   */
  public getData () {
    return this.data;
  }

  /**
   * set layer data
   * @param data
   * @returns {Promise<any>>}
   */
  public setData (data: any) {
    return new Promise((resolve, reject) => {
      this.data = data;
      const renderer = this._getRenderer();
      if (this.data && renderer && renderer.scalarFill) {
        renderer.scalarFill.setData(this.data, (status: boolean) => {
          if (status) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      } else {
        resolve(false);
      }
    });
  }

  public setOptions(options: any) {
    this.options = Object.assign({}, this.options, options || {});

    const renderer = this._getRenderer();
    if (renderer && renderer.scalarRender) {
      renderer.scalarRender.updateOptions(this.options);
    }
  }

  public getOptions() {
    return this.options || {};
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
ScalarLayer.registerRenderer('gl', ScalarLayerRenderer);
