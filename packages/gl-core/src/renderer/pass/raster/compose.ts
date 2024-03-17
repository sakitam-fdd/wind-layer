import { Program, Renderer, RenderTarget, utils } from '@sakitam-gis/vis-engine';
import Pass from '../base';
import vert from '../../../shaders/compose.vert.glsl';
import frag from '../../../shaders/raster-texture.frag.glsl';
import * as shaderLib from '../../../shaders/shaderLib';
import { RenderFrom, BandType } from '../../../type';
import TileID from '../../../tile/TileID';
import { SourceType } from '../../../source';
import MaskPass from '../mask';

export interface ComposePassOptions {
  source: SourceType;
  bandType: BandType;
  renderFrom: RenderFrom;
  stencilConfigForOverlap: (tiles: any[]) => [{ [_: number]: any }, TileID[]];
  maskPass?: MaskPass;
}

/**
 * 在这里我们实现将所有瓦片绘制在 fbo 上以提升多世界渲染的边界接边效果
 * 在下一步再进行完整的着色
 */
export default class ComposePass extends Pass<ComposePassOptions> {
  readonly prerender = true;

  #program: WithNull<Program>;
  #current: WithNull<RenderTarget>;
  #next: WithNull<RenderTarget>;
  #uid: string;
  constructor(
    id: string,
    renderer: Renderer,
    options: ComposePassOptions = {} as ComposePassOptions,
  ) {
    super(id, renderer, options);

    this.#uid = utils.uid('ComposePass');

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
    this.#current?.resize(width, height);
    this.#next?.resize(width, height);
  }

  get textures() {
    return {
      current: this.#current?.texture,
      next: this.#next?.texture,
    };
  }

  renderTexture(renderTarget, rendererParams, rendererState, sourceCache) {
    if (renderTarget) {
      renderTarget.clear();
      renderTarget.bind();
      const attr = this.renderer.attributes;
      if (attr.depth && renderTarget.depth) {
        this.renderer.state.enable(this.renderer.gl.DEPTH_TEST);
        this.renderer.state.setDepthMask(true);
      }
      this.renderer.setViewport(renderTarget.width, renderTarget.height);
    }

    const { stencilConfigForOverlap } = this.options;
    const camera = rendererParams.cameras.camera;
    if (sourceCache) {
      const coordsAscending = sourceCache.getVisibleCoordinates();
      const coordsDescending = coordsAscending.slice().reverse(); // offscreen & opaque

      if (!coordsDescending.length) return;

      let stencil;

      if (this.maskPass) {
        stencil = this.maskPass.render(rendererParams, rendererState);
      }

      const [stencilModes, coords] = stencilConfigForOverlap(coordsDescending);

      for (let i = 0; i < coords.length; i++) {
        const coord = coords[i];
        const tile = sourceCache.getTile(coord);
        if (!(tile && tile.hasData())) continue;
        const bbox = coord.getTileProjBounds();
        if (!bbox) continue;
        const tileMesh = tile.createMesh(this.#uid, bbox, this.renderer, this.#program);
        const mesh = tileMesh.getMesh();

        for (const [index, texture] of tile.textures) {
          mesh.program.setUniform(`u_image${index}`, texture);
        }

        mesh.updateMatrix();
        mesh.worldMatrixNeedsUpdate = false;
        mesh.worldMatrix.multiply(rendererParams.scene.worldMatrix, mesh.localMatrix);

        const stencilMode = stencilModes[coord.overscaledZ];

        if (stencilMode) {
          // if (stencilMode.stencil) {
          //   const s = this.renderer.gl.getParameter(this.renderer.gl.STENCIL_TEST);
          //   if (!s) {
          //     this.renderer.state.enable(this.renderer.gl.STENCIL_TEST);
          //   }
          //
          //   this.renderer.gl.stencilFunc(
          //     stencilMode.func?.cmp,
          //     stencilMode.func?.ref,
          //     stencilMode.func?.mask,
          //   );
          //   this.renderer.gl.stencilOp(
          //     stencilMode.op?.fail,
          //     stencilMode.op?.zfail,
          //     stencilMode.op?.zpass,
          //   );
          // } else {
          //   this.renderer.state.disable(this.renderer.gl.STENCIL_TEST);
          // }
        }

        mesh.draw({
          ...rendererParams,
          camera,
        });
      }

      this.renderer.clear(false, false, true);

      if (!stencil) {
        this.renderer.state.disable(this.renderer.gl.STENCIL_TEST);
      }
    }

    if (renderTarget) {
      renderTarget.unbind();
    }
  }

  /**
   * 此处绘制主要是合并瓦片
   * @param rendererParams
   * @param rendererState
   */
  render(rendererParams, rendererState) {
    const { source } = this.options;
    const sourceCache = source.sourceCache;
    if (Array.isArray(sourceCache)) {
      if (sourceCache.length === 2) {
        this.renderTexture(this.#current, rendererParams, rendererState, sourceCache[0]);
        this.renderTexture(this.#next, rendererParams, rendererState, sourceCache[1]);
      } else {
        this.renderTexture(this.#current, rendererParams, rendererState, sourceCache[0]);
      }
    } else {
      this.renderTexture(this.#current, rendererParams, rendererState, sourceCache);
    }
  }

  destroy() {
    if (this.#current) {
      this.#current.destroy();
      this.#current = null;
    }
    if (this.#next) {
      this.#next.destroy();
      this.#next = null;
    }

    if (this.#program) {
      this.#program.destroy();
      this.#program = null;
    }
  }
}
