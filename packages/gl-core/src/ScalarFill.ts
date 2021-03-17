// @ts-ignore
import DataProcess from 'web-worker:./workers/DataProcesse';
import { Fill } from './Fill';
import { fp64LowPart, isNumber } from './utils/common';
import * as utils from './utils/gl-utils';
import { createLinearGradient, createZoom } from './utils/style-parser';
import { WindFill } from './WindFill';

export interface IGFSItem {
  header: {
    parameterCategory: number | string;
    parameterNumber: number | string;
    dx: number;
    dy: number;
    nx: number;
    ny: number;
    lo1: number;
    lo2: number;
    la1: number;
    la2: number;
    [key: string]: any;
  };
  data: number[];
}

export interface IOptions {
  renderForm?: 'rg' | 'r';
  styleSpec?: {
    'fill-color': any[];
    opacity: number | any[];
  };
  getZoom?: () => number;
  opacity?: number;
  triggerRepaint?: () => void;
  displayRange: [number, number];
}

export interface IData {
  width: number;
  height: number;
  uMin?: number;
  uMax?: number;
  vMin?: number;
  vMax?: number;
  min?: number;
  max?: number;
  texCoordBuffer: WebGLBuffer | null;
  quadBuffer: WebGLBuffer | null;
  quad64LowBuffer: WebGLBuffer | null;
  texture?: WebGLTexture | null;
}

export interface IJsonArrayData {
  type: 'jsonArray';
  data: IGFSItem[];
  extent?: Array<[number, number]>;
}

export interface IImageData {
  type: 'image';
  url: string;
  extent: Array<[number, number]>;
  uMin?: number;
  uMax?: number;
  vMin?: number;
  vMax?: number;
  min?: number;
  max?: number;
}

export const defaultOptions: IOptions = {
  renderForm: 'r',
  styleSpec: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'value'],
      0.0,
      '#3288bd',
      10,
      '#66c2a5',
      20,
      '#abdda4',
      30,
      '#e6f598',
      40,
      '#fee08b',
      50,
      '#fdae61',
      60,
      '#f46d43',
      100.0,
      '#d53e4f',
    ],
    opacity: 1,
  },
  displayRange: [Infinity, Infinity],
};

export function checkUVData(data: IData) {
  return (
    isNumber(data.uMin) &&
    isNumber(data.uMax) &&
    isNumber(data.vMin) &&
    isNumber(data.vMax)
  );
}

export function checkData(data: IData) {
  return isNumber(data.min) && isNumber(data.max);
}

interface IScalarFill<T> {
  [key: string]: T;
}

export default class ScalarFill implements IScalarFill<any> {
  [index: string]: any;

  public readonly gl: WebGLRenderingContext;
  public data: IData;
  public colorRampTexture: WebGLTexture | null;

  private options: IOptions;

  private opacity: number;

  private colorRange: [number, number];

  private worker: Worker;

  private drawCommand: WindFill | Fill;

  constructor(gl: WebGLRenderingContext, options?: Partial<IOptions>) {
    this.gl = gl;

    if (!this.gl) {
      throw new Error('initialize error');
    }

    if (!options) {
      options = {};
    }

    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.opacity = this.options.opacity || 1;
  }

  public updateOptions(options: Partial<IOptions>) {
    this.options = {
      ...this.options,
      ...options,
    };

    this.buildColorRamp();

    if (typeof this.options.getZoom === 'function') {
      this.setOpacity(
        createZoom(this.options.getZoom(), this.options.styleSpec?.opacity),
      );
    }
  }

  public setFillColor() {
    this.buildColorRamp();
  }

  public setOpacity(opacity: number) {
    this.opacity = opacity;
  }

  public handleZoom() {
    if (typeof this.options.getZoom === 'function') {
      this.setOpacity(
        createZoom(this.options.getZoom(), this.options.styleSpec?.opacity),
      );
    }
  }

  public buildColorRamp() {
    const { data, colorRange } = createLinearGradient(
      [],
      this.options.styleSpec?.['fill-color'] as any[],
    );

    if (colorRange) {
      this.colorRange = colorRange;
    }

    if (data) {
      this.colorRampTexture = utils.createTexture(
        this.gl,
        this.gl.NEAREST,
        data,
        16,
        16,
      );
    }
  }

