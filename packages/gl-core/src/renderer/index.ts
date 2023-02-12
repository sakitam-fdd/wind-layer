import { DataTexture, Renderer, Scene, utils, Vector2 } from '@sakitam-gis/vis-engine';
import wgw from 'wind-gl-worker';
import TileManager from '../layer/tile/TileManager';
import Pipelines from './Pipelines';
import ComposePass from './pass/compose';
import MaskPass from './pass/mask';
import ColorizePass from './pass/colorize';
import { isFunction, resolveURL } from '../utils/common';
import { createLinearGradient, createZoom } from '../utils/style-parser';
import { DecodeType, getRenderType, LayerData, LayerDataType, RenderFrom } from '../type';

export interface ScalarFillOptions {
  /**
   * 获取当前视野内的瓦片
   */
  getViewTiles: (data: any) => any[];
  /**
   * 指定渲染通道
   */
  renderFrom?: RenderFrom;
  decodeType?: DecodeType;
  styleSpec?: {
    'fill-color': any[];
    opacity: number | any[];
  };
  getZoom?: () => number;
  opacity?: number;
  /**
   * 是否等待当前视野瓦片加载完成后再执行渲染
   */
  waitTilesLoaded?: boolean;
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

export const defaultOptions: ScalarFillOptions = {
  getViewTiles: () => [],
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
  waitTilesLoaded: false,
  onInit: () => undefined,
};

/**
 * 因为使用的是共享 worker 所以外部依赖仅需要注册一次
 */
let registerDeps = false;

export default class ScalarFill {
  private options: ScalarFillOptions;
  private uid: string;
  private renderPipeline: WithNull<Pipelines>;
  private tileManager: WithNull<TileManager>;
  private readonly scene: Scene;
  private readonly renderer: Renderer;
  private readonly dispatcher: any;

  #opacity: number;
  #colorRange: Vector2;
  #colorRampTexture: DataTexture;

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

    this.tileManager = new TileManager(this.renderer, this.scene, {
      dispatcher: this.dispatcher,
      decodeType: this.options.decodeType,
      renderFrom: this.options.renderFrom,
    });

    this.onTileChange = this.onTileChange.bind(this);

    this.tileManager.on('unload', this.onTileChange);
    this.tileManager.on('load', this.onTileChange);

    this.initialize();
  }

  initialize() {
    this.updateOptions({});
    this.renderPipeline = new Pipelines(this.renderer);
    const renderType = getRenderType(this.options.renderFrom ?? RenderFrom.r);
    const composePass = new ComposePass('compose', this.renderer, {
      tileManager: this.tileManager as TileManager,
      renderType,
      renderFrom: this.options.renderFrom ?? RenderFrom.r,
    });

    const textures = composePass.textures;

    const colorizePass = new ColorizePass('colorize', this.renderer, {
      texture: textures.current,
      textureNext: textures.next,
      renderType,
      hasMask: !!this.options.mask,
    });

    // 先执行瓦片合并，绘制在 fbo 中
    this.renderPipeline.addPass(composePass);
    if (this.options.mask) {
      // 掩膜处理
      const maskPass = new MaskPass('mask', this.renderer, {
        renderType,
      });
      this.renderPipeline.addPass(maskPass);
    }
    // 再执行着色
    this.renderPipeline.addPass(colorizePass);
  }

  updateOptions(options: Partial<ScalarFillOptions>) {
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

  /**
   * 设置数据
   * 目前设计的支持的数据类型：
   * 1. 瓦片链接，内部进行处理 xyz
   * 2. 单张数据图片
   * 3. jsonArray
   * @param data
   */
  setData(data: LayerData) {
    if (this.tileManager) {
      this.tileManager.setData(data);
      this.updateTiles();
      return true;
    }
    return Promise.reject(new Error('数据未更新成功！'));
  }

  /**
   * 获取数据
   */
  getData(): LayerData | void {
    return this.tileManager?.getData();
  }

  /**
   * 更新视野内的瓦片
   */
  updateTiles() {
    const tiles = this.options.getViewTiles(this.getData());
    this.tileManager?.update(tiles);
  }

  onTileChange() {
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

      const data = this.getData();

      if (data && data.type === LayerDataType.image) {
        state.dataRange = data.dataRange;
      }

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
    if (this.tileManager) {
      this.tileManager.off('unload', this.onTileChange);
      this.tileManager.off('load', this.onTileChange);
      this.tileManager.destroy();
      this.tileManager = null;
    }
  }
}
