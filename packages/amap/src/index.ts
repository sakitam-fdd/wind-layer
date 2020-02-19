import WindCore, {
  Field,
  isArray,
  formatData,
  warnLog,
  assign,
  createCanvas,
  defaultOptions,
  IOptions,
} from 'wind-core';

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
// @ts-ignore
const AMap = G?.AMap;

if (!AMap) {
  throw new Error('Before using this plugin, you must first introduce the amap JS API <https://lbs.amap.com/api/javascript-api/summary>');
}

const _options = {
  context: '2d',
  animation: false,
  opacity: 1,
  zIndex: 12,
  zooms: [0, 22],
  windOptions: {},
};

class AMapWind {
  private options: IWindOptions;
  private canvas: HTMLCanvasElement | null;
  private wind: WindCore | null;
  private context: '2d';
  private field: Field | undefined;
  private map: any;
  private layer_: any;

  constructor (data: any, options: Partial<IWindOptions> = {}) {
    this.options = assign({}, _options, options);

    /**
     * internal
     * @type {null}
     */
    this.canvas = null;

    /**
     * canvas layer
     * @type {null}
     * @private
     */
    this.layer_ = null;

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
    this._addReFreshHandle = this._addReFreshHandle.bind(this);

    this.pickWindOptions();

    if (data) {
      this.setData(data);
    }
  }

  /**
   * append layer to map
   * @param map
   */
  appendTo (map: any) {
    if (map) {
      this.init(map)
    } else {
      throw new Error('not map object');
    }
  }

  /**
   * init windy layer
   * @param map
   */
  init (map: any) {
    if (map) {
      this.map = map;
      this.context = this.options.context || '2d';
      this.getCanvasLayer();
      this.map.on('resize', this.handleResize, this)
    } else {
      throw new Error('not map object')
    }
  }

  handleResize () {
    if (this.canvas) {
      this.canvasFunction()
    }
  }

  /**
   *  render layer
   * @param canvas
   * @returns {*}
   */
  render (canvas: HTMLCanvasElement) {
    if (!this.getData()) return this;
    if (canvas && !this.wind) {
      const opt = this.getWindOptions();
      const data = this.getData();

      const ctx = this.getContext();

      if (ctx) {
        this.wind = new WindCore(ctx, opt, data);

        this.wind.project = this.project.bind(this);
        this.wind.intersectsCoordinate = this.intersectsCoordinate.bind(this);
        this.wind.postrender = () => {
          // @ts-ignore
          // this.setCanvasUpdated();
        };

        this.wind.prerender();
      }
    }

    if (this.wind) {
      this.wind.render();
    }

    // 2D视图时可以省略
    this._addReFreshHandle();
    return this;
  }

  /**
   * 3D模式下手动刷新
   * @private
   */
  _addReFreshHandle () {
    if (!this.map) return;
    const type = this.map.getViewMode_();
    if (type.toLowerCase() === '3d') {
      this.layer_ && this.layer_.reFresh();
      AMap.Util.requestAnimFrame(this._addReFreshHandle);
    }
  }

  /**
   * get canvas layer
   */
  getCanvasLayer () {
    if (!this.canvas && !this.layer_) {
      const canvas = this.canvasFunction();
      const bounds = this._getBounds();

      const ops: {
        canvas: HTMLCanvasElement | null,
        bounds?: any;
        zooms?: [number, number];
        zIndex?: number;
        opacity?: number;
      } = {
        canvas: canvas,
        bounds: this.options.bounds || bounds,
      };

      if (this.options.zooms) {
        ops.zooms = this.options.zooms;
      }

      if ('zIndex' in this.options && typeof this.options.zIndex === 'number') {
        ops.zIndex = this.options.zIndex;
      }

      if ('opacity' in this.options && typeof this.options.opacity === 'number') {
        ops.opacity = this.options.opacity;
      }

      this.layer_ = new AMap.CanvasLayer(ops);
      this.map.on('mapmove', this.canvasFunction, this);
      this.map.on('zoomchange', this.canvasFunction, this);
      this.layer_.setMap(this.map);
    }
  }

  /**
   * canvas constructor
   * @returns {*}
   */
  canvasFunction () {
    const retina = AMap.Browser.retina;
    const [width, height]: [number, number] = [this.map.getSize().width, this.map.getSize().height];
    if (!this.canvas) {
      this.canvas = createCanvas(width, height, retina, null);
    } else {
      this.canvas.width = width * retina;
      this.canvas.height = height * retina;
      const bounds = this._getBounds();
      if (this.layer_) {
        this.layer_.setBounds(this.options.bounds || bounds);
      }
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
  _getBounds () {
    const type = this.map.getViewMode_();
    let [southWest, northEast] = [undefined, undefined];
    const bounds = this.map.getBounds();
    if (type.toLowerCase() === '2d') {
      northEast = bounds.getNorthEast(); // xmax ymax
      southWest = bounds.getSouthWest(); // xmin ymin
    } else {
      // TODO: 高德地图3D模式下目前返回的bounds顺序为左上-右上-右下-左下-左上
      const arrays = bounds.bounds.map((item: any) => {
        return [item.getLng(), item.getLat()];
      });
      // const extent = getExtent(arrays);
      southWest = new AMap.LngLat(...arrays[3]);
      northEast = new AMap.LngLat(...arrays[1]);
    }
    return new AMap.Bounds(southWest, northEast);
  }

  /**
   * remove layer
   */
  public removeLayer () {
    if (!this.map) return;
    this.layer_.setMap(null);
    this.map.off('resize', this.handleResize, this);
    this.map.off('mapmove', this.canvasFunction, this);
    this.map.off('zoomchange', this.canvasFunction, this);
    delete this.map;
    delete this.layer_;
    delete this.canvas;
  }

  public project(coordinate: [number, number]): [number, number] {
    const pixel = this.map.lngLatToContainer(new AMap.LngLat(...coordinate));
    return [
      pixel.x,
      pixel.y,
    ];
  }

  public intersectsCoordinate(coordinate: [number, number]): boolean {
    const mapExtent = this._getBounds();
    return mapExtent.contains(new AMap.LngLat(...coordinate)) as boolean;
    // return true;
  }

  /**
   * get canvas context
   * @returns {*}
   */
  private getContext () {
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
  public getData () {
    return this.field;
  }

  /**
   * set layer data
   * @param data
   * @returns {WindLayer}
   */
  public setData (data: any) {
    if (data && data instanceof Field) {
      this.field = data;
    } else if (isArray(data)) {
      this.field = formatData(data);
    } else {
      console.error('Illegal data');
    }

    if (this.map && this.canvas && this.field) {
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
    }
  }

  public getWindOptions() {
    return this.options.windOptions || {};
  }
}

const WindLayer = AMapWind;

export {
  Field,
  WindLayer,
};

export default AMapWind;
