import * as maptalks from 'maptalks';
import rewind from '@mapbox/geojson-rewind';
import {
  highPrecision,
  OrthographicCamera,
  PerspectiveCamera,
  Renderer,
  RenderTarget,
  Scene,
  utils,
} from '@sakitam-gis/vis-engine';

import type { ImageSource, SourceType, UserOptions } from 'wind-gl-core';
import { BaseLayer, LayerSourceType, polygon2buffer, TileID } from 'wind-gl-core';

highPrecision(true);

function getGLRes(map) {
  return map.getGLRes ? map.getGLRes() : map.getGLZoom();
}

function inRange(value: number, start: number, end: number) {
  return value >= start && value < end;
}

function coordinateToPoint(map, coordinate, res, out?: any) {
  if (map.coordToPointAtRes) {
    return map.coordToPointAtRes(coordinate, res, out);
  }
  return map.coordinateToPoint(coordinate, res, out);
}

const TILE_POINT = new maptalks.Point(0, 0);

// from https://github.com/maptalks/maptalks.three/blob/master/src/index.ts
class VeRenderer extends maptalks.renderer.CanvasLayerRenderer {
  scene: Scene;
  camera: PerspectiveCamera | OrthographicCamera;
  canvas: HTMLCanvasElement & {
    gl: any;
  };
  layer: Layer;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  context: Renderer;
  #renderTarget: RenderTarget | undefined;

  getPrepareParams(): Array<any> {
    return [this.scene, this.camera];
  }

  getDrawParams(): Array<any> {
    return [this.scene, this.camera];
  }

  _drawLayer(...args) {
    super._drawLayer.apply(this, args);
  }

  hitDetect(): boolean {
    return false;
  }

  createCanvas() {
    super.createCanvas();
    this.createContext();
  }

  createContext() {
    if (this.canvas.gl && this.canvas.gl.wrap) {
      this.gl = this.canvas.gl.wrap();
    } else {
      const layer = this.layer;
      const attributes: any = layer.options.glOptions || {
        alpha: true,
        depth: true,
        antialias: true,
        stencil: true,
      };
      attributes.preserveDrawingBuffer = true;
      this.gl = this.gl || utils.getContext(this.canvas, attributes, layer.options?.requestWebGl2);
    }
    this.#initRenderer();
    this.layer.onCanvasCreate(this.context, this.scene, this.camera);
  }

  #initRenderer() {
    const renderer = new Renderer(this.gl, {
      autoClear: false,
      extensions: [
        'OES_texture_float',
        'OES_texture_float_linear',
        'WEBGL_color_buffer_float',
        'EXT_color_buffer_float',
      ],
    });
    renderer.setSize(this.canvas.width, this.canvas.height);
    this.context = renderer;
    this.context.state.setClearColor({
      r: 0,
      g: 0,
      b: 0,
      a: 0,
    });

