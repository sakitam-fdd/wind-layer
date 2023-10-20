import * as mapboxgl from 'mapbox-gl';
import rewind from '@mapbox/geojson-rewind';
import { OrthographicCamera, Renderer, Scene, utils } from '@sakitam-gis/vis-engine';

import type { BaseLayerOptions, SourceType } from 'wind-gl-core';
import { BaseLayer, LayerSourceType, RenderType, TileID, polygon2buffer } from 'wind-gl-core';

import CameraSync from './utils/CameraSync';
import { getCoordinatesCenterTileID } from './utils/mercatorCoordinate';

import { expandTiles, getTileBounds, getTileProjBounds } from './utils/tile';

export interface LayerOptions extends BaseLayerOptions {
  renderingMode: '2d' | '3d';
}

export type ILayerOptions = Omit<LayerOptions, 'getViewTiles'>;

export default class Layer {
  public gl: WebGLRenderingContext | WebGL2RenderingContext | null;
  public map: WithNull<mapboxgl.Map>;
  public id: string;
  public type: string;
  public renderingMode: '2d' | '3d';
  public sync: CameraSync;
  public scene: Scene;
  public planeCamera: OrthographicCamera;
  public renderer: Renderer;
  private options: any;
  private source: SourceType;
  private layer: WithNull<BaseLayer>;

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
      const { width, height } = (this.map as any).painter;
      this.renderer.setSize(width, height);

