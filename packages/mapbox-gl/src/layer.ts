import * as mapboxgl from 'mapbox-gl';
import { OrthographicCamera, Renderer, Scene, utils } from '@sakitam-gis/vis-engine';

import type { LayerOptions, SourceType } from 'wind-gl-core';
import { Layer as LayerCore, RenderType, TileID } from 'wind-gl-core';

import CameraSync from './utils/CameraSync';
import { getCoordinatesCenterTileID } from './utils/mercatorCoordinate';

import { getBoundsTiles, getTileProjBounds, calcBounds } from './utils/tile';

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

  onAdd(m: mapboxgl.Map, gl: WebGLRenderingContext) {
    this.gl = gl;
    this.map = m;

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
        picking: this.options.picking,
        getZoom: () => this.map?.getZoom() as number,
        triggerRepaint: () => {
          this.map?.triggerRepaint();
        },
        getViewTiles: (source: SourceType, renderType: RenderType) => {
          const map = this.map as any;
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
          } else if (type === 'tile') {
            const opts = {
              tileSize: utils.isNumber(this.source.tileSize)
                ? source.tileSize
                : source.tileSize?.[0] || 512,
              // for mapbox
              minzoom: source.minZoom,
              maxzoom: source.maxZoom,
              // for custom
              minZoom: source.minZoom,
              maxZoom: source.maxZoom,
              roundZoom: source.roundZoom,
            };

            // 当为瓦片状态下的粒子渲染时需要按照获取的瓦片范围补齐周边缺失的瓦片，构建一个矩形
            // eslint-disable-next-line no-empty
            if (renderType !== RenderType.particles) {
              const bounds: any = map?.getBounds().toArray();

              const mapBounds = calcBounds(bounds, [
                map.transform.latRange ? map.transform.latRange[0] : map.transform.minLat,
                map.transform.latRange ? map.transform.latRange[1] : map.transform.maxLat,
              ]);

              const ts = getBoundsTiles(mapBounds, transform.zoom, opts);

              for (let i = 0; i < ts.length; i++) {
                const tile = ts[i];
                if (source.wrapX) {
                  wrapTiles.push(tile);
                } else if (tile.wrap === 0) {
                  wrapTiles.push(tile);
                }
              }
            } else {
              const tiles = transform.coveringTiles(opts);

              for (let i = 0; i < tiles.length; i++) {
                const tile = tiles[i];
                const { canonical, wrap } = tile;
                const { x, y, z } = canonical;
                if (source.wrapX) {
                  wrapTiles.push(
                    new TileID(z, wrap, z, x, y, {
                      getTileProjBounds,
                    }),
                  );
                } else if (tile.wrap === 0) {
                  wrapTiles.push(
                    new TileID(z, wrap, z, x, y, {
                      getTileProjBounds,
                    }),
                  );
                }
              }
            }
          }

          return wrapTiles;
        },
        getExtent: () => {
          const map = this.map as any;
          const bounds: any = map?.getBounds().toArray();

          const mapBounds = calcBounds(bounds, [
            map.transform.latRange ? map.transform.latRange[0] : map.transform.minLat,
            map.transform.latRange ? map.transform.latRange[1] : map.transform.maxLat,
          ]);

          const p0 = mapboxgl.MercatorCoordinate.fromLngLat(
            new mapboxgl.LngLat(mapBounds[0], mapBounds[3]),
          );
          const p1 = mapboxgl.MercatorCoordinate.fromLngLat(
            new mapboxgl.LngLat(mapBounds[2], mapBounds[1]),
          );

          return [p0.x, p0.y, p1.x, p1.y];

          // const p0 = mapboxgl.MercatorCoordinate.fromLngLat(new mapboxgl.LngLat(xmin, ymax));
          // const p1 = mapboxgl.MercatorCoordinate.fromLngLat(new mapboxgl.LngLat(xmax, ymin));
          // return [p0.x, p0.y, p1.x, p1.y];
        },
      },
    );

    this.map.on('movestart', this.moveStart);
    this.map.on('move', this.update);
    this.map.on('moveend', this.moveEnd);
    this.map.on('zoom', this.handleZoom);
    this.map.on('zoomend', this.handleZoom);
    this.map.on('resize', this.handleResize);
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
