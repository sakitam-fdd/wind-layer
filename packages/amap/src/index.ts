import {
  WindCore,
  Field,
  isArray,
  formatData,
  warnLog,
  assign,
  createCanvas,
  removeDomNode,
  compareVersion,
  defaultOptions,
} from 'wind-core';
import type { IField, IOptions } from 'wind-core';

export interface IWindOptions extends IOptions {
  opacity: number;
  zIndex: number;
  zooms: [number, number];
  bounds: any;
  context: '2d';
  windOptions: Partial<IOptions>;
  [key: string]: any;
}

const G = typeof window === 'undefined' ? global : window;
// @ts-ignore 使用全局变量
const AMap = G?.AMap;

if (!AMap) {
  throw new Error(
    'Before using this plugin, you must first introduce the amap JS API <https://lbs.amap.com/api/javascript-api/summary>',
  );
}

const _options = {
  context: '2d',
  animation: false,
  opacity: 1,
  zIndex: 12,
  zooms: [0, 22],
  windOptions: {},
  fieldOptions: {},
};

class AMapWind {
  private options: IWindOptions;
  private canvas: HTMLCanvasElement | null;
  private wind: WindCore | null;
  private context: '2d';
  private field: Field | undefined;
  private map: any;

  constructor(data: any, options: Partial<IWindOptions> = {}) {
    this.options = assign({}, _options, options);

    /**
     * internal
     * @type {null}
     */
    this.canvas = null;

    /**
     * windy layer
     * @type {null}
     */
    this.wind = null;

    /**
     * bind context
     * @type {{new(...args: any[][]): any} | ((...args: any[][]) => any) | ((...args: any[]) => any) | any | {new(...args: any[]): any}}
     */
    this.init = this.init.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.canvasFunction = this.canvasFunction.bind(this);

    this.pickWindOptions();

    if (data) {
      this.setData(data, this.options.fieldOptions);
    }
  }

  /**
   * append layer to map
   * @param map
   */
  appendTo(map: any) {
    if (map) {
      this.init(map);
    } else {
      throw new Error('not map object');
    }
  }

  /**
   * init windy layer
   * @param map
   */
  init(map: any) {
    if (map) {
      this.map = map;
      this.context = this.options.context || '2d';
      this.getCanvasLayer();
      this.map.on('resize', this.handleResize, this);
    } else {
      throw new Error('not map object');
    }
  }

  handleResize() {
    if (this.canvas) {
      this.canvasFunction();
    }
  }

  /**
   *  render layer
   * @param canvas
   * @returns {*}
   */
  render(canvas: HTMLCanvasElement) {
    if (!this.getData()) return this;
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
          //
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
   * get canvas layer
   */
  getCanvasLayer() {
    if (!this.canvas) {
      const canvas = this.canvasFunction();

      const ops: {
        canvas: HTMLCanvasElement | null;
        bounds?: any;
        zooms?: [number, number];
        zIndex?: number;
        opacity?: number;
      } = {
        canvas: canvas,
      };

      if (this.options.zooms) {
        ops.zooms = this.options.zooms;
      }

      if ('zIndex' in this.options && typeof this.options.zIndex === 'number') {
        ops.zIndex = this.options.zIndex;
        canvas.style.zIndex = ops.zIndex as unknown as string;
      }

      if ('opacity' in this.options && typeof this.options.opacity === 'number') {
        ops.opacity = this.options.opacity;
      }

      const container: HTMLDivElement = this.map.getContainer();
      if (!container) {
        console.error('map container not exit');
        return;
      }
      const layerContainer: HTMLDivElement | null = container.querySelector('.amap-layers');

      if (layerContainer) {
        layerContainer.appendChild(canvas);
      }

      this.map.on('mapmove', this.canvasFunction, this);
      this.map.on('zoomchange', this.canvasFunction, this);
    }
  }

  /**
   * canvas constructor
   * @returns {*}
   */
  canvasFunction() {
    const retina = AMap.Browser.retina ? 2 : 1;
    const [width, height]: [number, number] = [this.map.getSize().width, this.map.getSize().height];
    if (!this.canvas) {
      this.canvas = createCanvas(width, height, retina, null);
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0px';
      this.canvas.style.left = '0px';
      this.canvas.style.right = '0px';
      this.canvas.style.bottom = '0px';
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
    } else {
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
      this.canvas.width = width * retina;
      this.canvas.height = height * retina;
    }

    if (this.canvas) {
      this.render(this.canvas);
    }
    return this.canvas;
  }

  /**
   * fixed viewMode
   * @private
   */
  _getBounds() {
    let [southWest, northEast] = [undefined, undefined];
    const bounds = this.map.getBounds();
    if (compareVersion(AMap?.version ?? AMap.v, '2.0') >= 0) {
      // FIX: 高德地图3D模式和2D模式，map.getBounds接口已统一
      northEast = bounds.getNorthEast(); // xmax ymax
      southWest = bounds.getSouthWest(); // xmin ymin
    } else {
      const type = this.map.getViewMode_();
      if (type.toLowerCase() === '2d') {
        northEast = bounds.getNorthEast(); // xmax ymax
        southWest = bounds.getSouthWest(); // xmin ymin
      } else {
        // TODO: 高德地图3D模式下目前返回的bounds顺序为左上-右上-右下-左下-左上
        const arrays = bounds.bounds.map((item: any) => [item.getLng(), item.getLat()]);
        southWest = new AMap.LngLat(arrays[3][0], arrays[3][1]);
        northEast = new AMap.LngLat(arrays[1][0], arrays[1][1]);
      }
    }
    return new AMap.Bounds(southWest, northEast);
  }

  /**
   * remove layer
   */
  public removeLayer() {
    if (!this.map) return;
    if (this.wind) {
      this.wind.stop();
    }
    this.map.off('resize', this.handleResize, this);
    this.map.off('mapmove', this.canvasFunction, this);
    this.map.off('zoomchange', this.canvasFunction, this);
    if (this.canvas) {
      removeDomNode(this.canvas);
    }
    delete this.map;
    // @ts-ignore with undef
    delete this.canvas;
  }

  public remove() {
    this.removeLayer();
  }

  public project(coordinate: [number, number]): [number, number] {
    const retina = AMap.Browser.retina ? 2 : 1;
    const pixel = this.map.lngLatToContainer(new AMap.LngLat(coordinate[0], coordinate[1], true));
    return [pixel.x * retina, pixel.y * retina];
  }

  public unproject(pixel: [number, number]): [number, number] | null {
    const coordinate = this.map.containerToLngLat(new AMap.Pixel(pixel[0], pixel[1]));
    if (coordinate) {
      return [coordinate.lng, coordinate.lat];
    }

    return null;
  }

  public intersectsCoordinate(coordinate: [number, number]): boolean {
    const mapExtent = this._getBounds();
    return mapExtent.contains(new AMap.LngLat(coordinate[0], coordinate[1])) as boolean;
    // return true;
  }

  /**
   * get canvas context
   * @returns {*}
   */
  private getContext() {
    if (this.canvas === null) return;
    return this.canvas.getContext(this.context);
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
  public getData() {
    return this.field;
  }

  /**
   * set layer data
   * @param data
   * @param options
   * @returns {WindLayer}
   */
  public setData(data: any, options: Partial<IField> = {}) {
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

  public updateParams(options: Partial<IOptions> = {}) {
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
}

const WindLayer = AMapWind;

export { Field, WindLayer };

export default AMapWind;