      if (this.layer) {
        this.layer.resize(width, height);
      }
      this.update();
    }
  }

  handleZoom() {
    if (this.layer) {
      this.layer.handleZoom();
    }
  }

  updateOptions(options: Partial<ILayerOptions>) {
    this.options = {
      ...this.options,
      ...(options || {}),
    };
    if (this.layer) {
      this.layer.updateOptions(options);
    }
  }

  public getMask() {
    return this.options.mask;
  }

  private processMask() {
    if (this.options.mask) {
      const mask = this.options.mask;
      const data = mask.data;
      // @link https://github.com/mapbox/geojson-rewind
      rewind(data, true);

      const tr = (coords) => {
        const mercatorCoordinates: any[] = [];
        for (let i = 0; i < coords.length; i++) {
          const coord = coords[i];
          const p = mapboxgl.MercatorCoordinate.fromLngLat(coord);
          mercatorCoordinates.push([p.x, p.y]);
        }

        return mercatorCoordinates;
      };

      const features = data.features;
      const len = features.length;
      let i = 0;
      const fs: any[] = [];
      for (; i < len; i++) {
        const feature = features[i];

        const coordinates = feature.geometry.coordinates;
        const type = feature.geometry.type;

        if (type === 'Polygon') {
          fs.push({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: feature.geometry.coordinates.map((c) => tr(c)),
            },
          });
        } else if (type === 'MultiPolygon') {
          const css: any[] = [];
          for (let k = 0; k < coordinates.length; k++) {
            const coordinate = coordinates[k];
            const cs: any[] = [];
            for (let n = 0; n < coordinate.length; n++) {
              cs.push(tr(coordinates[k][n]));
            }

            css.push(cs);
          }

          fs.push({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'MultiPolygon',
              coordinates: css,
            },
          });
        }
      }

      return {
        data: polygon2buffer(fs),
        type: mask.type,
      };
    }
  }

  public setMask(mask) {
    this.options.mask = Object.assign({}, this.options.mask, mask);

    if (this.layer) {
      this.layer.setMask(this.processMask());
    }
  }

  onAdd(m: mapboxgl.Map, gl: WebGLRenderingContext) {
    this.gl = gl;
    this.map = m;
    const canvas = m.getCanvas();

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
    this.sync = new CameraSync(this.map, 'perspective', this.scene);
    this.planeCamera = new OrthographicCamera(0, 1, 1, 0, 0, 1);
    this.layer = new BaseLayer(
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
        picking: this.options.picking,
        mask: this.processMask(),
        getZoom: () => this.map?.getZoom() as number,
        triggerRepaint: () => {
          this.map?.triggerRepaint();
        },
        getTileProjSize: (z: number) => {
          const w = 1 / Math.pow(2, z);
          return [w, w];
        },
        getPixelsToUnits: (): [number, number] => {
          const pixel = 1;
          const y = canvas.clientHeight / 2 - pixel / 2;
          const x = canvas.clientWidth / 2 - pixel / 2;
          const left = mapboxgl.MercatorCoordinate.fromLngLat(m.unproject([x, y]));
          const right = mapboxgl.MercatorCoordinate.fromLngLat(m.unproject([x + pixel, y + pixel]));

          return [Math.abs(right.x - left.x), Math.abs(left.y - right.y)];
        },
        getPixelsToProjUnit: () => [
          (this.map as any)?.transform.pixelsPerMeter,
          (this.map as any)?.transform.pixelsPerMeter,
        ],
        getViewTiles: (source: SourceType, renderType: RenderType) => {
          let { type } = source;
          // @ts-ignore
          type = type !== LayerSourceType.timeline ? type : source.privateType;
          const map = this.map as any;
          if (!map) return [];
          const { transform } = map;
          const wrapTiles: TileID[] = [];
          if (type === LayerSourceType.image) {
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
                  new TileID(z, wrap, z, x, y, {
                    getTileBounds: () => [
                      (source as any).coordinates[0][0],
                      (source as any).coordinates[2][1],
                      (source as any).coordinates[1][0],
                      (source as any).coordinates[0][1],
                    ],
                    getTileProjBounds: () => ({
                      left: tileID.extent[0] + wrap,
                      top: tileID.extent[1],
                      right: tileID.extent[2] + wrap,
                      bottom: tileID.extent[3],
                    }),
                  }),
                );
              });
            } else {
              const x = tileID.x;
              const y = tileID.y;
              const z = tileID.z;
              const wrap = 0;
              wrapTiles.push(
                new TileID(z, wrap, z, x, y, {
                  getTileBounds: () => [
                    (source as any).coordinates[0][0],
                    (source as any).coordinates[2][1],
                    (source as any).coordinates[1][0],
                    (source as any).coordinates[0][1],
                  ],
                  getTileProjBounds: () => ({
                    left: tileID.extent[0] + wrap,
                    top: tileID.extent[1],
                    right: tileID.extent[2] + wrap,
                    bottom: tileID.extent[3],
                  }),
                }),
              );
            }
          } else if (type === LayerSourceType.tile) {
            const opts = {
              tileSize: utils.isNumber(this.source.tileSize)
                ? source.tileSize
                : source.tileSize?.[0] || 512,
              // for mapbox
              minzoom: source.minZoom,
              maxzoom: source.maxZoom,
              roundZoom: source.roundZoom,
            };

            // eslint-disable-next-line no-empty
            const tiles = transform.coveringTiles(opts);

            for (let i = 0; i < tiles.length; i++) {
              const tile = tiles[i];
              const { canonical, wrap } = tile;
              const { x, y, z } = canonical;
              if (source.wrapX) {
                wrapTiles.push(
                  new TileID(z, wrap, z, x, y, {
                    getTileBounds,
                    getTileProjBounds,
                  }),
                );
              } else if (tile.wrap === 0) {
                wrapTiles.push(
                  new TileID(z, wrap, z, x, y, {
                    getTileBounds,
                    getTileProjBounds,
                  }),
                );
              }
            }

            // 针对粒子图层，需要补齐所需瓦片，避免采样出现问题
            if (renderType === RenderType.particles) {
              wrapTiles.push(...expandTiles(wrapTiles));
            }
          }

          return wrapTiles;
        },
        getExtent: () => {
          const map = this.map as any;
          const bounds: any = map?.getBounds().toArray();

          const xmin = bounds[0][0];
          const ymin = bounds[0][1];
          const xmax = bounds[1][0];
          const ymax = bounds[1][1];
          const minY = Math.max(
            ymin,
            map.transform.latRange ? map.transform.latRange[0] : map.transform.minLat,
          );
          const maxY = Math.min(
            ymax,
            map.transform.latRange ? map.transform.latRange[1] : map.transform.maxLat,
          );
          const p0 = mapboxgl.MercatorCoordinate.fromLngLat(new mapboxgl.LngLat(xmin, maxY));
          const p1 = mapboxgl.MercatorCoordinate.fromLngLat(new mapboxgl.LngLat(xmax, minY));
          return [p0.x, p0.y, p1.x, p1.y];
        },
        getSteadyStateExtent: () => {
          return [0, 0, 0, 0];
        },
        getGridTiles: () => {
          const map = this.map as any;
          if (!map) return [];
          const { transform } = map;

          const opts = {
            tileSize: 512,
            minzoom: map.getMinZoom(),
            maxzoom: map.getMaxZoom(),
            roundZoom: false,
          };

          const tiles = transform.coveringTiles(opts);
          const wrapTiles: TileID[] = [];

          for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];
            const { canonical, wrap } = tile;
            const { x, y, z } = canonical;
            wrapTiles.push(
              new TileID(z, wrap, z, x, y, {
                getTileBounds,
                getTileProjBounds,
              }),
            );
          }

          return wrapTiles;
        },
      },
    );

    this.map.on('movestart', this.moveStart);
    this.map.on('move', this.update);
    this.map.on('moveend', this.moveEnd);
    this.map.on('zoom', this.handleZoom);
    this.map.on('zoomend', this.handleZoom);
    this.map.on('resize', this.handleResize);
    this.handleResize();
    this.update();
  }

  calcWrappedWorlds() {
    const result = [0];

    if (this.source?.wrapX) {
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

  onRemove() {
    if (this.layer) {
      this.layer.destroy();
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
    const worlds = this.calcWrappedWorlds();
    this.layer?.prerender({
      worlds,
      camera: this.camera,
      planeCamera: this.planeCamera,
    });
  }

  async picker(coordinates) {
    if (!this.options.picking) {
      console.warn('[Layer]: please enable picking options!');
      return null;
    }
    if (!this.layer || !coordinates || !this.map) {
      console.warn('[Layer]: layer not initialized!');
      return null;
    }
    const point = this.map.project(coordinates);
    return this.layer.picker([point.x, point.y]);
  }

  render() {
    this.scene.worldMatrixNeedsUpdate = true;
    this.scene.updateMatrixWorld();
    this.camera.updateMatrixWorld();
    const worlds = this.calcWrappedWorlds();
    this.layer?.render({
      worlds,
      camera: this.camera,
      planeCamera: this.planeCamera,
    });
  }
}
