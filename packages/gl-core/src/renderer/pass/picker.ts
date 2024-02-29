import { Program, Renderer, Mesh, Geometry, Texture, RenderTarget } from '@sakitam-gis/vis-engine';
import Pass from './base';
import vert from '../../shaders/picker.vert.glsl';
import frag from '../../shaders/picker.frag.glsl';
import * as shaderLib from '../../shaders/shaderLib';
import { SourceType } from '../../source';

export interface PickerPassOptions {
  source: SourceType;
  texture: Texture;
  textureNext: Texture;
  useFloatTexture?: boolean;
}

/**
 * picking
 */
export default class PickerPass extends Pass<PickerPassOptions> {
  readonly prerender = false;

  #program: WithNull<Program>;
  #mesh: WithNull<Mesh>;
  #geometry: WithNull<Geometry>;
  #picker: WithNull<RenderTarget>;

  #rendererParams: any;
  #rendererState: any;

  constructor(
    id: string,
    renderer: Renderer,
    options: PickerPassOptions = {} as PickerPassOptions,
  ) {
    super(id, renderer, options);

    this.#program = new Program(renderer, {
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
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
      stencil: false,
    };

    if (options.useFloatTexture) {
      opt.type = this.renderer.gl.FLOAT;
      opt.internalFormat = this.renderer.isWebGL2
        ? (this.renderer.gl as WebGL2RenderingContext).RGBA32F
        : this.renderer.gl.RGBA;
    }

    this.#picker = new RenderTarget(renderer, {
      ...opt,
      name: 'pickerRenderTargetTexture',
    });
  }

  resize(width: number, height: number) {
    this.#picker?.resize(width, height);
  }

  /**
   * @param rendererParams
   * @param rendererState
   * @param pixel
   */
  render(rendererParams = this.#rendererParams, rendererState = this.#rendererState, pixel) {
    return new Promise((resolve) => {
      if (!this.#picker || !this.#mesh) return resolve(null);
      this.#rendererParams =
        this.#rendererParams !== rendererParams ? rendererParams : this.#rendererParams;
      this.#rendererState =
        this.#rendererState !== rendererState ? rendererState : this.#rendererState;
      const camera = rendererParams.cameras.planeCamera;
      this.#picker.clear();
      this.#picker.bind();
      this.renderer.setViewport(this.#picker.width, this.#picker.height);
      if (rendererState) {
        const fade = this.options.source?.getFadeTime?.() || 0;

        this.#mesh.program.setUniform('u_fade_t', fade);

        this.#mesh.updateMatrix();
        this.#mesh.worldMatrixNeedsUpdate = false;
        this.#mesh.worldMatrix.multiply(camera.worldMatrix, this.#mesh.localMatrix);
        this.#mesh.draw({
          ...rendererParams,
          camera,
        });

        if (pixel) {
          const a = this.options.useFloatTexture ? new Float32Array(4) : new Uint8Array(4);
          this.renderer.gl.readPixels(
            pixel[0],
            pixel[1],
            1.0,
            1.0,
            this.renderer.gl.RGBA,
            this.options.useFloatTexture ? this.renderer.gl.FLOAT : this.renderer.gl.UNSIGNED_BYTE,
            a,
          );
          resolve(a);
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
      this.#picker.unbind();
    });
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

    if (this.#picker) {
      this.#picker.destroy();
      this.#picker = null;
    }
  }
}
