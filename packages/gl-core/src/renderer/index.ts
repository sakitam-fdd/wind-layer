import {
  Attributes,
  DataTexture,
  Raf,
  Renderer,
  Scene,
  utils,
  Vector2,
} from '@sakitam-gis/vis-engine';
import wgw from 'wind-gl-worker';
import Pipelines from './Pipelines';
import ColorizeComposePass from './pass/color/compose';
import ColorizePass from './pass/color/colorize';
import RasterPass from './pass/raster/image';
import RasterComposePass from './pass/raster/compose';
import ParticlesComposePass from './pass/particles/compose';
import UpdatePass from './pass/particles/update';
import ScreenPass from './pass/particles/screen';
import ParticlesPass from './pass/particles/particles';
import PickerPass from './pass/picker';
import { isFunction } from '../utils/common';
import { createLinearGradient, createZoom } from '../utils/style-parser';
import { getBandType, RenderFrom, RenderType, MaskType } from '../type';
import { SourceType } from '../source';
import Tile from '../tile/Tile';
import TileID from '../tile/TileID';
import MaskPass from "./pass/mask";

export interface BaseLayerOptions {
  /**
   * 获取当前视野内的瓦片
   */
  getViewTiles: (data: any, renderType: RenderType) => TileID[];

  /**
   * 渲染类型
   * 目前支持三种类型：
   * 0：普通 raster 瓦片渲染
   * 1：气象数据的色斑图渲染
   * 2：风等 vector 数据的粒子渲染
   */
  renderType: RenderType;
  /**
   * 指定渲染通道
   */
  renderFrom?: RenderFrom;
  styleSpec?: {
    'fill-color'?: any[];
    opacity?: number | any[];
    numParticles?: number | any[];
    speedFactor?: number | any[];
    fadeOpacity?: number | any[];
    dropRate?: number | any[];
    dropRateBump?: number | any[];
  };
  getZoom?: () => number;
  getExtent?: () => number[];
  opacity?: number;
  triggerRepaint?: () => void;
  displayRange?: [number, number];
  widthSegments?: number;
  heightSegments?: number;
  wireframe?: boolean;
  /**
   * 是否开启拾取
   */
  picking?: boolean;
  /**
   * 可以为任意 GeoJSON 数据
   */
  mask?: {
    data: Attributes[];
    type: MaskType;
  };
  onInit?: (error, data) => void;
}

export const defaultOptions: BaseLayerOptions = {
  getViewTiles: () => [],
  renderType: RenderType.colorize,
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
    numParticles: 65535,
    speedFactor: 1,
    fadeOpacity: 0.93,
    dropRate: 0.003,
    dropRateBump: 0.002,
  },
  displayRange: [Infinity, Infinity],
  widthSegments: 1,
  heightSegments: 1,
  wireframe: false,
  onInit: () => undefined,
};

export default class BaseLayer {
  private options: BaseLayerOptions;
  private readonly uid: string;
  private renderPipeline: WithNull<Pipelines>;
  private readonly scene: Scene;
  private readonly renderer: Renderer;
  private readonly dispatcher: any;
  private readonly source: SourceType;
  private raf: Raf;
  private sharedState: {
    u_bbox: [number, number, number, number];
    u_data_bbox: [number, number, number, number];
    u_scale: [number, number];
  };

  #opacity: number;
  #numParticles: number;
  #speedFactor: number;
  #fadeOpacity: number;
  #dropRate: number;
  #dropRateBump: number;
  #colorRange: Vector2;
  #colorRampTexture: DataTexture;
  #nextStencilID: number;
  #maskPass: MaskPass;

  constructor(
    source: SourceType,
    rs: { renderer: Renderer; scene: Scene },
    options?: Partial<BaseLayerOptions>,
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
      options = {} as BaseLayerOptions;
    }

    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.#opacity = this.options.opacity || 1;

    this.#nextStencilID = 1;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.dispatcher = new wgw.Dispatcher(wgw.getGlobalWorkerPool(), this, this.uid);

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
    this.sharedState = {
      u_bbox: [0, 0, 1, 1],
      u_data_bbox: [0, 0, 1, 1],
      u_scale: [1, 1],
    };
    this.renderPipeline = new Pipelines(this.renderer);
    const bandType = getBandType(this.options.renderFrom ?? RenderFrom.r);

