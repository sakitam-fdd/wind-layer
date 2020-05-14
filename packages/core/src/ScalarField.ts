import { mat4 } from 'gl-matrix';
import Field from './Field';
import { isFunction, getColor } from './utils';
import { resizeCanvasSize, getGlContext, createBuffer } from './renderer/webgl/gl-utils';
import { Rect } from './renderer/webgl/Rect';

type emptyFunc = (v?: any) => number;

function indexFor (m: number, min: number, max: number, colorScale: string[]) {  // map velocity speed to a style
  return Math.max(0, Math.min((colorScale.length - 1),
    Math.round((m - min) / (max - min) * (colorScale.length - 1))));
}

export const defaultOptions = {
  colorScale: '#ff473c',
  emptyColor: 'rgba(255, 255, 255, 0)',
  showArrow: false,
  arrowConfig: {},
  showScalarField: false,
  scalarField: {},
  useGl: false,
  useInterpolated: false,
};

export interface IOptions {
  colorScale: string | string[] | emptyFunc;
  emptyColor?: string;
  showArrow?: boolean;
  arrowConfig?: {};
  showScalarField?: boolean;
  scalarFieldConfig?: {};
  useInterpolated?: boolean;
  useGl?: boolean;
}

export default class ScalarField {
  private readonly ctx: CanvasRenderingContext2D;
  private options: IOptions;
  private field: Field;

  static Field = Field;
  private imageData: ImageData;
  private shape: Rect;

  constructor(ctx: CanvasRenderingContext2D, options: Partial<IOptions>, field?: Field) {
    this.ctx = ctx;

    if (!this.ctx) {
      throw new Error('ctx error');
    }

    this.setOptions(options);

    if (field) {
      this.updateData(field);
    }
  }

  public setOptions(options: Partial<IOptions>) {
    this.options = Object.assign({}, defaultOptions, options);
  }

  public getOptions() {
    return this.options;
  }

  public updateData(field: Field) {
    this.field = field;
  }

  public project(coordinates: [number, number]): [number, number] | null {
    throw new Error('project must be overriden');
  }

  public unproject(pixel: [number, number]): [number, number] | null {
    throw new Error('unproject must be overriden');
  }

  public intersectsCoordinate(coordinates: [number, number]): boolean {
    throw new Error('intersectsCoordinate must be overriden');
  }

