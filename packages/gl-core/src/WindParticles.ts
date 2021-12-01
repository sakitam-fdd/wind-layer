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
  resizeFramebuffer,
  resizeTexture,
  updateBufferData,
} from './utils/gl-utils';
import { Raf } from './utils/raf';
import { createLinearGradient, createZoom } from './utils/style-parser';

export interface IWindOptions {
  opacity: number;
  fadeOpacity: number;
  speedFactor: number;
  dropRate: number;
  dropRateBump: number;
  lineWidth: number;
  visible?: boolean;
  styleSpec?: {
    color: any[];
    opacity: number | any[];
    numParticles: number | any[];
  };
  getZoom: () => number;
  triggerRepaint?: () => void;
  getSize: () => [number, number];
  getExtent: () => [number, number, number, number];
  interacting: () => boolean;
  getWorlds: () => number[];
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
  nodata?: number;
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
  nodata?: number;
  texCoordBuffer: WebGLBuffer | null;
  quadBuffer: WebGLBuffer | null;
  buffer: WebGLBuffer | null;
  backgroundBuffer: WebGLBuffer | null;
  backgroundTexCoordBuffer: WebGLBuffer | null;
  texture?: WebGLTexture | null;
}

export const defaultOptions = {
  styleSpec: {
    color: [
      'interpolate',
      ['linear'],
      ['get', 'value'],
      0.0,
      '#fff',
      100.0,
      '#fff',
    ],
    opacity: 1,
    numParticles: 65535,
  },
  opacity: 1,
  lineWidth: 2,
  speedFactor: 1,
  fadeOpacity: 0.93,
  dropRate: 0.003,
  dropRateBump: 0.002,
};

let uid = 0;

export default class WindParticles {
  public gl: WebGLRenderingContext;

  public data: IData;

  private privateNumParticles: number;

  private particleStateResolution: number;

  private currentParticleStateTexture: WebGLTexture | null;

  private nextParticleStateTexture: WebGLTexture | null;

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
  private colorRange: [number, number];
  private size: number[];
  private renderExtent: number[];
  private visible: boolean;
  private alpha: number;

