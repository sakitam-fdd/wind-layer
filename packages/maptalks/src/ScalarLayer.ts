import {
  CanvasLayer,
  Coordinate,
  renderer,
  // @ts-ignore
} from 'maptalks/dist/maptalks.es.js';
import {
  clearScene,
  fp64LowPart,
  getGlContext,
  IOptions,
  IPlaneBuffer,
  ScalarFill as ScalarCore,
} from 'wind-gl-core';
import { Extent, getWidth } from './utils';

export interface IScalarFillOptions extends IOptions {
  wrapX: boolean;
  doubleBuffer: boolean;
  animation: boolean;
  glOptions: {
    antialias?: boolean;
    depth?: boolean;
    stencil?: boolean;
    alpha?: boolean;
    premultipliedAlpha?: boolean;
    preserveDrawingBuffer?: boolean;
  };
}

const defaultLayerOptions = {
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
  public canvas: HTMLCanvasElement | undefined;
  public layer: any;
  private _drawContext: CanvasRenderingContext2D;
  private gl: WebGLRenderingContext | null;

  public checkResources() {
    return [];
  }

  public getDrawParams() {
    return [];
  }

  public hitDetect() {
    return false;
  }

  public draw() {
    this.prepareCanvas();
    this.prepareDrawContext();
    this.drawWind();
  }

  public _redraw() {
    this.prepareRender();
    this.draw();
  }

  public clearCanvas() {
    if (this.gl) {
      clearScene(this.gl, [0, 0, 0, 0]);
    }
  }

  public createContext() {
    if (this.gl && this.gl.canvas === this.canvas) {
      return;
    }

    // @ts-ignore
    this.gl = getGlContext(this.canvas, this.layer.options.glOptions);
  }

  public resizeCanvas(canvasSize?: any) {
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

  public getMatrix(): number[] {
    const map = this.getMap();
    // const extent = map._get2DExtent(map.getGLZoom());
    // const uMatrix = mat4.identity(new Float32Array(16));
    // mat4.translate(uMatrix, uMatrix, [extent.xmin, extent.ymax, 0]);
    // mat4.scale(uMatrix, uMatrix, [1, 1, 1]);
    // mat4.multiply(uMatrix, map.projViewMatrix, uMatrix);
    return map.projViewMatrix;
  }

  public handleZoom() {
    if (this.scalarRender) {
      this.scalarRender.handleZoom();
    }
  }

  public drawWind() {
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
          displayRange: opt.displayRange,
          mappingRange: opt.mappingRange,
          widthSegments: opt.widthSegments,
          heightSegments: opt.heightSegments,
          createPlaneBuffer: opt.createPlaneBuffer,
          depthRange: opt.depthRange || [0.0, 1.0],
          getZoom: () => this.getMap().getZoom(),
          triggerRepaint: () => {
            this._redraw();
          },
          injectShaderModules: {
            '#modules-transformZ': `
float transformZ(float value, vec3 pos) {
  return value;
}
    `,
            '#modules-project': `
gl_Position = u_matrix * vec4(pos.xy + vec2(u_offset, 0.0), pos.z + z, 1.0);
    `,
          },
        });

        this.scalarRender.getMercatorCoordinate = ([lng, lat]: [
          number,
          number,
        ]) => {
          const coords = map.coordToPoint(
            new Coordinate(lng, lat),
            map.getGLZoom(),
          );
          return [coords.x, coords.y];
        };

        this.getMap().on('zoom', this.handleZoom, this);

        this.scalarRender.setData(data);
      }

      if (this.scalarRender) {
        const matrix = this.getMatrix();
        const cameraEye = [
          // ...map.cameraPosition,
          // 1,
          0,
          0,
          0,
          1,
        ];
        const cameraEye64Low = cameraEye.map((item: number) =>
          fp64LowPart(item),
        );

        const worlds = this.getWrappedWorlds();
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < worlds.length; i++) {
          this.scalarRender.render(matrix, worlds[i], {
            cameraEye,
            cameraEye64Low,
          });
        }
      }
    }
    this.completeRender();
  }

  public getWrappedWorlds() {
    const map = this.getMap();
    const projObject = map.getProjection().fullExtent;
    const projectionExtent = [
      projObject.left,
      projObject.bottom,
      projObject.right,
      projObject.top,
    ] as Extent;
    const projExtent = map.getProjExtent();
    const extent = [
      projExtent.xmin,
      projExtent.ymin,
      projExtent.xmax,
      projExtent.ymax,
    ];
    let startX = extent[0];
    const worldWidth = getWidth(projectionExtent);
    const projWorldWidth = Math.abs(
      map.coordToPoint(
        map
          .getProjection()
          .unprojectCoords(
            new Coordinate([projectionExtent[0], projectionExtent[1]]),
          ),
        map.getGLZoom(),
      ).x -
        map.coordToPoint(
          map
            .getProjection()
            .unprojectCoords(
              new Coordinate([projectionExtent[2], projectionExtent[3]]),
            ),
          map.getGLZoom(),
        ).x,
    );
    let world = 0;
    let offsetX;

    const result = [];

    const layer = this.layer;
    const opt = layer.getOptions();
    if (opt.wrapX) {
      while (startX < projectionExtent[0]) {
        --world;
        offsetX = worldWidth * world;
        result.push(world * projWorldWidth);
        startX += worldWidth;
      }
      world = 0;
      startX = extent[2];
      while (startX > projectionExtent[2]) {
        ++world;
        offsetX = worldWidth * world;
        result.push(world * projWorldWidth);
        startX -= worldWidth;
      }
    }

    result.push(0);

    return result;
  }

  public drawOnInteracting() {
    this.draw();
  }

  public onZoomStart(...args: any[]) {
    super.onZoomStart.apply(this, args);
  }

  public onZoomEnd(...args: any[]) {
    super.onZoomEnd.apply(this, args);
  }

  public onDragRotateStart(...args: any[]) {
    super.onDragRotateStart.apply(this, args);
  }

  public onDragRotateEnd(...args: any[]) {
    super.onDragRotateEnd.apply(this, args);
  }

  public onMoveStart(...args: any[]) {
    super.onMoveStart.apply(this, args);
  }

  public onMoveEnd(...args: any[]) {
    super.onMoveEnd.apply(this, args);
  }

  // onResize() {}

  public remove() {
    delete this._drawContext;
    super.remove();
  }

  public getMap() {
    return super.getMap();
  }

  public completeRender() {
    return super.completeRender();
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
}

export class ScalarLayer extends CanvasLayer {
  private data: any;
  private _map: any;
  private options: any;

  constructor(
    id: string | number,
    data: any,
    options?: Partial<IScalarFillOptions>,
  ) {
    super(id, {
      ...defaultLayerOptions,
      ...options,
    });

    this.data = null;

    this._map = null;

    if (data) {
      this.setData(data);
    }
  }

  /**
   * get wind layer data
   */
  public getData() {
    return this.data;
  }

  /**
   * set layer data
   * @param data
   * @returns {Promise<any>>}
   */
  public setData(data: any) {
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
    this.options = {
      ...this.options,
      ...(options || {}),
    };

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
