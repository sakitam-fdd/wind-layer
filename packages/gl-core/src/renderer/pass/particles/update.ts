import {
  Program,
  Renderer,
  Mesh,
  Geometry,
  Texture,
  utils,
  Vector2,
  RenderTarget,
} from '@sakitam-gis/vis-engine';
import Pass from '../base';
import { littleEndian } from '../../../utils/common';
import vert from '../../../shaders/compose.vert.glsl';
import frag from '../../../shaders/particles/update.frag.glsl';
import * as shaderLib from '../../../shaders/shaderLib';
import { BandType } from '../../../type';
import { SourceType } from '../../../source';

export interface UpdatePassOptions {
  source: SourceType;
  texture: Texture;
  textureNext: Texture;
  bandType: BandType;
  getParticleNumber: () => number;
  hasMask?: boolean;
}

export default class UpdatePass extends Pass<UpdatePassOptions> {
  readonly #program: Program;
  readonly #mesh: Mesh;
  readonly #geometry: Geometry;
  readonly prerender = true;
  #current: RenderTarget;
  #next: RenderTarget;

  constructor(
    id: string,
    renderer: Renderer,
    options: UpdatePassOptions = {} as UpdatePassOptions,
  ) {
    super(id, renderer, options);

    const particleRes = Math.ceil(Math.sqrt(this.options.getParticleNumber()));

    // @link https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
    const opt = {
      width: particleRes,
      height: particleRes,
      minFilter: renderer.gl.LINEAR,
      magFilter: renderer.gl.LINEAR,
      type: this.renderer.gl.FLOAT,
      format: this.renderer.gl.RGBA,
      internalFormat: this.renderer.isWebGL2
        ? (this.renderer.gl as WebGL2RenderingContext).RGBA32F
        : this.renderer.gl.RGBA,
      stencil: false,
    };

    this.#current = new RenderTarget(renderer, {
      ...opt,
      name: 'currentUpdateTexture',
    });
    this.#next = new RenderTarget(renderer, {
      ...opt,
      name: 'nextUpdateTexture',
    });

    this.#program = new Program(renderer, {
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        u_fade_t: {
          value: 0,
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
        u_particles: {
          value: null,
        },
      },
      defines: [`RENDER_TYPE ${this.options.bandType}`, `LITTLE_ENDIAN ${littleEndian}`],
      includes: shaderLib,
      blending: 0,
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

  resize() {
    const particleRes = Math.ceil(Math.sqrt(this.options.getParticleNumber()));
    this.#current.resize(particleRes, particleRes);
    this.#next.resize(particleRes, particleRes);
  }

  get textures() {
    return {
      particles: this.#current.texture,
    };
  }

  swapRenderTarget() {
    [this.#current, this.#next] = [this.#next, this.#current];
  }

  /**
   * @param rendererParams
   * @param rendererState
   */
  render(rendererParams, rendererState) {
    const attr = this.renderer.attributes;
    const camera = rendererParams.cameras.planeCamera;
    if (this.#next) {
      this.#next.bind();
      if (attr.depth && this.#next.depth) {
        this.renderer.state.enable(this.renderer.gl.DEPTH_TEST);
        this.renderer.state.setDepthMask(true);
      }
      this.renderer.setViewport(this.#next.width, this.#next.height);
    }
    if (rendererState) {
      const uniforms = utils.pick(rendererState, [
        'dataRange',
        'useDisplayRange',
        'displayRange',
        'u_bbox',
        'u_data_matrix',
        'u_drop_rate',
        'u_drop_rate_bump',
        'u_speed_factor',
      ]);

      Object.keys(uniforms).forEach((key) => {
        if (uniforms[key] !== undefined) {
          this.#mesh.program.setUniform(key, uniforms[key]);
        }
      });

      const fade = this.options.source?.getFadeTime?.() || 0;
      this.#mesh.program.setUniform(
        'u_image_res',
        new Vector2(this.options.texture.width, this.options.texture.height),
      );
      this.#mesh.program.setUniform('u_fade_t', fade);
      this.#mesh.program.setUniform('u_rand_seed', Math.random());
      this.#mesh.program.setUniform('u_particles', this.#current.texture);

      this.#mesh.worldMatrixNeedsUpdate = false;
      this.#mesh.draw({
        ...rendererParams,
        camera,
      });
      // 此处计算出的是 0-1 之间的值
      // const a = new Float32Array(this.#next.width * this.#next.height * 4);
      // this.renderer.gl.readPixels(0, 0, this.#next.width, this.#next.height, this.renderer.gl.RGBA, this.renderer.gl.FLOAT, a);
      // console.log(a);
    }
    if (this.#next) {
      this.#next.unbind();
    }
    this.swapRenderTarget();
  }
}
