import { Program, Renderer, RenderTarget } from '@sakitam-gis/vis-engine';
import Pass from './base';
import fillVert from '../../shaders/fill.vert.glsl';
import fillFrag from '../../shaders/fill.frag.glsl';
import * as shaderLib from '../../shaders/shaderLib';

/**
 * 在这里我们实现将所有瓦片绘制在 fbo 上以提升多世界渲染的边界接边效果
 * 在下一步再进行完整的着色
 */
export default class ComposePass extends Pass {
  readonly #program: Program;

  readonly prerender = true;

  #current: RenderTarget;
  #next: RenderTarget;

  constructor(id: string, renderer: Renderer, options = {}) {
    super(id, renderer, options);

    this.#program = new Program(renderer, {
      vertexShader: fillVert,
      fragmentShader: fillFrag,
      uniforms: {
        texture: {
          value: undefined,
        },
      },
      defines: ['RENDER_TYPE 1.0', 'USE_WGS84'],
      includes: shaderLib,
    });

    const opt = {
      width: 256,
      height: 256,
      minFilter: renderer.gl.NEAREST,
      magFilter: renderer.gl.NEAREST,
    };

    this.#current = new RenderTarget(renderer, opt);
    this.#next = new RenderTarget(renderer, opt);
  }

  /**
   * 此处绘制主要是合并瓦片
   * @param rendererParams
   * @param rendererState
   */
  render(rendererParams, rendererState) {
    if (rendererParams.target) {
      rendererParams.target.bind();
      this.renderer.setViewport(rendererParams.target.width, rendererParams.target.height);
    }

    const { tileManager } = this.options;

    if (tileManager) {
      const tiles = tileManager.getTiles();
      const len = tiles.length;
      let i = 0;
      for (; i < len; i++) {
        const tile = this.options.tileManager.getTileMesh(tiles[i].key);
        tile.draw();
      }
    }

    if (rendererParams.target) {
      rendererParams.target.unbind();
    }
  }
}
