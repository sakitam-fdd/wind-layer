import WindCore, {
  Field,
  isArray,
  formatData,
  warnLog,
  assign,
  defaultOptions,
  createCanvas,
  IOptions,
} from 'wind-core';

import ol, { olx } from 'openlayers';

export interface IWindOptions extends IOptions {
  opacity?: number;
  map?: ol.Map;
  visible?: boolean;
  extent?: ol.Extent;
  minResolution?: number;
  maxResolution?: number;
  zIndex?: number;
  windOptions: Partial<IOptions>;
  [key: string]: any;
}

// const G = typeof window === 'undefined' ? global : window;

const _options = {
  windOptions: {},
};

// @ts-ignore
// const ol = G?.ol;
//
// if (!ol) {
//   throw new Error('Before using this plugin, you must first introduce the openlayers <https://openlayers.org/>');
// }

class OlWind extends ol.layer.Image {
  private options: IWindOptions;
  private canvas: HTMLCanvasElement;
  private wind: WindCore | null;
  private field: Field | undefined;
  public viewProjection: ol.ProjectionLike;
  public pixelRatio: number;
  private map: ol.Map;
  private type: string;

  constructor (data: any, options: Partial<IWindOptions> = {}) {
    const opt = assign({}, _options, options);
    // @ts-ignore
    super(options);
    this.options = opt;

    /**
     * windy layer
     * @type {null}
     */
    this.wind = null;

    this.type = 'IMAGE';

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    this.pickWindOptions();

    const sourceOptions = {
      logo: options.logo as string,
      state: options.state,
      attributions: options.attributions,
      resolutions: options.resolutions,
      canvasFunction: this.canvasFunction.bind(this),
      ratio: (options.hasOwnProperty('ratio') ? options.ratio : 1)
    } as olx.source.ImageCanvasOptions;

    const source = new ol.source.ImageCanvas(sourceOptions);

    // @ts-ignore
    if (!source.getAttributions2) {
      // FIXED: when use webpack throw exception
      // @ts-ignore
      source.getAttributions2 = () => source.getAttributions();
    }

    this.setSource(source);

    if (data) {
      this.setData(data);
    }
  }

  /**
   * append layer to map
   * @param map
   */
  public appendTo (map: ol.Map) {
    if (map) {
      this.setMap(map);
    } else {
      throw new Error('not map object');
    }
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

  public canvasFunction (
    extent: ol.Extent,
    resolution: number,
    pixelRatio: number,
    size: ol.Size,
    proj: ol.proj.Projection,
  ): HTMLCanvasElement {
    this.pixelRatio = pixelRatio;
    if (!this.canvas) {
      this.canvas = createCanvas(size[0], size[1], 1, null);
    } else {
      this.canvas.width = size[0];
      this.canvas.height = size[1];
    }

    if (this.canvas) {
      this.render(this.canvas);
    }

    return this.canvas;
  }

  private getContext () {
    if (this.canvas === null) return;
    return this.canvas.getContext('2d');
  }

  /**
   * render windy layer
   * @param canvas
   * @returns {OlWind}
   */
  private render (canvas: HTMLCanvasElement) {
    const map = this.getMap();
    if (!this.getData() || !map) return this;
    const opt = this.getWindOptions();
    if (canvas && !this.wind) {
      const data = this.getData();

      const ctx = this.getContext();

      if (ctx) {
        this.wind = new WindCore(ctx, opt, data);

        this.wind.project = this.project.bind(this);
        // this.wind.intersectsCoordinate = this.intersectsCoordinate.bind(this);
        this.wind.intersectsCoordinate = () => true;
        this.wind.postrender = () => {
          this.changed();
        };

        this.wind.prerender();
      }
    }

    if (this.wind) {
      if ('generateParticleOption' in opt) {
        const flag = typeof opt.generateParticleOption === 'function' ? opt.generateParticleOption() : opt.generateParticleOption;
        flag && this.wind.prerender();
      }

      this.wind.render();
    }

    return this;
  }

  public project(coordinate: [number, number]): [number, number] {
    const map = this.getMap();
    const pixel = map.getPixelFromCoordinate(ol.proj.transform(coordinate, 'EPSG:4326', this.viewProjection));
    return [
      pixel[0] * this.pixelRatio,
      pixel[1] * this.pixelRatio,
    ];
  }

  /**
   * TODO: 空间判断出错，需要修复
   * @param coordinate
   */
  public intersectsCoordinate(coordinate: [number, number]): boolean {
    const map = this.getMap();
    if (!map) return false;
    const view = map.getView();
    const size = map.getSize();
    if (view && size) {
      const extent = view.calculateExtent([
        size[0] * this.pixelRatio,
        size[1] * this.pixelRatio,
      ]);
      return ol.extent.containsCoordinate(extent, ol.proj.transform(coordinate, 'EPSG:4326', this.viewProjection));
    }
    return false;
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
   * @returns {OlWind}
   */
  public setData (data: any) {
    if (data && data.checkFields && data.checkFields()) {
      this.field = data;
    } else if (isArray(data)) {
      this.field = formatData(data);
    } else {
      console.error('Illegal data');
    }

    const map = this.getMap();

    if (map && this.canvas && this.field) {
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

  private getProjection () {
    let projection;
    const map = this.getMap();
    // tslint:disable-next-line: prefer-conditional-expression
    if (map) {
      projection = map.getView() && map.getView().getProjection();
    } else {
      projection = 'EPSG:3857';
    }
    return projection;
  }

  /**
   * set map
   * @param map
   */
  public setMap (map: ol.Map) {
    this.set('originMap', map);
    this.viewProjection = this.getProjection();
    return super.setMap(map);
  }

  /**
   * get map
   */
  public getMap () {
    return this.get('originMap');
  }

  public getType() {
    return this.type;
  }
}

const WindLayer = OlWind;

export {
  Field,
  WindLayer,
};

export default OlWind;
