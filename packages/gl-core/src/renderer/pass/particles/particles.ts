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
  particles: Texture;
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

    // @link https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
    const opt = {
      width: this.renderer.width,
      height: this.renderer.height,
      minFilter: renderer.gl.NEAREST,
      magFilter: renderer.gl.NEAREST,
      type: this.renderer.gl.FLOAT,
      format: this.renderer.gl.RGBA,
      // generateMipmaps: false,
      internalFormat: this.renderer.isWebGL2
        ? (this.renderer.gl as WebGL2RenderingContext).RGBA32F
        : this.renderer.gl.RGBA,
      stencil: false,
      premultipliedAlpha: true,
    };

    this.#screenTexture = new RenderTarget(renderer, {
      ...opt,
      name: 'screenTexture',
    });
    this.#backgroundTexture = new RenderTarget(renderer, {
      ...opt,
      name: 'backgroundTexture',
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
        u_particleSize: {
          value: 2.0,
        },
      },
      defines: [`RENDER_TYPE ${this.options.bandType}`, `LITTLE_ENDIAN ${littleEndian}`],
      includes: shaderLib,
      transparent: true,
    });

    const { particleIndices, particleReferences } = this.getParticleBuffer();

    this.#geometry = new Geometry(renderer, {
      position: {
        size: 2,
        data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
      },
      uv: {
        size: 2,
        data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
      },
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
      this.#mesh.program.setUniform('u_particles', this.options.particles);

      this.#mesh.worldMatrixNeedsUpdate = false;
      this.#mesh.draw({
        ...rendererParams,
        camera: rendererParams.cameras.orthoCamera,
      });
    }

    if (this.renderTarget) {
      this.renderTarget.unbind();
    }
  }
}
