import * as mapboxgl from 'mapbox-gl';
import { fp64LowPart, getEye, WindParticles } from 'wind-gl-core';

export interface IParticlesOptions {
  wrapX: boolean;
}

function getCoords([lng, lat]: [number, number]): [number, number] {
  const mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat({
    lng,
    lat,
  });
  return [mercatorCoordinate.x, mercatorCoordinate.y];
}

export default class Particles {
  private gl: WebGLRenderingContext;
  private map: any;
  private id: string;
  private type: string;
  private renderingMode: '2d' | '3d';
  private options: any;
  private data: any;
  private layer: any;

  constructor(id: string, data: any, options?: Partial<IParticlesOptions>) {
    this.id = id;
    this.type = 'custom';
    this.renderingMode = '2d';
    this.options = {
      ...(options || {}),
    };

    this.data = data;

    this.resize = this.resize.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.handleMovestart = this.handleMovestart.bind(this);
    this.handleMoveend = this.handleMoveend.bind(this);
  }

  public handleZoom() {
    if (this.layer) {
      this.layer.handleZoom();
    }
  }

  public resize() {
    if (this.layer) {
      this.layer.resize();
    }
  }

  public handleMovestart() {
    if (this.layer) {
      this.layer.handleMovestart();
    }
  }

  public handleMoveend() {
    if (this.layer) {
      this.layer.handleMoveend();
    }
  }

  public initialize() {
    if (!this.layer && this.gl) {
      this.layer = new WindParticles(this.gl, {
        opacity: this.options.opacity,
        styleSpec: this.options.styleSpec,
        getZoom: () => this.map.getZoom() as number,
        triggerRepaint: () => {
          this.map.triggerRepaint();
        },
        dropRate: 0.003,
        dropRateBump: 0.002,
      });

      this.layer.getMercatorCoordinate = getCoords;

      this.map.on('zoom', this.handleZoom);
      this.map.on('movestart', this.handleMovestart);
      this.map.on('resize', this.resize);
      this.map.on('moveend', this.handleMoveend);
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
      if (this.data && this.layer) {
        this.layer.setData(this.data, (status: any) => {
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
    if (this.layer) {
      this.layer.destroyed();
    }
    map.off('zoom', this.handleZoom);
    map.off('movestart', this.handleMovestart);
    map.off('resize', this.resize);
    map.off('moveend', this.handleMoveend);
    delete this.gl;
    delete this.map;
  }

  public getWrappedWorlds() {
    const result = [0];

    if (this.options.wrapX) {
      const { width, height } = this.map.transform;
      const utl = this.map.transform.pointCoordinate(new mapboxgl.Point(0, 0));
      const utr = this.map.transform.pointCoordinate(
        new mapboxgl.Point(width, 0),
      );
      const ubl = this.map.transform.pointCoordinate(
        new mapboxgl.Point(width, height),
      );
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
    if (this.data && this.layer) {
      const worlds = this.getWrappedWorlds();
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < worlds.length; i++) {
        this.layer.prerender(matrix, worlds[i], {
          cameraEye,
          cameraEye64Low,
        });
      }
      this.layer.render(matrix);
    }
  }
}
