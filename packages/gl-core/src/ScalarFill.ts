// @ts-ignore
import DataProcess from 'web-worker:./workers/DataProcesse';
import { Fill } from './Fill';
import { isNumber } from './utils/common';
import {
  createBuffer,
  createTexture,
  getPlaneBuffer,
  IPlaneBuffer,
  loadImage,
} from './utils/gl-utils';
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
  createPlaneBuffer?: (
    points: number[][],
    widthSegments: number,
    heightSegments: number,
  ) => IPlaneBuffer;
  injectShaderModules: {
    [key: string]: string;
  };
  displayRange?: [number, number];
  mappingRange?: [number, number];
  widthSegments?: number;
  heightSegments?: number;
  wireframe?: boolean;
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
  indexes?: number[] | number[][];
  wireframeIndexes?: number[] | number[][];
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
  mappingRange: [0, 0],
  widthSegments: 1,
  heightSegments: 1,
  wireframe: false,
  createPlaneBuffer: (
    points: number[][],
    widthSegments: number,
    heightSegments: number,
  ) => {
    const [startX, endX, startY, endY] = [
      points[0][0],
      points[2][0],
      points[0][1],
      points[1][1],
    ];

    return getPlaneBuffer(
      startX,
      endX,
      startY,
      endY,
      widthSegments,
      heightSegments,
    );
  },
  injectShaderModules: {
    '#modules-transformZ': `
float transformZ(float value, vec3 pos) {
  return 0.0;
}
    `,
    '#modules-project': `
gl_Position = u_matrix * vec4(pos.xy + vec2(u_offset, 0.0), pos.z + z, 1.0);
    `,
  },
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

let uid = 0;

export default class ScalarFill implements IScalarFill<any> {
  [index: string]: any;

  public readonly gl: WebGLRenderingContext;
  public data: IData;
  public colorRampTexture: WebGLTexture | null;

  private uid: string;
  private options: IOptions;

  private opacity: number;

  private colorRange: [number, number];

  private worker: Worker;

  private drawCommand: WindFill | Fill;

  constructor(gl: WebGLRenderingContext, options?: Partial<IOptions>) {
    this.gl = gl;
    this.uid = `ScalarFill_${uid}`;
    uid++;

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
        createZoom(
          this.uid,
          this.options.getZoom(),
          'opacity',
          this.options.styleSpec,
          true,
        ),
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
        createZoom(
          this.uid,
          this.options.getZoom(),
          'opacity',
          this.options.styleSpec,
        ),
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
      this.colorRampTexture = createTexture(
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
        this.drawCommand = new WindFill(
          gl,
          undefined,
          undefined,
          this.options.injectShaderModules,
        );
      } else if (this.options.renderForm === 'r') {
        this.drawCommand = new Fill(
          gl,
          undefined,
          undefined,
          this.options.injectShaderModules,
        );
      } else {
        console.warn('This type is not supported temporarily');
      }
    }

    this.buildColorRamp();