    if (this.options.mask) {
      this.#maskPass = new MaskPass('MaskPass', this.renderer, {
        mask: this.options.mask,
      });
    }

    if (this.options.renderType === RenderType.image) {
      const composePass = new RasterComposePass('RasterComposePass', this.renderer, {
        bandType,
        source: this.source,
        renderFrom: this.options.renderFrom ?? RenderFrom.r,
        maskPass: this.#maskPass,
        stencilConfigForOverlap: this.stencilConfigForOverlap.bind(this),
      });
      const rasterPass = new RasterPass('RasterPass', this.renderer, {
        bandType,
        source: this.source,
        texture: composePass.textures.current,
        textureNext: composePass.textures.next,
      });
      this.renderPipeline?.addPass(composePass);
      if (this.options.picking) {
        const pickerPass = new PickerPass('PickerPass', this.renderer, {
          source: this.source,
          texture: composePass.textures.current,
          textureNext: composePass.textures.next,
          useFloatTexture: false,
        });
        this.renderPipeline?.addPass(pickerPass);
      }
      this.renderPipeline?.addPass(rasterPass);
    } else if (this.options.renderType === RenderType.colorize) {
      const composePass = new ColorizeComposePass('ColorizeComposePass', this.renderer, {
        bandType,
        source: this.source,
        renderFrom: this.options.renderFrom ?? RenderFrom.r,
        maskPass: this.#maskPass,
        stencilConfigForOverlap: this.stencilConfigForOverlap.bind(this),
      });
      const colorizePass = new ColorizePass('ColorizePass', this.renderer, {
        bandType,
        source: this.source,
        texture: composePass.textures.current,
        textureNext: composePass.textures.next,
      });
      this.renderPipeline?.addPass(composePass);

      if (this.options.picking) {
        const pickerPass = new PickerPass('PickerPass', this.renderer, {
          source: this.source,
          texture: composePass.textures.current,
          textureNext: composePass.textures.next,
          useFloatTexture: true,
        });
        this.renderPipeline?.addPass(pickerPass);
      }

      this.renderPipeline?.addPass(colorizePass);
    } else if (this.options.renderType === RenderType.particles) {
      const composePass = new ParticlesComposePass('ParticlesComposePass', this.renderer, {
        bandType,
        source: this.source,
        renderFrom: this.options.renderFrom ?? RenderFrom.r,
        stencilConfigForOverlap: this.stencilConfigForOverlap.bind(this),
      });
      this.renderPipeline?.addPass(composePass);

      const updatePass = new UpdatePass('UpdatePass', this.renderer, {
        bandType,
        source: this.source,
        texture: composePass.textures.current,
        textureNext: composePass.textures.next,
        getParticleNumber: () => this.#numParticles,
      });
      this.renderPipeline?.addPass(updatePass);

      const particlesPass = new ParticlesPass('ParticlesPass', this.renderer, {
        bandType,
        source: this.source,
        texture: composePass.textures.current,
        textureNext: composePass.textures.next,
        getParticles: () => updatePass.textures,
        getParticleNumber: () => this.#numParticles,
        maskPass: this.#maskPass,
      });

      const particlesTexturePass = new ScreenPass('ParticlesTexturePass', this.renderer, {
        bandType,
        source: this.source,
        prerender: true,
        enableBlend: false,
        particlesPass,
      });

      this.renderPipeline?.addPass(particlesTexturePass);
      this.renderPipeline?.addPass(particlesPass);

      const screenPass = new ScreenPass('ScreenPass', this.renderer, {
        bandType,
        source: this.source,
        prerender: false,
        enableBlend: true,
        particlesPass,
      });

      this.renderPipeline?.addPass(screenPass);

      this.raf = new Raf(
        () => {
          if (this.options.triggerRepaint) {
            this.options.triggerRepaint();
          }
        },
        { autoStart: true },
      );
    }
  }

  updateOptions(options: Partial<BaseLayerOptions>) {
    this.options = {
      ...this.options,
      ...options,
      styleSpec: {
        ...this.options.styleSpec,
        ...options?.styleSpec,
      },
    };

    this.buildColorRamp();
    this.parseStyleSpec(true);
  }

  resize(width: number, height: number) {
    if (this.renderPipeline) {
      this.renderPipeline.resize(width, height);
    }
  }

  /**
   * 设置填色色阶
   */
  setFillColor() {
    this.buildColorRamp();
  }

  /**
   * 设置图层透明度
   * @param opacity
   */
  setOpacity(opacity: number) {
    this.#opacity = opacity;
  }

  /**
   * 设置粒子图层的粒子数量
   * @param numParticles
   */
  setNumParticles(numParticles: number) {
    this.#numParticles = numParticles;
  }

  /**
   * 设置粒子图层的粒子数量
   * @param speedFactor
   */
  setSpeedFactor(speedFactor: number) {
    this.#speedFactor = speedFactor;
  }

  /**
   * 设置粒子图层的粒子数量
   * @param fadeOpacity
   */
  setFadeOpacity(fadeOpacity: number) {
    this.#fadeOpacity = fadeOpacity;
  }

  /**
   * 设置粒子图层的粒子数量
   * @param dropRate
   */
  setDropRate(dropRate: number) {
    this.#dropRate = dropRate;
  }

  /**
   * 设置粒子图层的粒子数量
   * @param dropRateBump
   */
  setDropRateBump(dropRateBump: number) {
    this.#dropRateBump = dropRateBump;
  }

  /**
   * 解析样式配置
   * @param clear
   */
  parseStyleSpec(clear) {
    if (isFunction(this.options.getZoom)) {
      const zoom = this.options.getZoom();
      this.setOpacity(createZoom(this.uid, zoom, 'opacity', this.options.styleSpec, clear));
      if (this.options.renderType === RenderType.particles) {
        this.setNumParticles(
          createZoom(this.uid, zoom, 'numParticles', this.options.styleSpec, clear),
        );
        this.setFadeOpacity(
          createZoom(this.uid, zoom, 'fadeOpacity', this.options.styleSpec, clear),
        );
        this.setSpeedFactor(
          createZoom(this.uid, zoom, 'speedFactor', this.options.styleSpec, clear),
        );
        this.setDropRate(createZoom(this.uid, zoom, 'dropRate', this.options.styleSpec, clear));
        this.setDropRateBump(
          createZoom(this.uid, zoom, 'dropRateBump', this.options.styleSpec, clear),
        );
      }
    }
  }

  /**
   * 处理地图缩放事件
   */
  handleZoom() {
    this.parseStyleSpec(false);
  }

  /**
   * 构建渲染所需色带
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
          // 禁止写入
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

  moveStart() {
    if (this.renderPipeline && this.options.renderType === RenderType.particles) {
      const particlesPass = this.renderPipeline.getPass('ParticlesPass');

      if (particlesPass) {
        particlesPass.resetParticles();
      }

      this.renderPipeline.passes.forEach((pass) => {
        if (pass.id === 'ParticlesTexturePass' || pass.id === 'ScreenPass') {
          pass.enabled = false;
        }
        if (pass.id === 'ParticlesPass') {
          pass.prerender = false;
        }
      });
    }
  }

  moveEnd() {
    if (this.renderPipeline && this.options.renderType === RenderType.particles) {
      const updatePass = this.renderPipeline.getPass('UpdatePass');

      if (updatePass) {
        // updatePass.initializeRenderTarget();
        updatePass.setInitialize(true);
      }

      this.renderPipeline.passes.forEach((pass) => {
        if (pass.id === 'ParticlesTexturePass' || pass.id === 'ScreenPass') {
          pass.enabled = true;
        }

        if (pass.id === 'ParticlesPass') {
          pass.prerender = true;
          // pass.resetParticles();
        }
      });
    }
  }

  /**
   * 更新视野内的瓦片
   */
  update() {
    const tiles = this.options.getViewTiles(this.source, this.options.renderType);
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

  setMask(mask: BaseLayerOptions['mask']) {
    this.options.mask = mask;

    if (this.options.mask) {
      if (!this.#maskPass) {
        this.#maskPass = new MaskPass('MaskPass', this.renderer, {
          mask: this.options.mask,
        });
      }

      this.#maskPass.updateGeometry();

      this.options?.triggerRepaint?.();
    }
  }

  async picker(pixel = [0, 0]) {
    if (!this.renderPipeline) return null;
    const pickerPass = this.renderPipeline.getPass('PickerPass');
    if (!pickerPass) return null;
    return pickerPass.render(undefined, undefined, pixel);
  }

  prerender(cameras) {
    if (this.renderPipeline) {
      this.renderPipeline.prerender(
        {
          scene: this.scene,
          cameras,
        },
        {
          zoom: this.options?.getZoom?.() ?? 0,
          extent: this.options?.getExtent?.(),
          opacity: this.#opacity,
          fadeOpacity: this.#fadeOpacity,
          numParticles: this.#numParticles,
          colorRange: this.#colorRange,
          colorRampTexture: this.#colorRampTexture,
          sharedState: this.sharedState,
          u_drop_rate: this.#dropRate,
          u_drop_rate_bump: this.#dropRateBump,
          u_speed_factor: this.#speedFactor,
        },
      );
    }
  }

  render(cameras) {
    if (this.renderPipeline) {
      const state: any = {
        zoom: this.options?.getZoom?.() ?? 0,
        extent: this.options?.getExtent?.(),
        opacity: this.#opacity,
        fadeOpacity: this.#fadeOpacity,
        numParticles: this.#numParticles,
        colorRange: this.#colorRange,
        colorRampTexture: this.#colorRampTexture,
        displayRange: this.options.displayRange,
        useDisplayRange: Boolean(this.options.displayRange),
        sharedState: this.sharedState,
        u_drop_rate: this.#dropRate,
        u_drop_rate_bump: this.#dropRateBump,
        u_speed_factor: this.#speedFactor,
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
    if (this.raf) {
      this.raf.stop();
    }
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
