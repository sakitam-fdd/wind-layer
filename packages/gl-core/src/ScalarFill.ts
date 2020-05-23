// @ts-ignore
import { expression } from '@mapbox/mapbox-gl-style-spec';
import { WindFill } from './WindFill';
import { Fill } from './Fill';
import * as utils from './gl-utils';
// @ts-ignore
import DataProcess from 'web-worker:./workers/DataProcesse';

function isNumber(val: any): boolean {
  return typeof val === 'number';
}

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
  quadBuffer: WebGLBuffer | null;
  texture: WebGLTexture | null;
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

  public readonly gl: WebGLRenderingContext;
  public data: IData;

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
          return this._setPropertyValue(prop, expr.value);
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

  getTextureData(data: IJsonArrayData | IImageData) {
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
        };

        const velocityData = new Uint8Array(gfsData[0].data.length * 4);

        if (!this.worker) {
          this.worker = new DataProcess();
          this.worker.addEventListener('message', ({ data: payload }: any) => {

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
          this.worker.postMessage([], []); // TIP: 需要确定transfer是否支持多个
        } else if (this.options.renderForm === 'r') {
          // processedData.min = data.min;
          // processedData.max = data.max;
          this.worker.postMessage([], []);
        } else {
          console.warn('This type is not supported temporarily');
        }
      }
    }));
  }

  setData(data: IJsonArrayData | IImageData) {
    if (this.gl) {
      this.data = this.getTextureData(data);
    }
  }

  getData() {
    return this.data;
  }

  getMercatorCoordinate([lng, lat]: [number, number]): [number, number] {
    return [lng, lat];
  }

  // draw(gl, matrix) {
  //   const { width, height } = gl.canvas;
  //
  //   const opacity = this.options.opacity;
  //   const program = this.backgroundProgram;
  //   gl.useProgram(program.program);
  //
  //   util.bindAttribute(gl, this.quadBuffer, program.a_position, 2);
  //   util.bindAttribute(this.gl, util.createBuffer(this.gl, new Float32Array([
  //     0.0, 0.0, // leftTop
  //     0.0, 1.0, // leftBottom
  //     1.0, 0.0, // rightTop
  //
  //     1.0, 0.0, // rightTop
  //     0.0, 1.0, // leftBottom
  //     1.0, 1.0, // rightBottom
  //   ])), program.a_texCoord, 2);
  //
  //   util.bindTexture(gl, this.windData.texture, 0);
  //   util.bindTexture(gl, this.colorRampTexture, 2);
  //
  //   gl.uniform1i(program.u_wind, 0);
  //   gl.uniform1i(program.u_color_ramp, 2);
  //
  //   gl.uniform1f(program.u_opacity, isValide(opacity) ? opacity : 1);
  //
  //   gl.uniform2f(program.u_wind_res, this.windData.width, this.windData.height);
  //   gl.uniform2f(program.u_wind_min, this.windData.uMin, this.windData.vMin);
  //   gl.uniform2f(program.u_wind_max, this.windData.uMax, this.windData.vMax);
  //   gl.uniformMatrix4fv(program.u_matrix, false, matrix);
  //
  //   gl.drawArrays(gl.TRIANGLES, 0, 6);
  // }

  prerender() {}

  render(matrix: number[], offset?: number) {
    if (this.data) {
      // const bounds = this.map.getBounds();
      // const eastIter = Math.max(0, Math.ceil((bounds.getEast() - 180) / 360));
      // const westIter = Math.max(0, Math.ceil((bounds.getWest() + 180) / -360));
      this.draw(gl, matrix, 0);
      // for (let i = 1; i <= eastIter; i++) {
      //   // this.wind.render(this.map, matrix, i);
      //   this.draw(gl, matrix, i);
      // }
      // for (let i = 1; i <= westIter; i++) {
      //   this.draw(gl, matrix, -i);
      // }
    }
  }

  postrender() {}
}
