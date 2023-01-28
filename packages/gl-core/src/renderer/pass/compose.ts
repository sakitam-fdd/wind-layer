import { utils, Program, Renderer, RenderTarget } from '@sakitam-gis/vis-engine';
import Pass from './base';
import vert from '../../shaders/compose.vert.glsl';
import frag from '../../shaders/compose.frag.glsl';
import * as shaderLib from '../../shaders/shaderLib';
import TileManager from '../../layer/tile/TileManager';
import { TileState } from '../../layer/tile/Tile';

export interface ComposePassOptions {
  tileManager: TileManager;
}

/**
 * 在这里我们实现将所有瓦片绘制在 fbo 上以提升多世界渲染的边界接边效果
 * 在下一步再进行完整的着色
 */
export default class ComposePass extends Pass<ComposePassOptions> {
  readonly #program: Program;

  readonly prerender = true;

  #current: RenderTarget;
  #next: RenderTarget;

  constructor(
    id: string,
    renderer: Renderer,
    options: ComposePassOptions = {} as ComposePassOptions,
  ) {
    super(id, renderer, options);

    this.#program = new Program(renderer, {
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        texture: {
          value: undefined,
        },
      },
      defines: ['RENDER_TYPE 1.0', 'USE_WGS84'],
      includes: shaderLib,
    });

    const opt = {
      width: this.renderer.width,
      height: this.renderer.height,
      minFilter: renderer.gl.NEAREST,
      magFilter: renderer.gl.NEAREST,
      type: this.renderer.gl.FLOAT,
    };

    this.#current = new RenderTarget(renderer, opt);
    this.#next = new RenderTarget(renderer, opt);
  }

  resize(width: number, height: number) {
    this.#current.resize(width, height);
    this.#next.resize(width, height);
  }

  get textures() {
    return {
      current: this.#current.texture,
      next: this.#next.texture,
    };
  }

  /**
   * 此处绘制主要是合并瓦片
   * @param rendererParams
   * @param rendererState
   */
  render(rendererParams, rendererState) {
    if (this.#current) {
      this.#current.bind();
      const attr = this.renderer.attributes;
      if (attr.depth && this.#current.depth) {
        this.renderer.state.enable(this.renderer.gl.DEPTH_TEST);
        this.renderer.state.setDepthMask(true);
      }
      this.renderer.clear();
      this.renderer.setViewport(this.#current.width, this.#current.height);
    }

    const { tileManager } = this.options;

    if (tileManager) {
      const tiles = tileManager.tiles;
      const entries = tiles.entries();

      for (let i = 0; i < tiles.size; i++) {
        const [, tile] = entries.next().value;
        if (tile && tile.state === TileState.loaded) {
          const tileMesh = tile.createMesh(this.#program);
          const mesh = tileMesh.getMesh();
          mesh.program.setUniform('u_image', tile.textures.get(0));

          mesh.updateMatrix();
          mesh.worldMatrixNeedsUpdate = false;
          mesh.worldMatrix.multiply(rendererParams.scene.worldMatrix, mesh.localMatrix);
          mesh.draw(utils.omit(rendererParams, ['target']));
        }
      }
    }

    if (this.#current) {
      this.#current.unbind();
    }
  }
}
