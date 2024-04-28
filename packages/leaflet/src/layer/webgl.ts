import * as L from 'leaflet';
import rewind from '@mapbox/geojson-rewind';
import { OrthographicCamera, Renderer, Scene, utils } from '@sakitam-gis/vis-engine';
import type { SourceType, RenderType, UserOptions } from 'wind-gl-core';
import { LayerSourceType, TileID, BaseLayer as Layer, polygon2buffer } from 'wind-gl-core';
import CameraSync from '../utils/CameraSync';
import {
  MAX_MERCATOR_LATITUDE,
  mercatorXfromLng,
  mercatorYfromLat,
  lngFromMercatorX,
  latFromMercatorY,
  fromLngLat,
  mercatorZfromAltitude,
  getCoordinatesCenterTileID,
} from '../utils/mercatorCoordinate';
import { getTileBounds, getTileProjBounds, getExtent, getClampZoom } from '../utils/tile';
import { BaseLayer } from './Base';

class ViewState {
  _width: number;
  _height: number;
  _fov: number;
  _worldSize: number;
  _center: any;

  zoom: number;
  tileSize = 512;
  maxPitch = 60;
  elevation: any;
  _horizonShift = 0.1;

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get fov() {
    return (this.getFovRad() / Math.PI) * 180;
  }

  get worldSize() {
    const scale = Math.pow(2, this.zoom - 1);
    return this.tileSize * scale;
  }

  getCenter() {
    return this._center;
  }
  getPitch() {
    return 0;
  }
  getBearing() {
    return 0;
  }
  getFovRad() {
    return 0.6435011087932844;
  }

  getCameraPosition() {
    return [0, 0, 0];
  }

  centerOffset() {
    return { x: 0, y: 0 };
  }

  project(lnglat) {
    const lat = utils.clamp(lnglat.lat, -MAX_MERCATOR_LATITUDE, MAX_MERCATOR_LATITUDE);

    const x = mercatorXfromLng(lnglat.lng);
    const y = mercatorYfromLat(lat);
    return { x: x * this.worldSize, y: y * this.worldSize, z: 0 };
  }

  get pixelsPerMeter(): number {
    return mercatorZfromAltitude(1, this._center.lat) * this.worldSize;
  }

  unproject(p: number[]) {
    const lng = lngFromMercatorX(p[0]);
    const lat = latFromMercatorY(p[1]);
    return [lng, lat];
  }
}

export interface LayerOptions extends UserOptions {
  renderingMode?: '2d' | '3d';
}

export class WebglLayer extends BaseLayer {
  gl: WebGL2RenderingContext | WebGLRenderingContext | null;
  renderer: Renderer;
  scene: Scene;
  sync: CameraSync;
  planeCamera: OrthographicCamera;
  viewState: ViewState;
  proxyLayer: Layer;
  _tileZoom: number | undefined;
  wrapXNumber: number[];
  private source: SourceType;

  initialize(id: string | number, source: any, options: any) {
    super.initialize(id, source, options);

    this.viewState = new ViewState();

    this.source = source;
  }

  _resizeCanvas(scale: number) {
    super._resizeCanvas(scale);

    this.renderer.setSize(this._width, this._height);

    if (this.proxyLayer) {
      this.proxyLayer.resize(this._width, this._height);
    }

    this._render();
  }

  get camera() {
    return this.sync.camera;
  }