  public initialize(gl: WebGLRenderingContext) {
    if (!this.drawCommand) {
      if (this.options.renderForm === 'rg') {
        this.drawCommand = new WindFill(gl);
      } else if (this.options.renderForm === 'r') {
        this.drawCommand = new Fill(gl);
      } else {
        console.warn('This type is not supported temporarily');
      }
    }

    this.buildColorRamp();

    if (typeof this.options.getZoom === 'function') {
      this.setOpacity(
        createZoom(this.options.getZoom(), this.options.styleSpec?.opacity),
      );
    }
  }

  public initializeVertex(coordinates: number[][]) {
    let i = 0;
    const len = coordinates.length;
    const instancePositions = new Float32Array(len * 3);
    const instancePositions64Low = new Float32Array(len * 3);

    for (; i < len; i++) {
      const coords = coordinates[i];
      const mc = this.getMercatorCoordinate(coords as [number, number]);
      instancePositions[i * 3] = mc[0];
      instancePositions[i * 3 + 1] = mc[1];
      instancePositions[i * 3 + 2] = 0;

      instancePositions64Low[i * 3] = fp64LowPart(mc[0]);
      instancePositions64Low[i * 3 + 1] = fp64LowPart(mc[1]);
      instancePositions64Low[i * 3 + 2] = 0;
    }

    return {
      quadBuffer: utils.createBuffer(this.gl, instancePositions),
      quad64LowBuffer: utils.createBuffer(this.gl, instancePositions64Low),
    };
  }

  public getTextureData(data: IJsonArrayData | IImageData): Promise<IData> {
    return new Promise((resolve, reject) => {
      if (data.type === 'image' && data.url) {
        utils
          .loadImage(data.url)
          .then((image) => {
            const processedData: IData = {
              width: image.width,
              height: image.height,
              texCoordBuffer: utils.createBuffer(
                this.gl,
                new Float32Array([
                  0.0,
                  0.0, // leftTop
                  0.0,
                  1.0, // leftBottom
                  1.0,
                  0.0, // rightTop

                  1.0,
                  0.0, // rightTop
                  0.0,
                  1.0, // leftBottom
                  1.0,
                  1.0, // rightBottom
                ]),
              ),
              texture: utils.createTexture(
                this.gl,
                this.gl.LINEAR,
                image,
                image.width,
                image.height,
              ),
              ...this.initializeVertex([
                data.extent[0],
                data.extent[1],
                data.extent[2],
                data.extent[2],
                data.extent[1],
                data.extent[3],
              ]),
            };

            if (this.options.renderForm === 'rg') {
              processedData.uMin = data.uMin;
              processedData.uMax = data.uMax;
              processedData.vMin = data.vMin;
              processedData.vMax = data.vMax;
            } else if (this.options.renderForm === 'r') {
              processedData.min = data.min;
              processedData.max = data.max;
            } else {
              console.warn('This type is not supported temporarily');
            }

            resolve(processedData);
          })
          .catch((error) => reject(error));
      } else if (data.type === 'jsonArray' && data.data) {
        const gfsData = data.data;
        let pos;
        if (data.extent) {
          // tip: fix extent
          pos = [
            data.extent[0],
            data.extent[1],
            data.extent[2],
            data.extent[2],
            data.extent[1],
            data.extent[3],
          ];
        } else {
          pos = [
            [gfsData[0].header.lo1, gfsData[0].header.la1],
            [gfsData[0].header.lo1, gfsData[0].header.la2],
            [gfsData[0].header.lo2, gfsData[0].header.la1],

            [gfsData[0].header.lo2, gfsData[0].header.la1],
            [gfsData[0].header.lo1, gfsData[0].header.la2],
            [gfsData[0].header.lo2, gfsData[0].header.la2],
          ];
        }

        const processedData: IData = {
          width: gfsData[0].header.nx,
          height: gfsData[0].header.ny,
          texCoordBuffer: utils.createBuffer(
            this.gl,
            new Float32Array([
              0.0,
              0.0, // leftTop
              0.0,
              1.0, // leftBottom
              1.0,
              0.0, // rightTop

              1.0,
              0.0, // rightTop
              0.0,
              1.0, // leftBottom
              1.0,
              1.0, // rightBottom
            ]),
          ),
          ...this.initializeVertex(pos),
        };

        if (!this.worker) {
          this.worker = new DataProcess();
          this.worker.addEventListener('message', ({ data: payload }: any) => {
            if (this.options.renderForm === 'rg') {
              processedData.uMin = payload[1];
              processedData.uMax = payload[2];
              processedData.vMin = payload[3];
              processedData.vMax = payload[4];
              processedData.texture = utils.createTexture(
                this.gl,
                this.gl.LINEAR,
                new Uint8Array(payload[0]),
                processedData.width,
                processedData.height,
              );
            } else if (this.options.renderForm === 'r') {
              processedData.min = payload[1];
              processedData.max = payload[2];
              processedData.texture = utils.createTexture(
                this.gl,
                this.gl.LINEAR,
                new Uint8Array(payload[0]),
                processedData.width,
                processedData.height,
              );
            } else {
              console.warn('This type is not supported temporarily');
            }

            resolve(processedData);
          });
        }

        if (this.options.renderForm === 'rg') {
          let uComp: IGFSItem;
          let vComp: IGFSItem;

          // if ((process.env.NODE_ENV as string) === ('development' as string)) {
          //   console.time('format-data');
          // }

          gfsData.forEach((record: IGFSItem) => {
            switch (
              record.header.parameterCategory +
              ',' +
              record.header.parameterNumber
            ) {
              case '1,2':
              case '2,2':
                uComp = record;
                break;
              case '1,3':
              case '2,3':
                vComp = record;
                break;
            }
          });

          // @ts-ignore
          const u = new Float32Array(uComp.data);
          // @ts-ignore
          const v = new Float32Array(vComp.data);
          this.worker.postMessage(['rg', u, v]); // TIP: 需要确定transfer是否支持多个
        } else if (this.options.renderForm === 'r') {
          // processedData.min = data.min;
          // processedData.max = data.max;
          const singleData = new Float32Array(gfsData[0].data);
          this.worker.postMessage(['r', singleData]);
        } else {
          console.warn('This type is not supported temporarily');
        }
      }
    });
  }

