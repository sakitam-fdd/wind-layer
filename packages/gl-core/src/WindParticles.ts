import Base from './Base';
import drawFrag from './shaders/particles/draw.frag.glsl';
import drawVert from './shaders/particles/draw.vert.glsl';
import screenFrag from './shaders/particles/screen.frag.glsl';
import screenVert from './shaders/particles/screen.vert.glsl';
import updateFrag from './shaders/particles/update.frag.glsl';
import updateVert from './shaders/particles/update.vert.glsl';

import {
  bindFramebuffer,
  clearScene,
  createBuffer,
  createTexture,
  loadImage,
} from './utils/gl-utils';
import { Raf } from './utils/raf';
import { createLinearGradient, createZoom } from './utils/style-parser';

export interface IWindOptions {
  opacity: number;
  fadeOpacity: number;
  speedFactor: number;
  dropRate: number;
  dropRateBump: number;
  numParticles: number;
  styleSpec?: {
    color: any[];
    opacity: number | any[];
  };
  getZoom?: () => number;
  triggerRepaint?: () => void;
}

export interface IImageData {
  type: 'image';
  url: string;
  extent: Array<[number, number]>;
  uMin?: number;
  uMax?: number;
  vMin?: number;
  vMax?: number;
  min?: number;
  max?: number;
}

export interface IData {
  width: number;
  height: number;
  uMin?: number;
  uMax?: number;
  vMin?: number;
  vMax?: number;
  min?: number;
  max?: number;
  texCoordBuffer: WebGLBuffer | null;
  quadBuffer: WebGLBuffer | null;
  buffer: WebGLBuffer | null;
  backgroundBuffer: WebGLBuffer | null;
  backgroundTexCoordBuffer: WebGLBuffer | null;
  texture?: WebGLTexture | null;
}

const defaultOptions = {
  styleSpec: {
    color: [
      'interpolate',
      ['linear'],
      ['get', 'value'],
      0.0,
      '#3288bd',
      10,
      '#66c2a5',
      20,
      '#abdda4',
      30,
      '#e6f598',
      40,
      '#fee08b',
      50,
      '#fdae61',
      60,
      '#f46d43',
      100.0,
      '#d53e4f',
    ],
    opacity: 1,
  },
  opacity: 1,
  speedFactor: 0.25,
  fadeOpacity: 0.9,
  dropRate: 0.03,
  dropRateBump: 0.01,
  numParticles: 65535,
};

export default class WindParticles {
  public gl: WebGLRenderingContext;

  public data: IData;

  private checkExt: OES_element_index_uint | null;

  private privateNumParticles: number;

  private particleStateResolution: number;

  private particleStateTexture0: WebGLTexture | null;

  private particleStateTexture1: WebGLTexture | null;

  private particleIndexBuffer: WebGLBuffer | null;

  private backgroundTexture: WebGLTexture | null;

  private screenTexture: WebGLTexture | null;

  private drawCommand: Base;
  private updateCommand: Base;
  private screenCommand: Base;
  private raf: Raf;
  private fbo: WebGLFramebuffer | null;
  private colorRampTexture: WebGLTexture | null;

  private options: IWindOptions;
  private opacity: number;
  private fade: number;
  private colorRange: [number, number];

  constructor(gl: WebGLRenderingContext, options: Partial<IWindOptions> = {}) {
    this.gl = gl;

    if (!this.gl) {
      throw new Error('initialize error');
    }

    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.opacity = this.options.opacity || 1;
    this.fade = 0.99;
  }

  public initialize(gl: WebGLRenderingContext) {
    this.drawCommand = new Base(gl, drawVert, drawFrag);
    this.drawCommand.draw = function() {
      this.gl.drawArrays(this.primitive, 0, this.count);
    };
    this.updateCommand = new Base(gl, updateVert, updateFrag);
    this.updateCommand.draw = function() {
      this.gl.drawArrays(this.primitive, 0, 4);
    };
    this.screenCommand = new Base(gl, screenVert, screenFrag);
    this.screenCommand.draw = function() {
      this.gl.drawArrays(this.primitive, 0, 4);
    };

    this.fbo = gl.createFramebuffer();

    this.raf = new Raf({
      callback: () => {
        if (this.options.triggerRepaint) {
          this.options.triggerRepaint();
        }
      },
    });

    this.resize();

    this.buildColorRamp();

    this.numParticles = this.options.numParticles;

    if (typeof this.options.getZoom === 'function') {
      this.setOpacity(
        createZoom(this.options.getZoom(), this.options.styleSpec?.opacity),
      );
    }

    this.start();
  }

