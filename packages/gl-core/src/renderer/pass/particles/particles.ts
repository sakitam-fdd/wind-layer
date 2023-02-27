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
import { RenderType } from '../../../type';
import { SourceType } from '../../../source';

export interface ParticlesPassOptions {
  source: SourceType;
  texture: Texture;
  textureNext: Texture;
  renderType: RenderType;
  hasMask?: boolean;
}

/**
 * 着色
 */
export default class Particles extends Pass<ParticlesPassOptions> {
  readonly #program: Program;
  readonly #mesh: Mesh;
  readonly #geometry: Geometry;
  readonly prerender = true;

  public particleStateResolution: number;

  #privateNumParticles: number;
  #current: RenderTarget;
  #next: RenderTarget;

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
          value: this.#current,
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

  get textures() {
    return {
      current: this.#current.texture,
      next: this.#next.texture,
    };
  }

  getParticleBuffer(numParticles) {
    const particleRes = Math.ceil(Math.sqrt(numParticles));
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
   * @param rendererParams
   * @param rendererState
   */
  render(rendererParams, rendererState) {
    const attr = this.renderer.attributes;
    this.renderer.setViewport(this.renderer.width * attr.dpr, this.renderer.height * attr.dpr);
    if (rendererState) {
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

      const fade = this.options.source?.getFadeTime?.() || 0;
      this.#mesh.program.setUniform(
        'u_image_res',
        new Vector2(this.options.texture.width, this.options.texture.height),
      );
      this.#mesh.program.setUniform('u_fade_t', fade);

      this.#mesh.worldMatrixNeedsUpdate = false;
      this.#mesh.draw({
        ...rendererParams,
        camera: rendererParams.cameras.orthoCamera,
      });
    }
  }
}
