import REGL, { DrawCommand, Framebuffer2D, Regl, Texture2D } from 'regl';
import mapboxgl from 'mapbox-gl';
import particleUpdateVert from './shaders/particle-update.vert.glsl';
import particleUpdateFrag from './shaders/particle-update.frag.glsl';
import particleDrawVert from './shaders/particle-draw.vert.glsl';
import globalParticleDrawVert from './shaders/global-particle-draw.vert.glsl';
import particleDrawFrag from './shaders/particle-draw.frag.glsl';
import screenVert from './shaders/screen.vert.glsl';
import screenFrag from './shaders/screen.frag.glsl';

function mod(x, y) {
  return ((x % y) + y) % y;
}

/* eslint-disable @typescript-eslint/no-namespace */
declare namespace UpdateCommand {
  export interface Uniforms {
    u_wind: Texture2D;
    u_particles: Texture2D;
    u_rand_seed: number;
    u_drop_rate: number;
    u_speed_factor: number;
    u_drop_rate_bump: number;
    u_wind_res: REGL.Vec2;
    u_wind_min: REGL.Vec2;
    u_wind_max: REGL.Vec2;
    u_bbox: REGL.Vec4;
    u_data_bbox: REGL.Vec4;
    u_initialize: boolean;
  }

  export interface Attributes {
    a_pos: Float32Array;
  }

  export type Props = Omit<Uniforms & Attributes, 'a_pos'>;
}

declare namespace DrawParticlesCommand {
  export interface Uniforms {
    u_wind: Texture2D;
    u_particles: Texture2D;
    u_particles_next: Texture2D;
    u_color_ramp: Texture2D;
    u_particles_res: REGL.Vec2;
    u_dateline_offset: number;
    u_wind_min: REGL.Vec2;
    u_wind_max: REGL.Vec2;
    u_matrix: REGL.Mat4;
    u_bbox: REGL.Vec4;
    u_data_bbox: REGL.Vec4;
    u_resolution: REGL.Vec2;
    u_aspectRatio: number;
  }

  export interface Attributes {
    a_index: Float32Array;
  }

  export type Props = Omit<Uniforms & Attributes, 'a_index'> & {
    count: number;
  };
}

declare namespace GlobalDrawParticlesCommand {
  export interface Uniforms {
    u_wind: Texture2D;
    u_particles: Texture2D;
    u_particles_next: Texture2D;
    u_color_ramp: Texture2D;
    u_particles_res: REGL.Vec2;
    u_dateline_offset: number;
    u_wind_min: REGL.Vec2;
    u_wind_max: REGL.Vec2;
    u_bbox: REGL.Vec4;
    u_data_bbox: REGL.Vec4;
    u_resolution: REGL.Vec2;
    u_aspectRatio: number;

    u_matrix: REGL.Mat4;
    u_globeToMercMatrix: REGL.Mat4;
    u_globeToMercatorTransition: number;
    u_centerInMerc: REGL.Vec2;
    u_pixelsPerMeterRatio: number;
  }

  export interface Attributes {
    a_index: Float32Array;
  }

  export type Props = Omit<Uniforms & Attributes, 'a_index'> & {
    count: number;
  };
}

declare namespace TextureCommand {
  export interface Uniforms {
    u_screen: Texture2D;
    u_opacity: number;
    u_fade: number;
  }

  export interface Attributes {
    a_pos: Float32Array;
  }

  export type Props = Omit<Uniforms & Attributes, 'a_pos'> & {
    blendEnable: REGL.DynamicVariable<boolean>;
  };
}

interface ParticlesLayerOptions {
  speedFactor: number;
  numParticles: number;
  dropRate: number;
  dropRateBump: number;
  fadeOpacity: number;
}

export default class ParticlesLayer {
  public id: string;
  public type = 'custom';
  public renderingMode: '2d' | '3d' = '2d';
  public options: ParticlesLayerOptions;
  public map: any;
  public windData: any;
  private pointing: boolean;

