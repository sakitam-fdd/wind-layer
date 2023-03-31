import * as maptalks from 'maptalks';
import {
  Scene,
  Vector3,
  Renderer,
  RenderTarget,
  PerspectiveCamera,
  OrthographicCamera,
  utils,
  highPrecision,
} from '@sakitam-gis/vis-engine';

import { Layer as LayerCore, SourceType, TileID } from 'wind-gl-core';

import { Extent, getWidth } from './utils';

type WithNull<T> = T | null;

highPrecision(true);

function getGLRes(map) {
  return map.getGLRes ? map.getGLRes() : map.getGLZoom();
}

function coordinateToPoint(map, coordinate, res, out?: any) {
  if (map.coordToPointAtRes) {
    return map.coordToPointAtRes(coordinate, res, out);
  }
  return map.coordinateToPoint(coordinate, res, out);
}

const TEMP_COORD = new maptalks.Coordinate(0, 0);
const TEMP_POINT = new maptalks.Point(0, 0);

function getCoords(x, y, z) {
  const zz = Math.pow(2, z);

  const lng = (x / zz) * 360 - 180;
  // const lng = x / zz;
  let lat = (y / zz) * 360 - 180;
  lat = (180 / Math.PI) * (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);

  return [lng, lat];
}

function getTileBounds(map, x, y, z, wrap = 0) {
  // for Google/OSM tile scheme we need to alter the y
  // eslint-disable-next-line no-param-reassign
  y = 2 ** z - y - 1;

  const min = getCoords(x, y, z);
  const max = getCoords(x + 1, y + 1, z);

  const res = getGLRes(map);

  const p1 = coordinateToPoint(map, new maptalks.Coordinate([min[0], max[1]]), res); // 左上
  const p2 = coordinateToPoint(map, new maptalks.Coordinate([max[0], min[1]]), res); // 右下

  return {
    left: p1.x + wrap,
    top: p1.y,
    right: p2.x + wrap,
    bottom: p2.y,
    lngLatBounds: [min[0], min[1], max[0], max[1]],
  };
}

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
    if (
      this.layer._canvas &&
      (canvas.style.width !== cssWidth || canvas.style.height !== cssHeight)
    ) {
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
        this.context.render({
          camera: this.camera,
          scene: this.scene,
          target: this.#renderTarget,
        });
      } else {
        this.#renderTarget.resize(width, height);
      }
      this.#renderTarget.swapHandle(context.renderTarget.getFramebuffer(context.renderTarget.fbo));
      this.context.render({
        camera: this.camera,
        scene: this.scene,
        target: this.#renderTarget,
      });
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

  getWrappedWorlds() {
    const map = this.getMap();
    const projObject = map.getProjection().fullExtent;
    const projectionExtent = [
      projObject.left,
      projObject.bottom,
      projObject.right,
      projObject.top,
    ] as Extent;
    const projExtent = map.getProjExtent();
    const extent = [projExtent.xmin, projExtent.ymin, projExtent.xmax, projExtent.ymax];
    let startX = extent[0];
    const worldWidth = getWidth(projectionExtent);
    const projWorldWidth = Math.abs(
      coordinateToPoint(
        map,
        map
          .getProjection()
          .unprojectCoords(new maptalks.Coordinate([projectionExtent[0], projectionExtent[1]])),
        getGLRes(map),
      ).x -
        coordinateToPoint(
          map,
          map
            .getProjection()
            .unprojectCoords(new maptalks.Coordinate([projectionExtent[2], projectionExtent[3]])),
          getGLRes(map),
        ).x,
    );
    let world = 0;

    const result: number[] = [];

    const layer = this.layer;
    const opt = layer.getOptions();
    if (opt.wrapX) {
      while (startX < projectionExtent[0]) {
        --world;
        result.push(world * projWorldWidth);
        startX += worldWidth;
      }
      world = 0;
      startX = extent[2];
      while (startX > projectionExtent[2]) {
        ++world;
        result.push(world * projWorldWidth);
        startX -= worldWidth;
      }
    }

    result.push(0);

    return result;
  }
}

export interface BaseLayerOptionType {
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

const options: BaseLayerOptionType = {
  renderer: 'gl',
  doubleBuffer: false,
  glOptions: undefined,
  forceRenderOnZooming: true,
};

class Layer extends maptalks.CanvasLayer {
  options: any;
  map: any;
  type: string;
  _needsUpdate = true;
  _coordCache = {};
  public layer: WithNull<LayerCore>;
  private source: SourceType;

  constructor(id: string, source: SourceType, opts: BaseLayerOptionType) {
    super(id, opts);
    this.source = source;
    this.type = 'VeLayer';

    this.tempLayer = new maptalks.TileLayer(`temp__${id}`, {
      urlTemplate: 'custom',
      tileSize: this.source.tileSize,
      repeatWorld: false,
    });
  }