    this.scene = new Scene();
    const map = this.layer.getMap();
    const fov = (map.getFov() * Math.PI) / 180;
    this.camera = new PerspectiveCamera(fov, map.width / map.height, map.cameraNear, map.cameraFar);
    this.planeCamera = new OrthographicCamera(0, 1, 1, 0, 0, 1);
    this.camera.matrixAutoUpdate = false;
    this.#syncCamera();
  }

  onCanvasCreate() {
    super.onCanvasCreate();
  }

  resizeCanvas(canvasSize) {
    if (!this.canvas) {
      return;
    }
    let size;
    const map = this.getMap();
    if (!canvasSize) {
      size = map.getSize();
    } else {
      size = canvasSize;
    }
    const r = map.getDevicePixelRatio ? map.getDevicePixelRatio() : maptalks.Browser.retina ? 2 : 1;
    const canvas = this.canvas;
    const { width, height, cssWidth, cssHeight } = maptalks.Util.calCanvasSize(size, r);
    if (this.layer._canvas && (canvas.style.width !== cssWidth || canvas.style.height !== cssHeight)) {
      canvas.style.width = cssWidth;
      canvas.style.height = cssHeight;
    }
    if (canvas.width === width && canvas.height === height) {
      return this;
    }

    canvas.width = width;
    canvas.height = height;
    this.context.setSize(canvas.width, canvas.height);
  }

  clearCanvas() {
    if (!this.canvas) {
      return;
    }

    this.context.clear();
  }

  prepareCanvas(): any {
    if (!this.canvas) {
      this.createCanvas();
    } else {
      this.clearCanvas();
    }
    this.layer.fire('renderstart', { context: this.context });
    return null;
  }

  renderScene(context) {
    this.scene.worldMatrixNeedsUpdate = true;
    this.#syncCamera();
    if (context && context.renderTarget) {
      const { width, height } = context.renderTarget.fbo;
      if (!this.#renderTarget) {
        this.#renderTarget = new RenderTarget(this.context, {
          width,
          height,
          depth: false,
        });
      } else {
        this.#renderTarget.resize(width, height);
      }

      this.layer.layer?.prerender(
        {
          camera: this.camera,
          planeCamera: this.planeCamera,
        },
        // this.#renderTarget,
      );

      this.#renderTarget.swapHandle(context.renderTarget.getFramebuffer(context.renderTarget.fbo));

      this.layer.layer?.render(
        {
          camera: this.camera,
          planeCamera: this.planeCamera,
        },
        this.#renderTarget,
      );

      this.#renderTarget.restoreHandle();
    } else {
      this.layer.layer?.prerender({
        camera: this.camera,
        planeCamera: this.planeCamera,
      });
      this.layer.layer?.render({
        camera: this.camera,
        planeCamera: this.planeCamera,
      });
    }
    this.completeRender();
  }

  remove() {
    delete this._drawContext;
    if (this.#renderTarget) {
      this.#renderTarget.destroy();
      this.#renderTarget = undefined;
    }
    super.remove();
  }

  #syncCamera() {
    const map = this.getMap();
    const camera = this.camera;
    camera.localMatrix.fromArray(map.cameraWorldMatrix);
    camera.projectionMatrix.fromArray(map.projMatrix);
    camera.worldMatrixNeedsUpdate = true;
    camera.updateMatrixWorld();
  }

  isTileCachedOrLoading() {
    return false;
  }
}

export interface BaseLayerOptionType extends UserOptions {
  renderer?: string;
  doubleBuffer?: boolean;
  glOptions?: {
    preserveDrawingBuffer: boolean;
  };
  forceRenderOnMoving?: boolean;
  forceRenderOnRotating?: boolean;
  forceRenderOnZooming?: boolean;
  requestWebGl2?: boolean;
}

const options = {
  renderer: 'gl',
  doubleBuffer: false,
  glOptions: undefined,
  forceRenderOnZooming: true,
} as BaseLayerOptionType;

class Layer extends maptalks.TileLayer {
  type: string;
  _needsUpdate = true;
  _coordCache = {};
  public layer: WithNull<BaseLayer>;
  private source: SourceType;
  private projWorldWidth: number;

  constructor(id: string, source: SourceType, opts: BaseLayerOptionType) {
    super(id, {
      ...opts,
      urlTemplate: 'custom',
      tileSize: source.tileSize,
      repeatWorld: source.wrapX ? 'x' : false,
    });

    // 此处使用临时图层来获取瓦片行列号，因为如果直接给 Layer 设置minZoom 和 maxZoom 相关参数
    // 可能会造成渲染的 canvas 不可见，所以我们保证 Layer 一直可见，使用临时图层来构建数据源瓦片
    this.tempLayer = new maptalks.TileLayer(id + '_temp', {
      ...opts,
      minZoom: source.minZoom,
      maxZoom: source.maxZoom,
      urlTemplate: 'custom',
      tileSize: source.tileSize,
      repeatWorld: source.wrapX ? 'x' : false,
    });

    this.tempLayer.on('renderercreate', (e) => {
      e.renderer.loadTile = function loadTile(tile) {
        return tile;
      };

      e.renderer.deleteTile = (tile) => {
        if (!tile || !tile.image) {
          return;
        }
        tile.image.onload = null;
        tile.image.onerror = null;
      };
      e.renderer.loadTileImage = (img, url, key) => {
        //
      };
    });

    this.source = source;
    this.type = 'VeLayer';
  }

  onMoveStart() {
    if (this.layer) {
      this.layer.update();
      this.layer.moveStart();
    }
  }

  onMoving() {
    this.layer?.update();
  }

  onMoveEnd() {
    if (this.layer) {
      this.layer.update();
      this.layer.moveEnd();
    }
  }

  onDragRotateStart() {
    if (this.layer) {
      this.layer.moveStart();
    }
  }

