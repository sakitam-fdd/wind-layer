// @ts-ignore
import { expression } from '@mapbox/mapbox-gl-style-spec/dist/index.es.js';
import { WindFill } from './WindFill';
import { Fill } from './Fill';
import * as utils from './utils/gl-utils';
import { isNumber } from './utils/common';
// @ts-ignore
import DataProcess from 'web-worker:./workers/DataProcesse';

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
  styleSpec?: any;
  getZoom?: () => number;
  opacity?: number;
  triggerRepaint?: () => void;
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
  texture?: WebGLTexture | null;
}

export interface IJsonArrayData {
  type: 'jsonArray',
  data: IGFSItem[];
}

export interface IImageData {
  type: 'image',
  url: string;
  extent: [number, number][],
  uMin?: number;
  uMax?: number;
  vMin?: number;
  vMax?: number;
  min?: number;
  max?: number;
}

export const defaultOptions: IOptions = {
  renderForm: 'r',
};

export function checkUVData(data: IData) {
  return isNumber(data.uMin) && isNumber(data.uMax) && isNumber(data.vMin) && isNumber(data.vMax);
}

export function checkData(data: IData) {
  return isNumber(data.min) && isNumber(data.max);
}

interface IScalarFill<T> {
  [key: string]: T;
}

export default class ScalarFill implements IScalarFill<any> {
  [index: string]: any;

  private options: IOptions;
  private styleSpec: any;
  private zoomUpdatable: {
    [key: string]: any;
  };

  private worker: Worker;

  private drawCommand: WindFill | Fill;

  public readonly gl: WebGLRenderingContext;
  public data: IData;
  public colorRampTexture: WebGLTexture | null;

