import { Program, Renderer, Mesh, Geometry, Texture, utils } from '@sakitam-gis/vis-engine';
import Pass from '../base';
import vert from '../../../shaders/common.vert.glsl';
import frag from '../../../shaders/common.frag.glsl';
import * as shaderLib from '../../../shaders/shaderLib';
import { BandType } from '../../../type';
import { SourceType } from '../../../source';

export interface RasterPassOptions {
  source: SourceType;
  texture: Texture;
  textureNext: Texture;
  bandType: BandType;
  hasMask?: boolean;
}

/**
 * raster 渲染
 */
export default class RasterPass extends Pass<RasterPassOptions> {
  #program: WithNull<Program>;
  #mesh: WithNull<Mesh>;
  #geometry: WithNull<Geometry>;
  readonly prerender = false;

  constructor(
    id: string,
    renderer: Renderer,
    options: RasterPassOptions = {} as RasterPassOptions,
  ) {
    super(id, renderer, options);

    this.#program = new Program(renderer, {
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        opacity: {
          value: 1,
        },
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
  }

  /**
   * @param rendererParams
   * @param rendererState
   */
  render(rendererParams, rendererState) {
    const attr = this.renderer.attributes;
    this.renderer.setViewport(this.renderer.width * attr.dpr, this.renderer.height * attr.dpr);
    const camera = rendererParams.cameras.planeCamera;
    if (rendererState && this.#mesh) {
      let stencil;
      if (this.options.hasMask) {
        stencil = this.renderer.gl.getParameter(this.renderer.gl.STENCIL_TEST);
        if (!stencil) {
          this.renderer.state.enable(this.renderer.gl.STENCIL_TEST);
          this.renderer.state.setStencilMask(0xff);
          this.renderer.state.setStencilFunc(
            this.renderer.gl.EQUAL, // the test
            1, // reference value
            0xff,
          );

          this.renderer.state.setStencilOp(
            this.renderer.gl.KEEP,
            this.renderer.gl.KEEP,
            this.renderer.gl.KEEP,
          );
        }
      }
      const fade = this.options.source?.getFadeTime?.() || 0;
      const uniforms = utils.pick(rendererState, ['opacity']);

      Object.keys(uniforms).forEach((key) => {
        if (uniforms[key] !== undefined) {
          this.#mesh?.program.setUniform(key, uniforms[key]);
        }
      });

      this.#mesh.program.setUniform('u_fade_t', fade);

      this.#mesh.updateMatrix();
      this.#mesh.worldMatrixNeedsUpdate = false;
      this.#mesh.worldMatrix.multiply(camera.worldMatrix, this.#mesh.localMatrix);
      this.#mesh.draw({
        ...rendererParams,
        camera,
      });

      if (this.options.hasMask && !stencil) {
        this.renderer.state.disable(this.renderer.gl.STENCIL_TEST);
      }
    }
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
  }
}