  onDragRotateEnd() {
    if (this.layer) {
      this.layer.moveEnd();
    }
  }

  onResize() {
    this.update();
  }

  onZoomStart() {
    this.layer?.update();
  }

  onZooming() {
    if (this.layer) {
      this.layer.update();
      this.layer.handleZoom();
    }
  }

  onZoomEnd() {
    this.layer?.update();
  }

  update() {
    if (this.layer) {
      this.layer.update();
    }
  }

  getWorlds() {
    const map = this.getMap();
    const projObject = map.getProjection().fullExtent;
    const projectionExtent = [projObject.left, projObject.bottom, projObject.right, projObject.top];
    const projExtent = map.getProjExtent();
    const extent = [projExtent.xmin, projExtent.ymin, projExtent.xmax, projExtent.ymax];
    const worldWidth = projectionExtent[2] - projectionExtent[0];
    const res = getGLRes(map);
    const p1 = map._prjToPointAtRes(new maptalks.Coordinate([projectionExtent[0], projectionExtent[3]]), res);

    const p2 = map._prjToPointAtRes(new maptalks.Coordinate([projectionExtent[2], projectionExtent[1]]), res);
    const projWorldWidth = Math.abs(p1.x - p2.x);

    let startX = projectionExtent[0];
    let world = 0;
    const result: {
      world: number;
      offset: number;
      xmin: number;
      xmax: number;
    }[] = [
      {
        world: 0,
        offset: 0,
        xmin: p1.x,
        xmax: p2.x,
      },
    ];
    while (startX > extent[0]) {
      --world;
      result.push({
        world,
        offset: world * projWorldWidth,
        xmin: p1.x + world * projWorldWidth,
        xmax: p2.x + world * projWorldWidth,
      });
      startX -= worldWidth;
    }
    world = 0;
    startX = projectionExtent[2];
    while (startX < extent[2]) {
      ++world;
      result.push({
        world,
        offset: world * projWorldWidth,
        xmin: p1.x + world * projWorldWidth,
        xmax: p2.x + world * projWorldWidth,
      });
      startX += worldWidth;
    }

    this.projWorldWidth = projWorldWidth;

    return result.sort((a, b) => a.world - b.world);
  }

  calcWitchWorld(
    center: number[],
    worlds: {
      world: number;
      offset: number;
      xmin: number;
      xmax: number;
    }[],
  ) {
    for (let i = 0; i < worlds.length; i++) {
      if (inRange(center[0], worlds[i].xmin, worlds[i].xmax)) {
        return worlds[i].world;
      }
    }

    return worlds.find((w) => w.world === 0)?.world;
  }

  public getClipMask() {
    return this.options.mask;
  }

