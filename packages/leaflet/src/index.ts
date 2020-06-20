import * as L from 'leaflet';
import WindCore, {
  Field,
  assign,
  defaultOptions,
  formatData,
  IOptions,
  isArray,
  createCanvas,
} from 'wind-core';

const WindLayer = L.Layer.extend({
  options: {},

  initialize(id: string | number, data: any, options: any) {
    if (!id) {
      throw Error('layer id must be specified');
    }

    this._layerId = id;

    L.Util.setOptions(this, options);

    this.field = null;

    this._map = null;

    this.pickWindOptions();

    this.devicePixelRatio = this.options.devicePixelRatio ||
      // @ts-ignore
      (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) as number;

    if (data) {
      this.setData(data);
    }
  },

  _createCanvas(id: string | number, zIndex: number) {
    const layer = L.DomUtil.create('div', 'leaflet-canvas-layer');

    const canvas = createCanvas(this._width, this._height, this.devicePixelRatio);
    canvas.id = String(id);
    canvas.style.position = 'absolute';
    canvas.style.top = String(0);
    canvas.style.left = String(0);
    canvas.style.zIndex = String(zIndex);
    canvas.style.willChange = 'transform';
    canvas.style.width = this._width + 'px';
    canvas.style.height = this._height + 'px';

    layer.appendChild(canvas);

    this._map.getPanes().overlayPane.appendChild(layer);

    return {
      layer: layer,
      canvas: canvas,
    };
  },

  _reset(){
    const topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this.canvas, topLeft);
  },

  _onResize(resizeEvent: L.ResizeEvent) {
    this.canvas.width = resizeEvent.newSize.x;
    this.canvas.height = resizeEvent.newSize.y;
  },

  _zoomStart(){
    this._moveStart();
  },

  _moveStart(){
    if (!this._updating){
      this._updating = true;
    }
  },

  _animateZoom(event: L.ZoomAnimEvent) {
    const scale = this._map.getZoomScale(event.zoom);

    const offset = this._map._latLngToNewLayerPoint(this._map.getBounds().getNorthWest(), event.zoom, event.center);

    L.DomUtil.setTransform(this.canvas, offset, scale);
  },

  _resizeCanvas(scale: number) {
    this.canvas.style.width = this._width * scale + 'px';
    this.canvas.style.height = this._height * scale + 'px';
  },

  _render() {
    console.log('render');
    this._reset();

    const opt = this.getWindOptions();
    if (!this.wind && this._map) {
      const ctx = this.canvas.getContext('2d');
      const data = this.getData();

      this.wind = new WindCore(ctx, opt, data);

      this.wind.project = this.project.bind(this);
      this.wind.unproject = this.unproject.bind(this);
      this.wind.intersectsCoordinate = this.intersectsCoordinate.bind(this);
      this.wind.postrender = () => {
        // @ts-ignore
        // this.setCanvasUpdated();
      };
    }

    this.wind.prerender();

    this.wind.render();
  },

  project(coordinate: [number, number]): [number, number] {
    const pixel = this._map.latLngToContainerPoint(new L.LatLng(coordinate[1], coordinate[0]));
    return [
      pixel.x * this.devicePixelRatio,
      pixel.y * this.devicePixelRatio,
    ];
  },

  unproject(pixel: [number, number]): [number, number] {
    const coordinates = this._map.containerPointToLatLng(new L.Point(pixel[0], pixel[1]));
    return [
      coordinates.lng,
      coordinates.lat,
    ];
  },

  intersectsCoordinate(coordinate: [number, number]): boolean {
    const bounds = this._map.getBounds();
    return bounds.contains(L.latLng(coordinate[1], coordinate[0])) as boolean;
    // return true;
  },

  onAdd(map: L.Map) {
    this._map = map;
    this._width = map.getSize().x;
    this._height = map.getSize().y;

    const { layer, canvas } = this._createCanvas(this._layerId, this.options.zIndex || 1);

    this.layer = layer;
    this.canvas = canvas;

    const animated = this._map.options.zoomAnimation && L.Browser.any3d;
    L.DomUtil.addClass(this.canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));

    this._render();
  },

  onRemove() {
    if (this.wind) {
      this.wind.stop();
    }
    this._map.getPanes().overlayPane.removeChild(this.layer);

    this._map.off(this.getEvents(), this);

    this.canvas = null;
  },

  getEvents() {
    const events: {
      [key: string]: any;
    } = {
      resize: this._onResize,
      viewreset: this._render,
      moveend: this._render,
      // movestart: this._moveStart,
      // zoomStart: this._zoomStart,
      zoomEnd: this._render,
      // zoomanim: undefined,
    };

    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      events.zoomanim =  this._animateZoom;
    }

    return events;
  },

  pickWindOptions() {
    Object.keys(defaultOptions).forEach((key: string) => {
      if (key in this.options) {
        if (this.options.windOptions === undefined) {
          this.options.windOptions = {};
        }
        // @ts-ignore
        this.options.windOptions[key] = this.options[key];
      }
    });
  },

  /**
   * get wind layer data
   */
  getData() {
    return this.field;
  },

  /**
   * set layer data
   * @param data
   * @returns {WindLayer}
   */
  setData(data: any) {
    if (data && data.checkFields && data.checkFields()) {
      this.field = data;
    } else if (isArray(data)) {
      this.field = formatData(data);
    } else {
      console.error('Illegal data');
    }
    return this;
  },

  setWindOptions(options: Partial<IOptions>) {
    const beforeOptions = this.options.windOptions || {};
    this.options = assign(this.options, {
      windOptions: assign(beforeOptions, options || {}),
    });

    if (this.wind) {
      const windOptions = this.options.windOptions;
      this.wind.setOptions(windOptions);
      this.wind.prerender();
    }
  },

  getWindOptions() {
    return this.options.windOptions || {};
  },
});

export {
  Field,
  WindLayer,
}

export default WindLayer;
