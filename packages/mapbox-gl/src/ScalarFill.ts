import * as mapboxgl from 'mapbox-gl';

import { Renderer, Scene, OrthographicCamera } from '@sakitam-gis/vis-engine';

import type { LayerData, ScalarFillOptions } from 'wind-gl-core';
import { LayerDataType, ScalarFill as ScalarCore } from 'wind-gl-core';

import CameraSync from './utils/CameraSync';
import { getCoordinatesCenterTileID } from './utils/mercatorCoordinate';

const C = Math.PI * 6378137;

function toLngLat(x, y) {
  const lng = (x / C) * 180;
  let lat = (y / C) * 180;
  lat = (180 / Math.PI) * (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);
  return [lng, lat];
}

function getMercCoords(x, y, z) {
  const resolution = (2 * C) / 256 / 2 ** z;
  const mercX = x * resolution - (2 * C) / 2.0;
  const mercY = y * resolution - (2 * C) / 2.0;

  return toLngLat(mercX, mercY);
}

function getTileBBox(x, y, z, wrap = 0) {
  // for Google/OSM tile scheme we need to alter the y
  // eslint-disable-next-line no-param-reassign
  y = 2 ** z - y - 1;

  const min = getMercCoords(x * 256, y * 256, z);
  const max = getMercCoords((x + 1) * 256, (y + 1) * 256, z);

  const p1 = mapboxgl.MercatorCoordinate.fromLngLat([min[0], max[1]]);
  const p2 = mapboxgl.MercatorCoordinate.fromLngLat([max[0], min[1]]);

  return {
    left: p1.x + wrap,
    top: p1.y,
    right: p2.x + wrap,
    bottom: p2.y,
  };
}

export interface IScalarFillOptions extends ScalarFillOptions {
  wrapX: boolean;
}

export default class ScalarFill {
  public gl: WebGLRenderingContext | WebGL2RenderingContext | null;
  public map: mapboxgl.Map | null;
  public id: string;
  public type: string;
  public renderingMode: '2d' | '3d';
  public sync: CameraSync;
  public scene: Scene;
  public orthoCamera: OrthographicCamera;
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

    this.update = this.update.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  get camera() {
    return this.sync.camera;
  }

  update() {
    this.sync.update();
    if (this.orthoCamera) {
      const { width, height } = (this.map as any).painter as any;
      this.orthoCamera.orthographic(0, width, height, 0, 0, 1);
    }
    if (this.scalarFill) {
      this.scalarFill.updateTiles();
    }
  }

  handleResize() {
    if (this.renderer && this.gl) {
      this.renderer.setSize(this.gl?.canvas?.width, this.gl?.canvas?.height);
    }
    if (this.scalarFill) {
      this.scalarFill.resize();
    }
    this.update();
  }

  handleZoom() {
    if (this.scalarFill) {
      this.scalarFill.handleZoom();
    }
  }

  updateOptions(options: Partial<IScalarFillOptions>) {
    this.options = {
      ...this.options,
      ...(options || {}),
    };
    if (this.scalarFill) {
      // @ts-ignore
      this.scalarFill.updateOptions(options);
    }
  }

