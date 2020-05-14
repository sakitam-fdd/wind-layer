import Field from './Field';
import { isFunction, getColor } from './utils';

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
};

export interface IOptions {
  colorScale: string | string[] | emptyFunc;
  emptyColor?: string;
  showArrow?: boolean;
  arrowConfig?: {};
  showScalarField?: boolean;
  scalarFieldConfig?: {};
  useGl?: boolean;
}

export default class ScalarField {
  private readonly ctx: CanvasRenderingContext2D;
  private options: IOptions;
  private field: Field;

  static Field = Field;
  private imageData: ImageData;

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
    const { width, height } = this.ctx.canvas;
    this.imageData = this.ctx.getImageData(0, 0, width, height);
    const [min, max] = this.field.range as [number, number];
    let dataIdx = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let color = this.options.emptyColor;
        const coords = this.unproject([x, y]);
        if (coords !== null) {
          const vector = this.field.interpolatedValueAt(coords[0], coords[1]);
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
  }

  private createBufferData() {
    const { width, height } = this.ctx.canvas;
    const [min, max] = this.field.range as [number, number];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const coords = this.unproject([x, y]);
        if (coords !== null) {
          const vector = this.field.interpolatedValueAt(coords[0], coords[1]);
          let color = this.options.emptyColor;
          if (vector) {
            if (isFunction(this.options.colorScale)) {
              // @ts-ignore
              color = this.options.colorScale(vector.m) as string;
            } else if (Array.isArray(this.options.colorScale)) {
              const colorIdx = indexFor(vector.m, min, max, this.options.colorScale);
              color = this.options.colorScale[colorIdx];
            }
          }
        }
      }
    }
  }

  /**
   * 渲染前处理
   */
  prerender() {
    if (this.options.useGl) {
      this.createBufferData();
    } else {
      this.createImageData()
    }
  }

  /**
   * 开始渲染
   */
  render() {
    if (this.options.useGl) {
      // this.createBufferData();
    } else {
      this.ctx.putImageData(this.imageData, 0, 0);
    }
    this.postrender();
  }

  /**
   * each frame render end
   */
  postrender() {}
}
