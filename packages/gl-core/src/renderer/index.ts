import { DataTexture, Renderer, Scene, utils } from '@sakitam-gis/vis-engine';
import TileManager from '../tile/TileManager';
import { createLinearGradient, createZoom } from '../utils/style-parser';

enum RenderFrom {
  r = 'r',
  rg = 'rg',
  rgba = 'rgba',
}

export interface ScalarFillOptions {
  getViewTiles: () => any[];
  /**
   * 指定渲染通道
   */
  renderFrom?: RenderFrom;
  styleSpec?: {
    'fill-color': any[];
    opacity: number | any[];
  };
  getZoom?: () => number;
  opacity?: number;
  triggerRepaint?: () => void;
  displayRange?: [number, number];
  widthSegments?: number;
  heightSegments?: number;
  wireframe?: boolean;
}

export const defaultOptions: ScalarFillOptions = {
  renderFrom: RenderFrom.r,
  styleSpec: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'value'],
      0.0,
      '#3288bd',
      10,
      '#66c2a5',
      20,
      '#abdda4',
      30,
      '#e6f598',
      40,
      '#fee08b',
      50,
      '#fdae61',
      60,
      '#f46d43',
      100.0,
      '#d53e4f',
    ],
    opacity: 1,
  },
  displayRange: [Infinity, Infinity],
  widthSegments: 1,
  heightSegments: 1,
  wireframe: false,
};

export default class ScalarFill {
  private options: ScalarFillOptions;
  private opacity: number;
  private uid: string;
  private readonly scene: Scene;
  private readonly renderer: Renderer;
  private readonly tileManager: TileManager;

  constructor(rs: { renderer: Renderer; scene: Scene }, options?: Partial<ScalarFillOptions>) {
    this.renderer = rs.renderer;
    this.scene = rs.scene;

    if (!this.renderer) {
      throw new Error('initialize error');
    }

    this.uid = utils.uid('ScalarFill');

    if (!options) {
      // eslint-disable-next-line no-param-reassign
      options = {} as ScalarFillOptions;
    }

    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.opacity = this.options.opacity || 1;

    this.tileManager = new TileManager(this.renderer, this.scene, {});
  }

  updateOptions(options: Partial<ScalarFillOptions>) {
    this.options = {
      ...this.options,
      ...options,
    };

    this.buildColorRamp();

    if (typeof this.options.getZoom === 'function') {
      this.setOpacity(
        createZoom(this.uid, this.options.getZoom(), 'opacity', this.options.styleSpec, true),
      );
    }
  }

  setFillColor() {
    this.buildColorRamp();
  }

  setOpacity(opacity: number) {
    this.opacity = opacity;
  }

  handleZoom() {
    if (typeof this.options.getZoom === 'function') {
      this.setOpacity(
        createZoom(this.uid, this.options.getZoom(), 'opacity', this.options.styleSpec),
      );
    }
  }

  /**
   * 构建渲染所需色带
   * TODO: 这里我们需要支持渐变色和非渐变色
   */
  buildColorRamp() {
    const { data, colorRange } = createLinearGradient(
      [],
      this.options.styleSpec?.['fill-color'] as any[],
    );

    if (colorRange) {
      this.colorRange = colorRange;
    }

    if (data) {
      this.colorRampTexture = new DataTexture(this.renderer, {
        data,
        magFilter: this.renderer.gl.NEAREST,
        minFilter: this.renderer.gl.NEAREST,
        width: 255,
        height: 1,
      });
    }
  }

  getWorldCoordinate(coords: number[]): number[] {
    return coords;
  }

  setData() {}

  getData() {}

  render() {
    const tiles = this.options.getViewTiles();
    if (tiles) {
      let i = 0;
      const len = tiles.length;
      for (; i < len; i++) {
        const tile = this.tileManager.getTile(tiles[i].key);
        if (tile) {
          this.tileManager.update();
        } else {
          this.tileManager.addTile();
        }
      }
    }
  }

  destroy() {}
}