  onAdd(map: mapboxgl.Map, gl: WebGLRenderingContext) {
    this.gl = gl;
    this.map = map;

    this.renderer = new Renderer(gl, {
      autoClear: false,
    });

    // const ext = gl.getExtension('OES_texture_float');
    //
    // if (ext) {
    //   gl.getExtension('OES_texture_float_linear');
    //   gl.getExtension('EXT_color_buffer_float');
    // }

    this.scene = new Scene();
    this.sync = new CameraSync(map, 'perspective', this.scene);
    const { width, height } = (this.map as any).painter as any;
    this.orthoCamera = new OrthographicCamera(0, width, height, 0, 0, 1);
    this.scalarFill = new ScalarCore(
      {
        renderer: this.renderer,
        scene: this.scene,
      },
      {
        opacity: this.options.opacity,
        renderFrom: this.options.renderFrom,
        styleSpec: this.options.styleSpec,
        displayRange: this.options.displayRange,
        widthSegments: this.options.widthSegments,
        heightSegments: this.options.heightSegments,
        wireframe: this.options.wireframe,
        getZoom: () => this.map?.getZoom() as number,
        triggerRepaint: () => {
          this.map?.triggerRepaint();
        },
        getViewTiles: (data: LayerData) => {
          const { transform } = this.map as any;
          const wrapTiles: any[] = [];
          if (data.type === LayerDataType.image) {
            const cornerCoords = data.extent.map((c: any) =>
              mapboxgl.MercatorCoordinate.fromLngLat(c),
            );
            const tileID = getCoordinatesCenterTileID(cornerCoords);
            if (this.options.wrapX) {
              transform.getVisibleUnwrappedCoordinates(tileID).forEach((unwrapped) => {
                const x = unwrapped.canonical.x;
                const y = unwrapped.canonical.y;
                const z = unwrapped.canonical.z;
                const wrap = unwrapped.wrap;
                wrapTiles.push({
                  x,
                  y,
                  z,
                  wrap,
                  bounds: getTileBBox(x, y, z, wrap),
                  tileKey: `${z}_${x}_${y}_${wrap}`,
                  size: this.data.tileSize,
                });
              });
            } else {
              const x = tileID.x;
              const y = tileID.y;
              const z = tileID.z;
              const wrap = 0;
              wrapTiles.push({
                x,
                y,
                z,
                wrap,
                bounds: getTileBBox(x, y, z, wrap),
                tileKey: `${z}_${x}_${y}_${wrap}`,
                size: this.data.tileSize,
              });
            }
          } else if (data.type === LayerDataType.tile) {
            const tiles = transform.coveringTiles({
              tileSize: this.data.tileSize,
              minzoom: this.data.minzoom,
              maxzoom: this.data.maxzoom,
              roundZoom: this.data.roundZoom,
            });

            for (let i = 0; i < tiles.length; i++) {
              const tile = tiles[i].toUnwrapped();
              const { x, y, z } = tile.canonical;
              if (this.options.wrapX) {
                wrapTiles.push({
                  x,
                  y,
                  z,
                  wrap: tile.wrap,
                  bounds: getTileBBox(x, y, z, tile.wrap),
                  tileKey: tile.key,
                  size: this.data.tileSize,
                });
              } else if (tile.wrap === 0) {
                wrapTiles.push({
                  x,
                  y,
                  z,
                  wrap: tile.wrap,
                  bounds: getTileBBox(x, y, z, tile.wrap),
                  tileKey: tile.key,
                  size: this.data.tileSize,
                });
              }
            }
          }
          return wrapTiles;
        },
      },
    );
    if (this.data) {
      this.setData(this.data);
    }
    map.on('move', this.update);
    map.on('zoom', this.handleZoom);
    map.on('resize', this.handleResize);
    this.update();
  }

  setData(data: any) {
    return new Promise((resolve) => {
      this.data = data;
      if (this.data && this.scalarFill) {
        this.scalarFill.setData(this.data);
      } else {
        resolve(false);
      }
    });
  }

  onRemove() {
    if (this.scalarFill) {
      this.scalarFill = null;
    }
    this.map?.off('zoom', this.handleZoom);
    this.map?.off('move', this.update);
    this.map?.off('resize', this.handleResize);
    this.map = null;
    this.gl = null;
  }

  prerender() {
    this.scene.worldMatrixNeedsUpdate = true;
    this.scene.updateMatrixWorld();
    this.camera.updateMatrixWorld();
    this.scalarFill?.prerender(this.camera);
  }

  render() {
    this.scene.worldMatrixNeedsUpdate = true;
    this.scene.updateMatrixWorld();
    this.camera.updateMatrixWorld();
    this.scalarFill?.render(this.orthoCamera);
  }
}