  private processMask() {
    const map = this.getMap();
    if (map && this.options.mask) {
      const r = getGLRes(map);
      const mask = this.options.mask;
      const data = mask.data;
      // @link https://github.com/mapbox/geojson-rewind
      rewind(data, true);

      const tr = (coords) => {
        const mercatorCoordinates: any[] = [];
        for (let i = 0; i < coords.length; i++) {
          const coord = coords[i];
          const p = coordinateToPoint(map, new maptalks.Coordinate(coord), r);
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

  public setClipMask(mask) {
    this.options.mask = Object.assign({}, this.options.mask, mask);

    if (this.layer) {
      this.layer.setMask(this.processMask());
    }
  }

  // eslint-disable-next-line
  prepareToDraw(gl, scene) {
    const opt = this.options;
    const map = this.getMap();
    const renderer = this._getRenderer();
    if (!map || !renderer) {
      return false;
    }

    this.getWorlds();

    this.layer = new BaseLayer(
      this.source,
      {
        renderer: renderer.context,
        scene: renderer.scene,
      },
      {
        renderType: opt.renderType,
        renderFrom: opt.renderFrom,
        styleSpec: opt.styleSpec,
        displayRange: opt.displayRange,
        widthSegments: opt.widthSegments,
        heightSegments: opt.heightSegments,
        wireframe: opt.wireframe,
        picking: opt.picking,
        mask: this.processMask(),
        getZoom: () => map.getZoom(),
        triggerRepaint: () => {
          renderer.setToRedraw();
        },
        flipY: true,
        glScale: () => this.projWorldWidth,
        zoomScale: () => 2,
        // 由于核心库中计算瓦片坐标是从上到下是递增的，但是 maptalk 是从上到下是递减的
        getTileProjSize: (z: number, tiles: TileID[]) => {
          const t = tiles.find((tile: TileID) => tile.z === z);
          if (t) {
            return [t.projTileBounds.right - t.projTileBounds.left, t.projTileBounds.top - t.projTileBounds.bottom];
          }

          return [this.projWorldWidth, this.projWorldWidth];
        },
        getViewTiles: (source: SourceType) => {
          let { type } = source;
          const worlds = this.getWorlds();
          // @ts-ignore
          type = type !== LayerSourceType.timeline ? type : source.privateType;
          const wrapTiles: TileID[] = [];
          const r = getGLRes(map);
          if (type === LayerSourceType.image) {
            const { coordinates } = source as ImageSource;
            const [min, max] = [
              [coordinates[0][0], coordinates[2][1]],
              [coordinates[1][0], coordinates[0][1]],
            ];
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // @ts-ignore
            const p1 = coordinateToPoint(map, new maptalks.Coordinate([min[0], max[1]]), r); // 左上
            // @ts-ignore
            const p2 = coordinateToPoint(map, new maptalks.Coordinate([max[0], min[1]]), r); // 右下
            const x = 0;
            const y = 0;
            const z = 0;
            if (this.source.wrapX) {
              for (let i = 0; i < worlds.length; i++) {
                const { world, offset } = worlds[i];
                wrapTiles.push(
                  new TileID(z, world, z, x, y, {
                    getTileBounds: () => [min[0], min[1], max[0], max[1]],
                    getTileProjBounds: () => ({
                      left: p1.x + offset,
                      top: p1.y,
                      right: p2.x + offset,
                      bottom: p2.y,
                    }),
                  }),
                );
              }
            } else {
              const wrap = 0;
              wrapTiles.push(
                new TileID(z, wrap, z, x, y, {
                  getTileBounds: () => [min[0], min[1], max[0], max[1]],
                  getTileProjBounds: () => ({
                    left: p1.x,
                    top: p1.y,
                    right: p2.x,
                    bottom: p2.y,
                  }),
                }),
              );
            }
          } else if (type === LayerSourceType.tile) {
            const { tileGrids } = this.tempLayer.getTiles();
            const { tiles } = tileGrids[0];
            for (let i = 0; i < tiles.length; i++) {
              const tile = tiles[i];

              const res = map._getResolution(tile.z);
              const tileConfig = this._getTileConfig();
              const tileExtent = tileConfig.getTilePrjExtent(tile.x, tile.y, res);

              let max = tileExtent.getMax();
              let min = tileExtent.getMin();
              const projection = map.getProjection();
              min = projection.unproject(min);
              max = projection.unproject(max);

              const { extent2d, offset } = tile;

              const scale = (tile._glScale = tile._glScale || tile.res / map.getGLRes());

              const point1 = TILE_POINT.set(extent2d.xmin - offset[0], extent2d.ymax - offset[1]);
              const x1 = point1.x * scale;
              const y1 = point1.y * scale;

              const point2 = TILE_POINT.set(extent2d.xmax - offset[0], extent2d.ymin - offset[1]);
              const x2 = point2.x * scale;
              const y2 = point2.y * scale;

              const wrap = this.calcWitchWorld([(x2 - x1) / 2 + x1, (y2 - y1) / 2 + y1], worlds);

              wrapTiles.push(
                new TileID(tile.z, wrap, tile.z, tile.x, tile.y, {
                  getTileBounds: () => [min.x, min.y, max.x, max.y],
                  getTileProjBounds: () => ({
                    left: x1,
                    top: y1,
                    right: x2,
                    bottom: y2,
                  }),
                }),
              );
            }
          }
          return wrapTiles;
        },
        getExtent: () => {
          const projExtent = map.getProjExtent()._scale(1 / getGLRes(map));
          const r = getGLRes(map);
          const p1 = coordinateToPoint(map, new maptalks.Coordinate([0, -90]), r);
          const p2 = coordinateToPoint(map, new maptalks.Coordinate([0, 90]), r);
          return [
            projExtent.xmin,
            projExtent.ymin < p1.y ? p1.y : projExtent.ymin,
            projExtent.xmax,
            projExtent.ymax > p2.y ? p2.y : projExtent.ymax,
          ];
        },
        getGridTiles: (_: any) => {
          const { tileGrids } = this.getTiles();
          const { tiles } = tileGrids[0];
          const wrapTiles: TileID[] = [];
          const worlds = this.getWorlds();
          for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];

            const res = map._getResolution(tile.z);
            const tileConfig = this._getTileConfig();
            const tileExtent = tileConfig.getTilePrjExtent(tile.x, tile.y, res);

            let max = tileExtent.getMax();
            let min = tileExtent.getMin();
            const projection = map.getProjection();
            min = projection.unproject(min);
            max = projection.unproject(max);

            const { extent2d, offset } = tile;

            const scale = (tile._glScale = tile._glScale || tile.res / map.getGLRes());

            const point1 = TILE_POINT.set(extent2d.xmin - offset[0], extent2d.ymax - offset[1]);
            const x1 = point1.x * scale;
            const y1 = point1.y * scale;

            const point2 = TILE_POINT.set(extent2d.xmax - offset[0], extent2d.ymin - offset[1]);
            const x2 = point2.x * scale;
            const y2 = point2.y * scale;

            const wrap = this.calcWitchWorld([(x2 - x1) / 2 + x1, (y2 - y1) / 2 + y1], worlds);

            wrapTiles.push(
              new TileID(tile.z, wrap, tile.z, tile.x, tile.y, {
                getTileBounds: () => [min.x, min.y, max.x, max.y],
                getTileProjBounds: () => ({
                  left: x1,
                  top: y1,
                  right: x2,
                  bottom: y2,
                }),
              }),
            );
          }

          return wrapTiles;
        },
      },
    );

    map.on('viewchange', this.update, this);

    this.update();
  }

  isRendering(): boolean {
    const map = this.getMap();
    if (!map) {
      return false;
    }
    return map.isInteracting() || map.isAnimating();
  }

  draw(gl, view, scene, camera, timeStamp, context) {
    this.renderScene(context, this);
  }

  drawOnInteracting(gl, view, scene, camera, event, timeStamp, context) {
    this.renderScene(context, this);
  }

  getObjects() {
    const scene = this.getScene();
    if (!scene) {
      return [];
    }
    const meshes: any[] = [];
    for (let i = 0, len = scene.children.length; i < len; i++) {
      const child = scene.children[i];
      if (child) {
        meshes.push(child);
      }
    }
    return meshes;
  }

  clear() {
    return this.clearObject();
  }

  clearObject() {
    const scene = this.getScene();
    if (!scene) {
      return this;
    }
    for (let i = scene.children.length - 1; i >= 0; i--) {
      const child = scene.children[i];
      if (child) {
        scene.remove(child);
      }
    }
    return this;
  }

  getCamera(): WithNull<PerspectiveCamera | OrthographicCamera> {
    const renderer = this._getRenderer();
    if (renderer) {
      return renderer.camera;
    }
    return null;
  }

  getScene(): WithNull<Scene> {
    const renderer = this._getRenderer();
    if (renderer) {
      return renderer.scene;
    }
    return null;
  }

  renderScene(context?: any, layer?: any) {
    const renderer = this._getRenderer();
    if (renderer) {
      renderer.clearCanvas();
      renderer.renderScene(context);
      //外部调用时，直接redraw
      if (!layer) {
        renderer.setToRedraw();
      }
    }
    return this;
  }

  onAdd() {
    super.onAdd();
    const map = this.map || this.getMap();
    if (!map) return this;

    map.addLayer(this.tempLayer);

    this._needsUpdate = true;

    return this;
  }

  onRemove() {
    super.onRemove();
    const map = this.map || this.getMap();
    if (!map) return this;

    map?.off('viewchange', this.update, this);

    this.clear();
    if (this.layer) {
      this.layer = null;
    }
    return this;
  }

  getEvents() {
    return {
      _zoomstart: this.onZoomStart,
      _zooming: this.onZooming,
      _zoomend: this.onZoomEnd,
      _resize: this.onResize,
      _movestart: this.onMoveStart,
      _moving: this.onMoving,
      _moveend: this.onMoveEnd,
      _dragrotatestart: this.onDragRotateStart,
      // '_dragrotating': this.onDragRotating,
      _dragrotateend: this.onDragRotateEnd,
      // _spatialreferencechange: this.onSpatialReferenceChange,
    };
  }
}

Layer.mergeOptions(options);

Layer.registerRenderer('gl', VeRenderer);

export { Layer, VeRenderer };
