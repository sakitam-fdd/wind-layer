import {
  Program,
  Renderer,
  Mesh,
  Geometry,
  Texture,
  utils,
  Vector2,
} from '@sakitam-gis/vis-engine';
import Pass from './base';
import { littleEndian } from '../../utils/common';
import fillVert from '../../shaders/fill.vert.glsl';
import fillFrag from '../../shaders/fill.frag.glsl';
import * as shaderLib from '../../shaders/shaderLib';
import { RenderType } from '../../type';

export interface ColorizePassOptions {
  texture: Texture;
  textureNext: Texture;
  renderType: RenderType;
  hasMask?: boolean;
}

/**
 * 着色
 */
export default class ColorizePass extends Pass<ColorizePassOptions> {
  readonly #program: Program;
  readonly #mesh: Mesh;
  readonly #geometry: Geometry;
  readonly prerender = false;

  constructor(
    id: string,
    renderer: Renderer,
    options: ColorizePassOptions = {} as ColorizePassOptions,
  ) {
    super(id, renderer, options);

    this.#program = new Program(renderer, {
      vertexShader: fillVert,
      fragmentShader: fillFrag,
      uniforms: {
        opacity: {
          value: 1,
        },
        displayRange: {
          value: new Vector2(-Infinity, Infinity),
        },
        u_texture: {
          value: this.options.texture,
        },
        u_textureNext: {
          value: this.options.textureNext,
        },
        colorRampTexture: {
          value: null,
        },
      },
      defines: [`RENDER_TYPE ${this.options.renderType}`, `LITTLE_ENDIAN ${littleEndian}`],
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
    if (rendererState) {
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
      const uniforms = utils.pick(rendererState, [
        'opacity',
        'colorRange',
        'dataRange',
        'colorRampTexture',
        'useDisplayRange',
        'displayRange',
      ]);

      Object.keys(uniforms).forEach((key) => {
        if (uniforms[key] !== undefined) {
          this.#mesh.program.setUniform(key, uniforms[key]);
        }
      });

      this.#mesh.program.setUniform(
        'u_image_res',
        new Vector2(this.options.texture.width, this.options.texture.height),
      );

      this.#mesh.worldMatrixNeedsUpdate = false;
      this.#mesh.draw({
        ...rendererParams,
        camera: rendererParams.cameras.orthoCamera,
      });

      if (this.options.hasMask && !stencil) {
        this.renderer.state.disable(this.renderer.gl.STENCIL_TEST);
      }
    }
  }
}
