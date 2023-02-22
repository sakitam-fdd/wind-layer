import { Program, Renderer, RenderTarget, utils } from '@sakitam-gis/vis-engine';
import Pass from '../base';
import vert from '../../../shaders/compose.vert.glsl';
import frag from '../../../shaders/raster-texture.frag.glsl';
import * as shaderLib from '../../../shaders/shaderLib';
import { RenderFrom, RenderType } from '../../../type';
import SourceCache from '../../../source/cahce';
import TileID from '../../../tile/TileID';

export interface ComposePassOptions {
  sourceCache: SourceCache;
  renderType: RenderType;
  renderFrom: RenderFrom;
  stencilConfigForOverlap: (tiles: any[]) => [{ [_: number]: any }, TileID[]];
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
        u_image0: {
          value: undefined,
        },
      },
      includes: shaderLib,
    });

    // @link https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
    const opt = {
      width: this.renderer.width,
      height: this.renderer.height,
      minFilter: renderer.gl.NEAREST,
      magFilter: renderer.gl.NEAREST,
      type: this.renderer.gl.UNSIGNED_BYTE,
      format: this.renderer.gl.RGBA,
      generateMipmaps: true,
      internalFormat: this.renderer.gl.RGBA,
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
        const tileBBox = coord.getTileBounds();
        if (!tileBBox) continue;
        const tileMesh = tile.createMesh(tileBBox, this.renderer, this.#program);
        const mesh = tileMesh.getMesh();

        for (const [index, texture] of tile.textures) {
          mesh.program.setUniform(`u_image${index}`, texture);
        }

        mesh.updateMatrix();
        mesh.worldMatrixNeedsUpdate = false;
        mesh.worldMatrix.multiply(rendererParams.scene.worldMatrix, mesh.localMatrix);

        const stencilMode = stencilModes[coord.overscaledZ];

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
