import { DataTexture, Renderer, Scene, utils, Vector2 } from '@sakitam-gis/vis-engine';
import wgw from 'wind-gl-worker';
import Pipelines from './Pipelines';
import MaskPass from './pass/mask';
import ColorizeComposePass from './pass/color/compose';
import ColorizePass from './pass/color/colorize';
import RasterPass from './pass/raster/image';
import RasterComposePass from './pass/raster/compose';
import { isFunction, resolveURL } from '../utils/common';
import { createLinearGradient, createZoom } from '../utils/style-parser';
import { getRenderType, RenderFrom } from '../type';
import { SourceType } from '../source';
import Tile from '../tile/Tile';

const passes = {
  ColorizeComposePass,
  ColorizePass,
  RasterComposePass,
  RasterPass,
  MaskPass,
};

export interface LayerOptions {
  /**
   * 获取当前视野内的瓦片
   */
  getViewTiles: (data: any) => any[];

  renderPasses: string[];
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
  /**
   * 可以为任意 GeoJSON 数据
   */
  mask?: any;
  onInit?: (error, data) => void;
}

export const defaultOptions: LayerOptions = {
  getViewTiles: () => [],
  renderPasses: ['ColorizeComposePass', 'ColorizePass'],
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
  onInit: () => undefined,
};

/**
 * 因为使用的是共享 worker 所以外部依赖仅需要注册一次
 */
let registerDeps = false;

export default class Layer {
  private options: LayerOptions;
  private uid: string;
  private renderPipeline: WithNull<Pipelines>;
  private readonly scene: Scene;
  private readonly renderer: Renderer;
  private readonly dispatcher: any;
  private readonly source: SourceType;

  #opacity: number;
  #colorRange: Vector2;
  #colorRampTexture: DataTexture;
  #nextStencilID: number;

  constructor(
    source: SourceType,
    rs: { renderer: Renderer; scene: Scene },
    options?: Partial<LayerOptions>,
  ) {
    this.renderer = rs.renderer;
    this.scene = rs.scene;
    this.source = source;

    if (!this.renderer) {
      throw new Error('initialize error');
    }

    this.uid = utils.uid('ScalarFill');

    if (!options) {
      // eslint-disable-next-line no-param-reassign
      options = {} as LayerOptions;
    }

    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.#opacity = this.options.opacity || 1;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.dispatcher = new wgw.Dispatcher(wgw.getGlobalWorkerPool(), this, this.uid);

    if (!registerDeps) {
      const deps = wgw.getConfigDeps();
      this.dispatcher.broadcast(
        'configDeps',
        deps.map((d) => resolveURL(d)),
        (err, data) => {
          this.options.onInit?.(err, data);
        },
      );
      registerDeps = true;
    }

    this.update = this.update.bind(this);
    this.onTileLoaded = this.onTileLoaded.bind(this);

    this.source.prepare(this.renderer, this.dispatcher, {
      renderFrom: this.options.renderFrom ?? RenderFrom.r,
    });
    this.source.onAdd(this);
    if (Array.isArray(this.source.sourceCache)) {
      this.source.sourceCache.forEach((s) => {
        s.on('update', this.update);
        s.on('tileLoaded', this.onTileLoaded);
      });
    } else {
      this.source.sourceCache.on('update', this.update);
      this.source.sourceCache.on('tileLoaded', this.onTileLoaded);
    }

    this.initialize();
  }

  initialize() {
    this.updateOptions({});
    this.renderPipeline = new Pipelines(this.renderer);
    const renderType = getRenderType(this.options.renderFrom ?? RenderFrom.r);
    let textures;
    this.options.renderPasses.forEach((key) => {
      const opts = textures
        ? {
            texture: textures.current,
            textureNext: textures.next,
            hasMask: !!this.options.mask,
          }
        : {};
      const pass = new passes[key](key, this.renderer, {
        renderType,
        source: this.source,
        renderFrom: this.options.renderFrom ?? RenderFrom.r,
        stencilConfigForOverlap: this.stencilConfigForOverlap.bind(this),
        ...opts,
      });
      if (pass.prerender) {
        textures = pass.textures;
      }
      this.renderPipeline?.addPass(pass);
    });
  }

  updateOptions(options: Partial<LayerOptions>) {
    this.options = {
      ...this.options,
      ...options,
    };

    this.buildColorRamp();

    if (isFunction(this.options.getZoom)) {
      this.setOpacity(
        createZoom(this.uid, this.options.getZoom(), 'opacity', this.options.styleSpec, true),
      );
    }
  }