  handleZoom() {
    if (this.layer) {
      this.layer.update();
      this.layer.handleZoom();
    }
  }

  moveStart() {
    if (this.layer) {
      this.layer.update();
      this.layer.moveStart();
    }
  }

  moveEnd() {
    if (this.layer) {
      this.layer.update();
      this.layer.moveEnd();
    }
  }

  handleResize() {
    this.update();
  }

  update() {
    if (this.layer) {
      this.layer.update();
    }
  }

  prepareToDraw(gl, scene) {
    const opt = this.options;
    const map = this.getMap();
    const renderer = this._getRenderer();
    if (!map || !renderer) {
      return false;
    }
    this.layer = new LayerCore(
      this.source,
      {
        renderer: renderer.context,
        scene: renderer.scene,
      },
      {
        opacity: opt.opacity,
        renderType: opt.renderType,
        renderFrom: opt.renderFrom,
        styleSpec: opt.styleSpec,
        displayRange: opt.displayRange,
        widthSegments: opt.widthSegments,
        heightSegments: opt.heightSegments,
        wireframe: opt.wireframe,
        getZoom: () => map.getZoom(),
        triggerRepaint: () => {
          renderer.setToRedraw();
        },
        getViewTiles: (source: SourceType) => {
          let { type } = source;
          // @ts-ignore
          type = type !== 'timeline' ? type : source.privateType;
          const wrapTiles: TileID[] = [];
          if (type === 'image') {
            const x = 0;
            const y = 0;
            const z = 0;
            const wrap = 0;
            wrapTiles.push(
              new TileID(z, x, y, z, wrap, {
                getTileBounds: getTileBounds.bind(this, map),
              }),
            );
          } else {
            const { tileGrids } = this.tempLayer.getTiles();
            const { tiles } = tileGrids[0];

            for (let i = 0; i < tiles.length; i++) {
              const tile = tiles[i];
              wrapTiles.push(
                new TileID(tile.z, tile.x, tile.y, tile.z, 0, {
                  getTileBounds: getTileBounds.bind(this, map),
                }),
              );
            }
          }
          return wrapTiles;
        },
        getExtent: () => {
          const projExtent = map.getProjExtent();
          return [projExtent.xmin, projExtent.ymin, projExtent.xmax, projExtent.ymax];
        },
      },
    );

    map.on('zooming', this.handleZoom, this);
    map.on('movestart', this.moveStart, this);
    map.on('moving', this.update, this);
    map.on('moveend', this.moveEnd, this);
    map.on('zoomend', this.handleZoom, this);
    map.on('resize', this.handleResize, this);
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

  /**
   * Draw method of ThreeLayer
   * In default, it calls renderScene, refresh the camera and the scene
   */
  draw(gl, view, scene, camera, timeStamp, context) {
    this.renderScene(context, this);
  }

  /**
   * Draw method of ThreeLayer when map is interacting
   * In default, it calls renderScene, refresh the camera and the scene
   */
  drawOnInteracting(gl, view, scene, camera, event, timeStamp, context) {
    this.renderScene(context, this);
  }
  /**
   * Convert a geographic coordinate to THREE Vector3
   * @param  {maptalks.Coordinate} coordinate - coordinate
   * @param {Number} [z=0] z value
   * @param out
   * @return {Vector3}
   */
  coordinateToVector3(coordinate: any, z = 0, out?: Vector3): WithNull<Vector3> {
    const map = this.getMap();
    if (!map) {
      return null;
    }
    const isArray = Array.isArray(coordinate);
    if (isArray) {
      TEMP_COORD.x = coordinate[0];
      TEMP_COORD.y = coordinate[1];
    } else if (!(coordinate instanceof maptalks.Coordinate)) {
      // eslint-disable-next-line no-param-reassign
      coordinate = new maptalks.Coordinate(coordinate);
    }
    const res = getGLRes(map);
    const p = coordinateToPoint(map, isArray ? TEMP_COORD : coordinate, res, TEMP_POINT);
    if (out) {
      out.x = p.x;
      out.y = p.y;
      out.z = z;
    }
    return new Vector3(p.x, p.y, z);
  }

  coordinatiesToGLFloatArray(
    coordinaties: Array<any>,
    centerPt: Vector3,
  ): WithNull<{
    positions: Float32Array;
    positons2d: Float32Array;
  }> {
    const map = this.getMap();
    if (!map) {
      return null;
    }
    const res = getGLRes(map);
    const len = coordinaties.length;
    const array = new Float32Array(len * 2);
    const array3d = new Float32Array(len * 3);
    for (let i = 0; i < len; i++) {
      let coordinate = coordinaties[i];
      const isArray = Array.isArray(coordinate);
      if (isArray) {
        TEMP_COORD.x = coordinate[0];
        TEMP_COORD.y = coordinate[1];
      } else if (!(coordinate instanceof maptalks.Coordinate)) {
        coordinate = new maptalks.Coordinate(coordinate);
      }
      const p = coordinateToPoint(map, isArray ? TEMP_COORD : coordinate, res, TEMP_POINT);
      p.x -= centerPt.x;
      p.y -= centerPt.y;
      const idx = i * 2;
      array[idx] = p.x;
      array[idx + 1] = p.y;

      const idx1 = i * 3;
      array3d[idx1] = p.x;
      array3d[idx1 + 1] = p.y;
      array3d[idx1 + 2] = 0;
    }
    return {
      positions: array3d,
      positons2d: array,
    };
  }

  coordinatiesToGLArray(
    coordinaties: Array<any>,
    centerPt: Vector3,
  ): WithNull<Array<Array<number>>> {
    const map = this.getMap();
    if (!map) {
      return null;
    }
    const res = getGLRes(map);
    const len = coordinaties.length;
    const array = new Array(len);
    for (let i = 0; i < len; i++) {
      let coordinate = coordinaties[i];
      const isArray = Array.isArray(coordinate);
      if (isArray) {
        TEMP_COORD.x = coordinate[0];
        TEMP_COORD.y = coordinate[1];
      } else if (!(coordinate instanceof maptalks.Coordinate)) {
        coordinate = new maptalks.Coordinate(coordinate);
      }
      const p = coordinateToPoint(map, isArray ? TEMP_COORD : coordinate, res, TEMP_POINT);
      p.x -= centerPt.x;
      p.y -= centerPt.y;
      array[i] = [p.x, p.y];
    }
    return array;
  }

  /**
   * Convert geographic distance to THREE Vector3
   * @param  {Number} w - width
   * @param  {Number} h - height
   * @param coord
   * @return {Vector3}
   */
  distanceToVector3(w: number, h: number, coord?: any): Vector3 {
    if ((w === 0 && h === 0) || !maptalks.Util.isNumber(w) || !maptalks.Util.isNumber(h)) {
      return new Vector3(0, 0, 0);
    }
    const map = this.getMap();
    const res = getGLRes(map);
    let center = coord || map.getCenter();
    if (!(center instanceof maptalks.Coordinate)) {
      center = new maptalks.Coordinate(center);
    }
    const target = map.locate(center, w, h);
    const p0 = coordinateToPoint(map, center, res),
      p1 = coordinateToPoint(map, target, res);
    const x = Math.abs(p1.x - p0.x) * maptalks.Util.sign(w);
    const y = Math.abs(p1.y - p0.y) * maptalks.Util.sign(h);
    return new Vector3(x, y, 0);
  }

  altitudeToVector3(altitude: number, altitude1: number, coord?: any, out?: Vector3): Vector3 {
    if (altitude === 0 || !maptalks.Util.isNumber(altitude)) {
      return new Vector3(0, 0, 0);
    }
    const map = this.getMap();
    if (map.altitudeToPoint) {
      const res = getGLRes(map);
      let z = map.altitudeToPoint(altitude, res);
      if (altitude < 0 && z > 0) {
        z = -z;
      }
      if (out) {
        out.x = z;
        out.y = z;
        out.z = 0;
        return out;
      }
      return new Vector3(z, z, 0);
    }
    return this.distanceToVector3(altitude, altitude, coord);
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

  /**
   * 添加 Mesh
   * @param meshes
   * @param render
   */
  addMesh(meshes: any, render = true) {
    if (!meshes) return this;
    if (!Array.isArray(meshes)) {
      // eslint-disable-next-line no-param-reassign
      meshes = [meshes];
    }
    const scene = this.getScene();
    meshes.forEach((mesh) => {
      scene?.add(mesh);
    });
    if (render) {
      const renderer = this._getRenderer();
      if (renderer) {
        renderer.setToRedraw();
      }
    }
    return this;
  }

  /**
   * 移除对象
   * @param meshes
   * @param render
   */
  removeMesh(meshes: any, render = true) {
    if (!meshes) return this;
    if (!Array.isArray(meshes)) {
      // eslint-disable-next-line no-param-reassign
      meshes = [meshes];
    }
    const scene = this.getScene();
    meshes.forEach((mesh) => {
      scene?.remove(mesh);
    });
    if (render) {
      const renderer = this._getRenderer();
      if (renderer) {
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
    this.tempLayer.remove();
    map?.off('zooming', this.handleZoom, this);
    map?.off('zoomend', this.handleZoom, this);
    map?.off('movestart', this.moveStart, this);
    map?.off('moving', this.update, this);
    map?.off('moveend', this.moveEnd, this);
    map?.off('resize', this.handleResize, this);
    map?.off('viewchange', this.update, this);

    this.clear();
    if (this.layer) {
      this.layer = null;
    }
    return this;
  }
}

Layer.mergeOptions(options);

Layer.registerRenderer('gl', VeRenderer);

export { Layer, VeRenderer };
