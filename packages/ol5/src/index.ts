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

import { Map } from 'ol';
import { Size as ISize } from 'ol/size';
import { Extent as IExtent, containsCoordinate } from 'ol/extent';
import { Image as ImageLayer } from 'ol/layer';
import { ProjectionLike as IProjection } from 'ol/proj';
import ImageCanvas, { Options as ImageCanvasOptions } from 'ol/source/ImageCanvas';

export interface IWindOptions extends IOptions {
  opacity?: number;
  map?: Map;
  visible?: boolean;
  extent?: IExtent;
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

class OlWind extends ImageLayer {
  private options: IWindOptions;
  private canvas: HTMLCanvasElement;
  private wind: WindCore | null;
  private field: Field | undefined;
  private map: any;

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

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.rerender = this.rerender.bind(this);

    this.pickWindOptions();

    const sourceOptions = {
      logo: options.logo as string,
      state: options.state,
      attributions: options.attributions,
      resolutions: options.resolutions,
      canvasFunction: this.canvasFunction.bind(this),
      // projection: (options.hasOwnProperty('projection') ? options.projection : 'EPSG:3857'),
      ratio: (options.hasOwnProperty('ratio') ? options.ratio : 1)
    } as ImageCanvasOptions;

    this.setSource(new ImageCanvas(sourceOptions));

    // @ts-ignore
    this.on('precompose', this.rerender);

    if (data) {
      this.setData(data);
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
    extent: IExtent,
    resolution: number,
    pixelRatio: number,
    size: ISize,
    proj: IProjection
  ): HTMLCanvasElement {
    if (!this.canvas) {
      this.canvas = createCanvas(size[0], size[1], pixelRatio, null);
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
   * @returns {BMapWind}
   */
  private render (canvas: HTMLCanvasElement) {
    if (!this.getData() || !this.map) return this;
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

    return this;
  }

  private rerender() {
    if (this.wind) {
      this.wind.render();
    }
  }

  public project(coordinate: [number, number]): [number, number] {
    return this.map.getCoordinateFromPixel(coordinate);
  }

  public intersectsCoordinate(coordinate: [number, number]): boolean {
    const view = this.map.getView();
    const size = this.map.getSize();
    if (view && size) {
      const extent = view.calculateExtent(size);
      return containsCoordinate(extent, coordinate);
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
   * @returns {BMapWind}
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

  /**
   * set map
   * @param map
   */
  public setMap (map: any) {
    this.set('originMap', map);
    // ol.layer.Image.prototype.setMap.call(this, map)
  }

  /**
   * get map
   */
  public getMap () {
    return this.get('originMap');
  }
}

const WindLayer = OlWind;

export {
  Field,
  WindLayer,
};

export default OlWind;
