/**
 * @desc mapbox dom 图层
 * @tip: 为什么实现这个图层，本身mapbox-gl支持 canvas source，但是经过测试添加此图层性能会急剧下降
 */
import * as mapboxgl from 'mapbox-gl';

/**
 * 移除 dom
 * @param node
 * @returns {removeDomNode}
 */
function removeDomNode(node: HTMLElement | HTMLCanvasElement) {
  if (!node) {
    return null;
  }
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
  return node;
}

export default class Overlay {
  map: mapboxgl.Map;
  public options: any;
  protected canvas: HTMLCanvasElement | null;
  private canvas2: HTMLCanvasElement | null;
  private devicePixelRatio: number;
  private type: string;
  private renderingMode: string;
  private id: string | number;

  constructor(id: string | number, options = {}) {
    if (!id) {
      throw Error('layer id must be specified');
    }

    this.id = id;
    this.options = options;
    this.canvas = null;
    this.canvas2 = null;

    this.devicePixelRatio = this.options.devicePixelRatio ||
      // @ts-ignore
      (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) as number;

    this.render = this.render.bind(this);

    this.type = 'custom';
    this.renderingMode = '2d';
  }

  onAdd(map: mapboxgl.Map) {
    this.setMap(map);
    this.canvas = this.initialize();
    this.canvas2 = this.initialize();
  }

  initialize() {
    const canvasContainer = this.map.getCanvasContainer();
    const mapboxCanvas = this.map.getCanvas();
    const canvasOverlay = document.createElement('canvas');

    // @ts-ignore
    const { width, height } = this.map.transform;

    const pixel = this.devicePixelRatio;

    canvasOverlay.width = width * pixel;
    canvasOverlay.height = height * pixel;

    canvasOverlay.style.position = 'absolute';
    canvasOverlay.className = 'mapbox-overlay-canvas';
    canvasOverlay.style.width = mapboxCanvas.style.width;
    canvasOverlay.style.height = mapboxCanvas.style.height;
    canvasContainer.appendChild(canvasOverlay);

    return canvasOverlay;
  }

  render() {}

  project(coordinates: [number, number]) {
    if (this.map !== undefined) {
      const lnglat = this.map.project(new mapboxgl.LngLat(coordinates[0], coordinates[1]));
      const x = Math.round(lnglat.x);
      const y = Math.round(lnglat.y);
      return [
        x * this.devicePixelRatio,
        y * this.devicePixelRatio,
      ];
    }
    return coordinates;
  }

  unproject(pixel: [number, number]) {
    if (this.map !== undefined) {
      const lnglat: mapboxgl.LngLat = this.map.unproject(new mapboxgl.Point(pixel[0], pixel[1]));
      const lng = Math.round(lnglat.lng);
      const lat = Math.round(lnglat.lat);
      return [lng, lat];
    }
    return pixel;
  }

  intersectsCoordinate(coordinate: [number, number]): boolean {
    const bounds = this.map.getBounds();
    return bounds.contains(new mapboxgl.LngLat(coordinate[0], coordinate[1])) as boolean;
    // return true;
  }

  clear() {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      ctx && ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    if (this.canvas2) {
      const ctx = this.canvas2.getContext('2d');
      ctx && ctx.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
    }
  }

  setMap(map: mapboxgl.Map) {
    this.map = map;
    return this;
  }

  getMap() {
    return this.map;
  }

  addTo(map: mapboxgl.Map) {
    this.onAdd(map);
  }

  remove() {
    if (this.canvas) {
      removeDomNode(this.canvas);
      this.canvas = null;
    }

    if (this.canvas2) {
      removeDomNode(this.canvas2);
      this.canvas2 = null;
    }
  }
}