  constructor(gl: WebGLRenderingContext, options: IOptions = {}) {
    this.gl = gl;

    if (!this.gl) {
      throw new Error('initialize error');
    }

    this.styleSpec = {
      'fill-color': {
        type: 'color',
        default: [
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
        doc: 'The color of each pixel of this layer',
        expression: {
          interpolated: true,
          parameters: ['zoom', 'feature'],
        },
        'property-type': 'data-driven',
      },
      'opacity': {
        type: 'number',
        default: 1,
        minimum: 0,
        maximum: 1,
        transition: true,
        expression: {
          interpolated: true,
          parameters: ['zoom'],
        },
        'property-type': 'data-constant',
      },
    };

    this.zoomUpdatable = {};

    this.options = options;
  }

  private setProperty(prop: string, value: any) {
    const spec = this.styleSpec[prop];
    if (!spec) return;
    const expr = expression.createPropertyExpression(value, spec);
    if (expr.result === 'success') {
      switch (expr.value.kind) {
        case 'camera':
        case 'composite':
          // eslint-disable-next-line no-return-assign
          return (this.zoomUpdatable[prop] = expr.value);
        default:
          return this.setPropertyValue(prop, expr.value);
      }
    } else {
      throw new Error(expr.value);
    }
  }

  private setPropertyValue(prop: string, value: any) {
    const name = prop
      .split('-')
      .map(a => a[0].toUpperCase() + a.slice(1))
      .join('');
    const setterName = `set${name}`;
    if (this[setterName]) {
      this[setterName](value);
    } else if (typeof this.options.getZoom === 'function') {
      this[name[0].toLowerCase() + name.slice(1)] = value.evaluate({
        zoom: this.options.getZoom(),
      });
    }
  }

  setFillColor(expr: any) {
    this.buildColorRamp(expr);
  }

  setOpacity(expr: any) {
    this.buildColorRamp(expr);
  }

  handleZoom() {
    Object.entries(this.zoomUpdatable).forEach(([k, v]) => {
      this.setPropertyValue(k, v);
    });
  }

  buildColorRamp(expr: any) {
    const colors = new Uint8Array(256 * 4);
    let range = 1;
    if (expr.kind === 'source' || expr.kind === 'composite') {
      if (this.options.renderForm === 'rg' && checkUVData(this.data)) {
        // @ts-ignore
        const u = this.data.uMax - this.data.uMin;
        // @ts-ignore
        const v = this.data.vMax - this.data.vMin;

        range = Math.sqrt(u * u + v * v);
      } else if (this.options.renderForm === 'r' && checkData(this.data)) {
        // @ts-ignore
        range = this.data.max - this.data.min;
      } else {
        console.warn('This type is not supported temporarily');
      }
    }

    for (let i = 0; i < 256; i++) {
      const expression = expr.kind === 'constant' || expr.kind === 'source' ? {} : (typeof this.options.getZoom === 'function' ? {
        zoom: this.options.getZoom(),
      } : {});
      const color = expr.evaluate(expression, { properties: { value: (i / 255) * range } },
      );
      colors[i * 4 + 0] = color.r * 255;
      colors[i * 4 + 1] = color.g * 255;
      colors[i * 4 + 2] = color.b * 255;
      colors[i * 4 + 3] = color.a * 255;
    }

    this.colorRampTexture = utils.createTexture(
      this.gl,
      this.gl.LINEAR,
      colors,
      16,
      16,
    );
  }

  initialize(gl: WebGLRenderingContext) {
    if (this.options.renderForm === 'rg') {
      this.drawCommand = new WindFill(gl);
    } else if (this.options.renderForm === 'r') {
      this.drawCommand = new Fill(gl);
    } else {
      console.warn('This type is not supported temporarily');
    }

    // This will initialize the default values
    Object.keys(this.styleSpec).forEach(spec => {
      this.setProperty(spec, this.options.styleSpec[spec] || this.styleSpec[spec].default);
    });
  }

  getTextureData(data: IJsonArrayData | IImageData): Promise<IData> {
    return new Promise(((resolve, reject) => {
      if (data.type === 'image' && data.url) {
        utils.loadImage(data.url)
          .then(image => {
            const pos = [
              ...this.getMercatorCoordinate(data.extent[0]),
              ...this.getMercatorCoordinate(data.extent[1]),
              ...this.getMercatorCoordinate(data.extent[2]),

              ...this.getMercatorCoordinate(data.extent[2]),
              ...this.getMercatorCoordinate(data.extent[1]),
              ...this.getMercatorCoordinate(data.extent[3]),
            ];

            const processedData: IData = {
              width: image.width,
              height: image.height,
              quadBuffer: utils.createBuffer(
                this.gl,
                new Float32Array(pos),
              ),
              texCoordBuffer: utils.createBuffer(this.gl, new Float32Array([
                0.0, 0.0, // leftTop
                0.0, 1.0, // leftBottom
                1.0, 0.0, // rightTop

                1.0, 0.0, // rightTop
                0.0, 1.0, // leftBottom
                1.0, 1.0, // rightBottom
              ])),
              // texture: this.regl.texture({
              //   mag: 'linear',
              //   min: 'linear',
              //   data: new Uint8Array(velocityData),
              //   width: uData.header.nx,
              //   height: uData.header.ny,
              //   wrapS: 'clamp',
              //   wrapT: 'clamp',
              //   format: 'rgba',
              //   type: 'uint8',
              // }),
              texture: utils.createTexture(this.gl, this.gl.LINEAR, image, image.width, image.height),
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
          .catch(error => reject(error));
      } else if (data.type === 'jsonArray' && data.data) {
        const gfsData = data.data;

        const pos = [
          ...this.getMercatorCoordinate([gfsData[0].header.lo1, gfsData[0].header.la1]),
          ...this.getMercatorCoordinate([gfsData[0].header.lo1, gfsData[0].header.la2]),
          ...this.getMercatorCoordinate([gfsData[0].header.lo2, gfsData[0].header.la1]),

          ...this.getMercatorCoordinate([gfsData[0].header.lo2, gfsData[0].header.la1]),
          ...this.getMercatorCoordinate([gfsData[0].header.lo1, gfsData[0].header.la2]),
          ...this.getMercatorCoordinate([gfsData[0].header.lo2, gfsData[0].header.la2]),
        ];

        const processedData: IData = {
          width: gfsData[0].header.nx,
          height: gfsData[0].header.ny,
          quadBuffer: utils.createBuffer(
            this.gl,
            new Float32Array(pos),
          ),
          texCoordBuffer: utils.createBuffer(this.gl, new Float32Array([
            0.0, 0.0, // leftTop
            0.0, 1.0, // leftBottom
            1.0, 0.0, // rightTop

            1.0, 0.0, // rightTop
            0.0, 1.0, // leftBottom
            1.0, 1.0, // rightBottom
          ])),
        };

        // const velocityData = new Uint8Array(gfsData[0].data.length * 4);

        if (!this.worker) {
          this.worker = new DataProcess();
          this.worker.addEventListener('message', ({ data: payload }: any) => {
            if (this.options.renderForm === 'rg') {
              processedData.uMin = payload[0];
              processedData.uMax = payload[1];
              processedData.vMin = payload[2];
              processedData.vMax = payload[3];
              processedData.texture = utils.createTexture(this.gl, this.gl.LINEAR, payload[4], processedData.width, processedData.height);
            } else if (this.options.renderForm === 'r') {
              processedData.min = payload[0];
              processedData.max = payload[1];
              processedData.texture = utils.createTexture(this.gl, this.gl.LINEAR, payload[2], processedData.width, processedData.height);
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

          gfsData.forEach(function (record: IGFSItem) {
            switch (record.header.parameterCategory + "," + record.header.parameterNumber) {
              case "1,2":
              case "2,2":
                uComp = record;
                break;
              case "1,3":
              case "2,3":
                vComp = record;
                break;
            }
          });

          // @ts-ignore
          const u = new Float32Array(uComp.data);
          // @ts-ignore
          const v = new Float32Array(vComp.data);
          this.worker.postMessage(['rg', u, v], [u, v]); // TIP: 需要确定transfer是否支持多个
        } else if (this.options.renderForm === 'r') {
          // processedData.min = data.min;
          // processedData.max = data.max;
          const singleData = new Float32Array(gfsData[0].data);
          this.worker.postMessage(['r', singleData], [singleData]);
        } else {
          console.warn('This type is not supported temporarily');
        }
      }
    }));
  }

  setData(data: IJsonArrayData | IImageData) {
    if (this.gl) {
      this.getTextureData(data)
        .then(data => {
          this.data = data;

          if (this.data) {
            this.initialize(this.gl);
          }

          if (this.options.triggerRepaint) {
            this.options.triggerRepaint();
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  getData() {
    return this.data;
  }

  getMercatorCoordinate([lng, lat]: [number, number]): [number, number] {
    return [lng, lat];
  }

  prerender() {}

  render(matrix: number[], offset?: number) {
    if (this.data && this.drawCommand && this.data.texture && this.colorRampTexture) {
      const opacity = this.options.opacity;

      const uniforms: any = {
        u_opacity: isNumber(opacity) ? opacity : 1,
        u_image_res: [this.data.width, this.data.height],
        u_matrix: matrix,
        u_dateline_offset: isNumber(offset) ? offset : 0,
        u_color_ramp: this.colorRampTexture,
      };
      if (this.options.renderForm === 'rg') {
        uniforms.u_wind_min = [this.data.uMin, this.data.vMin];
        uniforms.u_wind_max = [this.data.uMax, this.data.vMax];
        uniforms.u_wind = this.data.texture;
      } else if (this.options.renderForm === 'r') {
        uniforms.u_range = [this.data.min, this.data.max];
        uniforms.u_image = this.data.texture;
      } else {
        console.warn('This type is not supported temporarily');
      }
      this.drawCommand
        .active()
        // .resize()
        .setUniforms(uniforms)
        .setAttributes({
          a_position: {
            buffer: this.data.quadBuffer,
            numComponents: 2,
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

  postrender() {}
}
