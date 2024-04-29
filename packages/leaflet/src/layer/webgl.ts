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

  /**
   * 获取 gl 宽度
   */
  get width() {
    return this._width;
  }

  /**
   * 获取 gl 高度
   */
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

  update(state: Record<string, any>) {
    this._center = state.center;
    this._width = state.width;
    this._height = state.height;
    this.zoom = state.zoom;
  }
}

export interface LayerOptions extends UserOptions {
  renderingMode?: '2d' | '3d';
}

export function wrapTile(x: number, range: number[], includeMax?: boolean) {
  const max = range[1];
  const min = range[0];
  const d = max - min;
  return {
    x: x === max && includeMax ? x : ((((x - min) % d) + d) % d) + min,
    wrap: Math.floor(x / max),
  };
}

export class WebglLayer extends BaseLayer {
  gl: WebGL2RenderingContext | WebGLRenderingContext | null;
  renderer: Renderer;
  scene: Scene;
  sync: CameraSync;
  planeCamera: OrthographicCamera;
  viewState: ViewState;
  layer: Layer;
  _tileZoom: number | undefined;
  _wrapX: undefined | false | number[];
  _wrapY: undefined | false | number[];
  _globalTileRange: any;
  _currentTiles: any[];
  _unLimitTiles: any[];
  private source: SourceType;

  initialize(id: string | number, source: any, options: any) {
    super.initialize(id, source, options);

    this.viewState = new ViewState();

    this._currentTiles = [];
    this._unLimitTiles = [];

    this.source = source;
  }

  _resizeCanvas(scale: number) {
    super._resizeCanvas(scale);

    if (this.renderer) {
      this.renderer.setSize(this._width, this._height);
    }

    if (this.layer) {
      this.layer.resize(this._width, this._height);
    }

    this._render();
  }

  get camera() {
    return this.sync.camera;
  }

  getTileSize() {
    const s = utils.isNumber(this.source.tileSize) ? this.source.tileSize : this.source.tileSize?.[0] || 512;
    return new L.Point(s, s);
  }

  _redraw() {
    if (this._map && this.source) {
      const tileZoom = getClampZoom({
        zoom: this._map.getZoom(),
        minzoom: this.source.minZoom,
        maxzoom: this.source.maxZoom,
      });

      if (tileZoom !== this._tileZoom) {
        this._tileZoom = tileZoom;
      }
      this._update();
    }
    return this;
  }

