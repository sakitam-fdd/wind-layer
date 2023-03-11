import * as mapboxgl from 'mapbox-gl';

import { Renderer, Scene, OrthographicCamera, utils } from '@sakitam-gis/vis-engine';

import type { LayerOptions, SourceType } from 'wind-gl-core';
import { Layer as LayerCore, TileID } from 'wind-gl-core';

import CameraSync from './utils/CameraSync';
import { getCoordinatesCenterTileID } from './utils/mercatorCoordinate';

function getCoords(x, y, z) {
  const zz = Math.pow(2, z);

  const lng = (x / zz) * 360 - 180;
  // const lng = x / zz;
  let lat = (y / zz) * 360 - 180;
  lat = (180 / Math.PI) * (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);

  return [lng, lat];
}

function getTileBounds(x, y, z, wrap = 0) {
  // for Google/OSM tile scheme we need to alter the y
  // eslint-disable-next-line no-param-reassign
  y = 2 ** z - y - 1;

  const min = getCoords(x, y, z);
  const max = getCoords(x + 1, y + 1, z);

  const p1 = mapboxgl.MercatorCoordinate.fromLngLat([min[0], max[1]]);
  const p2 = mapboxgl.MercatorCoordinate.fromLngLat([max[0], min[1]]);

  return {
    left: p1.x + wrap,
    top: p1.y,
    right: p2.x + wrap,
    bottom: p2.y,
    lngLatBounds: [min[0], min[1], max[0], max[1]],
  };
}

export interface ILayerOptions extends LayerOptions {
  renderingMode: '2d' | '3d';
}

export default class Layer {
  public gl: WebGLRenderingContext | WebGL2RenderingContext | null;
  public map: WithNull<mapboxgl.Map>;
  public id: string;
  public type: string;
  public renderingMode: '2d' | '3d';
  public sync: CameraSync;
  public scene: Scene;
  public orthoCamera: OrthographicCamera;
  public planeCamera: OrthographicCamera;
  public renderer: Renderer;
  private options: any;
  private source: SourceType;
  private layer: WithNull<LayerCore>;

  constructor(id: string, source: SourceType, options?: ILayerOptions) {
    this.id = id;
    this.type = 'custom';
    this.renderingMode = options?.renderingMode || '2d';
    this.options = {
      ...(options || {}),
    };

    this.source = source;

    this.update = this.update.bind(this);
    this.moveStart = this.moveStart.bind(this);
    this.moveEnd = this.moveEnd.bind(this);
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
    if (this.layer) {
      this.layer.update();
    }
  }

  moveStart() {
    if (this.layer) {
      this.layer.moveStart();
    }
  }

  moveEnd() {
    if (this.layer) {
      this.layer.moveEnd();
    }
  }

  handleResize() {
    if (this.renderer && this.gl) {
      this.renderer.setSize(this.gl?.canvas?.width, this.gl?.canvas?.height);
    }
    if (this.layer) {
      this.layer.resize();
    }
    this.update();
  }

  handleZoom() {
    if (this.layer) {
      this.layer.handleZoom();
    }
  }

  updateOptions(options: ILayerOptions) {
    this.options = {
      ...this.options,
      ...(options || {}),
    };
    if (this.layer) {
      this.layer.updateOptions(options);
    }
  }

  onAdd(map: mapboxgl.Map, gl: WebGLRenderingContext) {
    this.gl = gl;
    this.map = map;

    this.renderer = new Renderer(gl, {
      autoClear: false,
      extensions: [
        'OES_texture_float',
        'OES_texture_float_linear',
        'WEBGL_color_buffer_float',
        'EXT_color_buffer_float',
      ],
    });

    this.scene = new Scene();
    this.sync = new CameraSync(map, 'perspective', this.scene);
    const { width, height } = (this.map as any).painter as any;
    this.orthoCamera = new OrthographicCamera(0, width, height, 0, 0, 1);
    this.planeCamera = new OrthographicCamera(0, 1, 1, 0, 0, 1);
    this.layer = new LayerCore(
      this.source,
      {
        renderer: this.renderer,
        scene: this.scene,
      },
      {
        opacity: this.options.opacity,
        renderType: this.options.renderType,
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
        getViewTiles: (source: SourceType) => {
          let { type } = source;
          // @ts-ignore
          type = type !== 'timeline' ? type : source.privateType;
          const { transform } = this.map as any;
          const wrapTiles: TileID[] = [];
          if (type === 'image') {
            // @ts-ignore
            const cornerCoords = source.coordinates.map((c: any) =>
              mapboxgl.MercatorCoordinate.fromLngLat(c),
            );
            const tileID = getCoordinatesCenterTileID(cornerCoords);
            if (source.wrapX) {
              transform.getVisibleUnwrappedCoordinates(tileID).forEach((unwrapped) => {
                const { canonical, wrap } = unwrapped;
                const { x, y, z } = canonical;
                wrapTiles.push(
                  new TileID(z, x, y, z, wrap, {
                    getTileBounds,
                  }),
                );
              });
            } else {
              const x = tileID.x;
              const y = tileID.y;
              const z = tileID.z;
              const wrap = 0;
              wrapTiles.push(
                new TileID(z, x, y, z, wrap, {
                  getTileBounds,
                }),
              );
            }
          } else if (type === 'tile') {
            const tiles = transform.coveringTiles({
              tileSize: utils.isNumber(this.source.tileSize)
                ? source.tileSize
                : source.tileSize?.[0] || 512,
              minzoom: source.minZoom,
              maxzoom: source.maxZoom,
              roundZoom: source.roundZoom,
            });

            for (let i = 0; i < tiles.length; i++) {
              const tile = tiles[i];
              const { canonical, wrap } = tile;
              const { x, y, z } = canonical;
              if (source.wrapX) {
                wrapTiles.push(
                  new TileID(z, x, y, z, wrap, {
                    getTileBounds,
                  }),
                );
              } else if (tile.wrap === 0) {
                wrapTiles.push(
                  new TileID(z, x, y, z, wrap, {
                    getTileBounds,
                  }),
                );
              }
            }
          }
          return wrapTiles;
        },
      },
    );

    map.on('movestart', this.moveStart);
    map.on('move', this.update);
    map.on('moveend', this.moveEnd);
    map.on('zoom', this.handleZoom);
    map.on('zoomend', this.handleZoom);
    map.on('resize', this.handleResize);
    this.update();
  }

  onRemove() {
    if (this.layer) {
      this.layer = null;
    }
    this.map?.off('zoom', this.handleZoom);
    this.map?.off('zoomend', this.handleZoom);
    this.map?.off('movestart', this.moveStart);
    this.map?.off('move', this.update);
    this.map?.off('moveend', this.moveEnd);
    this.map?.off('resize', this.handleResize);
    this.map = null;
    this.gl = null;
  }

  prerender() {
    this.scene.worldMatrixNeedsUpdate = true;
    this.scene.updateMatrixWorld();
    this.camera.updateMatrixWorld();
    this.layer?.prerender({
      camera: this.camera,
      orthoCamera: this.orthoCamera,
      planeCamera: this.planeCamera,
    });
  }

  render() {
    this.scene.worldMatrixNeedsUpdate = true;
    this.scene.updateMatrixWorld();
    this.camera.updateMatrixWorld();
    this.layer?.render({
      camera: this.camera,
      orthoCamera: this.orthoCamera,
      planeCamera: this.planeCamera,
    });
  }
}
