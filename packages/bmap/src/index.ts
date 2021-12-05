import {
  WindCore,
  Field,
  isArray,
  formatData,
  warnLog,
  assign,
  defaultOptions,
} from 'wind-core';
import type { IField, IOptions } from 'wind-core';

export interface IWindOptions extends IOptions {
  opacity: number;
  zIndex: number;
  context: '2d';
  windOptions: Partial<IOptions>;
  [key: string]: any;
}

const G = typeof window === 'undefined' ? global : window;

const _options = {
  context: '2d',
  paneName: 'mapPane',
  opacity: 1,
  zIndex: 1,
  windOptions: {},
  fieldOptions: {},
};

// @ts-ignore
const BMap = G?.BMap;

if (!BMap) {
  throw new Error('Before using this plugin, you must first introduce the BMap JS API <http://lbsyun.baidu.com/index.php?title=jspopular3.0>');
}

class BMapWind extends BMap.Overlay {
  private options: IWindOptions;
  private canvas: HTMLCanvasElement | null;
  private wind: WindCore | null;
  private context: '2d';
  private field: Field | undefined;
  private map: any;
  private paneName: string;
  private zIndex: number;
  private mixBlendMode: any;
  public enableMassClear: boolean;

  constructor (data: any, options: Partial<IWindOptions> = {}) {
    const opt = assign({}, _options, options);
    super(options);
    this.options = opt;
    this.paneName = this.options.paneName;
    this.context = this.options.context;
    this.zIndex = this.options.zIndex;
    this.mixBlendMode = this.options.mixBlendMode || null;
    this.enableMassClear = this.options.enableMassClear;

    /**
     * 矢量图层
     * @type {null}
     */
    this.canvas = null;

    /**
     * windy layer
     * @type {null}
     */
    this.wind = null;

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.handleResize = this.handleResize.bind(this);

    this.pickWindOptions();

    if (data) {
      this.setData(data, options.fieldOptions);
    }
  }

  /**
   * append layer to map
   * @param map
   */
  public appendTo (map: any) {
    if (map) {
      map.addOverlay(this);
    } else {
      throw new Error('not map object');
    }
  }

  public initialize (map: any) {
    this.map = map;
    const canvas = this.canvas = document.createElement('canvas');
    canvas.style.cssText = `position:absolute; left:0; top:0; z-index: ${this.zIndex} ;user-select:none;`;
    // @ts-ignore
    canvas.style.mixBlendMode = this.mixBlendMode;
    this.adjustSize();
    map.getPanes()[this.paneName].appendChild(canvas);
    this.bindEvent();
    return this.canvas
  }

  private handleResize() {
    this.adjustSize();
    this._draw();
  }

  public bindEvent() {
    this.map.addEventListener('resize', this.handleResize);

    this.map.addEventListener('dragstart', this.stop);
    this.map.addEventListener('dragend', this.start);
    this.map.addEventListener('movestart', this.stop);
    this.map.addEventListener('moveend', this.start);
    this.map.addEventListener('zoomstart', this.stop);
    this.map.addEventListener('zoomend', this.start);
    this.map.addEventListener('touchstart', this.stop);
    this.map.addEventListener('touchend', this.start);
  }

  public unbindEvent() {
    this.map.removeEventListener('resize', this.handleResize);

    this.map.removeEventListener('dragstart', this.stop);
    this.map.removeEventListener('dragend', this.start);
    this.map.removeEventListener('movestart', this.stop);
    this.map.removeEventListener('moveend', this.start);
    this.map.removeEventListener('zoomstart', this.stop);
    this.map.removeEventListener('zoomend', this.start);
    this.map.removeEventListener('touchstart', this.stop);
    this.map.removeEventListener('touchend', this.start);
  }

  public start() {
    if (this.wind) {
      this.wind.start();
    }
  }

  public stop() {
    if (this.wind) {
      this.wind.stop();
    }
  }

  private adjustSize () {
    const size = this.map.getSize();
    const canvas = this.canvas;
    const devicePixelRatio = window.devicePixelRatio || 1;

    if (canvas !== null) {
      canvas.width = size.width * devicePixelRatio;
      canvas.height = size.height * devicePixelRatio;
      if (this.context === '2d') {
        canvas.getContext(this.context)!.scale(devicePixelRatio, devicePixelRatio)
      }
      canvas.style.width = size.width + 'px';
      canvas.style.height = size.height + 'px';
    }
  }

  public draw () {
    this._draw();
  }

  private _draw () {
    const map = this.map;
    const size = map.getSize();
    const center = map.getCenter();
    if (center && this.canvas) {
      const pixel = map.pointToOverlayPixel(center);
      this.canvas.style.left = pixel.x - size.width / 2 + 'px';
      this.canvas.style.top = pixel.y - size.height / 2 + 'px';
      // @ts-ignore
      this.dispatchEvent('draw');
      this.options.update && this.options.update.call(this);
      this.render(this.canvas);
    }
  }

  /**
   * render windy layer
   * @param canvas
   * @returns {BMapWind}
   */
  public render (canvas: HTMLCanvasElement) {
    if (!this.getData() || !this.map) return this;
    const opt = this.getWindOptions();
    if (canvas && !this.wind) {
      const data = this.getData();

      const ctx = this.getContext();

      if (ctx) {
        this.wind = new WindCore(ctx, opt, data);

        this.wind.project = this.project.bind(this);
        this.wind.unproject = this.unproject.bind(this);
        this.wind.intersectsCoordinate = this.intersectsCoordinate.bind(this);
        this.wind.postrender = () => {
          // @ts-ignore
          // this.setCanvasUpdated();
        };
      }
    }

    if (this.wind) {
      this.wind.prerender();
      this.wind.render();
    }

    return this;
  }