  _render() {
    if (this._map && this.viewState) {
      this.viewState.update({
        center: this._map.getCenter(),
        zoom: this._map.getZoom(),
        width: this._width,
        height: this._height,
      });
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

      this.layer = new Layer(
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
            requestAnimationFrame(() => this._update());
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
                // 暂时只允许单世界
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
              const tiles = this._currentTiles;

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
            const wrapX = source.wrapX;
            if (!this._map) return [];

            const tiles = this._unLimitTiles;
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

    if (this.layer) {
      this.layer.update();
    }

    this.glPrerender();
    this.glRender();
  }

  glPrerender() {
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

  glRender() {
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
    return this.layer.picker([point.x, point.y]);
  }

  calcWrappedWorlds() {
    return [0];
  }

  _resetView(e?: any) {
    const animating = e && (e.pinch || e.flyTo);
    this._setView(this._map.getCenter(), this._map.getZoom(), animating, animating);
  }

  _resetGrid() {
    const map = this._map;
    const crs = map.options.crs;
    const tileSize = this.getTileSize();
    const tileZoom = this._tileZoom;

    const bounds = this._map.getPixelWorldBounds(this._tileZoom);
    if (bounds) {
      this._globalTileRange = this._pxBoundsToTileRange(bounds);
    }

    // 无论任何时候都计算瓦片范围，我们需要用此参数计算瓦片在那个世界
    this._wrapX = crs!.wrapLng && [
      Math.floor(map.project([0, crs!.wrapLng[0]], tileZoom).x / tileSize.x),
      Math.ceil(map.project([0, crs!.wrapLng[1]], tileZoom).x / tileSize.y),
    ];
    this._wrapY = crs!.wrapLat && [
      Math.floor(map.project([crs!.wrapLat[0], 0], tileZoom).y / tileSize.x),
      Math.ceil(map.project([crs!.wrapLat[1], 0], tileZoom).y / tileSize.y),
    ];
  }

  _setView(center: L.LatLng, zoom: number, noPrune?: boolean, noUpdate?: boolean) {
    let tileZoom: number | undefined = Math.round(zoom);
    if (
      (this.options.maxZoom !== undefined && tileZoom > this.options.maxZoom) ||
      (this.options.minZoom !== undefined && tileZoom < this.options.minZoom)
    ) {
      tileZoom = undefined;
    } else {
      tileZoom = getClampZoom({
        minzoom: this.source.minZoom,
        maxzoom: this.source.maxZoom,
        zoom: tileZoom,
      });
    }

    const tileZoomChanged = this.options.updateWhenZooming && tileZoom !== this._tileZoom;

    if (!noUpdate || tileZoomChanged) {
      this._tileZoom = tileZoom;

      this._resetGrid();

      if (tileZoom !== undefined) {
        this._update(center);
      }
    }
  }

  _tileCoordsToBounds(coords) {
    const bp = this._tileCoordsToNwSe(coords);
    let bounds = new L.LatLngBounds(bp[0], bp[1]);

    if (!this.source.wrapX) {
      bounds = this._map.wrapLatLngBounds(bounds);
    }
    return bounds;
  }

  _tileCoordsToNwSe(coords) {
    const map = this._map;
    const tileSize = this.getTileSize();
    const nwPoint = coords.scaleBy(tileSize);
    const sePoint = nwPoint.add(tileSize);
    const nw = map.unproject(nwPoint, coords.z);
    const se = map.unproject(sePoint, coords.z);
    return [nw, se];
  }

  _isValidTile(coords) {
    const crs = this._map.options.crs as any;

    if (!crs.infinite) {
      // don't load tile if it's out of bounds and not wrapped
      const bounds = this._globalTileRange;
      if (
        (!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x)) ||
        (!crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y))
      ) {
        return false;
      }
    }

    return true;
  }

  _wrapCoords(coords) {
    const t = this._wrapX ? wrapTile(coords.x, this._wrapX) : { x: coords.x, wrap: 0 };
    const newCoords = new L.Point(
      t.x,
      this._wrapY && !this.source.wrapX ? L.Util.wrapNum(coords.y, this._wrapY) : coords.y,
    );
    (newCoords as any).z = coords.z;
    (newCoords as any).wrap = t.wrap;
    return newCoords;
  }

  _update(center?: L.LatLng) {
    const map = this._map;
    if (!map || !this.source) {
      return;
    }

    const zoom = getClampZoom({
      zoom: map.getZoom(),
      minzoom: this.source.minZoom,
      maxzoom: this.source.maxZoom,
    });

    if (center === undefined) {
      center = map.getCenter();
    }

    if (this._tileZoom === undefined) {
      return;
    }

    const pixelBounds = this._getTiledPixelBounds(center, this._tileZoom);
    const tileRange = this._pxBoundsToTileRange(pixelBounds);
    const tileCenter = tileRange.getCenter();
    const queue: any[] = [];

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

    if (Math.abs(zoom - this._tileZoom) > 1) {
      this._setView(center, zoom);
      return;
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

    const z = map.getZoom();
    const bounds = this._getTiledPixelBounds(center, z);
    if (bounds) {
      const unLimitTileRange = this._pxBoundsToTileRange(bounds);
      const tc = tileRange.getCenter();

      const tileCoords: any[] = [];

      for (let j = unLimitTileRange.min!.y; j <= unLimitTileRange.max!.y; j++) {
        for (let i = unLimitTileRange.min!.x; i <= unLimitTileRange.max!.x; i++) {
          const coords = new L.Point(i, j);
          (coords as any).z = z;

          if (!this._isValidTile(coords)) {
            continue;
          }

          tileCoords.push(this._wrapCoords(coords));
        }
      }

      tileCoords.sort((a, b) => a.distanceTo(tc) - b.distanceTo(tc));

      this._unLimitTiles = tileCoords;
    }

    this._currentTiles = queue;

    this._render();

    return queue;
  }

  _getTiledPixelBounds(center: L.LatLng, zoom: number) {
    const map = this._map;
    // @ts-ignore 类型未暴露
    const mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom();
    const scale = map.getZoomScale(mapZoom, zoom);
    const pixelCenter = map.project(center, zoom).floor();
    const halfSize = map.getSize().divideBy(scale * 2);

    return new L.Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
  }

  _pxBoundsToTileRange(bounds: L.Bounds) {
    const tileSize = this.getTileSize();
    return new L.Bounds(
      bounds.min!.unscaleBy(tileSize).floor(),
      bounds.max!.unscaleBy(tileSize).ceil().subtract([1, 1]),
    );
  }

  handleZoom() {
    this._resetView();
    if (this.layer) {
      this.layer.handleZoom();
    }
  }

  onMoveEnd() {
    this._reset();
    if (!this._map || (this._map as any)._animatingZoom) {
      return;
    }

    if (this.layer) {
      this.layer.moveEnd();
    }
  }

  onMoveStart() {
    if (this.layer) {
      this.layer.moveStart();
    }
  }

  _animateZoom(event: L.ZoomAnimEvent) {
    super._animateZoom(event);
    this._setView(event.center, event.zoom, true, event.noUpdate);
    this.handleZoom();
  }

  getEvents() {
    const events: Record<string, any> = {
      resize: this._onResize,
      viewreset: this._resetView,
      moveend: this.onMoveEnd,
      movestart: this.onMoveStart,
      zoom: this.handleZoom,
      zoomend: this._reset,
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
    if (this.layer) {
      this.layer.updateOptions(options);
    }

    this._redraw();
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

    if (this.layer) {
      this.layer.setMask(this.processMask());
    }
  }

  onRemove() {
    if (this.layer) {
      this.layer.destroy();
      this.layer = null as any;
    }

    // 这里临时处理，现在图层之间无共享 gl 实例，也就是说我们暂时不能公用 source
    if (this.source) {
      if (Array.isArray(this.source.sourceCache)) {
        this.source.sourceCache?.forEach((s) => {
          s?.clearTiles();
        });
      } else {
        this.source.sourceCache?.clearTiles();
      }
    }

    this._currentTiles = [];
    this._unLimitTiles = [];

    this.gl = null;
    this._tileZoom = undefined;

    return super.onRemove();
  }
}
