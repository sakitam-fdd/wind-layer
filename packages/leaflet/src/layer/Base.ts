import * as L from 'leaflet';
import { createCanvas } from 'wind-core';

export class BaseLayer extends L.Layer {
  options: any;
  _updating: boolean;
  _layerId: string | number;
  devicePixelRatio: number;
  _width: number;
  _height: number;
  canvas: HTMLCanvasElement | null;

  constructor(id: string | number, data: any, options: any) {
    // @ts-ignore 原始 leaflet 定义不对 https://github.com/Leaflet/Leaflet/blob/main/src/core/Class.js#L81C2-L81C13
    super(id, data, options);
  }

  initialize(id: string | number, data: any, options: any) {
    if (!id) {
      throw Error('layer id must be specified');
    }

    this._layerId = id;

    L.Util.setOptions(this, options);

    this.devicePixelRatio =
      this.options.devicePixelRatio ||
      // @ts-ignore 忽略错误
      ((window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) as number);
  }

  _createCanvas(id: string | number, zIndex: number) {
    const canvas = createCanvas(this._width, this._height, this.devicePixelRatio);
    canvas.id = String(id);

    this._map.getPanes().overlayPane.appendChild(canvas);

    return canvas;
  }

  _reset() {
    const topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this.canvas!, topLeft);

    this._redraw();
  }

  _onResize(resizeEvent: L.ResizeEvent) {
    this.canvas!.style.width = resizeEvent.newSize.x + 'px';
    this.canvas!.style.height = resizeEvent.newSize.y + 'px';
    this._width = resizeEvent.newSize.x;
    this._height = resizeEvent.newSize.y;
    this._resizeCanvas(this.devicePixelRatio);
  }

  _zoomStart() {
    this._moveStart();
  }

  _moveStart() {
    if (!this._updating) {
      this._updating = true;
    }
  }

  _animateZoom(event: L.ZoomAnimEvent) {
    const scale = this._map.getZoomScale(event.zoom, this._map.getZoom());

    // @ts-ignore 忽略错误
    const offset = this._map._latLngToNewLayerPoint(this._map.getBounds().getNorthWest(), event.zoom, event.center);

    L.DomUtil.setTransform(this.canvas!, offset, scale);
  }

  _resizeCanvas(scale: number) {
    this.canvas!.width = this._width * scale;
    this.canvas!.height = this._height * scale;
  }

  _redraw() {
    this._render();
  }

  _render() {
    //
  }

  project(coordinate: [number, number]): [number, number] {
    const pixel = this._map.latLngToContainerPoint(new L.LatLng(coordinate[1], coordinate[0]));
    return [pixel.x * this.devicePixelRatio, pixel.y * this.devicePixelRatio];
  }

  unproject(pixel: [number, number]): [number, number] {
    const coordinates = this._map.containerPointToLatLng(new L.Point(pixel[0], pixel[1]));
    return [coordinates.lng, coordinates.lat];
  }

  intersectsCoordinate(coordinate: [number, number]): boolean {
    const bounds = this._map.getBounds();
    return bounds.contains(L.latLng(coordinate[1], coordinate[0])) as boolean;
  }

  onAdd(map: L.Map) {
    this._map = map;
    const size = map.getSize();
    this._width = size.x;
    this._height = size.y;

    this.canvas = this._createCanvas(this._layerId, this.options.zIndex || 1);

    const animated = this._map.options.zoomAnimation && L.Browser.any3d;
    L.DomUtil.addClass(this.canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));

    // @ts-ignore 忽略错误
    this._map.on(this.getEvents(), this);

    this._resetView();

    this._render();

    return this;
  }

  _resetView(e?: any) {}

  onMoveEnd() {
    this._reset();
  }

  onRemove() {
    this._map.getPanes().overlayPane.removeChild(this.canvas!);

    // @ts-ignore 忽略错误
    this._map.off(this.getEvents(), this);

    this.canvas = null;

    return this;
  }

  getEvents() {
    const events: {
      [key: string]: any;
    } = {
      resize: this._onResize,
      viewreset: this._render,
      moveend: this.onMoveEnd,
      // movestart: this._moveStart,
      zoomstart: this._render,
      zoomend: this._render,
      // zoomanim: undefined,
    };

    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      events.zoomanim = this._animateZoom;
    }

    return events;
  }
}
