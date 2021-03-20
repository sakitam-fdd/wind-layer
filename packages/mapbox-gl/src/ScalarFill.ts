import * as mapboxgl from 'mapbox-gl';
import {
  fp64LowPart,
  getEye,
  IOptions,
  ScalarFill as ScalarCore,
} from 'wind-gl-core';

export interface IScalarFillOptions extends IOptions {
  wrapX: boolean;
}

function getCoords([lng, lat]: [number, number]): [number, number] {
  const mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat({
    lng,
    lat,
  });
  return [mercatorCoordinate.x, mercatorCoordinate.y];
}

export default class ScalarFill {
  private gl: WebGLRenderingContext;
  private map: mapboxgl.Map;
  private id: string;
  private type: string;
  private renderingMode: '2d' | '3d';
  private options: any;
  private data: any;
  private scalarFill: ScalarCore;

  constructor(id: string, data: any, options?: Partial<IScalarFillOptions>) {
    this.id = id;
    this.type = 'custom';
    this.renderingMode = '2d';
    this.options = options;

    this.data = data;

    this.handleZoom = this.handleZoom.bind(this);
  }

  public handleZoom() {
    if (this.scalarFill) {
      this.scalarFill.handleZoom();
    }
  }

  public initialize() {
    if (!this.scalarFill && this.gl) {
      this.scalarFill = new ScalarCore(this.gl, {
        opacity: this.options.opacity,
        renderForm: this.options.renderForm,
        styleSpec: this.options.styleSpec,
        displayRange: this.options.displayRange,
        mappingRange: this.options.mappingRange,
        widthSegments: this.options.widthSegments,
        heightSegments: this.options.heightSegments,
        getZoom: () => this.map.getZoom(),
        triggerRepaint: () => {
          this.map.triggerRepaint();
        },
      });

      this.scalarFill.getMercatorCoordinate = getCoords;

      this.map.on('zoom', this.handleZoom);
    }
    if (this.data) {
      this.setData(this.data);
    }
  }

  public onAdd(map: mapboxgl.Map, gl: WebGLRenderingContext) {
    this.gl = gl;
    this.map = map;

    if (this.map) {
      this.initialize();
    }
  }

  public setData(data: any) {
    return new Promise((resolve, reject) => {
      this.data = data;
      if (this.data && this.scalarFill) {
        this.scalarFill.setData(this.data, (status) => {
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

  // This is called when the map is destroyed or the gl context lost.
  public onRemove(map: mapboxgl.Map) {
    delete this.gl;
    delete this.map;
    map.off('zoom', this.handleZoom);
  }

  public getWrappedWorlds() {
    const result = [0];

    if (this.options.wrapX) {
      // @ts-ignore
      const { width, height } = this.map.transform;
      // @ts-ignore
      const utl = this.map.transform.pointCoordinate(new mapboxgl.Point(0, 0));
      // @ts-ignore
      const utr = this.map.transform.pointCoordinate(
        new mapboxgl.Point(width, 0),
      );
      // @ts-ignore
      const ubl = this.map.transform.pointCoordinate(
        new mapboxgl.Point(width, height),
      );
      // @ts-ignore
      const ubr = this.map.transform.pointCoordinate(
        new mapboxgl.Point(0, height),
      );
      const w0 = Math.floor(Math.min(utl.x, utr.x, ubl.x, ubr.x));
      const w1 = Math.floor(Math.max(utl.x, utr.x, ubl.x, ubr.x));

      const extraWorldCopy = 1;

      for (let w = w0 - extraWorldCopy; w <= w1 + extraWorldCopy; w++) {
        if (w === 0) {
          continue;
        }
        result.push(w);
      }
    }
    return result;
  }

  public render(gl: WebGLRenderingContext, matrix: number[]) {
    const cameraEye = getEye(matrix);
    const cameraEye64Low = cameraEye.map((item: number) => fp64LowPart(item));
    if (this.data && this.scalarFill) {
      const worlds = this.getWrappedWorlds();
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < worlds.length; i++) {
        this.scalarFill.render(matrix, worlds[i], {
          cameraEye,
          cameraEye64Low,
        });
      }
    }
  }
}