  private frameTime: number;
  private lastTime: number;
  private readonly uid: string;
  constructor(
    gl: WebGLRenderingContext,
    // tslint:disable-next-line:no-object-literal-type-assertion
    options: IWindOptions = {} as IWindOptions,
  ) {
    this.gl = gl;

    this.uid = `WindParticles_${uid}`;
    uid++;

    if (!this.gl) {
      throw new Error('initialize error');
    }

    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.opacity = this.options.opacity || 1;
    this.visible = this.options.visible !== undefined || true;
    this.alpha = 0.9;
    this.frameTime = 0;
    this.lastTime = 0;

    this.initialize(this.gl);
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

    if (typeof this.options.getZoom === 'function') {
      const zoom = this.options.getZoom();
      this.setOpacity(
        createZoom(this.uid, zoom, 'opacity', this.options.styleSpec),
      );

      this.numParticles = createZoom(
        this.uid,
        zoom,
        'numParticles',
        this.options.styleSpec,
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
    if (!this.currentParticleStateTexture) {
      // textures to hold the particle state for the current and the next frame
      this.currentParticleStateTexture = createTexture(
        gl,
        gl.NEAREST,
        particleState,
        particleRes,
        particleRes,
      );
    } else {
      resizeTexture(
        gl,
        this.currentParticleStateTexture,
        particleRes,
        particleRes,
        particleState,
      );
    }
    if (!this.nextParticleStateTexture) {
      this.nextParticleStateTexture = createTexture(
        gl,
        gl.NEAREST,
        particleState,
        particleRes,
        particleRes,
      );
    } else {
      resizeTexture(
        gl,
        this.nextParticleStateTexture,
        particleRes,
        particleRes,
        particleState,
      );
    }
    const num = this.privateNumParticles * 6;
    const particleIndices = new Float32Array(num);
    for (let i = 0; i < num; i++) {
      particleIndices[i] = i;
    }
    if (!this.particleIndexBuffer) {
      this.particleIndexBuffer = createBuffer(gl, particleIndices);
    } else {
      updateBufferData(gl, this.particleIndexBuffer, particleIndices);
    }
  }

  get numParticles() {
    return this.privateNumParticles;
  }

  public updateOptions(options: Partial<IWindOptions>) {
    const styleSpec = (options.styleSpec || {}) as {
      color: any[];
      opacity: number | any[];
      numParticles: number | any[];
    };
    this.options = {
      ...this.options,
      ...options,
      styleSpec: {
        ...this.options.styleSpec,
        ...styleSpec,
      },
    };

    this.buildColorRamp();

    if (typeof this.options.getZoom === 'function') {
      const zoom = this.options.getZoom();
      this.setOpacity(
        createZoom(this.uid, zoom, 'opacity', this.options.styleSpec, true),
      );

      this.numParticles = createZoom(
        this.uid,
        zoom,
        'numParticles',
        this.options.styleSpec,
        true,
      );
    }
  }

  public setOpacity(opacity: number) {
    this.opacity = opacity;
  }

  public getOpacity() {
    return this.opacity;
  }

  public handleMoveend() {
    this.updateRenderState();
    clearScene(this.gl, [0, 0, 0, 0]);
  }

  public handleMovestart() {
    this.alpha = 0.0;
  }

  public handleZoom() {
    if (typeof this.options.getZoom === 'function') {
      const zoom = this.options.getZoom();
      this.setOpacity(
        createZoom(this.uid, zoom, 'opacity', this.options.styleSpec),
      );

      this.numParticles = createZoom(
        this.uid,
        zoom,
        'numParticles',
        this.options.styleSpec,
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

  public drawTexture(matrix: number[]) {
    if (this.fbo && this.screenTexture && this.nextParticleStateTexture) {
      bindFramebuffer(this.gl, this.fbo, this.screenTexture);

      const depthEnabled = this.gl.isEnabled(this.gl.DEPTH_TEST);
      const blendingEnabled = this.gl.isEnabled(this.gl.BLEND);
      this.gl.disable(this.gl.DEPTH_TEST);
      this.gl.disable(this.gl.BLEND);
      this.screenCommand
        .active()
        .resize(...this.size)
        .setUniforms({
          u_screen: this.backgroundTexture,
          u_opacity: this.options.fadeOpacity,
          u_fade: 1,
        })
        .setAttributes({
          a_pos: {
            buffer: this.data.backgroundBuffer,
            numComponents: 2,
          },
          a_tex_pos: {
            buffer: this.data.backgroundTexCoordBuffer,
            numComponents: 2,
          },
        })
        .setPrimitive(this.gl.TRIANGLE_STRIP)
        .draw();
      if (depthEnabled) {
        this.gl.enable(this.gl.DEPTH_TEST);
      }
      if (blendingEnabled) {
        this.gl.enable(this.gl.BLEND);
      }

      this.drawParticles(matrix);

      bindFramebuffer(this.gl, null);

      [this.backgroundTexture, this.screenTexture] = [
        this.screenTexture,
        this.backgroundTexture,
      ];
    }
  }

  public drawScreen() {
    const depthEnabled = this.gl.isEnabled(this.gl.DEPTH_TEST);
    const blendingEnabled = this.gl.isEnabled(this.gl.BLEND);
    this.gl.disable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendColor(0, 0, 0, 0);
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
    this.screenCommand
      .active()
      .resize()
      .setUniforms({
        u_screen: this.screenTexture,
        u_opacity: this.visible ? this.opacity : 0,
        u_fade: this.alpha,
      })
      .setAttributes({
        a_pos: {
          buffer: this.data.buffer,
          numComponents: 2,
        },
        a_tex_pos: {
          buffer: this.data.texCoordBuffer,
          numComponents: 2,
        },
      })
      .setPrimitive(this.gl.TRIANGLE_STRIP)
      .draw();
    if (depthEnabled) {
      this.gl.enable(this.gl.DEPTH_TEST);
    }
    if (!blendingEnabled) {
      this.gl.disable(this.gl.BLEND);
    }
  }

  public updateParticles() {
    if (
      this.fbo &&
      this.currentParticleStateTexture &&
      this.nextParticleStateTexture
    ) {
      bindFramebuffer(this.gl, this.fbo, this.nextParticleStateTexture);
      const timeScale = this.options.speedFactor * 2.5;
      const depthEnabled = this.gl.isEnabled(this.gl.DEPTH_TEST);
      const blendingEnabled = this.gl.isEnabled(this.gl.BLEND);
      this.gl.disable(this.gl.DEPTH_TEST);
      this.gl.disable(this.gl.BLEND);
      this.updateCommand
        .active()
        .resize(this.particleStateResolution, this.particleStateResolution)
        .setUniforms({
          u_wind_res: [this.data.width, this.data.height],
          u_rand_seed: Math.random(),
          u_wind_range: [
            this.data.uMin,
            this.data.uMax,
            this.data.vMin,
            this.data.vMax,
          ],
          u_drop_rate: this.options.dropRate,
          u_drop_rate_bump: this.options.dropRateBump,
          u_speed_factor: [
            (timeScale * this.frameTime) / this.size[0],
            (timeScale * this.frameTime) / this.size[1],
          ],
          u_wind: this.data.texture,
          u_bbox: this.renderExtent,
          nodata: this.data.nodata,
          u_particles: this.currentParticleStateTexture,
        })
        .setAttributes({
          a_pos: {
            buffer: this.data.quadBuffer,
            numComponents: 2,
          },
        })
        .setPrimitive(this.gl.TRIANGLE_STRIP)
        .draw();
      if (depthEnabled) {
        this.gl.enable(this.gl.DEPTH_TEST);
      }
      if (blendingEnabled) {
        this.gl.enable(this.gl.BLEND);
      }
      // bindFramebuffer(this.gl, null);
      // swap the particle state textures so the new one becomes the current one
      [this.currentParticleStateTexture, this.nextParticleStateTexture] = [
        this.nextParticleStateTexture,
        this.currentParticleStateTexture,
      ];
    }
  }

  public drawParticles(matrix: number[]) {
    if (
      this.particleIndexBuffer &&
      this.currentParticleStateTexture &&
      this.nextParticleStateTexture
    ) {
      const depthEnabled = this.gl.isEnabled(this.gl.DEPTH_TEST);
      const blendingEnabled = this.gl.isEnabled(this.gl.BLEND);
      this.gl.disable(this.gl.DEPTH_TEST);
      this.gl.disable(this.gl.BLEND);
      const zoom = this.options.getZoom();
      const worlds = this.options.getWorlds();
      for (let i = 0; i < worlds.length; i++) {
        this.drawCommand
          .active()
          .setUniforms({
            u_width: this.options.lineWidth,
            u_world: this.size,
            u_matrix: matrix,
            u_zoom: zoom,
            u_bbox: this.renderExtent,
            u_offset: worlds[i],
            u_wind: this.data.texture,
            u_wind_res: [this.data.width, this.data.height],
            u_wind_range: [
              this.data.uMin,
              this.data.uMax,
              this.data.vMin,
              this.data.vMax,
            ],
            u_color_ramp: this.colorRampTexture,
            u_color_range: this.colorRange,
            u_aspectRatio: this.size[0] / this.size[1],
            u_particles_current: this.currentParticleStateTexture,
            u_particles_next: this.nextParticleStateTexture,
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
      }

      if (blendingEnabled) {
        this.gl.enable(this.gl.BLEND);
      }

      if (depthEnabled) {
        this.gl.enable(this.gl.DEPTH_TEST);
      }
    }
  }

  public updateRenderState() {
    this.renderExtent = this.options.getExtent();
  }

  public resize() {
    const gl = this.gl;
    this.size = this.options.getSize();
    this.updateRenderState();
    const emptyPixels = new Uint8Array(this.size[0] * this.size[1] * 4);
    // screen textures to hold the drawn screen for the previous and the current frame
    if (!this.backgroundTexture) {
      this.backgroundTexture = createTexture(
        gl,
        gl.NEAREST,
        emptyPixels,
        this.size[0],
        this.size[1],
      );
    } else {
      resizeTexture(
        gl,
        this.backgroundTexture,
        this.size[0],
        this.size[1],
        emptyPixels,
      );
    }
    if (!this.screenTexture) {
      this.screenTexture = createTexture(
        gl,
        gl.NEAREST,
        emptyPixels,
        this.size[0],
        this.size[1],
      );
    } else {
      resizeTexture(
        gl,
        this.screenTexture,
        this.size[0],
        this.size[1],
        emptyPixels,
      );
    }
    if (this.fbo) {
      resizeFramebuffer(
        gl,
        this.fbo,
        this.size[0],
        this.size[1],
        this.screenTexture as any,
      );
    }
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

  public prerender(matrix: number[]) {
    if (this.data) {
      this.updateParticles();
      this.drawTexture(matrix);

      const now = 0.001 * Date.now();
      this.frameTime = Math.min(now - (this.lastTime || 0), 0.05);
      this.lastTime = now;
    }
  }

  public render() {
    if (this.data) {
      if (this.options.interacting()) {
        if (this.alpha < 1) {
          this.alpha += 3 * this.frameTime;

          if (this.alpha > 1 || !this.frameTime) {
            this.alpha = 1;
          }
        }
      }
      this.drawScreen();
    }
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
      buffer: createBuffer(this.gl, instancePositions),
      texCoordBuffer: createBuffer(
        this.gl,
        new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
      ),
      backgroundBuffer: createBuffer(
        this.gl,
        new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
      ),
      backgroundTexCoordBuffer: createBuffer(
        this.gl,
        new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
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
              nodata: data.nodata || 0,
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

  public destroyData() {
    if (this.data) {
      const {
        texture,
        quadBuffer,
        buffer,
        texCoordBuffer,
        backgroundBuffer,
        backgroundTexCoordBuffer,
      } = this.data;
      if (texture) {
        this.gl.deleteTexture(texture);
      }
      if (buffer) {
        this.gl.deleteBuffer(buffer);
      }
      if (quadBuffer) {
        this.gl.deleteBuffer(quadBuffer);
      }

      if (texCoordBuffer) {
        this.gl.deleteBuffer(texCoordBuffer);
      }
      if (backgroundBuffer) {
        this.gl.deleteBuffer(backgroundBuffer);
      }
      if (backgroundTexCoordBuffer) {
        this.gl.deleteBuffer(backgroundTexCoordBuffer);
      }
      // @ts-ignore
      delete this.data;
    }
  }

  public destroyed() {
    this.stop();
    if (this.currentParticleStateTexture) {
      this.gl.deleteTexture(this.currentParticleStateTexture);
      this.currentParticleStateTexture = null;
    }
    if (this.nextParticleStateTexture) {
      this.gl.deleteTexture(this.nextParticleStateTexture);
      this.nextParticleStateTexture = null;
    }

    if (this.backgroundTexture) {
      this.gl.deleteTexture(this.backgroundTexture);
      this.backgroundTexture = null;
    }
    if (this.screenTexture) {
      this.gl.deleteTexture(this.screenTexture);
      this.screenTexture = null;
    }

    if (this.fbo) {
      this.gl.deleteFramebuffer(this.fbo);
      this.fbo = null;
    }
    this.destroyData();
  }
}
