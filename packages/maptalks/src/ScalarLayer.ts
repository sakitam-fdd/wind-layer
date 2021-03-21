// @ts-ignore
import { CanvasLayer, Coordinate, renderer } from 'maptalks/dist/maptalks.es.js';
import {
  clearScene,
  fp64LowPart,
  getGlContext,
  IPlaneBuffer,
  IOptions,
  ScalarFill as ScalarCore,
} from 'wind-gl-core';
import { Extent, getWidth } from './utils';

export function getPlaneBuffer(
  startX: number,
  endX: number,
  startY: number,
  endY: number,
  widthSegments: number,
  heightSegments: number,
): IPlaneBuffer {
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  const widthHalf = width / 2;
  const heightHalf = height / 2;

  const gridX = Math.floor(widthSegments);
  const gridY = Math.floor(heightSegments);

  const gridX1 = gridX + 1;
  const gridY1 = gridY + 1;

  const segmentWidth = width / gridX;
  const segmentHeight = height / gridY;

  const indices = [];
  const vertices = [];
  const verticesLow = [];
  const uvs = [];

  for (let iy = 0; iy < gridY1; iy++) {
    const y = iy * segmentHeight;
    for (let ix = 0; ix < gridX1; ix++) {
      const x = ix * segmentWidth;
      const vx = startX + (x / widthHalf / 2) * width;
      const vy = startY - (y / heightHalf / 2) * height;
      vertices.push(vx, vy, 0);
      verticesLow.push(fp64LowPart(vx), fp64LowPart(vy), 0);
      // vertices.push(ix / gridX, 1 - (iy / gridY));
      uvs.push(ix / gridX, iy / gridY);
    }
  }

  for (let iy = 0; iy < gridY; iy++) {
    for (let ix = 0; ix < gridX; ix++) {
      const a = ix + gridX1 * iy;
      const b = ix + gridX1 * (iy + 1);
      const c = ix + 1 + gridX1 * (iy + 1);
      const d = ix + 1 + gridX1 * iy;

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  return {
    uvs: {
      data: uvs,
      size: 2,
    },
    elements: {
      data: indices,
      count: indices.length,
    },
    position: {
      data: vertices,
      size: 3,
    },
    positionLow: {
      data: verticesLow,
      size: 3,
    },
  };
}

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

const defaultOptions = {
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
          displayRange: opt.displayRange,
          mappingRange: opt.mappingRange,
          widthSegments: opt.widthSegments,
          heightSegments: opt.heightSegments,
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
          createPlaneBuffer: (points, widthSegments, heightSegments) => {
            const [startX, endX, startY, endY] = [
              points[0][0],
              points[2][0],
              points[0][1],
              points[1][1],
            ];
            // return {
            //   uvs: {
            //     data: [
            //       // 0, 0,
            //       // 0, 1,
            //       // 1, 0,
            //       // 1, 1,
            //       0, 0, 1, 0, 0, 1, 1, 1
            //     ],
            //     size: 2,
            //   },
            //   elements: {
            //     data: [0, 1, 2, 2, 1, 3],
            //     count: 6,
            //   },
            //   position: {
            //     data,
            //     size: 3,
            //   },
            //   positionLow: {
            //     data: Array.from({
            //         length: 12,
            //       },
            //       (p) => 0,
            //     ),
            //     size: 3,
            //   },
            // };
            return getPlaneBuffer(
              startX,
              endX,
              startY,
              endY,
              widthSegments,
              heightSegments,
            );
          },
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
        const matrix = this.getMatrix();
        const cameraEye = [
          // ...map.cameraPosition,
          // 1,
          0, 0, 0, 1,
        ];
        const cameraEye64Low = cameraEye.map((item: number) => fp64LowPart(item));

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
    const projectionExtent = [projObject.left, projObject.bottom, projObject.right, projObject.top] as Extent;
    const projExtent = map.getProjExtent();
    const extent = [projExtent.xmin, projExtent.ymin, projExtent.xmax, projExtent.ymax];
    let startX = extent[0];
    const worldWidth = getWidth(projectionExtent);
    const projWorldWidth =
      map.coordToPoint(
        map
          .getProjection()
          .unprojectCoords(
            new Coordinate([projectionExtent[0], projectionExtent[1]]),
          ),
        map.getGLZoom(),
      ).x - map.coordToPoint(
      map
        .getProjection()
        .unprojectCoords(
          new Coordinate([projectionExtent[2], projectionExtent[3]]),
        ),
      map.getGLZoom(),
      ).x;
    let world = 0;
    let offsetX;

    const result = [0];

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

    return result;
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

  constructor(
    id: string | number,
    data: any,
    options?: Partial<IScalarFillOptions>,
  ) {
    super(id, {
      ...defaultOptions,
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