  set numParticles(numParticles: number) {
    if (numParticles === undefined) {
      return;
    }
    const gl = this.gl;
    // we create a square texture where each pixel will hold a particle position encoded as RGBA
    const particleRes = Math.ceil(Math.sqrt(numParticles));
    this.particleStateResolution = particleRes;
    this.privateNumParticles = particleRes * particleRes;

    const particleState = new Uint8Array(this.privateNumParticles * 4);
    for (let i = 0; i < particleState.length; i++) {
      // randomize the initial particle positions
      particleState[i] = Math.floor(Math.random() * 256);
    }
    // textures to hold the particle state for the current and the next frame
    this.particleStateTexture0 = createTexture(
      gl,
      gl.NEAREST,
      particleState,
      particleRes,
      particleRes,
    );
    this.particleStateTexture1 = createTexture(
      gl,
      gl.NEAREST,
      particleState,
      particleRes,
      particleRes,
    );
    const num = this.privateNumParticles * 6;
    const particleIndices = new Float32Array(num);
    for (let i = 0; i < num; i++) {
      particleIndices[i] = i;
    }
    this.particleIndexBuffer = createBuffer(gl, particleIndices);
  }

  get numParticles() {
    return this.privateNumParticles;
  }

  public updateOptions(options: Partial<IWindOptions>) {
    this.options = {
      ...this.options,
      ...options,
    };

    this.buildColorRamp();

    if (typeof this.options.getZoom === 'function') {
      this.setOpacity(
        createZoom(this.options.getZoom(), this.options.styleSpec?.opacity),
      );
    }
  }

  public setOpacity(opacity: number) {
    this.opacity = opacity;
  }

  public getOpacity() {
    return this.opacity;
  }

  public handleZoom() {
    if (typeof this.options.getZoom === 'function') {
      this.setOpacity(
        createZoom(this.options.getZoom(), this.options.styleSpec?.opacity),
      );
    }
  }

  public buildColorRamp() {
    const { data, colorRange } = createLinearGradient(
      [],
      this.options.styleSpec?.color as any[],
    );

    if (colorRange) {
      this.colorRange = colorRange;
    }

    if (data) {
      this.colorRampTexture = createTexture(
        this.gl,
        this.gl.NEAREST,
        data,
        16,
        16,
      );
    }
  }

  public drawScreen(matrix: number[]) {
    if (this.fbo && this.screenTexture && this.particleStateTexture1) {
      bindFramebuffer(this.gl, this.fbo, this.screenTexture);

      let blendingEnabled = this.gl.isEnabled(this.gl.BLEND);
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      this.drawTexture(
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        this.backgroundTexture,
        this.options.fadeOpacity,
        1,
        false,
      );
      if (!blendingEnabled) {
        this.gl.disable(this.gl.BLEND);
      }

      this.drawParticles();

      bindFramebuffer(this.gl, null);

      blendingEnabled = this.gl.isEnabled(this.gl.BLEND);
      this.gl.disable(this.gl.BLEND);
      this.drawTexture(
        matrix,
        this.screenTexture,
        this.opacity,
        this.fade,
        true,
      );
      if (blendingEnabled) {
        this.gl.enable(this.gl.BLEND);
      }

      [this.backgroundTexture, this.screenTexture] = [
        this.screenTexture,
        this.backgroundTexture,
      ];
    }
  }

  public drawTexture(
    matrix: number[],
    texture: WebGLTexture | null,
    opacity: number,
    fade = 1,
    flag = false,
  ) {
    const depthEnabled = this.gl.isEnabled(this.gl.DEPTH_TEST);
    this.gl.disable(this.gl.DEPTH_TEST);
    this.screenCommand
      .active()
      .resize()
      .setUniforms({
        u_matrix: matrix,
        u_screen: texture,
        u_opacity: opacity,
        u_fade: fade,
      })
      .setAttributes(
        flag
          ? {
              a_pos: {
                buffer: this.data.buffer,
                numComponents: 2,
              },
              a_tex_pos: {
                buffer: this.data.texCoordBuffer,
                numComponents: 2,
              },
            }
          : {
              a_pos: {
                buffer: this.data.backgroundBuffer,
                numComponents: 2,
              },
              a_tex_pos: {
                buffer: this.data.backgroundTexCoordBuffer,
                numComponents: 2,
              },
            },
      )
      .setPrimitive(this.gl.TRIANGLE_STRIP)
      .draw();
    if (depthEnabled) {
      this.gl.enable(this.gl.DEPTH_TEST);
    }
  }

  public updateParticles() {
    if (this.fbo && this.particleStateTexture0 && this.particleStateTexture1) {
      bindFramebuffer(this.gl, this.fbo, this.particleStateTexture0);
      this.updateCommand
        .active()
        .resize(this.particleStateResolution, this.particleStateResolution)
        .setUniforms({
          u_wind_res: [this.data.width, this.data.height],
          u_rand_seed: Math.random(),
          u_wind_range: [
            this.data.uMin,
            this.data.vMin,
            this.data.uMax,
            this.data.vMax,
          ],
          u_drop_rate: this.options.dropRate,
          u_drop_rate_bump: this.options.dropRateBump,
          u_speed_factor: [
            // this.options.speedFactor * 0.0001,
            // this.options.speedFactor * 0.0001,
            0,
            0.0001,
          ],
          u_wind: this.data.texture,
          u_particles: this.particleStateTexture1,
        })
        .setAttributes({
          a_pos: {
            buffer: this.data.quadBuffer,
            numComponents: 2,
          },
        })
        .setPrimitive(this.gl.TRIANGLE_STRIP)
        .draw();
      // swap the particle state textures so the new one becomes the current one
      [this.particleStateTexture0, this.particleStateTexture1] = [
        this.particleStateTexture1,
        this.particleStateTexture0,
      ];
    }
  }

