import {Program, Renderer, Mesh, Geometry, Texture, utils, Vector2} from '@sakitam-gis/vis-engine';
import Pass from './base';
import fillVert from '../../shaders/fill.vert.glsl';
import fillFrag from '../../shaders/fill.frag.glsl';
import * as shaderLib from '../../shaders/shaderLib';

export interface ColorizePassOptions {
  texture: Texture;
  textureNext: Texture;
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
          value: null,
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
      defines: ['RENDER_TYPE 1.0'],
      includes: shaderLib,
    });

    this.#geometry = new Geometry(renderer, {
      position: {
        size: 2,
        data: new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      },
      uv: {
        size: 2,
        data: new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
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
    if (rendererState) {
      const uniforms = utils.pick(rendererState, [
        'opacity',
        'colorRange',
        'colorRampTexture',
        'useDisplayRange',
        'displayRange',
      ]);

      Object.keys(uniforms).forEach((key) => {
        if (uniforms[key] !== undefined) {
          this.#mesh.program.setUniform(key, uniforms[key]);
        }
      });

      this.#mesh.program.setUniform('u_range', new Vector2(-50.84996643066404, 42.25002441406252));
      this.#mesh.program.setUniform('u_image_res', new Vector2(this.options.texture.width, this.options.texture.height));

      this.#mesh.updateMatrix();
      this.#mesh.worldMatrixNeedsUpdate = false;
      // this.#mesh.worldMatrix.multiply(rendererParams.scene.worldMatrix, this.#mesh.localMatrix);
      this.#mesh.draw(rendererParams);
    }
  }
}
