import * as mapboxgl from 'mapbox-gl';

import { Renderer, Scene, highPrecision } from '@sakitam-gis/vis-engine';

import { IOptions, ScalarFill as ScalarCore } from 'wind-gl-core';

import CameraSync from './utils/CameraSync';
import { fromLngLat } from './utils/mercatorCoordinate';

highPrecision(true);

export interface IScalarFillOptions extends IOptions {
  wrapX: boolean;
}

function getCoords(coords: number[]): number[] {
  const mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
    {
      lng: coords[0],
      lat: coords[1],
    },
    coords[2],
  );
  return [mercatorCoordinate.x, mercatorCoordinate.y, mercatorCoordinate.z as number];
}

export default class ScalarFill {
  public gl: WebGLRenderingContext | WebGL2RenderingContext | null;
  public map: mapboxgl.Map | null;
  public id: string;
  public type: string;
  public renderingMode: '2d' | '3d';
  public sync: CameraSync;
  public scene: Scene;
  public renderer: Renderer;
  private options: any;
  private data: any;
  private scalarFill: ScalarCore | null;

  constructor(id: string, data: any, options?: Partial<IScalarFillOptions>) {
    this.id = id;
    this.type = 'custom';
    this.renderingMode = '3d';
    this.options = {
      ...(options || {}),
    };

    this.data = data;

    this.updateCamera = this.updateCamera.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
  }

  get camera() {
    return this.sync.camera;
  }

  updateCamera() {
    this.sync.update();
  }

  projectToWorld(coord) {
    const mc = fromLngLat(
      {
        lng: coord[0],
        lat: coord[1],
      },
      coord[2],
    );

    return [mc.x, mc.y, mc.z];
  }

  public handleZoom() {
    if (this.scalarFill) {
      this.scalarFill.handleZoom();
    }
  }

  public initialize() {
    if (!this.scalarFill && this.gl && this.map) {
      this.renderer = new Renderer(this.gl, {
        autoClear: false,
      });
      this.scene = new Scene();
      this.sync = new CameraSync(this.map, 'perspective', this.scene);

      this.scalarFill = new ScalarCore(
        {
          // @ts-ignore
          renderer: this.renderer,
          // @ts-ignore
          scene: this.scene,
        },
        {
          opacity: this.options.opacity,
          renderForm: this.options.renderForm,
          styleSpec: this.options.styleSpec,
          displayRange: this.options.displayRange,
          widthSegments: this.options.widthSegments,
          heightSegments: this.options.heightSegments,
          wireframe: this.options.wireframe,
          createPlaneBuffer: this.options.createPlaneBuffer,
          getZoom: () => this.map?.getZoom() as number,
          triggerRepaint: () => {
            this.map?.triggerRepaint();
          },
        },
      );

      this.scalarFill.getWorldCoordinate = getCoords;

      this.map.on('zoom', this.handleZoom);
      this.map.on('move', this.updateCamera);
      this.map.on('resize', this.updateCamera);
    }
    if (this.data) {
      this.setData(this.data);
    }
  }

  public updateOptions(options: Partial<IScalarFillOptions>) {
    this.options = {
      ...this.options,
      ...(options || {}),
    };
    if (this.scalarFill) {
      this.scalarFill.updateOptions(options);
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

  public onRemove() {
    if (this.scalarFill) {
      this.scalarFill = null;
    }
    this.map?.off('zoom', this.handleZoom);
    this.map?.off('move', this.updateCamera);
    this.map?.off('resize', this.updateCamera);
    this.map = null;
    this.gl = null;
  }

  public getWrappedWorlds() {
    const result = [0];

    if (this.options.wrapX) {
      // @ts-ignore
      const { width, height } = this.map.transform;
      // @ts-ignore
      const utl = this.map.transform.pointCoordinate(new mapboxgl.Point(0, 0));
      // @ts-ignore
      const utr = this.map.transform.pointCoordinate(new mapboxgl.Point(width, 0));
      // @ts-ignore
      const ubl = this.map.transform.pointCoordinate(new mapboxgl.Point(width, height));
      // @ts-ignore
      const ubr = this.map.transform.pointCoordinate(new mapboxgl.Point(0, height));
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

  public render() {
    this.scene.worldMatrixNeedsUpdate = true;
    const worlds = this.getWrappedWorlds();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < worlds.length; i++) {
      this.scalarFill?.render(this.camera, worlds[i]);
    }
    this.renderer.resetState();
  }
}
