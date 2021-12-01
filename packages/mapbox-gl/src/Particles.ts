import * as mapboxgl from 'mapbox-gl';
// @ts-ignore
import { IWindOptions, WindParticles } from 'wind-gl-core';

export interface IParticlesOptions extends IWindOptions {
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
  public map: any;
  public id: string;
  public type: string;
  public renderingMode: '2d' | '3d';
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

  public updateOptions(options: Partial<IWindOptions>) {
    this.options = {
      ...this.options,
      ...(options || {}),
    };
    if (this.layer) {
      this.layer.updateOptions(options);
    }
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
        getZoom: () => this.map.getZoom() as number,
        triggerRepaint: () => {
          this.map.triggerRepaint();
        },
        getExtent: () => {
          const bounds = this.map.getBounds().toArray();
          let xmin = bounds[0][0];
          const ymin = bounds[0][1];
          let xmax = bounds[1][0];
          const ymax = bounds[1][1];

          // 如果是多世界了，固定 x 范围到-180 到 180,但是此时采样会出问题
          // 比如 -190 - -170范围 -1 世界和 0 世界按全球范围采样会出现错误
          const worlds = this.getWrappedWorlds();
          if (worlds.length > 1) {
            xmin = -180;
            xmax = 180;
          } else {
            if (xmin < -180) {
              xmin = -180;
            }

            if (xmax > 180) {
              xmax = 180;
            }
          }

          const p0 = mapboxgl.MercatorCoordinate.fromLngLat(
            new mapboxgl.LngLat(xmin, ymax),
          );
          const p1 = mapboxgl.MercatorCoordinate.fromLngLat(
            new mapboxgl.LngLat(xmax, ymin),
          );
          return [p0.x, p0.y, p1.x, p1.y];
        },
        getSize: () => {
          return [
            this.map.transform.size.x as number,
            this.map.transform.size.y as number,
          ];
        },
        interacting: () => {
          return (
            !this.map.painter.options.moving &&
            !this.map.painter.options.rotating &&
            !this.map.painter.options.zooming
          );
        },
        getWorlds: () => this.getWrappedWorlds(),
        ...this.options,
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
      this.layer = null;
    }
    map.off('zoom', this.handleZoom);
    map.off('movestart', this.handleMovestart);
    map.off('resize', this.resize);
    map.off('moveend', this.handleMoveend);
    // @ts-ignore
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

      const extraWorldCopy = 0;

      for (let w = w0 - extraWorldCopy; w <= w1 + extraWorldCopy; w++) {
        if (w === 0) {
          continue;
        }
        result.push(w);
      }
    }
    return result;
  }

  public prerender(gl: WebGLRenderingContext, matrix: number[]) {
    if (this.data && this.layer) {
      this.layer.prerender(matrix);
    }
  }

  public render(gl: WebGLRenderingContext, matrix: number[]) {
    if (this.data && this.layer) {
      this.layer.render(matrix);
    }
  }
}