  /**
   * get canvas context
   * @returns {*}
   */
  private getContext () {
    if (this.canvas === null) return;
    return this.canvas.getContext(this.context);
  }

  public getContainer () {
    return this.canvas;
  }

  private getProjection() {
    const map = this.map;

    const mapType = map.getMapType();
    let projection;
    if (mapType.getProjection) {
      projection = mapType.getProjection();
    } else {
      projection = {
        lngLatToPoint: function(point: {
          lng: number;
          lat: number;
        }) {
          const mc = map.lnglatToMercator(point.lng, point.lat);
          return {
            x: mc[0],
            y: mc[1]
          }
        }
      }
    }

    return projection;
  }

  // 经纬度左边转换为墨卡托坐标 from: https://github.com/huiyan-fe/mapv/blob/master/src/map/baidu-map/AnimationLayer.js#L62
  public transferToMercator(coordinates: [number, number]): [number, number] {
    const projection = this.getProjection();

    if (coordinates[0] < -180 || coordinates[0] > 180 || coordinates[1] < -90 || coordinates[1] > 90) {
      return coordinates;
    } else {
      const pixel = projection.lngLatToPoint({
        lng: coordinates[0],
        lat: coordinates[1]
      });
      return [pixel.x, pixel.y];
    }
  }

  private projectInner(coordinate: [number, number]): [number, number] {
    const map = this.map;
    let scale = 1;
    if (this.context != '2d') {
      scale = window.devicePixelRatio;
    }

    const projection = this.getProjection();
    let mcCenter;
    if  (map.getMapType().getProjection) {
      mcCenter = projection.lngLatToPoint(map.getCenter());
    } else  {
      mcCenter = {
        x: map.getCenter().lng,
        y: map.getCenter().lat
      };
    }

    let zoomUnit;
    if (projection.getZoomUnits) {
      zoomUnit = projection.getZoomUnits(map.getZoom());
    } else {
      zoomUnit = Math.pow(2, 18 - map.getZoom());
    }

    const nwMc = new BMap.Pixel(mcCenter.x - (map.getSize().width / 2) * zoomUnit, mcCenter.y + (map.getSize().height / 2) * zoomUnit); //左上角墨卡托坐标

    const x = (coordinate[0] - nwMc.x) / zoomUnit * scale;
    const y = (nwMc.y - coordinate[1]) / zoomUnit * scale;
    return [x, y];
  }

  public project(coordinate: [number, number]): [number, number] {
    // FIXME: https://github.com/huiyan-fe/mapv/blob/master/src/map/baidu-map/Layer.js#L194
    // const pixel = this.map.pointToPixel(new BMap.Point(...coordinate));
    const mercatorCoordinates = this.transferToMercator(coordinate);
    return this.projectInner(mercatorCoordinates);
  }

  public unproject(pixel: [number, number]): [number, number] {
    // FIXME: https://github.com/huiyan-fe/mapv/blob/master/src/map/baidu-map/Layer.js#L194
    const coords = this.map.pixelToPoint(new BMap.Pixel(pixel[0], pixel[1]));
    return [coords.lng, coords.lat];
  }

  public intersectsCoordinate(coordinate: [number, number]): boolean {
    const mapExtent = this.map.getBounds();
    return mapExtent.containsPoint(new BMap.Point(coordinate[0], coordinate[1])) as boolean;
  }

  private pickWindOptions() {
    Object.keys(defaultOptions).forEach((key: string) => {
      if (key in this.options) {
        if (this.options.windOptions === undefined) {
          this.options.windOptions = {};
        }
        // @ts-ignore
        this.options.windOptions[key] = this.options[key];
      }
    });
  }

  /**
   * get wind layer data
   */
  public getData () {
    return this.field;
  }

  /**
   * set layer data
   * @param data
   * @param options
   * @returns {BMapWind}
   */
  public setData (data: any, options: Partial<IField> = {}) {
    if (data && data.checkFields && data.checkFields()) {
      this.field = data;
    } else if (isArray(data)) {
      this.field = formatData(data, options);
    } else {
      console.error('Illegal data');
    }

    if (this.map && this.canvas && this.field) {
      this?.wind?.updateData(this.field);
      this.render(this.canvas);
    }

    return this;
  }

  public updateParams(options : Partial<IOptions> = {}) {
    warnLog('will move to setWindOptions');
    this.setWindOptions(options);
    return this;
  }

  public getParams() {
    warnLog('will move to getWindOptions');
    return this.getWindOptions();
  }

  public setWindOptions(options: Partial<IOptions>) {
    const beforeOptions = this.options.windOptions || {};
    this.options = assign(this.options, {
      windOptions: assign(beforeOptions, options || {}),
    });

    if (this.wind) {
      this.wind.setOptions(this.options.windOptions);
      this.wind.prerender();
    }
  }

  public getWindOptions() {
    return this.options.windOptions || {};
  }

  public show() {
    if (!this.canvas) {
      this.map.addOverlay(this);
    } else {
      this.canvas.style.display = 'block';
    }
  }

  public hide() {
    if (this.canvas) {
      this.canvas.style.display = 'none';
    }
  }

  public setZIndex (zIndex: number) {
    this.zIndex = zIndex;
    if (this.canvas) {
      this.canvas.style.zIndex = String(this.zIndex);
    }
  }

  public getZIndex () {
    return this.zIndex;
  }
}

const WindLayer = BMapWind;

export {
  Field,
  WindLayer,
};

export default BMapWind;