  public setData(
    data: IJsonArrayData | IImageData,
    cb?: (args?: boolean) => void,
  ) {
    if (this.gl && data) {
      // Error Prevention
      this.getTextureData(data)
        .then((data) => {
          this.data = data;

          cb && cb(true);

          if (this.data) {
            this.initialize(this.gl);
          }

          if (this.options.triggerRepaint) {
            this.handleZoom();
            this.options.triggerRepaint();
          }
        })
        .catch((error) => {
          cb && cb(false);
          console.error(error);
        });
    }
  }

  public getData() {
    return this.data;
  }

  public getMercatorCoordinate([lng, lat]: [number, number]): [number, number] {
    return [lng, lat];
  }

  public prerender() {}

  public render(
    matrix: number[],
    offset?: number,
    cameraParams?: {
      cameraEye: number[];
      cameraEye64Low: number[];
    },
  ) {
    if (
      this.data &&
      this.drawCommand &&
      this.data.texture &&
      this.colorRampTexture
    ) {
      const opacity = this.opacity;

      const uniforms: any = {
        u_opacity: isNumber(opacity) ? opacity : 1,
        u_image_res: [this.data.width, this.data.height],
        u_matrix: matrix,
        u_offset: isNumber(offset) ? offset : 0,
        u_color_ramp: this.colorRampTexture,
        u_color_range: this.colorRange,
      };

      if (cameraParams) {
        uniforms.u_cameraEye = cameraParams.cameraEye;
        uniforms.u_cameraEye64Low = cameraParams.cameraEye64Low;
      }

      if (this.options.renderForm === 'rg') {
        uniforms.u_wind_min = [this.data.uMin, this.data.vMin];
        uniforms.u_wind_max = [this.data.uMax, this.data.vMax];
        uniforms.u_wind = this.data.texture;
      } else if (this.options.renderForm === 'r') {
        uniforms.u_range = [this.data.min, this.data.max];
        uniforms.u_image = this.data.texture;
        uniforms.u_display_range =
          this.options.displayRange || uniforms.u_range;
      } else {
        console.warn('This type is not supported temporarily');
      }
      this.drawCommand
        .active()
        .resize()
        .setUniforms(uniforms)
        .setAttributes({
          instancePositions: {
            buffer: this.data.quadBuffer,
            numComponents: 3,
          },
          instancePositions64Low: {
            buffer: this.data.quad64LowBuffer,
            numComponents: 3,
          },
          a_texCoord: {
            buffer: this.data.texCoordBuffer,
            numComponents: 2,
          },
        })
        .runTimes(6)
        .draw();
    }
  }

  public postrender() {}
}