  private particleStateResolution: number;
  private indexCount: number;
  private regl: Regl;
  private particleStateTexture0: Texture2D;
  private particleStateTexture1: Texture2D;
  private windTexture: Texture2D;
  private backgroundTexture: Texture2D;
  private screenTexture: Texture2D;
  private particleIndexBuffer: Float32Array;
  private quadBuffer: Float32Array;
  private backgroundBuffer: Float32Array;
  private gl: WithUndef<WebGLRenderingContext>;
  private initialized: boolean;
  private updatefbo: Framebuffer2D;
  private commonfbo: Framebuffer2D;
  private updateCommand: DrawCommand;
  private drawCommand: DrawCommand;
  private globalDrawCommand: DrawCommand;
  private textureCommand: DrawCommand;

  #numParticles: number;

  constructor(id: string, options: Partial<ParticlesLayerOptions> = {}) {
    this.id = id;
    this.options = {
      speedFactor: 0.5,
      fadeOpacity: 0.93,
      dropRate: 0.003,
      dropRateBump: 0.002,
      numParticles: 65535,
      ...options,
    };

    this.pointing = false;
  }

  public updateOptions(options: Partial<ParticlesLayerOptions>) {
    this.options = {
      ...this.options,
      ...options,
    };

    this.resize();
  }