  resize() {
    if (this.renderPipeline) {
      const attr = this.renderer.attributes;
      this.renderPipeline.resize(this.renderer.width * attr.dpr, this.renderer.height * attr.dpr);
    }
  }

  setFillColor() {
    this.buildColorRamp();
  }

  setOpacity(opacity: number) {
    this.#opacity = opacity;
  }

  /**
   * 处理地图缩放事件
   */
  handleZoom() {
    if (isFunction(this.options.getZoom)) {
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
    if (!this.options.styleSpec?.['fill-color']) return;
    const { data, colorRange } = createLinearGradient(
      [],
      this.options.styleSpec?.['fill-color'] as any[],
    );

    if (colorRange) {
      this.#colorRange = new Vector2(...colorRange);
    }

    if (data) {
      this.#colorRampTexture = new DataTexture(this.renderer, {
        data,
        name: 'colorRampTexture',
        magFilter: this.renderer.gl.NEAREST,
        minFilter: this.renderer.gl.NEAREST,
        width: 255,
        height: 1,
      });
    }
  }

  clearStencil() {
    this.#nextStencilID = 1;
  }

  stencilConfigForOverlap(tiles: any[]): [{ [_: number]: any }, Tile[]] {
    const coords = tiles.sort((a, b) => b.overscaledZ - a.overscaledZ);
    const minTileZ = coords[coords.length - 1].overscaledZ;
    const stencilValues = coords[0].overscaledZ - minTileZ + 1;
    if (stencilValues > 1) {
      if (this.#nextStencilID + stencilValues > 256) {
        this.clearStencil();
      }
      const zToStencilMode = {};
      for (let i = 0; i < stencilValues; i++) {
        zToStencilMode[i + minTileZ] = {
          stencil: true,
          mask: 0xff,
          func: {
            cmp: this.renderer.gl.GEQUAL,
            ref: i + this.#nextStencilID,
            mask: 0xff,
          },
          op: {
            fail: this.renderer.gl.KEEP,
            zfail: this.renderer.gl.KEEP,
            zpass: this.renderer.gl.REPLACE,
          },
        };
      }
      this.#nextStencilID += stencilValues;
      return [zToStencilMode, coords];
    }
    return [
      {
        [minTileZ]: {
          stencil: false,
          mask: 0,
          func: {
            cmp: this.renderer.gl.ALWAYS,
            ref: 0,
            mask: 0,
          },
          op: {
            fail: this.renderer.gl.KEEP,
            zfail: this.renderer.gl.KEEP,
            zpass: this.renderer.gl.KEEP,
          },
        },
      },
      coords,
    ];
  }

  /**
   * 更新视野内的瓦片
   */
  update() {
    const tiles = this.options.getViewTiles(this.source);
    if (Array.isArray(this.source.sourceCache)) {
      this.source.sourceCache.forEach((s) => {
        s?.update(tiles);
      });
    } else {
      this.source.sourceCache?.update(tiles);
    }
  }

  onTileLoaded() {
    if (this.options.triggerRepaint && isFunction(this.options.triggerRepaint)) {
      this.options.triggerRepaint();
    }
  }

  prerender(cameras) {
    if (this.renderPipeline) {
      this.renderPipeline.prerender(
        {
          scene: this.scene,
          cameras,
        },
        {
          opacity: this.#opacity,
          colorRange: this.#colorRange,
          colorRampTexture: this.#colorRampTexture,
        },
      );
    }
  }

  render(cameras) {
    if (this.renderPipeline) {
      const state: any = {
        opacity: this.#opacity,
        colorRange: this.#colorRange,
        colorRampTexture: this.#colorRampTexture,
        displayRange: this.options.displayRange,
        useDisplayRange: Boolean(this.options.displayRange),
      };

      this.renderPipeline.render(
        {
          scene: this.scene,
          cameras,
        },
        state,
      );
    }
  }

  /**
   * 销毁此 Renderer
   */
  destroy() {
    if (this.renderPipeline) {
      this.renderPipeline.destroy();
      this.renderPipeline = null;
    }
    if (this.source) {
      if (Array.isArray(this.source.sourceCache)) {
        this.source.sourceCache.forEach((s) => {
          s.off('update', this.update);
          s.off('tileLoaded', this.onTileLoaded);
        });
      } else {
        this.source.sourceCache.off('update', this.update);
        this.source.sourceCache.off('tileLoaded', this.onTileLoaded);
      }
      this.source.destroy();
    }
  }
}
