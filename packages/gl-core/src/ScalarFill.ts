import {
  utils,
  Texture,
  Renderer,
  Scene,
  Program,
  PerspectiveCamera,
  Plane,
  Mesh,
  DataTexture,
} from '@sakitam-gis/vis-engine';
// @ts-ignore
import DataProcess from 'web-worker:./workers/DataProcesse';
import { IPlaneBuffer, loadImage } from './utils/gl-utils';
import { createLinearGradient, createZoom } from './utils/style-parser';
import fillVert from './shaders/fill.vert.glsl';
import fillFrag from './shaders/fill.frag.glsl';
import * as shaderLib from './shaders/shaderLib';

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
  texture?: Texture;
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
};

export function checkUVData(data: IData) {
  return (
    utils.isNumber(data.uMin) &&
    utils.isNumber(data.uMax) &&
    utils.isNumber(data.vMin) &&
    utils.isNumber(data.vMax)
  );
}

export function checkData(data: IData) {
  return utils.isNumber(data.min) && utils.isNumber(data.max);
}

export default class ScalarFill {
  public readonly renderer: Renderer;
  public data: IData;
  public colorRampTexture: DataTexture;
  public uid: string;

  private options: IOptions;

  private opacity: number;

  private colorRange: [number, number];

  private worker: Worker;

  private program: Program;

  private geometry: Plane;

  private mesh: Mesh;

  private scene: Scene;

  constructor(rs: { renderer: Renderer; scene: Scene }, options?: Partial<IOptions>) {
    this.renderer = rs.renderer;
    this.scene = rs.scene;

    if (!this.renderer) {
      throw new Error('initialize error');
    }

    if (!options) {
      // eslint-disable-next-line no-param-reassign
      options = {} as IOptions;
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
        createZoom(this.uid, this.options.getZoom(), 'opacity', this.options.styleSpec, true),
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
        createZoom(this.uid, this.options.getZoom(), 'opacity', this.options.styleSpec),
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
      this.colorRampTexture = new DataTexture(this.renderer, {
        data,
        magFilter: this.renderer.gl.NEAREST,
        minFilter: this.renderer.gl.NEAREST,
        width: 255,
        height: 1,
      });
    }
  }

  public initialize() {
    if (!this.program) {
      this.program = new Program(this.renderer, {
        vertexShader: fillVert,
        fragmentShader: fillFrag,
        uniforms: {
          texture: {
            value: undefined,
          },
        },
        defines: ['RENDER_TYPE'],
        includes: shaderLib,
      });
    }

    if (this.mesh) {
      this.mesh.destroy();
      this.scene.remove(this.mesh);
    }

    this.mesh = new Mesh(this.renderer, {
      geometry: this.geometry,
      program: this.program,
      wireframe: this.options.wireframe,
    });

    this.mesh.position.fromArray([0.5, 0.5, 0]);

    this.scene.add(this.mesh);

    this.buildColorRamp();

    if (typeof this.options.getZoom === 'function') {
      this.setOpacity(
        createZoom(this.uid, this.options.getZoom(), 'opacity', this.options.styleSpec),
      );
    }
  }

  /**
   * 注意这里我们一般初始化的 Plane Geometry，我们为了提高精度
   * 会采用相对坐标，集合体的所有顶点坐标转换为相对于几何体的相对坐标
   * @param coordinates
   */
  public initializeGeometry(coordinates: number[][]) {
    let i = 0;
    const len = coordinates.length;
    const points: [number, number, number][] = [];
    for (; i < len; i++) {
      const coords = coordinates[i];
      const mc = this.getMercatorCoordinate(coords as [number, number]);
      points.push([mc[0], mc[1], 0]);
    }

    if (this.geometry) {
      this.geometry.destroy();
    }

    this.geometry = new Plane(this.renderer, {
      width: 1,
      height: 1,
      widthSegments: this.options.widthSegments,
      heightSegments: this.options.heightSegments,
    });
  }

  public getTextureData(data: IJsonArrayData | IImageData): Promise<IData> {
    return new Promise((resolve, reject) => {
      if (data.type === 'image' && data.url) {
        loadImage(data.url)
          .then((image) => {
            const processedData: IData = {
              width: image.width,
              height: image.height,
              texture: new Texture(this.renderer, {
                width: image.width,
                height: image.height,
                image,
              }),
            };

            this.initializeGeometry(data.extent);

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
        };

        this.initializeGeometry(pos);

        if (!this.worker) {
          this.worker = new DataProcess();
          this.worker.addEventListener('message', ({ data: payload }: any) => {
            if (this.options.renderForm === 'rg') {
              processedData.uMin = payload[1];
              processedData.uMax = payload[2];
              processedData.vMin = payload[3];
              processedData.vMax = payload[4];
              processedData.texture = new Texture(this.renderer, {
                width: processedData.width,
                height: processedData.height,
                image: new Uint8Array(payload[0]),
              });
            } else if (this.options.renderForm === 'r') {
              processedData.min = payload[1];
              processedData.max = payload[2];
              processedData.texture = new Texture(this.renderer, {
                width: processedData.width,
                height: processedData.height,
                image: new Uint8Array(payload[0]),
              });
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
            switch (record.header.parameterCategory + ',' + record.header.parameterNumber) {
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

  public setData(data: IJsonArrayData | IImageData, cb?: (args?: boolean) => void) {
    if (data) {
      // Error Prevention
      this.getTextureData(data)
        .then((d) => {
          this.data = d;

          cb && cb(true);

          if (this.data) {
            this.initialize();
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

  public prerender() {
    throw new Error('ScalarFill subclass must define virtual methods');
  }

  public render(camera: PerspectiveCamera, offsetX = 0) {
    if (this.data && this.program && this.data.texture && this.colorRampTexture) {
      const opacity = this.opacity;

      const uniforms: any = {
        u_opacity: utils.isNumber(opacity) ? opacity : 1,
        u_image_res: [this.data.width, this.data.height],
        u_offset: utils.isNumber(offsetX) ? offsetX : 0,
        u_color_ramp: this.colorRampTexture,
        u_color_range: this.colorRange,
        u_mapping_range: this.options.mappingRange || [0, 0], // 映射高度
      };

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

      Object.keys(uniforms).forEach((k) => {
        this.program.setUniform(k, uniforms[k]);
      });

      this.renderer.render({
        scene: this.scene,
        camera,
      });
    }
  }

  public postrender() {
    throw new Error('ScalarFill subclass must define virtual methods');
  }

  public destroy() {
    if (this.mesh) {
      this.mesh.destroy();
    }

    if (this.program) {
      this.program.destroy();
    }

    if (this.worker) {
      this.worker.terminate();
    }
  }
}
