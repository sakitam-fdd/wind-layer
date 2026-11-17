import type { Renderer, Texture } from '@sakitam-gis/vis-engine';
import { Program, Mesh, Geometry, RenderTarget } from '@sakitam-gis/vis-engine';
import Pass from './base';
import vert from '../../shaders/picker.vert.glsl';
import frag from '../../shaders/picker.frag.glsl';
import * as shaderLib from '../../shaders/shaderLib';
import { decodeHalfFloat, getFloatTextureOptions, resolvePickerPixel } from '../../utils/common';
import type { SourceType } from '../../source';

// OES_texture_half_float.HALF_FLOAT_OES（WebGL1），与 WebGL2 的 gl.HALF_FLOAT(0x140B) 取值不同
const HALF_FLOAT_OES = 0x8d61;

export interface PickerPassOptions {
  source: SourceType;
  texture: Texture;
  textureNext: Texture;
  useFloatTexture?: boolean;
}

/**
 * picking
 */
export default class PickerPass extends Pass<PickerPassOptions> {
  readonly prerender = true;

  #program: WithNull<Program>;
  #mesh: WithNull<Mesh>;
  #geometry: WithNull<Geometry>;
  #picker: WithNull<RenderTarget>;

  #rendererParams: any;
  #rendererState: any;
  #supportFloat: boolean;
  /** 浮点 FBO 的像素读取类型（FLOAT 或 HALF_FLOAT），首次拾取时惰性检测 */
  #floatReadType?: number;

