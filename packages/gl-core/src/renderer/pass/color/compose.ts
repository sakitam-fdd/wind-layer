import { Program, Renderer, RenderTarget, utils } from '@sakitam-gis/vis-engine';
import Pass from '../base';
import vert from '../../../shaders/compose.vert.glsl';
import frag from '../../../shaders/compose.frag.glsl';
import * as shaderLib from '../../../shaders/shaderLib';
import { RenderFrom, RenderType } from '../../../type';
import { littleEndian } from '../../../utils/common';
import Tile from '../../../tile/Tile';
import SourceCache from '../../../source/cahce';

export interface ComposePassOptions {
  sourceCache: SourceCache;
  renderType: RenderType;
  renderFrom: RenderFrom;
  stencilConfigForOverlap: (tiles: any[]) => [{ [_: number]: any }, Tile[]];
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
      stencil: true,
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

    const { sourceCache, stencilConfigForOverlap } = this.options;

    if (sourceCache) {
      const coordsAscending = sourceCache.getVisibleCoordinates();
      const coordsDescending = coordsAscending.slice().reverse(); // offscreen & opaque

      if (!coordsDescending.length) return;

      const [stencilModes, coords] = stencilConfigForOverlap(coordsDescending);

      for (let i = 0; i < coords.length; i++) {
        const coord = coords[i];
        const tile = sourceCache.getTile(coord);
        if (!(tile && tile.hasData())) continue;

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

        const stencilMode = stencilModes[tile.z];

        if (stencilMode) {
          if (stencilMode.stencil) {
            this.renderer.state.enable(this.renderer.gl.STENCIL_TEST);

            this.renderer.state.setStencilFunc(
              stencilMode.func?.cmp,
              stencilMode.func?.ref,
              stencilMode.func?.mask,
            );
            this.renderer.state.setStencilOp(
              stencilMode.op?.fail,
              stencilMode.op?.zfail,
              stencilMode.op?.zpass,
            );
          } else {
            this.renderer.state.disable(this.renderer.gl.STENCIL_TEST);
          }
        }

        mesh.draw({
          ...utils.omit(rendererParams, ['target']),
          camera: rendererParams.cameras.camera,
        });
      }
    }

    if (this.#current) {
      this.#current.unbind();
    }
  }
}
