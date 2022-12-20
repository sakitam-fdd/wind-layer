import { Program, Renderer, RenderTarget } from '@sakitam-gis/vis-engine';
import Pass from './base';
import fillVert from '../../shaders/fill.vert.glsl';
import fillFrag from '../../shaders/fill.frag.glsl';
import * as shaderLib from '../../shaders/shaderLib';

/**
 * 在这里我们实现将所有瓦片绘制在 fbo 上以提升多世界渲染的边界接边问题
 * 在下一步再进行完整的着色
 */
export default class ComposePass extends Pass {
  readonly #program: Program;

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

  render(rendererParams, rendererState) {
    if (rendererParams.target) {
      rendererParams.target.bind();
      this.renderer.setViewport(rendererParams.target.width, rendererParams.target.height);
    }

    const { tiles } = rendererState;

    this.options.tileManager.update(tiles);

    const len = tiles.length;
    let i = 0;
    for (; i < len; i++) {
      const tile = this.options.tileManager.getTile(tiles[i].key);

    }

    if (rendererParams.target) {
      rendererParams.target.unbind();
    }
  }
}