  _render() {
    this._reset();

    if (this._map && this.viewState) {
      this.viewState._center = this._map.getCenter();
      this.viewState._width = this._width;
      this.viewState._height = this._height;
      this.viewState.zoom = this._map.getZoom();

      this.calcTileZoom(this.viewState.zoom);

      const map = this._map;
      const crs = map.options.crs;

      this.wrapXNumber = [
        Math.floor(map.project([0, crs?.wrapLng?.[0] as number], this._tileZoom).x / this.source.tileSize),
        Math.ceil(map.project([0, crs?.wrapLng?.[1] as number], this._tileZoom).x / this.source.tileSize),
      ];
    }

    if (!this.gl) {
      this.gl = utils.getContext(
        this.canvas!,
        {
          preserveDrawingBuffer: false,
          antialias: true, // https://bugs.webkit.org/show_bug.cgi?id=237906
          stencil: true,
        },
        true,
      );

      this.renderer = new Renderer(this.gl!, {
        autoClear: false,
        extensions: [
          'OES_texture_float',
          'OES_texture_float_linear',
          'WEBGL_color_buffer_float',
          'EXT_color_buffer_float',
        ],
      });

      this.scene = new Scene();
      this.sync = new CameraSync(this.viewState, 'perspective', this.scene);
      this.planeCamera = new OrthographicCamera(0, 1, 1, 0, 0, 1);

      this.proxyLayer = new Layer(
        this.source,
        {
          renderer: this.renderer,
          scene: this.scene,
        },
        {
          renderType: this.options.renderType,
          renderFrom: this.options.renderFrom,
          styleSpec: this.options.styleSpec,
          displayRange: this.options.displayRange,
          widthSegments: this.options.widthSegments,
          heightSegments: this.options.heightSegments,
          wireframe: this.options.wireframe,
          picking: this.options.picking,
          mask: this.processMask(),
          getZoom: () => this.viewState.zoom as number,
          triggerRepaint: () => {
            requestAnimationFrame(() => this._render());
          },
          getTileProjSize: (z: number) => {
            const w = 1 / Math.pow(2, z);
            return [w, w];
          },
          getPixelsToUnits: (): [number, number] => {
            const pixel = 1;
            const y = this.canvas!.clientHeight / 2 - pixel / 2;
            const x = this.canvas!.clientWidth / 2 - pixel / 2;
            const left = fromLngLat(this.viewState.unproject([x, y]));
            const right = fromLngLat(this.viewState.unproject([x + pixel, y + pixel]));

            return [Math.abs(right.x - left.x), Math.abs(left.y - right.y)];
          },
          getPixelsToProjUnit: () => [this.viewState.pixelsPerMeter, this.viewState.pixelsPerMeter],
          getViewTiles: (source: SourceType, renderType: RenderType) => {
            let { type } = source;
            // @ts-ignore
            type = type !== LayerSourceType.timeline ? type : source.privateType;
            if (!this._map) return [];
            const wrapTiles: TileID[] = [];
            if (type === LayerSourceType.image) {
              const cornerCoords = (source as any).coordinates.map((c: any) => fromLngLat({ lng: c[0], lat: c[1] }));
              const tileID = getCoordinatesCenterTileID(cornerCoords);
              if (source.wrapX) {
                // transform.getVisibleUnwrappedCoordinates(tileID).forEach((unwrapped) => {
                //   const { canonical, wrap } = unwrapped;
                //   const { x, y, z } = canonical;
                //   wrapTiles.push(
                //     new TileID(z, wrap, z, x, y, {
                //       getTileBounds: () => [
                //         (source as any).coordinates[0][0],
                //         (source as any).coordinates[2][1],
                //         (source as any).coordinates[1][0],
                //         (source as any).coordinates[0][1],
                //       ],
                //       getTileProjBounds: () => ({
                //         left: tileID.extent[0] + wrap,
                //         top: tileID.extent[1],
                //         right: tileID.extent[2] + wrap,
                //         bottom: tileID.extent[3],
                //       }),
                //     }),
                //   );
                // });
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
                tileSize: utils.isNumber(this.source.tileSize) ? source.tileSize : source.tileSize?.[0] || 512,
                // for mapbox
                minzoom: source.minZoom,
                maxzoom: source.maxZoom,
                roundZoom: source.roundZoom,
                zoom: this.viewState.zoom,
                center: this.viewState.getCenter(),
              };

              const tiles = this.coveringTiles(opts);

              for (let i = 0; i < tiles.length; i++) {
                const tile = tiles[i];
                const { x, y, z, wrap } = tile;
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
            }

            return wrapTiles;
          },
          getExtent: () => getExtent(this._map),
          getGridTiles: (source: any) => {
            const tileSize = source.tileSize;
            const wrapX = source.wrapX;
            if (!this._map) return [];

            const opts = {
              tileSize: tileSize ?? 256,
              minzoom: this._map.getMinZoom(),
              maxzoom: this._map.getMaxZoom(),
              roundZoom: false,
              zoom: this.viewState.zoom,
              center: this.viewState.getCenter(),
            };

            const tiles = this.coveringTiles(opts);
            const wrapTiles: TileID[] = [];

            for (let i = 0; i < tiles.length; i++) {
              const tile = tiles[i];
              const { x, y, z, wrap } = tile;
              if (wrapX) {
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

            return wrapTiles;
          },
        },
      );
    }

    if (this.sync) {
      this.sync.update();
    }

    if (this.proxyLayer) {
      this.proxyLayer.update();
    }

    this.glPrerender();
    this.glRender();
  }

  glPrerender() {
    this.scene.worldMatrixNeedsUpdate = true;
    this.scene.updateMatrixWorld();
    this.camera.updateMatrixWorld();
    const worlds = this.calcWrappedWorlds();
    this.proxyLayer?.prerender({
      worlds,
      camera: this.camera,
      planeCamera: this.planeCamera,
    });
  }

  glRender() {
    this.scene.worldMatrixNeedsUpdate = true;
    this.scene.updateMatrixWorld();
    this.camera.updateMatrixWorld();
    const worlds = this.calcWrappedWorlds();
    this.proxyLayer?.render({
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
    if (!this.layer || !coordinates || !this._map) {
      console.warn('[Layer]: layer not initialized!');
      return null;
    }
    const point = this._map.project(coordinates);
    return this.proxyLayer.picker([point.x, point.y]);
  }

  calcWrappedWorlds() {
    return [0];
  }

  _setView() {}

  _tileCoordsToBounds(coords) {
    // const bp = this._tileCoordsToNwSe(coords);
    // let bounds = new L.LatLngBounds(bp[0], bp[1]);
    //
    // if (!this.options.noWrap) {
    //   bounds = this._map.wrapLatLngBounds(bounds);
    // }
    // return bounds;
  }

  _isValidTile(coords) {
    // const crs = this._map.options.crs as any;
    //
    // if (!crs.infinite) {
    //   // don't load tile if it's out of bounds and not wrapped
    //   const bounds = this._globalTileRange;
    //   if (
    //     (!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x)) ||
    //     (!crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y))
    //   ) {
    //     return false;
    //   }
    // }

    if (!this.options.bounds) {
      return true;
    }

    // don't load tile if it doesn't intersect the bounds in options
    // const tileBounds = this._tileCoordsToBounds(coords);
    // return latLngBounds(this.options.bounds).overlaps(tileBounds);
  }

  _wrapCoords(coords) {
    const newCoords = new L.Point(this.wrapXNumber ? L.Util.wrapNum(coords.x, this.wrapXNumber) : coords.x, coords.y);
    (newCoords as any).z = coords.z;
    return newCoords;
  }

  coveringTiles(opts) {
    const pixelBounds = this._getTiledPixelBounds(opts.center);
    const tileRange = this._pxBoundsToTileRange(pixelBounds, opts);
    const tileCenter = tileRange.getCenter();
    const queue: any[] = [];
    // const margin = this.options.keepBuffer;
    // const noPruneRange = new L.Bounds(
    //   tileRange.getBottomLeft().subtract([margin, -margin]),
    //   tileRange.getTopRight().add([margin, -margin]),
    // );

    if (
      !(
        isFinite(tileRange.min!.x) &&
        isFinite(tileRange.min!.y) &&
        isFinite(tileRange.max!.x) &&
        isFinite(tileRange.max!.y)
      )
    ) {
      throw new Error('Attempted to load an infinite number of tiles');
    }

    for (let j = tileRange.min!.y; j <= tileRange.max!.y; j++) {
      for (let i = tileRange.min!.x; i <= tileRange.max!.x; i++) {
        const coords = new L.Point(i, j);
        (coords as any).z = this._tileZoom;

        if (!this._isValidTile(coords)) {
          continue;
        }

        queue.push(this._wrapCoords(coords));
      }
    }

    queue.sort((a, b) => a.distanceTo(tileCenter) - b.distanceTo(tileCenter));

    return queue;
  }

  calcTileZoom(zoom: number) {
    const tileZoom = Math.round(zoom);
    if (
      (this.options.maxZoom !== undefined && tileZoom > this.options.maxZoom) ||
      (this.options.minZoom !== undefined && tileZoom < this.options.minZoom)
    ) {
      this._tileZoom = undefined;
    } else {
      this._tileZoom = getClampZoom({
        minzoom: this.source.minZoom,
        maxzoom: this.source.maxZoom,
        zoom: this.viewState.zoom,
      });
    }
  }

  _getTiledPixelBounds(center) {
    const map = this._map;
    // @ts-ignore 类型未暴露
    const mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom();
    const scale = map.getZoomScale(mapZoom, this._tileZoom);
    const pixelCenter = map.project(center, this._tileZoom).floor();
    const halfSize = map.getSize().divideBy(scale * 2);

    return new L.Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
  }

  _pxBoundsToTileRange(bounds, opts) {
    const tileSize = new L.Point(opts.tileSize, opts.tileSize);
    return new L.Bounds(bounds.min.unscaleBy(tileSize).floor(), bounds.max.unscaleBy(tileSize).ceil().subtract([1, 1]));
  }

  handleZoom() {
    if (this.proxyLayer) {
      this.proxyLayer.handleZoom();
    }
    this._render();
  }

  onMoveEnd() {
    if (this.proxyLayer) {
      this.proxyLayer.moveEnd();
    }

    this._render();
  }

  onMoveStart() {
    if (this.proxyLayer) {
      this.proxyLayer.moveStart();
    }

    this._render();
  }

  _animateZoom(event: L.ZoomAnimEvent) {
    super._animateZoom(event);
    this.handleZoom();
  }

  getEvents() {
    const events: Record<string, any> = {
      resize: this._onResize,
      viewreset: this._render,
      moveend: this.onMoveEnd,
      movestart: this.onMoveStart,
      zoom: this.handleZoom,
      zoomend: this._render,
    };

    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      events.zoomanim = this._animateZoom;
    }

    return events;
  }

  updateOptions(options: Partial<LayerOptions>) {
    this.options = {
      ...this.options,
      ...(options || {}),
    };
    if (this.proxyLayer) {
      this.proxyLayer.updateOptions(options);
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
          const p = fromLngLat(coord);
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

    if (this.proxyLayer) {
      this.proxyLayer.setMask(this.processMask());
    }
  }

  onRemove() {
    if (this.proxyLayer) {
      this.proxyLayer.destroy();
      this.proxyLayer = null as any;
    }

    this.gl = null;

    return super.onRemove();
  }
}