  initializeParticles(count) {
    const particleRes = (this.particleStateResolution = Math.ceil(Math.sqrt(count)));
    this.#numParticles = particleRes * particleRes;

    this.indexCount = this.#numParticles * 1;

    const particleState = new Float32Array(this.#numParticles * 4);
    for (let i = 0; i < particleState.length; i++) {
      particleState[i] = Math.floor(Math.random()); // randomize the initial particle positions
    }
    this.particleStateTexture0 = this.regl.texture({
      width: particleRes,
      height: particleRes,
      data: particleState,
      type: 'float',
    });
    this.particleStateTexture1 = this.regl.texture({
      width: particleRes,
      height: particleRes,
      data: particleState,
      type: 'float',
    });

    const particleIndices = new Float32Array(this.indexCount);
    for (let i = 0; i < this.indexCount; i++) {
      particleIndices[i] = i;
    }
    this.particleIndexBuffer = particleIndices;
  }

  setWind(windData) {
    return new Promise(() => {
      const image = new Image();
      image.onload = () => {
        this.windData = Object.assign({}, windData, {
          wind: image,
        });
        if (this.map) {
          this.initialize();
          this.map.triggerRepaint();
        }
      };
      image.src = windData.url;
    });
  }

  onAdd(map, gl: WebGLRenderingContext) {
    this.gl = gl;
    this.regl = REGL({
      gl: this.gl,
      extensions: ['OES_texture_float', 'OES_element_index_uint'],
      attributes: {
        antialias: true,
        preserveDrawingBuffer: false,
      },
    });
    this.map = map;
    if (this.windData) {
      this.initialize();
    }
  }

  initialize() {
    this.updatefbo = this.regl.framebuffer({
      colorType: 'float',
    });
    this.commonfbo = this.regl.framebuffer();
    this.initialized = true;

    this.resize();

    const size = this.getSize();

    this.quadBuffer = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);
    this.backgroundBuffer = new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]);

    this.updateCommand = this.regl<
      UpdateCommand.Uniforms,
      UpdateCommand.Attributes,
      UpdateCommand.Props
    >({
      frag: particleUpdateFrag,
      vert: particleUpdateVert,
      attributes: {
        a_pos: this.quadBuffer,
      },

      uniforms: {
        u_wind: this.regl.prop<UpdateCommand.Props, 'u_wind'>('u_wind'),
        u_particles: this.regl.prop<UpdateCommand.Props, 'u_particles'>('u_particles'),
        u_rand_seed: this.regl.prop<UpdateCommand.Props, 'u_rand_seed'>('u_rand_seed'),
        u_wind_res: this.regl.prop<UpdateCommand.Props, 'u_wind_res'>('u_wind_res'),
        u_drop_rate: this.regl.prop<UpdateCommand.Props, 'u_drop_rate'>('u_drop_rate'),
        u_speed_factor: this.regl.prop<UpdateCommand.Props, 'u_speed_factor'>('u_speed_factor'),
        u_drop_rate_bump: this.regl.prop<UpdateCommand.Props, 'u_drop_rate_bump'>(
          'u_drop_rate_bump',
        ),
        u_wind_min: this.regl.prop<UpdateCommand.Props, 'u_wind_min'>('u_wind_min'),
        u_wind_max: this.regl.prop<UpdateCommand.Props, 'u_wind_max'>('u_wind_max'),
        u_bbox: this.regl.prop<UpdateCommand.Props, 'u_bbox'>('u_bbox'),
        u_data_bbox: this.regl.prop<UpdateCommand.Props, 'u_data_bbox'>('u_data_bbox'),
        u_initialize: this.regl.prop<UpdateCommand.Props, 'u_initialize'>('u_initialize'),
      },

      viewport: () => ({
        width: this.particleStateResolution,
        height: this.particleStateResolution,
      }),

      depth: {
        enable: false,
        mask: true,
        func: 'less',
        range: [0, 1],
      },

      blend: {
        enable: false,
        func: {
          src: 'src alpha',
          dst: 'one minus src alpha',
        },
        color: [0, 0, 0, 0],
      },

      count: 6,
      primitive: 'triangles',
    });
    this.drawCommand = this.regl<
      DrawParticlesCommand.Uniforms,
      DrawParticlesCommand.Attributes,
      DrawParticlesCommand.Props
    >({
      frag: particleDrawFrag,
      vert: particleDrawVert,
      attributes: {
        a_index: this.particleIndexBuffer,
      },

      uniforms: {
        u_wind: this.regl.prop<DrawParticlesCommand.Props, 'u_wind'>('u_wind'),
        u_particles: this.regl.prop<DrawParticlesCommand.Props, 'u_particles'>('u_particles'),
        u_particles_next: this.regl.prop<DrawParticlesCommand.Props, 'u_particles_next'>(
          'u_particles_next',
        ),
        u_color_ramp: this.regl.prop<DrawParticlesCommand.Props, 'u_color_ramp'>('u_color_ramp'),
        u_particles_res: this.regl.prop<DrawParticlesCommand.Props, 'u_particles_res'>(
          'u_particles_res',
        ),
        u_dateline_offset: this.regl.prop<DrawParticlesCommand.Props, 'u_dateline_offset'>(
          'u_dateline_offset',
        ),
        u_wind_min: this.regl.prop<DrawParticlesCommand.Props, 'u_wind_min'>('u_wind_min'),
        u_wind_max: this.regl.prop<DrawParticlesCommand.Props, 'u_wind_max'>('u_wind_max'),
        u_matrix: (_, { u_matrix }) => u_matrix,
        u_bbox: this.regl.prop<DrawParticlesCommand.Props, 'u_bbox'>('u_bbox'),
        u_data_bbox: this.regl.prop<DrawParticlesCommand.Props, 'u_data_bbox'>('u_data_bbox'),
        u_resolution: size as REGL.Vec2,
        u_aspectRatio: size[0] / size[1],
      },

      viewport: () => {
        const sz = this.getSize();
        return {
          width: sz[0],
          height: sz[1],
        };
      },

      depth: {
        enable: false,
        mask: true,
        func: 'less',
        range: [0, 1],
      },

      blend: {
        enable: true,
        func: {
          src: 'src alpha',
          dst: 'one minus src alpha',
        },
        color: [0, 0, 0, 0],
      },

      count: this.regl.prop<DrawParticlesCommand.Props, 'count'>('count'),
      primitive: 'triangles',
      // primitive: "points"
    });

    this.globalDrawCommand = this.regl<
      GlobalDrawParticlesCommand.Uniforms,
      GlobalDrawParticlesCommand.Attributes,
      GlobalDrawParticlesCommand.Props
    >({
      frag: particleDrawFrag,
      vert: globalParticleDrawVert,
      attributes: {
        a_index: this.particleIndexBuffer,
      },

      uniforms: {
        u_wind: this.regl.prop<GlobalDrawParticlesCommand.Props, 'u_wind'>('u_wind'),
        u_particles: this.regl.prop<GlobalDrawParticlesCommand.Props, 'u_particles'>('u_particles'),
        u_particles_next: this.regl.prop<GlobalDrawParticlesCommand.Props, 'u_particles_next'>(
          'u_particles_next',
        ),
        u_color_ramp: this.regl.prop<GlobalDrawParticlesCommand.Props, 'u_color_ramp'>(
          'u_color_ramp',
        ),
        u_particles_res: this.regl.prop<GlobalDrawParticlesCommand.Props, 'u_particles_res'>(
          'u_particles_res',
        ),
        u_dateline_offset: this.regl.prop<GlobalDrawParticlesCommand.Props, 'u_dateline_offset'>(
          'u_dateline_offset',
        ),
        u_wind_min: this.regl.prop<GlobalDrawParticlesCommand.Props, 'u_wind_min'>('u_wind_min'),
        u_wind_max: this.regl.prop<GlobalDrawParticlesCommand.Props, 'u_wind_max'>('u_wind_max'),
        u_matrix: (_, { u_matrix }) => u_matrix,
        u_globeToMercMatrix: (_, { u_globeToMercMatrix }) => u_globeToMercMatrix,
        u_globeToMercatorTransition: (_, { u_globeToMercatorTransition }) =>
          u_globeToMercatorTransition,
        u_centerInMerc: (_, { u_centerInMerc }) => u_centerInMerc,
        u_pixelsPerMeterRatio: (_, { u_pixelsPerMeterRatio }) => u_pixelsPerMeterRatio,
        u_bbox: this.regl.prop<GlobalDrawParticlesCommand.Props, 'u_bbox'>('u_bbox'),
        u_data_bbox: this.regl.prop<GlobalDrawParticlesCommand.Props, 'u_data_bbox'>('u_data_bbox'),
        u_resolution: size as REGL.Vec2,
        u_aspectRatio: size[0] / size[1],
      },

      viewport: () => {
        const sz = this.getSize();
        return {
          width: sz[0],
          height: sz[1],
        };
      },

      depth: {
        enable: false,
        mask: true,
        func: 'less',
        range: [0, 1],
      },

      blend: {
        enable: true,
        func: {
          src: 'src alpha',
          dst: 'one minus src alpha',
        },
        color: [0, 0, 0, 0],
      },

      count: this.regl.prop<GlobalDrawParticlesCommand.Props, 'count'>('count'),
      // primitive: 'triangles',
      primitive: 'points',
    });

    this.textureCommand = this.regl<
      TextureCommand.Uniforms,
      TextureCommand.Attributes,
      TextureCommand.Props
    >({
      frag: screenFrag,
      vert: screenVert,
      attributes: {
        a_pos: this.backgroundBuffer,
      },

      uniforms: {
        u_screen: this.regl.prop<TextureCommand.Props, 'u_screen'>('u_screen'),
        u_opacity: this.regl.prop<TextureCommand.Props, 'u_opacity'>('u_opacity'),
        u_fade: this.regl.prop<TextureCommand.Props, 'u_fade'>('u_fade'),
      },

      depth: {
        enable: false,
        mask: true,
        func: 'less',
        range: [0, 1],
      },

      blend: {
        // @ts-ignore
        enable: this.regl.prop<TextureCommand.Props, 'blendEnable'>('blendEnable'),
        func: {
          src: 'src alpha',
          dst: 'one minus src alpha',
        },
        color: [0, 0, 0, 1],
      },

      viewport: () => {
        const sz = this.getSize();
        return {
          width: sz[0],
          height: sz[1],
        };
      },

      count: 4,
      primitive: 'triangle strip',
    });
    this.windTexture = this.regl.texture(this.windData.wind);
    this.map.on('zoom', this.zoom.bind(this));
    this.map.on('movestart', this.moveStart.bind(this));
    this.map.on('moveend', this.moveEnd.bind(this));
    this.map.on('resize', this.resize.bind(this));
  }

  moveStart() {
    this.pointing = true;
    this.regl.clear({
      color: [0, 0, 0, 0],
      depth: 1,
      stencil: 0,
      framebuffer: this.commonfbo,
    });
    // this.reset(true);
  }

  moveEnd() {
    this.pointing = false;
  }

  getExtent() {
    const bounds = this.map.getBounds().toArray();
    const xmin = bounds[0][0];
    const ymin = bounds[0][1];
    const xmax = bounds[1][0];
    const ymax = bounds[1][1];

    const dx = xmax - xmin;

    const minLng = dx < 360 ? mod(xmin + 180, 360) - 180 : -180;
    let maxLng = 180;
    if (dx < 360) {
      maxLng = mod(xmax + 180, 360) - 180;
      if (maxLng < minLng) {
        maxLng += 360;
      }
    }
    const minLat = Math.max(ymin, this.map.transform.minLat);
    const maxLat = Math.min(ymax, this.map.transform.maxLat);

    const mapBounds = [minLng, minLat, maxLng, maxLat];

    const p0 = mapboxgl.MercatorCoordinate.fromLngLat(
      new mapboxgl.LngLat(mapBounds[0], mapBounds[3]),
    );
    const p1 = mapboxgl.MercatorCoordinate.fromLngLat(
      new mapboxgl.LngLat(mapBounds[2], mapBounds[1]),
    );

    return [p0.x, p0.y, p1.x, p1.y];
  }

  getSize(): number[] {
    return [this.map.transform.width, this.map.transform.height];
  }

  zoom() {
    console.log('zoom');
  }

  reset(flag?: boolean) {
    const size = this.getSize();
    const emptyPixels = new Uint8Array(size[0] * size[1] * 4);
    if (!this.backgroundTexture || flag) {
      this.backgroundTexture = this.regl.texture({
        width: size[0],
        height: size[1],
        data: emptyPixels,
      });
    } else {
      this.backgroundTexture({
        width: size[0],
        height: size[1],
        data: emptyPixels,
      });
    }
    if (!this.screenTexture || flag) {
      this.screenTexture = this.regl.texture({
        width: size[0],
        height: size[1],
        data: emptyPixels,
      });
    } else {
      this.screenTexture({
        width: size[0],
        height: size[1],
        data: emptyPixels,
      });
    }
  }

  resize() {
    this.initializeParticles(this.options.numParticles);
    const size = this.getSize();
    this.reset();
    if (this.commonfbo) {
      this.commonfbo({
        width: size[0],
        height: size[1],
        color: this.screenTexture,
      });
    }
  }

  onRemove(map) {
    this.gl = undefined;
    delete this.map;
    map.off('zoom', this.zoom);
  }

  update() {
    this.updatefbo({
      width: this.particleStateResolution,
      height: this.particleStateResolution,
      color: this.particleStateTexture1,
    });

    this.updatefbo.use(() => {
      this.updateCommand({
        u_wind: this.windTexture,
        u_particles: this.particleStateTexture0,
        u_rand_seed: Math.random(),
        u_wind_res: [this.windData.width, this.windData.height],
        u_speed_factor: [this.options.speedFactor, this.options.speedFactor],
        u_drop_rate: this.options.dropRate,
        u_drop_rate_bump: this.options.dropRateBump,
        u_wind_min: [this.windData.uMin, this.windData.vMin],
        u_wind_max: [this.windData.uMax, this.windData.vMax],
        u_bbox: this.getExtent(),
        u_data_bbox: this.windData.bbox,
        u_initialize: this.initialized,
      });
    });

    this.initialized = false;

    [this.particleStateTexture0, this.particleStateTexture1] = [
      this.particleStateTexture1,
      this.particleStateTexture0,
    ];
  }

  drawTexture(matrix, dateLineOffset, isGlobal, params) {
    const size = this.getSize();
    this.commonfbo({
      width: size[0],
      height: size[1],
      color: this.screenTexture,
    });

    this.commonfbo.use(() => {
      this.textureCommand({
        u_screen: this.backgroundTexture,
        u_opacity: this.options.fadeOpacity || 0.97,
        u_fade: 1,
        blendEnable: false,
      });

      this.drawParticles(matrix, dateLineOffset, isGlobal, params);
    });

    [this.backgroundTexture, this.screenTexture] = [this.screenTexture, this.backgroundTexture];
  }

  drawScreen() {
    this.textureCommand({
      u_screen: this.screenTexture,
      u_opacity: this.options.fadeOpacity || 0.95,
      u_fade: 1,
      blendEnable: true,
    });
  }

  drawParticles(matrix, dateLineOffset, isGlobal, params) {
    if (isGlobal) {
      this.globalDrawCommand({
        u_wind: this.windTexture,
        u_particles: this.particleStateTexture0,
        u_particles_next: this.particleStateTexture1,
        u_particles_res: this.particleStateResolution,
        u_dateline_offset: dateLineOffset,
        u_wind_min: [this.windData.uMin, this.windData.vMin],
        u_wind_max: [this.windData.uMax, this.windData.vMax],
        u_matrix: matrix,
        count: this.indexCount,
        u_bbox: this.getExtent(),
        u_data_bbox: this.windData.bbox,
        u_globeToMercMatrix: params.globeToMercMatrix,
        u_globeToMercatorTransition: params.transition,
        u_centerInMerc: params.centerInMercator,
        u_pixelsPerMeterRatio: params.pixelsPerMeterRatio,
      });
    } else {
      this.drawCommand({
        u_wind: this.windTexture,
        u_particles: this.particleStateTexture0,
        u_particles_next: this.particleStateTexture1,
        u_particles_res: this.particleStateResolution,
        u_dateline_offset: dateLineOffset,
        u_wind_min: [this.windData.uMin, this.windData.vMin],
        u_wind_max: [this.windData.uMax, this.windData.vMax],
        u_matrix: matrix,
        count: this.indexCount,
        u_bbox: this.getExtent(),
        u_data_bbox: this.windData.bbox,
      });
    }

    this.map.triggerRepaint();
  }

  // shouldRerenderTiles() {
  //   // return true only when frame content has changed otherwise, all the terrain
  //   // render cache would be invalidated and redrawn causing huge drop in performance.
  //   return false;
  // }

  prerender(
    gl,
    projectionMatrix,
    projection,
    globeToMercMatrix,
    transition,
    centerInMercator,
    pixelsPerMeterRatio,
  ) {
    if (this.windData) {
      this.regl._refresh();
      this.update();
      if (!this.pointing) {
        this.drawTexture(projectionMatrix, 0, projection && projection.name === 'globe', {
          globeToMercMatrix,
          transition,
          centerInMercator,
          pixelsPerMeterRatio,
        });
      }
    }
  }

  render(
    gl,
    projectionMatrix,
    projection,
    globeToMercMatrix,
    transition,
    centerInMercator,
    pixelsPerMeterRatio,
  ) {
    if (this.windData) {
      if (!this.pointing) {
        this.drawScreen();
      } else {
        this.drawParticles(projectionMatrix, 0, projection && projection.name === 'globe', {
          globeToMercMatrix,
          transition,
          centerInMercator,
          pixelsPerMeterRatio,
        });
      }
    }
  }
}