  constructor(id: string, renderer: Renderer, options: PickerPassOptions = {} as PickerPassOptions) {
    super(id, renderer, options);

    this.#program = new Program(renderer, {
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        u_fade_t: {
          value: 0,
        },
        u_texture: {
          value: this.options.texture,
        },
        u_textureNext: {
          value: this.options.textureNext,
        },
      },
      includes: shaderLib,
      transparent: true,
    });

    this.#geometry = new Geometry(renderer, {
      position: {
        size: 2,
        data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
      },
      uv: {
        size: 2,
        data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
      },
      index: {
        size: 1,
        data: new Uint16Array([0, 1, 2, 2, 1, 3]),
      },
    });

    this.#mesh = new Mesh(renderer, {
      mode: renderer.gl.TRIANGLES,
      program: this.#program,
      geometry: this.#geometry,
    });

    // @link https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
    const opt: any = {
      width: this.renderer.width,
      height: this.renderer.height,
      minFilter: renderer.gl.NEAREST,
      magFilter: renderer.gl.NEAREST,
      type: this.renderer.gl.UNSIGNED_BYTE,
      format: this.renderer.gl.RGBA,
      generateMipmaps: false,
      internalFormat: this.renderer.gl.RGBA,
      stencil: false,
    };

    if (options.useFloatTexture) {
      const floatOpts = getFloatTextureOptions(renderer);
      opt.type = floatOpts.type;
      opt.format = floatOpts.format;
      opt.internalFormat = floatOpts.internalFormat;
      this.#supportFloat = floatOpts.supportFloat;
      if (!floatOpts.supportFloat) {
        console.warn(
          '[wind-gl-core]: float render target is not supported, picker will return raw Uint8Array RGBA values.',
        );
      }
    } else {
      this.#supportFloat = false;
    }

    this.#picker = new RenderTarget(renderer, {
      ...opt,
      name: 'pickerRenderTargetTexture',
    });
  }

  resize(width: number, height: number) {
    this.#picker?.resize(width, height);
  }

  /**
   * 渲染拾取 FBO 并读取像素
   *
   * - 管线每帧调用时不传 `pixel`：只缓存最新的 rendererParams / rendererState，不做绘制（拾取是按需触发的，
   *   每帧绘制一次全屏浮点 FBO 没有意义）
   * - 通过 `layer.picker` 按需调用时传入 `pixel`：使用缓存的参数绘制并读取
   *
   * @param rendererParams
   * @param rendererState
   * @param pixel 相对地图容器左上角的 CSS 像素坐标
   * @param viewportSize 地图容器 CSS 尺寸，用于映射到 FBO 物理像素；缺省时使用 canvas.clientWidth/clientHeight
   */
  render(
    rendererParams = this.#rendererParams,
    rendererState = this.#rendererState,
    pixel?: [number, number],
    viewportSize?: [number, number],
  ) {
    return new Promise<Float32Array | Uint8Array | null>((resolve) => {
      this.#rendererParams = rendererParams;
      this.#rendererState = rendererState;

      if (!pixel) return resolve(null);
      if (!this.#picker || !this.#mesh || !rendererState || !rendererParams?.cameras?.planeCamera) {
        return resolve(null);
      }

      const canvas = this.renderer.gl.canvas as HTMLCanvasElement;
      const effectiveViewportSize: [number, number] =
        Array.isArray(viewportSize) && viewportSize[0] > 0 && viewportSize[1] > 0
          ? viewportSize
          : [canvas?.clientWidth || this.#picker.width, canvas?.clientHeight || this.#picker.height];
      const targetPixel = resolvePickerPixel(pixel, effectiveViewportSize, [this.#picker.width, this.#picker.height]);
      if (!targetPixel) return resolve(null);

      const camera = rendererParams.cameras.planeCamera;
      this.#picker.clear();
      this.#picker.bind();
      this.renderer.setViewport(this.#picker.width, this.#picker.height);

      this.#mesh.program.setUniform('u_fade_t', this.options.source?.getFadeTime?.() || 0);
      this.#mesh.updateMatrix();
      this.#mesh.worldMatrixNeedsUpdate = false;
      this.#mesh.worldMatrix.multiply(camera.worldMatrix, this.#mesh.localMatrix);
      this.#mesh.draw({
        ...rendererParams,
        camera,
      });

      const result = this.#readPixel(targetPixel[0], targetPixel[1]);
      this.#picker.unbind();
      resolve(result);
    });
  }

  /**
   * 读取单个像素（调用时拾取 FBO 必须处于绑定状态）
   *
   * 浮点 FBO 的读取策略：
   * 1. 优先使用实现推荐的 IMPLEMENTATION_COLOR_READ_FORMAT/TYPE（核心规范保证该组合对当前 FBO 一定合法）
   *    - RGBA + FLOAT：直接读取
   *    - RGBA + HALF_FLOAT(_OES)：读取为 Uint16Array 后按 IEEE 754 binary16 解码（部分 iOS WebGL1 只支持这种方式）
   * 2. 其它情况回退到 RGBA + FLOAT（WEBGL_color_buffer_float / EXT_color_buffer_float /
   *    EXT_color_buffer_half_float 均规定浮点颜色缓冲可用该组合读取）
   * FBO 的内部格式在生命周期内不变（resize 不改变格式），因此读取方式只需检测一次。
   */
  #readPixel(x: number, y: number): Float32Array | Uint8Array {
    const gl = this.renderer.gl;

    if (!this.options.useFloatTexture || !this.#supportFloat) {
      // 非浮点 FBO（raster 拾取，或设备不支持浮点渲染时的降级），返回 0-255 的原始 RGBA
      const a = new Uint8Array(4);
      gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, a);
      return a;
    }

    if (this.#floatReadType === undefined) {
      const implFormat = gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_FORMAT);
      const implType = gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_TYPE);
      const isHalfFloat = implType === (gl as WebGL2RenderingContext).HALF_FLOAT || implType === HALF_FLOAT_OES;
      this.#floatReadType = implFormat === gl.RGBA && isHalfFloat ? implType : gl.FLOAT;
    }

    if (this.#floatReadType !== gl.FLOAT) {
      const raw = new Uint16Array(4);
      gl.readPixels(x, y, 1, 1, gl.RGBA, this.#floatReadType as number, raw);
      return new Float32Array([
        decodeHalfFloat(raw[0]),
        decodeHalfFloat(raw[1]),
        decodeHalfFloat(raw[2]),
        decodeHalfFloat(raw[3]),
      ]);
    }

    const a = new Float32Array(4);
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.FLOAT, a);
    return a;
  }

  destroy() {
    if (this.#mesh) {
      this.#mesh.destroy();
      this.#mesh = null;
    }

    if (this.#program) {
      this.#program.destroy();
      this.#program = null;
    }

    if (this.#geometry) {
      this.#geometry.destroy();
      this.#geometry = null;
    }

    if (this.#picker) {
      this.#picker.destroy();
      this.#picker = null;
    }
  }
}
