import {
  Program,
  Renderer,
  Mesh,
  Geometry,
  Texture,
  Vector2,
  RenderTarget,
} from '@sakitam-gis/vis-engine';
import Pass from '../base';
import { littleEndian } from '../../../utils/common';
import vert from '../../../shaders/particles/draw.vert.glsl';
import frag from '../../../shaders/particles/draw.frag.glsl';
import * as shaderLib from '../../../shaders/shaderLib';
import { BandType } from '../../../type';
import { SourceType } from '../../../source';

export interface ParticlesPassOptions {
  source: SourceType;
  texture: Texture;
  textureNext: Texture;
  getParticles: () => Texture;
  bandType: BandType;
  getParticleNumber: () => number;
  hasMask?: boolean;
}

/**
 * 着色
 */
export default class Particles extends Pass<ParticlesPassOptions> {
  readonly #program: Program;
  readonly #mesh: Mesh;
  readonly #geometry: Geometry;
  #prerender = true;

  public particleStateResolution: number;

  #privateNumParticles: number;
  #screenTexture: RenderTarget;
  #backgroundTexture: RenderTarget;

  constructor(
    id: string,
    renderer: Renderer,
    options: ParticlesPassOptions = {} as ParticlesPassOptions,
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
        u_particleSize: {
          value: 2.0,
        },
        u_particlesRes: {
          value: 0,
        },
      },
      defines: [`RENDER_TYPE ${this.options.bandType}`, `LITTLE_ENDIAN ${littleEndian}`],
      includes: shaderLib,
      transparent: true,
      blending: 5,
      blendFunc: {
        src: this.renderer.gl.ONE,
        dst: this.renderer.gl.ONE_MINUS_SRC_ALPHA,
      },
      blendEquation: {
        modeAlpha: this.renderer.gl.FUNC_ADD,
        modeRGB: this.renderer.gl.FUNC_ADD,
      },
    });

    const { particleIndices, particleReferences } = this.getParticleBuffer();

    this.#geometry = new Geometry(renderer, {
      a_index: {
        size: 1,
        data: particleIndices,
      },
      reference: {
        size: 2,
        data: particleReferences,
      },
    });

    this.#mesh = new Mesh(renderer, {
      mode: renderer.gl.POINTS,
      program: this.#program,
      geometry: this.#geometry,
    });
  }

  get prerender() {
    return this.#prerender;
  }

  set prerender(prerender) {
    this.#prerender = prerender;
  }

  get textures() {
    return {
      screenTexture: this.#screenTexture.texture,
      backgroundTexture: this.#backgroundTexture.texture,
    };
  }

  get renderTarget() {
    return this.#prerender && this.#screenTexture;
  }

  resetParticles() {
    this.#screenTexture.clear();
    this.#backgroundTexture.clear();
  }

  getParticleBuffer() {
    const particleRes = Math.ceil(Math.sqrt(this.options.getParticleNumber()));
    this.particleStateResolution = particleRes;
    this.#privateNumParticles = particleRes * particleRes;
    const particleIndices = new Float32Array(this.#privateNumParticles);
    const particleReferences = new Float32Array(this.#privateNumParticles * 2);

    for (let i = 0; i < this.#privateNumParticles; i++) {
      const t = (i % particleRes) / particleRes;
      const a = Math.trunc(i / particleRes) / particleRes;
      particleReferences.set([t, a], 2 * i);
      particleIndices[i] = i;
    }

    return { particleIndices, particleReferences };
  }

  /**
   * 创建 RenderTarget
   */
  initializeRenderTarget() {
    // @link https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
    const opt = {
      width: this.renderer.width,
      height: this.renderer.height,
      minFilter: this.renderer.gl.LINEAR,
      magFilter: this.renderer.gl.LINEAR,
      type: this.renderer.gl.UNSIGNED_BYTE,
      format: this.renderer.gl.RGBA,
      stencil: false,
      premultipliedAlpha: false,
    };

    this.#screenTexture = new RenderTarget(this.renderer, {
      ...opt,
      name: 'screenTexture',
    });
    this.#backgroundTexture = new RenderTarget(this.renderer, {
      ...opt,
      name: 'backgroundTexture',
    });
  }

  /**
   * 交换 RenderTarget
   */
  swapRenderTarget() {
    [this.#screenTexture, this.#backgroundTexture] = [this.#backgroundTexture, this.#screenTexture];
  }

  /**
   * @param rendererParams
   * @param rendererState
   */
  render(rendererParams, rendererState) {
    if (this.renderTarget) {
      this.renderTarget.bind();
      this.renderer.setViewport(this.renderTarget.width, this.renderTarget.height);
    } else {
      const attr = this.renderer.attributes;
      this.renderer.setViewport(this.renderer.width * attr.dpr, this.renderer.height * attr.dpr);
    }
    const camera = rendererParams.cameras.camera;
    if (rendererState) {
      this.#mesh.program.setUniform(
        'u_image_res',
        new Vector2(this.options.texture.width, this.options.texture.height),
      );
      const fade = this.options.source?.getFadeTime?.() || 0;
      this.#mesh.program.setUniform('u_fade_t', fade);
      this.#mesh.program.setUniform('u_colorRamp', rendererState.colorRampTexture);
      this.#mesh.program.setUniform('u_data_matrix', rendererState.u_data_matrix);
      this.#mesh.program.setUniform('u_colorRange', rendererState.colorRange);
      this.#mesh.program.setUniform('u_particles', this.options.getParticles());
      this.#mesh.program.setUniform('u_particlesRes', this.#privateNumParticles);

      const sharedState = rendererState.sharedState;

      this.#mesh.program.setUniform('u_bbox', sharedState.u_bbox);
      const u_offset = sharedState.u_offset;
      if (u_offset) {
        this.#mesh.scale.set(sharedState.u_scale[0], sharedState.u_scale[1], 1);
        this.#mesh.position.set(u_offset[0], u_offset[1], 0);
      }

      this.#mesh.updateMatrix();
      this.#mesh.worldMatrixNeedsUpdate = false;
      this.#mesh.worldMatrix.multiply(rendererParams.scene.worldMatrix, this.#mesh.localMatrix);
      this.#mesh.draw({
        ...rendererParams,
        camera,
      });
    }

    if (this.renderTarget) {
      this.renderTarget.unbind();
    }
  }
}
