import { Program, Renderer, Mesh, Geometry } from '@sakitam-gis/vis-engine';
import Pass from './base';
import fillVert from '../../shaders/fill.vert.glsl';
import fillFrag from '../../shaders/fill.frag.glsl';
import * as shaderLib from '../../shaders/shaderLib';
import { pick } from '../../utils/common';

/**
 * 着色
 */
export default class ColorizePass extends Pass {
  readonly #program: Program;
  readonly #mesh: Mesh;
  readonly #geometry: Geometry;
  readonly prerender = false;

  constructor(id: string, renderer: Renderer, options = {}) {
    super(id, renderer, options);

    this.#program = new Program(renderer, {
      vertexShader: fillVert,
      fragmentShader: fillFrag,
      uniforms: {
        opacity: {
          value: 1,
        },
        texture0: {
          value: null,
        },
        texture0Next: {
          value: null,
        },
        texture1: {
          value: null,
        },
        texture1Next: {
          value: null,
        },
        colorRampTexture: {
          value: null,
        },
      },
      defines: ['RENDER_TYPE 1.0', 'USE_WGS84'],
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
    if (rendererParams.scene && !rendererParams.scene.contains(this.#mesh)) {
      rendererParams.scene.add(this.#mesh);
    }

    if (rendererState) {
      const uniforms = pick(['opacity', 'colorRange', 'colorRampTexture']);

      Object.keys(uniforms).forEach((key) => {
        this.#program.setUniform(key, uniforms[key]);
      });
    }
  }
}