    if (typeof this.options.getZoom === 'function') {
      this.setOpacity(
        createZoom(
          this.uid,
          this.options.getZoom(),
          'opacity',
          this.options.styleSpec,
        ),
      );
    }
  }

  public initializeVertex(coordinates: number[][]) {
    let i = 0;
    const len = coordinates.length;
    const points: [number, number][] = [];
    for (; i < len; i++) {
      const coords = coordinates[i];
      const mc = this.getMercatorCoordinate(coords as [number, number]);
      points.push([mc[0], mc[1]]);
    }

    // @ts-ignore
    const buffers = (
      this.options.createPlaneBuffer || defaultOptions.createPlaneBuffer
    )(
      points,
      (this.options.widthSegments as number) || 1,
      (this.options.heightSegments as number) || 1,
    );

    return {
      indexes: buffers.elements.data,
      wireframeIndexes: buffers.wireframeElements.data,
      quadBuffer: createBuffer(
        this.gl,
        new Float32Array(buffers.position.data),
      ),
      quad64LowBuffer: createBuffer(
        this.gl,
        new Float32Array(buffers.positionLow.data),
      ),
      texCoordBuffer: createBuffer(this.gl, new Float32Array(buffers.uvs.data)),
    };
  }

  public getTextureData(data: IJsonArrayData | IImageData): Promise<IData> {
    return new Promise((resolve, reject) => {
      if (data.type === 'image' && data.url) {
        loadImage(data.url)
          .then((image) => {
            // this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
            const processedData: IData = {
              width: image.width,
              height: image.height,
              texture: createTexture(
                this.gl,
                this.gl.LINEAR,
                image,
                image.width,
                image.height,
              ),
              ...this.initializeVertex(data.extent),
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
          pos = data.extent;
        } else {
          pos = [
            [gfsData[0].header.lo1, gfsData[0].header.la1],
            [gfsData[0].header.lo1, gfsData[0].header.la2],
            [gfsData[0].header.lo2, gfsData[0].header.la1],
            [gfsData[0].header.lo2, gfsData[0].header.la2],
          ];
        }

        const processedData: IData = {
          width: gfsData[0].header.nx,
          height: gfsData[0].header.ny,
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
              processedData.texture = createTexture(
                this.gl,
                this.gl.LINEAR,
                new Uint8Array(payload[0]),
                processedData.width,
                processedData.height,
              );
            } else if (this.options.renderForm === 'r') {
              processedData.min = payload[1];
              processedData.max = payload[2];
              processedData.texture = createTexture(
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
        .then((d) => {
          this.data = d;

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
    offsetX?: number,
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
        u_offset: isNumber(offsetX) ? offsetX : 0,
        u_color_ramp: this.colorRampTexture,
        u_color_range: this.colorRange,
        u_mapping_range: this.options.mappingRange || [0, 0], // 映射高度
      };

      if (cameraParams) {
        uniforms.u_cameraEye = cameraParams.cameraEye;
        uniforms.u_cameraEye64Low = cameraParams.cameraEye64Low;
      }

      if (this.options.renderForm === 'rg') {
        uniforms.u_wind_min = [this.data.uMin, this.data.vMin];
        uniforms.u_wind_max = [this.data.uMax, this.data.vMax];
        uniforms.u_wind = this.data.texture;
        const speeds = [
          Math.sqrt(
            // @ts-ignore
            this.data.uMin * this.data.uMin + this.data.vMin * this.data.vMin,
          ),
          Math.sqrt(
            // @ts-ignore
            this.data.uMin * this.data.uMin + this.data.vMax * this.data.vMax,
          ),
          Math.sqrt(
            // @ts-ignore
            this.data.uMax * this.data.uMax + this.data.vMax * this.data.vMax,
          ),
          Math.sqrt(
            // @ts-ignore
            this.data.uMax * this.data.uMax + this.data.vMin * this.data.vMin,
          ),
        ];
        const min = 0;
        const max = Math.max(...speeds);
        uniforms.u_display_range = this.options.displayRange || [min, max];
      } else if (this.options.renderForm === 'r') {
        uniforms.u_range = [this.data.min, this.data.max];
        uniforms.u_image = this.data.texture;
        // 如果不指定，使用数据范围，并简单做一个数据 buffer
        uniforms.u_display_range = this.options.displayRange || [
          uniforms.u_range[0] - 1,
          uniforms.u_range[1] + 1,
        ];
      } else {
        console.warn('This type is not supported temporarily');
      }

      const depthEnabled = this.gl.isEnabled(this.gl.DEPTH_TEST);
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthMask(true);
      this.gl.depthFunc(this.gl.LEQUAL);

      const data = this.options.wireframe
        ? this.data.wireframeIndexes
        : this.data.indexes;

      this.drawCommand
        .active()
        // .resize()
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
        .elements({
          data: new Uint32Array(data as number[]),
          primitive: this.options.wireframe ? this.gl.LINES : this.gl.TRIANGLES,
          count: data?.length,
          usage: this.gl.STATIC_DRAW,
        })
        .draw();

      if (!depthEnabled) {
        this.gl.disable(this.gl.DEPTH_TEST);
      }
    }
  }

  public postrender() {}

  public destroyData() {
    if (this.data) {
      // const {
      //   texture,
      //   quadBuffer,
      //   quad64LowBuffer,
      //   texCoordBuffer,
      // } = this.data;
      // if (texture) {
      //   this.gl.deleteTexture(texture);
      // }
      // if (quadBuffer) {
      //   this.gl.deleteBuffer(quadBuffer);
      // }
      //
      // if (quad64LowBuffer) {
      //   this.gl.deleteBuffer(quad64LowBuffer);
      // }
      //
      // if (texCoordBuffer) {
      //   this.gl.deleteBuffer(texCoordBuffer);
      // }
      // delete this.data;
    }
  }

  public destroyed() {
    this.destroyData();
    if (this.worker) {
      this.worker.terminate();
    }
  }
}
