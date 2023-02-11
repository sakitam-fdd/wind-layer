import { Program, Renderer, RenderTarget, utils } from '@sakitam-gis/vis-engine';
import Pass from './base';
import vert from '../../shaders/compose.vert.glsl';
import frag from '../../shaders/compose.frag.glsl';
import * as shaderLib from '../../shaders/shaderLib';
import TileManager from '../../layer/tile/TileManager';
import { RenderFrom, RenderType, TileState } from '../../type';
import { littleEndian } from '../../utils/common';

export interface ComposePassOptions {
  tileManager: TileManager;
  renderType: RenderType;
  renderFrom: RenderFrom;
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
        dataRange: {
          value: undefined,
        },
      },
      defines: [`RENDER_TYPE ${this.options.renderType}`, `LITTLE_ENDIAN ${littleEndian}`],
      includes: shaderLib,
    });

    // @link https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
    const opt = {
      width: this.renderer.width,
      height: this.renderer.height,
      minFilter: renderer.gl.NEAREST,
      magFilter: renderer.gl.NEAREST,
      type: this.renderer.gl.FLOAT,
      format: this.renderer.gl.RGBA,
      // generateMipmaps: false,
      internalFormat: this.renderer.isWebGL2
        ? (this.renderer.gl as WebGL2RenderingContext).RGBA32F
        : this.renderer.gl.RGBA,
    };

    this.#current = new RenderTarget(renderer, {
      ...opt,
      name: 'currentRenderTargetTexture',
    });
    this.#next = new RenderTarget(renderer, {
      ...opt,
      name: 'nextRenderTargetTexture',
    });
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
      this.#current.clear();
      this.#current.bind();
      const attr = this.renderer.attributes;
      if (attr.depth && this.#current.depth) {
        this.renderer.state.enable(this.renderer.gl.DEPTH_TEST);
        this.renderer.state.setDepthMask(true);
      }
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

          const dataRange: number[] = [];
          for (const [index, texture] of tile.textures) {
            if (texture.userData?.dataRange && Array.isArray(texture.userData?.dataRange)) {
              dataRange.push(...texture.userData.dataRange);
            }
            mesh.program.setUniform(`u_image${index}`, texture);
          }

          if (dataRange.length > 0) {
            mesh.program.setUniform('dataRange', dataRange);
          }

          mesh.updateMatrix();
          mesh.worldMatrixNeedsUpdate = false;
          mesh.worldMatrix.multiply(rendererParams.scene.worldMatrix, mesh.localMatrix);
          mesh.draw({
            ...utils.omit(rendererParams, ['target']),
            camera: rendererParams.cameras.camera,
          });
        }
      }
    }

    if (this.#current) {
      this.#current.unbind();
    }
  }
}
