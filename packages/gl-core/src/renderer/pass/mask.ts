import { Program, Renderer, Mesh, Geometry } from '@sakitam-gis/vis-engine';
import Pass from './base';
import { littleEndian } from '../../utils/common';
import composeVert from '../../shaders/compose.vert.glsl';
import maskFrag from '../../shaders/mask.frag.glsl';
import * as shaderLib from '../../shaders/shaderLib';
import { RenderType } from '../../type';

export interface MaskPassOptions {
  renderType: RenderType;
}

/**
 * 掩膜
 */
export default class MaskPass extends Pass<MaskPassOptions> {
  readonly #program: Program;
  readonly #mesh: Mesh;
  readonly #geometry: Geometry;
  readonly prerender = false;

  constructor(id: string, renderer: Renderer, options: MaskPassOptions = {} as MaskPassOptions) {
    super(id, renderer, options);

    this.#program = new Program(renderer, {
      vertexShader: composeVert,
      fragmentShader: maskFrag,
      defines: [`RENDER_TYPE ${this.options.renderType}`, `LITTLE_ENDIAN ${littleEndian}`],
      includes: shaderLib,
      transparent: true,
    });

    this.#geometry = new Geometry(renderer, {
      position: {
        size: 2,
        data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1].map(ii => ii / 2)),
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

    // this.#mesh.position.set(0.5, 0.5, 0);
  }

  /**
   * @param rendererParams
   * @param rendererState
   */
  render(rendererParams, rendererState) {
    const attr = this.renderer.attributes;
    this.renderer.setViewport(this.renderer.width * attr.dpr, this.renderer.height * attr.dpr);
    if (rendererState) {
      const stencil = this.renderer.gl.getParameter(this.renderer.gl.STENCIL_TEST);
      if (!stencil) {
        this.renderer.state.enable(this.renderer.gl.STENCIL_TEST);
      }

      this.renderer.state.setMask(false);

      this.renderer.state.setStencilMask(0xff);
      this.renderer.state.setStencilFunc(this.renderer.gl.ALWAYS, 1, 0xff);

      this.renderer.state.setStencilOp(
        this.renderer.gl.KEEP,
        this.renderer.gl.REPLACE,
        this.renderer.gl.REPLACE,
      );

      this.#mesh.updateMatrix();
      this.#mesh.worldMatrixNeedsUpdate = false;
      this.#mesh.worldMatrix.multiply(rendererParams.scene.worldMatrix, this.#mesh.localMatrix);
      this.#mesh.draw({
        ...rendererParams,
        camera: rendererParams.cameras.camera,
      });

      this.renderer.state.setMask(true);

      if (!stencil) {
        this.renderer.state.disable(this.renderer.gl.STENCIL_TEST);
      }
    }
  }
}