  public clearCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  private createImageData() {
    console.time('prerender');
    const { width, height } = this.ctx.canvas;
    this.imageData = this.ctx.getImageData(0, 0, width, height);
    const [min, max] = this.field.range as [number, number];
    let dataIdx = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let color = this.options.emptyColor;
        const coords = this.unproject([x, y]);
        if (coords !== null) {
          const vector = this.field[this.options.useInterpolated ? 'interpolatedValueAt' : 'valueAt'](coords[0], coords[1]);
          if (vector) {
            if (isFunction(this.options.colorScale)) {
              // @ts-ignore
              color = this.options.colorScale(vector.m) as string;
            } else if (Array.isArray(this.options.colorScale)) {
              const colorIdx = indexFor(vector.m, min, max, this.options.colorScale);
              color = this.options.colorScale[colorIdx];
            } else {
              color = this.options.colorScale as string;
            }
          }

          // @ts-ignore
          color = getColor(color || 'rgba(255, 255, 255, 0)');
        }
        // @ts-ignore
        this.imageData.data[dataIdx] = color[0];
        // @ts-ignore
        this.imageData.data[dataIdx + 1] = color[1];
        // @ts-ignore
        this.imageData.data[dataIdx + 2] = color[2];
        // @ts-ignore
        this.imageData.data[dataIdx + 3] = parseInt((color[3] || 0) * 255);
        dataIdx += 4;
      }
    }
    console.timeEnd('prerender');
  }

  private createBufferData(matrix: mat4) {
    if (!this.shape) {
      resizeCanvasSize(this.ctx.canvas);

      if (gl !== null) {

        // const { clientWidth: width, clientHeight: height } = this.canvas;
        this.shape = new Rect(gl);

        this.shape
          .active()
          .resize(true)
          .setUniforms({
            u_matrix: matrix,
          })
          .setAttributes({
            a_position: {
              buffer: createBuffer(gl, new Float32Array([
                // left column front
                0,   0,  0,
                30,   0,  0,
                0, 150,  0,
                0, 150,  0,
                30,   0,  0,
                30, 150,  0,

                // top rung front
                30,   0,  0,
                100,   0,  0,
                30,  30,  0,
                30,  30,  0,
                100,   0,  0,
                100,  30,  0,

                // middle rung front
                30,  60,  0,
                67,  60,  0,
                30,  90,  0,
                30,  90,  0,
                67,  60,  0,
                67,  90,  0,

                // left column back
                0,   0,  30,
                30,   0,  30,
                0, 150,  30,
                0, 150,  30,
                30,   0,  30,
                30, 150,  30,

                // top rung back
                30,   0,  30,
                100,   0,  30,
                30,  30,  30,
                30,  30,  30,
                100,   0,  30,
                100,  30,  30,

                // middle rung back
                30,  60,  30,
                67,  60,  30,
                30,  90,  30,
                30,  90,  30,
                67,  60,  30,
                67,  90,  30,

                // top
                0,   0,   0,
                100,   0,   0,
                100,   0,  30,
                0,   0,   0,
                100,   0,  30,
                0,   0,  30,

                // top rung right
                100,   0,   0,
                100,  30,   0,
                100,  30,  30,
                100,   0,   0,
                100,  30,  30,
                100,   0,  30,

                // under top rung
                30,   30,   0,
                30,   30,  30,
                100,  30,  30,
                30,   30,   0,
                100,  30,  30,
                100,  30,   0,

                // between top rung and middle
                30,   30,   0,
                30,   30,  30,
                30,   60,  30,
                30,   30,   0,
                30,   60,  30,
                30,   60,   0,

                // top of middle rung
                30,   60,   0,
                30,   60,  30,
                67,   60,  30,
                30,   60,   0,
                67,   60,  30,
                67,   60,   0,

                // right of middle rung
                67,   60,   0,
                67,   60,  30,
                67,   90,  30,
                67,   60,   0,
                67,   90,  30,
                67,   90,   0,

                // bottom of middle rung.
                30,   90,   0,
                30,   90,  30,
                67,   90,  30,
                30,   90,   0,
                67,   90,  30,
                67,   90,   0,

                // right of bottom
                30,   90,   0,
                30,   90,  30,
                30,  150,  30,
                30,   90,   0,
                30,  150,  30,
                30,  150,   0,

                // bottom
                0,   150,   0,
                0,   150,  30,
                30,  150,  30,
                0,   150,   0,
                30,  150,  30,
                30,  150,   0,

                // left side
                0,   0,   0,
                0,   0,  30,
                0, 150,  30,
                0,   0,   0,
                0, 150,  30,
                0, 150,   0])),
              numComponents: 3,
            },
            a_color: {
              buffer: createBuffer(gl, new Uint8Array([
                // left column front
                200,  70, 120,
                200,  70, 120,
                200,  70, 120,
                200,  70, 120,
                200,  70, 120,
                200,  70, 120,

                // top rung front
                200,  70, 120,
                200,  70, 120,
                200,  70, 120,
                200,  70, 120,
                200,  70, 120,
                200,  70, 120,

                // middle rung front
                200,  70, 120,
                200,  70, 120,
                200,  70, 120,
                200,  70, 120,
                200,  70, 120,
                200,  70, 120,

                // left column back
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,

                // top rung back
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,

                // middle rung back
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,

                // top
                70, 200, 210,
                70, 200, 210,
                70, 200, 210,
                70, 200, 210,
                70, 200, 210,
                70, 200, 210,

                // top rung right
                200, 200, 70,
                200, 200, 70,
                200, 200, 70,
                200, 200, 70,
                200, 200, 70,
                200, 200, 70,

                // under top rung
                210, 100, 70,
                210, 100, 70,
                210, 100, 70,
                210, 100, 70,
                210, 100, 70,
                210, 100, 70,

                // between top rung and middle
                210, 160, 70,
                210, 160, 70,
                210, 160, 70,
                210, 160, 70,
                210, 160, 70,
                210, 160, 70,

                // top of middle rung
                70, 180, 210,
                70, 180, 210,
                70, 180, 210,
                70, 180, 210,
                70, 180, 210,
                70, 180, 210,

                // right of middle rung
                100, 70, 210,
                100, 70, 210,
                100, 70, 210,
                100, 70, 210,
                100, 70, 210,
                100, 70, 210,

                // bottom of middle rung.
                76, 210, 100,
                76, 210, 100,
                76, 210, 100,
                76, 210, 100,
                76, 210, 100,
                76, 210, 100,

                // right of bottom
                140, 210, 80,
                140, 210, 80,
                140, 210, 80,
                140, 210, 80,
                140, 210, 80,
                140, 210, 80,

                // bottom
                90, 130, 110,
                90, 130, 110,
                90, 130, 110,
                90, 130, 110,
                90, 130, 110,
                90, 130, 110,

                // left side
                160, 160, 220,
                160, 160, 220,
                160, 160, 220,
                160, 160, 220,
                160, 160, 220,
                160, 160, 220])),
              numComponents: 3,
              normalize: true,
              type: gl.UNSIGNED_BYTE,
            },
          })
          .runTimes(16 * 6)
          .draw();
      }
    }
  }

  /**
   * 渲染前处理
   */
  prerender(matrix: mat4) {
    if (this.options.useGl) {
      this.createBufferData(matrix);
    } else {
      this.createImageData()
    }
  }

  /**
   * 开始渲染
   */
  render(matrix: mat4) {
    console.time('render');
    if (this.options.useGl) {
      this.shape
        .clear([0, 0, 0, 0])
        .setUniforms({
          u_matrix: matrix,
        })
        .draw();
    } else {
      this.ctx.putImageData(this.imageData, 0, 0);
    }
    console.timeEnd('render');
    this.postrender();
  }

  /**
   * each frame render end
   */
  postrender() {}
}