  public drawParticles() {
    if (
      this.particleIndexBuffer &&
      this.particleStateTexture0 &&
      this.particleStateTexture1
    ) {
      const depthEnabled = this.gl.isEnabled(this.gl.DEPTH_TEST);
      const blendingEnabled = this.gl.isEnabled(this.gl.BLEND);
      this.gl.disable(this.gl.DEPTH_TEST);
      this.gl.enable(this.gl.BLEND);
      this.gl.blendEquation(this.gl.FUNC_ADD);
      this.gl.blendFuncSeparate(
        this.gl.SRC_ALPHA,
        this.gl.ONE_MINUS_SRC_ALPHA,
        1,
        1,
      );
      this.drawCommand
        .active()
        .setUniforms({
          u_width: [0.0011, 0.005],
          u_particles_prev: this.particleStateTexture0,
          u_particles_next: this.particleStateTexture1,
          u_particles_res: this.particleStateResolution,
        })
        .setAttributes({
          a_index: {
            buffer: this.particleIndexBuffer,
            numComponents: 1,
          },
        })
        .setPrimitive(this.gl.TRIANGLES)
        .runTimes(this.particleStateResolution ** 2 * 6)
        .draw();

      if (!blendingEnabled) {
        this.gl.disable(this.gl.BLEND);
      }

      if (depthEnabled) {
        this.gl.enable(this.gl.DEPTH_TEST);
      }
    }
  }

  public resize() {
    const gl = this.gl;
    const emptyPixels = new Uint8Array(gl.canvas.width * gl.canvas.height * 4);
    // screen textures to hold the drawn screen for the previous and the current frame
    this.backgroundTexture = createTexture(
      gl,
      gl.NEAREST,
      emptyPixels,
      gl.canvas.width,
      gl.canvas.height,
    );
    this.screenTexture = createTexture(
      gl,
      gl.NEAREST,
      emptyPixels,
      gl.canvas.width,
      gl.canvas.height,
    );
  }

  public start() {
    this.raf.start();
    if (this.options.triggerRepaint) {
      this.options.triggerRepaint();
    }
  }

  public stop() {
    this.raf.stop();
    clearScene(this.gl, [0, 0, 0, 0]);
    if (this.options.triggerRepaint) {
      this.options.triggerRepaint();
    }
  }

  public prerender() {
    this.updateParticles();
  }

  public render(matrix: number[]) {
    this.drawScreen(matrix);
    return this;
  }

  public initializeVertex(coordinates: number[][]) {
    let i = 0;
    const len = coordinates.length;
    const instancePositions = new Float32Array(len * 2);
    for (; i < len; i++) {
      const coords = coordinates[i];
      const mc = this.getMercatorCoordinate(coords as [number, number]);
      instancePositions[i * 2] = mc[0];
      instancePositions[i * 2 + 1] = mc[1];
    }

    return {
      quadBuffer: createBuffer(
        this.gl,
        new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
      ),
      buffer: createBuffer(this.gl, new Float32Array(instancePositions)),
      texCoordBuffer: createBuffer(
        this.gl,
        new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
      ),
      backgroundBuffer: createBuffer(
        this.gl,
        new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]),
      ),
      backgroundTexCoordBuffer: createBuffer(
        this.gl,
        new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]),
      ),
    };
  }

  public getTextureData(data: IImageData): Promise<IData> {
    return new Promise((resolve, reject) => {
      if (data.type === 'image' && data.url) {
        loadImage(data.url)
          .then((image) => {
            const processedData: IData = {
              width: image.width,
              height: image.height,
              texture: createTexture(
                this.gl,
                this.gl.LINEAR,
                image,
                image.width,
                image.height,
              ),
              ...this.initializeVertex(data.extent),
            };

            processedData.uMin = data.uMin;
            processedData.uMax = data.uMax;
            processedData.vMin = data.vMin;
            processedData.vMax = data.vMax;

            resolve(processedData);
          })
          .catch((error) => reject(error));
      }
    });
  }

  public setData(data: IImageData, cb?: (args?: boolean) => void) {
    if (this.gl && data) {
      // Error Prevention
      this.getTextureData(data)
        .then((d) => {
          this.data = d;

          cb && cb(true);

          if (this.data) {
            this.initialize(this.gl);
          }

          if (this.options.triggerRepaint) {
            this.options.triggerRepaint();
          }
        })
        .catch((error) => {
          cb && cb(false);
          console.error(error);
        });
    }
  }

  public getData() {
    return this.data;
  }

  public getMercatorCoordinate([lng, lat]: [number, number]): [number, number] {
    return [lng, lat];
  }

  public destroyed() {
    console.log('destroyed');
  }
}
