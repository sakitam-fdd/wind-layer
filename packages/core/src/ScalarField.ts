import { mat4 } from 'gl-matrix';
import Field from './Field';
import { isFunction, getColor } from './utils';
import { createBuffer } from './renderer/webgl/gl-utils';
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
  transformCoords: () => [],
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
  transformCoords?: (coords: [number, number]) => [number, number]
}

export default class ScalarField {
  private readonly ctx: CanvasRenderingContext2D | WebGLRenderingContext;
  private options: IOptions;
  private field: Field;

  static Field = Field;
  private imageData: ImageData;
  private shape: Rect;

  constructor(ctx: CanvasRenderingContext2D | WebGLRenderingContext, options: Partial<IOptions>, field?: Field) {
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
    if (this.ctx instanceof CanvasRenderingContext2D) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
  }

  private createImageData() {
    console.time('prerender');
    const { width, height } = this.ctx.canvas;
    if ('getImageData' in this.ctx) {
      this.imageData = this.ctx.getImageData(0, 0, width, height);
    }
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
    const positions: any[] = [];
    const colors = [];

    if (this.ctx !== null && this.ctx instanceof WebGLRenderingContext) {

      const transformCoords = typeof this.options.transformCoords === 'function' ? this.options.transformCoords : () => false;

      console.time('prerender');
      const { width, height } = this.ctx.canvas;
      const [min, max] = this.field.range as [number, number];
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

            const projCoords = transformCoords(coords);

            if (Array.isArray(projCoords)) {
              positions.push(projCoords[0], projCoords[1]);
              // @ts-ignore
              colors.push(color[0], color[1], color[2], parseInt((color[3] || 0) * 255));
            }
          }
        }
      }

      if (!this.shape) {
        // const { clientWidth: width, clientHeight: height } = this.canvas;
        this.shape = new Rect(this.ctx);

        this.shape
          .active()
          // .resize(true)
          .setUniforms({
            u_matrix: matrix,
          })
          .setAttributes({
            a_position: {
              buffer: createBuffer(this.ctx, new Float32Array(positions)),
              numComponents: 2,
            },
            a_color: {
              buffer: createBuffer(this.ctx, new Uint8Array(colors)),
              numComponents: 4,
              normalize: true,
              type: this.ctx.UNSIGNED_BYTE,
            },
          })
          .runTimes(positions.length / 2)
          .draw();
      } else {
        this.shape
          .setAttributes({
            a_position: {
              buffer: createBuffer(this.ctx, new Float32Array(positions)),
              numComponents: 2,
            },
            a_color: {
              buffer: createBuffer(this.ctx, new Uint8Array(colors)),
              numComponents: 4,
              normalize: true,
              type: this.ctx.UNSIGNED_BYTE,
            },
          })
          .runTimes(positions.length / 2)
      }

      console.timeEnd('prerender');
    }
  }

  /**
   * 渲染前处理
   */
  prerender(matrix: mat4) {
    if (this.options.useGl) {
      this.createBufferData(matrix);
    } else if (this.ctx instanceof CanvasRenderingContext2D) {
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
    } else if (this.ctx instanceof CanvasRenderingContext2D) {
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
