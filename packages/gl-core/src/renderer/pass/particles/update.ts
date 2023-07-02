import {
  BlendType,
  Geometry,
  Mesh,
  Program,
  Renderer,
  RenderTarget,
  Texture,
  utils,
  Vector2,
} from '@sakitam-gis/vis-engine';
import Pass from '../base';
import { littleEndian } from '../../../utils/common';
import vert from '../../../shaders/common.vert.glsl';
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

  #initialize = true;

  #particleRes: number;

  constructor(
    id: string,
    renderer: Renderer,
    options: UpdatePassOptions = {} as UpdatePassOptions,
  ) {
    super(id, renderer, options);

    this.initializeRenderTarget();

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
      blending: BlendType.NoBlending,
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

  #getParticleRes() {
    return Math.ceil(Math.sqrt(this.options.getParticleNumber()));
  }

  resize() {
    const particleRes = this.#getParticleRes();

    this.#current.resize(particleRes, particleRes);
    this.#next.resize(particleRes, particleRes);
  }

  get textures() {
    return {
      currentParticles: this.#current.texture,
      nextParticles: this.#next.texture,
    };
  }

  setInitialize(state: boolean) {
    this.#initialize = state;
  }

  /**
   * 创建 RenderTarget
   */
  initializeRenderTarget() {
    const particleRes = this.#getParticleRes();

    const particleState = new Float32Array(particleRes ** 2 * 4);
    for (let i = 0; i < particleState.length; i++) {
      // randomize the initial particle positions
      particleState[i] = Math.floor(Math.random() * 256);
    }

    // @link https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
    const opt = {
      data: particleState,
      width: particleRes,
      height: particleRes,
      minFilter: this.renderer.gl.NEAREST,
      magFilter: this.renderer.gl.NEAREST,
      type: this.renderer.gl.FLOAT,
      format: this.renderer.gl.RGBA,
      internalFormat: this.renderer.isWebGL2
        ? (this.renderer.gl as WebGL2RenderingContext).RGBA32F
        : this.renderer.gl.RGBA,
      stencil: false,
    };

    this.#current = new RenderTarget(this.renderer, {
      ...opt,
      name: 'currentUpdateTexture',
    });
    this.#next = new RenderTarget(this.renderer, {
      ...opt,
      name: 'nextUpdateTexture',
    });
  }

  /**
   * 交换 RenderTarget
   */
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
    const particleRes = this.#getParticleRes();
    if (!this.#particleRes || this.#particleRes !== particleRes) {
      this.#particleRes = particleRes;
      this.initializeRenderTarget();
    }

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
      this.#mesh.program.setUniform('u_bbox', rendererState.extent);
      this.#mesh.program.setUniform('u_initialize', this.#initialize);
      this.#mesh.program.setUniform('u_data_bbox', rendererState.sharedState.u_data_bbox);

      this.#mesh.updateMatrix();
      this.#mesh.worldMatrixNeedsUpdate = false;
      this.#mesh.worldMatrix.multiply(camera.worldMatrix, this.#mesh.localMatrix);
      this.#mesh.draw({
        ...rendererParams,
        camera,
      });
    }
    if (this.#next) {
      this.#next.unbind();
    }

    this.#initialize = false;

    this.swapRenderTarget();
  }
}
